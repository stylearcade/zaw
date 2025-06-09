const std = @import("std");
const assert = std.debug.assert;

// Fixed-lane SIMD operations optimized for WASM

const WASM_SIMD_BYTES = 128 / 8;

pub fn getLanes(comptime T: type) comptime_int {
    const size = @sizeOf(T);

    switch (size) {
        1, 2, 4, 8 => {
            return WASM_SIMD_BYTES / size;
        },
        else => {
            @compileError("incompatible element type");
        },
    }
}

pub fn Vec(comptime T: type) type {
    return @Vector(getLanes(T), T);
}

pub fn initVec(comptime T: type) Vec(T) {
    switch (getLanes(T)) {
        2 => return .{ 0, 0 },
        4 => return .{ 0, 0, 0, 0 },
        8 => return .{ 0, 0, 0, 0, 0, 0, 0, 0 },
        16 => return .{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
        else => @compileError("incompatible element type"),
    }
}

pub fn sliceToVec(comptime T: type, slice: []T) Vec(T) {
    const lanes = getLanes(T);

    assert(slice.len >= lanes);

    const ptr: *const [lanes]T = @ptrCast(slice.ptr);
    const arr: [lanes]T = ptr.*;

    return arr;
}
