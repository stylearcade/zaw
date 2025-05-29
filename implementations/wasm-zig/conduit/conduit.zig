const builtin = @import("builtin");

fn getStorage(comptime T: type, storage: []u64) []T {
    const ptr: [*]T = @alignCast(@ptrCast(storage.ptr));

    return ptr[0 .. storage.len * @sizeOf(u64) / @sizeOf(T)];
}

fn alignUp(offset: u32, comptime bytes: u8) u32 {
    const mask = bytes - 1;

    return (offset + mask) & ~mask;
}

const Channel = struct {
    const Self = @This();

    _offset: u32 = 0,
    _storageUint8: []u8,
    _storageUint32: []u32,
    _storageInt32: []i32,
    _storageFloat32: []f32,
    _storageFloat64: []f64,

    pub fn from(storage8byteAligned: []u64) Self {
        return Self{
            ._storageUint8 = getStorage(u8, storage8byteAligned),
            ._storageUint32 = getStorage(u32, storage8byteAligned),
            ._storageInt32 = getStorage(i32, storage8byteAligned),
            ._storageFloat32 = getStorage(f32, storage8byteAligned),
            ._storageFloat64 = getStorage(f64, storage8byteAligned),
        };
    }

    pub fn reset(self: *Self) void {
        self._offset = 0;
    }

    pub inline fn storage(self: *const Self, comptime T: type) []T {
        switch (T) {
            u8 => return self._storageUint8,
            u32 => return self._storageUint32,
            i32 => return self._storageInt32,
            f32 => return self._storageFloat32,
            f64 => return self._storageFloat64,
            else => @compileError("Invalid type, expected u8, i32, u32 or f64"),
        }
    }

    pub inline fn alignTo(self: *Self, comptime T: type) void {
        self._offset = alignUp(self._offset, @sizeOf(T));
    }

    pub inline fn offset(self: *Self, comptime T: type) u32 {
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
            else => @compileError("Invalid type, expected u8, i32, u32 or f64"),
        }
    }

    pub inline fn advance(self: *Self, comptime T: type, count: u32) void {
        switch (T) {
            u8 => self._offset += count,
            u32, i32, f32 => self._offset += count * 4,
            f64 => self._offset += count * 8,
            else => @compileError("Invalid type, expected u8, i32, u32 or f64"),
        }
    }
};

pub const Writer = struct {
    const Self = @This();

    channel: Channel,

    pub fn from(storage: []u64) Self {
        return .{ .channel = Channel.from(storage) };
    }

    pub fn reset(self: *Self) void {
        self.channel.reset();
    }

    pub fn write(self: *Self, comptime T: type, value: T) void {
        if (T == usize) {
            self.write(u32, @intCast(value));
        } else {
            self.channel.storage(T)[self.channel.offset(T)] = value;
            self.channel.advance(T, 1);
        }
    }

    pub fn allocate(self: *Self, comptime T: type) *T {
        const offset = self.channel.offset(T);
        const ptr = &self.channel.storage(T)[offset];
        self.channel.advance(T, 1);
        return ptr;
    }

    pub fn allocateElements(self: *Self, comptime T: type, length: u32) []T {
        const start = self.channel.offset(T);

        self.channel.advance(T, length);

        return self.channel.storage(T)[start .. start + length];
    }

    pub fn allocateArray(self: *Self, comptime T: type, length: u32) []T {
        self.write(u32, length);

        return self.allocateElements(T, length);
    }

    pub fn copyElements(self: *Self, comptime T: type, arr: []T) void {
        const start = self.channel.offset(T);

        @memcpy(self.channel.storage(T)[start .. start + arr.len], arr);

        self.channel.advance(T, @intCast(arr.len));
    }

    pub fn copyArray(self: *Self, comptime T: type, arr: []T) void {
        self.write(u32, @intCast(arr.len));
        self.copyElements(T, arr);
    }

    pub fn check(self: *Self) !void {
        const storage = self.channel.storage(u8);
        const offset = self.channel.offset(u8);

        if (offset > storage.len) {
            return error.ChannelPointerOverflow;
        }
    }
};

pub const Reader = struct {
    const Self = @This();

    channel: Channel,

    pub fn from(storage: []u64) Self {
        return .{ .channel = Channel.from(storage) };
    }

    pub fn reset(self: *Self) void {
        self.channel.reset();
    }

    pub fn read(self: *Self, comptime T: type) T {
        const result = self.channel.storage(T)[self.channel.offset(T)];

        self.channel.advance(T, 1);

        return result;
    }

    pub fn readElements(self: *Self, comptime T: type, length: u32) []T {
        const start = self.channel.offset(T);

        self.channel.advance(T, length);

        return self.channel.storage(T)[start .. start + length];
    }

    pub fn readArray(self: *Self, comptime T: type) []T {
        const length = self.read(u32);

        return self.readElements(T, length);
    }

    pub fn readArrays(self: *Self, comptime T: type, dest: [][]T) void {
        var i: u32 = 0;

        while (i < dest.len) : (i += 1) {
            dest[i] = self.readArray(T);
        }
    }
};
