use super::externs;

static mut LOG_STORAGE: [u8; 2048] = [0; 2048];

#[allow(static_mut_refs)]
pub fn get_log_ptr() -> i32 {
    unsafe { LOG_STORAGE.as_ptr() as i32 }
}

#[allow(static_mut_refs)]
pub fn log(msg: &str) {
    unsafe {
        let bytes = msg.as_bytes();
        let to_copy = bytes.len().min(LOG_STORAGE.len() - 1); // Leave space for null terminator

        LOG_STORAGE[..to_copy].copy_from_slice(&bytes[..to_copy]);
        LOG_STORAGE[to_copy] = 0; // Null terminate

        externs::hostLog();
    }
}
