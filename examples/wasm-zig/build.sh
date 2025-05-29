#!/bin/bash
set -e

cd "$(dirname $(realpath $0))"

zig build -Doptimize=ReleaseFast
