const std = @import("std");
const builtin = @import("builtin");

fn alignUp(offset: u32, comptime bytes: u8) u32 {
    const mask = bytes - 1;

    return (offset + mask) & ~@as(u32, mask);
}

/// The channel's memory: one byte buffer (8-byte aligned) and the offset
/// of the next value. Reshaped for verification (safe-zig, 2026-10-31):
/// no whole-buffer views of other types. Each value or array is a region
/// carved at the offset (aligned to its type) and seen as that one type
/// only; the offset only grows, so what was handed out is exactly the
/// bytes below it. The bytes in memory are the same as before.
const Channel = struct {
    const Self = @This();

    _offset: u32 = 0,
    _bytes: []align(8) u8,

    pub fn from(storage8byteAligned: []u64) Self {
        return .{ ._bytes = std.mem.sliceAsBytes(storage8byteAligned) };
    }

    pub fn reset(self: *Self) void {
        self._offset = 0;
    }

    /// The whole buffer as bytes (tests).
    pub inline fn storage(self: *const Self, comptime T: type) []T {
        if (T != u8) @compileError("the channel is read as bytes only; values through `region`");
        return self._bytes;
    }

    /// `count` values of `T` at the offset (aligned up to `T`'s size),
    /// the offset moved past them; past the buffer's end, a panic.
    pub inline fn region(self: *Self, comptime T: type, count: u32) []T {
        switch (T) {
            u8, u32, i32, f32, f64 => {},
            else => @compileError("Invalid type, expected u8, i32, u32, f32 or f64"),
        }
        const start = alignUp(self._offset, @sizeOf(T));
        const end = @as(u64, start) + @as(u64, count) * @sizeOf(T);
        if (end > self._bytes.len) {
            @branchHint(.cold);
            @panic("Channel out of bounds");
        }
        self._offset = @intCast(end);
        const bytes: []align(@alignOf(T)) u8 = @alignCast(self._bytes[start..@intCast(end)]);
        return std.mem.bytesAsSlice(T, bytes);
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
/// var storage: [1024]u64 = @splat(0);
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
            self.channel.region(T, 1)[0] = value;
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
        return &self.channel.region(T, 1)[0];
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
        return self.channel.region(T, length);
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
        @memcpy(self.channel.region(T, @intCast(arr.len)), arr);
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
        if (self.channel._offset > self.channel._bytes.len) {
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
/// var storage: [1024]u64 = @splat(0);
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
        return self.channel.region(T, 1)[0];
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
        return self.channel.region(T, length);
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
