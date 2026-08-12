import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  optimizeDeps: {
    include: ["libphonenumber-js", "react", "react-dom"],
  },
  oxc: {
    jsx: {
      runtime: "classic",
    },
  },
  test: {
    setupFiles: ["tests/setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: [
            "tests/formatters.test.ts",
            "tests/rifm-format.test.ts",
            "tests/rifm-mask.test.ts",
            "tests/utils/input-emulator.test.tsx",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["tests/test-layout-warn.test.tsx"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["tests/**/*.browser.test.{ts,tsx}"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
