---
name: foldspace-verify-actions
description: Verify that enabled Foldspace remote actions match extension handlers. Use when the user wants to check action wiring, confirm every enabled MCP action has a matching __FOLDSPACE_REMOTE_ACTIONS__ handler, find schema or parameter mismatches, detect duplicate or overlapping actions, or debug why a browser-extension action is not available to the agent.
---

# Verify Actions

Use this skill to compare the actions configured in Foldspace with the action
handlers implemented in a browser extension. This is an action-focused
verification pass, not a general extension readiness or sharing checklist.

## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-discover-actions` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: step 5 — verify remote action wiring.

Prerequisites: Remote action handlers exist or are expected to exist, and actions
exist in Foldspace MCP / Agent Studio.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Prerequisite Gate

If action implementation is missing, mark the verification blocked and route to
`foldspace-build-action`. If live-site evidence or an implementation plan is
missing, route to `foldspace-observe-flow-in-site` first.

Use `action-checklist.md` in this skill folder as the checklist source of truth.

## Explain As You Work

As you verify actions, explain these to the user in plain language so they
understand the verdict and could validate remote actions themselves:

- **Enabled action**: an action that Foldspace may let the agent use. Enabled
  actions should have matching extension handlers unless they are intentionally
  unavailable.
- **Remote handler match**: the action ID in Foldspace and the key in
  `__FOLDSPACE_REMOTE_ACTIONS__` must match exactly.
- **Action lifecycle**: created, published/launched, enabled, registered,
  executed, and finished are different states. Do not treat action creation as
  ready-to-use.
- **Overlap**: two actions are too similar if their names, descriptions, inputs,
  observed API calls, or outcomes could cause the agent to pick the wrong one.

## Scope

Verify these action-specific areas:

- Every enabled or launched MCP action has a matching remote handler, unless
  intentionally marked unavailable.
- Every `__FOLDSPACE_REMOTE_ACTIONS__` key matches a Foldspace action ID exactly.
- Handler parameters match the MCP schema names and expected types.
- Mutating actions have confirmation, Chatterblock UI, or a documented
  sandbox-only safety note.
- Each handler returns concise, safe LLM-facing success and error objects.
- Chatterblocks use `awaitUserInput`, `render`, `callback`, and `cancel` when
  user input is required.
- Shared State keys are cleared when page context is no longer valid.
- Task Agent actions have enabled Functions and tested output schemas when used.
- Actions are distinct enough that the agent can choose the right one.

Do not run broader extension readiness checks here, such as host permissions,
CSP, hardcoded secrets, packaged build behavior, sandbox seed data, or reset
plans, unless they directly block action verification.

## Workflow

1. **Gather Foldspace action metadata.**
   - Call `foldspace_overview`.
   - Call `list_agents` to identify the target agent.
   - Call `list_actions` for that agent.
   - For every enabled, launched, or user-selected action, call `get_action` and
     `get_action_schema`.
   - Verify `isEnabled: true` and a present `launchedVersion` before treating an
     action as active/live.
   - If MCP is unavailable, ask for exported action keys, enabled state,
     descriptions, and schemas. Mark MCP alignment as unverified.

2. **Find remote handlers.**
   - Search the extension code for `__FOLDSPACE_REMOTE_ACTIONS__`, action
     registry exports, `execute`, `awaitUserInput`, `render`, `callback`,
     `shareState`, `clearState`, and action keys from MCP.
   - Include handlers loaded through shared `agent/actions`, bundled remote
     action code, or injected action bundles.
   - Note duplicate registrations, unreachable handlers, dev-only handlers, or
     keys that differ from MCP action IDs.

3. **Build the action matrix.**
   - Include every enabled or launched MCP action.
   - Include every remote handler key, even if no MCP action matches it.
   - For each row, record MCP lifecycle state, schema availability, handler
     found, params match, safe return, modality, browser evidence, and status.

4. **Verify each action.**
   - Match every handler key to the Foldspace action key exactly.
   - Match every used parameter to the MCP schema.
   - Confirm required params are validated before use.
   - Confirm each `execute` handles API failures and returns safe LLM-facing
     success and error objects.
   - Confirm API calls are grounded in the observed live-site evidence captured
     during `foldspace-observe-flow-in-site`.
   - For Chatterblocks, confirm `awaitUserInput: true` when user input is
     required, submit/cancel paths, and safe `callback` data.
   - For Shared State, confirm stable keys, accurate descriptions, and cleanup.
   - For Task Agent usage, confirm Function API names / `taskKey`s exist,
     enabled versions are correct, and output schemas are tested.

5. **Check for overlapping or duplicate actions.**
   - Compare action names, descriptions, parameters, observed API calls,
     outcomes, and likely user prompts.
   - Flag actions that appear to do the same job, differ only by wording, or
     could both match the same user request.
   - Recommend one of:
     - Merge the actions.
     - Differentiate their descriptions, inputs, observed flow, or outcome.
     - Split lookup into a resolver action and keep primary actions distinct.
     - Disable one action until its purpose is clear.

6. **Report findings.**
   - Findings first, ordered by severity.
   - Include the action matrix.
   - If no issues are found, say so clearly and mention residual risk, such as
     missing MCP verification or inability to run the browser flow.

## Output

Use this structure:

```markdown
## Foldspace Remote Action Verification

### Action Matrix
| Action Key | MCP State | Handler Found | Params Match | Safe Return | Browser Evidence | Overlap Risk | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

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
- Actions with matching enabled MCP action + remote handler:

### Required Fixes
- Blocking fixes before the agent should rely on these actions.

### Unverified
- Anything blocked by missing MCP access, missing schemas, missing browser evidence, or code paths that could not be inspected.
```

Include only high-signal evidence and do not expose credentials, tokens, cookies,
or private customer data.

Recommended next-step routing: If handlers are missing or mismatched, recommend
`foldspace-build-action`. If browser evidence or an implementation plan is
missing, recommend `foldspace-observe-flow-in-site`. If navigation labels block
verification, recommend `foldspace-add-navigation`.

## Action Items

End with a verification decision and the clearest possible next action. If blocked, recommend exactly one skill and the concrete inputs needed to fix the blocker.

End every response with:

```text
Verification decision: <Ready, Ready with limitations, or Blocked>

Action items:
- <one exact next skill, verification step, or fix with concrete inputs>
- <one MCP access, schema, browser evidence, handler, or route label detail needed from the user, only if needed>
```
