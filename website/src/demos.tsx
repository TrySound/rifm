import * as React from "react";
import { createRoot } from "react-dom/client";
import { useRifm } from "rifm";
import { formatDate, formatInteger, formatPhone, formatUppercase } from "./formatters";

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
    <span className="field-container">
      {"prefix" in config && <span className="field-prefix type-label">{config.prefix}</span>}
      <input
        aria-label={config.label}
        className="field-input type-label"
        inputMode={config.inputMode}
        placeholder={config.placeholder}
        type="text"
        value={rifm.value}
        onChange={rifm.onChange}
      />
      <span className="type-label row-sm">
        <span className="live-status" /> live
        {/* use gap for fake padding */}
        <span />
      </span>
    </span>
  );
};

export const mountDemos = () => {
  document.querySelectorAll<HTMLElement>("[data-demo]").forEach((element) => {
    createRoot(element).render(<DemoInput kind={element.dataset.demo as DemoKind} />);
  });
};
