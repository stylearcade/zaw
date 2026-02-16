#!/bin/bash

set -e;
ROOT="$(dirname $(realpath $0))/..";

cd $ROOT/examples/wasm-rust/api_bindgen
RUSTFLAGS="-C target-feature=+simd128" wasm-pack build --target web
wasm2wat ./pkg/wasm_api_bindgen_bg.wasm >./pkg/wasm_api_bindgen_bg.wat || true

cd $ROOT/examples/wasm-rust/api_zaw
RUSTFLAGS="-C target-feature=+simd128 -C link-arg=--import-memory -C link-arg=--export-memory" cargo build --target wasm32-unknown-unknown --release

cd $ROOT/examples/wasm-rust/target/wasm32-unknown-unknown/release
npx wasm-opt -O4 --enable-simd api_zaw.wasm -o api_zaw.wasm
wasm2wat api_zaw.wasm > api_zaw.wat || true
