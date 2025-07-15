#!/bin/bash

set -e;
cd "$(dirname $(realpath $0))/..";

find . -type f -name "build.sh" | while read -r file; do
  echo "Running $file"
  bash "$file"
done
npm i --prefix implementations/host-typescript
npm run build --prefix implementations/host-typescript
