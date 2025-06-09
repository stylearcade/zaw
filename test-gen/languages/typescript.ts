import { TestCase, Operation, TestGenerator, DataType } from '../types'

// Generates a number that can survive a float64 => float32 => float64 conversion
function formatFloat32(value: number): number {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setFloat32(0, value, true)
  return view.getFloat32(0, true)
}

// Format a value for TypeScript based on its type
function formatValue(value: number, dataType: DataType): string {
  // Special case: handle negative zero
  if ((dataType === 'Float32' || dataType === 'Float64') && Object.is(value, -0)) {
    return '-0'
  }

  if (dataType === 'Float32') return JSON.stringify(formatFloat32(value))

  // Special case: large integers as hex
  if ((dataType === 'Uint32' || dataType === 'Int32') && Math.abs(value) > 0x1000000) {
    if (value < 0) {
      // For negative values, don't use hex notation as it causes syntax errors
      return String(value)
    }
    return `0x${value.toString(16)}`
  }

  // Default case: just convert to JSON string (handles special numbers correctly)
  return JSON.stringify(value)
}

// Generate a single write operation for TypeScript
function generateWriteOperation(op: Operation, index: number): string[] {
  const dataType = op.dataType

  switch (op.type) {
    case 'write':
      return [`writer.write${dataType}(${formatValue(op.value, dataType)});`]

    case 'allocate':
      return [`const ptr${index} = writer.allocate${dataType}();`, `ptr${index}(${formatValue(op.value, dataType)});`]

    case 'copyArray':
      return [`writer.copy${dataType}Array([${op.value.map(v => formatValue(v, dataType)).join(', ')}]);`]

    case 'copyElements':
      return [`writer.copy${dataType}Elements([${op.value.map(v => formatValue(v, dataType)).join(', ')}]);`]

    case 'allocateArray':
      return [
        `const arr${index} = writer.allocate${dataType}Array(${op.value.length});`,
        ...op.value.map((v, i) => `arr${index}[${i}] = ${formatValue(v, dataType)};`),
      ]

    case 'allocateElements':
      return [
        `const arr${index} = writer.allocate${dataType}Elements(${op.value.length});`,
        ...op.value.map((v, i) => `arr${index}[${i}] = ${formatValue(v, dataType)};`),
      ]
  }
}

// Generate a read operation for TypeScript
function generateReadOperation(op: Operation, index: number): string[] {
  const dataType = op.dataType

  switch (op.type) {
    case 'write':
    case 'allocate':
      return [`expect(reader.read${dataType}()).toEqual(${formatValue(op.value, dataType)});`]

    case 'copyArray':
    case 'allocateArray':
      return [
        `const readArr${index} = reader.read${dataType}Array();`,
        `expect(readArr${index}.length).toEqual(${op.value.length});`,
        ...op.value.map((v, i) => `expect(readArr${index}[${i}]).toEqual(${formatValue(v, dataType)});`),
      ]

    case 'copyElements':
    case 'allocateElements':
      return [
        `const readElems${index} = reader.read${dataType}Elements(${op.value.length});`,
        ...op.value.map((v, i) => `expect(readElems${index}[${i}]).toEqual(${formatValue(v, dataType)});`),
      ]
  }
}

// Generate a complete TypeScript test
function generateTestCase(testCase: TestCase): string {
  const indent = (lines: string[]): string => {
    return `  ${lines.join('\n  ')}\n`
  }

  let code = `test('${testCase.name.replace(/'/g, "\\'")}', () => {`

  code += indent([
    '// Create a new buffer for testing',
    'const buffer = new ArrayBuffer(1024);',
    'const writer = new Writer(buffer);',
    'const reader = new Reader(buffer);',
    'writer.reset();',
  ])

  code += '\n'

  // Generate operations
  for (let i = 0; i < testCase.operations.length; i++) {
    code += indent(generateWriteOperation(testCase.operations[i], i))
  }

  code += '\n'

  // Verify buffer contents
  code += indent([
    '// Verify buffer contents',
    `const expected = new Uint8Array([${testCase.expectation.join(', ')}]);`,
    `const actual = new Uint8Array(buffer, 0, ${testCase.expectation.length});`,
    'expect(Array.from(actual)).toEqual(Array.from(expected));',
  ])

  code += '\n'

  // Reset reader
  code += indent(['// Read back values', 'reader.reset();'])

  code += '\n'

  // Read back operations
  for (let i = 0; i < testCase.operations.length; i++) {
    code += indent(generateReadOperation(testCase.operations[i], i))
  }

  code += `});`

  return code
}

// Generate all TypeScript tests
function generateTestFile(testCases: TestCase[]): string {
  const parts: string[] = [
    `import { describe, test, expect } from 'vitest'
import { Reader, Writer } from './conduit'

describe('Channel Protocol Tests', () => {`,
  ]

  for (const testCase of testCases) {
    parts.push(indent(generateTestCase(testCase), 2))
  }

  parts.push('});')

  return parts.join('\n\n')
}

// Helper for indentation
function indent(code: string, spaces: number): string {
  const padding = ' '.repeat(spaces)
  return code
    .split('\n')
    .map(line => padding + line)
    .join('\n')
}

export const typescriptGenerator: TestGenerator = {
  outputFile: 'implementations/host-typescript/src/conduit.test.ts',
  generateTestFile,
}
