import * as React from "react";
import { Rifm, useRifm } from "../src";
import { css } from "emotion";

const numberFormat = (str: string) => {
  const r = parseInt(str.replace(/[^\d]+/gi, ""), 10);
  return r ? r.toLocaleString("ch") : "";
};

export const TestTypescript = () => {
  const [value, setValue] = React.useState("");

  return (
    <Rifm accept={/\d/g} mask={undefined} value={value} onChange={setValue} format={numberFormat}>
      {({ value, onChange }) => (
        <input value={value} onChange={onChange} className={css({ textAlign: "right" })} />
      )}
    </Rifm>
  );
};

interface CustomInput {
  value: string;
}

export const TestCustomInput = () => {
  const { onChange } = useRifm<CustomInput>({
    value: "",
    onChange: () => {},
    format: (value: string) => value,
  });

  return onChange;
};
