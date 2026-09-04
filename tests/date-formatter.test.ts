import { describe, expect, test } from "vitest";
import { createDateFormatter } from "../src/date";

describe("date formatter", () => {
  test("uses locale field order and separators", () => {
    const us = createDateFormatter({ locales: "en-US" });
    const german = createDateFormatter({ locales: "de-DE" });
    const japanese = createDateFormatter({ locales: "ja-JP" });

    expect(us.format("12082026")).toBe("12/08/2026");
    expect(german.format("12082026")).toBe("12.08.2026");
    expect(japanese.format("20261208")).toBe("2026/12/08");
  });

  test("preserves partial input and limits its length", () => {
    const formatter = createDateFormatter({ locales: "en-US" });

    expect(formatter.format("1")).toBe("1");
    expect(formatter.format("120")).toBe("12/0");
    expect(formatter.format("12 / 08 / 202699")).toBe("12/08/2026");
    expect(formatter.format(formatter.format("12082026"))).toBe("12/08/2026");
  });

  test("supports short years", () => {
    const formatter = createDateFormatter({ locales: "en-GB", year: "short" });

    expect(formatter.format("120826")).toBe("12/08/26");
    expect(formatter.format("12082026")).toBe("12/08/20");
  });

  test("returns an object which can be spread into Rifm options", () => {
    const formatter = createDateFormatter();

    expect(Object.keys(formatter)).toEqual(["format", "accept"]);
    expect("12/08/2026".match(formatter.accept)?.join("")).toBe("12082026");
  });
});
