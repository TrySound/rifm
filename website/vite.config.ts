import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        jsx: "react",
      },
    },
  },
  oxc: {
    jsx: {
      runtime: "classic",
      pragma: "React.createElement",
      pragmaFrag: "React.Fragment",
    },
  },
});
