const std = @import("std");

const conduit = @import("./conduit.zig");

pub const Error = @import("./interop/error.zig");
pub const OK = Error.OK;

pub const Stack = @import("./interop/stack.zig");

const logModule = @import("./interop/log.zig");
pub const log = logModule.log;
pub const logf = logModule.logf;

// (null until the host allocates each channel: an export reading one
// before then stops with a panic, never reads memory never written)
var input: ?conduit.Reader = null;
var output: ?conduit.Writer = null;

pub fn getErrorPtr() callconv(.c) i32 {
    return Error.getErrorPtr();
}

pub fn getLogPtr() callconv(.c) i32 {
    return logModule.getLogPtr();
}

pub fn allocateInputChannel(sizeInBytes: i32) callconv(.c) i32 {
    const sizeInU64s = @divExact(@as(usize, @intCast(sizeInBytes)), 8);
    const storage = std.heap.wasm_allocator.alloc(u64, sizeInU64s) catch @panic("Failed to allocate input channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    input = conduit.Reader.from(storage);

    return pointer;
}

pub fn allocateOutputChannel(sizeInBytes: i32) callconv(.c) i32 {
    const sizeInU64s = @divExact(@as(usize, @intCast(sizeInBytes)), 8);
    const storage = std.heap.wasm_allocator.alloc(u64, sizeInU64s) catch @panic("Failed to allocate output channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    output = conduit.Writer.from(storage);

    return pointer;
}

pub fn getInput() conduit.Reader {
    const in = &(input orelse @panic("input channel not allocated"));
    in.reset();

    return in.*;
}

pub fn getOutput() conduit.Writer {
    const out = &(output orelse @panic("output channel not allocated"));
    out.reset();

    return out.*;
}
