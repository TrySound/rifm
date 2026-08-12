# Tsdown ESM Build Migration

## Goal

Replace the legacy Rollup and Babel build with tsdown and publish rifm as a native ESM-only package. The published JavaScript will target ES2022. CommonJS, legacy syntax transforms, source maps, and bundle-size snapshots are out of scope.

## Build

The build configuration will live entirely in the `package.json` script:

```sh
tsdown src/index.ts --format esm --target es2022 --dts --clean
```

Tsdown will bundle `src/index.ts` into `dist/index.js` and generate `dist/index.d.ts`. React will remain external because it is a peer dependency. The build will clean `dist` before emitting output and will not generate source maps.

The separate code and declaration build scripts are no longer needed. `tsconfig.build.json` will be removed because tsdown owns declaration output, while `tsconfig.json` remains the source and test type-checking configuration.

## Package Contract

The root package will declare `"type": "module"`. It will publish only `dist`, rather than publishing the TypeScript source alongside the build.

The package root will be the sole public entry point:

```json
{
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "types": "./dist/index.d.ts"
}
```

The `exports` map intentionally has no `require` or `default` condition: consumers must load rifm as ESM. The top-level `types` field is retained for TypeScript resolvers that do not fully consume conditional exports. Legacy `main`, `module`, and `typings` fields will be removed.

This is an intentional breaking packaging change. It does not alter the JavaScript or TypeScript API exported by `src/index.ts`.

## Removed Tooling And Artifacts

Remove `rollup.config.js`, `tsconfig.build.json`, and `size-snapshot.txt`. Remove the Rollup plugins, Rollup, Babel core and presets, terser plugin, `gzip-size`, and `brotli-size` from development dependencies. Add tsdown as the sole library build dependency.

Existing generated files under ignored `dist` are not source-controlled. A clean tsdown build will replace the local CommonJS, legacy ESM, and minified production outputs with only `index.js` and `index.d.ts`.

## Runtime And CI Support

Current tsdown requires Node `^22.18.0 || >=24.11.0` for the build toolchain. CI will drop Node 20 and test Node 22, 24, and 26. The package's emitted JavaScript target is ES2022; this target describes consumer syntax support independently of tsdown's build-time Node requirement.

## Verification

The migration is complete when:

- Source and test type-checking passes.
- Unit tests pass.
- The tsdown build emits ESM JavaScript and declarations without CommonJS or source-map artifacts.
- The package can be imported through its public root export as ESM.
- The packed package contains only intended published files and exposes matching JavaScript and declaration entry points.
- The workspace website still tests and builds while consuming `rifm` through the workspace package export.
- The lockfile contains the new tsdown dependency graph and no direct legacy build dependencies.

Package-contract verification should exercise the built or packed package rather than importing `src` directly, so it detects stale paths, missing files, and incompatible export conditions.
