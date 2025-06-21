import { TestCase, Operation, TestGenerator, DataType } from '../types'

type ZigDataType = 'u8' | 'u32' | 'i32' | 'f32' | 'f64'

const dataTypeMap: Record<DataType, ZigDataType> = {
  Uint8: 'u8',
  Uint32: 'u32',
  Int32: 'i32',
  Float32: 'f32',
  Float64: 'f64',
}

// Format a value for Zig based on its type
function formatValue(value: number, dataType: ZigDataType): string {
  if (dataType === 'f32' || dataType === 'f64') {
    // Special case: handle negative zero
    if (Object.is(value, -0)) {
      return '-0.0'
    }

    // Special case: float literals in Zig need decimal point
    if (Number.isInteger(value) && !String(value).includes('e')) {
      return `${value}.0`
    }
  }

  // Special case: large u32 values need explicit type annotation
  if (dataType === 'u32' && value > 0x7fffffff) {
    return `@as(u32, 0x${value.toString(16)})`
  }

  // Default case: just convert to string
  return `${value}`
}

// Generate a single operation for Zig
function generateWriteOperation(op: Operation, index: number): string[] {
  const dataType = dataTypeMap[op.dataType]

  switch (op.type) {
    case 'write':
      return [`writer.write(${dataType}, ${formatValue(op.value, dataType)});`]

    case 'allocate':
      return [`const ptr${index} = writer.allocate(${dataType});`, `ptr${index}.* = ${formatValue(op.value, dataType)};`]

    case 'copyArray':
    case 'copyElements':
      return [
        `var arr${index} = [_]${dataType}{${op.value.map(v => formatValue(v, dataType)).join(', ')}};`,
        `writer.${op.type}(${dataType}, &arr${index});`,
      ]

    case 'allocateArray':
    case 'allocateElements':
      return [
        `const arr${index} = writer.${op.type}(${dataType}, ${op.value.length});`,
        ...op.value.map((v, i) => `arr${index}[${i}] = ${formatValue(v, dataType)};`),
      ]
  }
}

function generateReadOperation(op: Operation, index: number): string[] {
  const dataType = dataTypeMap[op.dataType]

  switch (op.type) {
    case 'write':
    case 'allocate':
      return [`try expectEqual(${formatValue(op.value, dataType)}, reader.read(${dataType}));`]

    case 'copyArray':
      return [`try expectEqualSlices(${dataType}, &arr${index}, reader.readArray(${dataType}));`]

    case 'copyElements':
      return [`try expectEqualSlices(${dataType}, &arr${index}, reader.readElements(${dataType}, ${op.value.length}));`]

    case 'allocateArray':
      return [`try expectEqualSlices(${dataType}, arr${index}, reader.readArray(${dataType}));`]

    case 'allocateElements':
      return [`try expectEqualSlices(${dataType}, arr${index}, reader.readElements(${dataType}, ${op.value.length}));`]
  }
}

// Generate a complete Zig test
function generateTestCase(testCase: TestCase): string {
  const indent = (lines: string[]): string => {
    return `    ${lines.join('\n    ')}\n`
  }

  let code = `test "${testCase.name}" {\n`

  code += indent(['var storage = [_]u64{0} ** 32;', 'var writer = Writer.from(&storage);', 'var reader = Reader.from(&storage);'])

  code += '\n'

  // Generate operations
  for (let i = 0; i < testCase.operations.length; i++) {
    code += indent(generateWriteOperation(testCase.operations[i], i))
  }

  code += '\n'

  // Verify buffer contents
  code += indent([
    `const expected = [_]u8{ ${testCase.expectation.join(', ')} };`,
    // `try expectEqual(expected.len, writer.channel.offset(u8));`,
    `try expectEqualSlices(u8, &expected, writer.channel.storage(u8)[0..${testCase.expectation.length}]);`,
  ])

  code += '\n'

  for (let i = 0; i < testCase.operations.length; i++) {
    code += indent(generateReadOperation(testCase.operations[i], i))
  }

  code += `}`

  return code
}

// Generate all Zig tests
function generateTestFile(testCases: TestCase[]): string {
  const parts: string[] = [
    `const std = @import("std");
const testing = std.testing;
const expect = testing.expect;
const expectEqual = testing.expectEqual;
const expectEqualSlices = testing.expectEqualSlices;
const conduit = @import("conduit.zig");
const Writer = conduit.Writer;
const Reader = conduit.Reader;
`,
  ]

  for (const testCase of testCases) {
    parts.push(generateTestCase(testCase))
  }

  return parts.join('\n\n')
}

export const zigGenerator: TestGenerator = {
  outputFile: 'implementations/wasm-zig/src/conduit/conduit.test.zig',
  generateTestFile,
}
