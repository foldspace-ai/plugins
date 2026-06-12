chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== "object") return;

  if (message.type === "INJECT_FOLDSPACE_REMOTE_ACTIONS") {
    (async () => {
      try {
        const resp = await fetch(message.src);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const code = await resp.text();
        await chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          world: "MAIN",
          func: (scriptCode) => {
            if (window.__foldspaceAgentLoaded) return;
            window.__foldspaceAgentLoaded = true;
            (0, eval)(scriptCode);
          },
          args: [code],
        });
        sendResponse({ ok: true });
      } catch (err) {
        console.error("Agent injection failed:", err);
        sendResponse({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
    return true;
  }
});
