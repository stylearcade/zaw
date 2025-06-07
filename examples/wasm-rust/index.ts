import fs from 'fs'
import path from 'path'
import init, { xor_array_i32, sum_array_f64, multiply_4x4_f32 } from './api_bindgen/pkg/wasm_api_bindgen'

export type Module = {
  xorInt32Array: (values: Int32Array) => number
  sumFloat64Array: (values: Float64Array) => number
  multiply4x4Float32: (left: Float32Array, right: Float32Array) => Float32Array
}

export async function initRustBindgen(): Promise<Module> {
  const buffer = fs.readFileSync(path.join(__dirname, './api_bindgen/pkg/wasm_api_bindgen_bg.wasm'))

  await init({ module_or_path: buffer })

  return {
    xorInt32Array: xor_array_i32,
    sumFloat64Array: sum_array_f64,
    multiply4x4Float32: multiply_4x4_f32,
  }
}
