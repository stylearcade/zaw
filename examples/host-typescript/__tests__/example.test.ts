import { describe, it, expect } from 'vitest'
import { builds } from './builds'
import { initExample } from '../host'
import { multiply4x4Float32 } from '../../utils/index.ts'

describe('Typescript example host', async () => {
  const zig = await initExample(builds.zig)
  const rust = await initExample(builds.rust)

  const implementations = {
    zig,
    rust,
  }

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

  for (const size of [1, 10, 100, 1000]) {
    describe(`Multiply 4x4 Float32 Matrices @ ${size} matrices`, () => {
      const left = new Float32Array(size * 16).map(() => Math.random())
      const right = new Float32Array(size * 16).map(() => Math.random())
      const width = 16 * size

      const expectation = new Float32Array(width)

      for (let i = 0; i < width; i += 16) {
        expectation.set(multiply4x4Float32(left.slice(i, i + 16), right.slice(i, i + 16)), i)
      }

      for (const [name, impl] of Object.entries(implementations)) {
        describe(name, () => {
          it('should match expected output', () => {
            const result = impl.multiply4x4Float32(left, right)

            expect(result.length).to.equal(expectation.length)
            for (let i = 0; i < result.length; i++) {
              expect(result[i]).to.be.closeTo(expectation[i], 1e-5)
            }
          })
        })
      }
    })
  }

  describe('Error messages', () => {
    describe('zig', () => {
      it('should include an error message', () => {
        expect(() => zig.throwErrorWithStack()).throws('error message')
      })
      it('should throw a zig stack trace', () => {
        expect(() => zig.throwErrorWithStack()).throws('main.zig')
      })
    })
    describe('rust', () => {
      it('should include an error message', () => {
        expect(() => rust.throwErrorWithStack()).throws('error message')
      })
      it('should throw a rust stack trace', () => {
        expect(() => rust.throwErrorWithStack()).throws('lib.rs')
      })
    })
  })

  describe('Panic messages', () => {
    describe('zig', () => {
      it('should include a useful error message', () => {
        expect(() => zig.usefulPanic()).throws('useful panic message')
      })
      it('should throw a zig stack trace', () => {
        expect(() => zig.usefulPanic()).throws('main.zig')
      })
    })

    describe('rust', () => {
      it('should include a useful error message', () => {
        expect(() => rust.usefulPanic()).throws('useful panic message')
      })
      it('should throw a rust stack trace', () => {
        expect(() => rust.usefulPanic()).throws('lib.rs')
      })
    })
  })

  describe('echo', () => {
    describe('zig', () => {
      it('should echo back', () => {
        const result = zig.echo('test message')

        expect(result).to.equal('test message from zig')
      })
    })

    describe('rust', () => {
      it('should echo back', () => {
        const result = rust.echo('test message')

        expect(result).to.equal('test message from rust')
      })
    })
  })
})
