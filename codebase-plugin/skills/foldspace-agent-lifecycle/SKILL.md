---
name: foldspace-agent-lifecycle
description: Safely change an action or Task Agent that is already live — versioning, publishing, and parallel generations. Use when the user wants to edit a published Task Agent or action, change its instructions or output schema, test a change before it reaches users, create a v2 or new version of an agent, roll back a bad prompt, or asks why their Task Agent call is failing to resolve.
---

# Changing A Live Agent Safely

Cross-cutting skill. It applies at any point in the build, not at one step —
whenever an object that is **already published** needs to change.

Editing a Foldspace object is not like editing code. There is no branch, no
staging environment, and no review step between your edit and real users. Read
this before touching anything live.

## The Rule That Surprises Everyone

**A Task Agent must be published to be callable. `runTask()` does not resolve a
draft.**

The two halves combine into a trap:

- You cannot try a change without publishing it.
- Publishing an edit to an in-use Task Agent reaches production **immediately**.

So "let me just publish it quickly to test" ships to every user of that agent,
with no rollback commit and no deploy gate. There is no safe way to test in
place.

## The Safe Path: A New Generation

Never test by republishing a live object. Instead:

1. **Clone** the live object under a new name with a `_gen2` suffix.
2. **Publish the clone.** This is safe — a published object that no `taskKey`
   names is inert. Nothing calls it.
3. **Repoint the `taskKey`** in the client code (`agent/constants.ts` or
   equivalent) to the clone.
4. **Test locally.** Production still runs the deployed bundle against the
   original.
5. **Deploy.** This is the only step that reaches a real user.

Rollback before step 5 is "do not deploy" — there is nothing to undo, and the
published clone simply keeps sitting idle. Rollback after step 5 is reverting
the deploy, not unpublishing anything.

**The exception:** an object that is unpublished *and* has no call site can be
edited in place. Nothing can reach it, so there is nothing to protect — cloning
it would just create a duplicate to maintain.

## Naming: `_gen2`, Never `_v2`

Foldspace already owns `v1`, `v2`, `v3`… and bumps that counter every time a
prompt or schema is saved. A **generation** is a different concept: a parallel
object deliberately stood up beside the live one.

Sharing the letter `v` collides them, and the collision shows up constantly —
`material_coverage_agent_v2` sitting at Foldspace version **v1**, cloned from the
live agent's **v4**, is three numbers meaning three different things.

- Use `_gen2`. It still sequences (there will be a gen3) and cannot be misread
  as a version.
- Use `Gen1` / `Gen2` in prose for the generations; keep lowercase `vN` strictly
  for Foldspace's own counter.
- Avoid ticket-based suffixes like `_plg5622` — precise today, meaningless once
  nobody remembers the ticket.
- **The suffix is permanent.** The `taskKey` in code names the object, so
  renaming after promotion costs a second deploy. Pick it before the objects
  exist.

## What Scopes Reachability

Neither actions nor Task Agents are scoped by publish state alone, and they do
not work the same way:

| | Actions | Task Agents |
|---|---|---|
| Scoped by | handler registration | the `taskKey` in code |
| Must be published to run | — | **yes** |
| Publishing a brand-new object | inert | **inert** |
| Publishing an edit to a live object | reaches production | **reaches production immediately** |

**Actions:** the SDK determines which actions attach to the agent server-side —
the server excludes active actions the SDK does not transmit as registered. So
commenting a handler out of the action registry removes it from the copilot's
tool list without unpublishing anything.

**Task Agents:** there is no registration file. Nothing invokes one unless some
`runTask({ taskKey })` names it.

A useful corollary when debugging: a published action with no handler cannot be
offered to the model, so unresolved calls are not orphaned invocations — look for
UI components that rendered and never resolved.

## Never Send Prompts From Code

`data` carries **data only**. No `prompt` field, no instruction strings, no
rules blocks.

A prompt shipped from TypeScript is unversioned. It cannot be pinned, diffed,
rolled back, or edited by anyone without a deploy — while the Task Agent's own
instructions are versioned and editable in the web app. Shipping both means two
sources of truth for the same behavior, and they drift until they contradict
each other inside the same request.

This is checkable in one grep, and belongs in any verification gate:

```
grep -rn "prompt:" agent/api/     # must return nothing
```

If a Task Agent needs more context to do its job, pass it as **data** and put the
instructions for interpreting that data in the agent's own versioned
instructions.

## Arm Test Mode Before Anything Reaches The Agent

Local testing hits the **production** agent. Test mode tags the traffic so it is
excluded from the customer's analytics and hidden from the default conversation
list.

It must be armed inside the SDK's `when ready` callback. Calling `setTestMode`
before the SDK has initialised silently does nothing:

```js
foldspace("when", "ready", () => {
  foldspace.agent({ apiName: "YOUR-AGENT-KEY" }).setTestMode(true);
});
```

Inject it on every page load — it is per browser session and resets on every
navigation.

### If the app embeds its own Foldspace, override it

When the client app bootstraps its own SDK (check `window.__FOLDSPACE_EMBEDDED__`),
the copilot the user sees is driven by the **app's** agent instance, not yours.
Harnesses that default to reusing the app's agent will happily let
`setTestMode(true)` succeed on a handle that is not the one serving the chat —
and the conversations are then recorded untagged, in the customer's real
conversation list.

Inject your own SDK instead of reusing the app's, so the instance under test is
definitively yours.

### Prove it — none of these are proof

- A dev badge reading "TEST MODE". Usually a hardcoded string that never reads
  SDK state.
- A console line saying test mode is on. It proves only that the call returned
  without throwing, on whichever handle it was called on.
- No new rows in the conversation list. `runTask` creates no conversation record
  at all, so it can never appear there.

**What proves it:** send one chat message, then look the conversation up. If it
appears on a normal channel with no test marker, test mode is not working — stop
and fix it before doing anything else.

## One Owner Per Concern

If two components both decide the same value, they will disagree eventually.
Extraction reads the document; normalization converts units; nothing does both.
When a value is wrong, you want exactly one place to look.

## Before You Change Anything Live

- Is this object published, and does anything call it? If both, clone it.
- Is the change to instructions, output schema, or both? Both bump the version.
- What is the `taskKey`, and which code file names it?
- What is the rollback, stated concretely — not "revert", but which commit or
  which bundle?
- Is there a fixture that **fails on the current version**? A gate that cannot
  detect the existing failure proves nothing when it reports green.
