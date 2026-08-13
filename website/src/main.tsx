import "@oddbird/popover-polyfill";
import "interestfor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import { mountDemos } from "./demos";
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

mountDemos();

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
