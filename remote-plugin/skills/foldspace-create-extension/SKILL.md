---
name: foldspace-create-extension
description: Create a Chrome extension project that adds Foldspace to a live website. Use when the user needs a browser extension, wants to inject Foldspace without source access, or is starting a no-codebase client integration from a URL.
---

# Create the Extension
## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: step 1 — create the extension.

Prerequisites: Client or extension name, target host patterns, API host patterns,
and the Agent Studio SDK install snippet.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Prerequisite Gate

If an extension is already created, skip this skill and route to `foldspace-observe-flow-in-site` for the first incomplete action flow.

Create the browser extension and extension-loaded action bundle for a live-site Foldspace extension-based integration.

## Explain As You Work

As you scaffold, explain these to the user in plain language so they understand
what the extension is and could maintain it themselves:

- **Why an extension exists**: it injects the Foldspace agent into a site you cannot edit, unlike the in-app SDK path.
- **What gets injected**: the SDK bootstrap and an action bundle, scoped to the target site's domains.
- **Local fallback vs production loading**: local development may use the extension background fallback to inject a `localhost` action bundle, while production should use hosted remote actions.
- **SDK install snippet**: the Agent Studio code block that contains the SDK URL, product key, and agent API name.
- **`SDK_URL` / `PRODUCT_KEY` / `PRODUCT_ID` / `AGENT_API_NAME`**: values parsed from the SDK snippet that tie the extension to the right agent.

## Required Inputs

- Client or extension name in kebab-case.
- Target website host patterns.
- API host patterns observed in DevTools.
- Agent Studio SDK install snippet from the agent setup page.
- Whether actions load locally during development or from hosted remote actions.
- Whether the extension needs page awareness, Shared State, Messaging API prompts, Event API logging, or Task Agent calls.

## Agent Studio Snippet Link And Parsing

Ask for the full Agent Studio SDK install snippet up front. Do not ask the user
to manually derive `SDK_URL`, `PRODUCT_KEY`, `PRODUCT_ID`, or `AGENT_API_NAME`
when the snippet is available.

Give the user a clickable place to get the snippet:

- General starting point: https://app.foldspace.ai
- If Foldspace MCP is available, call `foldspace_overview`, then `list_agents` to
  find the target agent ID. Once you have the agent ID, give the user the exact
  setup link:

```text
https://app.foldspace.ai/agent/{agentId}/setup/agent-settings
```

Do not hardcode or guess a specific agent ID in the skill. Only provide the exact
agent setup link after MCP or the user has supplied the real agent ID.

Parse these values from the snippet:

- SDK URL: the template defaults to the current public Foldspace SDK URL. If the
  Agent Studio snippet gives a different SDK URL, copy that URL into `SDK_URL`.
- SDK script domain: the template already allows the default public Foldspace
  SDK host in `extension/csp_rules.json`. If Agent Studio gives a different SDK
  URL, update the CSP host to that URL's hostname only.
- Product key format: `EU-EXAMPLEPRODUCT-1-1` -> `PRODUCT_KEY=EU-EXAMPLEPRODUCT-1-1` and `PRODUCT_ID=EXAMPLEPRODUCT`.
- Agent API name format: `foldspace.agent('example-agent')` or
  `foldspace.agent({ apiName: 'example-agent' })` -> `AGENT_API_NAME=example-agent`.

If the snippet is missing the agent initialization call, ask for the Agent API
Name from Agent Studio. Never invent product IDs or agent API names.

## Default Structure

Use `extension-layout-template.md` as the default output structure. Start by copying the skill-local `extension-app-template/` folder into the new client-specific extension folder, then customize the copied files.

Default source template path, relative to this skill folder:

```text
extension-app-template/
```

After copying the template, keep these extension runtime files identical to the template unless the shared runtime behavior needs to change:

- `extension/contentScript.js`
- `extension/background.js`
- `extension/index.js`

Customize `extension/manifest.json`, `extension/csp_rules.json`, `extension/index.js`, `agent/constants.ts`, `agent/actions/`, and action-specific API/UI files for the client. Match the generated template pattern:

- `extension/manifest.json`: MV3 manifest with scoped host permissions.
- `extension/contentScript.js`: inject SDK/action bootstrap and handle CSP fallback.
- `extension/background.js`: load remote bundle in the page main world if needed.
- `extension/index.js`: Foldspace SDK bootstrap, SDK URL, product key, `foldspace('when','ready')`, `foldspace.agent(AGENT_API_NAME).show()`, optional page awareness settings, and dev/prod action environment toggle.
- `agent/actions/index.ts`: handler registry whose keys match MCP action schemas.
- `agent/constants.ts`: hosts, product IDs, storage keys, action bundle URLs.
- `agent/utils.ts`: auth extraction, navigation handler, Shared State helpers, event listeners, messaging helpers, and safe fetch helpers.
- `scripts/`: build and package helpers.

## Guardrails

- Scope `matches`, `host_permissions`, and CSP rules to sandbox/client domains.
- Never embed real credentials or secret tokens.
- Add duplicate-injection guards for SDK and remote actions.
- Keep local development bundle loading explicit and easy to turn off.
- Preserve the remote-action-server architecture. Do not permanently bundle
  customer action code into the extension just to work around local `localhost`
  loading unless the user explicitly chooses that architecture.
- Put auth extraction in one utility file with secret values redacted from logs.
- Add hooks for `agent.ready`, `conversation.created`, and `action.callback` during development so extension builders can debug agent behavior.
- Document required Foldspace service domains from `extension-scaffold-reference.md` for corporate allow-listing.

## Output

Create the scaffold or provide exact files to create. Include:

- File tree.
- Values still needed from Agent Studio or DevTools.
- Extension install/test steps.
- Next action to run: usually `foldspace-observe-flow-in-site`.

Read `extension-scaffold-reference.md` before scaffolding.
Recommended next-step routing: After creating the extension, recommend `foldspace-observe-flow-in-site` for one action candidate.

## How To Test

Every scaffolded extension response must include these local test steps:

```sh
npm run dev
```

Then:

1. Open `chrome://extensions`.
2. Reload the unpacked extension.
3. Refresh the target SaaS page.
4. Confirm the Foldspace agent appears.
5. Ask the agent a realistic prompt for the target product.
6. Confirm the expected action callbacks reach `executed` and `finished`.
7. Inspect the console for SDK registration, handler, or API errors.

## Next Steps And Summary

After scaffolding, tell the user which files were created or should be customized. Recommend exactly one next step: usually `foldspace-observe-flow-in-site` for one action candidate.

End every response with:

```text
Summary:
- Completed: <template copied, extension configured, or scaffold files produced>
- Concepts: <Foldspace terms introduced, e.g. browser extension, injected SDK, PRODUCT_ID/AGENT_API_NAME>
- Evidence: <target matches, API hosts, SDK snippet values, product ID, Agent API Name, and template path used>
- Decisions: <local/prod loading, page awareness, Shared State, events, or Task Agent choices>
- Next step: <usually foldspace-observe-flow-in-site or foldspace-build-action with exact action keys/routes>
- Blockers: <missing Agent Studio SDK snippet, host patterns, API hosts, or credentials; use "None" if clear>
```
