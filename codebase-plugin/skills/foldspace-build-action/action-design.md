# Agentic Action Design

Use this reference when finding, defining, or building Foldspace actions so the
result is meaningful, bounded, and safe. It is adapted from the Foldspace PRD
templates for agentic experiences.

Docs:

- https://foldspace.readme.io/docs/agentic-capabilities
- https://foldspace.readme.io/docs/foldspace-actions-product-playbook
- https://foldspace.readme.io/docs/prd-template
- https://foldspace.readme.io/docs/confluence-friendly-prd-template

## What Makes A Good Action

A Foldspace action should:

- Move the user toward a real product outcome.
- Reduce effort, clicks, ambiguity, or context switching.
- Have explicit intent and a bounded purpose.
- Be grounded in the product's permissions, UI, and data model.
- Produce a predictable outcome the user can understand.

Do not create an action if it adds complexity, duplicates a simpler UI path, or
has no clear user outcome.

## Outcome

Define the user outcome before naming an action:

- What should the agent help the user accomplish end-to-end?
- What current friction, click tax, or missing guidance does this remove?
- Does this move the user forward, change state, reduce effort, or create a
  useful artifact?

## User Role

Identify the primary user:

- Role or persona.
- Permissions or access constraints.
- What they know at the moment they ask the agent.
- What they should not be allowed to do.

## Current Flow vs AI-Enabled Flow

Document both flows:

- Current flow: steps the user takes today without Foldspace.
- AI-enabled flow: how the agent simplifies the path.

Prefer flows that become one-prompt or guided step-by-step experiences.

## Agent Lifecycle Fit

Check each action against the agent lifecycle:

- Intent: Is the user request clear enough for the agent to select this action?
- Tool selection: Is this action distinct from nearby actions?
- Planning: Does the action need dependencies, sequencing, or confirmation?
- Execution: Can the frontend complete the work deterministically?
- Iteration: Does the user need to review, edit, confirm, or cancel?
- Exit criteria: What condition ends the flow? What counts as done?
- Loop prevention: Could this action trigger repetitive or ambiguous follow-up?

## Interaction Mode / Modality

Choose the minimum useful modality:

- Text-Only: quick execution, summaries, lightweight updates, or deterministic
  fetches.
- Chatterblock: confirmation, editing, selection, previews, cards, tables,
  charts, or structured data.
- Navigation: when the next useful step is moving the user to a feature, page,
  or record.
- Shared State / Tandem Mode: complex forms, configuration, filters, or live
  page context.

## Success Metrics

Suggest practical metrics:

- Time saved per workflow.
- Action usage rate.
- Success/failure rate.
- Field accuracy or completion rate.
- User satisfaction or thumbs-up rate.
- Reduced support/onboarding effort.

## Business KPIs

Tie the action to one business outcome when possible:

- Adoption of key workflows.
- Retention through reduced friction.
- Expansion or upsell via AI-first capabilities.
- Margin improvement through support or onboarding deflection.

## Product Design Checklist

Before implementation, confirm:

- Outcome:
- User role:
- Current flow without AI:
- AI-enabled flow:
- Interaction mode:
- Required permissions:
- Required parameters:
- Success return shape:
- Failure return shape:
- Success metric:
- Business KPI:
- Exit criteria:
- Loop or ambiguity risk:

## Candidate Action Scorecard

Use this lightweight scorecard when ranking action ideas during discovery:

- User pain removed:
- Frequency:
- Business value:
- Implementation feasibility:
- Existing UI/API reuse:
- Permission clarity:
- Exit criteria clarity:
- Risk of loops or confusion:

## Implementation Guardrails

- Keep action IDs exact and stable.
- Keep schemas minimal; do not request params that can be derived safely from
  user context, subscription context, or page state.
- Prefer existing frontend components and API clients.
- Return only data the LLM needs for the next response.
- Use safe, structured errors and clear exit states.
