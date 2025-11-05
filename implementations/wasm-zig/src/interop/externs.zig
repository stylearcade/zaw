const builtin = @import("builtin");

// Allow no-op non-externs in native mode to enable IDE test runs
const impl = if (builtin.target.cpu.arch == .wasm32) struct {
    pub extern fn hostLog() void;
} else struct {
    pub fn hostLog() void {}
};

pub const hostLog = impl.hostLog;
