import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

export default {
  title: "Portfolio",
  description: "Portfolio (Vike + React + vike-photon)",
  extends: [vikeReact, vikePhoton],
} satisfies Config;
