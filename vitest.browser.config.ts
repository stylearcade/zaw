import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
      provider: playwright(),
    },
    include: ['**/*.browser.test.ts'],
  },
  resolve: {
    alias: {
      zaw: path.resolve(__dirname, './implementations/host-typescript/src/index.ts'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up
      allow: ['..'],
    },
  },
})
