# `zaw`

## Zero Allocation WASM @ <a href="https://stylearcade.com" target="_blank">Style Arcade</a>

The purpose of `zaw` is to make it easier to achieve the original promise of WebAssembly:

**High-performance, low-overhead acceleration for targeted code - without rewriting your entire application.**

### 🎯 The upshot

With `zaw`, you'll be able to offload individual algorithms, rather than entire modules, and keep your WebAssembly code lean and simple - truly unlocking the original vision of the WebAssembly founding team.

### 🚀 Performance

**Up to 7x faster than pure JavaScript and 2.5x faster than wasm-bindgen for XOR Int32Array Bench**

| Element Count | Winner | vs `zaw`    | vs `js`     | vs `wasm-bindgen` |
| ------------- | ------ | ----------- | ----------- | ----------------- |
| 10            | `js`   | 1.9x faster | -           | 4.2x faster       |
| 100           | `zaw`  | -           | 1.4x faster | 2.2x faster       |
| 1,000         | `zaw`  | -           | 5.6x faster | 2.5x faster       |
| 10,000        | `zaw`  | -           | 7.1x faster | 2.3x faster       |
| 100,000       | `zaw`  | -           | 7.1x faster | 2.4x faster       |

### 📦 Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
zaw = "0.1"
```

For WebAssembly targets, also add:

```toml
[lib]
crate-type = ["cdylib"]
```

### 🔥 Quick Start

Here's how to sum an array of Float64s using `zaw`.

This won't actually be fast; check out the [example implementations](https://github.com/stylearcade/zaw/examples) to see what this looks like with full SIMD & batching.

#### Host Implementation

##### Javascript

```typescript
import { createInstance } from 'zaw'

export async function initWasmApi(wasmBuffer) {
  const instance = await createInstance(wasmBuffer, {
    // Reserve 1kb for both input and output channels
    inputChannelSize: 1_000,
    outputChannelSize: 1_000,
  })

  return {
    // Manual, explicit bindings (no hidden glue code)
    sumFloat64Array(values) {
      const input = instance.getInput() // Get shared input buffer
      const output = instance.getOutput() // Get shared output buffer

      // Copy values into WASM (zero allocation)
      // There are also zero-copy methods available
      input.copyFloat64Array(values)

      // Execute the method and handle any errors or panics
      instance.handleError(() => instance.exports.sumFloat64Array())

      // Read the sum from the output channel
      return output.readFloat64()
    },
  }
}

// Load your WASM module
const api = await initWasmApi(wasmBuffer)
const numbers = new Float64Array([1.5, 2.3, 3.7, 4.1])
const sum = api.sumFloat64Array(numbers)
console.log('Sum:', sum) // 9.5
```

#### WASM Implementation

##### Rust

```rust
use zaw::interop;
use zaw::interop::error::{Error, OK};

#[no_mangle]
pub extern "C" fn sumFloat64Array() -> i32 {
    let input = interop::get_input();     // Get shared input buffer
    let output = interop::get_output();   // Get shared output buffer

    let values = input.read_array_f64();  // Read array from JS (zero-copy!)

    let mut total = 0.0;
    for value in values {
        total += value;       // Simple sum (in reality, use SIMD)
    }

    output.write_f64(total);  // Write result back to JS

    return OK;
}
```
