import fs from 'fs'
import path from 'path'
import init, { xor_array_i32, transfer_in_float64_array, transfer_out_float64_array, multiply_4x4_f32 } from './pkg/wasm_api_bindgen'

export type Module = {
  xorInt32Array: (values: Int32Array, scalar: number) => Int32Array
  transferInFloat64Array: (values: Float64Array) => number
  transferOutFloat64Array: (value: number, count: number) => Float64Array
  multiply4x4Float32: (left: Float32Array, right: Float32Array) => Float32Array
}

export async function initRustBindgen(): Promise<Module> {
  const buffer = fs.readFileSync(path.join(__dirname, './pkg/wasm_api_bindgen_bg.wasm'))

  await init({ module_or_path: buffer })

  return {
    xorInt32Array: xor_array_i32,
    transferInFloat64Array: transfer_in_float64_array,
    transferOutFloat64Array: transfer_out_float64_array,
    multiply4x4Float32: multiply_4x4_f32,
  }
}
