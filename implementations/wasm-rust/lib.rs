pub mod conduit;
pub mod interop;

/// Sets up all required WASM exports for the zaw interop layer.
///
/// This macro generates the four required exports:
/// - getErrorPtr: Access to error message buffer
/// - getLogPtr: Access to log message buffer
/// - allocateInputChannel: Allocate shared memory for JS→WASM communication
/// - allocateOutputChannel: Allocate shared memory for WASM→JS communication
///
/// Usage:
/// ```rust
/// zaw::setup_interop!();
/// ```
#[macro_export]
macro_rules! setup_interop {
    () => {
        #[no_mangle]
        pub extern "C" fn getErrorPtr() -> i32 {
            $crate::interop::error::get_error_ptr()
        }

        #[no_mangle]
        pub extern "C" fn getLogPtr() -> i32 {
            $crate::interop::log::get_log_ptr()
        }

        #[no_mangle]
        pub extern "C" fn allocateInputChannel(size: i32) -> i32 {
            $crate::interop::allocate_input_channel(size)
        }

        #[no_mangle]
        pub extern "C" fn allocateOutputChannel(size: i32) -> i32 {
            $crate::interop::allocate_output_channel(size)
        }
    };
}
