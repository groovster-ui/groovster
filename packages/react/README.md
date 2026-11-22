# @groovster/react

Thin generated React wrappers. Canonical API remains HTML + `ew-*` classes.

```tsx
import { EraRoot, Button, Card } from '@groovster/react';
import '@groovster/css/era-widgets.css';

export function Demo() {
  return (
    <EraRoot era="deco" mode="light" fidelity={35} fidelityBand="signature">
      <Card variant="raised">
        <Button variant="primary">Save</Button>
      </Card>
    </EraRoot>
  );
}
```

Vue and Svelte wrappers can follow the same generator pattern.
