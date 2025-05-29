import { describe, it, expect } from 'vitest'
import { initRustBindgen } from '../index.ts'
import { multiply4x4Float32 } from '../../utils'

describe('Typescript example host', async () => {
  const wasm = await initRustBindgen()

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      it('should have correct result', () => {
        const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)

        const expectation = values.reduce((a, v) => a ^ v)

        const result = wasm.xorInt32Array(values)
        expect(result).to.equal(expectation)
      })
    })
  }

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`Sum Float64Array @ ${size} elements`, () => {
      it('should have correct result', () => {
        const values = new Float64Array(size).map(() => Math.random())

        const expectation = values.reduce((a, v) => a + v)

        const result = wasm.sumFloat64Array(values)
        expect(result).to.be.closeTo(expectation, 1e-9)
      })
    })
  }

  for (const batchSize of [1, 10, 100, 1000]) {
    describe(`4x4 Float32 Matrix Multiplication, batch size ${batchSize}`, () => {
      it('should have correct result', () => {
        const width = 16 * batchSize
        const left = new Float32Array(width).map(() => Math.random())
        const right = new Float32Array(width).map(() => Math.random())

        const expectation = new Float32Array(width)

        for (let i = 0; i < width; i += 16) {
          expectation.set(multiply4x4Float32(left.slice(i, i + 16), right.slice(i, i + 16)), i)
        }

        const result = wasm.multiply4x4Float32(left, right)
      })
    })
  }
})
