import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // enforce at least 80% coverage for statements, branches, functions, lines
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    include: ['src/**/*.test.{js,ts}'],
  },

});
