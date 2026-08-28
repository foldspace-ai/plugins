# Changing something already live

Publishing an edit to a live object **is a production deploy** — immediate, no
review, no rollback commit. The next real user request gets your draft.

## Build a generation beside it

Stand up a parallel object and repoint the code:

```ts
export const actions = {
  // convert_invoice_to_material_list,      // Gen1 — disabled while testing Gen2
  convert_invoice_to_material_list_gen2,
};
```

Gen1 stays published and serving production throughout. Rollback is "stop using
Gen2".

Because a task agent must be published to be callable, `_gen2` objects get
published **before** local testing. That is safe: a published task agent nothing
points at is inert.

**The exception:** an object that is unpublished *and* has no call site. Nothing
can reach it, so edit it in place.

## Naming: `_gen2`, never `_v2`

Foldspace already owns `v1, v2, v3…` and bumps that counter on every save. A
**generation** is a different thing: a parallel object you deliberately stood up
beside the live one. Overloading `v` collides them — `material_agent_v2` sitting
at Foldspace version v1, sourced from the live agent's v4, is three numbers
meaning three different things.

Avoid ticket suffixes like `_plg5622`: precise today, meaningless once nobody
remembers the ticket. **The suffix is permanent** — the `taskKey` in code names
the object, so renaming after promotion costs a second deploy.
