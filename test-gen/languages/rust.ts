import { TestCase, Operation, TestGenerator, DataType } from '../types'

type RustDataType = 'u8' | 'u32' | 'i32' | 'f32' | 'f64'

const dataTypeMap: Record<DataType, RustDataType> = {
  Uint8: 'u8',
  Uint32: 'u32',
  Int32: 'i32',
  Float32: 'f32',
  Float64: 'f64',
}

// Format a value for Rust based on its type
function formatValue(value: number, dataType: RustDataType): string {
  if (dataType === 'f32' || dataType === 'f64') {
    // Special case: handle negative zero
    if (Object.is(value, -0)) {
      return '-0.0'
    }

    // Special case: float literals in Rust need decimal point or suffix
    if (Number.isInteger(value) && !String(value).includes('e')) {
      return `${value}.0`
    }
  }

  // Special case: large u32 values as hex
  if (dataType === 'u32' && value > 0x1000000) {
    return `0x${value.toString(16)}`
  }

  // Special case: i32 minimum value
  if (dataType === 'i32' && value === -2147483648) {
    return 'i32::MIN'
  }

  // Default case: just convert to string
  return `${value}`
}

// Generate a single operation for Rust
function generateWriteOperation(op: Operation, index: number): string[] {
  const dataType = dataTypeMap[op.dataType]

  switch (op.type) {
    case 'write':
      return [`writer.write_${dataType}(${formatValue(op.value, dataType)});`]

    case 'init':
      return [`let ptr${index} = writer.init_${dataType}();`, `unsafe { *ptr${index} = ${formatValue(op.value, dataType)}; }`]

    case 'copyArray':
      return [`writer.copy_array_${dataType}(&[${op.value.map(v => formatValue(v, dataType)).join(', ')}]);`]

    case 'copyElements':
      return [`writer.copy_elements_${dataType}(&[${op.value.map(v => formatValue(v, dataType)).join(', ')}]);`]

    case 'initArray':
      if (op.value.length === 0) {
        return [`let _arr${index} = writer.init_array_${dataType}(0);`]
      }
      return [
        `let arr${index} = writer.init_array_${dataType}(${op.value.length});`,
        ...op.value.map((v, i) => `arr${index}[${i}] = ${formatValue(v, dataType)};`),
      ]

    case 'initElements':
      if (op.value.length === 0) {
        return [`let _arr${index} = writer.init_elements_${dataType}(0);`]
      }
      return [
        `let arr${index} = writer.init_elements_${dataType}(${op.value.length});`,
        ...op.value.map((v, i) => `arr${index}[${i}] = ${formatValue(v, dataType)};`),
      ]
  }
}

function generateReadOperation(op: Operation, index: number): string[] {
  const dataType = dataTypeMap[op.dataType]

  switch (op.type) {
    case 'write':
    case 'init':
      return [`assert_eq!(${formatValue(op.value, dataType)}, reader.read_${dataType}());`]

    case 'copyArray':
    case 'initArray':
      if (op.value.length === 0) {
        return [`let _read_arr${index} = reader.read_array_${dataType}();`, `assert_eq!(0, _read_arr${index}.len());`]
      }
      return [
        `let read_arr${index} = reader.read_array_${dataType}();`,
        `assert_eq!(${op.value.length}, read_arr${index}.len());`,
        ...op.value.map((v, i) => `assert_eq!(${formatValue(v, dataType)}, read_arr${index}[${i}]);`),
      ]

    case 'copyElements':
    case 'initElements':
      if (op.value.length === 0) {
        return [`let _read_elems${index} = reader.read_elements_${dataType}(0);`, `assert_eq!(0, _read_elems${index}.len());`]
      }
      return [
        `let read_elems${index} = reader.read_elements_${dataType}(${op.value.length});`,
        ...op.value.map((v, i) => `assert_eq!(${formatValue(v, dataType)}, read_elems${index}[${i}]);`),
      ]
  }
}

// Generate a complete Rust test
function generateTestCase(testCase: TestCase): string {
  const indent = (lines: string[]): string => {
    return `        ${lines.join('\n        ')}\n`
  }

  let code = `    #[test]\n    fn ${testCase.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}() {\n`

  code += indent(['let mut storage = [0u64; 32];'])

  code += indent(['{', '    let mut writer = Writer::from(&mut storage);'])

  // Generate operations
  for (let i = 0; i < testCase.operations.length; i++) {
    const operations = generateWriteOperation(testCase.operations[i], i)
    for (const op of operations) {
      code += `            ${op}\n`
    }
  }

  code += indent(['}'])

  code += '\n'

  // Verify buffer contents
  code += indent([
    `let expected = [${testCase.expectation.join(', ')}u8];`,
    `let actual = unsafe { std::slice::from_raw_parts(storage.as_ptr() as *const u8, ${testCase.expectation.length}) };`,
    'assert_eq!(&expected[..], actual);',
  ])

  code += '\n'

  // Create reader and read back
  code += indent(['let mut reader = Reader::from(&mut storage);', 'reader.reset();'])

  code += '\n'

  for (let i = 0; i < testCase.operations.length; i++) {
    code += indent(generateReadOperation(testCase.operations[i], i))
  }

  code += `    }`

  return code
}

// Generate all Rust tests
function generateTestFile(testCases: TestCase[]): string {
  const parts: string[] = [
    `use super::{Reader, Writer};

#[cfg(test)]
mod tests {
    use super::*;`,
  ]

  for (const testCase of testCases) {
    parts.push(generateTestCase(testCase))
  }

  parts.push('}')

  return parts.join('\n\n')
}

export const rustGenerator: TestGenerator = {
  outputFile: 'implementations/wasm-rust/conduit/test.rs',
  generateTestFile,
}
