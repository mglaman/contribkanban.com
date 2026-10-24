import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the board island into the board-shell component, so Drupal attaches
// it through the component's own library.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  publicDir: false,
  // Library mode leaves process.env alone, and React reads NODE_ENV. Tests
  // need React's development build.
  define: command === 'build' ? { 'process.env.NODE_ENV': JSON.stringify('production') } : {},
  build: {
    outDir: '../web/themes/custom/contribkanban/components/board-shell',
    // The output directory holds the component's other files.
    emptyOutDir: false,
    lib: {
      entry: 'src/island/main.jsx',
      formats: ['iife'],
      name: 'ContribKanbanBoard',
      fileName: () => 'board-shell.js',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
}));
