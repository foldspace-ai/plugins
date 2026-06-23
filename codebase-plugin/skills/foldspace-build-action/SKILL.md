---
name: foldspace-build-action
description: Write the code so the agent can perform one defined action in the user's app. Use when the user wants to implement an action, build a handler, connect an approved action to their frontend, or make the agent actually do something in the product.
disable-model-invocation: false
---

# Build an Action

## Integration Path

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

You are here: step 4 — build the action (write the handler code).

Prerequisites: The agent is set up, users are connected, and an approved Foldspace action schema or spec exists.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Explain As You Work

As you work, explain these to the user in plain language so they understand what
is happening and could do it themselves next time:

- **Action handler**: the code that runs in their app when the agent triggers an
  action. Its return value goes straight back to the agent, so it must stay small
  and safe.
- **Chatterblock / Text-Only / Shared State**: the three ways an action can
  behave. Tell the user which one you are wiring for this action and why it fits.

## Prerequisite Gate

If action metadata or schema is missing and the action has been defined through
the Foldspace web app, ask to fetch it from MCP. If it is a brand-new action with
no spec, route to `foldspace-plan-action` before coding.

Guide the user through implementing Foldspace SDK actions that match their
Foldspace action schemas and local application architecture.

## Before You Start

Foldspace is a low-code LLM platform for B2B SaaS. The key invariant is that the
return value of any Foldspace action goes directly back to the LLM agent. Return
concise, safe data that helps the agent decide what to say or do next.

If this is the first time mentioning these implementation modes in the
conversation, briefly say: "(If you are not familiar with what a Chatterblock,
Text-Only action, or Shared State is, let me know and I can explain better!)"

For product objects referenced internally by stable IDs, preserve the approved
resolver-first design: reusable resolver actions should accept human-friendly
references and return stable IDs, while primary actions should accept those IDs.
Do not merge reusable lookup and primary execution into one handler just because
it is faster to code.

Always read `error-handling.md` before writing or reviewing any action handler.
Error handling is part of the required workflow, not optional reference material.
Always read `action-design.md` before planning or implementing handler
behavior. The handler should preserve the approved product outcome, modality,
exit criteria, and loop-safety assumptions.

Read other references only when needed:

- For action product design and loop-safety checks, see `action-design.md`.
- For modality selection and examples, see `action-modalities.md`.
- For Tandem Mode / Shared State implementation, see `shared-state.md`.

## Important Note:

You should not be returning any instructions to the agent in actions. All instructions for the agent should be passed in through the agent definition which can be set through the mcp or in Agent Studios in the UI.

## Workflow

Follow these steps in order. Pause where instructed.

1. **Discover action metadata.**
   - Prefer the Foldspace MCP server if connected.
   - If using MCP, call `foldspace_overview`, `list_agents`, and `list_actions`.
   - If an approved action already exists, call `get_action_schema` for each
     selected action
   - If an approved action spec exists locally but not in Foldspace yet, offer to
     create it with `create_action` before coding.
   - If an existing action needs schema or description changes, offer to update
     it with `update_action` after the user approves the change.
   - If MCP is unavailable, ask the user to provide action ID, action
     name/description, and parameter schema. Do not continue until those fields
     are present. If the user hasn't thought at all about the schema or the action
     then call the foldspace-plan-action skill to better define it.

2. **Scan the host codebase.**
   - Identify framework, language, routing, component structure, styling,
     networking library, validation patterns, and error handling conventions.
   - Confirm the stack summary to the user before proposing implementation.

3. **Plan the product behavior.**
   - Read `action-design.md`.
   - For each action, choose Text-Only or Chatterblock. Use Shared State only
     when the action needs live page/form context.
   - Confirm whether a resolver action is needed for any ID-backed product
     object, and keep resolver and primary actions separate when lookup is
     reusable.
   - Explain when the action is activated, what runs in the background, and what
     UI appears if it is a Chatterblock.
   - Ask: "Does this plan look good to you? Once you approve, I will implement
     the code."
   - Do not write code until the user approves.

4. **Verify Foldspace SDK initialization.**
   - Find the SDK loader script that loads `foldspace.js` and includes a product
     key such as `EU-$productId-1-1`.
   - Find the agent initialization, usually `foldspace.agent('agentName').show()`
     inside a `foldspace('when', 'ready', ...)` callback.
   - If found, confirm which agent receives the action handlers.
   - If missing, explain that product ID and agent initialization are required
     before actions can be added. Route to `foldspace-setup-agent` and pause.

5. **Implement the handlers.**
   - Read `error-handling.md` before editing code.
   - Add complete handlers using the app's local patterns.
   - Keep action IDs exactly matched to Foldspace action IDs.
   - If MCP rejects a requested action key format, explain the accepted key and
     update the local handler key to match exactly.
   - Validate params before work starts.
   - Wrap each `execute` in `try/catch`.
   - Check HTTP status codes explicitly.
   - Return safe LLM-facing success/error objects. Never return stack traces,
     internal URLs, database errors, or server internals.
   - For Chatterblocks, ensure `awaitUserInput: true`, render accessible UI,
     call `callback` with safe data, and wire cancellation.

6. **Review the wiring.**
   - Re-read `error-handling.md` before reviewing the final handler behavior.
   - Trace from agent initialization to `addActionHandlers`.
   - Verify each action ID and parameter shape matches the provided schema.
   - Confirm resolver handlers return stable IDs and primary handlers accept
     those IDs rather than repeating lookup logic.
   - Confirm handlers are attached to the right agent and are not duplicated,
     shadowed, or orphaned.
   - Confirm error handling follows `error-handling.md`.
   - Present findings before calling the work complete.

7. **Offer Shared State.**
   - After primary actions are done, ask: "Would you like to implement Shared
     State (Tandem Mode) to allow the Foldspace agent to interact directly with
     any forms or pages the user is currently looking at?"
   - If yes, scan for relevant forms or complex page states, propose up to 10,
     and implement only after approval.

Recommended next-step routing: After implementation, recommend
`foldspace-verify-actions` for a focused action wiring audit, or
another `foldspace-build-action` pass for the next approved action.

## Action Items

After each implementation pass, explain what changed only as much as needed for the next step. End with concise user-owned action items.

```markdown
Action items:
- <one exact next skill, verification step, or next approved action build with concrete inputs>
- <one schema, MCP access, approval, or browser test step needed from the user, only if needed>
```
