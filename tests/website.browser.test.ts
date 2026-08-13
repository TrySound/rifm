import { expect, test } from "vitest";
import { mountDemos } from "../website/src/demos";

test("website demos mount with the installed React version", async () => {
  document.body.innerHTML = `
    <div data-demo="number"></div>
    <div data-demo="phone"></div>
    <div data-demo="date"></div>
    <div data-demo="uppercase"></div>
  `;

  mountDemos();

  await expect.poll(() => document.querySelectorAll("[data-demo] input").length).toBe(4);
});
