import * as React from "react";
import * as ReactDOM from "react-dom";
import { userEvent } from "vitest/browser";
import { Rifm } from "../../src";
import { InputCommand, renderInputState } from "./input-emulator";

export interface BrowserExecProps {
  accept?: RegExp;
  mask?: boolean;
  format: (str: string) => string;
  replace?: (str: string) => string;
  append?: (str: string) => string;
  maskFn?: (str: string) => boolean;
  initialValue?: string;
}

export interface BrowserExec {
  (command: InputCommand): Promise<string>;
  input: HTMLInputElement;
  cleanup: () => void;
}

export const createBrowserExec = (props: BrowserExecProps): BrowserExec => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const Component = () => {
    const [state, setState] = React.useState(props.initialValue != null ? props.initialValue : "");

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
          <input aria-label="Rifm test input" value={value} onChange={onChange} />
        )}
      </Rifm>
    );
  };

  ReactDOM.render(<Component />, container);

  const input = container.querySelector("input");
  if (input == null) {
    throw Error("rifm browser input is not initialized");
  }
  input.setSelectionRange(0, 0);

  const execute = async (command: InputCommand) => {
    if (command.type === "MOVE_CARET") {
      const start = input.selectionStart;
      if (start == null) {
        throw Error("rifm browser input does not support selection");
      }
      const next = Math.min(Math.max(start + command.payload, 0), input.value.length);
      input.focus();
      input.setSelectionRange(next, next);
    }

    if (command.type === "PUT_SYMBOL") {
      input.focus();
      await userEvent.keyboard(command.payload);
    }

    if (command.type === "BACKSPACE") {
      input.focus();
      await userEvent.keyboard("{Backspace}");
    }

    if (command.type === "DELETE") {
      input.focus();
      await userEvent.keyboard("{Delete}");
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const { selectionStart, selectionEnd, value } = input;
    if (selectionStart == null || selectionEnd == null) {
      throw Error("rifm browser input does not support selection");
    }

    return renderInputState({ value, selectionStart, selectionEnd });
  };

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };

  return Object.assign(execute, { input, cleanup });
};
