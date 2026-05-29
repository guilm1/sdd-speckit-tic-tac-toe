import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Build config: emit a minimal footprint. The singlefile plugin inlines the
// JS bundle so the production output is a single index.html. We also keep a
// non-inlined main.js chunk name for clarity per the plan's "single main.js"
// constraint when inlining is disabled.
export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        inlineDynamicImports: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
});
