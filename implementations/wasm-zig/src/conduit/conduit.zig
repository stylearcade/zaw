const std = @import("std");
const builtin = @import("builtin");

fn getStorage(comptime T: type, storage: []u64) []T {
    const ptr: [*]T = @ptrCast(@alignCast(storage.ptr));

    return ptr[0 .. storage.len * @sizeOf(u64) / @sizeOf(T)];
}

fn alignUp(offset: u32, comptime bytes: u8) u32 {
    const mask = bytes - 1;

    return (offset + mask) & ~@as(u32, mask);
}

/// Internal channel for managing typed storage arrays and offset tracking.
///
/// The Channel maintains separate typed views of the same underlying memory buffer,
/// allowing efficient access to different primitive types while ensuring proper alignment.
const Channel = struct {
    const Self = @This();

    _offset: u32 = 0,
    _storageUint8: []u8,
    _storageUint32: []u32,
    _storageInt32: []i32,
    _storageFloat32: []f32,
    _storageFloat64: []f64,

    /// Creates a new Channel from 8-byte aligned storage.
    ///
    /// Reinterprets the u64 storage as different primitive type arrays.
    ///
    /// Args:
    ///     storage8byteAligned: A slice of u64 values providing the backing memory
    ///
    /// Returns:
    ///     A new Channel instance with typed storage views
    pub fn from(storage8byteAligned: []u64) Self {
        return Self{
            ._storageUint8 = getStorage(u8, storage8byteAligned),
            ._storageUint32 = getStorage(u32, storage8byteAligned),
            ._storageInt32 = getStorage(i32, storage8byteAligned),
            ._storageFloat32 = getStorage(f32, storage8byteAligned),
            ._storageFloat64 = getStorage(f64, storage8byteAligned),
        };
    }

    /// Checks if the current offset is within bounds.
    ///
    /// Panics if the offset has exceeded the buffer capacity.
    fn checkOffset(self: *Self) void {
        if (self._offset >= self._storageUint8.len) {
            @branchHint(.cold);
            @panic("Channel out of bounds");
        }
    }

    /// Resets the channel offset to the beginning of the buffer.
    ///
    /// This allows reusing the same buffer for multiple operations.
    pub fn reset(self: *Self) void {
        self._offset = 0;
    }

    /// Returns the typed storage array for the given type.
    ///
    /// Args:
    ///     T: The primitive type (u8, u32, i32, f32, or f64)
    ///
    /// Returns:
    ///     A slice of the appropriate type viewing the underlying storage
    pub inline fn storage(self: *const Self, comptime T: type) []T {
        switch (T) {
            u8 => return self._storageUint8,
            u32 => return self._storageUint32,
            i32 => return self._storageInt32,
            f32 => return self._storageFloat32,
            f64 => return self._storageFloat64,
            else => @compileError("Invalid type, expected u8, i32, u32, f32 or f64"),
        }
    }

    /// Aligns the current offset to the requirements of type T.
    ///
    /// Args:
    ///     T: The type to align for
    pub inline fn alignTo(self: *Self, comptime T: type) void {
        self._offset = alignUp(self._offset, @sizeOf(T));
        self.checkOffset();
    }

    /// Gets the properly aligned offset for type T as an array index.
    ///
    /// Args:
    ///     T: The type to get the offset for
    ///
    /// Returns:
    ///     The array index for the current position in the typed storage
    pub inline fn getOffset(self: *Self, comptime T: type) u32 {
        switch (T) {
            u8 => {
                return self._offset;
            },
            u32, i32, f32 => {
                self.alignTo(T);

                return self._offset >> 2;
            },
            f64 => {
                self.alignTo(T);

                return self._offset >> 3;
            },
            else => @compileError("Invalid type, expected u8, i32, u32, f32 or f64"),
        }
    }

    /// Advances the channel offset by the specified number of elements of type T.
    ///
    /// Args:
    ///     T: The type of elements being advanced over
    ///     count: The number of elements to advance by
    pub inline fn advance(self: *Self, comptime T: type, count: u32) void {
        switch (T) {
            u8 => self._offset += count,
            u32, i32, f32 => self._offset += count * 4,
            f64 => self._offset += count * 8,
            else => @compileError("Invalid type, expected u8, i32, u32, f32 or f64"),
        }

        self.checkOffset();
    }
};

/// A zero-allocation writer for the communication channel.
///
/// The Writer provides type-safe methods to write primitive values and arrays to a shared
/// memory buffer. It maintains proper alignment for different data types and tracks
/// the current offset position.
///
/// Example:
/// ```zig
/// var storage = [_]u64{0} ** 1024;
/// var writer = Writer.from(&storage);
///
/// writer.write(u32, 42);
/// writer.write(f64, 3.14159);
///
/// const array = [_]i32{1, 2, 3, 4};
/// writer.copyArray(i32, &array);
/// ```
pub const Writer = struct {
    const Self = @This();

    channel: Channel,

    /// Creates a new Writer from a slice of u64 storage.
    ///
    /// The storage must be 8-byte aligned and will be reinterpreted as different
    /// primitive types as needed.
    ///
    /// Args:
    ///     storage: A slice of u64 values to use as the backing buffer
    ///
    /// Returns:
    ///     A new Writer instance ready to write data
    pub fn from(storage: []u64) Self {
        return .{ .channel = Channel.from(storage) };
    }

    /// Resets the writer to the beginning of the buffer.
    ///
    /// This allows reusing the same buffer for multiple write operations.
    pub fn reset(self: *Self) void {
        self.channel.reset();
    }

    /// Writes a value of type T to the channel.
    ///
    /// For usize values, they are converted to u32 before writing.
    ///
    /// Args:
    ///     T: The type of value to write (u8, u32, i32, f32, f64, or usize)
    ///     value: The value to write
    pub fn write(self: *Self, comptime T: type, value: T) void {
        if (T == usize) {
            self.write(u32, @intCast(value));
        } else {
            self.channel.storage(T)[self.channel.getOffset(T)] = value;
            self.channel.advance(T, 1);
        }
    }

    /// Initializes space for a single value of type T in the channel.
    ///
    /// Returns a mutable pointer to the initialized space.
    ///
    /// Args:
    ///     T: The type of value to initialize space for
    ///
    /// Returns:
    ///     A mutable pointer to the initialized value
    pub fn init(self: *Self, comptime T: type) *T {
        const offset = self.channel.getOffset(T);
        const ptr = &self.channel.storage(T)[offset];
        self.channel.advance(T, 1);
        return ptr;
    }

    /// Initializes space for array elements of type T without writing a length prefix.
    ///
    /// Args:
    ///     T: The type of elements to initialize space for
    ///     length: The number of elements to initialize
    ///
    /// Returns:
    ///     A mutable slice of the initialized elements
    pub fn initElements(self: *Self, comptime T: type, length: u32) []T {
        const start = self.channel.getOffset(T);

        self.channel.advance(T, length);

        return self.channel.storage(T)[start .. start + length];
    }

    /// Initializes space for an array of type T with a length prefix.
    ///
    /// Writes the array length as u32 followed by initializing space for the elements.
    ///
    /// Args:
    ///     T: The type of elements to initialize space for
    ///     length: The number of elements to initialize
    ///
    /// Returns:
    ///     A mutable slice of the initialized elements
    pub fn initArray(self: *Self, comptime T: type, length: u32) []T {
        self.write(u32, length);

        return self.initElements(T, length);
    }

    /// Copies array elements of type T to the channel without a length prefix.
    ///
    /// Args:
    ///     T: The type of elements to copy
    ///     arr: The slice of elements to copy
    pub fn copyElements(self: *Self, comptime T: type, arr: []T) void {
        const start = self.channel.getOffset(T);

        @memcpy(self.channel.storage(T)[start .. start + arr.len], arr);

        self.channel.advance(T, @intCast(arr.len));
    }

    /// Copies an array of type T to the channel with a length prefix.
    ///
    /// Writes the array length as u32 followed by all array elements.
    ///
    /// Args:
    ///     T: The type of elements to copy
    ///     arr: The slice of elements to copy
    pub fn copyArray(self: *Self, comptime T: type, arr: []T) void {
        self.write(u32, @intCast(arr.len));
        self.copyElements(T, arr);
    }

    /// Checks if the current writer state is valid.
    ///
    /// Returns:
    ///     An error if the channel would overflow
    pub fn check(self: *Self) !void {
        const storage = self.channel.storage(u8);
        const offset = self.channel.getOffset(u8);

        if (offset > storage.len) {
            return error.ChannelPointerOverflow;
        }
    }
};

/// A zero-allocation reader for the communication channel.
///
/// The Reader provides type-safe methods to read primitive values and arrays from a shared
/// memory buffer. It maintains proper alignment for different data types and tracks
/// the current offset position.
///
/// Example:
/// ```zig
/// var storage = [_]u64{0} ** 1024;
/// var reader = Reader.from(&storage);
///
/// const value = reader.read(u32);
/// const pi = reader.read(f64);
///
/// const array = reader.readArray(i32);
/// ```
pub const Reader = struct {
    const Self = @This();

    channel: Channel,

    /// Creates a new Reader from a slice of u64 storage.
    ///
    /// The storage must be 8-byte aligned and will be reinterpreted as different
    /// primitive types as needed.
    ///
    /// Args:
    ///     storage: A slice of u64 values to use as the backing buffer
    ///
    /// Returns:
    ///     A new Reader instance ready to read data
    pub fn from(storage: []u64) Self {
        return .{ .channel = Channel.from(storage) };
    }

    /// Resets the reader to the beginning of the buffer.
    ///
    /// This allows reusing the same buffer for multiple read operations.
    pub fn reset(self: *Self) void {
        self.channel.reset();
    }

    /// Reads a value of type T from the channel.
    ///
    /// Args:
    ///     T: The type of value to read (u8, u32, i32, f32, or f64)
    ///
    /// Returns:
    ///     The value read from the channel
    pub fn read(self: *Self, comptime T: type) T {
        const result = self.channel.storage(T)[self.channel.getOffset(T)];

        self.channel.advance(T, 1);

        return result;
    }

    /// Reads array elements of type T from the channel without a length prefix.
    ///
    /// Args:
    ///     T: The type of elements to read
    ///     length: The number of elements to read
    ///
    /// Returns:
    ///     A slice of the elements read from the channel
    pub fn readElements(self: *Self, comptime T: type, length: u32) []T {
        const start = self.channel.getOffset(T);

        self.channel.advance(T, length);

        return self.channel.storage(T)[start .. start + length];
    }

    /// Reads an array of type T from the channel with a length prefix.
    ///
    /// First reads the array length as u32, then reads that many elements.
    ///
    /// Args:
    ///     T: The type of elements to read
    ///
    /// Returns:
    ///     A slice of the elements read from the channel
    pub fn readArray(self: *Self, comptime T: type) []T {
        const length = self.read(u32);

        return self.readElements(T, length);
    }

    /// Reads multiple arrays of type T from the channel.
    ///
    /// Each array is read with its length prefix.
    ///
    /// Args:
    ///     T: The type of elements in each array
    ///     dest: A slice of slices to store the read arrays
    pub fn readArrays(self: *Self, comptime T: type, dest: [][]T) void {
        var i: u32 = 0;

        while (i < dest.len) : (i += 1) {
            dest[i] = self.readArray(T);
        }
    }
};
