import { afterEach, expect, test } from "vitest";
import { BrowserExec, createBrowserExec } from "./browser-exec";

let exec: BrowserExec | null = null;

afterEach(() => {
  exec?.cleanup();
  exec = null;
});

test("types into a real input and reads its native caret", async () => {
  exec = createBrowserExec({ format: (value) => value });

  await expect(exec({ type: "PUT_SYMBOL", payload: "123" })).resolves.toBe("123|");
  expect(exec.input instanceof HTMLInputElement).toBe(true);
  expect(exec.input.selectionStart).toBe(3);
});

test("moves the caret and sends browser Backspace and Delete keys", async () => {
  exec = createBrowserExec({ format: (value) => value, initialValue: "1234" });

  await expect(exec({ type: "MOVE_CARET", payload: 2 })).resolves.toBe("12|34");
  await expect(exec({ type: "BACKSPACE" })).resolves.toBe("1|34");
  await expect(exec({ type: "DELETE" })).resolves.toBe("1|4");
});

test("cleanup removes the mounted input", () => {
  exec = createBrowserExec({ format: (value) => value });
  const input = exec.input;

  exec.cleanup();
  exec = null;

  expect(input.isConnected).toBe(false);
});
