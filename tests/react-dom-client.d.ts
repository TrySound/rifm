declare module "react-dom/client" {
  import * as React from "react";

  interface Root {
    render(element: React.ReactElement<unknown>): void;
    unmount(): void;
  }

  export function createRoot(container: Element): Root;
}
