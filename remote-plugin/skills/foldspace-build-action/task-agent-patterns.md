# Task Agent Patterns For Extensions

Use Task Agents when an extension action needs a one-time LLM subtask inside an otherwise deterministic action handler.

Docs: https://foldspace.readme.io/docs/functions-2 and https://foldspace.readme.io/docs/task-agent.md

## When To Use A Task Agent

Use `agent.runTask()` for:

- Extraction from messy text, PDFs, invoices, notes, CSVs, or screenshots.
- Summarization, classification, normalization, enrichment, or generation.
- Turning user-provided or API-provided data into a deterministic JSON structure.
- AI-heavy work that should be versioned, tested, and observed outside the chat flow.

Do not use a Task Agent for simple API calls, deterministic transformations, direct CRUD, routing, or logic that should live in normal TypeScript.

## Agent Studio Task Agent Setup

Task Agents can only be created or edited in the Foldspace web app, not by this plugin or local code. Use Agent Studio under Actions -> Task Agents -> Create New

The plugin can plan the Task Agent, draft the instructions and output schema, and wire `runTask()` after the user creates or confirms the Task Agent in the web app.

Capture these fields during planning:

- Enabled state: only enabled Task Agents can be called.
- API name / `taskKey`: unique key used by code, such as `meeting.summary` or `invoice.extract_materials`.
- Description: short internal explanation for the team.
- Instructions: clear guidance for the one-time LLM task.
- Output schema: prefer JSON when the action handler needs structured output.
- Published/tested version: confirm the Task Agent version used by the extension is live or intentionally staged.
- Creation status: already exists / user must create in web app / blocked.

## Web App Handoff

If the Task Agent does not exist yet, stop before implementation and give the user a copy-ready web app handoff:

- Task Agent name and API name / `taskKey`.
- Description.
- Instructions.
- Output schema.
- Test input.
- Expected output.
- Whether it should be enabled and published for the extension.

After the user creates or confirms the Task Agent in the Foldspace web app, continue with implementation using the provided `taskKey`.

## Runtime API

Call Task Agents through the SDK agent instance:

```javascript
const result = await foldspace.agent('AGENT-API-NAME').runTask({
  taskKey: 'TASK-KEY',
  data: { input: 'value' },
  cacheOptions: {
    bypass: true,
    ttlSeconds: 0
  }
});
```

Parameters:

- `taskKey`: required Task Agent API name.
- `data`: required string or object input payload.
- `cacheOptions`: optional; choose deliberately for extension freshness.
- `streamOptions`: optional; only for TEXT response Task Agents.

## Cache Decisions

Default cache behavior can be useful for stable data but surprising in extensions. During action planning, choose one:

- Fresh sandbox data: `{ bypass: true, ttlSeconds: 0 }`.
- Allow cached stable extraction: set a short `ttlSeconds`.
- Default behavior: okay only when repeated outputs are expected.

## Streaming Decisions

Streaming is only supported for TEXT response Task Agents, not JSON response Task Agents.

Use streaming when the user should see incremental text progress. Avoid streaming when the handler needs structured JSON before continuing.

If streaming is used, plan for:

- `onStart` to store `abortStreamTask`.
- `onMessage` to update UI progressively.
- `onComplete` to clean up.
- `onError` to show a recoverable failure.
- User-facing stop/cancel behavior for long tasks.

## Plan Checklist

When an action may use a Task Agent, the `foldspace-build-action` plan must include:

- Why Task Agent is needed instead of deterministic code.
- Task Agent API name / `taskKey`.
- Whether the Task Agent already exists in the Foldspace web app or must be created by the user.
- Task Agent instructions summary.
- Input data passed to `runTask()` and where it comes from.
- Output type: TEXT or JSON.
- Output schema or expected shape.
- Cache policy.
- Streaming policy.
- Error handling and fallback behavior.
- Whether the task result should be returned to the LLM, rendered in a Chatterblock, or used to call a customer API.

## Safety

Never send secrets, auth tokens, raw cookies, unnecessary PII, or private customer data to a Task Agent. Minimize inputs to exactly what the Task Agent needs.
