---
name: foldspace-build-action
description: Build the extension code for one agent action after the workflow is understood and approved. Use when the user wants to implement a remote action, write extension handler code, or connect a planned action to APIs observed on the live site.
---

# Build One Action
## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-discover-actions` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: step 3 — build one remote action.

Prerequisites: Approved implementation plan, action schema, and live-site DevTools evidence for one action.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Prerequisite Gate

If API evidence or user approval is missing, stop and route to `foldspace-observe-flow-in-site` before editing code.

Use this skill for one action at a time after `foldspace-observe-flow-in-site` has captured enough browser evidence and the user has approved an implementation plan.

## Explain As You Work

As you build, explain these to the user in plain language so they understand the
code and could extend it themselves:

- **Handler from evidence, not guesses**: the action calls the exact APIs captured on the live site, with auth read from the site's own browser state.
- **Modality**: which behavior you are wiring (text-only, Chatterblock, Shared State, navigation, or Task Agent) and why.
- **The approval gate**: you present an implementation plan and wait for explicit approval before writing action code.

## Important Note

Even if the user wants one main action, the implementation may need supporting
resolver actions. For most product objects referenced internally by stable IDs,
prefer a reusable resolver action that accepts a human-friendly reference and
returns the stable ID plus lightweight match metadata. Then build primary
actions around stable IDs.

Do not collapse a reusable lookup and the main execution into one action just
because it is easier to code. Foldspace agents can call multiple actions in
sequence, and small resolver actions keep future schemas cleaner.

Also you should not be returning any instructions to the agent in actions. All instructions for the agent should be passed in through the agent definition which can be set through the mcp or in Agent Studios in the UI.

## Workflow

1. Confirm this is one action, not a batch. If the user asks for multiple actions, split them and process one action at a time.
2. Review the `foldspace-observe-flow-in-site` handoff: agreed goal, exact user flow, API endpoints, request sequence, auth source, route needs, and missing evidence.
3. Use Foldspace MCP to align action metadata:
   - Call `foldspace_overview`.
   - Call `list_agents` to find the target agent.
   - Call `list_actions` for that agent to see whether each resolver or primary action already exists.
   - Prefer `snake_case` action keys with lowercase letters, numbers, and underscores only.
   - If an action exists, use `update_action` after the implementation plan is approved.
   - If an action does not exist, use `create_action` after the implementation plan is approved. Do not assume newly created actions are enabled or live.
   - If the user wants the action active, explicitly use `enable_action`, `launch_action_version`, or `toggle_action_enabled` as appropriate after creation/update.
   - After create, update, enable, or launch, call `list_actions`, `get_action`, and `get_action_schema`.
   - Prefer `get_action` as the final source of truth for action state.
   - If MCP is unavailable, ask for the exported action key and schema and mark MCP creation/update as blocked.
4. Verify the handler key exactly matches the Foldspace action key.
   - Use the same `snake_case` key in MCP, the local action registry, and any
     docs or test prompts.
   - Verify `isEnabled: true` only when the user wants the action active.
   - Verify `launchedVersion` is present before treating the action as published/live.
   - Verify the schema from `get_action_schema` matches handler params.
5. Choose modality:
   - Text-only for read or simple mutation flows.
   - Chatterblock for review, selection, upload, or confirmation UI.
   - Shared state for keeping page context visible to the agent.
   - Navigation for route changes and object lookup.
   - Task Agent for one-time LLM extraction, summarization, classification, normalization, enrichment, or generation from inside a handler.
6. Explore the existing extension code for reusable API helpers, styles, views, constants, and utils.
7. Write an implementation plan before editing code. In Cursor, use Plan Mode when available; in Claude Code, present the plan and wait for explicit user approval before editing.
8. The plan must list:
   - Files to edit or create.
   - API endpoints this action will call, in order.
   - Params and schema mapping.
   - Resolver action split, when object lookup is reusable.
   - Auth/session source.
   - Reuse plan for shared API helpers, styles, views, constants, and utils.
   - Task Agent plan when needed: whether the Function already exists in the Foldspace web app, Function API name / `taskKey`, Agent Studio instructions summary, input data, output schema, cache policy, streaming policy, and fallback behavior.
   - Browser verification steps.
   - Risks and rollback/reset notes.
9. If the plan requires a Task Agent Function that does not exist yet, stop and give the user a copy-ready Foldspace web app handoff for creating it. Do not code `runTask()` until the user confirms the Function exists and provides the `taskKey`.
10. Ask the user to confirm the implementation plan. Do not write action code until the user approves the plan.
11. After approval, implement API helpers from DevTools evidence, not guesses.
12. Validate params, call APIs with explicit status handling, and return LLM-safe objects.
13. For Chatterblocks, set `awaitUserInput: true` and implement `render(data, host, header, callback, cancel)`.
14. For Shared State, use `shareState(key, state, handler, stateDescription)` and `clearState(key)` on cleanup.
15. Scope host permissions and CSP relaxations to the approved sandbox/client domains only.
16. Never hardcode personal credentials, production customer credentials, bearer tokens, session cookies, or private customer data.
17. Guard SDK and action bundle initialization against duplicate injection.
18. After implementation, create or update the Foldspace actions through MCP using the approved schemas.
19. If the user wants the actions active, explicitly publish/enable them through MCP; otherwise report them as created but inactive.
20. If MCP rejects the requested action key format, explain the accepted key, update the local handler key to match exactly, and retry create/update.
21. Add UI verification instructions for the extension builder.

## Handler Pattern

- Keep `execute` small and delegate API calls to `api.ts`.
- Export action objects whose values contain `execute`; do not register bare async functions.
- Text-only action shape:

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

- Chatterblock/UI action shape:

```ts
const action_key = {
  execute: async (params) => params,
  awaitUserInput: true,
  render: async (params, host, header, callback, cancel) => {
    // Render UI, then call callback with safe data or cancel when dismissed.
  },
};
```

- If an API call is used by more than one action, move it to shared `agent/api/` or a reusable module instead of duplicating it.
- If styles, UI controls, cards, or form helpers are reusable, move them to shared `styles.ts`, `views/`, or a common helper module.
- Keep action-specific orchestration in the action handler and shared primitives in `agent/api/`, `agent/utils.ts`, `agent/constants.ts`, or shared UI/style files.
- If using Task Agent, wrap `agent.runTask()` in a small helper and keep task input/output mapping explicit.
- Do not use Task Agent for simple deterministic transforms or normal CRUD calls.
- Use `AbortController` or a shared timeout helper for network calls.
- Return `{ success, message, data? }` on success.
- Return `{ success: false, error, message? }` on failure.
- Include useful deep links in success returns when the agent may need to reference them later.
- Set explicit action timeouts for customer APIs that may exceed the SDK default.
- Do not return stack traces, bearer tokens, cookies, raw HTML, raw API errors, internal URLs, or full internal response dumps.

## Auth And Tenant Context

- Read auth from the same browser state the website uses, by key name only.
- Preserve the observed storage shape without logging secret values. Token readers
  should handle raw strings, JSON-encoded strings, and objects with fields such
  as `access_token`, `token`, or `value`.
- Verify auth by observing a successful real API response, not just by checking
  that a header was set.
- Parse tenant/workspace/account IDs from session data when needed.
- Re-read context after workspace switches.
- Ask for confirmation before writing across tenants or accounts.

## Output

For each action, report:

- Files changed or files to create.
- Approved implementation plan.
- MCP schema alignment status.
- MCP action lifecycle status: created, enabled, published/launched, schema readable.
- DevTools evidence used.
- API endpoints called.
- Reuse decisions for API helpers, styles, views, constants, and utils.
- Host permission, CSP, credential, and duplicate-injection safety checks.
- Task Agent decisions: web app creation status, `taskKey`, input shape, output schema, cache policy, streaming policy, and fallback behavior.
- Manual browser test steps.
- Remaining risks or missing evidence.

Use `remote-action-reference.md` for handler, modality, return-shape, and verification rules. Use `task-agent-patterns.md` only when the action needs Task Agent processing.
Recommended next-step routing: After implementation, recommend `foldspace-add-navigation` if the action needs routes, or `foldspace-verify-actions` if it is ready to verify.

## How To Test

Every implementation response must include these end-to-end local testing steps:

```sh
npm run dev
```

Then:

1. Open `chrome://extensions`.
2. Reload the unpacked extension.
3. Refresh the target SaaS page.
4. Confirm the Foldspace agent appears.
5. Ask the agent a realistic prompt for the target product and action.
6. Confirm action callbacks show both `executed` and `finished` for each expected action.
7. Inspect the page console for handler errors or API failures such as `401`.


## Action Items

After each implementation pass, explain what changed only as much as needed for the next step. End with concise user-owned action items.

End every response with:

```text
Action items:
- <one exact next skill or verification step>
- <one user approval, setup, credential, seed data, Task Agent Function, or browser test step, only if needed>
```
