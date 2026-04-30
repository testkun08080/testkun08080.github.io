import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import vike from "vike/plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const repoBase = "/testkun08080.github.io/";

  return {
    base: repoBase,
    plugins: [tailwindcss(), vike()],
    server: {
      // Keep dev server private (localhost only)
      // host: "127.0.0.1",
      // Allow custom port via PORT, otherwise use Vite default
      port: Number(env.PORT) || 5173,
      // If taken, Vite automatically picks the next available port
      strictPort: false,
    },
  };
});
