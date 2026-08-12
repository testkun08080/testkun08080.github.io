import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import vike from "vike/plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  // const repoBase = "/testkun08080.github.io/";
  const repoBase = "/";
  return {
    base: repoBase,
    plugins: [tailwindcss(), vike()],
    resolve: {
      alias:
        mode === "production"
          ? {
              leva: new URL("./debug/leva-stub.tsx", import.meta.url).pathname,
            }
          : undefined,
    },
    server: {
      // Keep the Vite dev server loopback-only (Cloud Agent / shared VMs)
      host: "127.0.0.1",
      port: Number(env.PORT) || 5173,
      // If taken, Vite automatically picks the next available port
      strictPort: false,
    },
    preview: {
      host: "127.0.0.1",
      port: Number(env.PORT) || 4173,
      strictPort: false,
    },
  };
});
