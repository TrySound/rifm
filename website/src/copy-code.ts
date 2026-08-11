interface ClipboardWriter {
  writeText: (text: string) => Promise<void>;
}

interface HintPopover extends HTMLElement {
  hidePopover?: () => void;
  showPopover?: () => void;
}

const resetTimers = new WeakMap<HTMLElement, number>();
let feedbackGeneration = 0;

const matchesState = (tooltip: HTMLElement, selector: string) => {
  try {
    return tooltip.matches(selector);
  } catch {
    return false;
  }
};

const showFeedback = (tooltip: HintPopover, message: string) => {
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

const getCopyText = (button: HTMLButtonElement) => {
  if (!button.dataset.copyTarget) return "";
  return document.getElementById(button.dataset.copyTarget)?.textContent?.trim() ?? "";
};

export const copyFromButton = async (
  button: HTMLButtonElement,
  clipboard: ClipboardWriter = navigator.clipboard,
) => {
  const tooltipId = button.getAttribute("interestfor");
  const tooltip = tooltipId ? (document.getElementById(tooltipId) as HintPopover | null) : null;
  const text = getCopyText(button);
  if (!tooltip || !text) return;

  try {
    await clipboard.writeText(text);
    showFeedback(tooltip, "Copied");
  } catch {
    showFeedback(tooltip, "Copy failed");
  }
};

export const setupCopyButtons = () => {
  document.querySelectorAll<HTMLButtonElement>("button[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => void copyFromButton(button));
  });
};
