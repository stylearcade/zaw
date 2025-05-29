#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

wasm-pack build --target web --out-dir pkg --release
