# Foldspace Action Verification Checklist

Use this checklist when verifying that Foldspace actions from MCP match the
frontend handlers in a codebase. This is intentionally action-focused; it is not
a general SDK setup or launch readiness checklist.

## MCP Action Metadata

- [ ] Foldspace MCP can list agents.
- [ ] Foldspace MCP can list actions for the target agent.
- [ ] Every enabled or launched action is identified.
- [ ] `get_action` confirms each action's enabled/published state.
- [ ] `get_action_schema` returns a readable schema for each action being
      verified.
- [ ] Actions that are intentionally inactive are excluded or clearly marked.

## Handler Registry

- [ ] The frontend action registry is located.
- [ ] The registry is attached to the correct agent instance.
- [ ] Handlers are registered once and are reachable in mounted code.
- [ ] No duplicate, shadowed, or orphaned handler registration is present.
- [ ] Handler values use the SDK's expected action-object shape with `execute`.

## Action Matching

- [ ] Every enabled or launched MCP action has a matching handler key.
- [ ] Every local handler key has a matching MCP action, or is intentionally
      local-only / unavailable.
- [ ] Handler keys match Foldspace action IDs exactly.
- [ ] MCP schema parameter names match handler parameter usage.
- [ ] Required parameters are validated before work starts.
- [ ] Optional parameters have safe defaults or are handled explicitly.

## Return Safety

- [ ] Successful returns include only data the LLM needs for the next response.
- [ ] Failure returns use safe structured errors.
- [ ] Returns do not include stack traces, tokens, internal URLs, raw database
      errors, raw API responses, or other internal details.
- [ ] HTTP status codes and API failures are handled explicitly.

## Modality Checks

- [ ] Text-Only actions finish with a useful LLM-facing result.
- [ ] Chatterblocks set `awaitUserInput: true` when the user must review, edit,
      confirm, select, or upload.
- [ ] Chatterblocks render accessible UI and wire submit/cancel paths.
- [ ] Chatterblock `callback` values contain only safe, useful data.
- [ ] Shared State uses stable keys and accurate state descriptions.
- [ ] Shared State calls `clearState` when page context is no longer valid.

## Overlap And Duplication

- [ ] Action names and descriptions are distinct.
- [ ] Two enabled actions do not target the same user request with different
      wording.
- [ ] Parameter schemas do not duplicate the same workflow in incompatible ways.
- [ ] Resolver actions are separated from primary actions when lookup is
      reusable.
- [ ] Any overlap has a clear recommendation: merge, differentiate, split
      resolver/primary, or disable.
