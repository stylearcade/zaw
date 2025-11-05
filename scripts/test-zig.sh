#!/bin/bash

set -e;
ROOT="$(dirname $(realpath $0))/..";

cd $ROOT/implementations/wasm-zig
zig build test --summary all
