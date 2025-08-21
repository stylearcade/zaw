#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

zig build -Doptimize=ReleaseFast
wasm2wat ./zig-out/bin/main.wasm > ./zig-out/bin/main.wat || true
