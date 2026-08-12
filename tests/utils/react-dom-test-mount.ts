import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export const mount = (element: React.ReactElement<unknown>, container: Element) => {
  const root = createRoot(container);
  flushSync(() => root.render(element));
  return () => root.unmount();
};
