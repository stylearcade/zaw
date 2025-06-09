pub const conduit = @import("conduit.zig");
pub const interop = @import("interop.zig");
pub const simd = @import("simd.zig");

/// Sets up all required WASM exports for the zaw interop layer.
/// Call this in a comptime block to export the required functions.
pub inline fn setupInterop() void {
    comptime {
        @export(&interop.getErrorPtr, .{ .name = "getErrorPtr", .linkage = .strong });
        @export(&interop.getLogPtr, .{ .name = "getLogPtr", .linkage = .strong });
        @export(&interop.allocateInputChannel, .{ .name = "allocateInputChannel", .linkage = .strong });
        @export(&interop.allocateOutputChannel, .{ .name = "allocateOutputChannel", .linkage = .strong });
    }
}
