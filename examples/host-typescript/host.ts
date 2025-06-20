import { createInstance, Result } from '../../implementations/host-typescript/src/index'

type ExampleExports = {
  throwErrorWithStack: () => Result
  usefulPanic: () => Result
  echo: () => Result
  xorInt32Array: () => Result
  sumFloat64Array: () => Result
  multiply4x4Float32: () => Result
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
  let lastLogMsg: string

  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000_000,
    outputChannelSize: 1_000_000,
    log: message => {
      // used to check log is correctly implemented
      lastLogMsg = message
      console.log(message)
    },
  })

  return {
    throwErrorWithStack: instance.bind(
      instance.exports.throwErrorWithStack,
      () => {},
      () => {},
    ),
    usefulPanic: instance.bind(
      instance.exports.usefulPanic,
      () => {},
      () => {},
    ),
    echo: instance.bind(
      instance.exports.echo,
      (input, [msg]) => input.writeUtf8String(msg),
      () => lastLogMsg,
    ),
    xorInt32Array: instance.bind(
      instance.exports.xorInt32Array,
      (input, [values]) => input.copyInt32Array(values),
      output => output.readInt32(),
    ),
    sumFloat64Array: instance.bind(
      instance.exports.sumFloat64Array,
      (input, [values]) => input.copyFloat64Array(values),
      output => output.readFloat64(),
    ),
    multiply4x4Float32: instance.bind(
      instance.exports.multiply4x4Float32,
      (input, [left, right]) => {
        input.copyFloat32Array(left)
        input.copyFloat32Array(right)
      },
      output => output.readFloat32Array(),
    ),
  }
}
