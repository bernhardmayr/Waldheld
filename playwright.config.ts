import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:4173/Waldheld/',
    viewport: { width: 1180, height: 820 },
    hasTouch: true,
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/Waldheld/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
