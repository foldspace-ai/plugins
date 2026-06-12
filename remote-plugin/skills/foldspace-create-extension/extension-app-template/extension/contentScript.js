// Remove CSP meta tags that block external scripts (declarativeNetRequest only strips HTTP headers)
new MutationObserver((mutations, observer) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (
        node.tagName === "META" &&
        node.httpEquiv &&
        node.httpEquiv.toLowerCase() === "content-security-policy"
      ) {
        node.remove();
      }
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

const init = async () => {
  try {
    window.addEventListener("message", (event) => {
      if (event.data.type === "INJECT_FOLDSPACE_REMOTE_ACTIONS") {
        chrome.runtime.sendMessage(
          {
            type: "INJECT_FOLDSPACE_REMOTE_ACTIONS",
            src: event.data.src,
          },
          (response) => {
            window.postMessage(
              {
                type: "INJECT_FOLDSPACE_REMOTE_ACTIONS_RESPONSE",
                ...response,
              },
              "*",
            );
          },
        );
      }
    });

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("index.js");
    script.type = "text/javascript";
    script.async = true;
    (document.head || document.documentElement).appendChild(script);
  } catch (error) {
    console.error("Initialization failed:", error);
  }
};

if (document.body) {
  init();
} else {
  new MutationObserver((_, obs) => {
    if (document.body) {
      obs.disconnect();
      init();
    }
  }).observe(document.documentElement, { childList: true });
}
