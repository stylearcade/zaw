#!/bin/bash

set -e;
cd "$(dirname $(realpath $0))/..";

find . -type f -name "*.test.zig" | while read -r file; do
  echo "Running $file"
  zig test "$file"
done
