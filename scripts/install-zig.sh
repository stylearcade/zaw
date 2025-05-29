#!/bin/bash
set -e

if uname | grep -q Darwin; then
   # MacOS
   sudo brew install zig
else
   # Linux
   sudo snap install zig --classic --beta
fi
