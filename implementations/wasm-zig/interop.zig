const std = @import("std");

const conduit = @import("./conduit.zig");

pub const Error = @import("./interop/error.zig");
pub const OK = Error.OK;

pub const Stack = @import("./interop/stack.zig");

const logModule = @import("./interop/log.zig");
pub const log = logModule.log;
pub const logStr = logModule.logStr;

var input: conduit.Reader = undefined;
var output: conduit.Writer = undefined;

fn getErrorPtr() callconv(.C) i32 {
    return Error.getErrorPtr();
}

fn getLogPtr() callconv(.C) i32 {
    return logModule.getLogPtr();
}

fn allocateInputChannel(size: i32) callconv(.C) i32 {
    const storage = std.heap.wasm_allocator.alloc(u64, @intCast(size)) catch @panic("Failed to allocate input channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    input = conduit.Reader.from(storage);

    return pointer;
}

fn allocateOutputChannel(size: i32) callconv(.C) i32 {
    const storage = std.heap.wasm_allocator.alloc(u64, @intCast(size)) catch @panic("Failed to allocate output channel storage");
    const pointer: i32 = @intCast(@intFromPtr(storage.ptr));

    output = conduit.Writer.from(storage);

    return pointer;
}

pub inline fn setupExports() void {
    comptime {
        @export(&getErrorPtr, .{ .name = "getErrorPtr", .linkage = .strong });
        @export(&getLogPtr, .{ .name = "getLogPtr", .linkage = .strong });
        @export(&allocateInputChannel, .{ .name = "allocateInputChannel", .linkage = .strong });
        @export(&allocateOutputChannel, .{ .name = "allocateOutputChannel", .linkage = .strong });
    }
}

pub fn getInput() conduit.Reader {
    input.reset();

    return input;
}

pub fn getOutput() conduit.Writer {
    output.reset();

    return output;
}
