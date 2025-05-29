# Getting Started

## Overview

These language guides show you how to add an array of Float64s across each language using `zaw`.

This won't actually be fast; check out the [example implementations](../examples) to see what this looks like with full SIMD & parallelism.

## WASM

### Zig

```zig
const std = @import("std");

const zaw = @import("zaw");

const interop = zaw.interop;
const OK = interop.OK;

comptime {
    interop.setupExports();
}

export fn sumFloat64Array() i32 {
    var input = interop.getInput();
    var output = interop.getOutput();

    const values = input.readArray(f64);

    var total: f64 = 0;

    for (values) |value| {
      total += value;
    }

    output.write(f64, total);

    return OK;
}

```

## Hosts

### Typescript

```typescript
import { createInstance } from 'zaw'

type ExampleExports = {
  sumFloat64Array: () => number
}

export type ExampleAPI = {
  sumFloat64Array: (values: Float64Array) => number
}

export async function initExample(wasmBuffer: Buffer): Promise<ExampleAPI> {
  let _lastMessage

  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000,
    outputChannelSize: 1_000,
  })

  return {
    sumFloat64Array(values) {
      const input = instance.getInput()
      const output = instance.getOutput()

      input.copyFloat64Array(values)

      instance.handleError(() => instance.exports.sumFloat64Array())

      return output.readFloat64()
    },
  }
}
```
