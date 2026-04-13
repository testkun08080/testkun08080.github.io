import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [tailwindcss(), vike()],
});
