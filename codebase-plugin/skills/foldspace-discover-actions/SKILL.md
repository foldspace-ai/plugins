---
name: foldspace-discover-actions
description: Find useful things a Foldspace agent should be able to do in the user's product. Use when the user asks what actions to build, wants to make their app more agentic, wants the agent to do real tasks, does not know where to start with capabilities, or wants ideas scanned from their frontend code. Not for defining schemas or writing handler code.
disable-model-invocation: false
---

# Discover Actions

Use this skill when the user does not yet know what to build. The goal is to
understand the frontend product, find useful agentic workflows, and produce
prioritized Foldspace action opportunities.

## Integration Path

`foldspace-get-started` -> `foldspace-setup-agent` -> `foldspace-discover-actions` -> `foldspace-plan-action` -> `foldspace-build-action` -> `foldspace-verify-actions`.

You are here: step 2 — discover useful actions.

Prerequisites: A frontend codebase to inspect. The agent snippet and user context help but are not required to brainstorm.

Skipped a step? Ask what is already complete and route the user to the earliest incomplete prerequisite.

## Explain As You Work

As you present candidates, explain these to the user in plain language so they
understand the recommendations and could spot opportunities themselves:

- **Action**: a single thing the agent can do in their product (for example
  "invite a teammate" or "create an invoice"). This skill finds candidates; the
  user plans and builds them in later steps.
- **Modality**: how an action behaves — Text-Only (works in the background),
  Chatterblock (asks the user to confirm/edit/choose in chat), or Shared State
  (the agent reads or updates what is on the page right now). Name the modality
  for each candidate and say why it fits.

## Prerequisite Gate

If the app has no source available, the user is on the wrong plugin — point them
to the **Foldspace: Browser Extension** marketplace listing instead.

Do not define detailed schemas or implement handlers in this skill. Hand off
selected ideas to `foldspace-plan-action`, then `foldspace-build-action`.

Always read `action-design.md` before ranking action candidates. Use it to
connect each recommendation to user outcomes, current flow, AI-enabled flow,
interaction mode, success metrics, business KPIs, loop-safe exit criteria, and
the candidate scorecard, so candidates are bounded, product-grounded, feasible,
and distinct from nearby actions.

## When To Use

Use this skill when the user says things like:

- "I just added Foldspace. What actions should I create?"
- "Help me make this product more agentic."
- "Look through my frontend and suggest Foldspace actions."
- "What would be useful for the agent to do in this app?"

If the user already has one action idea and wants inputs, schema, modality, or
behavior defined, use `foldspace-plan-action` instead.

## Discovery Workflow

1. **Clarify the product goal.**
   - Ask what product or user workflow matters most if it is unclear.
   - Keep this lightweight; the codebase scan should teach you most of the
     product surface.

2. **Use subagents for broad codebase scanning when available.**
   - Prefer the `foldspace-product-scout` subagent. It is specialized for
     finding Foldspace action, Chatterblock, Shared State, and navigation
     opportunities in frontend codebases.
   - If additional parallel coverage is useful, dispatch a second exploration
     subagent for data and integration surfaces: API clients, mutations,
     services, validation schemas, permissions, and network calls.
   - If subagents are unavailable, perform both scans directly.
   - Ask each scan to return file paths, user workflows, existing components,
     and action opportunity notes. Do not ask subagents to edit files.

3. **Synthesize action opportunities.**
   - Read `action-design.md`.
   - Look for repeated manual work, multi-step workflows, data entry,
     approvals, summarization, record creation, status updates, and places
     where users need guidance.
   - Prefer actions that can be implemented using existing frontend components,
     API clients, and validation patterns.
   - Separate normal action handlers from Shared State opportunities.

4. **Rank the candidates.**
   - Group candidates into:
     - Quick wins.
     - High-impact workflows.
     - Chatterblock candidates.
     - Shared State / Tandem Mode candidates.
   - Prefer a short ranked list over a long inventory.

5. **Present the recommendations.**
   - For each candidate, include:
     - Action name and proposed action ID.
     - User problem solved.
     - Suggested modality: Text-Only, Chatterblock, or Shared State.
     - Required parameters.
     - Expected return shape to the LLM.
     - Likely implementation location.
     - Current flow and AI-enabled flow.
     - Success metric or business KPI.
     - Exit criteria and loop-risk notes.
     - Why it is worth building.
   - Briefly explain why each modality fits, so the user learns the difference.
   - Ask the user which action they want to plan first, then route to
     `foldspace-plan-action`.

## Output Shape

Use this structure:

```markdown
## Recommended Actions

### Quick Wins
- `action_id`: short explanation, modality, likely files, why now.

### High-Impact Workflows
- `action_id`: short explanation, modality, likely files, why now.

### Chatterblock Candidates
- `action_id`: what the user would review or edit in chat.

### Shared State Candidates
- `state_key`: which page/form state the agent should understand.

## Recommended First Build
Name the best first action and why.

## Next Step
Ask which action to turn into a Foldspace-ready plan with `foldspace-plan-action`.
```

Recommended next-step routing: Ask which candidate action to turn into a plan
with `foldspace-plan-action`.

## Next Steps And Summary

Always end with:

```markdown
Summary:
- Completed: <what was discovered>
- Concepts: <Foldspace terms introduced, e.g. action, modality, Chatterblock, Shared State>
- If you did this yourself: scan your app for repeated manual work and multi-step flows; those are usually the best first actions.
- Next step: <one recommended `foldspace-*` skill with concrete inputs>
- Blockers: <missing source access, unclear product goal, or None>
```
