import { defineConfig } from '@playwright/test';
// R21: every click test opens the app on the path, as before the first-start welcome existed (the tests start from an
// empty save, which would now show the welcome). tests/firststart.spec.ts switches it back on (CELL_SKIP_WELCOME: '').
process.env.CELL_SKIP_WELCOME ??= '1';
export default defineConfig({ testDir: 'tests', timeout: 60000, workers: 1 });
