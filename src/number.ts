export interface NumberFormatterOptions {
  locales?: string | string[];
  allowNegative?: boolean;
  useGrouping?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface NumberFormatter {
  format: (value: string) => string;
  accept: RegExp;
}

/** Creates locale-aware `format` and `accept` props for RIFM. */
export const createNumberFormatter = (options: NumberFormatterOptions = {}): NumberFormatter => {
  const {
    locales,
    allowNegative = false,
    useGrouping = true,
    maximumFractionDigits,
    minimumFractionDigits = 0,
  } = options;

  // Latin digits make the result compatible with RIFM's digit-based caret tracking.
  const latin = { numberingSystem: "latn" };
  const integerFormatter = new Intl.NumberFormat(locales, {
    ...latin,
    useGrouping,
    maximumFractionDigits: 0,
  });
  const partFormatter = new Intl.NumberFormat(locales, {
    ...latin,
    useGrouping: true,
    minimumFractionDigits: 1,
  });
  const decimalSeparator =
    partFormatter.formatToParts(1.1).find((part) => part.type === "decimal")?.value ?? ".";
  const acceptsFraction = maximumFractionDigits !== 0;
  const accept = new RegExp(
    `[\\d${acceptsFraction ? decimalSeparator : ""}${allowNegative ? "\\-" : ""}]`,
    "g",
  );

  const format = (value: string): string => {
    const decimalIndex = acceptsFraction ? value.indexOf(decimalSeparator) : -1;
    const integerSource = decimalIndex < 0 ? value : value.slice(0, decimalIndex);
    const fractionSource = decimalIndex < 0 ? "" : value.slice(decimalIndex + 1);
    const negative = allowNegative && value.includes("-");
    let integer = integerSource.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    let fraction = fractionSource.replace(/\D/g, "");

    if (maximumFractionDigits != null) fraction = fraction.slice(0, maximumFractionDigits);
    if (integer === "" && decimalIndex >= 0) integer = "0";
    if (integer === "") return negative ? "-" : "";

    fraction = fraction.padEnd(minimumFractionDigits, "0");
    const grouped = integerFormatter.format(BigInt(`${negative ? "-" : ""}${integer}`));
    const decimal = decimalIndex >= 0 || minimumFractionDigits > 0;
    return `${grouped}${decimal ? `${decimalSeparator}${fraction}` : ""}`;
  };

  return { format, accept };
};
