use super::{Reader, Writer};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn simple_uint8_write() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
        }

        let expected = [42, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
    }

    #[test]
    fn multiple_uint8_writes() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(10);
            writer.write_u8(20);
            writer.write_u8(30);
        }

        let expected = [10, 20, 30, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(20, reader.read_u8());
        assert_eq!(30, reader.read_u8());
    }

    #[test]
    fn uint32_write() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u32(0x12345678);
        }

        let expected = [120, 86, 52, 18, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(0x12345678, reader.read_u32());
    }

    #[test]
    fn uint32_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(10);
            writer.write_u32(0x12345678);
        }

        let expected = [10, 0, 0, 0, 120, 86, 52, 18u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(0x12345678, reader.read_u32());
    }

    #[test]
    fn int32_write() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_i32(i32::MIN);
        }

        let expected = [0, 0, 0, 128, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(i32::MIN, reader.read_i32());
    }

    #[test]
    fn int32_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(10);
            writer.write_i32(-42);
        }

        let expected = [10, 0, 0, 0, 214, 255, 255, 255u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(-42, reader.read_i32());
    }

    #[test]
    fn float32_write() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_f32(3.14159);
        }

        let expected = [208, 15, 73, 64, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(3.14159, reader.read_f32());
    }

    #[test]
    fn float32_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(5);
            writer.write_f32(3.14159);
        }

        let expected = [5, 0, 0, 0, 208, 15, 73, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(5, reader.read_u8());
        assert_eq!(3.14159, reader.read_f32());
    }

    #[test]
    fn float32_special_values() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_f32(1.0);
            writer.write_f32(-1.0);
            writer.write_f32(0.0);
        }

        let expected = [0, 0, 128, 63, 0, 0, 128, 191, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(1.0, reader.read_f32());
        assert_eq!(-1.0, reader.read_f32());
        assert_eq!(0.0, reader.read_f32());
    }

    #[test]
    fn float64_write() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_f64(1.7976931348623157e+308);
        }

        let expected = [255, 255, 255, 255, 255, 255, 239, 127, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(1.7976931348623157e+308, reader.read_f64());
    }

    #[test]
    fn float64_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(5);
            writer.write_f64(3.14159);
        }

        let expected = [5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(5, reader.read_u8());
        assert_eq!(3.14159, reader.read_f64());
    }

    #[test]
    fn multiple_mixed_primitives() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(255);
            writer.write_u32(0xfedcba98);
            writer.write_i32(-1);
            writer.write_f32(2.718);
            writer.write_f64(-2.718);
        }

        let expected = [255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 24) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(255, reader.read_u8());
        assert_eq!(0xfedcba98, reader.read_u32());
        assert_eq!(-1, reader.read_i32());
        assert_eq!(2.718, reader.read_f32());
        assert_eq!(-2.718, reader.read_f64());
    }

    #[test]
    fn empty_uint8_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_u8(&[]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_arr0 = reader.read_array_u8();
        assert_eq!(0, _read_arr0.len());
    }

    #[test]
    fn uint8_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_u8(&[1, 2, 3, 4, 5]);
        }

        let expected = [5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_u8();
        assert_eq!(5, read_arr0.len());
        assert_eq!(1, read_arr0[0]);
        assert_eq!(2, read_arr0[1]);
        assert_eq!(3, read_arr0[2]);
        assert_eq!(4, read_arr0[3]);
        assert_eq!(5, read_arr0[4]);
    }

    #[test]
    fn uint32_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_u32(&[0x12345678, 0x87654321]);
        }

        let expected = [2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_u32();
        assert_eq!(2, read_arr0.len());
        assert_eq!(0x12345678, read_arr0[0]);
        assert_eq!(0x87654321, read_arr0[1]);
    }

    #[test]
    fn uint32_array_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_array_u32(&[0x11223344, 0x55667788]);
        }

        let expected = [42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_arr1 = reader.read_array_u32();
        assert_eq!(2, read_arr1.len());
        assert_eq!(0x11223344, read_arr1[0]);
        assert_eq!(0x55667788, read_arr1[1]);
    }

    #[test]
    fn int32_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_i32(&[i32::MIN, 0, 2147483647]);
        }

        let expected = [3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_i32();
        assert_eq!(3, read_arr0.len());
        assert_eq!(i32::MIN, read_arr0[0]);
        assert_eq!(0, read_arr0[1]);
        assert_eq!(2147483647, read_arr0[2]);
    }

    #[test]
    fn int32_array_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(255);
            writer.copy_array_i32(&[-1, 0, 1]);
        }

        let expected = [255, 0, 0, 0, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 20) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(255, reader.read_u8());
        let read_arr1 = reader.read_array_i32();
        assert_eq!(3, read_arr1.len());
        assert_eq!(-1, read_arr1[0]);
        assert_eq!(0, read_arr1[1]);
        assert_eq!(1, read_arr1[2]);
    }

    #[test]
    fn empty_float32_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_f32(&[]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_arr0 = reader.read_array_f32();
        assert_eq!(0, _read_arr0.len());
    }

    #[test]
    fn float32_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_f32(&[1.0, -1.0, 3.14159]);
        }

        let expected = [3, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 208, 15, 73, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_f32();
        assert_eq!(3, read_arr0.len());
        assert_eq!(1.0, read_arr0[0]);
        assert_eq!(-1.0, read_arr0[1]);
        assert_eq!(3.14159, read_arr0[2]);
    }

    #[test]
    fn float32_array_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_array_f32(&[2.718, -2.718]);
        }

        let expected = [42, 0, 0, 0, 2, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_arr1 = reader.read_array_f32();
        assert_eq!(2, read_arr1.len());
        assert_eq!(2.718, read_arr1[0]);
        assert_eq!(-2.718, read_arr1[1]);
    }

    #[test]
    fn float64_array() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_f64(&[0.0, 3.14159, -2.718]);
        }

        let expected = [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 32) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_f64();
        assert_eq!(3, read_arr0.len());
        assert_eq!(0.0, read_arr0[0]);
        assert_eq!(3.14159, read_arr0[1]);
        assert_eq!(-2.718, read_arr0[2]);
    }

    #[test]
    fn float64_array_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_array_f64(&[1.0, -1.0]);
        }

        let expected = [42, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 32) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_arr1 = reader.read_array_f64();
        assert_eq!(2, read_arr1.len());
        assert_eq!(1.0, read_arr1[0]);
        assert_eq!(-1.0, read_arr1[1]);
    }

    #[test]
    fn empty_uint8_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_u8(&[]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_elems0 = reader.read_elements_u8(0);
        assert_eq!(0, _read_elems0.len());
    }

    #[test]
    fn uint8_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_u8(&[10, 20, 30, 40, 50]);
        }

        let expected = [10, 20, 30, 40, 50, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_u8(5);
        assert_eq!(10, read_elems0[0]);
        assert_eq!(20, read_elems0[1]);
        assert_eq!(30, read_elems0[2]);
        assert_eq!(40, read_elems0[3]);
        assert_eq!(50, read_elems0[4]);
    }

    #[test]
    fn uint32_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_u32(&[0x12345678, 0x87654321]);
        }

        let expected = [120, 86, 52, 18, 33, 67, 101, 135u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_u32(2);
        assert_eq!(0x12345678, read_elems0[0]);
        assert_eq!(0x87654321, read_elems0[1]);
    }

    #[test]
    fn uint32_elements_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_elements_u32(&[0x11223344, 0x55667788]);
        }

        let expected = [42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_elems1 = reader.read_elements_u32(2);
        assert_eq!(0x11223344, read_elems1[0]);
        assert_eq!(0x55667788, read_elems1[1]);
    }

    #[test]
    fn int32_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_i32(&[i32::MIN, 0, 2147483647]);
        }

        let expected = [0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_i32(3);
        assert_eq!(i32::MIN, read_elems0[0]);
        assert_eq!(0, read_elems0[1]);
        assert_eq!(2147483647, read_elems0[2]);
    }

    #[test]
    fn int32_elements_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(255);
            writer.copy_elements_i32(&[-1, 0, 1]);
        }

        let expected = [255, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(255, reader.read_u8());
        let read_elems1 = reader.read_elements_i32(3);
        assert_eq!(-1, read_elems1[0]);
        assert_eq!(0, read_elems1[1]);
        assert_eq!(1, read_elems1[2]);
    }

    #[test]
    fn empty_float32_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_f32(&[]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_elems0 = reader.read_elements_f32(0);
        assert_eq!(0, _read_elems0.len());
    }

    #[test]
    fn float32_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_f32(&[0.0, 1.0, -1.0]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_f32(3);
        assert_eq!(0.0, read_elems0[0]);
        assert_eq!(1.0, read_elems0[1]);
        assert_eq!(-1.0, read_elems0[2]);
    }

    #[test]
    fn float32_elements_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_elements_f32(&[3.14159, 2.718]);
        }

        let expected = [42, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_elems1 = reader.read_elements_f32(2);
        assert_eq!(3.14159, read_elems1[0]);
        assert_eq!(2.718, read_elems1[1]);
    }

    #[test]
    fn float64_elements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_f64(&[0.0, 3.14159]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_f64(2);
        assert_eq!(0.0, read_elems0[0]);
        assert_eq!(3.14159, read_elems0[1]);
    }

    #[test]
    fn float64_elements_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.copy_elements_f64(&[1.0, -1.0]);
        }

        let expected = [42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 24) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_elems1 = reader.read_elements_f64(2);
        assert_eq!(1.0, read_elems1[0]);
        assert_eq!(-1.0, read_elems1[1]);
    }

    #[test]
    fn tuple_of_uint32() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_elements_u32(&[10, 20, 30]);
        }

        let expected = [10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_u32(3);
        assert_eq!(10, read_elems0[0]);
        assert_eq!(20, read_elems0[1]);
        assert_eq!(30, read_elems0[2]);
    }

    #[test]
    fn complex_mixed_types_with_arrays_and_elementss() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(255);
            writer.write_u32(0xabcdef01);
            writer.copy_array_i32(&[-100, 0, 100]);
            writer.copy_elements_f32(&[1.234, 5.678]);
            writer.copy_elements_f64(&[9.876]);
        }

        let expected = [255, 0, 0, 0, 1, 239, 205, 171, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 157, 63, 45, 178, 181, 64, 141, 151, 110, 18, 131, 192, 35, 64, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 48) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(255, reader.read_u8());
        assert_eq!(0xabcdef01, reader.read_u32());
        let read_arr2 = reader.read_array_i32();
        assert_eq!(3, read_arr2.len());
        assert_eq!(-100, read_arr2[0]);
        assert_eq!(0, read_arr2[1]);
        assert_eq!(100, read_arr2[2]);
        let read_elems3 = reader.read_elements_f32(2);
        assert_eq!(1.234, read_elems3[0]);
        assert_eq!(5.678, read_elems3[1]);
        let read_elems4 = reader.read_elements_f64(1);
        assert_eq!(9.876, read_elems4[0]);
    }

    #[test]
    fn write_sequence_with_all_types() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            writer.write_u32(0x12345678);
            writer.write_i32(-42);
            writer.write_f32(3.14159);
            writer.write_f64(2.71828);
            writer.copy_array_u8(&[1, 2, 3]);
            writer.copy_array_u32(&[0xaabbccdd, 0xeeff0011]);
            writer.copy_array_i32(&[-1, 0, 1]);
            writer.copy_array_f32(&[1.0, -1.0]);
            writer.copy_array_f64(&[1.0, -1.0]);
            writer.copy_elements_u8(&[10, 20, 30]);
            writer.copy_elements_u32(&[0x11223344, 0x55667788]);
            writer.copy_elements_i32(&[-100, 0, 100]);
            writer.copy_elements_f32(&[2.718, -2.718]);
            writer.copy_elements_f64(&[3.141592653589793, -3.141592653589793]);
        }

        let expected = [42, 0, 0, 0, 120, 86, 52, 18, 214, 255, 255, 255, 208, 15, 73, 64, 144, 247, 170, 149, 9, 191, 5, 64, 3, 0, 0, 0, 1, 2, 3, 0, 2, 0, 0, 0, 221, 204, 187, 170, 17, 0, 255, 238, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 10, 20, 30, 0, 68, 51, 34, 17, 136, 119, 102, 85, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192, 24, 45, 68, 84, 251, 33, 9, 64, 24, 45, 68, 84, 251, 33, 9, 192, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 152) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        assert_eq!(0x12345678, reader.read_u32());
        assert_eq!(-42, reader.read_i32());
        assert_eq!(3.14159, reader.read_f32());
        assert_eq!(2.71828, reader.read_f64());
        let read_arr5 = reader.read_array_u8();
        assert_eq!(3, read_arr5.len());
        assert_eq!(1, read_arr5[0]);
        assert_eq!(2, read_arr5[1]);
        assert_eq!(3, read_arr5[2]);
        let read_arr6 = reader.read_array_u32();
        assert_eq!(2, read_arr6.len());
        assert_eq!(0xaabbccdd, read_arr6[0]);
        assert_eq!(0xeeff0011, read_arr6[1]);
        let read_arr7 = reader.read_array_i32();
        assert_eq!(3, read_arr7.len());
        assert_eq!(-1, read_arr7[0]);
        assert_eq!(0, read_arr7[1]);
        assert_eq!(1, read_arr7[2]);
        let read_arr8 = reader.read_array_f32();
        assert_eq!(2, read_arr8.len());
        assert_eq!(1.0, read_arr8[0]);
        assert_eq!(-1.0, read_arr8[1]);
        let read_arr9 = reader.read_array_f64();
        assert_eq!(2, read_arr9.len());
        assert_eq!(1.0, read_arr9[0]);
        assert_eq!(-1.0, read_arr9[1]);
        let read_elems10 = reader.read_elements_u8(3);
        assert_eq!(10, read_elems10[0]);
        assert_eq!(20, read_elems10[1]);
        assert_eq!(30, read_elems10[2]);
        let read_elems11 = reader.read_elements_u32(2);
        assert_eq!(0x11223344, read_elems11[0]);
        assert_eq!(0x55667788, read_elems11[1]);
        let read_elems12 = reader.read_elements_i32(3);
        assert_eq!(-100, read_elems12[0]);
        assert_eq!(0, read_elems12[1]);
        assert_eq!(100, read_elems12[2]);
        let read_elems13 = reader.read_elements_f32(2);
        assert_eq!(2.718, read_elems13[0]);
        assert_eq!(-2.718, read_elems13[1]);
        let read_elems14 = reader.read_elements_f64(2);
        assert_eq!(3.141592653589793, read_elems14[0]);
        assert_eq!(-3.141592653589793, read_elems14[1]);
    }

    #[test]
    fn complex_mixed_types() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(99);
            writer.write_u32(42);
            writer.write_f32(1.5);
            writer.copy_array_f64(&[1.1, 2.2]);
        }

        let expected = [99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 32) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(99, reader.read_u8());
        assert_eq!(42, reader.read_u32());
        assert_eq!(1.5, reader.read_f32());
        let read_arr3 = reader.read_array_f64();
        assert_eq!(2, read_arr3.len());
        assert_eq!(1.1, read_arr3[0]);
        assert_eq!(2.2, read_arr3[1]);
    }

    #[test]
    fn back_to_back_alignment_requirements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(1);
            writer.write_u32(2);
            writer.write_u8(3);
            writer.write_f32(4.0);
            writer.write_u8(5);
            writer.write_f64(6.0);
            writer.write_u8(7);
        }

        let expected = [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 128, 64, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 64, 7, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 40) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(1, reader.read_u8());
        assert_eq!(2, reader.read_u32());
        assert_eq!(3, reader.read_u8());
        assert_eq!(4.0, reader.read_f32());
        assert_eq!(5, reader.read_u8());
        assert_eq!(6.0, reader.read_f64());
        assert_eq!(7, reader.read_u8());
    }

    #[test]
    fn empty_arrays_of_different_types() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.copy_array_u8(&[]);
            writer.copy_array_u32(&[]);
            writer.copy_array_i32(&[]);
            writer.copy_array_f32(&[]);
            writer.copy_array_f64(&[]);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 20) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_arr0 = reader.read_array_u8();
        assert_eq!(0, _read_arr0.len());
        let _read_arr1 = reader.read_array_u32();
        assert_eq!(0, _read_arr1.len());
        let _read_arr2 = reader.read_array_i32();
        assert_eq!(0, _read_arr2.len());
        let _read_arr3 = reader.read_array_f32();
        assert_eq!(0, _read_arr3.len());
        let _read_arr4 = reader.read_array_f64();
        assert_eq!(0, _read_arr4.len());
    }

    #[test]
    fn mixed_operations_with_reset() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(10);
            writer.write_u32(0x12345678);
            writer.write_f32(1.23);
            writer.write_u8(20);
        }

        let expected = [10, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 20, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(0x12345678, reader.read_u32());
        assert_eq!(1.23, reader.read_f32());
        assert_eq!(20, reader.read_u8());
    }

    #[test]
    fn all_possible_primitive_values() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(0);
            writer.write_u8(127);
            writer.write_u8(255);
            writer.write_u32(0);
            writer.write_u32(0x7fffffff);
            writer.write_u32(0xffffffff);
            writer.write_i32(i32::MIN);
            writer.write_i32(0);
            writer.write_i32(2147483647);
            writer.write_f32(0.0);
            writer.write_f32(1.175494e-38);
            writer.write_f32(3.4028235e+38);
            writer.write_f64(0.0);
            writer.write_f64(-0.0);
            writer.write_f64(1.7976931348623157e+308);
            writer.write_f64(5e-324);
        }

        let expected = [0, 127, 255, 0, 0, 0, 0, 0, 255, 255, 255, 127, 255, 255, 255, 255, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127, 0, 0, 0, 0, 253, 255, 127, 0, 255, 255, 127, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 255, 239, 127, 1, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 72) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(0, reader.read_u8());
        assert_eq!(127, reader.read_u8());
        assert_eq!(255, reader.read_u8());
        assert_eq!(0, reader.read_u32());
        assert_eq!(0x7fffffff, reader.read_u32());
        assert_eq!(0xffffffff, reader.read_u32());
        assert_eq!(i32::MIN, reader.read_i32());
        assert_eq!(0, reader.read_i32());
        assert_eq!(2147483647, reader.read_i32());
        assert_eq!(0.0, reader.read_f32());
        assert_eq!(1.175494e-38, reader.read_f32());
        assert_eq!(3.4028235e+38, reader.read_f32());
        assert_eq!(0.0, reader.read_f64());
        assert_eq!(-0.0, reader.read_f64());
        assert_eq!(1.7976931348623157e+308, reader.read_f64());
        assert_eq!(5e-324, reader.read_f64());
    }

    #[test]
    fn simple_uint8_init() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u8();
            unsafe { *ptr0 = 42; }
        }

        let expected = [42, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
    }

    #[test]
    fn multiple_uint8_inits() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u8();
            unsafe { *ptr0 = 10; }
            let ptr1 = writer.init_u8();
            unsafe { *ptr1 = 20; }
            let ptr2 = writer.init_u8();
            unsafe { *ptr2 = 30; }
        }

        let expected = [10, 20, 30, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(20, reader.read_u8());
        assert_eq!(30, reader.read_u8());
    }

    #[test]
    fn uint32_init() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u32();
            unsafe { *ptr0 = 0x12345678; }
        }

        let expected = [120, 86, 52, 18, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(0x12345678, reader.read_u32());
    }

    #[test]
    fn uint32_init_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(10);
            let ptr1 = writer.init_u32();
            unsafe { *ptr1 = 0x12345678; }
        }

        let expected = [10, 0, 0, 0, 120, 86, 52, 18u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(10, reader.read_u8());
        assert_eq!(0x12345678, reader.read_u32());
    }

    #[test]
    fn int32_init() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_i32();
            unsafe { *ptr0 = i32::MIN; }
        }

        let expected = [0, 0, 0, 128, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(i32::MIN, reader.read_i32());
    }

    #[test]
    fn float32_init() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_f32();
            unsafe { *ptr0 = 3.14159; }
        }

        let expected = [208, 15, 73, 64, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(3.14159, reader.read_f32());
    }

    #[test]
    fn float32_init_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(5);
            let ptr1 = writer.init_f32();
            unsafe { *ptr1 = 3.14159; }
        }

        let expected = [5, 0, 0, 0, 208, 15, 73, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(5, reader.read_u8());
        assert_eq!(3.14159, reader.read_f32());
    }

    #[test]
    fn float64_init() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_f64();
            unsafe { *ptr0 = 3.14159; }
        }

        let expected = [110, 134, 27, 240, 249, 33, 9, 64, 0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(3.14159, reader.read_f64());
    }

    #[test]
    fn float64_init_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(5);
            let ptr1 = writer.init_f64();
            unsafe { *ptr1 = 3.14159; }
        }

        let expected = [5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(5, reader.read_u8());
        assert_eq!(3.14159, reader.read_f64());
    }

    #[test]
    fn mixed_primitive_inits() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u8();
            unsafe { *ptr0 = 255; }
            let ptr1 = writer.init_u32();
            unsafe { *ptr1 = 0xfedcba98; }
            let ptr2 = writer.init_i32();
            unsafe { *ptr2 = -1; }
            let ptr3 = writer.init_f32();
            unsafe { *ptr3 = 2.718; }
            let ptr4 = writer.init_f64();
            unsafe { *ptr4 = -2.718; }
        }

        let expected = [255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 24) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(255, reader.read_u8());
        assert_eq!(0xfedcba98, reader.read_u32());
        assert_eq!(-1, reader.read_i32());
        assert_eq!(2.718, reader.read_f32());
        assert_eq!(-2.718, reader.read_f64());
    }

    #[test]
    fn empty_uint8_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let _arr0 = writer.init_array_u8(0);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_arr0 = reader.read_array_u8();
        assert_eq!(0, _read_arr0.len());
    }

    #[test]
    fn uint8_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_array_u8(5);
            arr0[0] = 1;
            arr0[1] = 2;
            arr0[2] = 3;
            arr0[3] = 4;
            arr0[4] = 5;
        }

        let expected = [5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_u8();
        assert_eq!(5, read_arr0.len());
        assert_eq!(1, read_arr0[0]);
        assert_eq!(2, read_arr0[1]);
        assert_eq!(3, read_arr0[2]);
        assert_eq!(4, read_arr0[3]);
        assert_eq!(5, read_arr0[4]);
    }

    #[test]
    fn uint32_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_array_u32(2);
            arr0[0] = 0x12345678;
            arr0[1] = 0x87654321;
        }

        let expected = [2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_u32();
        assert_eq!(2, read_arr0.len());
        assert_eq!(0x12345678, read_arr0[0]);
        assert_eq!(0x87654321, read_arr0[1]);
    }

    #[test]
    fn uint32_initarray_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            let arr1 = writer.init_array_u32(2);
            arr1[0] = 0x11223344;
            arr1[1] = 0x55667788;
        }

        let expected = [42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_arr1 = reader.read_array_u32();
        assert_eq!(2, read_arr1.len());
        assert_eq!(0x11223344, read_arr1[0]);
        assert_eq!(0x55667788, read_arr1[1]);
    }

    #[test]
    fn int32_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_array_i32(3);
            arr0[0] = i32::MIN;
            arr0[1] = 0;
            arr0[2] = 2147483647;
        }

        let expected = [3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_i32();
        assert_eq!(3, read_arr0.len());
        assert_eq!(i32::MIN, read_arr0[0]);
        assert_eq!(0, read_arr0[1]);
        assert_eq!(2147483647, read_arr0[2]);
    }

    #[test]
    fn float32_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_array_f32(3);
            arr0[0] = 0.0;
            arr0[1] = 3.14159;
            arr0[2] = -2.718;
        }

        let expected = [3, 0, 0, 0, 0, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_f32();
        assert_eq!(3, read_arr0.len());
        assert_eq!(0.0, read_arr0[0]);
        assert_eq!(3.14159, read_arr0[1]);
        assert_eq!(-2.718, read_arr0[2]);
    }

    #[test]
    fn float64_initarray() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_array_f64(3);
            arr0[0] = 0.0;
            arr0[1] = 3.14159;
            arr0[2] = -2.718;
        }

        let expected = [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 32) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_arr0 = reader.read_array_f64();
        assert_eq!(3, read_arr0.len());
        assert_eq!(0.0, read_arr0[0]);
        assert_eq!(3.14159, read_arr0[1]);
        assert_eq!(-2.718, read_arr0[2]);
    }

    #[test]
    fn empty_uint8_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let _arr0 = writer.init_elements_u8(0);
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let _read_elems0 = reader.read_elements_u8(0);
        assert_eq!(0, _read_elems0.len());
    }

    #[test]
    fn uint8_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_elements_u8(5);
            arr0[0] = 10;
            arr0[1] = 20;
            arr0[2] = 30;
            arr0[3] = 40;
            arr0[4] = 50;
        }

        let expected = [10, 20, 30, 40, 50, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_u8(5);
        assert_eq!(10, read_elems0[0]);
        assert_eq!(20, read_elems0[1]);
        assert_eq!(30, read_elems0[2]);
        assert_eq!(40, read_elems0[3]);
        assert_eq!(50, read_elems0[4]);
    }

    #[test]
    fn uint32_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_elements_u32(2);
            arr0[0] = 0x12345678;
            arr0[1] = 0x87654321;
        }

        let expected = [120, 86, 52, 18, 33, 67, 101, 135u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_u32(2);
        assert_eq!(0x12345678, read_elems0[0]);
        assert_eq!(0x87654321, read_elems0[1]);
    }

    #[test]
    fn uint32_initelements_with_alignment() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_u8(42);
            let arr1 = writer.init_elements_u32(2);
            arr1[0] = 0x11223344;
            arr1[1] = 0x55667788;
        }

        let expected = [42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        let read_elems1 = reader.read_elements_u32(2);
        assert_eq!(0x11223344, read_elems1[0]);
        assert_eq!(0x55667788, read_elems1[1]);
    }

    #[test]
    fn int32_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_elements_i32(3);
            arr0[0] = i32::MIN;
            arr0[1] = 0;
            arr0[2] = 2147483647;
        }

        let expected = [0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_i32(3);
        assert_eq!(i32::MIN, read_elems0[0]);
        assert_eq!(0, read_elems0[1]);
        assert_eq!(2147483647, read_elems0[2]);
    }

    #[test]
    fn float32_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_elements_f32(2);
            arr0[0] = 0.0;
            arr0[1] = 3.14159;
        }

        let expected = [0, 0, 0, 0, 208, 15, 73, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 8) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_f32(2);
        assert_eq!(0.0, read_elems0[0]);
        assert_eq!(3.14159, read_elems0[1]);
    }

    #[test]
    fn float64_initelements() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let arr0 = writer.init_elements_f64(2);
            arr0[0] = 0.0;
            arr0[1] = 3.14159;
        }

        let expected = [0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 16) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        let read_elems0 = reader.read_elements_f64(2);
        assert_eq!(0.0, read_elems0[0]);
        assert_eq!(3.14159, read_elems0[1]);
    }

    #[test]
    fn mixed_init_with_other_operations() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u8();
            unsafe { *ptr0 = 99; }
            writer.write_u32(42);
            let ptr2 = writer.init_f32();
            unsafe { *ptr2 = 1.5; }
            let arr3 = writer.init_array_f64(2);
            arr3[0] = 1.1;
            arr3[1] = 2.2;
        }

        let expected = [99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 32) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(99, reader.read_u8());
        assert_eq!(42, reader.read_u32());
        assert_eq!(1.5, reader.read_f32());
        let read_arr3 = reader.read_array_f64();
        assert_eq!(2, read_arr3.len());
        assert_eq!(1.1, read_arr3[0]);
        assert_eq!(2.2, read_arr3[1]);
    }

    #[test]
    fn all_init_methods_combined() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            let ptr0 = writer.init_u8();
            unsafe { *ptr0 = 42; }
            let ptr1 = writer.init_u32();
            unsafe { *ptr1 = 0x12345678; }
            let ptr2 = writer.init_f32();
            unsafe { *ptr2 = 1.23; }
            let arr3 = writer.init_array_i32(3);
            arr3[0] = -100;
            arr3[1] = 0;
            arr3[2] = 100;
            let arr4 = writer.init_elements_f64(2);
            arr4[0] = 1.234;
            arr4[1] = 5.678;
        }

        let expected = [42, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 88, 57, 180, 200, 118, 190, 243, 63, 131, 192, 202, 161, 69, 182, 22, 64, 0, 0, 0, 0u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 52) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(42, reader.read_u8());
        assert_eq!(0x12345678, reader.read_u32());
        assert_eq!(1.23, reader.read_f32());
        let read_arr3 = reader.read_array_i32();
        assert_eq!(3, read_arr3.len());
        assert_eq!(-100, read_arr3[0]);
        assert_eq!(0, read_arr3[1]);
        assert_eq!(100, read_arr3[2]);
        let read_elems4 = reader.read_elements_f64(2);
        assert_eq!(1.234, read_elems4[0]);
        assert_eq!(5.678, read_elems4[1]);
    }

    #[test]
    fn float32_extreme_values() {
        let mut storage = [0u64; 32];
        {
            let mut writer = Writer::from(&mut storage);
            writer.write_f32(3.4028235e+38);
            writer.write_f32(1.175494e-38);
            writer.write_f32(-3.4028235e+38);
        }

        let expected = [255, 255, 127, 127, 253, 255, 127, 0, 255, 255, 127, 255u8];
        let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, 12) };
        assert_eq!(&expected[..], actual);

        let mut reader = Reader::from(&mut storage);
        reader.reset();

        assert_eq!(3.4028235e+38, reader.read_f32());
        assert_eq!(1.175494e-38, reader.read_f32());
        assert_eq!(-3.4028235e+38, reader.read_f32());
    }

}