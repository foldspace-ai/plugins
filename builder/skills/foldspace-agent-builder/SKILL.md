---
name: foldspace-agent-builder
description: Build an agent experience inside a customer's web app — actions, task agents, navigation routes, and the handler code behind them. Use for any Foldspace build, from an empty tenant to a verified, published experience.
---

# Building a Foldspace agent experience

You are adding an AI agent to a product that already exists. The agent answers
questions and *does things* inside that product, on the user's behalf.

Read this before creating anything. It is short because the details live in
`references/`; follow the sequence and consult those when you reach them.

---

## 1. What you are building

Four kinds of thing. Never make the customer learn these words — describe them
by what they do.

| Thing | Answers | Lives in | You write |
|---|---|---|---|
| **Action** | *when* should the agent invoke this? | Agent Studio | the contract |
| **Action handler** | what happens when it does | `agent/actions/<name>.ts` | the code |
| **Task agent** | *how* to do one reasoning job | Agent Studio | instructions + response schema |
| **Navigation route** | where the agent can send the user | Agent Studio | a URL template + what the page is for |

A handler is `fetch` plus `runTask` and nothing more. It runs inside the
customer's page, with the user's own session.

**Platform built-ins** — knowledge search, navigation, sharing the current tab —
ship with the product. You write no code for them, and a first experience can
lean on them heavily.

## 2. Orient before building

Ten minutes, and it stops you duplicating something that exists.

```
list_agents                  → agent id, apiName, productId
get_agent_settings <agent>   → model, behaviour instructions, starters
list_actions <agent>         → every action, published vs latest
list_task_agents <agent>     → every task agent, published vs latest
list_navigation_routes       → every route
```

**Record current versions before changing anything.** If something breaks, this
is how you prove what moved.

Conversation starters seeded at sign-up are often a specification someone has
already written. Read them.

## 3. Agree the experience in the customer's words

State the decomposition in plain language and get agreement **before** creating
anything:

> "*Summarise unresolved comments* needs one thing the agent can call, one
> reasoning step to triage what it finds, and somewhere to send you afterwards.
> Sound right?"

## 4. Build objects first, code second

```
create_action           → the contract
get_action_schema       → the shape
generate_action_handler → typed skeleton
create_task_agent       → instructions + response schema
```

Generate the handler from the action schema. Hand-writing both is how they
drift.

**Between the contract and the code, capture real data — see gate 6.**

## 5. Reachability: everything must be published

| | Published to run? | Second gate |
|---|---|---|
| Action | **yes** | handler registered in `agent/actions/index.ts` |
| Task agent | **yes** | a `taskKey` in code names it |
| Navigation route | **yes** | `isActive: true` |

Three things to know:

- `runTask` does **not** resolve a draft task agent.
- **Navigation has no publish tool on the MCP**, and `get_navigation_route`
  returns only `isActive` — so publish state is not observable over the API.
  Publish routes by hand in Agent Studio and say so.
- Publishing a **brand-new** object is inert. Publishing an **edit to a live
  one** reaches production immediately, with no review and no rollback commit.
  See `references/generations.md`.

## 6. Verify — six gates

Never report success without all six.

| # | Gate | How |
|---|---|---|
| 1 | It compiles | `npx tsc --noEmit -p tsconfig.json` |
| 2 | The edit reached the artifact | grep `dist/index.js` for a string from your change |
| 3 | The browser ran it | your handlers are registered in the page — see the loop reference for your track |
| 4 | It behaves | drive the real UI and assert on the outcome |
| 5 | Neighbours still work | replay the fixture set |
| 6 | **Every fixture came from the live app** | no hand-authored payload stands in for a real one |

**Gate 6 exists because 1–5 cannot catch a wrong assumption.** They verify your
code reached the page; only 6 verifies your beliefs about the app. An action has
shipped typechecking, building, running — and failing for every user — because
the response shape was guessed instead of captured.

Capture one real response before writing a parser. Even an error body reveals
the envelope.

## 7. Rules that are not negotiable

1. **No prompts from code.** `data` carries data. Task agent instructions are
   versioned in Agent Studio; sending them from TypeScript discards that and the
   two copies drift into contradicting each other.
2. **One owner per concern.** Extraction reads the document; normalisation
   converts units. Nothing does both.
3. **Never edit a live object to test it.** Stand up a `_gen2` beside it.
4. **Say what you verified and what you assumed.** An unverified assumption
   stated as fact is worse than an open question.
5. **Don't send chat messages to test.** Every message is a real conversation in
   the customer's list. `runTask` creates no conversation record — use it. On a
   brand-new agent during initial setup this cost is nil, so test mode is
   unnecessary; on an established tenant it matters. See
   `references/test-mode.md`.

## Going deeper

Sections 1-7 above apply wherever the builder runs. Only the **loop** — how code
reaches the page and how you observe it — differs by track, and that is confined
to one reference.

| Reference | When | Track |
|---|---|---|
| `references/local-loop.md` | running the harness, verifying you are on local code | **local only** |
| `references/navigation.md` | adding routes — **read before creating any** | both |
| `references/generations.md` | changing anything already live | both |
| `references/test-mode.md` | working on a tenant with real users | both |
