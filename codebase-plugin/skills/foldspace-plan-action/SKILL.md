---
name: foldspace-plan-action
description: Turn one product idea into a clear plan for one or more related Foldspace actions before any code. Use when the user has a rough idea like "invite a teammate" or "create an invoice", needs to define what the action should do, needs inputs and behavior written down, or wants an action planned before coding. Not for discovering many ideas or writing handler code.
disable-model-invocation: false
---

# Plan an Action

Use this skill once one action idea is chosen. The goal is a Foldspace-ready
action plan the user approves before coding.

The plan usually defines one action. If the workflow targets product objects by
human-friendly labels but the app needs stable internal IDs, this skill may plan
two related actions: a reusable resolver action plus the primary action.

## Integration Path

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

You are here: step 3 — plan one action.

Prerequisites: One selected action idea or workflow. If no action idea is
selected, use `foldspace-discover-actions` first.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Explain As You Work

As you build the plan, explain these to the user in plain language so they
understand what they are approving and could plan an action themselves:

- **Action plan**: the agreed plan for one action — its ID, what it does, the
  inputs it needs, how it behaves, and what it hands back to the agent.
- **Action ID**: a stable snake_case name that the code and Foldspace both use to
  refer to the same action.
- **Return shape**: the data the action gives back to the agent (kept small and
  safe, never secrets or internal errors).
- **Resolver action**: a reusable lookup action that turns a human-friendly
  reference, such as a name or email, into a stable product ID before a primary
  action uses that ID.

## Resolver-First Action Design

For product objects referenced internally by stable IDs, prefer splitting lookup
from primary execution:

1. A resolver action accepts a human-friendly reference such as name, email,
   number, slug, or label.
2. The resolver returns the stable object ID plus lightweight match metadata.
3. Primary actions accept the stable ID and perform the read, mutation, or UI
   flow.

Use this for common entities such as accounts, projects, tickets, invoices,
users, orders, assets, workspaces, and similar product objects. Do not collapse a
reusable lookup into a one-off primary action when future actions are likely to
need the same ID.

## Prerequisite Gate

If the user does not know what action they want, route to
`foldspace-discover-actions` first.

If the user wants to implement immediately but no schema or approved behavior
exists, stop and produce the action plan for approval first. Planning before
building prevents wasted code and keeps the agent's behavior predictable.

Do not implement handler code in this skill. Hand off an approved plan to
`foldspace-build-action`.

Always read `action-design.md` before finalizing the plan. Use it to preserve
outcome, current flow, AI-enabled flow, success metric, business KPI, and exit
criteria context, and to keep the action bounded, product-grounded, loop-safe,
and distinct from nearby actions.

## When To Use

Use this skill when the user already has a general idea, for example:

- "I want an action that invites a teammate."
- "Help me plan an action for creating invoices."
- "What should the schema be for this Foldspace action?"
- "Turn this workflow into an action plan."

If the user does not know what action they want, use `foldspace-discover-actions`
first. If the action already has an approved schema and behavior, use
`foldspace-build-action`.

## Workflow

1. **Clarify the desired outcome.**
   - Ask what user problem the action should solve.
   - Identify the user, trigger moment, success state, and any constraints.
   - Capture the current flow without AI and the AI-enabled flow with Foldspace.
   - Keep questions focused; ask one at a time when details are missing.

2. **Scan relevant frontend context.**
   - Search for related routes, pages, forms, components, API clients,
     mutations, validation schemas, permissions, and existing UX patterns.
   - For Chatterblock ideas, search for reusable frontend components before
     proposing new UI.
   - Identify likely implementation files and existing APIs.

3. **Choose the action modality.**
   - Read `action-design.md`.
   - Text-Only: background work where the LLM can respond after receiving data.
   - Chatterblock: user must confirm, edit, choose, or provide details in chat.
   - Shared State: the agent needs live page/form context or should update
     visible app state.
   - Explain the choice in product terms so the user learns why it fits.

4. **Design the action shape.**
   - Create a stable snake_case action ID.
   - Write a clear action description for the LLM.
   - Define required and optional parameters with types, descriptions, and any
     enum values.
   - Avoid asking for params that can be derived from current user/session/page
     context.
   - If the action targets an ID-backed product object by user-friendly name or
     label, propose a reusable resolver action plus the primary ID-based action.

5. **Design the return shape.**
   - Include only data the LLM needs for its next response.
   - Include `success` and safe `error` fields for failure cases.
   - Do not include secrets, internal URLs, stack traces, or database details.

6. **Present the plan for approval.**
   - Show the action ID, description, modality, params, return shape, UX notes,
     current flow, AI-enabled flow, success metric, exit criteria, and likely
     implementation locations.
   - If a resolver split is recommended, show both action plans and explain why
     keeping them separate will help future actions.
   - Ask: "Does this action plan look right? Once you approve it, we can build it
     with `foldspace-build-action`."
   - Do not implement code in this skill unless the user explicitly asks after
     approving the plan.

## Output Template

````markdown
## Foldspace Action Plan

### Action
- ID:
- Name:
- Description:
- Modality:
- When the agent should use it:
- User role:
- Outcome:

### Product Flow
- Current flow:
- AI-enabled flow:
- Exit criteria:
- Success metric:
- Business KPI:

### Parameters
- `param_name` (type, required/optional): description

### Return Shape
```json
{
  "success": true
}
```

### UX Behavior
Text-Only, Chatterblock, or Shared State behavior in product terms.

### Resolver Split
- Resolver action needed: yes/no
- Resolver action ID:
- Primary action ID:
- Why this split helps:

### Implementation Notes
- Likely files:
- Existing components/APIs to reuse:
- Error handling notes:

### Next Step
Ask for approval before implementation.
````

Recommended next-step routing: After a plan is approved, recommend
`foldspace-build-action` with the approved action ID, schema, modality, and
implementation notes. If discovery surfaced several actions, plan and build them
one at a time.

## Action Items

Always end with concise user-owned action items, not a recap.

```markdown
Action items:
- <one approval or clarification needed from the user>
- <one exact `foldspace-build-action` handoff with approved action ID, schema, modality, and implementation notes>
```
