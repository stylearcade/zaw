import { describe, it, expect } from 'vitest'
import { createInstance, type ZawReturn } from 'zaw'

type ExampleExports = {
  echo: () => ZawReturn
}

async function fetchWasm(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch WASM: ${response.statusText}`)
  }
  return response.arrayBuffer()
}

async function initExample(wasmBuffer: ArrayBuffer) {
  let lastLogMsg: string

  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000_000,
    outputChannelSize: 1_000_000,
    log: message => {
      lastLogMsg = message
      console.log(message)
    },
  })

  return {
    echo: instance.bind(
      instance.exports.echo,
      (input, msg: string) => input.writeUtf8String(msg),
      output => lastLogMsg,
    ),
  }
}

describe('Browser compatibility tests', async () => {
  describe('Zig WASM', () => {
    it('should load and run text-based echo test', async () => {
      const wasmBuffer = await fetchWasm('/examples/wasm-zig/zig-out/bin/main.wasm')
      const api = await initExample(wasmBuffer)

      const result = api.echo('hello browser')
      expect(result).toBe('hello browser from zig')
    })
  })

  describe('Rust WASM', () => {
    it('should load and run text-based echo test', async () => {
      const wasmBuffer = await fetchWasm('/examples/wasm-rust/target/wasm32-unknown-unknown/release/api_zaw.wasm')
      const api = await initExample(wasmBuffer)

      const result = api.echo('hello browser')
      expect(result).toBe('hello browser from rust')
    })
  })
})
