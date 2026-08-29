import { describe, expect, test } from "vitest";
import { formatDate, formatPhone, formatUppercase } from "./formatters";

describe("example formatters", () => {
  test("formats a US phone number with libphonenumber as the user types", () => {
    expect(formatPhone("4155552671")).toBe("(415) 555-2671");
    expect(formatPhone("41555")).toBe("(415) 55");
    expect(formatPhone("1234567")).toBe("1 (234) 567");
    expect(formatPhone("415555267199")).toBe("(415) 555-2671");
  });

  test("formats a date and limits it to eight digits", () => {
    expect(formatDate("12082026")).toBe("12 / 08 / 2026");
    expect(formatDate("1208202699")).toBe("12 / 08 / 2026");
  });

  test("normalizes text to uppercase latin characters", () => {
    expect(formatUppercase("Rifm 2026! café")).toBe("RIFM  CAF");
  });
});
