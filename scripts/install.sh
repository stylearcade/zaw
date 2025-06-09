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

# Install Zig (check version >= 0.14)
install_zig=false
if command -v zig &> /dev/null; then
    zig_version=$(zig version | cut -d. -f1-2)
    if [ "$(printf '%s\n' "0.14" "$zig_version" | sort -V | head -n1)" != "0.14" ]; then
        echo "Zig version $zig_version < 0.14, installing newer version..."
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_zig=true
        fi
    fi
else
    echo "Installing zig..."
    install_zig=true
fi

if [ "$install_zig" = true ]; then
    if uname | grep -q Darwin; then
        sudo brew install zig
    else
        sudo snap install zig --classic --beta
    fi
else
    echo "Zig up to date"
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
