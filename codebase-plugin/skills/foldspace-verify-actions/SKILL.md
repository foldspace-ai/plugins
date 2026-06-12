---
name: foldspace-verify-actions
description: Verify that enabled Foldspace actions match real frontend action handlers. Use when the user wants to check action wiring, confirm every enabled MCP action has a matching handler, find schema or parameter mismatches, detect duplicate or overlapping actions, or debug why an action is not available to the agent.
disable-model-invocation: false
---

# Verify Actions

Use this skill to compare the actions configured in Foldspace with the action
handlers implemented in the user's app. This is an action-focused verification
pass, not a general launch or SDK setup checklist.

## Integration Path

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

You are here: step 5 — verify action wiring.

Prerequisites: Foldspace actions exist in Agent Studio or MCP, and local handler
code exists or is expected to exist.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Explain As You Work

As you verify actions, explain these to the user in plain language so they
understand the findings and could check action wiring themselves:

- **Enabled action**: an action that Foldspace may let the agent use. Enabled
  actions should have matching local handlers unless they are intentionally
  unavailable.
- **Handler match**: the action ID in Foldspace and the key registered in
  `addActionHandlers` must match exactly.
- **Schema match**: the handler should accept the same parameter names and types
  that Foldspace sends.
- **Overlap**: two actions are too similar if their names, descriptions, inputs,
  or outcomes could cause the agent to pick the wrong one.

## Prerequisite Gate

If no actions exist yet, route to `foldspace-discover-actions` or
`foldspace-plan-action` depending on whether the user has an idea. If actions
exist but no handlers have been built, route to `foldspace-build-action`.

Use `action-checklist.md` in this skill folder as the checklist source of truth.

Default to a code-review stance: read-only investigation first, findings first in
the response, then recommended fixes.

## Scope

Verify these action-specific areas:

- Every enabled or launched MCP action has a matching frontend handler, unless
  intentionally marked unavailable.
- Every handler key matches the Foldspace action ID exactly.
- Handler parameters match the MCP schema names and expected types.
- Required params are validated before use.
- Each `execute` returns concise, safe LLM-facing success and error objects.
- Chatterblocks use the SDK's expected `awaitUserInput`, `render`, `callback`,
  and `cancel` shape when user input is required.
- Shared State handlers use stable keys and clear state when context is no
  longer valid.
- Actions are distinct enough that the agent can choose the right one.

Do not run broader SDK setup, user context, browser, permissions, or go-live
checks here. Route those issues only if they directly block action verification.

## Workflow

1. **Gather Foldspace action metadata.**
   - If Foldspace MCP tools are connected, call `foldspace_overview`,
     `list_agents`, and `list_actions`.
   - Identify the target agent if multiple agents exist.
   - For every enabled, launched, or user-selected action, call `get_action` and
     `get_action_schema`.
   - If MCP is unavailable, ask the user for exported action keys, enabled state,
     descriptions, and schemas. Mark MCP alignment as unverified until exact
     metadata is available.

2. **Find local action handlers.**
   - Search the frontend for `addActionHandlers`, action registry objects,
     action IDs from MCP, `execute`, `awaitUserInput`, `render`, `callback`,
     `shareState`, and `clearState`.
   - Identify which agent instance receives the handlers.
   - Note any duplicate, shadowed, orphaned, or conditionally unreachable
     handler registrations.

3. **Build the action matrix.**
   - Include every enabled or launched MCP action.
   - Include every local handler key, even if no MCP action matches it.
   - For each row, record MCP state, schema availability, handler found, params
     match, safe return, modality, and status.

4. **Verify each action.**
   - Match every handler key to the Foldspace action key exactly.
   - Match every used parameter to the MCP schema.
   - Confirm required params are validated before use.
   - Confirm each `execute` catches failures and returns safe LLM-facing success
     and error objects.
   - Confirm handler values use the SDK's expected action-object shape with
     `execute`; do not accept bare async functions where action objects are
     expected.
   - For Chatterblocks, confirm `awaitUserInput: true` when user input is
     required, accessible UI, submit/cancel paths, and safe `callback` data.
   - For Shared State, confirm stable keys, accurate descriptions, and cleanup.

5. **Check for overlapping or duplicate actions.**
   - Compare action names, descriptions, parameters, outcomes, and likely user
     prompts.
   - Flag actions that appear to do the same job, differ only by wording, or
     could both match the same user request.
   - Recommend one of:
     - Merge the actions.
     - Differentiate their descriptions, inputs, or outcomes.
     - Split lookup into a resolver action and keep primary actions distinct.
     - Disable one action until its purpose is clear.

6. **Report findings.**
   - Findings first, ordered by severity.
   - Include the action matrix.
   - If no issues are found, say so clearly and mention residual risk, such as
     missing live MCP verification or inability to exercise the UI.

## Output Format

Use this structure:

```markdown
## Foldspace Action Verification

### Action Matrix
| Action Key | MCP State | Handler Found | Params Match | Safe Return | Overlap Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |

### Findings
- Severity:
  Action:
  Location:
  Issue:
  Impact:
  Recommendation:

### Overlap Review
- Actions compared:
- Risk:
- Recommendation:

### Verified
- Actions with matching enabled MCP action + handler:

### Required Fixes
- Blocking fixes before the agent should rely on these actions.

### Unverified
- Anything blocked by missing MCP access, missing schemas, or code paths that could not be inspected.
```

Recommended next-step routing: If handlers are missing or mismatched, recommend
`foldspace-build-action`. If actions are too similar or need schema changes,
recommend `foldspace-plan-action`. If the user does not know what actions should
exist, recommend `foldspace-discover-actions`.

## Next Steps And Summary

Always end with:

```markdown
Summary:
- Completed: <what actions were verified>
- Concepts: <Foldspace terms reinforced, e.g. enabled action, handler match, schema match, overlap>
- If you did this yourself: list enabled actions, find each handler key, compare schemas, and check that no two actions compete for the same user request.
- Next step: <one recommended `foldspace-*` skill with concrete inputs>
- Blockers: <missing MCP access, missing schemas, missing handlers, or None>
```
