# Foldspace: Add to Your App

Use this plugin when you can edit your website's frontend code. It helps Cursor
or Claude Code add the Foldspace agent to your app, connect logged-in users,
discover useful agent actions, implement those actions, and verify the wiring
before you go live.

## What It Adds

This plugin connects the assistant to Foldspace through MCP:

```bash
npx -y @foldspace_npm/foldspace-mcp@latest
```

The MCP server reads the API key from the `FOLDSPACE_API_KEY` environment variable
(Cursor via `mcp.json` `envFile`, Claude Code via `.mcp.json` `env`).

The MCP server exposes Foldspace Copilot agents, actions, action versions, and
navigation routes to the host assistant. The plugin also includes skills that
guide clients from product discovery through action specification,
implementation, and review. It also includes a Foldspace-specific product scout
subagent for frontend opportunity discovery.

## Setup

### Cursor

1. Install or link this plugin in Cursor.
2. Create a `.env.foldspace` file at the root of the project you have open in
   Cursor (this is what `${workspaceFolder}` in `mcp.json`'s `envFile` resolves
   to — not the plugin folder), containing
   `FOLDSPACE_API_KEY=xxxxxxxx`. Alternatively, export
   `FOLDSPACE_API_KEY` in your shell to set it once for every project.
3. Restart or reload Cursor so the MCP server is discovered.

You usually do not need to invoke skills by name. Just describe what you want in
chat (for example "add an AI agent to my app" or "what should my agent be able to
do?") and the right skill is picked automatically from its description.

## Which Workflow Should I Use?

You can just describe your goal in chat and the right skill is selected
automatically. If you are new to Foldspace, the natural entry point is
`foldspace-get-started`. It asks what is already complete and routes you to one
next skill. New to the terminology? Each skill explains the Foldspace terms it
uses as it works and recaps how you could do it yourself, so you learn the
concepts while building. `foldspace-get-started` also includes a short glossary
of the key terms.

Typical path:

```text
foldspace-get-started
  -> foldspace-setup-agent
  -> foldspace-discover-actions
  -> foldspace-plan-action
  -> foldspace-build-action
  -> foldspace-verify-actions
```

Use `foldspace-setup-agent` to add the agent to your site and connect logged-in users. It covers both adding the SDK snippet (snippet, Agent API Name, `foldspace('when', 'ready', ...)`, visibility) and wiring `foldspace.identify(context)` with stable user and subscription IDs.

Use `foldspace-discover-actions` when you do not know which actions to build yet. It scans the frontend and recommends high-value action, Chatterblock, and Shared State opportunities.

Use `foldspace-plan-action` when you have a chosen action idea and need an action ID, description, parameter schema, modality, return shape, and implementation notes before coding. It may recommend a resolver action plus a primary action when that keeps lookup reusable.

Use `foldspace-build-action` when the action already exists in Foldspace or the schema is approved. It fetches action metadata when MCP is connected, scans the frontend, proposes Text-Only vs Chatterblock behavior, implements the handler, and reviews error handling.

Use `foldspace-verify-actions` when code exists and you want to verify that every enabled Foldspace action from MCP has a matching frontend handler, schema-aligned params, safe returns, and no confusing overlap with nearby actions.

## Components

- `.cursor-plugin/plugin.json` defines the plugin metadata.
- `mcp.json` defines the Foldspace stdio MCP server for Cursor.
- `.claude-plugin/plugin.json` defines the Claude Code plugin metadata and
  component paths. The API key comes from `${FOLDSPACE_API_KEY}` via `.mcp.json`.
- `.mcp.json` defines the Foldspace stdio MCP server for Claude Code.
- `skills/foldspace-get-started/SKILL.md` routes new users to the right next
  step, includes a short glossary of key Foldspace terms, and flags when the
  browser-extension plugin is the better fit.
- `skills/foldspace-setup-agent/SKILL.md` adds the agent to the site (SDK
  snippet, agent initialization, visibility) and connects logged-in users via
  `foldspace.identify(context)`.
- `skills/foldspace-discover-actions/SKILL.md` scans a frontend and recommends
  useful Foldspace action opportunities.
- `skills/foldspace-plan-action/SKILL.md` turns a chosen action idea into a
  Foldspace-ready plan, including resolver + primary action splits when useful.
- `skills/foldspace-build-action/SKILL.md` plans and implements Foldspace action
  handlers.
- `action-design.md` is a shared reference (a self-contained copy lives in
  `foldspace-discover-actions`, `foldspace-plan-action`, and
  `foldspace-build-action`) mapping actions to outcomes, lifecycle fit,
  modality, metrics, KPIs, exit criteria, and implementation guardrails.
- `skills/foldspace-build-action/*.md` also contains focused references for
  modalities, safe error handling, and Shared State.
- `skills/foldspace-verify-actions/SKILL.md` verifies enabled MCP actions
  against frontend handlers, schema params, safe returns, and overlapping action
  definitions.
- `skills/foldspace-verify-actions/action-checklist.md` provides the focused
  action verification checklist used by the verify skill.
- `agents/foldspace-product-scout.md` scans frontend codebases for Foldspace
  action, Chatterblock, Shared State, and navigation opportunities.
- `rules/foldspace-action-safety.mdc` keeps action handlers schema-aligned and
  safe for LLM-facing returns in Cursor. Claude Code receives these guardrails
  through the relevant skills.
- `rules/foldspace-frontend-reuse.mdc` encourages reusing existing frontend
  components and patterns for Chatterblocks, Shared State, and SDK UI in
  Cursor. Claude Code receives this guidance through the relevant skills.

## Example Prompts

- "Add a Foldspace AI agent to my app."
- "Set up Foldspace and connect my logged-in users."
- "Help me make this frontend more agentic — what should the agent be able to do?"
- "Turn my teammate-invite idea into a Foldspace action."
- "Fetch my Foldspace actions and build the `invite_user` action."
- "Audit my Foldspace setup and tell me if I'm ready to go live."
- "Make my agent's answers shorter and friendlier."

You can use plain-language prompts like these. The right skill is selected
automatically from its description; you do not have to name skills explicitly.

## License

MIT
