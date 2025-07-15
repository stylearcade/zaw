const std = @import("std");

const zaw = @import("zaw");

const interop = zaw.interop;
const Error = interop.Error;
const OK = interop.OK;
const Stack = interop.Stack;

const simd = zaw.simd;
const Vec = simd.Vec;

// Setup all required WASM interop exports
comptime {
    zaw.setupInterop();
}

fn _throwErrorWithStack() !void {
    Stack.push(@src());
    defer Stack.pop();

    return Error.fromFormat(@src(), "Example error message with data: {d} {d} {d}", .{ 1, 2, 3 });
}

export fn throwErrorWithStack() i32 {
    Stack.entry(@src());
    defer Stack.pop();

    return Error.handle(_throwErrorWithStack);
}

export fn usefulPanic() i32 {
    Stack.entry(@src());
    defer Stack.pop();

    Error.panicFormat(@src(), "Example useful panic message with data: {any}", .{ .key = "value" });

    return OK;
}

export fn echo() i32 {
    var input = interop.getInput();

    const msg = input.readArray(u8);

    interop.logf("{s} from zig", .{msg});

    return OK;
}

export fn xorInt32Array() i32 {
    var input = interop.getInput();
    var output = interop.getOutput();

    const values = input.readArray(i32);
    const len = values.len;
    const lanes = simd.getLanes(i32);
    const batchSize = lanes * 4;

    var acc: [4]Vec(i32) = .{
        simd.initVec(i32),
        simd.initVec(i32),
        simd.initVec(i32),
        simd.initVec(i32),
    };
    var i: usize = 0;

    while (i + batchSize <= len) : (i += batchSize) {
        const offset = values[i..];

        acc[0] ^= simd.sliceToVec(i32, offset);
        acc[1] ^= simd.sliceToVec(i32, offset[lanes..]);
        acc[2] ^= simd.sliceToVec(i32, offset[lanes * 2 ..]);
        acc[3] ^= simd.sliceToVec(i32, offset[lanes * 3 ..]);
    }

    while (i + lanes <= len) : (i += lanes) {
        acc[0] ^= simd.sliceToVec(i32, values[i..]);
    }

    var total: i32 = 0;

    for (0..lanes) |x| total ^= acc[0][x] ^ acc[1][x] ^ acc[2][x] ^ acc[3][x];

    if (i < len) {
        for (values[i..len]) |x| total ^= x;
    }

    output.write(i32, total);

    return OK;
}

export fn sumFloat64Array() i32 {
    var input = interop.getInput();
    var output = interop.getOutput();

    const values = input.readArray(f64);
    const len = values.len;
    const lanes = simd.getLanes(f64);
    const batchSize = lanes * 4;

    var acc: [4]Vec(f64) = .{
        simd.initVec(f64),
        simd.initVec(f64),
        simd.initVec(f64),
        simd.initVec(f64),
    };
    var i: usize = 0;

    while (i + batchSize <= len) : (i += batchSize) {
        const offset = values[i..];

        acc[0] += simd.sliceToVec(f64, offset);
        acc[1] += simd.sliceToVec(f64, offset[lanes..]);
        acc[2] += simd.sliceToVec(f64, offset[lanes * 2 ..]);
        acc[3] += simd.sliceToVec(f64, offset[lanes * 3 ..]);
    }

    while (i + lanes <= len) : (i += lanes) {
        acc[0] += simd.sliceToVec(f64, values[i..]);
    }

    var total: f64 = 0;

    for (0..lanes) |x| total += acc[0][x] + acc[1][x] + acc[2][x] + acc[3][x];

    if (i < len) {
        for (values[i..len]) |x| total += x;
    }

    output.write(f64, total);

    return OK;
}

fn multiply_4x4_f32_single(a: []const f32, b: []const f32, result: []f32) void {
    result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

    result[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    result[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    result[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    result[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

    result[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    result[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    result[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    result[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

    result[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    result[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    result[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    result[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
}

pub fn multiply4x4Float32() i32 {
    var input = interop.getInput();
    var output = interop.getOutput();

    const values = input.readArrays(f32);
    const a_matrices = values[0];
    const b_matrices = values[1];
    const num_matrices = a_matrices.len / 16;

    var result_matrices = []f32;

    for (0..num_matrices) |i| {
        const start_idx = i * 16;
        const end_idx = start_idx + 16;

        const a_matrix = a_matrices[start_idx..end_idx];
        const b_matrix = b_matrices[start_idx..end_idx];
        const r_matrix = result_matrices[start_idx..end_idx];

        multiply_4x4_f32_single(a_matrix, b_matrix, r_matrix);
    }

    output.write([]f32, result_matrices);
    return OK;
}
