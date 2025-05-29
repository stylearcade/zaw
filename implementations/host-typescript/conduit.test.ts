import { describe, test, expect } from 'vitest'
import { Reader, Writer } from './conduit'

describe('Channel Protocol Tests', () => {

  test('Simple Uint8 write', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
  });

  test('Multiple Uint8 writes', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(10);
    writer.writeUint8(20);
    writer.writeUint8(30);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 20, 30, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readUint8()).toEqual(20);
    expect(reader.readUint8()).toEqual(30);
  });

  test('Uint32 write', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint32(0x12345678);
  
    // Verify buffer contents
    const expected = new Uint8Array([120, 86, 52, 18, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint32()).toEqual(0x12345678);
  });

  test('Uint32 with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(10);
    writer.writeUint32(0x12345678);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 0, 0, 0, 120, 86, 52, 18]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readUint32()).toEqual(0x12345678);
  });

  test('Int32 write', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeInt32(-2147483648);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 128, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readInt32()).toEqual(-2147483648);
  });

  test('Int32 with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(10);
    writer.writeInt32(-42);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 0, 0, 0, 214, 255, 255, 255]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readInt32()).toEqual(-42);
  });

  test('Float32 write', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeFloat32(3.141590118408203);
  
    // Verify buffer contents
    const expected = new Uint8Array([208, 15, 73, 64, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat32()).toEqual(3.141590118408203);
  });

  test('Float32 with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(5);
    writer.writeFloat32(3.141590118408203);
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 208, 15, 73, 64]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(5);
    expect(reader.readFloat32()).toEqual(3.141590118408203);
  });

  test('Float32 special values', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeFloat32(1);
    writer.writeFloat32(-1);
    writer.writeFloat32(0);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 128, 63, 0, 0, 128, 191, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat32()).toEqual(1);
    expect(reader.readFloat32()).toEqual(-1);
    expect(reader.readFloat32()).toEqual(0);
  });

  test('Float64 write', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeFloat64(1.7976931348623157e+308);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 255, 255, 255, 255, 255, 239, 127, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat64()).toEqual(1.7976931348623157e+308);
  });

  test('Float64 with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(5);
    writer.writeFloat64(3.14159);
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(5);
    expect(reader.readFloat64()).toEqual(3.14159);
  });

  test('Multiple mixed primitives', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(255);
    writer.writeUint32(0xfedcba98);
    writer.writeInt32(-1);
    writer.writeFloat32(2.7179999351501465);
    writer.writeFloat64(-2.718);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192]);
    const actual = new Uint8Array(buffer, 0, 24);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(255);
    expect(reader.readUint32()).toEqual(0xfedcba98);
    expect(reader.readInt32()).toEqual(-1);
    expect(reader.readFloat32()).toEqual(2.7179999351501465);
    expect(reader.readFloat64()).toEqual(-2.718);
  });

  test('Empty Uint8 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint8Array([]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint8Array();
    expect(readArr0.length).toEqual(0);
  });

  test('Uint8 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint8Array([1, 2, 3, 4, 5]);
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint8Array();
    expect(readArr0.length).toEqual(5);
    expect(readArr0[0]).toEqual(1);
    expect(readArr0[1]).toEqual(2);
    expect(readArr0[2]).toEqual(3);
    expect(readArr0[3]).toEqual(4);
    expect(readArr0[4]).toEqual(5);
  });

  test('Uint32 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint32Array([0x12345678, 0x87654321]);
  
    // Verify buffer contents
    const expected = new Uint8Array([2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint32Array();
    expect(readArr0.length).toEqual(2);
    expect(readArr0[0]).toEqual(0x12345678);
    expect(readArr0[1]).toEqual(0x87654321);
  });

  test('Uint32 array with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyUint32Array([0x11223344, 0x55667788]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readArr1 = reader.readUint32Array();
    expect(readArr1.length).toEqual(2);
    expect(readArr1[0]).toEqual(0x11223344);
    expect(readArr1[1]).toEqual(0x55667788);
  });

  test('Int32 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyInt32Array([-2147483648, 0, 0x7fffffff]);
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readInt32Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(-2147483648);
    expect(readArr0[1]).toEqual(0);
    expect(readArr0[2]).toEqual(0x7fffffff);
  });

  test('Int32 array with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(255);
    writer.copyInt32Array([-1, 0, 1]);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 0, 0, 0, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 20);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(255);
    const readArr1 = reader.readInt32Array();
    expect(readArr1.length).toEqual(3);
    expect(readArr1[0]).toEqual(-1);
    expect(readArr1[1]).toEqual(0);
    expect(readArr1[2]).toEqual(1);
  });

  test('Empty Float32 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat32Array([]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readFloat32Array();
    expect(readArr0.length).toEqual(0);
  });

  test('Float32 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat32Array([1, -1, 3.141590118408203]);
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 208, 15, 73, 64]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readFloat32Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(1);
    expect(readArr0[1]).toEqual(-1);
    expect(readArr0[2]).toEqual(3.141590118408203);
  });

  test('Float32 array with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyFloat32Array([2.7179999351501465, -2.7179999351501465]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 2, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readArr1 = reader.readFloat32Array();
    expect(readArr1.length).toEqual(2);
    expect(readArr1[0]).toEqual(2.7179999351501465);
    expect(readArr1[1]).toEqual(-2.7179999351501465);
  });

  test('Float64 array', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat64Array([0, 3.14159, -2.718]);
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192]);
    const actual = new Uint8Array(buffer, 0, 32);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readFloat64Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(0);
    expect(readArr0[1]).toEqual(3.14159);
    expect(readArr0[2]).toEqual(-2.718);
  });

  test('Float64 array with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyFloat64Array([1, -1]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 32);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readArr1 = reader.readFloat64Array();
    expect(readArr1.length).toEqual(2);
    expect(readArr1[0]).toEqual(1);
    expect(readArr1[1]).toEqual(-1);
  });

  test('Empty Uint8 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint8Elements([]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint8Elements(0);
  });

  test('Uint8 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint8Elements([10, 20, 30, 40, 50]);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 20, 30, 40, 50, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint8Elements(5);
    expect(readElems0[0]).toEqual(10);
    expect(readElems0[1]).toEqual(20);
    expect(readElems0[2]).toEqual(30);
    expect(readElems0[3]).toEqual(40);
    expect(readElems0[4]).toEqual(50);
  });

  test('Uint32 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint32Elements([0x12345678, 0x87654321]);
  
    // Verify buffer contents
    const expected = new Uint8Array([120, 86, 52, 18, 33, 67, 101, 135]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint32Elements(2);
    expect(readElems0[0]).toEqual(0x12345678);
    expect(readElems0[1]).toEqual(0x87654321);
  });

  test('Uint32 tuple with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyUint32Elements([0x11223344, 0x55667788]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readElems1 = reader.readUint32Elements(2);
    expect(readElems1[0]).toEqual(0x11223344);
    expect(readElems1[1]).toEqual(0x55667788);
  });

  test('Int32 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyInt32Elements([-2147483648, 0, 0x7fffffff]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readInt32Elements(3);
    expect(readElems0[0]).toEqual(-2147483648);
    expect(readElems0[1]).toEqual(0);
    expect(readElems0[2]).toEqual(0x7fffffff);
  });

  test('Int32 tuple with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(255);
    writer.copyInt32Elements([-1, 0, 1]);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(255);
    const readElems1 = reader.readInt32Elements(3);
    expect(readElems1[0]).toEqual(-1);
    expect(readElems1[1]).toEqual(0);
    expect(readElems1[2]).toEqual(1);
  });

  test('Empty Float32 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat32Elements([]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readFloat32Elements(0);
  });

  test('Float32 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat32Elements([0, 1, -1]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readFloat32Elements(3);
    expect(readElems0[0]).toEqual(0);
    expect(readElems0[1]).toEqual(1);
    expect(readElems0[2]).toEqual(-1);
  });

  test('Float32 tuple with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyFloat32Elements([3.141590118408203, 2.7179999351501465]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 64]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readElems1 = reader.readFloat32Elements(2);
    expect(readElems1[0]).toEqual(3.141590118408203);
    expect(readElems1[1]).toEqual(2.7179999351501465);
  });

  test('Float64 tuple', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyFloat64Elements([0, 3.14159]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readFloat64Elements(2);
    expect(readElems0[0]).toEqual(0);
    expect(readElems0[1]).toEqual(3.14159);
  });

  test('Float64 tuple with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.copyFloat64Elements([1, -1]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191]);
    const actual = new Uint8Array(buffer, 0, 24);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readElems1 = reader.readFloat64Elements(2);
    expect(readElems1[0]).toEqual(1);
    expect(readElems1[1]).toEqual(-1);
  });

  test('Tuple of Uint32', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint32Elements([10, 20, 30]);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint32Elements(3);
    expect(readElems0[0]).toEqual(10);
    expect(readElems0[1]).toEqual(20);
    expect(readElems0[2]).toEqual(30);
  });

  test('Complex mixed types with arrays and tuples', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(255);
    writer.writeUint32(0xabcdef01);
    writer.copyInt32Array([-100, 0, 100]);
    writer.copyFloat32Elements([1.2339999675750732, 5.677999973297119]);
    writer.copyFloat64Elements([9.876]);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 0, 0, 0, 1, 239, 205, 171, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 157, 63, 45, 178, 181, 64, 141, 151, 110, 18, 131, 192, 35, 64, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 48);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(255);
    expect(reader.readUint32()).toEqual(0xabcdef01);
    const readArr2 = reader.readInt32Array();
    expect(readArr2.length).toEqual(3);
    expect(readArr2[0]).toEqual(-100);
    expect(readArr2[1]).toEqual(0);
    expect(readArr2[2]).toEqual(100);
    const readElems3 = reader.readFloat32Elements(2);
    expect(readElems3[0]).toEqual(1.2339999675750732);
    expect(readElems3[1]).toEqual(5.677999973297119);
    const readElems4 = reader.readFloat64Elements(1);
    expect(readElems4[0]).toEqual(9.876);
  });

  test('Write sequence with all types', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    writer.writeUint32(0x12345678);
    writer.writeInt32(-42);
    writer.writeFloat32(3.141590118408203);
    writer.writeFloat64(2.71828);
    writer.copyUint8Array([1, 2, 3]);
    writer.copyUint32Array([0xaabbccdd, 0xeeff0011]);
    writer.copyInt32Array([-1, 0, 1]);
    writer.copyFloat32Array([1, -1]);
    writer.copyFloat64Array([1, -1]);
    writer.copyUint8Elements([10, 20, 30]);
    writer.copyUint32Elements([0x11223344, 0x55667788]);
    writer.copyInt32Elements([-100, 0, 100]);
    writer.copyFloat32Elements([2.7179999351501465, -2.7179999351501465]);
    writer.copyFloat64Elements([3.141592653589793, -3.141592653589793]);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 120, 86, 52, 18, 214, 255, 255, 255, 208, 15, 73, 64, 144, 247, 170, 149, 9, 191, 5, 64, 3, 0, 0, 0, 1, 2, 3, 0, 2, 0, 0, 0, 221, 204, 187, 170, 17, 0, 255, 238, 3, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 128, 63, 0, 0, 128, 191, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 0, 0, 0, 0, 0, 0, 240, 191, 10, 20, 30, 0, 68, 51, 34, 17, 136, 119, 102, 85, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 182, 243, 45, 64, 182, 243, 45, 192, 24, 45, 68, 84, 251, 33, 9, 64, 24, 45, 68, 84, 251, 33, 9, 192, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 152);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    expect(reader.readUint32()).toEqual(0x12345678);
    expect(reader.readInt32()).toEqual(-42);
    expect(reader.readFloat32()).toEqual(3.141590118408203);
    expect(reader.readFloat64()).toEqual(2.71828);
    const readArr5 = reader.readUint8Array();
    expect(readArr5.length).toEqual(3);
    expect(readArr5[0]).toEqual(1);
    expect(readArr5[1]).toEqual(2);
    expect(readArr5[2]).toEqual(3);
    const readArr6 = reader.readUint32Array();
    expect(readArr6.length).toEqual(2);
    expect(readArr6[0]).toEqual(0xaabbccdd);
    expect(readArr6[1]).toEqual(0xeeff0011);
    const readArr7 = reader.readInt32Array();
    expect(readArr7.length).toEqual(3);
    expect(readArr7[0]).toEqual(-1);
    expect(readArr7[1]).toEqual(0);
    expect(readArr7[2]).toEqual(1);
    const readArr8 = reader.readFloat32Array();
    expect(readArr8.length).toEqual(2);
    expect(readArr8[0]).toEqual(1);
    expect(readArr8[1]).toEqual(-1);
    const readArr9 = reader.readFloat64Array();
    expect(readArr9.length).toEqual(2);
    expect(readArr9[0]).toEqual(1);
    expect(readArr9[1]).toEqual(-1);
    const readElems10 = reader.readUint8Elements(3);
    expect(readElems10[0]).toEqual(10);
    expect(readElems10[1]).toEqual(20);
    expect(readElems10[2]).toEqual(30);
    const readElems11 = reader.readUint32Elements(2);
    expect(readElems11[0]).toEqual(0x11223344);
    expect(readElems11[1]).toEqual(0x55667788);
    const readElems12 = reader.readInt32Elements(3);
    expect(readElems12[0]).toEqual(-100);
    expect(readElems12[1]).toEqual(0);
    expect(readElems12[2]).toEqual(100);
    const readElems13 = reader.readFloat32Elements(2);
    expect(readElems13[0]).toEqual(2.7179999351501465);
    expect(readElems13[1]).toEqual(-2.7179999351501465);
    const readElems14 = reader.readFloat64Elements(2);
    expect(readElems14[0]).toEqual(3.141592653589793);
    expect(readElems14[1]).toEqual(-3.141592653589793);
  });

  test('Complex mixed types', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(99);
    writer.writeUint32(42);
    writer.writeFloat32(1.5);
    writer.copyFloat64Array([1.1, 2.2]);
  
    // Verify buffer contents
    const expected = new Uint8Array([99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64]);
    const actual = new Uint8Array(buffer, 0, 32);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(99);
    expect(reader.readUint32()).toEqual(42);
    expect(reader.readFloat32()).toEqual(1.5);
    const readArr3 = reader.readFloat64Array();
    expect(readArr3.length).toEqual(2);
    expect(readArr3[0]).toEqual(1.1);
    expect(readArr3[1]).toEqual(2.2);
  });

  test('Back-to-back alignment requirements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(1);
    writer.writeUint32(2);
    writer.writeUint8(3);
    writer.writeFloat32(4);
    writer.writeUint8(5);
    writer.writeFloat64(6);
    writer.writeUint8(7);
  
    // Verify buffer contents
    const expected = new Uint8Array([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 128, 64, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 64, 7, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 40);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(1);
    expect(reader.readUint32()).toEqual(2);
    expect(reader.readUint8()).toEqual(3);
    expect(reader.readFloat32()).toEqual(4);
    expect(reader.readUint8()).toEqual(5);
    expect(reader.readFloat64()).toEqual(6);
    expect(reader.readUint8()).toEqual(7);
  });

  test('Empty arrays of different types', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.copyUint8Array([]);
    writer.copyUint32Array([]);
    writer.copyInt32Array([]);
    writer.copyFloat32Array([]);
    writer.copyFloat64Array([]);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 20);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint8Array();
    expect(readArr0.length).toEqual(0);
    const readArr1 = reader.readUint32Array();
    expect(readArr1.length).toEqual(0);
    const readArr2 = reader.readInt32Array();
    expect(readArr2.length).toEqual(0);
    const readArr3 = reader.readFloat32Array();
    expect(readArr3.length).toEqual(0);
    const readArr4 = reader.readFloat64Array();
    expect(readArr4.length).toEqual(0);
  });

  test('Mixed operations with reset', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(10);
    writer.writeUint32(0x12345678);
    writer.writeFloat32(1.2300000190734863);
    writer.writeUint8(20);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 20, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readUint32()).toEqual(0x12345678);
    expect(reader.readFloat32()).toEqual(1.2300000190734863);
    expect(reader.readUint8()).toEqual(20);
  });

  test('All possible primitive values', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(0);
    writer.writeUint8(127);
    writer.writeUint8(255);
    writer.writeUint32(0);
    writer.writeUint32(0x7fffffff);
    writer.writeUint32(0xffffffff);
    writer.writeInt32(-2147483648);
    writer.writeInt32(0);
    writer.writeInt32(0x7fffffff);
    writer.writeFloat32(0);
    writer.writeFloat32(1.1754939304327482e-38);
    writer.writeFloat32(3.4028234663852886e+38);
    writer.writeFloat64(0);
    writer.writeFloat64(-0);
    writer.writeFloat64(1.7976931348623157e+308);
    writer.writeFloat64(5e-324);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 127, 255, 0, 0, 0, 0, 0, 255, 255, 255, 127, 255, 255, 255, 255, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127, 0, 0, 0, 0, 253, 255, 127, 0, 255, 255, 127, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 255, 239, 127, 1, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 72);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(0);
    expect(reader.readUint8()).toEqual(127);
    expect(reader.readUint8()).toEqual(255);
    expect(reader.readUint32()).toEqual(0);
    expect(reader.readUint32()).toEqual(0x7fffffff);
    expect(reader.readUint32()).toEqual(0xffffffff);
    expect(reader.readInt32()).toEqual(-2147483648);
    expect(reader.readInt32()).toEqual(0);
    expect(reader.readInt32()).toEqual(0x7fffffff);
    expect(reader.readFloat32()).toEqual(0);
    expect(reader.readFloat32()).toEqual(1.1754939304327482e-38);
    expect(reader.readFloat32()).toEqual(3.4028234663852886e+38);
    expect(reader.readFloat64()).toEqual(0);
    expect(reader.readFloat64()).toEqual(-0);
    expect(reader.readFloat64()).toEqual(1.7976931348623157e+308);
    expect(reader.readFloat64()).toEqual(5e-324);
  });

  test('Simple Uint8 allocate', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint8();
    ptr0(42);
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
  });

  test('Multiple Uint8 allocates', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint8();
    ptr0(10);
    const ptr1 = writer.allocateUint8();
    ptr1(20);
    const ptr2 = writer.allocateUint8();
    ptr2(30);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 20, 30, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readUint8()).toEqual(20);
    expect(reader.readUint8()).toEqual(30);
  });

  test('Uint32 allocate', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint32();
    ptr0(0x12345678);
  
    // Verify buffer contents
    const expected = new Uint8Array([120, 86, 52, 18, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint32()).toEqual(0x12345678);
  });

  test('Uint32 allocate with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(10);
    const ptr1 = writer.allocateUint32();
    ptr1(0x12345678);
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 0, 0, 0, 120, 86, 52, 18]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(10);
    expect(reader.readUint32()).toEqual(0x12345678);
  });

  test('Int32 allocate', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateInt32();
    ptr0(-2147483648);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 128, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readInt32()).toEqual(-2147483648);
  });

  test('Float32 allocate', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateFloat32();
    ptr0(3.141590118408203);
  
    // Verify buffer contents
    const expected = new Uint8Array([208, 15, 73, 64, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat32()).toEqual(3.141590118408203);
  });

  test('Float32 allocate with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(5);
    const ptr1 = writer.allocateFloat32();
    ptr1(3.141590118408203);
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 208, 15, 73, 64]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(5);
    expect(reader.readFloat32()).toEqual(3.141590118408203);
  });

  test('Float64 allocate', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateFloat64();
    ptr0(3.14159);
  
    // Verify buffer contents
    const expected = new Uint8Array([110, 134, 27, 240, 249, 33, 9, 64, 0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat64()).toEqual(3.14159);
  });

  test('Float64 allocate with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(5);
    const ptr1 = writer.allocateFloat64();
    ptr1(3.14159);
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(5);
    expect(reader.readFloat64()).toEqual(3.14159);
  });

  test('Mixed primitive allocates', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint8();
    ptr0(255);
    const ptr1 = writer.allocateUint32();
    ptr1(0xfedcba98);
    const ptr2 = writer.allocateInt32();
    ptr2(-1);
    const ptr3 = writer.allocateFloat32();
    ptr3(2.7179999351501465);
    const ptr4 = writer.allocateFloat64();
    ptr4(-2.718);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 0, 0, 0, 152, 186, 220, 254, 255, 255, 255, 255, 182, 243, 45, 64, 88, 57, 180, 200, 118, 190, 5, 192]);
    const actual = new Uint8Array(buffer, 0, 24);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(255);
    expect(reader.readUint32()).toEqual(0xfedcba98);
    expect(reader.readInt32()).toEqual(-1);
    expect(reader.readFloat32()).toEqual(2.7179999351501465);
    expect(reader.readFloat64()).toEqual(-2.718);
  });

  test('Empty Uint8 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint8Array(0);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint8Array();
    expect(readArr0.length).toEqual(0);
  });

  test('Uint8 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint8Array(5);
    arr0[0] = 1;
    arr0[1] = 2;
    arr0[2] = 3;
    arr0[3] = 4;
    arr0[4] = 5;
  
    // Verify buffer contents
    const expected = new Uint8Array([5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint8Array();
    expect(readArr0.length).toEqual(5);
    expect(readArr0[0]).toEqual(1);
    expect(readArr0[1]).toEqual(2);
    expect(readArr0[2]).toEqual(3);
    expect(readArr0[3]).toEqual(4);
    expect(readArr0[4]).toEqual(5);
  });

  test('Uint32 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint32Array(2);
    arr0[0] = 0x12345678;
    arr0[1] = 0x87654321;
  
    // Verify buffer contents
    const expected = new Uint8Array([2, 0, 0, 0, 120, 86, 52, 18, 33, 67, 101, 135]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readUint32Array();
    expect(readArr0.length).toEqual(2);
    expect(readArr0[0]).toEqual(0x12345678);
    expect(readArr0[1]).toEqual(0x87654321);
  });

  test('Uint32 allocateArray with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    const arr1 = writer.allocateUint32Array(2);
    arr1[0] = 0x11223344;
    arr1[1] = 0x55667788;
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 2, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readArr1 = reader.readUint32Array();
    expect(readArr1.length).toEqual(2);
    expect(readArr1[0]).toEqual(0x11223344);
    expect(readArr1[1]).toEqual(0x55667788);
  });

  test('Int32 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateInt32Array(3);
    arr0[0] = -2147483648;
    arr0[1] = 0;
    arr0[2] = 0x7fffffff;
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readInt32Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(-2147483648);
    expect(readArr0[1]).toEqual(0);
    expect(readArr0[2]).toEqual(0x7fffffff);
  });

  test('Float32 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateFloat32Array(3);
    arr0[0] = 0;
    arr0[1] = 3.141590118408203;
    arr0[2] = -2.7179999351501465;
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 208, 15, 73, 64, 182, 243, 45, 192]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readFloat32Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(0);
    expect(readArr0[1]).toEqual(3.141590118408203);
    expect(readArr0[2]).toEqual(-2.7179999351501465);
  });

  test('Float64 allocateArray', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateFloat64Array(3);
    arr0[0] = 0;
    arr0[1] = 3.14159;
    arr0[2] = -2.718;
  
    // Verify buffer contents
    const expected = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64, 88, 57, 180, 200, 118, 190, 5, 192]);
    const actual = new Uint8Array(buffer, 0, 32);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readArr0 = reader.readFloat64Array();
    expect(readArr0.length).toEqual(3);
    expect(readArr0[0]).toEqual(0);
    expect(readArr0[1]).toEqual(3.14159);
    expect(readArr0[2]).toEqual(-2.718);
  });

  test('Empty Uint8 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint8Elements(0);
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint8Elements(0);
  });

  test('Uint8 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint8Elements(5);
    arr0[0] = 10;
    arr0[1] = 20;
    arr0[2] = 30;
    arr0[3] = 40;
    arr0[4] = 50;
  
    // Verify buffer contents
    const expected = new Uint8Array([10, 20, 30, 40, 50, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint8Elements(5);
    expect(readElems0[0]).toEqual(10);
    expect(readElems0[1]).toEqual(20);
    expect(readElems0[2]).toEqual(30);
    expect(readElems0[3]).toEqual(40);
    expect(readElems0[4]).toEqual(50);
  });

  test('Uint32 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateUint32Elements(2);
    arr0[0] = 0x12345678;
    arr0[1] = 0x87654321;
  
    // Verify buffer contents
    const expected = new Uint8Array([120, 86, 52, 18, 33, 67, 101, 135]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readUint32Elements(2);
    expect(readElems0[0]).toEqual(0x12345678);
    expect(readElems0[1]).toEqual(0x87654321);
  });

  test('Uint32 allocateElements with alignment', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeUint8(42);
    const arr1 = writer.allocateUint32Elements(2);
    arr1[0] = 0x11223344;
    arr1[1] = 0x55667788;
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 68, 51, 34, 17, 136, 119, 102, 85]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    const readElems1 = reader.readUint32Elements(2);
    expect(readElems1[0]).toEqual(0x11223344);
    expect(readElems1[1]).toEqual(0x55667788);
  });

  test('Int32 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateInt32Elements(3);
    arr0[0] = -2147483648;
    arr0[1] = 0;
    arr0[2] = 0x7fffffff;
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 128, 0, 0, 0, 0, 255, 255, 255, 127]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readInt32Elements(3);
    expect(readElems0[0]).toEqual(-2147483648);
    expect(readElems0[1]).toEqual(0);
    expect(readElems0[2]).toEqual(0x7fffffff);
  });

  test('Float32 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateFloat32Elements(2);
    arr0[0] = 0;
    arr0[1] = 3.141590118408203;
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 208, 15, 73, 64]);
    const actual = new Uint8Array(buffer, 0, 8);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readFloat32Elements(2);
    expect(readElems0[0]).toEqual(0);
    expect(readElems0[1]).toEqual(3.141590118408203);
  });

  test('Float64 allocateElements', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const arr0 = writer.allocateFloat64Elements(2);
    arr0[0] = 0;
    arr0[1] = 3.14159;
  
    // Verify buffer contents
    const expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 110, 134, 27, 240, 249, 33, 9, 64]);
    const actual = new Uint8Array(buffer, 0, 16);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    const readElems0 = reader.readFloat64Elements(2);
    expect(readElems0[0]).toEqual(0);
    expect(readElems0[1]).toEqual(3.14159);
  });

  test('Mixed allocate with other operations', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint8();
    ptr0(99);
    writer.writeUint32(42);
    const ptr2 = writer.allocateFloat32();
    ptr2(1.5);
    const arr3 = writer.allocateFloat64Array(2);
    arr3[0] = 1.1;
    arr3[1] = 2.2;
  
    // Verify buffer contents
    const expected = new Uint8Array([99, 0, 0, 0, 42, 0, 0, 0, 0, 0, 192, 63, 2, 0, 0, 0, 154, 153, 153, 153, 153, 153, 241, 63, 154, 153, 153, 153, 153, 153, 1, 64]);
    const actual = new Uint8Array(buffer, 0, 32);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(99);
    expect(reader.readUint32()).toEqual(42);
    expect(reader.readFloat32()).toEqual(1.5);
    const readArr3 = reader.readFloat64Array();
    expect(readArr3.length).toEqual(2);
    expect(readArr3[0]).toEqual(1.1);
    expect(readArr3[1]).toEqual(2.2);
  });

  test('All allocation methods combined', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    const ptr0 = writer.allocateUint8();
    ptr0(42);
    const ptr1 = writer.allocateUint32();
    ptr1(0x12345678);
    const ptr2 = writer.allocateFloat32();
    ptr2(1.2300000190734863);
    const arr3 = writer.allocateInt32Array(3);
    arr3[0] = -100;
    arr3[1] = 0;
    arr3[2] = 100;
    const arr4 = writer.allocateFloat64Elements(2);
    arr4[0] = 1.234;
    arr4[1] = 5.678;
  
    // Verify buffer contents
    const expected = new Uint8Array([42, 0, 0, 0, 120, 86, 52, 18, 164, 112, 157, 63, 3, 0, 0, 0, 156, 255, 255, 255, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 88, 57, 180, 200, 118, 190, 243, 63, 131, 192, 202, 161, 69, 182, 22, 64, 0, 0, 0, 0]);
    const actual = new Uint8Array(buffer, 0, 52);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readUint8()).toEqual(42);
    expect(reader.readUint32()).toEqual(0x12345678);
    expect(reader.readFloat32()).toEqual(1.2300000190734863);
    const readArr3 = reader.readInt32Array();
    expect(readArr3.length).toEqual(3);
    expect(readArr3[0]).toEqual(-100);
    expect(readArr3[1]).toEqual(0);
    expect(readArr3[2]).toEqual(100);
    const readElems4 = reader.readFloat64Elements(2);
    expect(readElems4[0]).toEqual(1.234);
    expect(readElems4[1]).toEqual(5.678);
  });

  test('Float32 extreme values', () => {  // Create a new buffer for testing
    const buffer = new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    const reader = new Reader(buffer);
    writer.reset();
  
    writer.writeFloat32(3.4028234663852886e+38);
    writer.writeFloat32(1.1754939304327482e-38);
    writer.writeFloat32(-3.4028234663852886e+38);
  
    // Verify buffer contents
    const expected = new Uint8Array([255, 255, 127, 127, 253, 255, 127, 0, 255, 255, 127, 255]);
    const actual = new Uint8Array(buffer, 0, 12);
    expect(Array.from(actual)).toEqual(Array.from(expected));
  
    // Read back values
    reader.reset();
  
    expect(reader.readFloat32()).toEqual(3.4028234663852886e+38);
    expect(reader.readFloat32()).toEqual(1.1754939304327482e-38);
    expect(reader.readFloat32()).toEqual(-3.4028234663852886e+38);
  });

});