import "@oddbird/popover-polyfill";
import "interestfor";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useRifm } from "rifm";
import { setupCopyButtons } from "./copy-code";
import { formatDate, formatInteger, formatPhone, formatUppercase } from "./formatters";
import { highlightAll } from "./syntax-highlighting";
import "./styles.css";

type DemoKind = "number" | "phone" | "date" | "uppercase";

const demoConfig = {
  number: {
    label: "Invoice total",
    prefix: "$",
    initialValue: "240000",
    placeholder: "0",
    format: formatInteger,
    accept: /\d/g,
    inputMode: "numeric" as const,
  },
  phone: {
    label: "US phone",
    initialValue: "4155552671",
    placeholder: "(000) 000-0000",
    format: formatPhone,
    accept: /\d/g,
    inputMode: "tel" as const,
  },
  date: {
    label: "Ship date",
    initialValue: "12082026",
    placeholder: "DD / MM / YYYY",
    format: formatDate,
    accept: /\d/g,
    inputMode: "numeric" as const,
  },
  uppercase: {
    label: "Airport code",
    initialValue: "london heathrow",
    placeholder: "TYPE A NAME",
    format: (value: string) => value,
    replace: formatUppercase,
    accept: /[a-z ]/gi,
    inputMode: "text" as const,
  },
};

const DemoInput = ({ kind }: { kind: DemoKind }) => {
  const config = demoConfig[kind];
  const [value, setValue] = React.useState(config.initialValue);
  const rifm = useRifm<HTMLInputElement>({
    value,
    onChange: setValue,
    format: config.format,
    accept: config.accept,
    replace: "replace" in config ? config.replace : undefined,
  });

  return (
    <label className="demo-control">
      <span className="demo-label">{config.label}</span>
      <span className="demo-input-wrap">
        {"prefix" in config && <span className="demo-prefix">{config.prefix}</span>}
        <input
          aria-label={config.label}
          className="demo-input"
          inputMode={config.inputMode}
          placeholder={config.placeholder}
          type="text"
          value={rifm.value}
          onChange={rifm.onChange}
        />
        <span className="live-status">
          <i /> live
        </span>
      </span>
    </label>
  );
};

document.querySelectorAll<HTMLElement>("[data-demo]").forEach((element) => {
  ReactDOM.render(<DemoInput kind={element.dataset.demo as DemoKind} />, element);
});

highlightAll();
setupCopyButtons();
