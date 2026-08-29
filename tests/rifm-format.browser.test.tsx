import { afterEach, expect, it, test } from "vitest";
import { formatFixedPointNumber, formatFloatingPointNumber, formatPhone } from "./format";
import { createNumberFormatter } from "../src/number";
import { BrowserExec, createBrowserExec } from "./utils/browser-exec";

let exec: BrowserExec | null = null;

afterEach(() => {
  exec?.cleanup();
  exec = null;
});

test("format works with real browser input", async () => {
  exec = createBrowserExec({ format: (value) => formatFixedPointNumber(value, 0) });

  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "46" })).toBe("146|");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("1|46");
  expect(await exec({ type: "PUT_SYMBOL", payload: "23" })).toBe("12’3|46");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("12’34|6");
  expect(await exec({ type: "PUT_SYMBOL", payload: "5" })).toBe("123’45|6");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("123’|456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "9" })).toBe("1’239|’456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "8" })).toBe("12’398|’456");
  expect(await exec({ type: "BACKSPACE" })).toBe("1’239|’456");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’456");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("123’|456");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’456");
  expect(await exec({ type: "MOVE_CARET", payload: 100 })).toBe("123’456|");
  expect(await exec({ type: "BACKSPACE" })).toBe("12’345|");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|12’345");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("1|2’345");
  expect(await exec({ type: "BACKSPACE" })).toBe("|2’345");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|2’345");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("1|2’345");
});

test("keeps the caret after a negative sign", async () => {
  exec = createBrowserExec({
    ...createNumberFormatter({ allowNegative: true, maximumFractionDigits: 0 }),
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "-" })).toBe("-|");

  exec.cleanup();
  exec = createBrowserExec({
    ...createNumberFormatter({ allowNegative: true, maximumFractionDigits: 0 }),
    initialValue: "123",
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "-" })).toBe("-|123");
});

test("format with custom accept works with real browser input", async () => {
  exec = createBrowserExec({
    accept: /[\d.]/gi,
    format: (value) => formatFloatingPointNumber(value, 2),
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "46" })).toBe("146|");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("1|46");
  expect(await exec({ type: "PUT_SYMBOL", payload: "23" })).toBe("12’3|46");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("12’34|6");
  expect(await exec({ type: "PUT_SYMBOL", payload: "5" })).toBe("123’45|6");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("123’|456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "9" })).toBe("1’239|’456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "8" })).toBe("12’398|’456");
  expect(await exec({ type: "BACKSPACE" })).toBe("1’239|’456");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’456");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("123’|456");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’456");
  expect(await exec({ type: "MOVE_CARET", payload: 100 })).toBe("123’456|");
  expect(await exec({ type: "BACKSPACE" })).toBe("12’345|");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|12’345");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("1|2’345");
  expect(await exec({ type: "BACKSPACE" })).toBe("|2’345");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|2’345");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("1|2’345");
  expect(await exec({ type: "MOVE_CARET", payload: 100 })).toBe("12’345|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "." })).toBe("12’345.|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "0" })).toBe("12’345.0|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "0" })).toBe("12’345.0|");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("12’345.|0");
  expect(await exec({ type: "BACKSPACE" })).toBe("123’45|0");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("123’4|50");
  expect(await exec({ type: "PUT_SYMBOL", payload: "." })).toBe("1’234.|5");
  expect(await exec({ type: "MOVE_CARET", payload: -3 })).toBe("1’2|34.5");
  expect(await exec({ type: "PUT_SYMBOL", payload: "." })).toBe("12.|34");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("12|.34");
  expect(await exec({ type: "BACKSPACE" })).toBe("1|.34");
  expect(await exec({ type: "BACKSPACE" })).toBe("|0.34");
  expect(await exec({ type: "DELETE" })).toBe("0|.34");
  expect(await exec({ type: "DELETE" })).toBe("|34");
  expect(await exec({ type: "DELETE" })).toBe("|4");
  expect(await exec({ type: "DELETE" })).toBe("|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "123456789.12" })).toBe("123’456’789.12|");
  expect(await exec({ type: "MOVE_CARET", payload: -11 })).toBe("123|’456’789.12");
  expect(await exec({ type: "DELETE" })).toBe("123’|456’789.12");
  expect(await exec({ type: "DELETE" })).toBe("12’3|56’789.12");
  expect(await exec({ type: "DELETE" })).toBe("1’23|6’789.12");
  expect(await exec({ type: "DELETE" })).toBe("123|’789.12");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("123’|789.12");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’789.12");
  expect(await exec({ type: "MOVE_CARET", payload: 4 })).toBe("123’789|.12");
  expect(await exec({ type: "DELETE" })).toBe("12’378’9|12");
});

test("fixed point handles delete and backspace in a real browser", async () => {
  exec = createBrowserExec({
    accept: /[\d.]/gi,
    format: (value) => formatFixedPointNumber(value, 2),
  });

  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("0|.00");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|.00");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("1.|00");
  expect(await exec({ type: "PUT_SYMBOL", payload: "23" })).toBe("1.23|");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("1.|23");
  expect(await exec({ type: "BACKSPACE" })).toBe("1|.23");
  expect(await exec({ type: "DELETE" })).toBe("1.|23");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("|1.23");
  expect(await exec({ type: "PUT_SYMBOL", payload: "0" })).toBe("|1.23");
  expect(await exec({ type: "PUT_SYMBOL", payload: "40" })).toBe("40|1.23");
  expect(await exec({ type: "MOVE_CARET", payload: -2 })).toBe("|401.23");
  expect(await exec({ type: "PUT_SYMBOL", payload: "00" })).toBe("|401.23");
});

test("format works when equal values do not update state in a real browser", async () => {
  exec = createBrowserExec({ format: (value) => formatFixedPointNumber(value, 0) });

  expect(await exec({ type: "PUT_SYMBOL", payload: "123456" })).toBe("123’456|");
  expect(await exec({ type: "MOVE_CARET", payload: -3 })).toBe("123’|456");
  expect(await exec({ type: "BACKSPACE" })).toBe("123|’456");
  expect(await exec({ type: "DELETE" })).toBe("123’|456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("123|’456");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("123|’456");
});

it("changes case through a real browser input", async () => {
  exec = createBrowserExec({
    format: (value) => value,
    replace: (value) => value.toLowerCase(),
    accept: /.+/g,
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "HELLO WORLD" })).toBe("hello world|");
  expect(await exec({ type: "MOVE_CARET", payload: -5 })).toBe("hello |world");
  expect(await exec({ type: "PUT_SYMBOL", payload: "BeAuTiFuL " })).toBe("hello beautiful |world");
});

it("applies replacement to an initial browser input value", async () => {
  exec = createBrowserExec({
    format: (value) => value,
    replace: (value) => value.toLowerCase(),
    accept: /.+/g,
    initialValue: "HeLLo",
  });

  expect(exec.input.value).toBe("hello");
  expect(await exec({ type: "MOVE_CARET", payload: -5 })).toBe("|hello");
});

it("moves the browser caret across multiple non-accepted characters on delete", async () => {
  exec = createBrowserExec({
    format: formatPhone,
    accept: /\d+/g,
    initialValue: "1 (234) 567",
  });

  expect(await exec({ type: "MOVE_CARET", payload: 6 })).toBe("1 (234|) 567");
  expect(await exec({ type: "DELETE" })).toBe("1 (234) |567");
});
