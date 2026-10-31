#!/bin/bash

# The Rust tests under Miri, which reports undefined behaviour (aliasing,
# out-of-bounds, misalignment, ...) in the conduit's unsafe code. Miri needs
# nightly, so it has its own pinned toolchain (rust-toolchain.toml pins stable).
# Runs once per aliasing model: Stacked Borrows (default) and Tree Borrows.

set -e;
ROOT="$(dirname $(realpath $0))/..";
NIGHTLY="nightly-2026-09-17"

rustup toolchain install "$NIGHTLY" --profile minimal --component miri,rust-src

cd $ROOT/implementations/wasm-rust
cargo +$NIGHTLY miri setup

echo "--- Miri: Stacked Borrows"
MIRIFLAGS="-Zmiri-strict-provenance" cargo +$NIGHTLY miri test

echo "--- Miri: Tree Borrows"
MIRIFLAGS="-Zmiri-strict-provenance -Zmiri-tree-borrows" cargo +$NIGHTLY miri test
