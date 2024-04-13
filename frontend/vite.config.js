import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const port = 9443;
const origin = `${process.env.DDEV_PRIMARY_URL}:${port}`;

// https://vitejs.dev/config/
export default defineConfig({
  // Add entrypoint
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/, jsxRuntime: "classic" })],
  define: {
    "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
      "https://contribkanban.com.ddev.site"
    ),
    "process.env.PUBLIC_URL": JSON.stringify(
      "https://contribkanban.com.ddev.site"
    ),
    "process.env.REACT_APP_LAGOON_BRANCH": JSON.stringify(""),
    "process.env.REACT_APP_LAGOON_PROJECT": JSON.stringify(""),
    "process.env.REACT_APP_LAGOON_ENVIRONMENT": JSON.stringify(""),
    "process.env.NODE_ENV": JSON.stringify("local"),
  },
  build: {
    // our entry
    outDir: "build",
    rollupOptions: {
      input: path.resolve("src/index.jsx"),
    },
    // manifest
    manifest: true,
  },
  // Adjust Vites dev server for DDEV
  // https://vitejs.dev/config/server-options.html
  server: {
    // respond to all network requests:
    host: "0.0.0.0",
    port: port,
    strictPort: true,
    // Defines the origin of the generated asset URLs during development
    origin: origin,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: './setupTest.js',
  },
});
