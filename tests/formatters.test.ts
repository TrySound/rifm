import Alea from "alea";
import { formatFixedPointNumber, formatFloatingPointNumber } from "./format";

test("formatNumber check that format(format(v)) === format(v) in case of parse is identity", () => {
  const prng = new Alea(1000);

  for (let scale = 0; scale !== 5; ++scale) {
    const formatNonFixed = (v: string) => formatFloatingPointNumber(v, scale);
    const formatFixed = (v: string) => formatFixedPointNumber(v, scale);

    for (let i = 0; i != 1000; ++i) {
      const val = prng() * i;
      expect(formatNonFixed(formatNonFixed(`${val}`))).toEqual(formatNonFixed(`${val}`));
      expect(formatFixed(formatFixed(`${val}`))).toEqual(formatFixed(`${val}`));
    }
  }
});

test("formatNumber check that format doesn't change original value", () => {
  const prng = new Alea(1000);
  const parse = (str: string) => str.replace(/[^\d.]+/g, "");

  for (let scale = 0; scale !== 5; ++scale) {
    const formatNonFixed = (v: string) => formatFloatingPointNumber(v, scale);
    const formatFixed = (v: string) => formatFixedPointNumber(v, scale);
    for (let i = 0; i != 1000; ++i) {
      const val = prng() * i;
      const [head, tail] = val.toString().split(".");
      const expectVal = Number.parseFloat(`${head}.${tail != null ? tail.slice(0, scale) : ""}`);

      expect(Number.parseFloat(parse(formatNonFixed(`${val}`)))).toEqual(expectVal);
      expect(Number.parseFloat(parse(formatFixed(`${val}`)))).toEqual(expectVal);
    }
  }
});

test("formatNumber fixed must return equal to scale amount of digits at fractional part", () => {
  const prng = new Alea(100230);
  for (let scale = 0; scale !== 5; ++scale) {
    const formatFixed = (v: string) => formatFixedPointNumber(v, scale);
    for (let i = 0; i !== 1000; ++i) {
      const val = prng() * i;
      const [, tail] = formatFixed(`${val}`).toString().split(".");
      expect(tail != null ? tail.length : 0).toEqual(scale);
    }
  }
});

test("formatNumber non fixed must not allow 0 at scale position", () => {
  // because parseFloat will always remove that 0, and at least at scale position we can prevent it
  const formatNonFixed1 = (v: string) => formatFloatingPointNumber(v, 1);
  const formatNonFixed2 = (v: string) => formatFloatingPointNumber(v, 2);
  const formatNonFixed3 = (v: string) => formatFloatingPointNumber(v, 3);
  const formatNonFixed4 = (v: string) => formatFloatingPointNumber(v, 4);
  expect(formatNonFixed1("0.0")).toEqual("0.");
  expect(formatNonFixed2("0.10")).toEqual("0.1");
  expect(formatNonFixed3("0.110")).toEqual("0.11");
  expect(formatNonFixed4("0.1110")).toEqual("0.111");
});

test("formatNumber non fixed must allow 0 at non scale position otherwise impossible to enter 0.101", () => {
  const formatNonFixed = (v: string) => formatFloatingPointNumber(v, 3);
  expect(formatNonFixed("0.10")).toEqual("0.10");
  expect(formatNonFixed("0.100")).toEqual("0.10");
});

test("formatNumber fixed in absense of fixed point should insert it instead of adding .00", () => {
  // needed for ability skip delete backspace commands on fixed points
  const formatFixed = (v: string) => formatFixedPointNumber(v, 2);

  expect(formatFixed("123")).toEqual("1.23");
  expect(formatFixed("12")).toEqual("0.12");
  expect(formatFixed("1")).toEqual("0.01");
  expect(formatFixed("")).toEqual("0.00");
});
