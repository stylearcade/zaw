// Type definitions for the template generator system
export type DataType = 'Uint8' | 'Uint32' | 'Int32' | 'Float32' | 'Float64'

export type Allocation =
  | {
      type: 'primitive'
      dataType: DataType
      varName: string
      value: number
    }
  | {
      type: 'array' | 'elements'
      dataType: DataType
      varName: string
      value: number[]
    }

export type Operation =
  | {
      type: 'write' | 'allocate'
      dataType: DataType
      value: number
    }
  | {
      type: 'allocateArray' | 'allocateElements' | 'copyArray' | 'copyElements'
      dataType: DataType
      value: number[]
    }

export type TestCase = {
  name: string
  operations: Operation[]
  expectation: number[]
}

export type TestGenerator = {
  outputFile: string
  generateTestFile: (testCases: TestCase[]) => string
}
