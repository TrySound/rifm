import "@oddbird/popover-polyfill";
import "interestfor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useRifm } from "rifm";
import { formatDate, formatInteger, formatPhone, formatUppercase } from "./formatters";
import "./styles.css";

const resetTimers = new WeakMap<HTMLElement, number>();
let feedbackGeneration = 0;

const matchesState = (tooltip: HTMLElement, selector: string) => {
  try {
    return tooltip.matches(selector);
  } catch {
    return false;
  }
};

const showFeedback = (tooltip: HTMLElement, message: string) => {
  const generation = ++feedbackGeneration;
  const defaultMessage = tooltip.dataset.defaultMessage ?? tooltip.textContent ?? "Copy code";
  const status = document.getElementById("copy-status");
  tooltip.dataset.defaultMessage = defaultMessage;
  tooltip.textContent = message;
  if (status) status.textContent = message;

  if (!matchesState(tooltip, ":popover-open")) {
    try {
      tooltip.showPopover?.();
    } catch {}
  }

  const currentTimer = resetTimers.get(tooltip);
  if (currentTimer) window.clearTimeout(currentTimer);

  resetTimers.set(
    tooltip,
    window.setTimeout(() => {
      tooltip.textContent = defaultMessage;
      if (status && generation === feedbackGeneration) status.textContent = "";

      const hasInterest =
        tooltip.classList.contains("interest-target") || matchesState(tooltip, ":interest-target");
      if (!hasInterest) {
        try {
          tooltip.hidePopover?.();
        } catch {}
      }
      resetTimers.delete(tooltip);
    }, 1400),
  );
};

const copyFromButton = async (button: HTMLButtonElement) => {
  const tooltipId = button.getAttribute("interestfor");
  const tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  const targetId = button.dataset.copyTarget;
  const text = targetId ? document.getElementById(targetId)?.textContent?.trim() : "";
  if (!tooltip || !text) return;

  try {
    await navigator.clipboard.writeText(text);
    showFeedback(tooltip, "Copied");
  } catch {
    showFeedback(tooltip, "Copy failed");
  }
};

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
      {"prefix" in config && <span className="field-prefix type-mono-value">{config.prefix}</span>}
      <input
        aria-label={config.label}
        className="field-input type-mono-value"
        inputMode={config.inputMode}
        placeholder={config.placeholder}
        type="text"
        value={rifm.value}
        onChange={rifm.onChange}
      />
      <span className="live-status type-label">
        <i /> live
      </span>
    </span>
  );
};

document.querySelectorAll<HTMLElement>("[data-demo]").forEach((element) => {
  createRoot(element).render(<DemoInput kind={element.dataset.demo as DemoKind} />);
});

const storyValue = document.querySelector<HTMLElement>("[data-story-value]");
if (storyValue && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const updateStory = () => {
    const nextState =
      storyValue.getAttribute("data-story-value") === "formatted" ? "unformatted" : "formatted";
    storyValue.setAttribute("data-story-value", nextState);
  };

  window.setInterval(() => {
    document.startViewTransition?.(updateStory) ?? updateStory();
  }, 3000);
}

Prism.highlightAll();

document.querySelectorAll<HTMLButtonElement>("button[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => void copyFromButton(button));
});
