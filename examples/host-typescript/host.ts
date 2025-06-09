import { createInstance } from 'zaw'

type ExampleExports = {
  throwErrorWithStack: () => number
  usefulPanic: () => number
  echo: () => number
  xorInt32Array: () => number
  sumFloat64Array: () => number
  multiply4x4Float32: () => number
}

export type ExampleAPI = {
  throwErrorWithStack: () => void
  usefulPanic: () => void
  echo: (msg: string) => string
  xorInt32Array: (values: Int32Array) => number
  sumFloat64Array: (values: Float64Array) => number
  multiply4x4Float32: (left: Float32Array, right: Float32Array) => Float32Array
}

export async function initExample(wasmBuffer: Buffer): Promise<ExampleAPI> {
  let lastEcho: string

  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000_000,
    outputChannelSize: 1_000_000,
    log: message => {
      // used to check log is correctly implemented
      lastEcho = message
      console.log(message)
    },
  })

  return {
    throwErrorWithStack() {
      instance.handleError(() => instance.exports.throwErrorWithStack())
    },
    usefulPanic() {
      instance.handleError(() => instance.exports.usefulPanic())
    },
    echo(msg: string) {
      instance.getInput().writeUtf8String(msg)
      instance.handleError(() => instance.exports.echo())

      return lastEcho
    },
    xorInt32Array(values) {
      const input = instance.getInput()
      const output = instance.getOutput()

      input.copyInt32Array(values)

      instance.handleError(() => instance.exports.xorInt32Array())

      return output.readInt32()
    },
    sumFloat64Array(values) {
      const input = instance.getInput()
      const output = instance.getOutput()

      input.copyFloat64Array(values)

      instance.handleError(() => instance.exports.sumFloat64Array())

      return output.readFloat64()
    },
    multiply4x4Float32(left, right) {
      const input = instance.getInput()
      const output = instance.getOutput()

      input.copyFloat32Array(left)
      input.copyFloat32Array(right)

      instance.handleError(() => instance.exports.multiply4x4Float32())

      return output.readFloat32Array()
    },
  }
}
