# Agent settings

When the user asks why the agent does or does not do something, or asks to turn
a feature on or off, call `describe_agent_settings` **first**. Match the request
against each setting's `displayName` and `description`, not its `key` — users
name features, not keys.

Settings that tool does not list cannot be read or changed through MCP. Say so
rather than guessing.

## Where a value lives: `scope`

| `scope` | Where it is set | What to do |
|---|---|---|
| `SERVER_ONLY` | On the agent | `value` is what users get. Change it with `update_agent_settings` |
| `SERVER_WITH_CLIENT_OVERRIDE` | On the agent, and the install snippet may override it with `clientKey` | Check the snippet before trusting `value` |
| `CLIENT_ONLY` | Only in the install snippet, under `clientKey` | No stored value. Change it in code |

## The snippet wins

A stored `value` on a `SERVER_WITH_CLIENT_OVERRIDE` setting is **not** proof of
what users see. Search the customer's code for the `clientKey` — usually a
`setConfiguration({...})` call after the loader (`get_agent_install_snippet`
shows the shape). If the snippet sets it, the snippet wins: change it there, and
changing the stored value does nothing for those users. If you cannot see the
customer's code, say which `clientKey` to look for instead of reporting the
stored value as the answer.

## `CLIENT_ONLY` goes in code

Set it in the customer's code with the `clientKey`:

```js
foldspace('when', 'ready', function () {
  foldspace.agent('<apiName>').setConfiguration({ <clientKey>: <value> });
});
```

Never with `update_agent_settings` — it rejects the key, and the whole request
with it.

## Changing a stored setting

`update_agent_settings` writes to the live agent: no draft, no publish step, no
preview. The next real user gets the new value.

- Show the exact keys and values and **wait for the user's yes**.
- Send only the keys that change. Everything else keeps its value.
- `null` resets a setting to its default.
- It is all-or-nothing: one bad key or value rejects the whole request, and the
  error lists every problem.
