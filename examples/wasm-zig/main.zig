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
