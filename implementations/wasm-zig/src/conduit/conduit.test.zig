const std = @import("std");
const testing = std.testing;
const expect = testing.expect;
const expectEqual = testing.expectEqual;
const expectEqualSlices = testing.expectEqualSlices;
const conduit = @import("conduit.zig");
const Writer = conduit.Writer;
const Reader = conduit.Reader;


test "Simple Uint8 write" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);

    const expected = [_]u8{ 42, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(42, reader.read(u8));
}

test "Multiple Uint8 writes" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 10);
    writer.write(u8, 20);
    writer.write(u8, 30);

    const expected = [_]u8{ 10, 20, 30, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(20, reader.read(u8));
    try expectEqual(30, reader.read(u8));
}

test "Uint32 write" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u32, 305419896);

    const expected = [_]u8{ 120, 86, 52, 18, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(305419896, reader.read(u32));
}

test "Uint32 with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 10);
    writer.write(u32, 305419896);

    const expected = [_]u8{ 10, 0, 0, 0, 120, 86, 52, 18 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(305419896, reader.read(u32));
}

test "Int32 write" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(i32, -2147483648);

    const expected = [_]u8{ 0, 0, 0, 128, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(-2147483648, reader.read(i32));
}

test "Int32 with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 10);
    writer.write(i32, -42);

    const expected = [_]u8{ 10, 0, 0, 0, 214, 255, 255, 255 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(-42, reader.read(i32));
}

test "Float32 write" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(f32, 3.14159);

    const expected = [_]u8{ 208, 15, 73, 64, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(3.14159, reader.read(f32));
}

test "Float32 with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 5);
    writer.write(f32, 3.14159);

    const expected = [_]u8{ 5, 0, 0, 0, 208, 15, 73, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(5, reader.read(u8));
    try expectEqual(3.14159, reader.read(f32));
}

test "Float32 special values" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(f32, 1.0);
    writer.write(f32, -1.0);
    writer.write(f32, 0.0);

    const expected = [_]u8{ 0, 0, 128, 63, 0, 0, 128, 191, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqual(1.0, reader.read(f32));
    try expectEqual(-1.0, reader.read(f32));
    try expectEqual(0.0, reader.read(f32));
}

test "Float64 write" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(f64, 1.7976931348623157e+308);

    const expected = [_]u8{ 255, 255, 255, 255, 255, 255, 239, 127, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(1.7976931348623157e+308, reader.read(f64));
}

test "Float64 with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 5);
    writer.write(f64, 3.14159);

    const expected = [_]u8{ 5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(5, reader.read(u8));
    try expectEqual(3.14159, reader.read(f64));
}

test "Multiple mixed primitives" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 255);
    writer.write(u32, @as(u32, 0xfedcba98));
    writer.write(i32, -1);
    writer.write(f32, 2.718);
    writer.write(f64, -2.718);

    const expected = [_]u8{ 255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..24]);

    try expectEqual(255, reader.read(u8));
    try expectEqual(@as(u32, 0xfedcba98), reader.read(u32));
    try expectEqual(-1, reader.read(i32));
    try expectEqual(2.718, reader.read(f32));
    try expectEqual(-2.718, reader.read(f64));
}

test "Empty Uint8 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u8{};
    writer.copyArray(u8, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, &arr0, reader.readArray(u8));
}

test "Uint8 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u8{1, 2, 3, 4, 5};
    writer.copyArray(u8, &arr0);

    const expected = [_]u8{ 5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(u8, &arr0, reader.readArray(u8));
}

test "Uint32 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u32{305419896, @as(u32, 0x87654321)};
    writer.copyArray(u32, &arr0);

    const expected = [_]u8{ 2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(u32, &arr0, reader.readArray(u32));
}

test "Uint32 array with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]u32{287454020, 1432778632};
    writer.copyArray(u32, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(u32, &arr1, reader.readArray(u32));
}

test "Int32 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]i32{-2147483648, 0, 2147483647};
    writer.copyArray(i32, &arr0);

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(i32, &arr0, reader.readArray(i32));
}

test "Int32 array with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 255);
    var arr1 = [_]i32{-1, 0, 1};
    writer.copyArray(i32, &arr1);

    const expected = [_]u8{ 255, 0, 0, 0, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..20]);

    try expectEqual(255, reader.read(u8));
    try expectEqualSlices(i32, &arr1, reader.readArray(i32));
}

test "Empty Float32 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f32{};
    writer.copyArray(f32, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(f32, &arr0, reader.readArray(f32));
}

test "Float32 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f32{1.0, -1.0, 3.14159};
    writer.copyArray(f32, &arr0);

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 208, 15, 73, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(f32, &arr0, reader.readArray(f32));
}

test "Float32 array with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]f32{2.718, -2.718};
    writer.copyArray(f32, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 2, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(f32, &arr1, reader.readArray(f32));
}

test "Float64 array" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f64{0.0, 3.14159, -2.718};
    writer.copyArray(f64, &arr0);

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..32]);

    try expectEqualSlices(f64, &arr0, reader.readArray(f64));
}

test "Float64 array with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]f64{1.0, -1.0};
    writer.copyArray(f64, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..32]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(f64, &arr1, reader.readArray(f64));
}

test "Empty Uint8 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u8{};
    writer.copyElements(u8, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, &arr0, reader.readElements(u8, 0));
}

test "Uint8 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u8{10, 20, 30, 40, 50};
    writer.copyElements(u8, &arr0);

    const expected = [_]u8{ 10, 20, 30, 40, 50, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, &arr0, reader.readElements(u8, 5));
}

test "Uint32 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u32{305419896, @as(u32, 0x87654321)};
    writer.copyElements(u32, &arr0);

    const expected = [_]u8{ 120, 86, 52, 18, 33, 67, 101, 135 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u32, &arr0, reader.readElements(u32, 2));
}

test "Uint32 elements with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]u32{287454020, 1432778632};
    writer.copyElements(u32, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(u32, &arr1, reader.readElements(u32, 2));
}

test "Int32 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]i32{-2147483648, 0, 2147483647};
    writer.copyElements(i32, &arr0);

    const expected = [_]u8{ 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(i32, &arr0, reader.readElements(i32, 3));
}

test "Int32 elements with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 255);
    var arr1 = [_]i32{-1, 0, 1};
    writer.copyElements(i32, &arr1);

    const expected = [_]u8{ 255, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(255, reader.read(u8));
    try expectEqualSlices(i32, &arr1, reader.readElements(i32, 3));
}

test "Empty Float32 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f32{};
    writer.copyElements(f32, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(f32, &arr0, reader.readElements(f32, 0));
}

test "Float32 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f32{0.0, 1.0, -1.0};
    writer.copyElements(f32, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(f32, &arr0, reader.readElements(f32, 3));
}

test "Float32 elements with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]f32{3.14159, 2.718};
    writer.copyElements(f32, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(f32, &arr1, reader.readElements(f32, 2));
}

test "Float64 elements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]f64{0.0, 3.14159};
    writer.copyElements(f64, &arr0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(f64, &arr0, reader.readElements(f64, 2));
}

test "Float64 elements with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    var arr1 = [_]f64{1.0, -1.0};
    writer.copyElements(f64, &arr1);

    const expected = [_]u8{ 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..24]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(f64, &arr1, reader.readElements(f64, 2));
}

test "Tuple of Uint32" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u32{10, 20, 30};
    writer.copyElements(u32, &arr0);

    const expected = [_]u8{ 10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(u32, &arr0, reader.readElements(u32, 3));
}

test "Complex mixed types with arrays and elementss" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 255);
    writer.write(u32, @as(u32, 0xabcdef01));
    var arr2 = [_]i32{-100, 0, 100};
    writer.copyArray(i32, &arr2);
    var arr3 = [_]f32{1.234, 5.678};
    writer.copyElements(f32, &arr3);
    var arr4 = [_]f64{9.876};
    writer.copyElements(f64, &arr4);

    const expected = [_]u8{ 255, 0, 0, 0, 1, 239, 205, 171, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 157, 63, 45, 178, 181, 64, 141, 151, 110, 18, 131, 192, 35, 64, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..48]);

    try expectEqual(255, reader.read(u8));
    try expectEqual(@as(u32, 0xabcdef01), reader.read(u32));
    try expectEqualSlices(i32, &arr2, reader.readArray(i32));
    try expectEqualSlices(f32, &arr3, reader.readElements(f32, 2));
    try expectEqualSlices(f64, &arr4, reader.readElements(f64, 1));
}

test "Write sequence with all types" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    writer.write(u32, 305419896);
    writer.write(i32, -42);
    writer.write(f32, 3.14159);
    writer.write(f64, 2.71828);
    var arr5 = [_]u8{1, 2, 3};
    writer.copyArray(u8, &arr5);
    var arr6 = [_]u32{@as(u32, 0xaabbccdd), @as(u32, 0xeeff0011)};
    writer.copyArray(u32, &arr6);
    var arr7 = [_]i32{-1, 0, 1};
    writer.copyArray(i32, &arr7);
    var arr8 = [_]f32{1.0, -1.0};
    writer.copyArray(f32, &arr8);
    var arr9 = [_]f64{1.0, -1.0};
    writer.copyArray(f64, &arr9);
    var arr10 = [_]u8{10, 20, 30};
    writer.copyElements(u8, &arr10);
    var arr11 = [_]u32{287454020, 1432778632};
    writer.copyElements(u32, &arr11);
    var arr12 = [_]i32{-100, 0, 100};
    writer.copyElements(i32, &arr12);
    var arr13 = [_]f32{2.718, -2.718};
    writer.copyElements(f32, &arr13);
    var arr14 = [_]f64{3.141592653589793, -3.141592653589793};
    writer.copyElements(f64, &arr14);

    const expected = [_]u8{ 42, 0, 0, 0, 120, 86, 52, 18, 214, 255, 255, 255, 208, 15, 73, 64, 144, 247, 170, 149, 9, 191, 5, 64, 3, 0, 0, 0, 1, 2, 3, 0, 2, 0, 0, 0, 221, 204, 187, 170, 17, 0, 255, 238, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 10, 20, 30, 0, 68, 51, 34, 17, 136, 119, 102, 85, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192, 24, 45, 68, 84, 251, 33, 9, 64, 24, 45, 68, 84, 251, 33, 9, 192, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..152]);

    try expectEqual(42, reader.read(u8));
    try expectEqual(305419896, reader.read(u32));
    try expectEqual(-42, reader.read(i32));
    try expectEqual(3.14159, reader.read(f32));
    try expectEqual(2.71828, reader.read(f64));
    try expectEqualSlices(u8, &arr5, reader.readArray(u8));
    try expectEqualSlices(u32, &arr6, reader.readArray(u32));
    try expectEqualSlices(i32, &arr7, reader.readArray(i32));
    try expectEqualSlices(f32, &arr8, reader.readArray(f32));
    try expectEqualSlices(f64, &arr9, reader.readArray(f64));
    try expectEqualSlices(u8, &arr10, reader.readElements(u8, 3));
    try expectEqualSlices(u32, &arr11, reader.readElements(u32, 2));
    try expectEqualSlices(i32, &arr12, reader.readElements(i32, 3));
    try expectEqualSlices(f32, &arr13, reader.readElements(f32, 2));
    try expectEqualSlices(f64, &arr14, reader.readElements(f64, 2));
}

test "Complex mixed types" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 99);
    writer.write(u32, 42);
    writer.write(f32, 1.5);
    var arr3 = [_]f64{1.1, 2.2};
    writer.copyArray(f64, &arr3);

    const expected = [_]u8{ 99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..32]);

    try expectEqual(99, reader.read(u8));
    try expectEqual(42, reader.read(u32));
    try expectEqual(1.5, reader.read(f32));
    try expectEqualSlices(f64, &arr3, reader.readArray(f64));
}

test "Back-to-back alignment requirements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 1);
    writer.write(u32, 2);
    writer.write(u8, 3);
    writer.write(f32, 4.0);
    writer.write(u8, 5);
    writer.write(f64, 6.0);
    writer.write(u8, 7);

    const expected = [_]u8{ 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 128, 64, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 64, 7, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..40]);

    try expectEqual(1, reader.read(u8));
    try expectEqual(2, reader.read(u32));
    try expectEqual(3, reader.read(u8));
    try expectEqual(4.0, reader.read(f32));
    try expectEqual(5, reader.read(u8));
    try expectEqual(6.0, reader.read(f64));
    try expectEqual(7, reader.read(u8));
}

test "Empty arrays of different types" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    var arr0 = [_]u8{};
    writer.copyArray(u8, &arr0);
    var arr1 = [_]u32{};
    writer.copyArray(u32, &arr1);
    var arr2 = [_]i32{};
    writer.copyArray(i32, &arr2);
    var arr3 = [_]f32{};
    writer.copyArray(f32, &arr3);
    var arr4 = [_]f64{};
    writer.copyArray(f64, &arr4);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..20]);

    try expectEqualSlices(u8, &arr0, reader.readArray(u8));
    try expectEqualSlices(u32, &arr1, reader.readArray(u32));
    try expectEqualSlices(i32, &arr2, reader.readArray(i32));
    try expectEqualSlices(f32, &arr3, reader.readArray(f32));
    try expectEqualSlices(f64, &arr4, reader.readArray(f64));
}

test "Mixed operations with reset" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 10);
    writer.write(u32, 305419896);
    writer.write(f32, 1.23);
    writer.write(u8, 20);

    const expected = [_]u8{ 10, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 20, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(305419896, reader.read(u32));
    try expectEqual(1.23, reader.read(f32));
    try expectEqual(20, reader.read(u8));
}

test "All possible primitive values" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 0);
    writer.write(u8, 127);
    writer.write(u8, 255);
    writer.write(u32, 0);
    writer.write(u32, 2147483647);
    writer.write(u32, @as(u32, 0xffffffff));
    writer.write(i32, -2147483648);
    writer.write(i32, 0);
    writer.write(i32, 2147483647);
    writer.write(f32, 0.0);
    writer.write(f32, 1.175494e-38);
    writer.write(f32, 3.4028235e+38);
    writer.write(f64, 0.0);
    writer.write(f64, -0.0);
    writer.write(f64, 1.7976931348623157e+308);
    writer.write(f64, 5e-324);

    const expected = [_]u8{ 0, 127, 255, 0, 0, 0, 0, 0, 255, 255, 255, 127, 255, 255, 255, 255, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127, 0, 0, 0, 0, 253, 255, 127, 0, 255, 255, 127, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 255, 239, 127, 1, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..72]);

    try expectEqual(0, reader.read(u8));
    try expectEqual(127, reader.read(u8));
    try expectEqual(255, reader.read(u8));
    try expectEqual(0, reader.read(u32));
    try expectEqual(2147483647, reader.read(u32));
    try expectEqual(@as(u32, 0xffffffff), reader.read(u32));
    try expectEqual(-2147483648, reader.read(i32));
    try expectEqual(0, reader.read(i32));
    try expectEqual(2147483647, reader.read(i32));
    try expectEqual(0.0, reader.read(f32));
    try expectEqual(1.175494e-38, reader.read(f32));
    try expectEqual(3.4028235e+38, reader.read(f32));
    try expectEqual(0.0, reader.read(f64));
    try expectEqual(-0.0, reader.read(f64));
    try expectEqual(1.7976931348623157e+308, reader.read(f64));
    try expectEqual(5e-324, reader.read(f64));
}

test "Simple Uint8 allocate" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u8);
    ptr0.* = 42;

    const expected = [_]u8{ 42, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(42, reader.read(u8));
}

test "Multiple Uint8 allocates" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u8);
    ptr0.* = 10;
    const ptr1 = writer.allocate(u8);
    ptr1.* = 20;
    const ptr2 = writer.allocate(u8);
    ptr2.* = 30;

    const expected = [_]u8{ 10, 20, 30, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(20, reader.read(u8));
    try expectEqual(30, reader.read(u8));
}

test "Uint32 allocate" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u32);
    ptr0.* = 305419896;

    const expected = [_]u8{ 120, 86, 52, 18, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(305419896, reader.read(u32));
}

test "Uint32 allocate with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 10);
    const ptr1 = writer.allocate(u32);
    ptr1.* = 305419896;

    const expected = [_]u8{ 10, 0, 0, 0, 120, 86, 52, 18 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(10, reader.read(u8));
    try expectEqual(305419896, reader.read(u32));
}

test "Int32 allocate" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(i32);
    ptr0.* = -2147483648;

    const expected = [_]u8{ 0, 0, 0, 128, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(-2147483648, reader.read(i32));
}

test "Float32 allocate" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(f32);
    ptr0.* = 3.14159;

    const expected = [_]u8{ 208, 15, 73, 64, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(3.14159, reader.read(f32));
}

test "Float32 allocate with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 5);
    const ptr1 = writer.allocate(f32);
    ptr1.* = 3.14159;

    const expected = [_]u8{ 5, 0, 0, 0, 208, 15, 73, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqual(5, reader.read(u8));
    try expectEqual(3.14159, reader.read(f32));
}

test "Float64 allocate" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(f64);
    ptr0.* = 3.14159;

    const expected = [_]u8{ 110, 134, 27, 240, 249, 33, 9, 64, 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(3.14159, reader.read(f64));
}

test "Float64 allocate with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 5);
    const ptr1 = writer.allocate(f64);
    ptr1.* = 3.14159;

    const expected = [_]u8{ 5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(5, reader.read(u8));
    try expectEqual(3.14159, reader.read(f64));
}

test "Mixed primitive allocates" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u8);
    ptr0.* = 255;
    const ptr1 = writer.allocate(u32);
    ptr1.* = @as(u32, 0xfedcba98);
    const ptr2 = writer.allocate(i32);
    ptr2.* = -1;
    const ptr3 = writer.allocate(f32);
    ptr3.* = 2.718;
    const ptr4 = writer.allocate(f64);
    ptr4.* = -2.718;

    const expected = [_]u8{ 255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..24]);

    try expectEqual(255, reader.read(u8));
    try expectEqual(@as(u32, 0xfedcba98), reader.read(u32));
    try expectEqual(-1, reader.read(i32));
    try expectEqual(2.718, reader.read(f32));
    try expectEqual(-2.718, reader.read(f64));
}

test "Empty Uint8 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(u8, 0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, arr0, reader.readArray(u8));
}

test "Uint8 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(u8, 5);
    arr0[0] = 1;
    arr0[1] = 2;
    arr0[2] = 3;
    arr0[3] = 4;
    arr0[4] = 5;

    const expected = [_]u8{ 5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(u8, arr0, reader.readArray(u8));
}

test "Uint32 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(u32, 2);
    arr0[0] = 305419896;
    arr0[1] = @as(u32, 0x87654321);

    const expected = [_]u8{ 2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(u32, arr0, reader.readArray(u32));
}

test "Uint32 allocateArray with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    const arr1 = writer.allocateArray(u32, 2);
    arr1[0] = 287454020;
    arr1[1] = 1432778632;

    const expected = [_]u8{ 42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(u32, arr1, reader.readArray(u32));
}

test "Int32 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(i32, 3);
    arr0[0] = -2147483648;
    arr0[1] = 0;
    arr0[2] = 2147483647;

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(i32, arr0, reader.readArray(i32));
}

test "Float32 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(f32, 3);
    arr0[0] = 0.0;
    arr0[1] = 3.14159;
    arr0[2] = -2.718;

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(f32, arr0, reader.readArray(f32));
}

test "Float64 allocateArray" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateArray(f64, 3);
    arr0[0] = 0.0;
    arr0[1] = 3.14159;
    arr0[2] = -2.718;

    const expected = [_]u8{ 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..32]);

    try expectEqualSlices(f64, arr0, reader.readArray(f64));
}

test "Empty Uint8 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(u8, 0);

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, arr0, reader.readElements(u8, 0));
}

test "Uint8 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(u8, 5);
    arr0[0] = 10;
    arr0[1] = 20;
    arr0[2] = 30;
    arr0[3] = 40;
    arr0[4] = 50;

    const expected = [_]u8{ 10, 20, 30, 40, 50, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u8, arr0, reader.readElements(u8, 5));
}

test "Uint32 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(u32, 2);
    arr0[0] = 305419896;
    arr0[1] = @as(u32, 0x87654321);

    const expected = [_]u8{ 120, 86, 52, 18, 33, 67, 101, 135 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(u32, arr0, reader.readElements(u32, 2));
}

test "Uint32 allocateElements with alignment" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(u8, 42);
    const arr1 = writer.allocateElements(u32, 2);
    arr1[0] = 287454020;
    arr1[1] = 1432778632;

    const expected = [_]u8{ 42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqual(42, reader.read(u8));
    try expectEqualSlices(u32, arr1, reader.readElements(u32, 2));
}

test "Int32 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(i32, 3);
    arr0[0] = -2147483648;
    arr0[1] = 0;
    arr0[2] = 2147483647;

    const expected = [_]u8{ 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqualSlices(i32, arr0, reader.readElements(i32, 3));
}

test "Float32 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(f32, 2);
    arr0[0] = 0.0;
    arr0[1] = 3.14159;

    const expected = [_]u8{ 0, 0, 0, 0, 208, 15, 73, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..8]);

    try expectEqualSlices(f32, arr0, reader.readElements(f32, 2));
}

test "Float64 allocateElements" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const arr0 = writer.allocateElements(f64, 2);
    arr0[0] = 0.0;
    arr0[1] = 3.14159;

    const expected = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..16]);

    try expectEqualSlices(f64, arr0, reader.readElements(f64, 2));
}

test "Mixed allocate with other operations" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u8);
    ptr0.* = 99;
    writer.write(u32, 42);
    const ptr2 = writer.allocate(f32);
    ptr2.* = 1.5;
    const arr3 = writer.allocateArray(f64, 2);
    arr3[0] = 1.1;
    arr3[1] = 2.2;

    const expected = [_]u8{ 99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..32]);

    try expectEqual(99, reader.read(u8));
    try expectEqual(42, reader.read(u32));
    try expectEqual(1.5, reader.read(f32));
    try expectEqualSlices(f64, arr3, reader.readArray(f64));
}

test "All allocation methods combined" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    const ptr0 = writer.allocate(u8);
    ptr0.* = 42;
    const ptr1 = writer.allocate(u32);
    ptr1.* = 305419896;
    const ptr2 = writer.allocate(f32);
    ptr2.* = 1.23;
    const arr3 = writer.allocateArray(i32, 3);
    arr3[0] = -100;
    arr3[1] = 0;
    arr3[2] = 100;
    const arr4 = writer.allocateElements(f64, 2);
    arr4[0] = 1.234;
    arr4[1] = 5.678;

    const expected = [_]u8{ 42, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 88, 57, 180, 200, 118, 190, 243, 63, 131, 192, 202, 161, 69, 182, 22, 64, 0, 0, 0, 0 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..52]);

    try expectEqual(42, reader.read(u8));
    try expectEqual(305419896, reader.read(u32));
    try expectEqual(1.23, reader.read(f32));
    try expectEqualSlices(i32, arr3, reader.readArray(i32));
    try expectEqualSlices(f64, arr4, reader.readElements(f64, 2));
}

test "Float32 extreme values" {
    var storage = [_]u64{0} ** 32;
    var writer = Writer.from(&storage);
    var reader = Reader.from(&storage);

    writer.write(f32, 3.4028235e+38);
    writer.write(f32, 1.175494e-38);
    writer.write(f32, -3.4028235e+38);

    const expected = [_]u8{ 255, 255, 127, 127, 253, 255, 127, 0, 255, 255, 127, 255 };
    try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..12]);

    try expectEqual(3.4028235e+38, reader.read(f32));
    try expectEqual(1.175494e-38, reader.read(f32));
    try expectEqual(-3.4028235e+38, reader.read(f32));
}