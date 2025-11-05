use std::mem;
use std::cell::Cell;

fn align_up(offset: u32, bytes: u8) -> u32 {
    let mask = (bytes - 1) as u32;
    (offset + mask) & !mask
}

fn get_storage_mut<T>(storage: &mut [u64]) -> &mut [T] {
    let ptr = storage.as_mut_ptr() as *mut T;
    let len = storage.len() * mem::size_of::<u64>() / mem::size_of::<T>();
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

/// Macro to generate write methods for Writer.
///
/// Generates methods that write primitive values to the channel.
/// Each generated method:
/// - Takes a value of the specified type
/// - Calculates the proper offset with alignment
/// - Writes the value to the appropriate storage array
/// - Advances the channel offset
macro_rules! impl_writer_methods {
    ($($type:ty, $field:ident, $method_suffix:ident);*) => {
        $(
            #[doc = concat!("Writes a `", stringify!($type), "` value to the channel.")]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = concat!("* `value` - The `", stringify!($type), "` value to write")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $method_suffix(&mut self, value: $type) {
                let offset = self.channel.offset_for::<$type>();
                self.channel.$field[offset as usize] = value;
                self.channel.advance::<$type>(1);
            }
        )*
    };
}

/// Macro to generate array operations and init methods for Writer.
///
/// Generates methods for:
/// - Copying arrays with length prefix
/// - Copying array elements without length prefix
/// - Initializing single values
/// - Initializing arrays with length prefix
/// - Initializing array elements without length prefix
macro_rules! impl_writer_array_methods {
    ($($type:ty, $field:ident, $copy_array:ident, $copy_elements:ident, $init:ident, $init_array:ident, $init_elements:ident);*) => {
        $(
            #[doc = concat!("Copies a `", stringify!($type), "` array to the channel with length prefix.")]
            #[doc = ""]
            #[doc = "Writes the array length as u32 followed by all array elements."]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = concat!("* `arr` - The `", stringify!($type), "` slice to copy")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $copy_array(&mut self, arr: &[$type]) {
                self.write_u32(arr.len() as u32);
                self.$copy_elements(arr);
            }

            #[doc = concat!("Copies `", stringify!($type), "` array elements to the channel without length prefix.")]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = concat!("* `arr` - The `", stringify!($type), "` slice to copy")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $copy_elements(&mut self, arr: &[$type]) {
                let start = self.channel.offset_for::<$type>() as usize;
                let end = start + arr.len();
                self.channel.$field[start..end].copy_from_slice(arr);
                self.channel.advance::<$type>(arr.len() as u32);
            }

            #[doc = concat!("Initializes space for a single `", stringify!($type), "` value in the channel.")]
            #[doc = ""]
            #[doc = "Returns a mutable pointer to the initialized space."]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("A mutable pointer to the initialized `", stringify!($type), "` value.")]
            #[doc = ""]
            #[doc = "# Safety"]
            #[doc = ""]
            #[doc = "The returned pointer is valid until the channel is reset."]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $init(&mut self) -> *mut $type {
                let offset = self.channel.offset_for::<$type>();
                self.channel.advance::<$type>(1);
                unsafe { self.channel.$field.as_mut_ptr().add(offset as usize) }
            }

            #[doc = concat!("Initializes space for a `", stringify!($type), "` array with length prefix.")]
            #[doc = ""]
            #[doc = "Writes the array length as u32 followed by initializing space for the elements."]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = "* `length` - The number of elements to initialize"]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("A mutable slice of `", stringify!($type), "` values.")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $init_array(&mut self, length: u32) -> &mut [$type] {
                self.write_u32(length);
                self.$init_elements(length)
            }

            #[doc = concat!("Initializes space for `", stringify!($type), "` array elements without length prefix.")]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = "* `length` - The number of elements to initialize"]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("A mutable slice of `", stringify!($type), "` values.")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $init_elements(&mut self, length: u32) -> &mut [$type] {
                let start = self.channel.offset_for::<$type>() as usize;
                self.channel.advance::<$type>(length);
                &mut self.channel.$field[start..start + length as usize]
            }
        )*
    };
}

/// Macro to generate read methods for Reader.
///
/// Generates methods for:
/// - Reading single primitive values
/// - Reading arrays with length prefix
/// - Reading array elements without length prefix
macro_rules! impl_reader_methods {
    ($($type:ty, $field:ident, $read_method:ident, $read_array:ident, $read_elements:ident);*) => {
        $(
            #[doc = concat!("Reads a `", stringify!($type), "` value from the channel.")]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("The `", stringify!($type), "` value read from the channel.")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $read_method(&self) -> $type {
                let offset = self.channel.offset_for::<$type>();
                let result = self.channel.$field[offset as usize];
                self.channel.advance::<$type>(1);
                result
            }

            #[doc = concat!("Reads a `", stringify!($type), "` array from the channel with length prefix.")]
            #[doc = ""]
            #[doc = "First reads the array length as u32, then reads that many elements."]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("A slice of `", stringify!($type), "` values.")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $read_array(&self) -> &[$type] {
                let length = self.read_u32();
                self.$read_elements(length)
            }

            #[doc = concat!("Reads `", stringify!($type), "` array elements from the channel without length prefix.")]
            #[doc = ""]
            #[doc = "# Arguments"]
            #[doc = ""]
            #[doc = "* `length` - The number of elements to read"]
            #[doc = ""]
            #[doc = "# Returns"]
            #[doc = ""]
            #[doc = concat!("A slice of `", stringify!($type), "` values.")]
            #[doc = ""]
            #[doc = "# Panics"]
            #[doc = ""]
            #[doc = "Panics if the channel buffer would overflow."]
            pub fn $read_elements(&self, length: u32) -> &[$type] {
                let start = self.channel.offset_for::<$type>() as usize;
                self.channel.advance::<$type>(length);
                &self.channel.$field[start..start + length as usize]
            }
        )*
    };
}

struct Channel<'a> {
    offset: Cell<u32>,
    storage_u8: &'a mut [u8],
    storage_u32: &'a mut [u32],
    storage_i32: &'a mut [i32],
    storage_f32: &'a mut [f32],
    storage_f64: &'a mut [f64],
}

impl<'a> Channel<'a> {
    fn from(storage: &'a mut [u64]) -> Self {
        // This is unsafe but necessary for the zero-allocation pattern
        unsafe {
            let storage_ptr = storage.as_mut_ptr();
            let storage_len = storage.len();

            Self {
                offset: Cell::new(0),
                storage_u8: get_storage_mut(std::slice::from_raw_parts_mut(storage_ptr, storage_len)),
                storage_u32: get_storage_mut(std::slice::from_raw_parts_mut(storage_ptr, storage_len)),
                storage_i32: get_storage_mut(std::slice::from_raw_parts_mut(storage_ptr, storage_len)),
                storage_f32: get_storage_mut(std::slice::from_raw_parts_mut(storage_ptr, storage_len)),
                storage_f64: get_storage_mut(std::slice::from_raw_parts_mut(storage_ptr, storage_len)),
            }
        }
    }

    fn reset(&mut self) {
        self.offset.set(0);
    }

    fn check_offset(&self) {
        if self.offset.get() > self.storage_u8.len() as u32 {
            panic!("Channel buffer overflow");
        }
    }

    fn align_to<T>(&self) {
        let current = self.offset.get();
        self.offset.set(align_up(current, mem::size_of::<T>() as u8));
        self.check_offset();
    }

    fn offset_for<T>(&self) -> u32 {
        self.align_to::<T>();
        let offset = self.offset.get();
        match mem::size_of::<T>() {
            1 => offset,
            4 => offset >> 2,
            8 => offset >> 3,
            _ => panic!("Invalid type size"),
        }
    }

    fn advance<T>(&self, count: u32) {
        let current = self.offset.get();
        self.offset.set(current + count * mem::size_of::<T>() as u32);
        self.check_offset();
    }
}

/// A zero-allocation writer for the communication channel.
///
/// The `Writer` provides methods to write primitive values and arrays to a shared
/// memory buffer. It maintains proper alignment for different data types and tracks
/// the current offset position.
///
/// # Examples
///
/// ```rust
/// # use zaw::conduit::Writer;
/// let mut storage = vec![0u64; 1024];
/// let mut writer = Writer::from(&mut storage);
///
/// writer.write_u32(42);
/// writer.write_f64(3.14159);
///
/// let array = vec![1, 2, 3, 4];
/// writer.copy_array_i32(&array);
/// ```
pub struct Writer<'a> {
    channel: Channel<'a>,
}

impl<'a> Writer<'a> {
    /// Creates a new `Writer` from a mutable slice of u64 storage.
    ///
    /// The storage must be 8-byte aligned and will be reinterpreted as different
    /// primitive types as needed.
    ///
    /// # Arguments
    ///
    /// * `storage` - A mutable slice of u64 values to use as the backing buffer
    ///
    /// # Returns
    ///
    /// A new `Writer` instance ready to write data.
    pub fn from(storage: &'a mut [u64]) -> Self {
        Self {
            channel: Channel::from(storage),
        }
    }

    /// Resets the writer to the beginning of the buffer.
    ///
    /// This allows reusing the same buffer for multiple write operations.
    pub fn reset(&mut self) {
        self.channel.reset();
    }

    /// Writes a `usize` value as a `u32` to the channel.
    ///
    /// # Arguments
    ///
    /// * `value` - The usize value to write (will be cast to u32)
    ///
    /// # Panics
    ///
    /// Panics if the channel buffer would overflow.
    pub fn write_usize(&mut self, value: usize) {
        self.write_u32(value as u32);
    }

    // Generate basic write methods using macro
    impl_writer_methods! {
        u8, storage_u8, write_u8;
        u32, storage_u32, write_u32;
        i32, storage_i32, write_i32;
        f32, storage_f32, write_f32;
        f64, storage_f64, write_f64
    }

    // Generate array and init methods using macro
    impl_writer_array_methods! {
        u8, storage_u8, copy_array_u8, copy_elements_u8, init_u8, init_array_u8, init_elements_u8;
        u32, storage_u32, copy_array_u32, copy_elements_u32, init_u32, init_array_u32, init_elements_u32;
        i32, storage_i32, copy_array_i32, copy_elements_i32, init_i32, init_array_i32, init_elements_i32;
        f32, storage_f32, copy_array_f32, copy_elements_f32, init_f32, init_array_f32, init_elements_f32;
        f64, storage_f64, copy_array_f64, copy_elements_f64, init_f64, init_array_f64, init_elements_f64
    }
}

/// A zero-allocation reader for the communication channel.
///
/// The `Reader` provides methods to read primitive values and arrays from a shared
/// memory buffer. It maintains proper alignment for different data types and tracks
/// the current offset position.
///
/// # Examples
///
/// ```rust
/// # use zaw::conduit::Reader;
/// let mut storage = vec![0u64; 1024];
/// let mut reader = Reader::from(&mut storage);
///
/// let value = reader.read_u32();
/// let pi = reader.read_f64();
///
/// let array = reader.read_array_i32();
/// ```
pub struct Reader<'a> {
    channel: Channel<'a>,
}

impl<'a> Reader<'a> {
    /// Creates a new `Reader` from a mutable slice of u64 storage.
    ///
    /// The storage must be 8-byte aligned and will be reinterpreted as different
    /// primitive types as needed.
    ///
    /// # Arguments
    ///
    /// * `storage` - A mutable slice of u64 values to use as the backing buffer
    ///
    /// # Returns
    ///
    /// A new `Reader` instance ready to read data.
    pub fn from(storage: &'a mut [u64]) -> Self {
        Self {
            channel: Channel::from(storage),
        }
    }

    /// Resets the reader to the beginning of the buffer.
    ///
    /// This allows reusing the same buffer for multiple read operations.
    pub fn reset(&mut self) {
        self.channel.reset();
    }

    // Generate all read methods using macro
    impl_reader_methods! {
        u8, storage_u8, read_u8, read_array_u8, read_elements_u8;
        u32, storage_u32, read_u32, read_array_u32, read_elements_u32;
        i32, storage_i32, read_i32, read_array_i32, read_elements_i32;
        f32, storage_f32, read_f32, read_array_f32, read_elements_f32;
        f64, storage_f64, read_f64, read_array_f64, read_elements_f64
    }
}

#[cfg(test)]
mod test;
