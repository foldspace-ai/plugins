---
name: foldspace-add-navigation
description: Teach the agent how to open pages and continue after the user navigates on the target website. Use when the agent needs to send users to a page, handle route changes, or label destinations like Settings or Billing.
---

# Add Page Navigation
## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: step 4 — add routes and continuation behavior.

Prerequisites: Known destination pages, route patterns, and action needs from learning the site.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Prerequisite Gate

If the pages or route behavior are unknown, use `navigation-mapper` or return to `foldspace-observe-flow-in-site` first.

Use this skill when the agent must navigate the client's website during an extension.

## Explain As You Work

As you map routes, explain these to the user in plain language so they
understand navigation and could add labels themselves:

- **Navigation label**: a stable, user-facing name (like `settings_billing`) that maps "go to billing" to a real URL or route.
- **Why stable labels matter**: labels tied to fragile one-off IDs or account-specific menu text break as the site changes.
- **Continuation**: how the agent preserves intent across a page change so it can keep going after navigating.

## Workflow

1. Launch `navigation-mapper` with the authenticated starting URL and relevant extension flows.
2. Convert discovered routes into stable labels and descriptions.
3. Decide whether each navigation is SPA `pushState`, full redirect, cross-origin redirect, or DOM-assisted search.
4. Add or update navigation labels through Foldspace MCP/Agent Studio when available.
5. Document whether any route needs cross-page continuation context so the automatically provided navigation runtime can preserve intent across route changes.
6. Verify labels open the expected pages in the browser.

## Navigation Label Quality

Good labels are user-facing and stable:

- `projects`: Opens the projects list.
- `project_detail`: Opens a specific project by project ID.
- `settings_office_profile`: Opens office profile settings.

Avoid labels tied to fragile one-off URL IDs or visible menu text that changes by account.

## Output

Return:

- Navigation label table.
- MCP updates made or needed.
- Continuation or route-context notes.
- Browser verification steps.
- Open questions for routes that require permissions or unknown IDs.

See `navigation-reference.md` for focused Navigation and Messaging API details.
Recommended next-step routing: After navigation is added, recommend `foldspace-verify-actions` or the next `foldspace-build-action` pass.


## Next Steps And Summary

After mapping routes, explain which labels were added or still need MCP/Agent Studio work. Recommend exactly one next step: usually `foldspace-verify-actions` when navigation is ready, or `foldspace-build-action` when an action depends on the mapped routes.

End every response with:

```text
Summary:
- Completed: <routes mapped, labels proposed/created, and browser verification performed>
- Concepts: <Foldspace terms introduced, e.g. navigation label, continuation>
- Evidence: <route patterns, navigation type, continuation state, selectors>
- Decisions: <label names, route types, continuation context, verification scope>
- Next step: <usually foldspace-build-action or foldspace-verify-actions with exact routes/actions>
- Blockers: <missing permissions, object IDs, MCP access, or route evidence; use "None" if clear>
```
