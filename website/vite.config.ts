import { defineConfig } from "vite";

export default defineConfig({
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
