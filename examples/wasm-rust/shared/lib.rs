#[cfg(target_arch = "wasm32")]
use std::arch::wasm32::*;

pub fn xor_array_i32(values: &Vec<i32>) -> i32 {
    let mut total = 0i32;

    unsafe {
        let len = values.len();

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
                let ptr = values.as_ptr().add(i) as *const v128;
                let v0 = v128_load(ptr);
                let v1 = v128_load(ptr.add(1));
                let v2 = v128_load(ptr.add(2));
                let v3 = v128_load(ptr.add(3));

                acc[0] = v128_xor(acc[0], v0);
                acc[1] = v128_xor(acc[1], v1);
                acc[2] = v128_xor(acc[2], v2);
                acc[3] = v128_xor(acc[3], v3);
            i += BATCH_SIZE;
        }

        // Handle any remaining full SIMD chunks
        while i + LANES <= len {
                let ptr = values.as_ptr().add(i) as *const v128;
                let v = v128_load(ptr);
                acc[0] = v128_xor(acc[0], v);
            i += LANES;
        }

        // Reduce the four SIMD accumulators into a scalar total via XOR of each lane

        for &vec in &acc {
            total ^= i32x4_extract_lane::<0>(vec);
            total ^= i32x4_extract_lane::<1>(vec);
            total ^= i32x4_extract_lane::<2>(vec);
            total ^= i32x4_extract_lane::<3>(vec);
        }

        // Handle any remaining scalar tail elements
        while i < len {
            total ^= values[i];
            i += 1;
        }
    }

    total
}

pub fn sum_array_f64(values: &Vec<f64>) -> f64 {
    let mut total = 0.0;

    unsafe {
        let len = values.len();

        const LANES: usize = 2; // f64x2 has 2 lanes
        const BATCH_SIZE: usize = LANES * 4; // Process 4 SIMD vectors per iteration

        // Multiple accumulators for instruction-level parallelism
        let mut acc = [f64x2_splat(0.0); 4];
        let mut i = 0;

        // Process batches of 4 SIMD vectors
        while i + BATCH_SIZE <= len {
            // Load directly into SIMD registers from memory
            let ptr = values.as_ptr().add(i);
            let v0 = v128_load(ptr as *const v128);
            let v1 = v128_load(ptr.add(LANES) as *const v128);
            let v2 = v128_load(ptr.add(LANES * 2) as *const v128);
            let v3 = v128_load(ptr.add(LANES * 3) as *const v128);

            // Add to independent accumulators (enables pipelining)
            acc[0] = f64x2_add(acc[0], v0);
            acc[1] = f64x2_add(acc[1], v1);
            acc[2] = f64x2_add(acc[2], v2);
            acc[3] = f64x2_add(acc[3], v3);
            i += BATCH_SIZE;
        }

        // Handle remaining SIMD-sized chunks
        while i + LANES <= len {
                let ptr = values.as_ptr().add(i);
                let v = v128_load(ptr as *const v128);
                acc[0] = f64x2_add(acc[0], v);
            i += LANES;
        }

        // Sum all accumulators

        for j in 0..4 {
            total += f64x2_extract_lane::<0>(acc[j]) + f64x2_extract_lane::<1>(acc[j]);
        }

        // Handle remaining scalar elements
        while i < len {
            total += *values.get_unchecked(i);
            i += 1;
        }
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

pub fn multiply_4x4_f32(
    a_matrices: &Vec<f32>,
    b_matrices: &Vec<f32>,
    result_matrices: &mut Vec<f32>
) {
    let num_matrices = a_matrices.len() / 16;

    // Process each pair of matrices
    for i in 0..num_matrices {
        let start_idx = i * 16;
        let end_idx = start_idx + 16;

        let a_matrix = &a_matrices[start_idx..end_idx];
        let b_matrix = &b_matrices[start_idx..end_idx];
        let r_matrix = &mut result_matrices[start_idx..end_idx];

        multiply_4x4_f32_single(a_matrix, b_matrix, r_matrix);
    }
}
