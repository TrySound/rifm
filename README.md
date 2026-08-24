# RIFM — React Input Format & Mask

A small, dependency-free React hook and component for building formatted and masked inputs without losing the cursor position.

[Live demo](https://trysound.github.io/rifm)

## Why RIFM?

- Keeps the caret in the expected place while formatting
- Works with native inputs, textareas, and custom input components
- Supports formatting, masks, case enforcement, and other transformations
- Provides both a hook and a render-prop component
- Has no runtime dependencies and is about 1.4 kB gzipped
- Includes TypeScript declarations
- Supports React 16.8 and newer

## Install

```sh
pnpm add rifm
```

You can also install it with `npm install rifm` or `yarn add rifm`.

## Quick start

RIFM is controlled: keep the formatted value in state, pass it to `useRifm`, and attach the returned props to your input.

```tsx
import { useState } from "react";
import { useRifm } from "rifm";

const formatInteger = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function PriceInput() {
  const [value, setValue] = useState("");
  const rifm = useRifm<HTMLInputElement>({
    value,
    onChange: setValue,
    format: formatInteger,
  });

  return <input {...rifm} aria-label="Price" inputMode="numeric" placeholder="0" type="text" />;
}
```

The `onChange` callback receives the formatted string—not the React change event.

> [!IMPORTANT]
> Use `type="text"` with an appropriate [`inputMode`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode). RIFM does not support `type="number"` or `type="date"` because those controls do not expose the selection APIs needed to restore the caret.

## Render-prop API

If hooks are not convenient, use the `Rifm` component. It accepts the same options and passes input props to its child function.

```tsx
import { useState } from "react";
import { Rifm } from "rifm";

export function PriceInput() {
  const [value, setValue] = useState("");

  return (
    <Rifm value={value} onChange={setValue} format={formatInteger}>
      {({ value, onChange }) => (
        <input type="text" inputMode="numeric" value={value} onChange={onChange} />
      )}
    </Rifm>
  );
}
```

Because RIFM only supplies `value` and `onChange`, the input can be a native element or any component that accepts compatible props.

## API

Both `useRifm(options)` and `<Rifm {...options}>` accept the following options.

### Required options

| Option     | Type                        | Description                           |
| ---------- | --------------------------- | ------------------------------------- |
| `value`    | `string`                    | The controlled input value.           |
| `onChange` | `(value: string) => void`   | Called with the next formatted value. |
| `format`   | `(value: string) => string` | Formats the value after every edit.   |

### Optional options

| Option     | Type                        | Default | Description                                                                                                      |
| ---------- | --------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `accept`   | `RegExp`                    | `/\d/g` | Matches characters whose order RIFM tracks when restoring the caret. Use a global regular expression.            |
| `replace`  | `(value: string) => string` | —       | Post-processes the formatted value while preserving the caret, for example to enforce uppercase or replace text. |
| `append`   | `(value: string) => string` | —       | Post-processes insertions made at the end; useful when a formatter needs to append a separator.                  |
| `mask`     | `boolean`                   | —       | Enables replacement-style mask editing and caret movement across mask separators.                                |
| `children` | `(props) => ReactNode`      | —       | Required by `<Rifm>` only. Receives `{ value, onChange }`.                                                       |

### Return value

`useRifm` returns the same object passed to the `Rifm` child function:

```ts
{
  value: string;
  onChange: React.ChangeEventHandler<E>;
}
```

Pass both properties to the underlying input.

## Accepted characters and caret behavior

RIFM restores the caret by tracking the characters matched by `accept`. The formatter may insert, remove, or move separators, but it should preserve the order of those accepted characters.

For example, with digits as accepted characters:

```text
Before typing: 1,234|67
Type "5":      1,2345|67
Formatted:     1,234,5|67
```

The commas move, but the digits before the caret remain in the same order, so RIFM can find the correct position. Set `accept` when formatting something other than digits:

```tsx
const rifm = useRifm({
  value,
  onChange: setValue,
  format: (value) => value,
  replace: (value) => value.replace(/[^a-z ]/gi, "").toUpperCase(),
  accept: /[a-z ]/gi,
});
```

Use `replace` for transformations such as case enforcement that change accepted characters themselves.

## TypeScript

The hook and component can infer common input types. For an explicit custom element or component event type, provide the generic parameter:

```tsx
const inputProps = useRifm<HTMLInputElement>({
  value,
  onChange: setValue,
  format: formatInteger,
});
```

## Development

```sh
pnpm install
pnpm test
pnpm run build
```

The test suite includes TypeScript, unit, and browser tests.

## License

[MIT](LICENSE)
