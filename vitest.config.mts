import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL('./src', import.meta.url))}/`,
      },
      {
        // Server-only modules throw when imported outside a Server Component. Tests run them in Node.
        find: 'server-only',
        replacement: fileURLToPath(new URL('./node_modules/server-only/empty.js', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
