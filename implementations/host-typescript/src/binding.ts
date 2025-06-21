import { Reader, Writer } from './conduit'
import { ZawReturn } from './types'

type Generator = <Args extends unknown[], Result>(
  func: () => ZawReturn,
  write: (input: Writer, ...args: Args) => void,
  read: (output: Reader, ...args: Args) => Result,
  getInput: () => Writer,
  getOutput: () => Reader,
  handleError: (func: () => ZawReturn) => void,
) => (...args: Args) => Result

const cache: Record<string, Generator> = {}

function createGenerator(inputArgCount: number, outputArgCount: number): Generator {
  const allArgs = Array.from({ length: inputArgCount }, (_, i) => `arg${i}`)

  const writeArgs = ['input', ...allArgs]
  const readArgs = ['output', ...allArgs.slice(0, outputArgCount)]

  const body = `return function(${allArgs.join(', ')}) {
    const input = getInput()

    write(${writeArgs.join(', ')})

    handleError(func)

    const output = getOutput()

    return read(${readArgs.join(', ')})
  }`

  return new Function('func', 'write', 'read', 'getInput', 'getOutput', 'handleError', body) as Generator
}

export function generateBinding<Args extends unknown[], Result>(
  func: () => ZawReturn,
  write: (input: Writer, ...args: Args) => void,
  read: (output: Reader, ...args: Args) => Result,
  getInput: () => Writer,
  getOutput: () => Reader,
  handleError: (func: () => ZawReturn) => void,
): (...args: Args) => Result {
  const inputArgCount = Math.max(write.length - 1, 0)
  const outputArgCount = Math.max(read.length - 1, 0)
  const cacheKey = `${inputArgCount}_${outputArgCount}`

  let generator = cache[cacheKey]

  if (generator === undefined) {
    generator = cache[cacheKey] = createGenerator(inputArgCount, outputArgCount)
  }

  return generator(func, write, read, getInput, getOutput, handleError)
}
