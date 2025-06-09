const std = @import("std");
const externs = @import("externs.zig");

var logStorage = [_]u8{0} ** 2048;

pub fn getLogPtr() i32 {
    return @intCast(@intFromPtr(&logStorage));
}

pub fn log(msg: []const u8) void {
    const len = @min(msg.len, logStorage.len - 1);
    @memcpy(logStorage[0..len], msg[0..len]);
    logStorage[len] = 0;
    externs.hostLog();
}

pub fn logf(comptime fmt: []const u8, args: anytype) void {
    const data = std.fmt.bufPrint(logStorage[0..], fmt, args) catch unreachable;
    logStorage[data.len] = 0;
    externs.hostLog();
}
