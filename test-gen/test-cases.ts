import { TestCase } from './types'

export const testCases: TestCase[] = [
  {
    name: 'Simple Uint8 write',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
    ],
    expectation: [42, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Multiple Uint8 writes',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 20,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 30,
      },
    ],
    expectation: [10, 20, 30, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint32 write',
    operations: [
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0x12345678,
      },
    ],
    expectation: [0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0],
  },
  {
    name: 'Uint32 with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0x12345678,
      },
    ],
    expectation: [10, 0, 0, 0, 0x78, 0x56, 0x34, 0x12],
  },
  {
    name: 'Int32 write',
    operations: [
      {
        type: 'write',
        dataType: 'Int32',
        value: -2147483648,
      },
    ],
    expectation: [0, 0, 0, 0x80, 0, 0, 0, 0],
  },
  {
    name: 'Int32 with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: -42,
      },
    ],
    expectation: [10, 0, 0, 0, 0xd6, 0xff, 0xff, 0xff],
  },
  {
    name: 'Float32 write',
    operations: [
      {
        type: 'write',
        dataType: 'Float32',
        value: 3.14159,
      },
    ],
    expectation: [0xd0, 0x0f, 0x49, 0x40, 0, 0, 0, 0],
  },
  {
    name: 'Float32 with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 5,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 3.14159,
      },
    ],
    expectation: [5, 0, 0, 0, 0xd0, 0x0f, 0x49, 0x40],
  },
  {
    name: 'Float32 special values',
    operations: [
      {
        type: 'write',
        dataType: 'Float32',
        value: 1.0,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: -1.0,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 0.0,
      },
    ],
    expectation: [0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x80, 0xbf, 0x00, 0x00, 0x00, 0x00],
  },
  {
    name: 'Float64 write',
    operations: [
      {
        type: 'write',
        dataType: 'Float64',
        value: 1.7976931348623157e308,
      },
    ],
    expectation: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xef, 0x7f, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Float64 with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 5,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 3.14159,
      },
    ],
    expectation: [5, 0, 0, 0, 0, 0, 0, 0, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21, 0x09, 0x40],
  },
  {
    name: 'Multiple mixed primitives',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0xfedcba98,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: -1,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 2.718,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: -2.718,
      },
    ],
    expectation: [
      0xff, 0x00, 0x00, 0x00, 0x98, 0xba, 0xdc, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xb6, 0xf3, 0x2d, 0x40, 0x58, 0x39, 0xb4, 0xc8, 0x76, 0xbe,
      0x05, 0xc0,
    ],
  },
  {
    name: 'Empty Uint8 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Uint8',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint8 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Uint8',
        value: [1, 2, 3, 4, 5],
      },
    ],
    expectation: [5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0],
  },
  {
    name: 'Uint32 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Uint32',
        value: [0x12345678, 0x87654321],
      },
    ],
    expectation: [2, 0, 0, 0, 0x78, 0x56, 0x34, 0x12, 0x21, 0x43, 0x65, 0x87],
  },
  {
    name: 'Uint32 array with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyArray',
        dataType: 'Uint32',
        value: [0x11223344, 0x55667788],
      },
    ],
    expectation: [42, 0, 0, 0, 2, 0, 0, 0, 0x44, 0x33, 0x22, 0x11, 0x88, 0x77, 0x66, 0x55],
  },
  {
    name: 'Int32 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Int32',
        value: [-2147483648, 0, 2147483647],
      },
    ],
    expectation: [3, 0, 0, 0, 0, 0, 0, 0x80, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0x7f],
  },
  {
    name: 'Int32 array with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'copyArray',
        dataType: 'Int32',
        value: [-1, 0, 1],
      },
    ],
    expectation: [255, 0, 0, 0, 3, 0, 0, 0, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0, 1, 0, 0, 0],
  },
  {
    name: 'Empty Float32 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Float32',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Float32 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Float32',
        value: [1.0, -1.0, 3.14159],
      },
    ],
    expectation: [3, 0, 0, 0, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x80, 0xbf, 0xd0, 0x0f, 0x49, 0x40],
  },
  {
    name: 'Float32 array with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyArray',
        dataType: 'Float32',
        value: [2.718, -2.718],
      },
    ],
    expectation: [42, 0, 0, 0, 2, 0, 0, 0, 0xb6, 0xf3, 0x2d, 0x40, 0xb6, 0xf3, 0x2d, 0xc0],
  },
  {
    name: 'Float64 array',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Float64',
        value: [0.0, 3.14159, -2.718],
      },
    ],
    expectation: [
      0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21,
      0x09, 0x40, 0x58, 0x39, 0xb4, 0xc8, 0x76, 0xbe, 0x05, 0xc0,
    ],
  },
  {
    name: 'Float64 array with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyArray',
        dataType: 'Float64',
        value: [1.0, -1.0],
      },
    ],
    expectation: [
      0x2a, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0xf0, 0xbf, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ],
  },
  {
    name: 'Empty Uint8 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Uint8',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint8 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Uint8',
        value: [10, 20, 30, 40, 50],
      },
    ],
    expectation: [10, 20, 30, 40, 50, 0, 0, 0],
  },
  {
    name: 'Uint32 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Uint32',
        value: [0x12345678, 0x87654321],
      },
    ],
    expectation: [0x78, 0x56, 0x34, 0x12, 0x21, 0x43, 0x65, 0x87],
  },
  {
    name: 'Uint32 elements with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyElements',
        dataType: 'Uint32',
        value: [0x11223344, 0x55667788],
      },
    ],
    expectation: [42, 0, 0, 0, 0x44, 0x33, 0x22, 0x11, 0x88, 0x77, 0x66, 0x55],
  },
  {
    name: 'Int32 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Int32',
        value: [-2147483648, 0, 2147483647],
      },
    ],
    expectation: [0, 0, 0, 0x80, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0x7f],
  },
  {
    name: 'Int32 elements with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'copyElements',
        dataType: 'Int32',
        value: [-1, 0, 1],
      },
    ],
    expectation: [255, 0, 0, 0, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0, 1, 0, 0, 0],
  },
  {
    name: 'Empty Float32 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Float32',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Float32 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Float32',
        value: [0.0, 1.0, -1.0],
      },
    ],
    expectation: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x80, 0xbf],
  },
  {
    name: 'Float32 elements with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyElements',
        dataType: 'Float32',
        value: [3.14159, 2.718],
      },
    ],
    expectation: [42, 0, 0, 0, 0xd0, 0x0f, 0x49, 0x40, 0xb6, 0xf3, 0x2d, 0x40],
  },
  {
    name: 'Float64 elements',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Float64',
        value: [0.0, 3.14159],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21, 0x09, 0x40],
  },
  {
    name: 'Float64 elements with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'copyElements',
        dataType: 'Float64',
        value: [1.0, -1.0],
      },
    ],
    expectation: [42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xf0, 0x3f, 0, 0, 0, 0, 0, 0, 0xf0, 0xbf],
  },
  {
    name: 'Tuple of Uint32',
    operations: [
      {
        type: 'copyElements',
        dataType: 'Uint32',
        value: [10, 20, 30],
      },
    ],
    expectation: [10, 0, 0, 0, 20, 0, 0, 0, 30, 0, 0, 0],
  },
  {
    name: 'Complex mixed types with arrays and elementss',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0xabcdef01,
      },
      {
        type: 'copyArray',
        dataType: 'Int32',
        value: [-100, 0, 100],
      },
      {
        type: 'copyElements',
        dataType: 'Float32',
        value: [1.234, 5.678],
      },
      {
        type: 'copyElements',
        dataType: 'Float64',
        value: [9.876],
      },
    ],
    expectation: [
      0xff, 0x00, 0x00, 0x00, 0x01, 0xef, 0xcd, 0xab, 0x03, 0x00, 0x00, 0x00, 0x9c, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x64, 0x00,
      0x00, 0x00, 0xb6, 0xf3, 0x9d, 0x3f, 0x2d, 0xb2, 0xb5, 0x40, 0x8d, 0x97, 0x6e, 0x12, 0x83, 0xc0, 0x23, 0x40, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ],
  },
  {
    name: 'Write sequence with all types',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0x12345678,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: -42,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 3.14159,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 2.71828,
      },
      {
        type: 'copyArray',
        dataType: 'Uint8',
        value: [1, 2, 3],
      },
      {
        type: 'copyArray',
        dataType: 'Uint32',
        value: [0xaabbccdd, 0xeeff0011],
      },
      {
        type: 'copyArray',
        dataType: 'Int32',
        value: [-1, 0, 1],
      },
      {
        type: 'copyArray',
        dataType: 'Float32',
        value: [1.0, -1.0],
      },
      {
        type: 'copyArray',
        dataType: 'Float64',
        value: [1.0, -1.0],
      },
      {
        type: 'copyElements',
        dataType: 'Uint8',
        value: [10, 20, 30],
      },
      {
        type: 'copyElements',
        dataType: 'Uint32',
        value: [0x11223344, 0x55667788],
      },
      {
        type: 'copyElements',
        dataType: 'Int32',
        value: [-100, 0, 100],
      },
      {
        type: 'copyElements',
        dataType: 'Float32',
        value: [2.718, -2.718],
      },
      {
        type: 'copyElements',
        dataType: 'Float64',
        value: [3.141592653589793, -3.141592653589793],
      },
    ],
    expectation: [
      0x2a, 0x00, 0x00, 0x00, 0x78, 0x56, 0x34, 0x12, 0xd6, 0xff, 0xff, 0xff, 0xd0, 0x0f, 0x49, 0x40, 0x90, 0xf7, 0xaa, 0x95, 0x09, 0xbf,
      0x05, 0x40, 0x03, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x00, 0x02, 0x00, 0x00, 0x00, 0xdd, 0xcc, 0xbb, 0xaa, 0x11, 0x00, 0xff, 0xee,
      0x03, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x80, 0x3f, 0x00, 0x00, 0x80, 0xbf, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0xbf, 0x0a, 0x14, 0x1e, 0x00, 0x44, 0x33, 0x22, 0x11, 0x88, 0x77, 0x66, 0x55, 0x9c, 0xff,
      0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xb6, 0xf3, 0x2d, 0x40, 0xb6, 0xf3, 0x2d, 0xc0, 0x18, 0x2d, 0x44, 0x54,
      0xfb, 0x21, 0x09, 0x40, 0x18, 0x2d, 0x44, 0x54, 0xfb, 0x21, 0x09, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ],
  },
  {
    name: 'Complex mixed types',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 99,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 42,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 1.5,
      },
      {
        type: 'copyArray',
        dataType: 'Float64',
        value: [1.1, 2.2],
      },
    ],
    expectation: [
      99, 0, 0, 0, 42, 0, 0, 0, 0x00, 0x00, 0xc0, 0x3f, 2, 0, 0, 0, 0x9a, 0x99, 0x99, 0x99, 0x99, 0x99, 0xf1, 0x3f, 0x9a, 0x99, 0x99, 0x99,
      0x99, 0x99, 0x01, 0x40,
    ],
  },
  {
    name: 'Back-to-back alignment requirements',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 1,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 2,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 3,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 4.0,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 5,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 6.0,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 7,
      },
    ],
    expectation: [
      1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0x00, 0x00, 0x80, 0x40, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x18, 0x40, 7, 0, 0, 0, 0, 0, 0,
      0,
    ],
  },
  {
    name: 'Empty arrays of different types',
    operations: [
      {
        type: 'copyArray',
        dataType: 'Uint8',
        value: [],
      },
      {
        type: 'copyArray',
        dataType: 'Uint32',
        value: [],
      },
      {
        type: 'copyArray',
        dataType: 'Int32',
        value: [],
      },
      {
        type: 'copyArray',
        dataType: 'Float32',
        value: [],
      },
      {
        type: 'copyArray',
        dataType: 'Float64',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Mixed operations with reset',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0x12345678,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 1.23,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 20,
      },
    ],
    expectation: [10, 0, 0, 0, 0x78, 0x56, 0x34, 0x12, 0xa4, 0x70, 0x9d, 0x3f, 20, 0, 0, 0],
  },
  {
    name: 'All possible primitive values',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 0,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 127,
      },
      {
        type: 'write',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 0,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 2147483647,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 4294967295,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: -2147483648,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: 0,
      },
      {
        type: 'write',
        dataType: 'Int32',
        value: 2147483647,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 0.0,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 1.175494e-38,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 3.4028235e38,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 0.0,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: -0.0,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 1.7976931348623157e308,
      },
      {
        type: 'write',
        dataType: 'Float64',
        value: 5e-324,
      },
    ],
    expectation: [
      0x00, 0x7f, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x80, 0x00, 0x00,
      0x00, 0x00, 0xff, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00, 0xfd, 0xff, 0x7f, 0x00, 0xff, 0xff, 0x7f, 0x7f, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xef, 0x7f, 0x01, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ],
  },

  {
    name: 'Simple Uint8 allocate',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 42,
      },
    ],
    expectation: [42, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Multiple Uint8 allocates',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 20,
      },
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 30,
      },
    ],
    expectation: [10, 20, 30, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint32 allocate',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint32',
        value: 0x12345678,
      },
    ],
    expectation: [0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0],
  },
  {
    name: 'Uint32 allocate with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 10,
      },
      {
        type: 'allocate',
        dataType: 'Uint32',
        value: 0x12345678,
      },
    ],
    expectation: [10, 0, 0, 0, 0x78, 0x56, 0x34, 0x12],
  },
  {
    name: 'Int32 allocate',
    operations: [
      {
        type: 'allocate',
        dataType: 'Int32',
        value: -2147483648,
      },
    ],
    expectation: [0, 0, 0, 0x80, 0, 0, 0, 0],
  },
  {
    name: 'Float32 allocate',
    operations: [
      {
        type: 'allocate',
        dataType: 'Float32',
        value: 3.14159,
      },
    ],
    expectation: [0xd0, 0x0f, 0x49, 0x40, 0, 0, 0, 0],
  },
  {
    name: 'Float32 allocate with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 5,
      },
      {
        type: 'allocate',
        dataType: 'Float32',
        value: 3.14159,
      },
    ],
    expectation: [5, 0, 0, 0, 0xd0, 0x0f, 0x49, 0x40],
  },
  {
    name: 'Float64 allocate',
    operations: [
      {
        type: 'allocate',
        dataType: 'Float64',
        value: 3.14159,
      },
    ],
    expectation: [0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21, 0x09, 0x40, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Float64 allocate with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 5,
      },
      {
        type: 'allocate',
        dataType: 'Float64',
        value: 3.14159,
      },
    ],
    expectation: [5, 0, 0, 0, 0, 0, 0, 0, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21, 0x09, 0x40],
  },
  {
    name: 'Mixed primitive allocates',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 255,
      },
      {
        type: 'allocate',
        dataType: 'Uint32',
        value: 0xfedcba98,
      },
      {
        type: 'allocate',
        dataType: 'Int32',
        value: -1,
      },
      {
        type: 'allocate',
        dataType: 'Float32',
        value: 2.718,
      },
      {
        type: 'allocate',
        dataType: 'Float64',
        value: -2.718,
      },
    ],
    expectation: [
      0xff, 0x00, 0x00, 0x00, 0x98, 0xba, 0xdc, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xb6, 0xf3, 0x2d, 0x40, 0x58, 0x39, 0xb4, 0xc8, 0x76, 0xbe,
      0x05, 0xc0,
    ],
  },
  {
    name: 'Empty Uint8 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Uint8',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint8 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Uint8',
        value: [1, 2, 3, 4, 5],
      },
    ],
    expectation: [5, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0],
  },
  {
    name: 'Uint32 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Uint32',
        value: [0x12345678, 0x87654321],
      },
    ],
    expectation: [2, 0, 0, 0, 0x78, 0x56, 0x34, 0x12, 0x21, 0x43, 0x65, 0x87],
  },
  {
    name: 'Uint32 allocateArray with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'allocateArray',
        dataType: 'Uint32',
        value: [0x11223344, 0x55667788],
      },
    ],
    expectation: [42, 0, 0, 0, 2, 0, 0, 0, 0x44, 0x33, 0x22, 0x11, 0x88, 0x77, 0x66, 0x55],
  },
  {
    name: 'Int32 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Int32',
        value: [-2147483648, 0, 2147483647],
      },
    ],
    expectation: [3, 0, 0, 0, 0, 0, 0, 0x80, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0x7f],
  },
  {
    name: 'Float32 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Float32',
        value: [0.0, 3.14159, -2.718],
      },
    ],
    expectation: [0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd0, 0x0f, 0x49, 0x40, 0xb6, 0xf3, 0x2d, 0xc0],
  },
  {
    name: 'Float64 allocateArray',
    operations: [
      {
        type: 'allocateArray',
        dataType: 'Float64',
        value: [0.0, 3.14159, -2.718],
      },
    ],
    expectation: [
      0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21,
      0x09, 0x40, 0x58, 0x39, 0xb4, 0xc8, 0x76, 0xbe, 0x05, 0xc0,
    ],
  },
  {
    name: 'Empty Uint8 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Uint8',
        value: [],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Uint8 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Uint8',
        value: [10, 20, 30, 40, 50],
      },
    ],
    expectation: [10, 20, 30, 40, 50, 0, 0, 0],
  },
  {
    name: 'Uint32 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Uint32',
        value: [0x12345678, 0x87654321],
      },
    ],
    expectation: [0x78, 0x56, 0x34, 0x12, 0x21, 0x43, 0x65, 0x87],
  },
  {
    name: 'Uint32 allocateElements with alignment',
    operations: [
      {
        type: 'write',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'allocateElements',
        dataType: 'Uint32',
        value: [0x11223344, 0x55667788],
      },
    ],
    expectation: [42, 0, 0, 0, 0x44, 0x33, 0x22, 0x11, 0x88, 0x77, 0x66, 0x55],
  },
  {
    name: 'Int32 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Int32',
        value: [-2147483648, 0, 2147483647],
      },
    ],
    expectation: [0, 0, 0, 0x80, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0x7f],
  },
  {
    name: 'Float32 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Float32',
        value: [0.0, 3.14159],
      },
    ],
    expectation: [0x00, 0x00, 0x00, 0x00, 0xd0, 0x0f, 0x49, 0x40],
  },
  {
    name: 'Float64 allocateElements',
    operations: [
      {
        type: 'allocateElements',
        dataType: 'Float64',
        value: [0.0, 3.14159],
      },
    ],
    expectation: [0, 0, 0, 0, 0, 0, 0, 0, 0x6e, 0x86, 0x1b, 0xf0, 0xf9, 0x21, 0x09, 0x40],
  },
  {
    name: 'Mixed allocate with other operations',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 99,
      },
      {
        type: 'write',
        dataType: 'Uint32',
        value: 42,
      },
      {
        type: 'allocate',
        dataType: 'Float32',
        value: 1.5,
      },
      {
        type: 'allocateArray',
        dataType: 'Float64',
        value: [1.1, 2.2],
      },
    ],
    expectation: [
      99, 0, 0, 0, 42, 0, 0, 0, 0x00, 0x00, 0xc0, 0x3f, 2, 0, 0, 0, 0x9a, 0x99, 0x99, 0x99, 0x99, 0x99, 0xf1, 0x3f, 0x9a, 0x99, 0x99, 0x99,
      0x99, 0x99, 0x01, 0x40,
    ],
  },
  {
    name: 'All allocation methods combined',
    operations: [
      {
        type: 'allocate',
        dataType: 'Uint8',
        value: 42,
      },
      {
        type: 'allocate',
        dataType: 'Uint32',
        value: 0x12345678,
      },
      {
        type: 'allocate',
        dataType: 'Float32',
        value: 1.23,
      },
      {
        type: 'allocateArray',
        dataType: 'Int32',
        value: [-100, 0, 100],
      },
      {
        type: 'allocateElements',
        dataType: 'Float64',
        value: [1.234, 5.678],
      },
    ],
    expectation: [
      0x2a, 0x00, 0x00, 0x00, 0x78, 0x56, 0x34, 0x12, 0xa4, 0x70, 0x9d, 0x3f, 0x03, 0x00, 0x00, 0x00, 0x9c, 0xff, 0xff, 0xff, 0x00, 0x00,
      0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x58, 0x39, 0xb4, 0xc8, 0x76, 0xbe, 0xf3, 0x3f, 0x83, 0xc0, 0xca, 0xa1,
      0x45, 0xb6, 0x16, 0x40, 0x00, 0x00, 0x00, 0x00,
    ],
  },
  {
    name: 'Float32 extreme values',
    operations: [
      {
        type: 'write',
        dataType: 'Float32',
        value: 3.4028235e38,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: 1.175494e-38,
      },
      {
        type: 'write',
        dataType: 'Float32',
        value: -3.4028235e38,
      },
    ],
    expectation: [0xff, 0xff, 0x7f, 0x7f, 0xfd, 0xff, 0x7f, 0x00, 0xff, 0xff, 0x7f, 0xff],
  },
]
