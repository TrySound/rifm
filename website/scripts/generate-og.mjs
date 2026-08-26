import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const svgUrl = new URL("../public/og-image.svg", import.meta.url);
const pngUrl = new URL("../public/og-image.png", import.meta.url);
const svg = await readFile(svgUrl, "utf8");

const image = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Arial",
  },
});

await writeFile(pngUrl, image.render().asPng());
console.log(`Generated ${fileURLToPath(pngUrl)} (1200×630)`);
