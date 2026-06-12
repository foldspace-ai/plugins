---
name: foldspace-get-started
description: Help someone new to Foldspace figure out the next step for adding an agent to their app. Use when the user asks where to start, says they are new to Foldspace, wants to integrate an AI agent, is unsure what to do first, or wants a guided path.
disable-model-invocation: false
---

# Start Here

Use this skill as the entry point when someone wants to add a Foldspace agent to
an app they can edit and is not sure what to do next. Your job is to orient
them and point to exactly one next step, not to do the work here.

## What Foldspace Is (in one breath)

Foldspace adds an AI agent (a "Copilot") to your product. The agent can chat
with users and, more importantly, take real **actions** in your app. Getting
there has a few milestones: get the agent on the page, tell it who is logged in,
decide what it should be able to do, build those actions, and check it before
going live.

## The Path In This Plugin

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

If the user skipped a step, route them to the earliest incomplete one.

## Wrong Plugin?

This plugin is for websites where the user **can edit the code**. If any of these
are true, they likely need the other Foldspace marketplace listing instead:

- They do not have access to the frontend source code.
- They are trying to build a Chrome extension.
- They only have a live URL or sandbox login, no repo.

If so, respond with:

```markdown
### Wrong plugin?
It sounds like you need **Foldspace: Browser Extension** from the Cursor marketplace, not this plugin.
This plugin is for adding Foldspace to a website whose code you can edit.
Install that listing instead, then run its **Start here** skill.
```

Do not try to run extension-building steps from this plugin.

## Explain As You Orient

As you route the user, make sure they come away understanding, in plain language:

- What Foldspace is: an agent plus actions inside their own product.
- The ordered milestones for adding it to an app they can edit.
- Which single step they should do next, and why.

Tell the user that each skill in this plugin explains the Foldspace terms it uses
as it works, so they pick up the concepts while building rather than up front.

## Quick Glossary

Keep these key terms in mind; explain any of them in plain language if the user
is unsure:

- **Agent (Copilot)** — the AI assistant that appears in the product and talks to users.
- **Agent Studio** — the Foldspace web app (https://app.foldspace.ai) where you configure the agent and copy its setup snippet.
- **SDK snippet** — a small script you paste into the site to load Foldspace onto the page.
- **Agent API Name** — the ID that connects the code to the right agent in Agent Studio.
- **User context (`foldspace.identify`)** — telling Foldspace who is signed in (`user.id` + `subscription.id`) so the agent can personalize.
- **Action** — one thing the agent can do (for example "invite a teammate"); its **handler** is the code that runs, and its return value goes straight back to the agent.
- **Modality** — how an action behaves: **Text-Only** (background), **Chatterblock** (asks the user in chat), or **Shared State / Tandem Mode** (reads/updates the live page or form).
- **Public API key** — a Foldspace key that lets MCP list agents/actions and create or update action metadata.

## Foldspace MCP Setup

MCP setup is needed when the agent should list existing Foldspace agents/actions
or create/update action metadata. Ask the user to:

1. Open [Foldspace Public API](https://app.foldspace.ai/settings/public-api) and
   create a Public API key.
2. Create `.env.foldspace` at the root of the project open in Cursor with:

```text
FOLDSPACE_API_KEY=xxxxxxxx
```

3. Reload/restart Cursor if MCP tools do not see the key.

Missing MCP setup does not block installing the SDK snippet, but it blocks
MCP-backed action discovery, creation, and updates.

## Workflow

1. Briefly explain, in one or two sentences, that you will help find their
   starting point, not do the work yet.
2. Ask what is already complete:
   - Nothing is installed.
   - `.env.foldspace` is configured for Foldspace MCP, if action discovery or creation is needed.
   - The agent is on the page (SDK installed).
   - Logged-in users are connected (user context set up).
   - Actions already exist in Foldspace.
   - Action specs are approved.
   - Action handlers are already implemented.
   - They are preparing for launch review.
3. Use the path above as the source of truth.
4. Recommend exactly one next skill with the concrete command to run.
5. Keep the response short. The goal is to orient, not to perform the next step.

## Output Format

```markdown
## Foldspace Starting Point

### What I Need From You
- <current setup state, agent snippet, Agent API Name, action ideas, approval status, or launch state>

### Next Skill
Run `<namespaced foldspace skill command>` because <one-sentence reason>.

### Full Path
- <short ordered list of remaining skills>
```

## Next Steps And Summary

Always end with:

```markdown
Summary:
- Completed: identified the user's starting point and path.
- Concepts: <any Foldspace terms you introduced, e.g. agent, action>
- If you did this yourself: skim the Foldspace setup docs and pick the first milestone you have not finished.
- Next step: <exact `/foldspace-*` skill command and concrete input>
- Blockers: <missing agent snippet, Agent API Name, action idea, approval, or None>
```
