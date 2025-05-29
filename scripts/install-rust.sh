#!/bin/bash
set -e

# Install Rust
if ! command -v rustup &> /dev/null; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi

# Install Rust stable toolchain and set as default
echo "Installing/updating Rust stable toolchain..."
rustup toolchain install stable
rustup default stable\

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install wasm-pack
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
