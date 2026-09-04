import { afterEach, expect, test } from "vitest";
import { createDateFormatter } from "../src/date";
import { BrowserExec, createBrowserExec } from "./utils/browser-exec";

let exec: BrowserExec | null = null;

afterEach(() => {
  exec?.cleanup();
  exec = null;
});

test("date formatter supports replacement-style mask editing", async () => {
  const formatter = createDateFormatter({ locales: "en-US", year: "long" });
  exec = createBrowserExec({ ...formatter, mask: true });

  expect(await exec({ type: "PUT_SYMBOL", payload: "12082026" })).toBe("12/08/2026|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("12/08/|2026");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("12/08/1|026");
});
