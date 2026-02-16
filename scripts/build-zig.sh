#!/bin/bash

set -e;
ROOT="$(dirname $(realpath $0))/..";

cd $ROOT/examples/wasm-zig
zig build -Doptimize=ReleaseFast --summary all
npx wasm-opt -O4 --enable-simd --enable-bulk-memory --strip-debug ./zig-out/bin/main.wasm -o ./zig-out/bin/main.wasm
wasm2wat ./zig-out/bin/main.wasm > ./zig-out/bin/main.wat || true
