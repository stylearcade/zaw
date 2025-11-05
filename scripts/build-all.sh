#!/bin/bash

set -e;
cd "$(dirname $(realpath $0))";

./build-zig.sh
./build-rust.sh
./build-ts.sh
