import { defineConfig } from 'vitest/config'

const needCoverage = process.argv.includes('--coverage')

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    ...(needCoverage
      ? {
          coverage: {
            clean: true,
            provider: 'v8',
            include: ['src/**/*.*'],
          },
        }
      : null),
  },
})
