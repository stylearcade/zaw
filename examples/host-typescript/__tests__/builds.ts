import fs from 'fs'
import path from 'path'

const EXAMPLES_DIR = path.join(__dirname, '../../')

export const builds = {
  zig: fs.readFileSync(path.join(EXAMPLES_DIR, 'wasm-zig/zig-out/bin/main.wasm')),
}
