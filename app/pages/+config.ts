import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

export default {
  title: "Testkun | Portfolio",
  description:
    "Testkun's portfolio site. Showcasing shader development, LookDev, and creative web projects bridging technology and art.",
  prerender: {
    parallel: 1,
  },
  extends: [vikeReact, vikePhoton],
} satisfies Config;
