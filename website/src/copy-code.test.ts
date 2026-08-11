// @vitest-environment jsdom

import { expect, test } from "vitest";
import { copyFromButton } from "./copy-code";

const renderCopyControl = () => {
  document.body.innerHTML = `
    <button interestfor="copy-tip" data-copy-target="source">Copy</button>
    <code id="source">const value = 42</code>
    <span id="copy-tip" popover="hint">Copy code</span>
    <span id="copy-status" aria-live="polite"></span>
  `;
  return document.querySelector("button") as HTMLButtonElement;
};

test("copies text from the referenced code element", async () => {
  const copied: string[] = [];

  await copyFromButton(renderCopyControl(), {
    writeText: async (text: string) => {
      copied.push(text);
    },
  });

  expect(copied).toEqual(["const value = 42"]);
  expect(document.querySelector("[popover]")?.textContent).toBe("Copied");
  expect(document.querySelector("[aria-live]")?.textContent).toBe("Copied");
});

test("shows failure feedback when clipboard access fails", async () => {
  await copyFromButton(renderCopyControl(), {
    writeText: async () => {
      throw new Error("denied");
    },
  });

  expect(document.querySelector("[popover]")?.textContent).toBe("Copy failed");
  expect(document.querySelector("[aria-live]")?.textContent).toBe("Copy failed");
});
