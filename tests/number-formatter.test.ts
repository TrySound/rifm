import { describe, expect, test } from "vitest";
import { createNumberFormatter } from "rifm/number";

describe("number formatter", () => {
  test("groups integers and preserves editable fractional values", () => {
    const formatter = createNumberFormatter({ maximumFractionDigits: 2 });

    expect(formatter.format("1234567.20")).toBe("1,234,567.20");
    expect(formatter.format("1,234,567.")).toBe("1,234,567.");
    expect(formatter.format(".5")).toBe("0.5");
    expect(formatter.format("123.456")).toBe("123.45");
    expect(formatter.format("900719925474099312345")).toBe("900,719,925,474,099,312,345");
  });

  test("supports locale separators", () => {
    const formatter = createNumberFormatter({
      locales: "de-DE",
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format("12345,6");
    expect(formatted).toBe("12.345,6");
    expect("12.345,6".match(formatter.accept)?.join("")).toBe("12345,6");
  });

  test("supports signs, fixed precision, custom grouping, and disabled grouping", () => {
    expect(
      createNumberFormatter({
        locales: "en-IN",
        allowNegative: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format("-$12345678.9"),
    ).toBe("-1,23,45,678.90");

    expect(
      createNumberFormatter({ useGrouping: false, maximumFractionDigits: 0 }).format("12,345"),
    ).toBe("12345");
  });

  test("returns an object which can be spread into Rifm options", () => {
    expect(Object.keys(createNumberFormatter())).toEqual(["format", "accept"]);
  });
});
