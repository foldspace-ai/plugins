# Foldspace Plugins

This repository is the public Claude Code marketplace for Foldspace. It ships
one plugin: **foldspace-agent-builder** — a single playbook plus two
investigation agents for building a Foldspace agent experience inside a
customer's web app.

## Install (Claude Code)

Add the Foldspace marketplace once:

```bash
claude plugin marketplace add foldspace-ai/plugins
```

Then install the builder plugin:

```bash
claude plugin install foldspace-agent-builder@foldspace-plugins
```

The installed plugin starts its MCP servers from `builder/.mcp.json`. Foldspace
MCP uses HTTP OAuth against `https://api.foldspace.ai/mcp`. When Claude prompts
you to authenticate, complete the browser login with your Foldspace account.

Inside Claude Code, run `/plugin`, `/mcp`, and `/agents` to confirm the plugin,
MCP server, and plugin agents loaded.

## What Is Included

`builder/` is self-contained:

- `.claude-plugin/plugin.json`: Claude Code plugin metadata
- `.mcp.json`: Claude Code MCP server configuration
- `skills/foldspace-agent-builder/`: the playbook and references
- `agents/`: `devtools-reader` and `navigation-mapper`
- `README.md`: plugin-specific notes

## Refresh After Updates

Publishers cannot refresh installs on your machine. After a new release:

```text
/plugin marketplace update foldspace-plugins
/reload-plugins
```

Or from the shell:

```bash
claude plugin marketplace update foldspace-plugins
```

## Learn More

See `builder/README.md` for how the playbook is meant to be used.
