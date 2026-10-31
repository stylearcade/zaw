use std::cell::Cell;
use std::marker::PhantomData;
use std::mem;
use std::ptr::NonNull;

fn align_up(offset: u32, bytes: u8) -> u32 {
    let mask = (bytes - 1) as u32;
    (offset + mask) & !mask
}

/// The value types a channel carries: plain data, every bit pattern valid,
/// size (and so alignment) of at most 8 bytes.
///
/// # Safety
///
/// Implementors must be `Copy`, valid for any bit pattern, and have
/// `align_of == size_of <= 8`.
unsafe trait Pod: Copy {}
unsafe impl Pod for u8 {}
unsafe impl Pod for u32 {}
unsafe impl Pod for i32 {}
unsafe impl Pod for f32 {}
unsafe impl Pod for f64 {}

#[cold]
#[inline(never)]
fn overflow() -> ! {
    panic!("Channel buffer overflow");
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
    ($($type:ty, $method_suffix:ident);*) => {
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
                // SAFETY: a fresh, in-bounds, aligned region of one value.
                unsafe { self.channel.region::<$type>(1).cast::<$type>().write(value) }
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
    ($($type:ty, $copy_array:ident, $copy_elements:ident, $init:ident, $init_array:ident, $init_elements:ident);*) => {
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
                let region = self.channel.region::<$type>(arr.len() as u32);
                // SAFETY: a fresh region, disjoint from everything handed out
                // before it; `arr` can't point into the channel, whose storage
                // is borrowed exclusively.
                unsafe { (&mut *region.as_ptr()).copy_from_slice(arr) }
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
                self.channel.region::<$type>(1).cast::<$type>().as_ptr()
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
                // SAFETY: a fresh region, disjoint from everything handed out
                // before it; it lives no longer than `&mut self`, so not past
                // a `reset`.
                unsafe { &mut *self.channel.region::<$type>(length).as_ptr() }
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
    ($($type:ty, $read_method:ident, $read_array:ident, $read_elements:ident);*) => {
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
                // SAFETY: an in-bounds, aligned region of one value; the
                // storage is initialised and any bit pattern is valid.
                unsafe { self.channel.region::<$type>(1).cast::<$type>().read() }
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
                // SAFETY: a fresh region, only ever read; it lives no longer
                // than `&self`, so not past a `reset`.
                unsafe { &*self.channel.region::<$type>(length).as_ptr() }
            }
        )*
    };
}

/// The channel's memory: the base of one 8-byte aligned buffer, its length
/// in bytes, and the offset of the next value.
///
/// There are no whole-buffer views of any type. Each value or array is a
/// region carved at the offset (aligned to its type) from the one base
/// pointer and seen as that one type only; the offset only grows, so regions
/// handed out between resets never overlap, and `reset` takes `&mut self`,
/// so no region outlives it.
struct Channel<'a> {
    offset: Cell<u32>,
    base: NonNull<u8>,
    len: u32,
    _storage: PhantomData<&'a mut [u64]>,
}

// SAFETY: the channel stands for `&'a mut [u64]`, which is `Send`. (It was
// never `Sync`: the offset is a `Cell`.)
unsafe impl Send for Channel<'_> {}

impl<'a> Channel<'a> {
    fn from(storage: &'a mut [u64]) -> Self {
        let len = u32::try_from(mem::size_of_val(storage)).expect("Channel buffer too large");
        Self {
            offset: Cell::new(0),
            base: NonNull::from(storage).cast::<u8>(),
            len,
            _storage: PhantomData,
        }
    }

    fn reset(&mut self) {
        self.offset.set(0);
    }

    /// `count` values of `T` at the offset (aligned up to `T`'s size), the
    /// offset moved past them; past the buffer's end, a panic.
    #[inline(always)]
    fn region<T: Pod>(&self, count: u32) -> NonNull<[T]> {
        let start = align_up(self.offset.get(), mem::size_of::<T>() as u8);
        let end = start as u64 + count as u64 * mem::size_of::<T>() as u64;
        if end > self.len as u64 {
            overflow();
        }
        self.offset.set(end as u32);
        // SAFETY: `start <= end <= len`, so the pointer stays inside the
        // buffer; the base is 8-byte aligned and `start` a multiple of
        // `size_of::<T>() == align_of::<T>()`.
        let ptr = unsafe { NonNull::new_unchecked(self.base.as_ptr().add(start as usize)) };
        NonNull::slice_from_raw_parts(ptr.cast::<T>(), count as usize)
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
        u8, write_u8;
        u32, write_u32;
        i32, write_i32;
        f32, write_f32;
        f64, write_f64
    }

    // Generate array and init methods using macro
    impl_writer_array_methods! {
        u8, copy_array_u8, copy_elements_u8, init_u8, init_array_u8, init_elements_u8;
        u32, copy_array_u32, copy_elements_u32, init_u32, init_array_u32, init_elements_u32;
        i32, copy_array_i32, copy_elements_i32, init_i32, init_array_i32, init_elements_i32;
        f32, copy_array_f32, copy_elements_f32, init_f32, init_array_f32, init_elements_f32;
        f64, copy_array_f64, copy_elements_f64, init_f64, init_array_f64, init_elements_f64
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
        u8, read_u8, read_array_u8, read_elements_u8;
        u32, read_u32, read_array_u32, read_elements_u32;
        i32, read_i32, read_array_i32, read_elements_i32;
        f32, read_f32, read_array_f32, read_elements_f32;
        f64, read_f64, read_array_f64, read_elements_f64
    }
}

#[cfg(test)]
mod test;
