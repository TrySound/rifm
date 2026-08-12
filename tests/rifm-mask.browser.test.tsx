import { afterEach, expect, test } from "vitest";
import { dateFormat } from "./format";
import { BrowserExec, createBrowserExec } from "./utils/browser-exec";

let exec: BrowserExec | null = null;

afterEach(() => {
  exec?.cleanup();
  exec = null;
});

test("mask behaves with real browser input", async () => {
  exec = createBrowserExec({
    maskFn: (value) => value.length >= 10,
    format: dateFormat,
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("1|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "23" })).toBe("12-3|");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("12-|3");
  expect(await exec({ type: "PUT_SYMBOL", payload: "4" })).toBe("12-4|3");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|12-43");
  expect(await exec({ type: "PUT_SYMBOL", payload: "5" })).toBe("5|1-24-3");
  expect(await exec({ type: "PUT_SYMBOL", payload: "6" })).toBe("56-|12-43");
  expect(await exec({ type: "MOVE_CARET", payload: 100 })).toBe("56-12-43|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "789" })).toBe("56-12-4378|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("56-12-|4378");
  expect(await exec({ type: "PUT_SYMBOL", payload: "9" })).toBe("56-12-9|378");
  expect(await exec({ type: "PUT_SYMBOL", payload: "8" })).toBe("56-12-98|78");
  expect(await exec({ type: "PUT_SYMBOL", payload: "7" })).toBe("56-12-987|8");
  expect(await exec({ type: "PUT_SYMBOL", payload: "6" })).toBe("56-12-9876|");
  expect(await exec({ type: "BACKSPACE" })).toBe("56-12-987|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "6" })).toBe("56-12-9876|");
  expect(await exec({ type: "MOVE_CARET", payload: -3 })).toBe("56-12-9|876");
  expect(await exec({ type: "BACKSPACE" })).toBe("56-12|-876");
  expect(await exec({ type: "PUT_SYMBOL", payload: "0" })).toBe("56-12-0|876");
  expect(await exec({ type: "BACKSPACE" })).toBe("56-12|-876");
  expect(await exec({ type: "PUT_SYMBOL", payload: "01" })).toBe("56-12-01|76");
  expect(await exec({ type: "PUT_SYMBOL", payload: "2345678" })).toBe("56-12-0123|");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|56-12-0123");
  expect(await exec({ type: "MOVE_CARET", payload: 2 })).toBe("56|-12-0123");
  expect(await exec({ type: "BACKSPACE" })).toBe("5|1-20-123");
  expect(await exec({ type: "BACKSPACE" })).toBe("|12-01-23");
  expect(await exec({ type: "PUT_SYMBOL", payload: "9876" })).toBe("98-76-|0123");
  expect(await exec({ type: "PUT_SYMBOL", payload: "5" })).toBe("98-76-5|123");
});

test("mask rejects bad symbols from real browser input", async () => {
  exec = createBrowserExec({ mask: true, format: dateFormat });

  expect(await exec({ type: "PUT_SYMBOL", payload: "18081978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("18-08-|1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("18-08-|1978");
});

test("mask handles real browser Delete keys", async () => {
  exec = createBrowserExec({
    maskFn: (value) => value.length >= 10,
    format: dateFormat,
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "18081978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("18-08-|1978");
  expect(await exec({ type: "DELETE" })).toBe("18-08-|978");
  expect(await exec({ type: "DELETE" })).toBe("18-08-|78");
  expect(await exec({ type: "DELETE" })).toBe("18-08-|8");
  expect(await exec({ type: "DELETE" })).toBe("18-08|");
  expect(await exec({ type: "DELETE" })).toBe("18-08|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|18-08-1978");
  expect(await exec({ type: "DELETE" })).toBe("|80-81-978");
  expect(await exec({ type: "DELETE" })).toBe("|08-19-78");
  expect(await exec({ type: "PUT_SYMBOL", payload: "18" })).toBe("18-|08-1978");
  expect(await exec({ type: "MOVE_CARET", payload: 1 })).toBe("18-0|8-1978");
  expect(await exec({ type: "DELETE" })).toBe("18-0|1-978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "8" })).toBe("18-08-|1978");
  expect(await exec({ type: "MOVE_CARET", payload: 2 })).toBe("18-08-19|78");
  expect(await exec({ type: "DELETE" })).toBe("18-08-19|8");
  expect(await exec({ type: "DELETE" })).toBe("18-08-19|");
  expect(await exec({ type: "DELETE" })).toBe("18-08-19|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "78" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -5 })).toBe("18-08|-1978");
  expect(await exec({ type: "DELETE" })).toBe("18-08-|1978");
});

test("mask works when equal values do not update state in a real browser", async () => {
  exec = createBrowserExec({ mask: true, format: dateFormat });

  expect(await exec({ type: "PUT_SYMBOL", payload: "18081978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -100 })).toBe("|18-08-1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "18081978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("18-08-|1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1978" })).toBe("18-08-1978|");
  expect(await exec({ type: "MOVE_CARET", payload: -4 })).toBe("18-08-|1978");
  expect(await exec({ type: "BACKSPACE" })).toBe("18-08|-1978");
  expect(await exec({ type: "DELETE" })).toBe("18-08-|1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("18-08-|1978");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("18-08|-1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "x" })).toBe("18-08-|1978");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("18-08|-1978");
  expect(await exec({ type: "PUT_SYMBOL", payload: "1" })).toBe("18-08-1|978");
});

test("mask replacement updates when format is unchanged in a real browser", async () => {
  const parseDigits = (value: string) => (value.match(/\d+/g) || []).join("");
  const addMask = (value: string) => {
    const digits = parseDigits(value);
    const days = digits.slice(0, 2).padEnd(2, "_");
    const months = digits.slice(2, 4).padEnd(2, "_");
    const years = digits.slice(4, 8).padEnd(4, "_");
    return `${days}-${months}-${years}`;
  };
  const formatDate = (value: string) => {
    const chars = parseDigits(value).split("");
    return chars
      .reduce(
        (result, char, index) =>
          index === 2 || index === 4 ? `${result}-${char}` : `${result}${char}`,
        "",
      )
      .substr(0, 10);
  };

  exec = createBrowserExec({ mask: true, format: formatDate, replace: addMask });

  expect(await exec({ type: "MOVE_CARET", payload: 10 })).toBe("__-__-____|");
  expect(await exec({ type: "BACKSPACE" })).toBe("|__-__-____");
  expect(await exec({ type: "MOVE_CARET", payload: 10 })).toBe("__-__-____|");
  expect(await exec({ type: "BACKSPACE" })).toBe("|__-__-____");
});

test("append adds mask symbols through real browser input", async () => {
  const parseDigits = (value: string) => (value.match(/\d+/g) || []).join("");
  const formatDate = (value: string) => {
    const chars = parseDigits(value).split("");
    return chars
      .reduce(
        (result, char, index) =>
          index === 2 || index === 4 ? `${result}-${char}` : `${result}${char}`,
        "",
      )
      .substr(0, 10);
  };
  const formatDateOther = (value: string) => {
    const result = formatDate(value);
    if (value.endsWith("-") && (result.length === 2 || result.length === 5)) {
      return `${result}-`;
    }
    return result;
  };

  exec = createBrowserExec({
    maskFn: (value) => value.length >= 10,
    format: formatDateOther,
    append: (value) => (value.length === 2 || value.length === 5 ? `${value}-` : value),
  });

  expect(await exec({ type: "PUT_SYMBOL", payload: "12" })).toBe("12-|");
  expect(await exec({ type: "BACKSPACE" })).toBe("12|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "-" })).toBe("12-|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "34" })).toBe("12-34-|");
  expect(await exec({ type: "MOVE_CARET", payload: -1 })).toBe("12-34|-");
  expect(await exec({ type: "DELETE" })).toBe("12-34|");
  expect(await exec({ type: "PUT_SYMBOL", payload: "a" })).toBe("12-34|");
  expect(await exec({ type: "BACKSPACE" })).toBe("12-3|");
  expect(await exec({ type: "BACKSPACE" })).toBe("12|");
});
