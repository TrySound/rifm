export interface DateFormatterOptions {
  locales?: string | string[];
  year?: "short" | "long";
}

export interface DateFormatter {
  format: (value: string) => string;
  accept: RegExp;
}

type DatePart = "day" | "month" | "year";

/** Creates locale-aware `format` and `accept` props for RIFM. */
export const createDateFormatter = (options: DateFormatterOptions = {}): DateFormatter => {
  const { locales, year = "long" } = options;
  const yearLength = year === "short" ? 2 : 4;
  const parts = new Intl.DateTimeFormat(locales, {
    calendar: "gregory",
    numberingSystem: "latn",
    day: "2-digit",
    month: "2-digit",
    year: year === "short" ? "2-digit" : "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(Date.UTC(2006, 10, 22)));

  const fields: DatePart[] = [];
  const separators: string[] = [];
  let literal = "";

  for (const part of parts) {
    if (part.type === "day" || part.type === "month" || part.type === "year") {
      if (fields.length > 0) separators.push(literal);
      fields.push(part.type);
      literal = "";
    } else if (fields.length > 0) {
      literal += part.value;
    }
  }

  const lengths: Record<DatePart, number> = { day: 2, month: 2, year: yearLength };
  const maximumLength = 4 + yearLength;
  const accept = /\d/g;

  const format = (value: string): string => {
    const digits = (value.match(accept) ?? []).join("").slice(0, maximumLength);
    const segments: string[] = [];
    let offset = 0;

    for (const field of fields) {
      const segment = digits.slice(offset, offset + lengths[field]);
      if (segment === "") break;
      segments.push(segment);
      offset += lengths[field];
    }

    return segments.reduce(
      (result, segment, index) =>
        index === 0 ? segment : `${result}${separators[index - 1]}${segment}`,
      "",
    );
  };

  return { format, accept };
};
