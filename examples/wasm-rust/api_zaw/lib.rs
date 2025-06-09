use zaw::interop;
use zaw::interop::{Error, OK};
use shared;

// Setup all required WASM interop exports
zaw::setup_interop!();

#[no_mangle]
pub extern "C" fn throwErrorWithStack() -> i32 {
    fn inner() -> Result<(), Error> {
        Err(zaw::zaw_error!("Example error message with data: {} {} {}", 1, 2, 3))
    }

    interop::error::handle(inner)
}

#[no_mangle]
pub extern "C" fn usefulPanic() -> i32 {
    zaw::zaw_panic!("Example useful panic message with data: {:?}", "test");
}

#[no_mangle]
pub extern "C" fn echo() -> i32 {
    let input = interop::get_input();

    let msg = input.read_array_u8();
    let msg_str = std::str::from_utf8(msg).unwrap_or("<invalid utf8>");

    interop::log(&format!("{} from rust", msg_str));

    OK
}

#[no_mangle]
pub extern "C" fn xorInt32Array() -> i32 {
    let input = interop::get_input();
    let output = interop::get_output();

    let values = input.read_array_i32();
    let result = shared::xor_array_i32(&values);

    output.write_i32(result);

    OK
}

#[no_mangle]
pub extern "C" fn sumFloat64Array() -> i32 {
    let input = interop::get_input();
    let output = interop::get_output();

    let values = input.read_array_f64();
    let result = shared::sum_array_f64(&values);

    output.write_f64(result);

    OK
}

#[no_mangle]
pub extern "C" fn multiply4x4Float32() -> i32 {
    let input = interop::get_input();
    let output = interop::get_output();

    let a_matrices = input.read_array_f32();
    let b_matrices = input.read_array_f32();
    let mut result_matrices = vec![0.0f32; a_matrices.len()];

    shared::multiply_4x4_f32(&a_matrices, &b_matrices, &mut result_matrices);

    output.copy_array_f32(&result_matrices);

    OK
}
