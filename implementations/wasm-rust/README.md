# `zaw`

## Zero Allocation WASM @ <a href="https://stylearcade.com" target="_blank">Style Arcade</a>

The purpose of `zaw` is to make it easier to achieve the original promise of WebAssembly:

**High-performance, low-overhead acceleration for targeted code - without rewriting your entire application.**

### The upshot

With `zaw`, you'll be able to offload individual algorithms, rather than entire modules, and keep your WebAssembly code lean and simple - truly unlocking the original vision of the WebAssembly founding team.

### Performance

**Up to 14x faster than pure JavaScript and 7x faster than wasm-bindgen for XOR Int32Array Bench**

| Element Count | Winner | vs `zaw`    | vs `js`      | vs `wasm-bindgen` |
| ------------- | ------ | ----------- | ------------ | ----------------- |
| 10            | `js`   | 1.6x faster | -            | 2.4x faster       |
| 100           | `zaw`  | -           | 6.0x faster  | 6.2x faster       |
| 1,000         | `zaw`  | -           | 11.4x faster | 6.9x faster       |
| 10,000        | `zaw`  | -           | 12.8x faster | 3.3x faster       |
| 100,000       | `zaw`  | -           | 13.8x faster | 4.3x faster       |

In this benchmark, we transfer in an Int32Array plus a scalar, XOR the scalar with the array and return the result.
Above 10,000 elements we're likely no longer in L1 Cache so the advantage reduces but is still huge (3-4x).

### Installation

```bash
# Typescript
npm install zaw

# Rust
cargo add zaw
```

Or you can just fork [zaw-starter-rust](https://github.com/stylearcade/zaw-starter-rust).

### Quick Start

Here's how to sum an array of Float64s using `zaw`.

This won't actually be fast; check out the [example implementations](https://github.com/stylearcade/zaw/examples) to see what this looks like with full SIMD & batching.

#### Host Implementation

##### Typescript

```typescript
import { createInstance } from 'zaw'

// Low-level WASM API
type WasmExports = {
  sumFloat64Array: () => 0 | 1 // 0 = OK, 1 = Error
}

// High-level API with bindings
type WasmApi = {
  sumFloat64Array: (values: Float64Array) => number
}

export async function initWasmApi(wasmBuffer): Promise<WasmApi> {
  const instance = await createInstance<WasmExports>(wasmBuffer, {
    // Reserve 1kb for both input and output channels
    inputChannelSize: 1_000,
    outputChannelSize: 1_000,
  })

  return {
    sumFloat64Array: instance.bind(
      // The exported function to bind to
      instance.exports.sumFloat64Array,

      // Input binding: copy values into WASM (zero allocation)
      (input, values) => input.copyFloat64Array(values),

      // Output binding: read the sum from the output channel
      output => output.readFloat64(),
    ),
  }
}

// Load your WASM module
const api = await initWasmApi(wasmBuffer)
const numbers = new Float64Array([1.5, 2.3, 3.7, 4.1])
const sum = api.sumFloat64Array(numbers)
console.log('Sum:', sum) // 9.5
```

#### WASM Implementation

```rust
use zaw::interop;
use zaw::interop::error::{Error, OK};

// Setup all required WASM interop exports
zaw::setup_interop!();

#[no_mangle]
pub extern "C" fn sumFloat64Array() -> i32 {
    let input = interop::get_input();     // Get shared input buffer
    let output = interop::get_output();   // Get shared output buffer

    let values = input.read_array_f64();  // Read array from JS

    let mut total = 0.0;
    for value in values {
        total += value;       // Simple sum (in reality, use SIMD)
    }

    output.write_f64(total);  // Write result back to JS

    return OK;
}
```

#### Error Handling

```rust
#[no_mangle]
pub extern "C" myFunction() -> i32 {
    fn inner() => Result<(), Error> {
      // Your logic here
    }

    // Will serialize error and return to host (or just return OK)
    interop::error::handle(inner)
}
```
