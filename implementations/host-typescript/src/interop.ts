import { Reader, Writer } from './conduit'
import { DEFAULT_INITIAL_PAGES, MAX_ERROR_SIZE, MAX_LOG_SIZE } from './constants'
import { generateBinding } from './binding'
import { ZawReturn } from './types'

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
  func: () => ZawReturn,
  write: (input: Writer, ...args: Args) => void,
  read: (output: Reader, ...args: Args) => Result,
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
  wasmBuffer: BufferSource | ArrayBuffer,
  options: InstanceOptions,
): Promise<Instance<T>> {
  const { inputChannelSize, outputChannelSize, initialMemoryPages = DEFAULT_INITIAL_PAGES, log = console.log.bind(console) } = options
  const memory = new WebAssembly.Memory({ initial: initialMemoryPages })
  const textDecoder = new TextDecoder('utf-8')

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
    const message = textDecoder.decode(data.subarray(0, length))

    log(message)
  }

  const throwWasmError = (e?: Error): void => {
    const data = getErrorData()
    const length = data.indexOf(0)

    if (length > 0) {
      const message = textDecoder.decode(data.subarray(0, length))

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

  const bind: BindingFactory = <T extends unknown[], R>(
    func: () => ZawReturn,
    write: (input: Writer, ...args: T) => void,
    read: (output: Reader, ...args: T) => R,
  ) => generateBinding(func, write, read, getInput, getOutput, handleError)

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
