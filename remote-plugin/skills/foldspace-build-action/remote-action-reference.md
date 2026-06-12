# Remote Action Reference

Use this reference when implementing one Foldspace remote action handler in the browser-extension action bundle.

## Handler Shape

- Prefer `snake_case` action keys with lowercase letters, numbers, and
  underscores only. The MCP action key, local registry key, and test/debug
  references must match exactly.
- Keep `execute` small and delegate API calls to `agent/api/` helpers.
- Register action objects whose values contain `execute`; do not register bare async functions.
- Text-only registry example:

```ts
const actions = {
  action_key: {
    execute: async (params) => {
      return {
        success: true,
        message: "Done",
      };
    },
  },
};

(window as any).__FOLDSPACE_REMOTE_ACTIONS__ = actions;
```

- Chatterblock/UI action example:

```ts
const action_key = {
  execute: async (params) => params,
  awaitUserInput: true,
  render: async (params, host, header, callback, cancel) => {
    // Render UI, then call callback with safe data or cancel when dismissed.
  },
};
```

- Keep action-specific orchestration in the handler.
- Move shared API calls, constants, auth helpers, styles, or views into reusable modules.
- Validate params before calling customer APIs.
- Use explicit HTTP status handling and timeouts.
- Return `{ success, message, data? }` on success.
- Return `{ success: false, error, message? }` on failure.
- Include only data the LLM needs for the next response.
- Never return stack traces, bearer tokens, cookies, raw HTML, raw API errors, internal URLs, or full internal response dumps.

## Capability Notes

- Text-only action: use for read flows or simple background mutations.
- Chatterblock: use for review, selection, upload, or confirmation UI. Set `awaitUserInput: true` and wire `render`, `callback`, and `cancel`.
- Shared State: use when page/form state should remain visible to the agent. Call `shareState(...)` and clean up with `clearState(...)`.
- Navigation: use when the action needs route changes or object deep links. Pair with `foldspace-add-navigation` when labels or continuation behavior are not ready.
- Task Agent: use only for one-time LLM extraction, summarization, classification, normalization, enrichment, or generation. Read `task-agent-patterns.md` when needed.

## Resolver Actions

For product objects referenced internally by stable IDs, prefer splitting
reusable lookup from primary execution:

- Resolver actions accept a human-friendly reference and return the stable ID plus lightweight match metadata.
- Primary actions accept the stable ID and perform the read, mutation, or UI flow.
- Do not merge a reusable resolver into a primary action just because it is faster to code because it might be reused later

## Auth And Tenant Context

- Read auth from browser state by key name only.
- Capture the storage shape without logging secret values. Token readers should
  handle raw strings, JSON-encoded strings, and objects with fields such as
  `access_token`, `token`, or `value`.
- Verify auth with a real successful API response, not just by checking that the
  header exists.
- Parse tenant/workspace/account IDs from session data when needed.
- Re-read context after workspace switches.
- Ask for confirmation before writing across tenants or accounts.

Storage reader pattern:

```ts
function readLocalStorageValue(key: string): string | null {
  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object") {
      return parsed.access_token ?? parsed.token ?? parsed.value ?? null;
    }
  } catch {
    return rawValue;
  }

  return rawValue;
}
```

## Remote Action Architecture

- Local development may load actions through `localhost` and the extension
  background fallback.
- Production should use a hosted remote action bundle.
- Do not permanently bundle customer action code into the extension to work
  around local `localhost` loading issues unless the user explicitly chooses
  that architecture.
- Direct page load and background fallback are both local development loading
  paths; background fallback does not mean the remote-action-server model is
  wrong.

## Foldspace Action Lifecycle

- Created: the action exists in Foldspace, but may not be enabled or live.
- Published: the action has a launched version.
- Enabled: the agent is allowed to use the action.
- Registered: the browser action bundle loaded and `agent.addActionHandlers` accepted the local handlers.
- Executed: the Foldspace runtime called the local handler.
- Finished: the handler returned successfully.

After create/update/enable/launch, verify with MCP:

```text
foldspace_overview
list_agents
list_actions
create_action or update_action
enable_action, launch_action_version, or toggle_action_enabled when the user wants it active
get_action
get_action_schema
```

Use `get_action` as the final source of truth for `isEnabled` and
`launchedVersion`.

## Verification

Report:

- Files changed or files to create.
- MCP schema alignment status.
- MCP create/update/enable/publish status, including `isEnabled`, `launchedVersion`, and readable schema.
- DevTools evidence used.
- API endpoints called.
- Reuse decisions.
- Host permission, CSP, credential, and duplicate-injection safety checks.
- Browser verification steps.
