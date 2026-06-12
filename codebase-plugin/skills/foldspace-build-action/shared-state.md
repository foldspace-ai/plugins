# Foldspace Shared State

Shared State, also called Tandem Mode, syncs the main application UI with the
Foldspace agent. The agent can read current page state and write updates back
through a handler.

Use it when:

- The user is editing a form that the agent should understand.
- The page has filters, selections, or state that changes action behavior.
- The agent should help update visible app state, not only run background work.

Avoid it when a normal action can complete with explicit params from the action
schema. Shared State adds lifecycle complexity and should be scoped to pages
where live context creates real value.

## React + TypeScript Pattern

```typescript
import { useEffect, useRef, useState } from "react";

type FormState = {
  name: string;
  email: string;
  company?: string;
};

export default function SharedStateForm({ agentKey }: { agentKey: string }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
  });
  const agentRef = useRef<any | null>(null);

  const stateKey = "contact_form";
  const stateDescription =
    "type FormState = { name: string; email: string; company?: string; }";

  useEffect(() => {
    agentRef.current = window.foldspace?.agent(agentKey);

    const handleStateChange = (key: string, nextState: unknown) => {
      if (key === stateKey) {
        setForm(nextState as FormState);
      }
    };

    agentRef.current?.shareState(
      stateKey,
      form,
      handleStateChange,
      stateDescription,
    );

    return () => {
      agentRef.current?.clearState(stateKey);
    };
  }, [form, agentKey]);

  // Render the form using the app's existing component and styling patterns.
}
```

## Review Checklist

- State key is stable and descriptive.
- `stateDescription` accurately describes the exposed shape.
- Handler validates the key before applying updates.
- Cleanup calls `clearState` on unmount.
- The shared state does not expose secrets or unnecessary user data.
