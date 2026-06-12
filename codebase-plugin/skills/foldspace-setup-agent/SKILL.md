---
name: foldspace-setup-agent
description: Add a Foldspace AI agent to a website the user can edit and connect it to logged-in users. Use when the user wants to install Foldspace, add the agent snippet, set up Foldspace for the first time, connect auth or login data, check whether Foldspace is installed correctly, or make the agent know who is signed in.
disable-model-invocation: false
---

# Set Up the Agent

This skill gets the Foldspace agent onto a website you can edit and connects it
to your logged-in users. It is one milestone with two parts:

- **Part A — Add the agent snippet** (get the agent loading on the page).
- **Part B — Connect logged-in users** (tell the agent who is signed in).

## Integration Path

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

You are here: step 1 — set up the agent.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Explain As You Work

As you work, explain these to the user in plain language so they understand what
is happening and could do it themselves next time:

- **Agent Studio**: the Foldspace web app where they configure the agent and copy
  its setup snippet (https://app.foldspace.ai).
- **SDK snippet**: the small script that loads Foldspace onto their page.
- **Agent API Name**: the ID that ties their code to the right agent in Agent Studio.
- **User context**: telling Foldspace who is logged in so the agent can
  personalize and so Foldspace can attribute activity to the right person/account.

## How To Explain While Working

Before each part, tell the user in plain language: what Foldspace piece you are
touching, why it matters, and what file you will change. Keep it to a sentence or
two, then act. If they say "just do it," skip the narration but still fill in the
"What We Did" and "If You Did This Yourself" blocks at the end.

## Prerequisite Gate

Both parts need values from Agent Studio. If the product key or Agent API Name is
missing, pause and ask the user to copy them from the setup snippet in Agent
Studio before editing code (Agent Studio -> Setup, e.g.
https://app.foldspace.ai/agent/{agent-id}/setup/agent-settings). Do not invent
product keys or Agent API Names.

If Part A (the snippet) is not done yet, do Part A first. If the snippet is
already present, you can skip straight to Part B.

## Agent Studio Snippet Parsing

When setting up Part A, ask for the full Agent Studio SDK snippet. Prefer parsing
the needed values from that snippet instead of asking the user to derive them
manually:

- Product key format: `EU-EXAMPLEPRODUCT-1-1` -> product key
  `EU-EXAMPLEPRODUCT-1-1` and product ID `EXAMPLEPRODUCT` when a product ID constant
  is useful locally.
- Agent API name format: `foldspace.agent('example-agent')` or
  `foldspace.agent({ apiName: 'example-agent' })` -> Agent API Name
  `example-agent`.

If the snippet does not include the agent initialization call, ask for the Agent
API Name from Agent Studio. Never invent product keys or Agent API Names.

Docs:

- https://foldspace.readme.io/docs/installing-the-sdk
- https://foldspace.readme.io/docs/agent-initialization
- https://foldspace.readme.io/docs/visibility-control
- https://foldspace.readme.io/docs/user-context

---

## Part A — Add the Agent Snippet

Plain-language goal: get the Foldspace agent to load and show up on the site.

### Required inputs

- The JavaScript SDK snippet from Agent Studio -> Setup.
- The product key embedded in that snippet.
- The Agent API Name from Agent Studio -> Setup.

### Steps

1. **Find the frontend entry points.**
   - Identify the framework, app shell, document template, root layout, or HTML
     entry file where third-party scripts belong.
   - Prefer the app's existing script-loading pattern.
   - Common placement targets:
     - Next.js App Router: `app/layout.tsx`, root provider, or `next/script`.
     - Next.js Pages Router: `pages/_document.tsx`, `pages/_app.tsx`, or
       `next/script`.
     - React SPA: `index.html`, root app shell, or bootstrap file.
     - Vue/Nuxt/Svelte/Angular: root layout, app shell, or documented script
       injection point.
     - Plain HTML / MPA: shared base template or each page template that needs
       the agent.

2. **Check for the SDK snippet.**
   - Search for `foldspace.js`, `window.foldspace`, `__FOLD_SPACE__`, and
     `foldspace('when', 'ready')`.
   - If missing, tell the user they need the JavaScript snippet from Agent
     Studio -> Setup.
     - Provide a link for them to click and get it. You get it at: https://app.foldspace.ai/agent/{agentId}/setup/agent-settings you can get the agentId from the mcp
   - The SDK loads asynchronously and should not block app rendering.
   - The snippet defines the `foldspace` command queue and loads the SDK script
     with the product key. Preserve the snippet from Agent Studio unless the
     app's framework requires adapting script placement.

3. **Verify agent initialization.**
   - Every call must reference the Agent API Name from Agent Studio -> Setup.
   - Confirm the code initializes the agent after SDK readiness:

```javascript
const AGENT_API_NAME = "agent-api-name";

foldspace("when", "ready", () => {
  foldspace.agent(AGENT_API_NAME).show();
});
```
   - If the app already initializes an agent, reuse that instance/pattern rather
     than adding a duplicate initialization.

4. **Review placement and visibility behavior.**
   - Confirm whether the widget should show automatically, stay hidden until
     opened, or be controlled from app UI.
   - Use visibility methods intentionally: `show()`, `hide()`, `open()`,
     `close()`, and `remove()`.
   - Avoid initializing multiple duplicate agents.

5. **Verify in the running app when possible.**
   - Confirm the SDK script request succeeds in the browser network panel.
   - Confirm `window.foldspace` exists after the script loads.
   - Confirm the widget appears, or can be opened if it starts hidden.
   - Confirm no console errors mention an invalid product key, missing Agent API
     Name, blocked domain, or duplicate initialization.
   - If strict CSP or corporate firewalls are present, note that domain
     allow-listing or CSP updates may be required.

6. **Apply safety checks.**
   - Do not commit temporary test keys or secrets to shared examples.
   - Keep the exact product key format from Agent Studio.

---

## Part B — Connect Logged-In Users

Plain-language goal: tell Foldspace who is signed in, so the agent can
personalize and Foldspace can attribute activity to the right user and account.
In code this is `foldspace.identify(context)`.

### Core requirements

User context requires:

- `user.id`
- `subscription.id`

Optional attributes can include:

- User: `email`, `name`, `role`, `image`, `phone`, `timezone`, `signUpDate`,
  and `location`.
- Subscription: subscription-level attributes configured in Foldspace settings.
- Custom attributes only after they are created in Foldspace Attribute Settings.

### Steps

1. **Find the auth/session source.**
   - Search the frontend for auth providers, session hooks, current-user APIs,
     organization/workspace selectors, and tenant/subscription identifiers.
   - Identify when user and subscription data becomes available.

2. **Confirm the agent is initialized.**
   - Make sure Part A is done: `foldspace('when', 'ready')` and
     `foldspace.agent(...)` exist. If not, finish Part A first.

3. **Design the context mapping.**
   - Map `user.id` to the stable app user identifier.
   - Map `subscription.id` to the stable account, workspace, organization, or
     tenant identifier.
   - Add optional attributes only when they are available, useful, and safe.
   - Avoid secrets, auth tokens, unstable internal-only IDs, and sensitive
     personal data the agent does not need.

4. **Plan lifecycle behavior.**
   - Call `foldspace.identify(context)` inside `foldspace('when', 'ready', ...)`
     after auth context is loaded.
   - Re-identify when the user switches workspace/subscription.
   - Avoid calling identify repeatedly with unchanged data on every render.

5. **Implement or review.**
   - Follow the app's existing framework and state-management patterns.
   - Keep context-building code typed and easy to audit.
   - If editing code, add only the smallest integration needed.

6. **Validate.**
   - Confirm `user.id` and `subscription.id` are always present before identify.
   - Confirm optional fields match Foldspace attribute names.
   - Confirm no secrets or unnecessary PII are sent.
   - Confirm workspace/account switches update context.

## Output Format

```markdown
## Foldspace Setup Status

### Part A — Agent Snippet
- SDK snippet:
- Product key:
- Agent API name:
- Agent initialization:
- Visibility behavior:
- Runtime verification:

### Part B — Logged-In Users
- Auth/session source:
- User ID mapping:
- Subscription ID mapping:
- Optional attributes:
- Lifecycle behavior:
- Privacy/safety notes:

### Findings
- Concrete gaps, risks, or confirmed-ready areas with file paths when available.

### What We Did (and Why)
- <bullet per major step: action taken + one-line reason>

### If You Did This Yourself
- Agent Studio: copy the setup snippet and Agent API Name from Agent Studio -> Setup.
- Docs: https://foldspace.readme.io/docs/installing-the-sdk (load the agent), https://foldspace.readme.io/docs/user-context (connect logged-in users).
- Manual steps: 1) paste the snippet at your app's root, 2) initialize the agent on ready, 3) call `foldspace.identify` with `user.id` and `subscription.id` after login.
```

Recommended next-step routing: When the agent loads and users are connected,
recommend `foldspace-discover-actions` if the user does not know what to build,
or `foldspace-build-action` if approved action plans already exist.

## Next Steps And Summary

Always end with:

```markdown
Summary:
- Completed: <what was done or learned>
- Concepts: <new Foldspace terms the user should now understand, e.g. SDK snippet, user context, Agent API Name>
- If you did this yourself: <one sentence pointer to Agent Studio or docs>
- Next step: <one recommended `foldspace-*` skill with concrete inputs>
- Blockers: <missing product key, Agent API Name, auth source, or None>
```
