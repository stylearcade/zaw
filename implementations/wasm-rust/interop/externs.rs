// Host functions, imported from the `env` module (where the host puts them).
// Named explicitly: since Rust 1.96 the wasm linker no longer turns undefined
// symbols into `env` imports by itself (`--allow-undefined` was dropped).
#[link(wasm_import_module = "env")]
extern "C" {
    pub fn hostLog();
}
