# Foldspace: Browser Extension

Use this plugin when you cannot edit the target website's source code. It helps
Cursor or Claude Code create a Chrome extension that injects Foldspace, learn
workflows from the live site, build remote actions against the site's existing
APIs, add navigation, and verify the extension before sharing.

## Setup

### Cursor

1. Install or link this plugin in Cursor.
2. Create a `.env.foldspace` file at the root of the project you have open in
   Cursor (this is what `${workspaceFolder}` in `mcp.json`'s `envFile` resolves
   to — not the plugin folder), containing
   `FOLDSPACE_API_KEY=xxxxxxxx`. Alternatively, export
   `FOLDSPACE_API_KEY` in your shell to set it once for every project.
3. Restart or reload Cursor so the Foldspace and Chrome DevTools MCP servers are discovered.

## Use This When

- You have a client URL and login, but not their repo.
- You need to discover actions from browser workflows, Network requests, cookies, localStorage, and DOM selectors.
- You need an extension that injects the Foldspace SDK and remote actions into the client's site.
- You need navigation labels and route handlers added through Foldspace MCP/Agent Studio.

## Recommended Workflow

Before recommending next steps, use the routing rules and focused support files
inside the active skill folder.

### Customer Extension Path

Start with `foldspace-get-started` if you are unsure which remote extension step is
next. This plugin assumes you do not have the target product source code. New to
the terminology? Each skill explains the Foldspace terms it uses as it works, and
`foldspace-get-started` includes a short glossary of the key terms.

1. `foldspace-create-extension`: create the Chrome MV3 extension and remote action bundle layout.
2. Pick one action with the user and run `foldspace-observe-flow-in-site`: align on the action goal and user flow before any browser observation.
3. Use `devtools-reader`: the user performs the agreed flow while the agent watches DevTools and records exact API endpoints.
4. Run `foldspace-build-action`: write an implementation plan for that one action, then wait for user approval before editing code. In Cursor, use Plan Mode when available; in Claude Code, present the plan and wait for explicit approval.
5. Repeat steps 2-4 for each additional action.
6. Run `foldspace-add-navigation` when an action needs navigation labels, route transitions, or cross-page continuation.
7. Run `foldspace-verify-actions` to confirm enabled MCP actions match extension handlers, schemas, safe returns, and distinct action purposes.

Use the `devtools-reader` agent when a workflow needs API reverse engineering. Use the `navigation-mapper` agent when a workflow needs route labels, route transitions, or cross-page state.

## Components

- `.cursor-plugin/plugin.json`: plugin metadata and component registration.
- `mcp.json`: Foldspace MCP server config for Cursor.
- `.claude-plugin/plugin.json`: Claude Code plugin metadata and component paths. The API key comes from `${FOLDSPACE_API_KEY}` via `.mcp.json`.
- `.mcp.json`: Foldspace MCP server config for Claude Code.
- `skills/`: guided workflows for live-site discovery, extension scaffolding, extension actions, navigation, and action verification.
- `agents/`: specialized subagents for DevTools/network reading and navigation mapping.
- `rules/`: safety rules for extensions and DevTools evidence in Cursor. Claude Code receives these guardrails through the relevant skills and agents.
- `skills/foldspace-create-extension/extension-app-template/`: portable extension
  app scaffold that workers should copy when creating a new client extension.

## Default Extension Architecture


```text
client-extension/
├── extension/
│   ├── manifest.json
│   ├── contentScript.js
│   ├── background.js
│   ├── index.js
│   └── csp_rules.json
├── agent/
│   ├── actions/
│   │   ├── index.ts
│   │   └── <action-name>/
│   ├── api/
│   ├── constants.ts
│   └── utils.ts
├── scripts/
│   ├── build.ts
│   ├── buildExtension.mjs
│   └── packageExtension.mjs
└── package.json
```

The extension injects the Foldspace SDK and a remote action bundle into the target website. The action bundle reads browser auth state only when authorized for the sandbox account, calls the customer's observed APIs, and returns minimal LLM-safe payloads.

## Validation

Before using this plugin in Cursor, set `FOLDSPACE_API_KEY` in a `.env.foldspace` file at your open project's root (where `${workspaceFolder}` points), or export it in your shell. Before using it in Claude Code, load it with `claude --plugin-dir ./plugins/remote-plugin` and set `FOLDSPACE_API_KEY` in the Claude Code settings `env` block (or export it). The bundled `chrome-devtools` config runs in isolated browser mode. Use each skill's local support files when the skill includes them. When actions are built, verify enabled MCP actions, handler keys, schemas, safe returns, navigation dependencies, Shared State cleanup, and overlapping action purposes with `foldspace-verify-actions`.

## Interaction Contract

Work one action at a time. Before browser observation, confirm the action goal and flow with the user. Before code edits, write an implementation plan and wait for user approval. Use Cursor Plan Mode when available; in Claude Code, present the plan and wait for explicit approval. Every skill and agent interaction should end with a short `Summary` block covering what was completed, what evidence was used, what decisions were made, the recommended next skill/action with concrete inputs, and any blockers.
