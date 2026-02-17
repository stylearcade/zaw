static mut ERR_STORAGE: [u8; 256] = [0; 256];

pub const OK: i32 = 0;
pub const ERROR: i32 = 1;

#[derive(Debug)]
pub struct Error {
    message: String,
}

impl Error {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for Error {}

pub type Result<T> = std::result::Result<T, Error>;

#[allow(static_mut_refs)]
pub fn get_error_ptr() -> i32 {
    unsafe { ERR_STORAGE.as_ptr() as i32 }
}

#[allow(static_mut_refs)]
pub fn write_error_to_storage(msg: &str) {
    unsafe {
        let bytes = msg.as_bytes();
        let to_copy = bytes.len().min(ERR_STORAGE.len() - 1);
        ERR_STORAGE[..to_copy].copy_from_slice(&bytes[..to_copy]);
        ERR_STORAGE[to_copy] = 0; // Null terminate
    }
}

pub fn handle<F>(func: F) -> i32
where
    F: FnOnce() -> Result<()>,
{
    match func() {
        Ok(()) => OK,
        Err(err) => {
            write_error_to_storage(&err.to_string());
            ERROR
        }
    }
}

// Error creation with location info for compatibility with tests
#[macro_export]
macro_rules! zaw_error {
    ($msg:expr) => {
        $crate::interop::error::Error::new(format!("{}\n    at {}:{}", $msg, file!(), line!()))
    };
    ($fmt:expr, $($arg:tt)*) => {
        $crate::interop::error::Error::new(format!("{}\n    at {}:{}", format!($fmt, $($arg)*), file!(), line!()))
    };
}

#[macro_export]
macro_rules! zaw_panic {
    ($msg:expr) => {{
        let msg = format!("{}\n    at {}:{}", $msg, file!(), line!());
        $crate::interop::error::write_error_to_storage(&msg);
        panic!("{}", msg)
    }};
    ($fmt:expr, $($arg:tt)*) => {{
        let msg = format!("{}\n    at {}:{}", format!($fmt, $($arg)*), file!(), line!());
        $crate::interop::error::write_error_to_storage(&msg);
        panic!("{}", msg)
    }};
}
