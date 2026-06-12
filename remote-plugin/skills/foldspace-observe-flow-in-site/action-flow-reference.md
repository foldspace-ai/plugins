# Action Flow Reference

Use this reference when turning one live website workflow into implementation-ready Foldspace action evidence.

## Resolver-First Principle

Even if the user wants one main action, the correct design may require supporting
resolver actions. For most product objects referenced internally by stable IDs,
default to this pattern:

1. Search or resolve the object from a user-provided name, label, email, number,
   slug, or other natural key.
2. Return the stable object ID plus lightweight match metadata.
3. Use that stable ID in the primary action.
4. Optionally fetch related records or perform the primary operation after the ID
   is known.

When a lookup step is reusable, propose it as a separate Foldspace action rather
than collapsing it into the main action. Examples:

- `find_account_id` -> `get_account_overview(accountId)`
- `find_project_id` -> `get_project_summary(projectId)`
- `find_ticket_id` -> `update_ticket_status(ticketId, status)`
- `find_invoice_id` -> `send_invoice_reminder(invoiceId)`

Use current-page identity only when the user explicitly asks for a page-context
action. Otherwise, prefer resolving the object from the user's natural-language
reference so the action works from any page.

## Evidence To Capture

For exactly one action, capture:

- Agreed action goal and out-of-scope assumptions.
- Step-by-step user flow.
- User-visible outcome and why it matters.
- Page URLs, route patterns, and route IDs.
- API method, URL pattern, query params, payload shape, response shape, and status codes.
- Auth/session source by key name only.
- Auth storage shape without secret values: raw string, JSON-encoded string, or
  object with safe field names such as `access_token`, `token`, or `value`.
- Evidence that auth worked, preferably a real `200` response from the API that
  the handler will call.
- Tenant/workspace/account context.
- DOM selectors only when API calls are not enough.
- Confirmation needs for mutating actions.
- Data safe to return to the LLM.
- Reusable lookup/resolver opportunities and whether they should be separate actions.

## Capability Choice

Choose the simplest capability that completes the user outcome:

- Text-only action: read flows or simple API-backed mutations.
- Chatterblock: review, selection, upload, or confirmation UI.
- Shared State: page/form context the agent needs to understand or update.
- Navigation: route changes, object deep links, or cross-page continuation.
- Task Agent: one-time extraction, summarization, classification, normalization, enrichment, or generation that deterministic code should not own.

## Handoff Shape

End with an implementation handoff for `foldspace-build-action`:

- Action key suggestion in `snake_case` using lowercase letters, numbers, and
  underscores only.
- Agreed goal and user flow.
- Resolver action suggestions when the flow needs reusable object lookup.
- API endpoints in request order.
- Auth/session source by key name only.
- Auth storage shape and token-reader requirements, without token values.
- Proposed schema fields and enum values.
- Proposed modality.
- Task Agent need, if any.
- Reuse opportunities in `agent/api/`, constants, utils, styles, or views.
- Route/navigation needs.
- Missing evidence or blockers.
