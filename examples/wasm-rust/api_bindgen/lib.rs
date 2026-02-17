use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn xor_array_i32(values: &[i32], scalar: i32) -> Vec<i32> {
    let mut result = vec![0i32; values.len()];
    shared::xor_array_i32(values, scalar, &mut result);
    result
}

#[wasm_bindgen]
pub fn transfer_in_float64_array(values: &[f64]) -> u32 {
    values.len() as u32
}

#[wasm_bindgen]
pub fn transfer_out_float64_array(value: f64, count: u32) -> Vec<f64> {
    vec![value; count as usize]
}

#[wasm_bindgen]
pub fn multiply_4x4_f32(a_matrices: &[f32], b_matrices: &[f32]) -> Vec<f32> {
    let mut results = vec![0.0f32; a_matrices.len()];
    shared::multiply_4x4_f32(a_matrices, b_matrices, &mut results);
    results
}
