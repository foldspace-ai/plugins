# The local loop — Claude Code on a desktop

> **This reference is track-specific.** It covers the local harness: an isolated
> Chrome driven over CDP from a desktop. Everything in the playbook itself
> applies to any track; only this file assumes a browser you launched.
>
> The remote track — a hosted agent driving a Web Store extension in the user's
> own Chrome — does the same three jobs (load the bundle, run code, look at the
> result) through the extension instead. Its equivalent reference does not exist
> yet.

`@foldspace/harness` provides the tooling. The client repo provides `agent/`,
fixtures and `foldspace.dev.json`.

```bash
npm run dev      # esbuild watch → dist/index.js
npm run inject   # Chrome on an isolated profile, records the debug port
npm run attach   # injects the SDK bootstrap and the bundle over CDP
```

`attach` reads the port `inject` recorded, so the two cannot disagree.

**You are on local code when the attach log says `actions attached: N`.** There
is no dev server — the bundle is injected, not fetched — so nothing listens on a
localhost port and its absence proves nothing.

## Flags worth knowing

| Flag | Use |
|---|---|
| `--bootstrap` | the app has no Foldspace of its own, or you must override the one it has |
| `--no-test-mode` | initial setup: you *want* conversations in the dashboard |
| `--no-badge` | recording a demo |

## Things that will mislead you

- **The dev badge is a hardcoded string.** It never reads SDK state.
- **`--load-extension` does nothing in Chrome 151.** A profile launched with it
  has zero installed extensions. Use the CDP `Extensions` domain if you need one.
- **The extension is not required** for the SDK or actions to load — CDP does
  both.
- **Chrome pauses workers** when a client auto-attaches, until that client
  releases them. The harness does; a hand-rolled CDP script may not, and will
  freeze the app's workers.

## Troubleshooting

| Symptom | Cause |
|---|---|
| No `actions attached` | handler not registered in `agent/actions/index.ts` |
| Agent never appears, no error | SDK load threw at document-start; check `Runtime.exceptionThrown` first, before probing state |
| Changes not appearing | attach caches injected scripts per target — restart Chrome *and* attach |
| Action fires, nothing happens | UI rendered but never resolved; look for a swallowed error |
