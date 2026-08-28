# foldspace-agent-builder

One playbook, two investigation agents.

Replaces `codebase-plugin` and `remote-plugin`, which between them held 13 skills
and ~4,200 lines across five entry points. A build in August 2026 used none of
them and made two mistakes the guidance already covered — because skills must be
*selected*, and a playbook that is loaded simply governs.

## What is here

| | |
|---|---|
| `skills/foldspace-agent-builder/SKILL.md` | The playbook. Objects, sequence, reachability, six gates, non-negotiables |
| `references/navigation.md` | Read before creating any route |
| `references/local-loop.md` | Running the harness; what will mislead you |
| `references/generations.md` | Changing anything already live |
| `references/test-mode.md` | Tenants with real users |
| `agents/devtools-reader.md` | Read-only: watch a workflow, produce API notes |
| `agents/navigation-mapper.md` | Read-only: map routes and destinations |

The subagents stay because they are context-heavy read-only *investigations*
that return a summary — the shape of work that otherwise floods the main context.

## The plugin is one delivery, not the source

The plugin format is a **Claude Code** construct, so this package only reaches
builders working there. The playbook inside it is not Claude Code specific:
sections 1-7 apply wherever the builder runs, and only `references/local-loop.md`
assumes a desktop Chrome you launched.

That matters because the same content has three audiences:

| Delivery | Reaches |
|---|---|
| this plugin skill | Claude Code, local track |
| a page on docs.foldspace.ai | any agent via the docs MCP, other editors, humans |
| a hosted agent's system prompt | the remote track |

**Generate those from this source — do not copy it.** Four hand-maintained
copies of the previous playbook existed, and the only one carrying the
navigation section and gate 6 was the copy no build ever read.

## Enable it

Registering the marketplace is not enough — the plugin must also be enabled, and
a client repo should do that for you rather than relying on anyone remembering.
