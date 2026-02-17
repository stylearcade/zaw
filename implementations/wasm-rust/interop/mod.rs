use crate::conduit::{Reader, Writer};

pub mod error;
pub mod externs;
pub mod log;

pub use error::{Error, OK};
pub use log::log;

static mut INPUT: Option<Reader<'static>> = None;
static mut OUTPUT: Option<Writer<'static>> = None;

#[allow(static_mut_refs)]
pub fn get_input() -> &'static mut Reader<'static> {
    unsafe {
        let reader = INPUT.as_mut().expect("Input channel not initialized");

        reader.reset();

        reader
    }
}

#[allow(static_mut_refs)]
pub fn get_output() -> &'static mut Writer<'static> {
    unsafe {
        let writer = OUTPUT.as_mut().expect("Output channel not initialized");

        writer.reset();

        writer
    }
}

fn allocate_buffer(size_in_bytes: i32) -> (*mut u64, usize) {
    use std::alloc::{alloc, Layout};

    let size_in_u64s = (size_in_bytes as usize) / 8;
    // Use 16-byte alignment for optimal SIMD performance
    let layout = Layout::from_size_align(size_in_bytes as usize, 16).unwrap();

    unsafe {
        let ptr = alloc(layout) as *mut u64;
        if ptr.is_null() {
            panic!("Failed to allocate channel storage");
        }

        // Touch the memory to force WASM runtime to allocate pages
        std::ptr::write_bytes(ptr, 0, size_in_u64s);

        (ptr, size_in_u64s)
    }
}

pub fn allocate_input_channel(size_in_bytes: i32) -> i32 {
    let (ptr, size_in_u64s) = allocate_buffer(size_in_bytes);

    unsafe {
        let slice = std::slice::from_raw_parts_mut(ptr, size_in_u64s);
        INPUT = Some(Reader::from(slice));
        ptr as i32
    }
}

pub fn allocate_output_channel(size_in_bytes: i32) -> i32 {
    let (ptr, size_in_u64s) = allocate_buffer(size_in_bytes);

    unsafe {
        let slice = std::slice::from_raw_parts_mut(ptr, size_in_u64s);
        OUTPUT = Some(Writer::from(slice));
        ptr as i32
    }
}
