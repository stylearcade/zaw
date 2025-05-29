# Contribution Guide

## Pull Requests

- Any PR that expands or updates benchmarks should include updated results in [docs/benchmarks.md](benchmarks.md).
  - These must be run on a `c8g` class EC2 instance
  - If an appropraite EC2 instance is not available to you, please indicate that a benchmark update is required.

## Adding a new WASM implementation

Start by reviewing `/wasm-zig` and `/examples/wasm-zig`.

Once you're ready to implement:

1. Add your implementation to a new top-level folder `/wasm-<lang>`
2. Add a new example in `/examples/<lang>/`
3. Include a `/examples/<lang>/build.sh` script that compiles a wasm file (should not be committed to source)
4. Update `/examples/host-typescript/__tests__/builds.ts` to point to the generated wasm file
5. Add a test generation file in `test-gen/languages/<lang>.ts` to generate a full [conduit](conduit.md) test suite
6. Add a new "bare-bones" example to `/docs/getting-started.md`

## Adding a new Host implementation

At the moment we're not accepting new host implementations - the best way to contribute here is to review our typescript host implementation and provide feedback on the API.
