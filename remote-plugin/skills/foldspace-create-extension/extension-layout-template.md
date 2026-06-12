# Extension Layout Template

Use the skill-local `extension-app-template/` folder as the source template unless the client requires a different browser target. When scaffolding a new extension, copy this folder first:

```text
foldspace-remote-plugin/skills/foldspace-create-extension/extension-app-template/
```

Then rename the copied folder for the client extension and make the client-specific edits below.

```text
<client-extension>/
├── extension/
│   ├── manifest.json
│   ├── contentScript.js
│   ├── background.js
│   ├── index.js
│   └── csp_rules.json
├── agent/
│   ├── actions/
│   │   ├── index.ts
│   │   └── <action-name>/
│   │       ├── index.ts
│   │       ├── api.ts
│   │       ├── types.ts
│   │       ├── styles.ts
│   │       └── views/
│   ├── api/
│   ├── constants.ts
│   └── utils.ts
├── scripts/
│   ├── build.ts
│   ├── buildExtension.mjs
│   └── packageExtension.mjs
└── package.json
```

## Template Boundary

For each new extension agent, customize `extension/manifest.json`,
`extension/csp_rules.json`, and the placeholder constants at the top of
`extension/index.js`. The runtime extension scripts should otherwise be copied
from the skill-local `extension-app-template/extension/` and stay the same:

- `extension/contentScript.js`: shared injector and CSP meta cleanup.
- `extension/background.js`: shared fallback loader that injects remote actions in the page's main world.
- `extension/index.js`: shared Foldspace SDK bootstrap, local/prod remote-action loading, and debug hotkeys.

Do not fork these scripts per agent just to change domains, names, permissions, or action bundle wiring. Put those per-agent values in `manifest.json`, `csp_rules.json`, the placeholder constants in `extension/index.js`, and the agent bundle config. If the runtime behavior itself needs to change, update the skill-local `extension-app-template` first and then copy the shared script changes forward.

## Required Decisions

- `TARGET_MATCHES`: Chrome extension match patterns for the sandbox site. Configure these in `extension/manifest.json`.
- `REQUEST_DOMAINS`: API hosts observed in DevTools. Keep host access scoped in `extension/manifest.json`.
- `SDK_URL`: public Foldspace SDK URL in `extension/index.js`; update it only if
  the Agent Studio snippet gives a different SDK URL.
- `PRODUCT_KEY`, `PRODUCT_ID`, and `AGENT_API_NAME`: copied or parsed from Foldspace Agent Studio.
- SDK script domain: SDK script hostname in `extension/csp_rules.json`, without
  protocol or path. Keep it aligned with `SDK_URL`.
- `REMOTE_ACTIONS_ENV`: dev/prod switch for local bundle vs hosted bundle.
- Auth source: exact cookie, localStorage key, or request header source used by the website.

## Extension Responsibilities

- Inject the Foldspace SDK on matched pages.
- Inject or load the remote actions bundle in the page's main world.
- Remove or relax blocking CSP only for the extension host when required.
- Provide a dev/prod toggle for action bundle source.
- Guard against duplicate SDK or action initialization.

## Remote Action Loading Architecture

Local development may use:

```text
extension background/service worker -> localhost action server -> inject into page
```

Production should use:

```text
hosted remote action server -> action bundle
```

Do not solve local `localhost` loading issues by permanently bundling customer
action code into the extension unless the user explicitly chooses that
architecture. The background fallback is the expected local development path
when the SaaS page blocks direct `localhost` script loading.

## Agent Bundle Responsibilities

- Register `window.__FOLDSPACE_REMOTE_ACTIONS__` as an object whose values are
  action handler objects with `execute(params)`.
- Do not register bare async functions directly as action values.
- Register `foldspace.identify()` only from stable account/session data.
- Register action handlers whose keys exactly match MCP action schemas.
- Register navigation handler and any reload/cookie continuation handlers.
- Keep API helpers centralized and action-specific UI colocated.

Text-only action registry shape:

```ts
const actions = {
  action_key: {
    execute: async (params) => {
      return {
        success: true,
        message: "Done",
      };
    },
  },
};

(window as any).__FOLDSPACE_REMOTE_ACTIONS__ = actions;
```

Chatterblock/UI action shape:

```ts
const action_key = {
  execute: async (params) => params,
  awaitUserInput: true,
  render: async (params, host, header, callback, cancel) => {
    // Render UI, then call callback with safe data or cancel when dismissed.
  },
};
```

## Local Debug Checklist

After running `npm run dev`, reloading the unpacked extension, and refreshing the
target site:

- Confirm the Foldspace agent appears.
- Ask a realistic prompt that should trigger the new action.
- Confirm the expected action callbacks reach `executed` and `finished`.
- Inspect the console for SDK registration, handler, or API errors.

Useful console checks:

```js
window.__FOLDSPACE_AGENT__
```
