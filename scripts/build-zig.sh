#!/bin/bash

set -e;
ROOT="$(dirname $(realpath $0))/..";

cd $ROOT/examples/wasm-zig
zig build -Doptimize=ReleaseFast --summary all
wasm2wat ./zig-out/bin/main.wasm > ./zig-out/bin/main.wat || true
