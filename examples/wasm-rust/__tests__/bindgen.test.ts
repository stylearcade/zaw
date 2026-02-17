import { describe, it, expect } from 'vitest'
import { initRustBindgen } from '../api_bindgen'
import { multiply4x4Float32 } from '../../utils/index.ts'

describe('Typescript example host', async () => {
  const wasm = await initRustBindgen()

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      it('should have correct result', () => {
        const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)
        const scalar = (Math.random() * 0x100000000) | 0

        const expectation = values.map(v => v ^ scalar)

        const result = wasm.xorInt32Array(values, scalar)
        expect(result.length).to.equal(expectation.length)
        for (let i = 0; i < result.length; i++) {
          expect(result[i]).to.equal(expectation[i])
        }
      })
    })
  }

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`Transfer Float64Array @ ${size} elements`, () => {
      it('should transfer in correctly', () => {
        const values = new Float64Array(size).map(() => Math.random())
        const result = wasm.transferInFloat64Array(values)
        expect(result).to.equal(size)
      })

      it('should transfer out correctly', () => {
        const testValue = 3.14159
        const result = wasm.transferOutFloat64Array(testValue, size)
        expect(result.length).to.equal(size)
        for (let i = 0; i < size; i++) {
          expect(result[i]).to.equal(testValue)
        }
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
