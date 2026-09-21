---
name: foldspace-agent-builder
description: Build an agent experience inside a customer's web app — actions, task agents, navigation routes, and the handler code behind them. Use for any Foldspace build, from an empty tenant to a verified, published experience.
---

# Building a Foldspace agent experience

**The build rules live in the harness, not here.** Every scaffolded project's
`CLAUDE.md` imports `node_modules/@foldspace_npm/harness/CLAUDE.md`, and that
file is the playbook: connection check, the L0–L2 ladder, finding the call
yourself, the six gates, publishing, generations, test mode. It ships with the
CLI it describes and `foldspace upgrade` keeps it current — in every editor,
not only Claude Code.

Nothing from it is repeated on this page on purpose. A second copy drifts, and
when the two disagree **the harness wins**.

## If there is no harness project yet

Follow <https://foldspace.ai/agents.md>: connect the tools, confirm the account,
`init`, build. Then open the scaffolded folder — its `CLAUDE.md` takes over.

## What this plugin adds

| | |
|---|---|
| **Two MCP servers** — `foldspace`, `foldspace-docs` | Declared in `.mcp.json`. No browser server: the harness project reads its own test window with `foldspace observe` and tests with `foldspace ask`; a DevTools server started with `--isolated` opens a different, signed-out Chrome. The plugin can declare `foldspace`; only the human can approve its sign-in (`/mcp` → **foldspace** → browser) |
| **`account-scout`** subagent | Read-only, small fast model, three-minute budget: runs `foldspace observe` for one experience and returns the one request behind it, in fifteen lines |
| **`devtools-reader`** subagent | Read-only: the longer investigation, with the same commands, when one screen is not enough |
| **`navigation-mapper`** subagent | Read-only: maps routes and destinations |
| `references/` | Depth the manual points at, below |

Subagents are for read-only investigation that returns a summary. Never
delegate a handler or a gate to one — a summary of a gate is not a gate.

## References

| Reference | When |
|---|---|
| `references/local-loop.md` | running the harness; what will mislead you |
| `references/navigation.md` | **read before creating any route** |
| `references/generations.md` | changing anything already live |
| `references/test-mode.md` | a tenant with real users |
