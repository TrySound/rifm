import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { describe, expect, test } from "vitest";

const execFileAsync = promisify(execFile);

describe("published package", () => {
  test("exposes only the ESM entry point and its types", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));

    expect(packageJson.type).toBe("module");
    expect(packageJson.files).toEqual(["dist"]);
    expect(packageJson.exports).toEqual({
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
      },
    });
    expect(packageJson.types).toBe("./dist/index.d.ts");
    expect(packageJson).not.toHaveProperty("main");
    expect(packageJson).not.toHaveProperty("module");
    expect(packageJson).not.toHaveProperty("typings");
  });

  test("builds only importable ESM and declarations", async () => {
    expect((await readdir("dist")).sort()).toEqual(["index.d.ts", "index.js"]);

    const { stdout } = await execFileAsync(process.execPath, [
      "--input-type=module",
      "--eval",
      "const rifm = await import('rifm'); console.log(Object.keys(rifm).sort().join(','))",
    ]);
    expect(stdout.trim()).toBe("Rifm,useRifm");
  });
});
