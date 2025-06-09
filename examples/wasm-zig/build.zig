const std = @import("std");
const Builder = std.Build;
const builtin = @import("builtin");

const number_of_pages = 2;

pub fn build(b: *Builder) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .cpu_features_add = std.Target.wasm.featureSet(&.{.simd128}),
        .os_tag = .freestanding,
    });
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "main",
        .root_source_file = b.path("./main.zig"),
        .target = target,
        .optimize = optimize,
        .version = .{ .major = 0, .minor = 0, .patch = 1 },
    });

    exe.root_module.addImport("zaw", b.addModule("zaw", .{ .root_source_file = b.path("../../implementations/wasm-zig/src/zaw.zig") }));

    // <https://github.com/ziglang/zig/issues/8633>
    exe.global_base = 6560;
    exe.entry = .disabled;
    exe.rdynamic = true;
    exe.import_memory = true;
    exe.stack_size = std.wasm.page_size;

    b.installArtifact(exe);
}
