import { formatFixedPointNumber, formatFloatingPointNumber, formatPhone } from "./format";
import { createExec } from "./utils/exec";

test("format works", async () => {
  const format = (v: string) => formatFixedPointNumber(v, 0);
  const exec = createExec({ format });

  exec({ type: "PUT_SYMBOL", payload: "1" }).toMatchInlineSnapshot(`"1|"`);
  exec({ type: "PUT_SYMBOL", payload: "46" }).toMatchInlineSnapshot(`"146|"`);

  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"1|46"`);
  exec({ type: "PUT_SYMBOL", payload: "23" }).toMatchInlineSnapshot(`"12’3|46"`);

  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"12’34|6"`);
  exec({ type: "PUT_SYMBOL", payload: "5" }).toMatchInlineSnapshot(`"123’45|6"`);

  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"123’|456"`);
  exec({ type: "PUT_SYMBOL", payload: "9" }).toMatchInlineSnapshot(`"1’239|’456"`);
  exec({ type: "PUT_SYMBOL", payload: "8" }).toMatchInlineSnapshot(`"12’398|’456"`);

  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"1’239|’456"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"123’|456"`);

  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "MOVE_CARET", payload: 100 }).toMatchInlineSnapshot(`"123’456|"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"12’345|"`);
  exec({ type: "MOVE_CARET", payload: -100 }).toMatchInlineSnapshot(`"|12’345"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"1|2’345"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"|2’345"`);
  exec({ type: "PUT_SYMBOL", payload: "1" }).toMatchInlineSnapshot(`"1|2’345"`);
  exec({ type: "PUT_SYMBOL", payload: "x" }).toMatchInlineSnapshot(`"1|2’345"`);
});

test("format with custom accept works", async () => {
  const format = (v: string) => formatFloatingPointNumber(v, 2);
  const exec = createExec({
    accept: /[\d.]/gi,
    format: format,
  });

  exec({ type: "PUT_SYMBOL", payload: "1" }).toMatchInlineSnapshot(`"1|"`);
  exec({ type: "PUT_SYMBOL", payload: "46" }).toMatchInlineSnapshot(`"146|"`);
  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"1|46"`);
  exec({ type: "PUT_SYMBOL", payload: "23" }).toMatchInlineSnapshot(`"12’3|46"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"12’34|6"`);
  exec({ type: "PUT_SYMBOL", payload: "5" }).toMatchInlineSnapshot(`"123’45|6"`);

  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"123’|456"`);
  exec({ type: "PUT_SYMBOL", payload: "9" }).toMatchInlineSnapshot(`"1’239|’456"`);
  exec({ type: "PUT_SYMBOL", payload: "8" }).toMatchInlineSnapshot(`"12’398|’456"`);

  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"1’239|’456"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"123’|456"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "MOVE_CARET", payload: 100 }).toMatchInlineSnapshot(`"123’456|"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"12’345|"`);
  exec({ type: "MOVE_CARET", payload: -100 }).toMatchInlineSnapshot(`"|12’345"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"1|2’345"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"|2’345"`);
  exec({ type: "PUT_SYMBOL", payload: "1" }).toMatchInlineSnapshot(`"1|2’345"`);
  exec({ type: "PUT_SYMBOL", payload: "x" }).toMatchInlineSnapshot(`"1|2’345"`);
  exec({ type: "MOVE_CARET", payload: 100 }).toMatchInlineSnapshot(`"12’345|"`);
  exec({ type: "PUT_SYMBOL", payload: "." }).toMatchInlineSnapshot(`"12’345.|"`);
  exec({ type: "PUT_SYMBOL", payload: "0" }).toMatchInlineSnapshot(`"12’345.0|"`);
  exec({ type: "PUT_SYMBOL", payload: "0" }).toMatchInlineSnapshot(`"12’345.0|"`);
  exec({ type: "MOVE_CARET", payload: -1 }).toMatchInlineSnapshot(`"12’345.|0"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123’45|0"`);
  exec({ type: "MOVE_CARET", payload: -1 }).toMatchInlineSnapshot(`"123’4|50"`);
  exec({ type: "PUT_SYMBOL", payload: "." }).toMatchInlineSnapshot(`"1’234.|5"`);
  exec({ type: "MOVE_CARET", payload: -3 }).toMatchInlineSnapshot(`"1’2|34.5"`);
  exec({ type: "PUT_SYMBOL", payload: "." }).toMatchInlineSnapshot(`"12.|34"`);
  exec({ type: "MOVE_CARET", payload: -1 }).toMatchInlineSnapshot(`"12|.34"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"1|.34"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"|0.34"`);

  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"0|.34"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"|34"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"|4"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"|"`);

  exec({ type: "PUT_SYMBOL", payload: "123456789.12" }).toMatchInlineSnapshot(`"123’456’789.12|"`);
  exec({ type: "MOVE_CARET", payload: -11 }).toMatchInlineSnapshot(`"123|’456’789.12"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"123’|456’789.12"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"12’3|56’789.12"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"1’23|6’789.12"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"123|’789.12"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"123’|789.12"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’789.12"`);
  exec({ type: "MOVE_CARET", payload: 4 }).toMatchInlineSnapshot(`"123’789|.12"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"12’378’9|12"`);
});

test("format with fixed point delete backspace", async () => {
  const format = (v: string) => formatFixedPointNumber(v, 2);

  const exec = createExec({
    accept: /[\d.]/gi,
    format,
  });

  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"0|.00"`);
  exec({ type: "PUT_SYMBOL", payload: "1" }).toMatchInlineSnapshot(`"1|.00"`);
  exec({ type: "MOVE_CARET", payload: 1 }).toMatchInlineSnapshot(`"1.|00"`);

  exec({ type: "PUT_SYMBOL", payload: "23" }).toMatchInlineSnapshot(`"1.23|"`);
  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"1.|23"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"1|.23"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"1.|23"`);
  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"|1.23"`);

  exec({ type: "PUT_SYMBOL", payload: "0" }).toMatchInlineSnapshot(`"|1.23"`);
  exec({ type: "PUT_SYMBOL", payload: "40" }).toMatchInlineSnapshot(`"40|1.23"`);
  exec({ type: "MOVE_CARET", payload: -2 }).toMatchInlineSnapshot(`"|401.23"`);

  exec({ type: "PUT_SYMBOL", payload: "00" }).toMatchInlineSnapshot(`"|401.23"`);
});

test("format works even if state is not updated on equal vals", async () => {
  const format = (v: string) => formatFixedPointNumber(v, 0);

  const exec = createExec({
    format,
  });
  exec({ type: "PUT_SYMBOL", payload: "123456" }).toMatchInlineSnapshot(`"123’456|"`);
  exec({ type: "MOVE_CARET", payload: -3 }).toMatchInlineSnapshot(`"123’|456"`);
  exec({ type: "BACKSPACE" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"123’|456"`);
  exec({ type: "PUT_SYMBOL", payload: "x" }).toMatchInlineSnapshot(`"123|’456"`);
  exec({ type: "PUT_SYMBOL", payload: "x" }).toMatchInlineSnapshot(`"123|’456"`);
});

it("format can work with case changes", () => {
  const exec = createExec({
    format: (v) => v,
    replace: (v) => v.toLowerCase(),
    accept: /.+/g,
  });

  exec({ type: "PUT_SYMBOL", payload: "HELLO WORLD" }).toMatchInlineSnapshot(`"hello world|"`);
  exec({ type: "MOVE_CARET", payload: -5 }).toMatchInlineSnapshot(`"hello |world"`);
  exec({ type: "PUT_SYMBOL", payload: "BeAuTiFuL " }).toMatchInlineSnapshot(
    `"hello beautiful |world"`,
  );
});

it("replace is applied to input value", () => {
  const exec = createExec({
    format: (v) => v,
    replace: (v) => v.toLowerCase(),
    accept: /.+/g,
    initialValue: "HeLLo",
  });

  exec({ type: "MOVE_CARET", payload: -5 }).toMatchInlineSnapshot(`"|hello"`);
});

it("moves cursor to expected position when deleting with more than 1 non-accepted chars after cursor", () => {
  const exec = createExec({
    format: formatPhone,
    accept: /\d+/g,
    initialValue: "1 (234) 567",
  });

  exec({ type: "MOVE_CARET", payload: 6 }).toMatchInlineSnapshot(`"1 (234|) 567"`);
  exec({ type: "DELETE" }).toMatchInlineSnapshot(`"1 (234) |567"`);
});
