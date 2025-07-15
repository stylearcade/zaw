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

fn multiply4x4Float32Single(a: []const f32, b: []const f32, result: []f32) void {
    // Load B matrix columns as SIMD vectors
    const b_col0 = simd.Vec(f32){ b[0], b[1], b[2], b[3] };
    const b_col1 = simd.Vec(f32){ b[4], b[5], b[6], b[7] };
    const b_col2 = simd.Vec(f32){ b[8], b[9], b[10], b[11] };
    const b_col3 = simd.Vec(f32){ b[12], b[13], b[14], b[15] };

    // Process each row of A matrix using comptime loop unrolling
    inline for (0..4) |row| {
        const base_idx = row * 4;

        // Create splat vectors for each element in the row
        const a0_splat: simd.Vec(f32) = @splat(a[base_idx + 0]);
        const a1_splat: simd.Vec(f32) = @splat(a[base_idx + 1]);
        const a2_splat: simd.Vec(f32) = @splat(a[base_idx + 2]);
        const a3_splat: simd.Vec(f32) = @splat(a[base_idx + 3]);

        // Compute the matrix multiplication for this row
        const row_result = a0_splat * b_col0 + a1_splat * b_col1 + a2_splat * b_col2 + a3_splat * b_col3;

        // Store the results
        inline for (0..4) |col| {
            result[base_idx + col] = row_result[col];
        }
    }
}

export fn multiply4x4Float32() i32 {
    var input = interop.getInput();
    var output = interop.getOutput();

    const a_matrices = input.readArray(f32);
    const b_matrices = input.readArray(f32);
    const num_matrices = a_matrices.len / 16;

    var result_matrices = output.allocateArray(f32, a_matrices.len);

    for (0..num_matrices) |i| {
        const start_idx = i * 16;
        const end_idx = start_idx + 16;

        const a_matrix = a_matrices[start_idx..end_idx];
        const b_matrix = b_matrices[start_idx..end_idx];
        const r_matrix = result_matrices[start_idx..end_idx];

        multiply4x4Float32Single(a_matrix, b_matrix, r_matrix);
    }

    return OK;
}
