// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { beforeAll, expect, test } from "vitest";

beforeAll(() => {
  document.documentElement.innerHTML = readFileSync("index.html", "utf8");
});

test("uses hero actions instead of a top navigation bar", () => {
  expect(document.querySelector("header")).toBeNull();
  expect(document.querySelector('.hero a[href="#get-started"]')?.textContent).toContain(
    "Get started",
  );
  expect(document.querySelector('.hero a[href="https://github.com/TrySound/rifm"]')).not.toBeNull();
});

test("places Why Rifm immediately after the hero", () => {
  const hero = document.querySelector(".hero");
  expect(hero?.nextElementSibling).toHaveProperty("id", "why-rifm");
});

test("uses the live examples as Get Started", () => {
  const getStarted = document.querySelector("#get-started");
  expect(getStarted?.querySelectorAll("[data-demo]")).toHaveLength(4);
});

test("uses a plain footer brand and links to npmx", () => {
  expect(document.querySelector("footer .brand")?.tagName).toBe("SPAN");
  expect(document.querySelector('footer a[href="https://npmx.dev/package/rifm"]')).not.toBeNull();
});

test("connects every code copy button to an anchored hint popover", () => {
  const samples = [...document.querySelectorAll(".code-sample")];
  expect(samples).toHaveLength(4);

  for (const sample of samples) {
    const button = sample.querySelector<HTMLButtonElement>("button[interestfor][data-copy-target]");
    const tooltip = document.getElementById(button?.getAttribute("interestfor") ?? "");
    const code = document.getElementById(button?.dataset.copyTarget ?? "");

    expect(code?.tagName).toBe("CODE");
    expect(tooltip?.getAttribute("popover")).toBe("hint");
    expect(tooltip?.getAttribute("role")).toBe("tooltip");
  }
});

test("uses unique anchored copy relationships and real text sources", () => {
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>("button[interestfor][data-copy-target]"),
  ];
  const tooltipIds = controls.map((button) => button.getAttribute("interestfor"));
  const targetIds = controls.map((button) => button.dataset.copyTarget);

  expect(controls).toHaveLength(5);
  expect(new Set(tooltipIds).size).toBe(5);
  expect(new Set(targetIds).size).toBe(5);
  expect(document.querySelector("button[data-copy]")).toBeNull();

  for (const button of controls) {
    const tooltip = document.getElementById(button.getAttribute("interestfor") ?? "");
    expect(button.getAttribute("style")).toContain("anchor-name:");
    expect(tooltip?.getAttribute("style")).toContain("position-anchor:");
  }
});
