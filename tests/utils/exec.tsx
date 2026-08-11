import * as React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Rifm } from "../../src";
import { InputEmulator, InputCommand, InputState, renderInputState } from "./input-emulator";

interface Props {
  accept?: RegExp;
  mask?: boolean;
  format: (str: string) => string;
  replace?: (str: string) => string;
  append?: (str: string) => string;
  maskFn?: (str: string) => boolean;
  initialValue?: string;
}

export const createExec = (props: Props) => {
  let getVal: (() => InputState) | null = null;
  let execCommand: ((cmd: InputCommand) => void) | null = null;
  let stateValue: string | null = null;

  const Component = () => {
    const [state, setState] = React.useState(props.initialValue != null ? props.initialValue : "");
    stateValue = state;

    return (
      <Rifm
        value={state}
        onChange={setState}
        accept={props.accept}
        format={props.format}
        replace={props.replace}
        append={props.append}
        mask={
          props.mask != null ? props.mask : props.maskFn != null ? props.maskFn(state) : undefined
        }
      >
        {({ value, onChange }) => (
          <InputEmulator value={value} onChange={onChange}>
            {(exec, val) => {
              execCommand = exec;
              getVal = val;
              return null;
            }}
          </InputEmulator>
        )}
      </Rifm>
    );
  };

  TestRenderer.create(<Component />);

  return (cmd: InputCommand) => {
    act(() => {
      if (execCommand == null) {
        throw Error("rifm is not initialized");
      }

      execCommand(cmd);
    });

    if (getVal == null || stateValue == null) {
      throw Error("rifm is not initialized");
    }

    const currentState = getVal();
    const { replace } = props;

    expect(replace ? replace(props.format(stateValue)) : props.format(stateValue)).toEqual(
      currentState.value,
    );

    return expect(renderInputState(currentState));
  };
};
