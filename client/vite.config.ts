import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("../server/cert/localhost.key"),
      cert: fs.readFileSync("../server/cert/localhost.crt"),
    },
  },
  plugins: [react()],
});
