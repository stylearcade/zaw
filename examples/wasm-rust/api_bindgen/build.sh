#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

wasm-pack build --target web
wasm2wat ./pkg/wasm_api_bindgen_bg.wasm >./pkg/wasm_api_bindgen_bg.wat
