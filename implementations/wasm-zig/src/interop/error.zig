const std = @import("std");
const builtin = @import("builtin");
const Stack = @import("./stack.zig");

var errStorage = [_]u8{0} ** 256;

pub const OK: i32 = 0;
pub const ERROR: i32 = 1;

pub fn getErrorPtr() i32 {
    return @intCast(@intFromPtr(&errStorage));
}

var cursor: usize = 0;

fn _startWriting() void {
    cursor = 0; // first position holds length
}

fn _writeFormat(comptime fmt: []const u8, args: anytype) void {
    Stack.push(@src());
    defer Stack.pop();

    const data = std.fmt.bufPrint(errStorage[cursor..], fmt, args) catch unreachable;

    cursor += data.len;

    if (cursor < errStorage.len) {
        errStorage[cursor] = 0;
    }
}

fn _writeMessage(msg: []const u8) void {
    _writeFormat("{s}", .{msg});
}

fn _writeSrc(src: std.builtin.SourceLocation) void {
    _writeFormat("\n    at {s}:{d}", .{ src.file, src.line });
}

fn _writeStack() void {
    for (Stack.get()) |stackSrc| {
        _writeSrc(stackSrc);
    }
}

fn writeMessage(src: std.builtin.SourceLocation, msg: []const u8) void {
    _startWriting();
    _writeMessage(msg);
    _writeSrc(src);
    _writeStack();
}

fn writeFormat(src: std.builtin.SourceLocation, comptime fmt: []const u8, args: anytype) void {
    _startWriting();
    _writeFormat(fmt, args);
    _writeSrc(src);
    _writeStack();
}

fn writeError(src: std.builtin.SourceLocation, err: anyerror) void {
    _startWriting();
    _writeFormat("{s}", .{@errorName(err)});
    _writeSrc(src);
    _writeStack();
}

pub fn handlePanic(msg: []const u8, addr: ?usize) noreturn {
    _ = addr;
    _startWriting();
    _writeMessage(msg);
    _writeStack();
    @trap();
}

pub fn fromMessage(src: std.builtin.SourceLocation, comptime msg: []const u8) anyerror {
    writeMessage(src, msg);

    return error.Custom;
}

pub fn fromFormat(src: std.builtin.SourceLocation, comptime fmt: []const u8, args: anytype) anyerror {
    writeFormat(src, fmt, args);

    return error.Custom;
}

pub fn fromAny(src: std.builtin.SourceLocation, err: anyerror) anyerror {
    writeError(src, err);

    return error.Custom;
}

pub fn serialize(src: std.builtin.SourceLocation, result: anyerror) i32 {
    if (result != error.Custom) {
        writeError(src, result);
    }

    return ERROR;
}

pub fn serializeMessage(src: std.builtin.SourceLocation, comptime msg: []const u8) i32 {
    return serialize(src, fromMessage(src, msg));
}

pub fn serializeFormat(src: std.builtin.SourceLocation, comptime fmt: []const u8, args: anytype) i32 {
    return serialize(src, fromFormat(src, fmt, args));
}

pub fn handle(func: fn () anyerror!void) i32 {
    func() catch |err| return serialize(@src(), err);

    return OK;
}

pub fn panicFormat(src: std.builtin.SourceLocation, comptime fmt: []const u8, args: anytype) void {
    writeFormat(src, fmt, args);
    @trap();
}

pub fn panic(src: std.builtin.SourceLocation, comptime msg: []const u8) void {
    panicFormat(src, msg, .{});
}

pub fn assert(src: std.builtin.SourceLocation, value: bool, comptime fmt: []const u8, args: anytype) void {
    if (!value) {
        if (builtin.mode == .Debug) {
            panicFormat(src, fmt, args);
        } else {
            @trap();
        }
    }
}
