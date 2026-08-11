import fs from "fs";
import path from "path";
import replace from "@rollup/plugin-replace";
import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import gzipSize from "gzip-size";
import * as brotliSize from "brotli-size";
import pkg from "./package.json";

const input = "./src/index.ts";
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const external = (id) => id.startsWith(".") === false && path.isAbsolute(id) === false;

const babelOptions = {
  babelrc: false,
  configFile: false,
  babelHelpers: "bundled",
  extensions,
  presets: [
    ["@babel/preset-env", { bugfixes: true, loose: true }],
    "@babel/typescript",
    "@babel/react",
  ],
};

export default [
  {
    input,
    output: { file: pkg.main, format: "cjs" },
    external,
    plugins: [resolve({ extensions }), babel(babelOptions)],
  },

  {
    input,
    output: { file: pkg.module, format: "esm" },
    external,
    plugins: [resolve({ extensions }), babel(babelOptions)],
  },

  // to check esm production size
  {
    input,
    output: { file: "dist/rifm.esm.production.js", format: "esm" },
    external,
    plugins: [
      resolve({ extensions }),
      babel(babelOptions),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      terser(),
      {
        generateBundle(outputOptions, bundle) {
          let sizeInfo = "";
          for (const [name, chunk] of Object.entries(bundle)) {
            const parsedSize = chunk.code.length;
            const gzippedSize = gzipSize.sync(chunk.code);
            const brotliedSize = brotliSize.sync(chunk.code);
            sizeInfo += `Size of ${name}
            =============================
            min: ${parsedSize} b
            gzip: ${gzippedSize} b
            brotli: ${brotliedSize} b\n`.replace(/^\s+/gm, "");
          }
          console.info(sizeInfo);
          fs.writeFileSync("size-snapshot.txt", sizeInfo, "utf-8");
        },
      },
    ],
  },
];
