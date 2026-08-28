# Test mode

Test mode keeps local conversations out of the customer's default conversation
list and out of analytics.

## When it matters, and when it does not

| | |
|---|---|
| **Established tenant with real users** | Arm it. Every untagged message lands in the customer's list, indistinguishable from a real one. There is no undo |
| **Brand-new agent, initial setup** | Do not bother. There is no production traffic to pollute, and the whole point of the first run is watching conversations and action calls appear in the dashboard. Use `--no-test-mode` |

## A handle is scoped by mode

`foldspace.agent({apiName})` alone returns the **OVERLAY** instance. On an app
that embeds the copilot that is not the instance serving the chat — so arming it
succeeds, logs success, and leaves the real conversations untagged.

Enumerate and arm every instance:

```js
for (const id of foldspace.agentIds()) {        // "<mode>-<apiName>"
  const cut = id.indexOf("-");
  foldspace
    .agent({ apiName: id.slice(cut + 1), mode: id.slice(0, cut).toUpperCase() })
    .setTestMode(true);
}
```

Arm late and keep arming — the instance serving the chat is built when the panel
opens, long after page load.

## None of these prove test mode is on

- The dev badge — a hardcoded string that never reads SDK state.
- A "test mode ON" log line — it proves the call did not throw, on whichever
  handle you called it on.
- An empty conversation list — `runTask` never appears there.

The SDK exposes no getter and the API has no test dimension, so on an embedded
copilot there is **no programmatic way to confirm it**. Check the dashboard's
SDK Test source filter, and never send probe messages to find out.

## The safe path

`runTask` creates no conversation record. Verify task agents that way and leave
anything needing chat to a human who has decided to accept the cost.
