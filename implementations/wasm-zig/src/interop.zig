const std = @import("std");

const conduit = @import("./conduit.zig");

pub const Error = @import("./interop/error.zig");
pub const OK = Error.OK;

pub const Stack = @import("./interop/stack.zig");

const logModule = @import("./interop/log.zig");
pub const log = logModule.log;
pub const logf = logModule.logf;

var input: conduit.Reader = undefined;
var output: conduit.Writer = undefined;

pub fn getErrorPtr() callconv(.C) i32 {
    return Error.getErrorPtr();
}

pub fn getLogPtr() callconv(.C) i32 {
    return logModule.getLogPtr();
}

pub fn allocateInputChannel(sizeInBytes: i32) callconv(.C) i32 {
    const sizeInU64s = @divExact(@as(usize, @intCast(sizeInBytes)), 8);
    const storage = std.heap.wasm_allocator.alloc(u64, sizeInU64s) catch @panic("Failed to allocate input channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    input = conduit.Reader.from(storage);

    return pointer;
}

pub fn allocateOutputChannel(sizeInBytes: i32) callconv(.C) i32 {
    const sizeInU64s = @divExact(@as(usize, @intCast(sizeInBytes)), 8);
    const storage = std.heap.wasm_allocator.alloc(u64, sizeInU64s) catch @panic("Failed to allocate output channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    output = conduit.Writer.from(storage);

    return pointer;
}

pub fn getInput() conduit.Reader {
    input.reset();

    return input;
}

pub fn getOutput() conduit.Writer {
    output.reset();

    return output;
}
