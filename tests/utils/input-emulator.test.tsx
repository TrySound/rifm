import * as React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { expect, test, vi } from "vitest";
import { InputCommand, InputEmulator, InputState, renderInputState } from "./input-emulator";

test("Input emulator commands test", () => {
  let getVal: (() => InputState) | null = null;
  let execCommand: ((cmd: InputCommand) => void) | null = null;
  const snaphot: unknown[] = [];
  let reactVal = "";

  const keyDownHandler = vi.fn().mockReturnValue(null);
  const keyUpHandler = vi.fn().mockReturnValue(null);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  const Component = () => {
    const [value, setValue] = React.useState("");
    const onChange = (v: string) => {
      reactVal = v;
      setValue(v);
    };

    return (
      <InputEmulator value={value} onChange={(event) => onChange(event.target.value)}>
        {(exec, val) => {
          execCommand = exec;
          getVal = val;
          return null;
        }}
      </InputEmulator>
    );
  };

  TestRenderer.create(<Component />);

  const exec = (cmd: InputCommand) => {
    act(() => {
      const command = execCommand as ((cmd: InputCommand) => void) | null;
      if (command == null) {
        throw Error("rifm is not initialized");
      }
      command(cmd);
    });
    const getState = getVal as (() => InputState) | null;
    if (getState == null) {
      throw Error("getVal is not initialized");
    }
    const state = getState();
    snaphot.push({ ...state, cmd, withCaret: renderInputState(state) });
  };

  exec({ type: "PUT_SYMBOL", payload: "1" });
  exec({ type: "PUT_SYMBOL", payload: "34" });
  exec({ type: "MOVE_CARET", payload: -2 });
  exec({ type: "PUT_SYMBOL", payload: "2" });
  exec({ type: "MOVE_CARET", payload: 100 });
  exec({ type: "PUT_SYMBOL", payload: "5" });
  exec({ type: "MOVE_CARET", payload: -100 });
  exec({ type: "PUT_SYMBOL", payload: "0" });
  exec({ type: "PUT_SYMBOL", payload: "d" });
  exec({ type: "BACKSPACE" });
  exec({ type: "BACKSPACE" });
  exec({ type: "BACKSPACE" });
  exec({ type: "MOVE_CARET", payload: 100 });
  exec({ type: "BACKSPACE" });
  exec({ type: "MOVE_CARET", payload: -1 });
  exec({ type: "BACKSPACE" });
  exec({ type: "PUT_SYMBOL", payload: "3" });
  exec({ type: "MOVE_CARET", payload: 100 });
  exec({ type: "DELETE" });
  exec({ type: "MOVE_CARET", payload: -1 });
  exec({ type: "DELETE" });
  exec({ type: "MOVE_CARET", payload: -2 });
  exec({ type: "DELETE" });
  exec({ type: "MOVE_CARET", payload: -100 });
  exec({ type: "DELETE" });
  exec({ type: "DELETE" });
  exec({ type: "DELETE" });

  const getState = getVal as (() => InputState) | null;
  expect(reactVal).toEqual(getState == null ? null : getState().value);
  expect(keyDownHandler).toHaveBeenCalled();
  expect(keyUpHandler).toHaveBeenCalled();

  expect(snaphot).toMatchSnapshot();
});

test("Input emulator work as React if values dont match", () => {
  let getVal: (() => InputState) | null = null;
  let execCommand: ((cmd: InputCommand) => void) | null = null;
  const snaphot: unknown[] = [];
  let badSymbol = "";

  const Component = () => {
    const [value, setValue] = React.useState("");
    const onChange = (v: string) => {
      // reactVal = v;
      setValue(v);
    };

    return (
      <InputEmulator value={badSymbol + value} onChange={(event) => onChange(event.target.value)}>
        {(exec, val) => {
          execCommand = exec;
          getVal = val;
          return null;
        }}
      </InputEmulator>
    );
  };

  TestRenderer.create(<Component />);

  const exec = (cmd: InputCommand) => {
    act(() => {
      const command = execCommand as ((cmd: InputCommand) => void) | null;
      if (command == null) {
        throw Error("rifm is not initialized");
      }
      command(cmd);
    });
    const getState = getVal as (() => InputState) | null;
    if (getState == null) {
      throw Error("getVal is not initialized");
    }
    const state = getState();
    snaphot.push({ ...state, cmd, withCaret: renderInputState(state) });
  };

  exec({ type: "PUT_SYMBOL", payload: "1" });
  exec({ type: "PUT_SYMBOL", payload: "2" });
  exec({ type: "MOVE_CARET", payload: -100 });
  badSymbol = "-";
  // cursor should move at the end of input
  exec({ type: "PUT_SYMBOL", payload: "3" });

  expect(snaphot).toMatchSnapshot();
});

test("renderInputState test", () => {
  const snaphot: string[] = [];

  snaphot.push(
    renderInputState({
      value: "hello",
      selectionStart: 1,
      selectionEnd: 4,
    }),
  );

  snaphot.push(
    renderInputState({
      value: "hello",
      selectionStart: 0,
      selectionEnd: 5,
    }),
  );

  snaphot.push(
    renderInputState({
      value: "hello",
      selectionStart: 5,
      selectionEnd: 5,
    }),
  );

  snaphot.push(
    renderInputState({
      value: "hello",
      selectionStart: 0,
      selectionEnd: 0,
    }),
  );

  snaphot.push(
    renderInputState({
      value: "hello",
      selectionStart: 2,
      selectionEnd: 2,
    }),
  );

  expect(() =>
    renderInputState({
      value: "hello",
      selectionStart: 2,
      selectionEnd: 1,
    }),
  ).toThrow();

  expect(snaphot).toMatchSnapshot();
});
