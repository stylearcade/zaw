import fs from 'fs'
import path from 'path'
import { zigGenerator } from './languages/zig'
import { testCases } from './test-cases'
import { typescriptGenerator } from './languages/typescript'
import { rustGenerator } from './languages/rust'

for (const generator of [zigGenerator, typescriptGenerator, rustGenerator]) {
  const filename = path.join(__dirname, '../', generator.outputFile)

  console.log(`Generating ${filename}`)

  const testFile = generator.generateTestFile(testCases)

  fs.writeFileSync(filename, testFile, 'utf-8')
}
