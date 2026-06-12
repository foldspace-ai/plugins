# Remote Action Verification Checklist

Use this checklist when verifying that Foldspace actions from MCP match the
handlers in a browser extension. This is intentionally action-focused; it is not
a general extension sharing or packaging checklist.

## MCP And Agent Studio

- [ ] Foldspace MCP can list agents.
- [ ] Foldspace MCP can list actions for the target agent.
- [ ] Every enabled or launched action is identified.
- [ ] `get_action` confirms `isEnabled`, `launchedVersion`, and final action
      lifecycle state.
- [ ] `get_action_schema` returns a readable schema for each action being
      verified.
- [ ] Actions that are intentionally inactive are excluded or clearly marked.

## Remote Handler Registry

- [ ] The extension action registry is located.
- [ ] `__FOLDSPACE_REMOTE_ACTIONS__` is populated with action objects.
- [ ] Handler keys are available in the code path used by the target extension.
- [ ] No duplicate, shadowed, dev-only, or unreachable handler registration is
      present.
- [ ] Handler values expose `execute` and use the expected remote action shape.

## Action Matching

- [ ] Every enabled or launched MCP action has a matching remote handler key.
- [ ] Every remote handler key has a matching MCP action, or is intentionally
      local-only / unavailable.
- [ ] Handler keys match Foldspace action IDs exactly.
- [ ] MCP schema parameter names match handler parameter usage.
- [ ] Required parameters are validated before work starts.
- [ ] Optional parameters have safe defaults or are handled explicitly.

## Evidence And Execution

- [ ] API calls are grounded in observed live-site requests.
- [ ] Auth/session sources match observed browser state by key name only.
- [ ] Mutating actions have confirmation, Chatterblock UI, or a sandbox-only
      safety note.
- [ ] API failures and status codes are handled explicitly.
- [ ] Action callbacks can reach both `executed` and `finished` in browser tests
      when runtime evidence is available.

## Return Safety

- [ ] Successful returns include only data the LLM needs for the next response.
- [ ] Failure returns use safe structured errors.
- [ ] Returns do not include stack traces, bearer tokens, cookies, raw HTML, raw
      API errors, internal URLs, or full internal response dumps.

## Modality Checks

- [ ] Text-only actions finish with a useful LLM-facing result.
- [ ] Chatterblocks set `awaitUserInput: true` when the user must review, edit,
      confirm, select, or upload.
- [ ] Chatterblocks support submit and cancel paths.
- [ ] Chatterblock `callback` values contain only safe, useful data.
- [ ] Shared State uses stable keys and accurate state descriptions.
- [ ] Shared State calls `clearState` when page context is no longer valid.
- [ ] Task Agent Functions exist, are enabled, and have tested output schemas
      when the extension uses Task Agent calls.

## Overlap And Duplication

- [ ] Action names and descriptions are distinct.
- [ ] Two enabled actions do not target the same user request with different
      wording.
- [ ] Parameter schemas do not duplicate the same workflow in incompatible ways.
- [ ] Observed API flows do not represent the same outcome under multiple action
      keys.
- [ ] Resolver actions are separated from primary actions when lookup is
      reusable.
- [ ] Any overlap has a clear recommendation: merge, differentiate, split
      resolver/primary, or disable.
