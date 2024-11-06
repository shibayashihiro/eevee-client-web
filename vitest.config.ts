import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['functions', 'node_modules', 'tools'],
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
});
