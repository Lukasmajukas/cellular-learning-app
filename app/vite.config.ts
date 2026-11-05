import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { lookCss } from './src/theme/tokens';

// R21: writes both looks' colours (from src/theme/tokens.ts, the one place colours live) into index.html, where the
// start screen needs them before any app code has run. index.html marks the spot with <!--look-tokens-->.
const lookTokens = (): Plugin => ({
  name: 'look-tokens',
  transformIndexHtml: html => html.replace('<!--look-tokens-->', `<style id="look-tokens">\n${lookCss()}\n</style>`),
});
export default defineConfig({ plugins: [react(), lookTokens()], base: './', test: { include: ['src/**/*.test.ts'] } });
