# Foldspace Plugins

Foldspace helps you add an AI agent to a product so users can ask questions and
get real work done inside the app. This repository contains two public plugin
paths for Cursor and Claude Code, depending on whether you can edit the target
website's source code.

## Choose A Plugin

### Foldspace: Add to Your App

Use `codebase-plugin/` when you can edit the website's frontend code.

This plugin helps you:

- Add the Foldspace agent to your app.
- Connect logged-in users with stable account and session context.
- Discover useful product actions for the agent.
- Plan and implement Foldspace action handlers.
- Verify that enabled actions match local frontend handlers.

Start with:

```text
/foldspace-codebase-plugin:foldspace-get-started
```

### Foldspace: Browser Extension

Use `remote-plugin/` when you cannot edit the website's source code and need to
build a browser extension integration instead.

This plugin helps you:

- Create a Chrome extension that injects Foldspace into the target site.
- Learn workflows from the live site with browser and network evidence.
- Build remote actions one workflow at a time.
- Add navigation labels and route handling when actions cross pages.
- Verify extension action wiring before sharing.

Start with:

```text
/foldspace-remote-plugin:foldspace-get-started
```

## Install From The Public Marketplace

This repository is a public plugin marketplace for Cursor and Claude Code.
Install the plugin that matches how you plan to add Foldspace to your product.

### Claude Code

Add the Foldspace marketplace once:

```bash
claude plugin marketplace add foldspace-ai/plugins
```

Then install the plugin that matches your project:

```bash
claude plugin install foldspace-codebase-plugin@foldspace-plugins
claude plugin install foldspace-remote-plugin@foldspace-plugins
```

The installed plugin starts its MCP servers from `.mcp.json`. Foldspace MCP
uses HTTP OAuth against `https://api.foldspace.ai/mcp`. When Claude prompts you
to authenticate, complete the browser login with your Foldspace account.

Inside Claude Code, run `/plugin`, `/mcp`, and `/agents` to confirm the plugin,
MCP server, and plugin agents loaded.

### Cursor

The same public repository includes `.cursor-plugin/marketplace.json` and each
plugin's `.cursor-plugin/plugin.json` for Cursor distribution. Install the
plugin through Cursor's plugin flow. Each plugin's `mcp.json` connects to the
remote Foldspace MCP server:

```json
{
  "mcpServers": {
    "foldspace": {
      "type": "http",
      "url": "https://api.foldspace.ai/mcp"
    },
    "foldspace-docs": {
      "type": "http",
      "url": "https://docs.foldspace.ai/mcp"
    }
  }
}
```

When Cursor prompts you to authenticate, complete the browser OAuth login with
your Foldspace account. Each plugin also starts `foldspace-docs` for searching
and fetching developer documentation. The browser-extension plugin also starts
Chrome DevTools MCP in isolated browser mode for live-site workflow discovery.

## Verify Installation

Each plugin includes its own setup guide:

- `codebase-plugin/README.md`
- `remote-plugin/README.md`

In Claude Code, run:

```text
/plugin
/mcp
/agents
```

In Cursor, check the MCP settings panel after installing the plugin and
completing OAuth if prompted.

If the Foldspace MCP server is not connected, re-authenticate in MCP settings
or reload/restart Cursor or Claude Code.

## Typical Workflows

If you can edit the app:

```text
foldspace-get-started
  -> foldspace-setup-agent
  -> foldspace-discover-actions
  -> foldspace-plan-action
  -> foldspace-build-action
  -> foldspace-verify-actions
```

If you need a browser extension:

```text
foldspace-get-started
  -> foldspace-create-extension
  -> foldspace-observe-flow-in-site
  -> foldspace-build-action
  -> foldspace-add-navigation
  -> foldspace-verify-actions
```

You usually do not need to invoke skills by name. Describe what you want in
plain language, such as "add Foldspace to my app" or "build a Foldspace browser
extension for this site", and the assistant will route you to the right step.

## What Is Included

Each public plugin is self-contained:

- `.cursor-plugin/plugin.json`: Cursor plugin metadata.
- `.claude-plugin/plugin.json`: Claude Code plugin metadata.
- `mcp.json`: Cursor MCP server configuration.
- `.mcp.json`: Claude Code MCP server configuration.
- `skills/`: guided Foldspace workflows.
- `agents/`: specialized subagents for discovery or investigation.
- `rules/`: Cursor guidance for safe implementation.
- `README.md`: plugin-specific setup and usage documentation.

## Learn More

Open the README for the plugin that matches your project:

- `codebase-plugin/README.md` for source-code integrations.
- `remote-plugin/README.md` for no-source-access browser-extension integrations.
