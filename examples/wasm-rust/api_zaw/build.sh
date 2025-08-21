#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

RUSTFLAGS="-C target-feature=+simd128 -C link-arg=--import-memory -C link-arg=--export-memory" cargo build --target wasm32-unknown-unknown --release

cd "../target/wasm32-unknown-unknown/release"
wasm2wat api_zaw.wasm > api_zaw.wat || true
