import os from 'os'
import { bench, describe } from 'vitest'
import { builds } from './builds'
import { initExample } from '../host'
import { initRustBindgen } from '../../wasm-rust/api_bindgen'
import { multiply4x4Float32 } from '../../utils'

console.log(`--COPY OUTPUT FROM BELOW THIS LINE INTO benchmarks.md---\n\nRunning on ${os.cpus()[0].model}`)

describe('Typescript example host', async () => {
  const zig = await initExample(builds.zig)
  const rust = await initExample(builds.rust)
  const rustBindgen = await initRustBindgen()

  for (const size of [10, 100, 1_000, 10_000, 100_000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)

      bench('js', () => {
        let total = 0

        for (let i = values.length; i-- > 0; ) {
          total ^= values[i]
        }
      })

      bench('zig', () => {
        zig.xorInt32Array(values)
      })

      bench('rust', () => {
        rust.xorInt32Array(values)
      })

      bench('rust-bindgen', () => {
        rustBindgen.xorInt32Array(values)
      })
    })
  }

  for (const size of [10, 100, 1_000, 10_000, 100_000]) {
    describe(`Sum Float64Array @ ${size} elements`, () => {
      const values = new Float64Array(size).map(() => Math.random())

      bench('js', () => {
        let total = 0

        for (let i = values.length; i-- > 0; ) {
          total += values[i]
        }
      })

      bench('zig', () => {
        zig.sumFloat64Array(values)
      })

      bench('rust', () => {
        rust.sumFloat64Array(values)
      })

      bench('rust-bindgen', () => {
        rustBindgen.sumFloat64Array(values)
      })
    })
  }

  for (const batchSize of [1, 10, 100, 1000]) {
    describe(`4x4 Float32 Matrix Multiplication, batch size ${batchSize}`, () => {
      const width = 16 * batchSize
      const left = new Float32Array(width).map(() => Math.random())
      const right = new Float32Array(width).map(() => Math.random())

      bench('js', () => {
        for (let i = 0; i < width; i += 16) {
          multiply4x4Float32(left.slice(i, i + 16), right.slice(i, i + 16))
        }
      })

      bench('zig', () => {
        zig.multiply4x4Float32(left, right)
      })

      bench('rust', () => {
        rust.multiply4x4Float32(left, right)
      })

      bench('rust-bindgen', () => {
        rustBindgen.multiply4x4Float32(left, right)
      })
    })
  }
})
