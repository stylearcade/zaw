#!/bin/bash

set -e;
cd "$(dirname $(realpath $0))/..";

cd ./implementations/wasm-zig
zig build test --summary all
