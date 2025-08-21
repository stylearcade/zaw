#!/bin/bash
set -e

# Install Rust
if ! command -v rustup &> /dev/null; then
  echo "Installing rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi

echo "Installing/updating Rust stable toolchain..."
rustup toolchain install stable
rustup target add wasm32-unknown-unknown

if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Install Zig 0.14
if command -v zig &> /dev/null; then
    zig_output=$(zig version 2>&1 || true)

    if echo "$zig_output" | grep -qi "no build.zig"; then
        echo "Found anyzig"
    else
        zig_version=$(echo "$zig_output" | cut -d. -f1-2)
        if [ "$zig_version" == "0.14" ]; then
            echo "Found zig 0.14"
        else
            echo "❌ Detected zig version $zig_version (required: 0.14)"
            echo "Please uninstall your current zig version before proceeding."
            echo "Once uninstalled, re-run this script and it will install anyzig in its place."
            exit 1
        fi
    fi
else
    echo "Installing anyzig..."

    if uname | grep -q Darwin; then
        sudo brew tap anyzig/tap
        sudo brew install anyzig
    else
        curl -L https://github.com/marler8997/anyzig/releases/latest/download/anyzig-x86_64-linux.tar.gz \
            | sudo tar xz -C /usr/local/bin
    fi
fi

# Install WABT
if ! command -v wat2wasm &> /dev/null; then
    echo "Installing wabt..."
    if uname | grep -q Darwin; then
        brew install wabt
    else
        sudo apt install -y wabt
    fi
fi
