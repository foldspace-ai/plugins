---
name: foldspace-get-started
description: Help someone figure out the next step for adding a Foldspace agent via a browser extension when they cannot edit the website code. Use when the user asks where to start, is new to extension-based setup, does not have the target site's source code, or wants a guided path for a no-code integration.
disable-model-invocation: false
---

# Start Here

Use this skill as the entry point when someone wants to add a Foldspace agent to
a website they **cannot edit**, by building a browser extension. Your job is to
orient them and point to exactly one next step, not to do the work here.

## What This Plugin Does (in one breath)

When you do not have the website's source code, you can still add a Foldspace AI
agent by shipping a **Chrome extension** that injects it into the live site. You
create the extension, learn one workflow at a time by watching the real site,
build that action against the site's own APIs, add navigation where needed, and
validate before sharing.

## The Path In This Plugin

`foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` (when needed) -> `foldspace-verify-actions`.

If the user skipped a step, route them to the earliest incomplete one.

## Wrong Plugin?

This plugin is for websites where the user **cannot edit the code** and must use
a browser extension. If any of these are true, they likely need the other
Foldspace marketplace listing instead:

- They have the frontend repo open and want to edit the app directly.
- They want to install the Foldspace SDK snippet in their own codebase.

If so, respond with:

```markdown
### Wrong plugin?
It sounds like you need **Foldspace: Add to Your App** from the Cursor marketplace, not this plugin.
This plugin is for adding Foldspace to a website you cannot edit, by building a browser extension.
Install that listing instead, then run its **Start here** skill.
```

Do not try to run in-app SDK setup steps from this plugin.

## Quick Glossary

Keep these key terms in mind; explain any of them in plain language if the user
is unsure:

- **Browser extension** — a Chrome extension that injects the Foldspace agent into a site you don't control.
- **Agent Studio** — the Foldspace web app (https://app.foldspace.ai) where you configure the agent and get `PRODUCT_ID` / `AGENT_API_NAME`.
- **Action** — one thing the agent can do on the site; here it calls the site's own APIs from the extension.
- **DevTools evidence** — the network calls and auth you capture by watching the real user flow in the browser, used to build an action accurately.
- **Navigation label** — a stable name (like `settings_billing`) that lets the agent open the right page.
- **Task Agent** — a one-time LLM call inside a handler for extraction/summarization when deterministic code is not enough.
- **Public API key** — a Foldspace key that lets MCP list agents/actions and create or update action metadata for the extension.

## Foldspace MCP Setup

Before creating or updating actions through MCP, make sure the user has a
Foldspace Public API key available to this project:

1. Ask the user to open [Foldspace Public API](https://app.foldspace.ai/settings/public-api)
   and create a Public API key.
2. Ask them to create `.env.foldspace` at the root of the project open in Cursor
   with:

```text
FOLDSPACE_API_KEY=xxxxxxxx
```

3. Explain that `${workspaceFolder}/.env.foldspace` is the file used by this
   plugin's `mcp.json`, so it must be in the user's open project.
4. Ask the user to reload/restart Cursor if MCP tools do not see the key.

Missing MCP setup blocks creating or updating Foldspace actions from the agent,
but it does not block scaffolding the browser extension itself. If they don't want to use the MCP they can
do everything through agent studio in the foldspace website.

## Explain As You Orient

As you route the user, make sure they come away understanding, in plain language:

- What this plugin does: ship a browser extension that adds the agent to a site they can't edit.
- The ordered milestones (create → learn → build → navigate → validate).
- Which single step they should do next, and why.

Tell the user that each skill explains the Foldspace terms it uses as it works,
and that the remote flow deliberately pauses for their approval between learning
a flow and writing code.

## Prerequisite Gate

Do not scaffold, research, implement, or configure navigation in this skill. Keep
routing within this plugin because selecting it already means the user is building
a no-source-access extension.

## Workflow

1. Briefly explain you will help find their starting point, not do the work yet.
2. Ask what is already complete:
   - No extension exists yet.
   - `.env.foldspace` is configured for Foldspace MCP, if action creation or updates are needed.
   - The extension is created (scaffolded).
   - One action candidate is selected.
   - DevTools evidence has been collected for that action.
   - The remote action implementation plan is approved.
   - One or more remote action handlers are implemented.
   - Navigation labels or route continuation are needed.
   - The extension is ready for final validation.
3. Route to the earliest incomplete step:
   - No extension: `foldspace-create-extension`.
   - Extension exists but action flow is unknown: `foldspace-observe-flow-in-site`.
   - API evidence and schema are known: `foldspace-build-action`.
   - Route labels or continuation are needed: `foldspace-add-navigation`.
   - Extension actions are ready to verify: `foldspace-verify-actions`.
4. Recommend exactly one next skill with the concrete command to run.
5. Keep the response short. The goal is to orient, not perform the next step.

## Output Format

```markdown
## Foldspace Remote Starting Point

### Assumption
You selected the browser-extension plugin, so this path assumes no target product source-code access.

### What I Need From You
- <target URL, current extension state, action candidate, DevTools evidence, schema, or approval status>
- <whether `.env.foldspace` exists with `FOLDSPACE_API_KEY` when MCP action creation/update is needed>

### Next Skill
Run `<namespaced foldspace remote skill command>` because <one-sentence reason>.

### Full Path
- <short ordered list of remaining remote skills>
```

## Next Steps And Summary

Always end with:

```markdown
Summary:
- Completed: identified the remote extension starting point.
- Concepts: <any Foldspace terms you introduced, e.g. browser extension, action, DevTools evidence>
- If you did this yourself: pick the earliest milestone you have not finished (create → learn → build → navigate → validate).
- Next step: <exact `/foldspace-*` skill command and concrete input>
- Blockers: <missing target URL, API key, product ID, Agent API Name, DevTools evidence, approval, or None>
```
