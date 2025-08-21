### 📦 Installation

```bash
# Typescript
npm install zaw

# Zig
zig fetch https://github.com/stylearcade/zaw/releases/download/zig-v0.0.1/zaw-wasm.tar.gz

## build.zig
exe.root_module.addImport("zaw", b.dependency("zaw", .{
    .target = target,
    .optimize = optimize,
}).module("zaw"));

# Rust

cargo add zaw
```

Or you can just fork [zaw-starter-zig](https://github.com/stylearcade/zaw-starter-zig) or [zaw-starter-rust](https://github.com/stylearcade/zaw-starter-rust).

### 🔥 Quick Start

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

##### Zig

```zig
const zaw = @import("zaw");

const interop = zaw.interop;
const OK = interop.OK;

// Setup all required WASM interop exports
comptime {
    zaw.setupInterop();
}

export fn sumFloat64Array() i32 {
    var input = interop.getInput()       // Get shared input buffer
    var output = interop.getOutput()     // Get shared output buffer

    const values = input.readArray(f64)  // Read array from JS

    var total: f64 = 0
    for (values) |x| total += x  // Simple sum (in reality, use SIMD)

    output.write(f64, total)     // Write result back to JS
    return OK
}
```

##### Rust

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

##### Zig

```zig
fn myFunction_inner() !void {
  // Your logic here
}

export fn myFunction() i32 {
  return Error.handle(myFunction_inner);
}
```

##### Rust

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
