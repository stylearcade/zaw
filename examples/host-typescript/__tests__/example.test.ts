import { describe, it, expect } from 'vitest'
import { builds } from './builds'
import { initExample } from '../host'

describe('Typescript example host', async () => {
  const zig = await initExample(builds.zig)

  const implementations = { zig }

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)

      const expectation = values.reduce((a, v) => a ^ v)

      for (const [name, impl] of Object.entries(implementations)) {
        describe(name, () => {
          it('should have correct result', () => {
            const result = impl.xorInt32Array(values)

            expect(result).to.equal(expectation)
          })
        })
      }
    })
  }

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`Sum Float64Array @ ${size} elements`, () => {
      const values = new Float64Array(size).map(() => Math.random())

      const expectation = values.reduce((a, v) => a + v)

      for (const [name, impl] of Object.entries(implementations)) {
        describe(name, () => {
          it('should have correct result', () => {
            const result = impl.sumFloat64Array(values)

            expect(result).to.be.closeTo(expectation, 1e-9)
          })
        })
      }
    })
  }
})
