const std = @import("std");
const builtin = @import("builtin");

var stack: [20]std.builtin.SourceLocation = undefined;
var stackPos: u31 = stack.len;

pub fn get() []std.builtin.SourceLocation {
    return stack[stackPos..];
}

pub fn push(src: std.builtin.SourceLocation) void {
    if (builtin.mode == .Debug) {
        if (stackPos > 0) {
            stackPos -= 1;
            stack[stackPos] = src;
        }
    }
}

pub fn pop() void {
    if (builtin.mode == .Debug) {
        stackPos += 1;
    }
}

pub fn entry(src: std.builtin.SourceLocation) void {
    if (builtin.mode == .Debug) {
        stackPos = stack.len - 1;
        stack[stackPos] = src;
    }
}
