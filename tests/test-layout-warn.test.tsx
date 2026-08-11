/** @jest-environment node */

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Rifm } from "../src";

test("does not warn about layout effects during server rendering", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  try {
    const html = ReactDOMServer.renderToString(
      <Rifm value="hello" onChange={() => {}} format={(value) => value}>
        {({ value }) => <span>{value}</span>}
      </Rifm>,
    );

    expect(html).toContain("hello");
    expect(consoleError).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
  }
});
