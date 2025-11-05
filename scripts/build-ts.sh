#!/bin/bash

set -e;
cd "$(dirname $(realpath $0))/..";

npm i --prefix implementations/host-typescript
npm run build --prefix implementations/host-typescript
