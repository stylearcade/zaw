#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

cd ./api_bindgen
wasm-pack build --target web
