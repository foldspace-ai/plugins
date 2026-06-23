# Extension Scaffold Reference

Use this reference when creating the browser extension and remote action bundle layout for a no-source-access Foldspace integration.

## Template

Copy the vendored template into a client-specific extension folder:

```text
extension-app-template/
```

Keep the shared runtime files close to the template unless the extension runtime itself needs to change:

- `extension/contentScript.js`
- `extension/background.js`
- `extension/index.js`

Customize per client:

- `extension/manifest.json`: MV3 manifest with scoped `matches` and `host_permissions`.
- `extension/csp_rules.json`: CSP relaxations scoped to approved hosts only.
- `extension/index.js`: SDK URL, product key, product ID, Agent API Name, and local/hosted action loading mode.
- `agent/constants.ts`: product ID, Agent API Name, target hosts, API hosts, and storage keys.
- `agent/actions/`: remote action handlers whose keys match Foldspace action schemas.
- `agent/api/`: shared API helpers discovered from live-site evidence.
- `agent/utils.ts`: auth extraction, safe fetch helpers, navigation, Shared State, event listeners, and messaging helpers.

## SDK Bootstrap

- Load the Foldspace SDK once and guard against duplicate content-script injection.
- Initialize with the exact SDK URL, `PRODUCT_KEY`, `PRODUCT_ID`, and `AGENT_API_NAME` from MCP when available, or from the Agent Studio SDK snippet when MCP is unavailable.
- Use `foldspace('when', 'ready', ...)` before calling agent APIs.
- Decide whether actions load locally during development or from hosted remote actions.
- Make local development bundle loading explicit and easy to disable for packaged extensions.

## Safety Defaults

- Scope `matches`, `host_permissions`, and CSP rules to sandbox/client domains.
- Never embed credentials, bearer tokens, session cookies, private customer data, or production-only secrets.
- Redact secret values in logs.
- Put auth extraction in one auditable utility.
- Document required Foldspace service domains for allow-listing.

## Output Checklist

Return:

- File tree created or to create.
- Values still needed from MCP, Agent Studio, or DevTools.
- Extension install/test steps.
- Local-vs-hosted action loading decision.
- Any page awareness, Shared State, Messaging API, Event API, or Task Agent needs.
- Next step: usually `foldspace-observe-flow-in-site` for one action candidate.
