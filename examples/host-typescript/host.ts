import { createInstance, ZawReturn } from '../../implementations/host-typescript/src/index'

type ExampleExports = {
  throwErrorWithStack: () => ZawReturn
  usefulPanic: () => ZawReturn
  echo: () => ZawReturn
  xorInt32Array: () => ZawReturn
  transferInFloat64Array: () => ZawReturn
  transferOutFloat64Array: () => ZawReturn
  multiply4x4Float32: () => ZawReturn
}

export type ExampleAPI = {
  throwErrorWithStack: () => void
  usefulPanic: () => void
  echo: (msg: string) => string
  xorInt32Array: (values: Int32Array, scalar: number) => Int32Array
  transferInFloat64Array: (values: Float64Array) => number
  transferOutFloat64Array: (value: number, count: number) => Float64Array
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
      (input, msg) => input.writeUtf8String(msg),
      output => lastLogMsg,
    ),
    xorInt32Array: instance.bind(
      instance.exports.xorInt32Array,
      (input, values, scalar) => {
        input.copyInt32Array(values)
        input.writeInt32(scalar)
      },
      output => output.readInt32Array(),
    ),
    transferInFloat64Array: instance.bind(
      instance.exports.transferInFloat64Array,
      (input, values) => input.copyFloat64Array(values),
      output => output.readUint32(),
    ),
    transferOutFloat64Array: instance.bind(
      instance.exports.transferOutFloat64Array,
      (input, value, count) => {
        input.writeFloat64(value)
        input.writeUint32(count)
      },
      output => output.readFloat64Array(),
    ),
    multiply4x4Float32: instance.bind(
      instance.exports.multiply4x4Float32,
      (input, left, right) => {
        input.copyFloat32Array(left)
        input.copyFloat32Array(right)
      },
      output => output.readFloat32Array(),
    ),
  }
}
