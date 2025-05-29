use wasm_bindgen::prelude::*;
use js_sys::Int32Array;
use js_sys::Float32Array;
use js_sys::Float64Array;
use std::arch::wasm32::*;

#[wasm_bindgen]
pub fn xor_array_i32(values: &Int32Array) -> i32 {
    // Convert to a Rust Vec<i32>
    let data: Vec<i32> = values.to_vec();
    let len = data.len();

    const LANES: usize = 4;         // i32x4 has 4 lanes
    const BATCH_SIZE: usize = LANES * 4; // process 4 SIMD vectors per loop

    // Four independent accumulators for ILP
    let mut acc: [v128; 4] = [
        i32x4_splat(0),
        i32x4_splat(0),
        i32x4_splat(0),
        i32x4_splat(0),
    ];
    let mut i = 0;

    // Process in batches of 4 vectors
    while i + BATCH_SIZE <= len {
        unsafe {
            let ptr = data.as_ptr().add(i) as *const v128;
            let v0 = v128_load(ptr);
            let v1 = v128_load(ptr.add(1));
            let v2 = v128_load(ptr.add(2));
            let v3 = v128_load(ptr.add(3));

            acc[0] = v128_xor(acc[0], v0);
            acc[1] = v128_xor(acc[1], v1);
            acc[2] = v128_xor(acc[2], v2);
            acc[3] = v128_xor(acc[3], v3);
        }
        i += BATCH_SIZE;
    }

    // Handle any remaining full SIMD chunks
    while i + LANES <= len {
        unsafe {
            let ptr = data.as_ptr().add(i) as *const v128;
            let v = v128_load(ptr);
            acc[0] = v128_xor(acc[0], v);
        }
        i += LANES;
    }

    // Reduce the four SIMD accumulators into a scalar total via XOR of each lane
    let mut total = 0i32;
    for &vec in &acc {
        total ^= i32x4_extract_lane::<0>(vec);
        total ^= i32x4_extract_lane::<1>(vec);
        total ^= i32x4_extract_lane::<2>(vec);
        total ^= i32x4_extract_lane::<3>(vec);
    }

    // Handle any remaining scalar tail elements
    while i < len {
        total ^= data[i];
        i += 1;
    }

    total
}

#[wasm_bindgen]
pub fn sum_array_f64(values: &Float64Array) -> f64 {
    // Standard wasm-bindgen conversion to Vec
    let data: Vec<f64> = values.to_vec();
    let len = data.len();

    const LANES: usize = 2; // f64x2 has 2 lanes
    const BATCH_SIZE: usize = LANES * 4; // Process 4 SIMD vectors per iteration

    // Multiple accumulators for instruction-level parallelism
    let mut acc = [f64x2_splat(0.0); 4];
    let mut i = 0;

    // Process batches of 4 SIMD vectors
    while i + BATCH_SIZE <= len {
        unsafe {
            // Load directly into SIMD registers from memory
            let ptr = data.as_ptr().add(i);
            let v0 = v128_load(ptr as *const v128);
            let v1 = v128_load(ptr.add(LANES) as *const v128);
            let v2 = v128_load(ptr.add(LANES * 2) as *const v128);
            let v3 = v128_load(ptr.add(LANES * 3) as *const v128);

            // Add to independent accumulators (enables pipelining)
            acc[0] = f64x2_add(acc[0], v0);
            acc[1] = f64x2_add(acc[1], v1);
            acc[2] = f64x2_add(acc[2], v2);
            acc[3] = f64x2_add(acc[3], v3);
        }
        i += BATCH_SIZE;
    }

    // Handle remaining SIMD-sized chunks
    while i + LANES <= len {
        unsafe {
            let ptr = data.as_ptr().add(i);
            let v = v128_load(ptr as *const v128);
            acc[0] = f64x2_add(acc[0], v);
        }
        i += LANES;
    }

    // Sum all accumulators
    let mut total = 0.0;
    for j in 0..4 {
        total += f64x2_extract_lane::<0>(acc[j]) + f64x2_extract_lane::<1>(acc[j]);
    }

    // Handle remaining scalar elements
    while i < len {
        unsafe {
            total += *data.get_unchecked(i);
        }
        i += 1;
    }

    total
}

fn multiply_4x4_f32_single(a: &[f32], b: &[f32], result: &mut [f32]) {
    result[0]  = a[0]*b[0]  + a[1]*b[4]  + a[2]*b[8]   + a[3]*b[12];
    result[1]  = a[0]*b[1]  + a[1]*b[5]  + a[2]*b[9]   + a[3]*b[13];
    result[2]  = a[0]*b[2]  + a[1]*b[6]  + a[2]*b[10]  + a[3]*b[14];
    result[3]  = a[0]*b[3]  + a[1]*b[7]  + a[2]*b[11]  + a[3]*b[15];

    result[4]  = a[4]*b[0]  + a[5]*b[4]  + a[6]*b[8]   + a[7]*b[12];
    result[5]  = a[4]*b[1]  + a[5]*b[5]  + a[6]*b[9]   + a[7]*b[13];
    result[6]  = a[4]*b[2]  + a[5]*b[6]  + a[6]*b[10]  + a[7]*b[14];
    result[7]  = a[4]*b[3]  + a[5]*b[7]  + a[6]*b[11]  + a[7]*b[15];

    result[8]  = a[8]*b[0]  + a[9]*b[4]  + a[10]*b[8]  + a[11]*b[12];
    result[9]  = a[8]*b[1]  + a[9]*b[5]  + a[10]*b[9]  + a[11]*b[13];
    result[10] = a[8]*b[2]  + a[9]*b[6]  + a[10]*b[10] + a[11]*b[14];
    result[11] = a[8]*b[3]  + a[9]*b[7]  + a[10]*b[11] + a[11]*b[15];

    result[12] = a[12]*b[0] + a[13]*b[4] + a[14]*b[8]  + a[15]*b[12];
    result[13] = a[12]*b[1] + a[13]*b[5] + a[14]*b[9]  + a[15]*b[13];
    result[14] = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14];
    result[15] = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15];
}

#[wasm_bindgen]
pub fn multiply_4x4_f32(
    a_matrices: &Float32Array,
    b_matrices: &Float32Array
) -> Result<Float32Array, JsValue> {
    let a_data: Vec<f32> = a_matrices.to_vec();
    let b_data: Vec<f32> = b_matrices.to_vec();

    let num_matrices = a_data.len() / 16;
    let mut results = vec![0.0f32; a_data.len()];

    // Process each pair of matrices
    for i in 0..num_matrices {
        let start_idx = i * 16;
        let end_idx = start_idx + 16;

        let a_matrix = &a_data[start_idx..end_idx];
        let b_matrix = &b_data[start_idx..end_idx];
        let r_matrix = &mut results[start_idx..end_idx];

        multiply_4x4_f32_single(a_matrix, b_matrix, r_matrix);
    }

    Ok(Float32Array::from(&results[..]))
}
