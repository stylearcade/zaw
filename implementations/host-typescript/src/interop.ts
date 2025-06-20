import { Reader, Writer } from './conduit'
import { DEFAULT_INITIAL_PAGES, MAX_ERROR_SIZE, MAX_LOG_SIZE } from './constants'

export type Result = 0 | 1
export type BindableExport = () => Result

export type InstanceOptions = {
  inputChannelSize: number
  outputChannelSize: number
  initialMemoryPages?: number
  log?: (message: string) => void
}

export type ExportBase = Record<string, () => number> & {
  getLogPtr: () => number
  getErrorPtr: () => number
  allocateInputChannel: (sizeInBytes: number) => number
  allocateOutputChannel: (sizeInBytes: number) => number
}

export type BindingFactory = <Args extends unknown[], Result>(
  func: BindableExport,
  handleInput: (input: Writer, args: Args) => void,
  handleOutput: (output: Reader) => Result,
) => (...args: Args) => Result

export type Instance<T extends Record<string, unknown>> = {
  getMemory: () => ArrayBuffer
  getBytes: () => Uint8ClampedArray
  exports: ExportBase & T
  createView: <T>(init: (buffer: ArrayBuffer) => T) => () => T
  getInput: () => Writer
  getOutput: () => Reader
  handleError: (func: () => number) => void
  getSize: () => number
  bind: BindingFactory
}

export async function createInstance<T extends Record<string, unknown>>(
  wasmBuffer: Buffer,
  options: InstanceOptions,
): Promise<Instance<T>> {
  const { inputChannelSize, outputChannelSize, initialMemoryPages = DEFAULT_INITIAL_PAGES, log = console.log.bind(console) } = options
  const memory = new WebAssembly.Memory({ initial: initialMemoryPages })

  const imports = {
    env: {
      memory,
      hostLog: () => {
        hostLog() // has to be hoisted
      },
    },
  }

  const { instance } = await WebAssembly.instantiate(wasmBuffer, imports)

  const exports = instance.exports as ExportBase & T

  const createView = <T>(createFunc: (buffer: ArrayBuffer) => T): (() => T) => {
    let buffer: ArrayBuffer
    let instance: T

    return () => {
      if (instance === undefined || memory.buffer !== buffer) {
        buffer = memory.buffer
        instance = createFunc(buffer)
      }

      return instance
    }
  }

  const logPtr = exports.getLogPtr()
  const errPtr = exports.getErrorPtr()
  const inputPtr = exports.allocateInputChannel(inputChannelSize)
  const outputPtr = exports.allocateOutputChannel(outputChannelSize)

  const getBytes = createView(buffer => new Uint8ClampedArray(buffer))
  const getLogData = createView(buffer => new Uint8ClampedArray(buffer, logPtr, MAX_LOG_SIZE))
  const getErrorData = createView(buffer => new Uint8ClampedArray(buffer, errPtr, MAX_ERROR_SIZE))
  const getInputChannel = createView(buffer => new Writer(buffer, inputPtr, inputChannelSize))
  const getOutputChannel = createView(buffer => new Reader(buffer, outputPtr, outputChannelSize))

  const hostLog = (): void => {
    const data = getLogData()
    const length = data.indexOf(0)
    const message = Buffer.from(data.subarray(0, length)).toString('utf8')

    log(message)
  }

  const throwWasmError = (e?: Error): void => {
    const data = getErrorData()
    const length = data.indexOf(0)

    if (length > 0) {
      const message = Buffer.from(data.subarray(0, length)).toString('utf8')

      throw Error(message)
    } else if (e !== undefined) {
      throw e
    } else {
      throw Error('Unknown error')
    }
  }

  const handleError = (func: () => number): void => {
    let result

    try {
      result = func()
    } catch (e) {
      throwWasmError(e as Error)
    }

    if (result !== 0) {
      throwWasmError()
    }
  }

  const getInput = (): Writer => {
    const input = getInputChannel()

    input.reset()

    return input
  }

  const getOutput = (): Reader => {
    const input = getOutputChannel()

    input.reset()

    return input
  }

  const bind: BindingFactory =
    <T extends unknown[], R>(func: BindableExport, handleInput: (input: Writer, args: T) => void, handleOutput: (output: Reader) => R) =>
    (...args: T): R => {
      const input = getInput()

      handleInput(input, args)

      handleError(func)

      return handleOutput(getOutput())
    }

  return {
    exports,
    getMemory: () => memory.buffer,
    getSize: () => memory.buffer.byteLength,
    createView,
    getBytes,
    getInput,
    getOutput,
    handleError,
    bind,
  }
}
