use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn xor_array_i32(values: &[i32], scalar: i32) -> Vec<i32> {
    let mut result = vec![0i32; values.len()];
    shared::xor_array_i32(values, scalar, &mut result);
    result
}

#[wasm_bindgen]
pub fn sum_array_f64(values: &[f64]) -> f64 {
    shared::sum_array_f64(values)
}

#[wasm_bindgen]
pub fn multiply_4x4_f32(a_matrices: &[f32], b_matrices: &[f32]) -> Vec<f32> {
    let mut results = vec![0.0f32; a_matrices.len()];
    shared::multiply_4x4_f32(a_matrices, b_matrices, &mut results);
    results
}
