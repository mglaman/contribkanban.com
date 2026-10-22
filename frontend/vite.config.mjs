import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Only REACT_APP_* variables reach the bundle. An empty prefix would load
  // every variable on the build machine.
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    build: {
      outDir: 'build',
    },
    server: {
      allowedHosts: ['contribkanban.com.ddev.site'],
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      // Full-page tests render the whole app and run in parallel workers.
      testTimeout: 15000,
    },
    define: {
      'process.env': { ...env, NODE_ENV: mode },
    }
  };
});
