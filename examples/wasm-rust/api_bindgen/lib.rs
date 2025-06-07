use wasm_bindgen::prelude::*;
use js_sys::Int32Array;
use js_sys::Float32Array;
use js_sys::Float64Array;

#[wasm_bindgen]
pub fn xor_array_i32(values: &Int32Array) -> i32 {
    let vec = values.to_vec();

    return shared::xor_array_i32(&vec);
}

#[wasm_bindgen]
pub fn sum_array_f64(values: &Float64Array) -> f64 {
    let vec = values.to_vec();

    return shared::sum_array_f64(&vec);
}

#[wasm_bindgen]
pub fn multiply_4x4_f32(
    a_matrices: &Float32Array,
    b_matrices: &Float32Array
) -> Result<Float32Array, JsValue> {
    let a_data: Vec<f32> = a_matrices.to_vec();
    let b_data: Vec<f32> = b_matrices.to_vec();
    let mut results = vec![0.0f32; a_data.len()];

    shared::multiply_4x4_f32(&a_data, &b_data, &mut results);

    Ok(Float32Array::from(&results[..]))
}
