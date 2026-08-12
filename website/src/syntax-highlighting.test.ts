import { expect, test } from "vitest";

test("highlights JSX tags in TSX source", async () => {
  const modulePath = "./syntax-highlighting";
  let highlighted = "";

  try {
    const { highlightCode } = await import(modulePath);
    highlighted = highlightCode("const input = <Input value={value} />", "tsx");
  } catch {}

  expect(highlighted).toContain('class="token tag"');
});
