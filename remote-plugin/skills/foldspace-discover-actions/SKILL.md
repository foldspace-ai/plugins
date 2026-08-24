---
name: foldspace-discover-actions
description: Discover recommended Foldspace actions for a business before observing live-site flows. Use when the user has a remote/no-source-access website and asks what actions to build, what the agent should do, or wants candidate workflows before DevTools evidence is collected.
disable-model-invocation: false
---

# Discover Remote Actions

Use this skill when the user does not yet know which action to observe or build
for a website they cannot edit. The goal is to ask Foldspace's action-discovery
task agent for candidate actions, then help the user pick one candidate for live
DevTools observation.

## Integration Path

Remote extension path: `foldspace-get-started` -> `foldspace-create-extension` -> `foldspace-discover-actions` -> `foldspace-observe-flow-in-site` -> `foldspace-build-action` -> `foldspace-add-navigation` when needed -> `foldspace-verify-actions`.

You are here: discover candidate actions before observing one live-site flow.

Prerequisites: Foldspace MCP is authenticated via OAuth, and the user
has a target Foldspace agent ID. A created extension is helpful but not required
for ideation.

## Discovery Workflow

1. **Ask for the business or product name.**
   - Always ask the user for the business/product name. Do not infer it silently
     from the domain.
   - Ask for the target Foldspace agent ID if it is not already known.

2. **Call the MCP discovery tool.**
   - Use `discover_actions` with `agent_id` and `product`.
   - Tell the user that cold task-agent runs can take 20-30 seconds and cached
     runs are usually faster. Wait for the tool result instead of retrying.

3. **Present candidates for selection.**
   - Show a short ranked list grouped by activation, adoption, and stickiness
     when those groups are present.
   - For each candidate, include the proposed action key, what it solves, when
     it triggers, and what live-site evidence will be needed next.

4. **Route to observation.**
   - Ask the user which one candidate to observe first.
   - Recommend `foldspace-observe-flow-in-site` with the selected action goal,
     expected user flow, target URL, and any assumptions from the suggestion.

## Output

Return:

```markdown
## Recommended Remote Actions

### Activation
- `action_key`: what it does, trigger, evidence to capture next.

### Adoption
- `action_key`: what it does, trigger, evidence to capture next.

### Stickiness
- `action_key`: what it does, trigger, evidence to capture next.

## Recommended First Observation
Name the best first candidate and why it is feasible to observe.

## Next Step
Ask which candidate to observe with `foldspace-observe-flow-in-site`.
```

## Action Items

After discovery, tell the user which candidates are strongest only as much as needed to choose the next observation. End with concise user-owned action items instead of a recap.

End every response with:

```text
Action items:
- <one exact `foldspace-observe-flow-in-site` handoff with action goal, target URL, and expected user flow>
- <one user-owned choice, login, or missing business/agent detail, only if needed>
```
