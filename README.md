# `zaw`

[![Zig 0.15](https://img.shields.io/github/actions/workflow/status/stylearcade/zaw/ci-build-zig-0_15.yml?label=Zig%200.15&logo=zig)](https://github.com/stylearcade/zaw/actions/workflows/ci-build-zig-0_15.yml)
[![Zig master](https://img.shields.io/github/actions/workflow/status/stylearcade/zaw/ci-build-zig-master.yml?label=Zig%20master&logo=zig)](https://github.com/stylearcade/zaw/actions/workflows/ci-build-zig-master.yml)
[![Rust](https://img.shields.io/github/actions/workflow/status/stylearcade/zaw/ci-build-rust.yml?label=Rust&logo=rust)](https://github.com/stylearcade/zaw/actions/workflows/ci-build-rust.yml)

## Zero-Allocation WASM @ <a href="https://stylearcade.com" target="_blank">Style Arcade</a>

The purpose of `zaw` is to make it easier to achieve the original promise of WebAssembly:

**High-performance, low-overhead acceleration for targeted code - without rewriting your entire application.**

## The upshot

With `zaw`, you'll be able to offload individual algorithms, rather than entire modules, and keep your WebAssembly code lean and simple - truly unlocking the original vision of the WebAssembly founding team.

### Performance

**Up to 10x faster than pure JavaScript and 2.5x faster than wasm-bindgen for XOR Int32Array Bench**

| Element Count | Winner | vs `zaw`    | vs `js`     | vs `wasm-bindgen` |
| ------------- | ------ | ----------- | ----------- | ----------------- |
| 10            | `js`   | 2.0x faster | -           | 4.0x faster       |
| 100           | `zaw`  | -           | 1.2x faster | 2.0x faster       |
| 1,000         | `zaw`  | -           | 5.5x faster | 2.6x faster       |
| 10,000        | `zaw`  | -           | 9.9x faster | 2.6x faster       |
| 100,000       | `zaw`  | -           | 9.7x faster | 2.5x faster       |

**Why XOR Int32Array _isn't_ a ridiculous benchmark**

It seems counterintuitive, but this is the best possible test for a WebAssembly protocol:

- It leverages SIMD and instruction pipelining not available in Javascript
- It uses the smallest native WASM type
- It aligns to real-world buffer and matrix use cases that require data transfer
- It doesn't hide slow interop in the way fibonacci, digits of pi, prime factorisation or other toy examples do
- It shows an improvement over javascript even with a small element count (100)

And by targeting the _cheapest_ algorithm possible, we can see the performance of the interop itself.

## Getting Started

- See our [getting started guide](docs/getting-started.md) for installation & code samples
- Fork [zaw-starter-zig](https://github.com/stylearcade/zaw-starter-zig) or [zaw-starter-rust](https://github.com/stylearcade/zaw-starter-rust)

## Repository Overview

In this repository you will find:

- **Protocols**
  - [`zaw::conduit`](docs/protocol-conduit.md) - A protocol for zero-allocation communication across a fixed buffer
  - [`zaw::interop`](docs/protocol-interop.md) - Batteries-included protocol and host API specification for interop
    - Logging
    - Error handling, useful panic messages, optional stack traces
    - Handling <a href="https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory/grow#detachment_upon_growing" target="_blank">memory.grow() and detached buffers</a>
- **Implementations**
  - Hosts
    - [Typescript](implementations/host-typescript/)
    - Go _(coming later)_
  - WASM
    - [Zig](implementations/wasm-zig/)
    - [Rust](implementations/wasm-rust/)
- [**Benchmarks**](docs/benchmarks.md)
  - XOR Int32Array
  - Sum Float64Array
  - 4x4 Float32 Matrix multiplication

## Motivation

### The original vision of WebAssembly

Before we talk about what motivates us at Style Arcade, it's worth touching on the motivations of the original authors of the [spec](https://dl.acm.org/doi/10.1145/3140587.3062363):

> _Engineers from the four major browser vendors have risen to the challenge and collaboratively designed a portable low-level bytecode called WebAssembly. It offers compact representation, efficient validation and compilation, and safe **low to no-overhead execution**_.

This goal of low to no-overhead, especially at the boundary, is evident in their design decisions:

- The deterministic, linear memory model makes shared memory & fixed-buffer communication a breeze
- Memory isolation is not only great for memory safety, it also enables single-process execution and eliminates context switching
- The restricted type system of imports/exports eliminates abstraction, dispatch and boxing/unboxing

And finally, most importantly, WebAssembly is _appropriately low level_. The things they left _out_ of the spec are the things that enable real performance.

**So if the founders baked low-overhead into the original specification...what's the problem?**

### WebAssembly acceleration today

For teams that are building things today, the discourse around WebAssembly interop is dominated projects like [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen), which are great for high-level interactions and developer accessibility, but terrible for low-level performance.

When faced with overhead issues, the most often prescribed solution is to move more of your application into WASM and reduce the number of times you cross the boundary.

Here's how that plays out:

> _We should re-write that algorithm in Rust!_
>
> _Wow my prototype is 3x faster, let's definitely do this!_
>
> _I don't understand why the app isn't faster...is it even using the WASM module?_
>
> <a href="https://google.com/search?q=why+wasm+slow" target="_blank">google.com/search?q=why+wasm+slow</a> 〈ᇂ\_ᇂ |||〉
>
> _We need to re-write the entire module in Rust..._
>
> _We may as well re-write our whole application in Rust right? ¯\\_(ツ)_/¯_

This is a long way from the vision of _"low to no-overhead execution"_, or _"the next asm.js to accelerate your code"_.

### What about Component Model?

The [Component Model](https://component-model.bytecodealliance.org/) significantly expands on the scope of `wasm-bindgen` - developer ergonomics, easier interoperability and also enabling WebAssembly modules to import each other to create the "modular docker" of the future alongside [WASI](https://wasi.dev/):

> _If WASM+WASI existed in 2008, we wouldn't have needed to created Docker. That's how important it is. Webassembly on the server is the future of computing. A standardized system interface was the missing link. Let's hope WASI is up to the task!_ - [Solomon Hykes, March 2019](https://x.com/solomonstre/status/1111004913222324225)

This is a great initiative, but it's not available today and is still in [draft status](https://eunomia.dev/blog/2025/02/16/wasi-and-the-webassembly-component-model-current-status/), and it has the same core performance issue as `wasm-bindgen` - **per-call dynamic allocation**.

There's a [proposal to support fixed-size arrays](https://github.com/WebAssembly/component-model/issues/385), and another to support [generalised fixed memory communication via resources](https://github.com/WebAssembly/component-model/issues/398), but neither of these are on the critical path.

If either of these make it into standard then the `zaw` project will happily update the benchmarks to prove we're getting the maximum performance available, and there's a lot more we want to contribute than just low-overhead interop.

But the bottom line is, **if you need something today, then `zaw` is ready to go.**

### Why `zaw`? Why Style Arcade?

Retail data, although not the most buzzworthy problem space, has an extraordinarily high ratio of compute to data, especially in apparel due to sizing. You can't compute much in advance, and many retail KPIs require incredibly granular, turing complete, bottom-up metrics.

This project is being driven by two key performance goals at Style Arcade:

- For data structures, algorithms and AI inference, we want accelerated _execution_
- For everything else, we want accelerated _development_

For us, _"re-writing the entire module in Rust"_ meant moving a lot of fast-moving and complex business logic into the slowest moving container possible. This just wasn't viable. We wanted to continue using a higher-level language (Typescript) for the majority of our codebase so we can focus on delivering value and not incur the huge overhead of systems engineering at every level of our software.

We were also still very much stuck on the "dream" of WebAssembly where we could micro-offload _dozens_ of algorithms - and didn't want to mess around with hand-crafted buffer communication each time.

We were certain that hybrid-level WebAssembly was the answer, but that we'd need something different to `wasm-bindgen`.

So we went back to the drawing board, and focused solely on the communication overhead - and following an initial proof-of-concept in Zig, we developed `zaw::conduit` to allow bidirectional sharing of many data types, and then `zaw::interop` to make creating new modules very easy and overcome the typical headaches of WebAssembly development.

Check out our [benchmarks](docs/benchmarks.md) to find out where we landed, and see our [basic-beans examples](docs/getting-started.md) to see how easy it is to get started.
