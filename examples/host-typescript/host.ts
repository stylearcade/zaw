import { createInstance } from 'zaw'

type ExampleExports = {
  throwErrorWithStack: () => number
  usefulPanic: () => number
  logMessage: () => number
  xorInt32Array: () => number
  sumFloat64Array: () => number
}

export type ExampleAPI = {
  throwErrorWithStack: () => void
  usefulPanic: () => void
  logMessage: () => string
  xorInt32Array: (values: Int32Array) => number
  sumFloat64Array: (values: Float64Array) => number
}

export async function initExample(wasmBuffer: Buffer): Promise<ExampleAPI> {
  let _lastMessage

  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000_000,
    outputChannelSize: 100,
    log: message => {
      // used to check log is correctly implemented
      _lastMessage = message
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
    logMessage() {
      instance.handleError(() => instance.exports.logMessage())

      return _lastMessage
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
  }
}
