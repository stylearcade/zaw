const builtin = @import("builtin");

pub usingnamespace if (builtin.target.cpu.arch == .wasm32) struct {
    pub extern fn hostLog() void;
} else struct {
    pub fn hostLog() void {}
};
