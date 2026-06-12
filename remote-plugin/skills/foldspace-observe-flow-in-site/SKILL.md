---
name: foldspace-observe-flow-in-site
description: Figure out how one agent action works on a live website by opening a dedicated Chrome DevTools MCP page, letting the user sign in and perform the flow, then capturing network calls and browser evidence for implementation. Use when the user needs to understand a workflow on the customer site, capture API calls from the browser, reverse-engineer a flow, or gather evidence before building one action.
---

# Learn From the Live Site
## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: step 2 — learn one live-site action flow.

Prerequisites: One candidate action, target URL, account role, and user confirmation of the browser flow to observe.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Prerequisite Gate

If no extension exists yet, decide whether to create one with `foldspace-create-extension` before collecting evidence.

Use this skill for one action at a time when the client has not shared source code and the action must be understood from the website itself.

If the user names a concrete action they want to build, route here before
implementation. Explain that observing the real site lets the agent capture the
actual APIs, auth source, payloads, and response shapes, so the user can see real
changes in their system instead of guessed code.

## Explain As You Work

As you observe the site, explain these to the user in plain language so they
understand the evidence and could reverse-engineer a flow themselves:

- **Why evidence comes before code**: the action must call the site's real APIs, so you watch the actual flow before writing anything.
- **DevTools evidence**: the network calls, auth source, and payload/response shapes captured while the user performs the flow.
- **The approval pause**: this skill ends with a plan handoff — code is written only after the user approves it in the next step.

## Quick Start

Run this skill for exactly one candidate action. Do not start browser exploration until the user and agent agree on the action goal and expected user flow.

1. Collect the target URL, account role, candidate action name, extension objective, and sandbox limitations.
2. Align with the user on the action flow:
   - What should the action accomplish?
   - What should the user see before and after it runs?
   - What data should the action read or change?
   - Which steps should the user perform manually during observation?
   - Which steps are impossible to complete in the UI right now?
3. Restate the agreed flow and ask for confirmation before DevTools observation.
4. Use Chrome DevTools MCP to open the target URL with `new_page`. Tell the user this is the browser window they should use.
5. Ask the user to sign in, perform only the agreed flow in that DevTools-controlled page, and tell you when they are done.
6. After the user finishes, capture the network log and browser state with Chrome DevTools MCP tools. Read the relevant requests and responses before producing the action record.
7. Launch `devtools-reader` if deeper interpretation of the captured DevTools evidence is needed. Launch `navigation-mapper` only if this action needs route labels, object deep links, or cross-page continuation.
8. Produce one action flow record using `action-inventory-template.md`.

## User-Driven DevTools Observation

Default to this observation sequence:

1. Agent opens the target site in Chrome DevTools MCP using `new_page`.
2. Agent pauses and gives the user clear manual steps to perform in that opened page.
3. User signs in with their credentials and completes the agreed flow. The agent does not ask for credentials and does not perform authenticated actions unless the user explicitly asks.
4. User tells the agent the flow is complete.
5. Agent reads the network log, console messages, current URL, and page state from Chrome DevTools MCP.
6. Agent filters the evidence to the calls needed for the one action, then passes an implementation-ready handoff to `foldspace-build-action`.

Do not start summarizing or coding from memory. The deliverable of this skill is the observed evidence and handoff, not implementation code.

## Resolver-First Action Design

For most product objects referenced internally by stable IDs, default to this
flow:

1. Search or resolve the object from a user-provided name, label, email, number,
   slug, or other natural key.
2. Return the stable object ID plus lightweight match metadata.
3. Use that stable ID in the primary action.
4. Optionally fetch related records or perform the primary operation after the ID
   is known.

Only use the currently open page as the source of object identity when the user
explicitly asks for a page-context action but actions in general should work from every page

When the observed flow contains a reusable lookup step, the handoff must propose
separate actions instead of one combined action. Examples:

- `find_account_id` -> `get_account_overview(accountId)`
- `find_project_id` -> `get_project_summary(projectId)`
- `find_ticket_id` -> `update_ticket_status(ticketId, status)`
- `find_invoice_id` -> `send_invoice_reminder(invoiceId)`

Foldspace agents can call multiple actions in sequence, so reusable resolver
actions reduce duplicated lookup code and keep future schemas cleaner.

## Browser MCP Requirement

For live-site observation, use the Chrome DevTools MCP server from this plugin, not Cursor's built-in browser tab.

- Prefer `chrome-devtools` tools such as `list_pages`, `new_page`, `navigate_page`, `take_snapshot`, `take_screenshot`, `list_network_requests`, `get_network_request`, `list_console_messages`, and `evaluate_script`.
- Do not use `cursor-ide-browser` tools such as `browser_tabs`, `browser_navigate`, or `browser_cdp` for the primary observation flow unless the Chrome DevTools MCP server is unavailable.
- If no Chrome DevTools MCP page exists yet, call `new_page` with the target URL. The MCP config launches a dedicated Chrome instance for that page, so it will not attach to the user's normal already-open Chrome window.
- After opening the page, stop and ask the user to sign in and perform the agreed flow in that dedicated Chrome window. Wait for the user to say they are done before reading the network log.
- After the user completes the flow, use `list_network_requests` and `get_network_request` to record API methods, URL patterns, query parameters, request bodies, status codes, and response shapes. Use `list_console_messages`, `take_snapshot`, and `evaluate_script` only to fill gaps in route, page state, or errors.
- If only Cursor browser tools are available, stop and report that Chrome DevTools MCP is unavailable instead of continuing with incomplete evidence.
- Do not ask the user to inspect Network manually unless Chrome DevTools MCP is unavailable.
- Capture auth source by storage/header/cookie key name and storage shape only. Do not record secret values.
- When auth is stored in browser storage, record whether the value shape is a raw string, JSON-encoded string, or object. If it is an object, record safe field names such as `access_token`, `token`, or `value`, but never token values.
- Verify auth evidence with a real `200` API response when possible, not just by observing that a header exists.
- IMPORTANT: LET THE USER GO THROUGH THE FLOW THEMSELVES UNLESS THEY INSTRUCT YOU TO GO THROUGH IT WITH THE MCP

## What To Capture

- Agreed action goal and out-of-scope assumptions.
- Step-by-step user flow for this action only.
- User-visible outcome and why it matters in an extension.
- Page URLs and route patterns.
- API method, URL pattern, auth source, auth storage shape, payload shape, response shape.
- Full list of API endpoints this action appears to call.
- DOM selectors only when API calls are not enough.
- Tenant/workspace/account context.
- Confirmation needs for mutating actions.
- Data that is safe to return to the LLM.
- Whether the workflow needs text-only execution, Chatterblock review, Shared State, Navigation, Messaging API nudges, or Task Agent processing.
- If Task Agent processing may be needed: what the one-time LLM should extract, summarize, classify, normalize, enrich, or generate.

## Important Note

Even if the user asks for one main action, the correct design may require
supporting resolver actions. Whenever a product object is selected by a
human-friendly reference but the API needs an ID, prefer a reusable resolver
action plus a primary ID-based action. This applies broadly to accounts,
projects, tickets, invoices, users, orders, assets, workspaces, and similar
objects.

## Plan Handoff

Do not write code from this skill. End with an implementation-planning handoff for `foldspace-build-action`.

The handoff must include:

- Agreed flow.
- API endpoints and request sequence.
- Auth/session source by key name only.
- Auth storage shape and safe token-reader requirements, without token values.
- Proposed `snake_case` action keys. Use lowercase letters, numbers, and
  underscores only, for example `find_project_id` or `update_invoice_status`.
- Proposed action schema fields and enum values.
- Proposed resolver actions and primary actions when object lookup is reusable.
- Proposed modality.
- Task Agent need, if any: proposed Function API name / `taskKey`, whether it already exists or must be created in the Foldspace web app, input data, output shape, and why deterministic code is not enough.
- Reuse opportunities in existing `agent/api/`, shared components, styles, or utils.
- Open questions to resolve before implementation.

## Output

Return one action flow record with:

- Action key suggestion in `snake_case`.
- Agreed action goal and flow.
- Modality: text-only, chatterblock, shared state, navigation, or Task Agent-assisted action.
- Required evidence already captured.
- Missing evidence or credentials.
- Suggested next skill: `foldspace-create-extension`, `foldspace-build-action`, or `foldspace-add-navigation`.

Use `action-flow-reference.md` when choosing the Foldspace capability and shaping the implementation handoff.
Recommended next-step routing: After evidence is captured, recommend `foldspace-build-action` with the action key, API sequence, auth source, schema, and route needs.


## Next Steps And Summary

Always end by recommending exactly one next skill and the concrete inputs to pass to it.

End every response with:

```text
Summary:
- Completed: <one action flow aligned and observed>
- Concepts: <Foldspace terms introduced, e.g. DevTools evidence, modality, Task Agent, evidence-before-code>
- Evidence: <URLs, API endpoints, request sequence, route evidence, or missing evidence>
- Decisions: <agreed goal, modality, Task Agent need, safety notes, reuse opportunities>
- Next step: <usually foldspace-build-action with an implementation-plan handoff, foldspace-add-navigation, or devtools-reader with exact inputs>
- Blockers: <missing credentials, schemas, API evidence, or approvals; use "None" if clear>
```
