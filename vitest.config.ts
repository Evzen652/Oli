import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 60000,
    // Polovina jader místo výchozích „všechna − 1". S 8 jádry a 7 workery
    // padala sada ve 3 z 5 plných běhů na „[vitest-worker]: Timeout calling
    // onTaskUpdate" (hlavní proces nestíhal RPC od workerů, testy samy
    // prošly); se 4 workery 0 ze 4 a stejná doba běhu (~5 min).
    // Měřeno 2026-10-07. Objem výpisu na tom nezávisel — ověřeno.
    maxWorkers: "50%",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
