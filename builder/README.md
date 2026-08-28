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

## Enable it

Registering the marketplace is not enough — the plugin must also be enabled, and
a client repo should do that for you rather than relying on anyone remembering.
