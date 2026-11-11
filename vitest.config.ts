import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    globals: true,
    environment: 'node',
    exclude: [...configDefaults.exclude, 'e2e/**', ...(process.env.LEGACY_GO_TESTS === '1' || process.env.npm_lifecycle_event === 'test:legacy' ? [] : ['test/auth-integration.test.ts'])],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
