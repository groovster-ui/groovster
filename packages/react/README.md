# @groovster/react

Generated React wrappers. The canonical Groovster API remains HTML + `ew-*` classes. Build before publishing:

```bash
pnpm --filter @groovster/react build
```

```tsx
import { EraRoot, Button, Checkbox } from '@groovster/react';
import '@groovster/css/era-widgets.css';

export function Demo() {
  return (
    <EraRoot era="deco" mode="light" fidelityBand="costume">
      <Checkbox name="terms" value="yes" label="Accept terms" />
      <Button variant="primary">Save</Button>
    </EraRoot>
  );
}
```

`fidelityBand` is `whisper`, `standard`, or `costume` (the default when omitted). `default` and `signature` are deprecated aliases of `standard`. Numeric fidelity is not part of this package.

Register `@groovster/elements` before using tabs, select, menu, popover, tooltip, toast, or slider behavior. The wrappers still render the custom-element markup without that script.
