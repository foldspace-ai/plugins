# foldspace-agent-builder

Two MCP servers and a pointer to the playbook.

Replaces `codebase-plugin` and `remote-plugin`, which between them held 13 skills
and ~4,200 lines across five entry points. A build in August 2026 used none of
them and made two mistakes the guidance already covered — because skills must be
*selected*, and a playbook that is loaded simply governs.

## What is here

| | |
|---|---|
| `skills/foldspace-agent-builder/SKILL.md` | Points at the playbook — `@foldspace_npm/harness`'s `CLAUDE.md`, which every scaffolded project imports — and lists what only this plugin adds |
| `references/navigation.md` | Read before creating any route |
| `references/local-loop.md` | Running the harness; what will mislead you |
| `references/generations.md` | Changing anything already live |
| `references/test-mode.md` | Tenants with real users |


## The plugin is one delivery, not the source

The plugin format is a **Claude Code** construct, so this package only reaches
builders working there. The build rules therefore do not live here: they live
in `@foldspace_npm/harness`'s `CLAUDE.md`, which every scaffolded project
imports and `foldspace upgrade` keeps current — in every editor. This plugin
adds the MCP servers and the references the manual points at.

**Do not copy the rules into this repo.** Four hand-maintained copies of the
previous playbook existed, and the only one carrying the navigation section and
gate 6 was the copy no build ever read. When this plugin and the harness
disagree, the harness wins.

## Enable it

Registering the marketplace is not enough — the plugin must also be enabled, and
a client repo should do that for you rather than relying on anyone remembering.
