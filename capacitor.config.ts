import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor shell — web assets come from Next static export (`npm run build:mobile:web` → `out/`).
 * Cloud builds (Capawesome / Appflow) must run that script before `cap sync`, not plain `npm run build`.
 */
const config: CapacitorConfig = {
  appId: "com.junglejokers.vocab",
  appName: "Jungle Jokers",
  webDir: "out",
  android: {
    path: "android",
  },
  ios: {
    path: "ios",
    // CSS owns safe-area padding; native auto-insets would add it twice.
    contentInset: "never",
  },
};

export default config;
