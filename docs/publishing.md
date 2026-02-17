# Publishing

## Typescript

`/implementations/host-typescript`

1. Bump the version in package.json
2. `npm install` to update package-lock.json
3. `npm publish`

## Zig

`/implementations/wasm-zig`

1. Bump the version in build.zig.zon
2. Merge to main
3. `export VERSION=<your new version>`
4. `git tag zig-v$VERSION && git push origin zig-v$VERSION`

## Rust

`/implementations/wasm-rust`

1. Bump the version in Cargo.toml
2. `cargo build` to update Cargo.lock
3. `cargo publish`
