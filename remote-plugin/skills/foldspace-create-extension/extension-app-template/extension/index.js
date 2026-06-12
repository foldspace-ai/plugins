const LOAD_LOCALLY = true; // Set to true to load actions from localhost:3007
const SDK_URL = "https://script.eucerahive.io/web/sdk/foldspace.js";
const NAMESPACE = "foldspace";
const PRODUCT_ID = "PRODUCT_ID";
const AGENT_API_NAME = "AGENT_API_NAME";
const REMOTE_ACTIONS_ENV = "PROD";

function getRemoteActionsEnv() {
  return REMOTE_ACTIONS_ENV;
}

async function getUserProfile() {
  /*
    TODO: Replace this stub with actual logic to fetch and return the current user's profile. 
    The returned object should follow this structure:
    {
      user: {
        id: "user_id",            // Unique user identifier
        email: "user@example.com",// User's email address
        name: "John Doe",         // User's full name
        subscriptionId: "subscription_id", // Associated subscription/org ID
      },
      subscription: {
        id: "subscription_id",    // Subscription/org ID
      },
    }
  */
  return null;
}

function loadRemoteActionsLocally() {
  const src = "http://localhost:3007/dist/index.js";
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
  script.onload = () => {
    console.log("Remote actions loaded");
    const actions = window.__FOLDSPACE_REMOTE_ACTIONS__;
    const agent = window.__FOLDSPACE_AGENT__;
    delete window.__FOLDSPACE_REMOTE_ACTIONS__;
    agent.addActionHandlers(actions);
  };
  script.onerror = () => {
    window.addEventListener(
      "message",
      (event) => {
        if (
          event.data.type === "INJECT_FOLDSPACE_REMOTE_ACTIONS_RESPONSE" &&
          event.data.ok
        ) {
          const actions = window.__FOLDSPACE_REMOTE_ACTIONS__;
          const agent = window.__FOLDSPACE_AGENT__;
          delete window.__FOLDSPACE_REMOTE_ACTIONS__;
          agent.addActionHandlers(actions);
        }
      },
      { once: true },
    );
    window.postMessage(
      {
        type: "INJECT_FOLDSPACE_REMOTE_ACTIONS",
        src: src,
      },
      "*",
    );
    console.error(
      "Failed to load remote actions locally, falling back to background fetch",
    );
  };
}

function initFoldspaceSDK() {
  (function (w, d, u, n, k, c) {
    w[n] =
      w[n] ||
      function () {
        (w[n].q = w[n].q || []).push(arguments);
      };
    w.__FOLD_SPACE__ = n;
    w[n].k = k;
    w[n].c = c;
    var s = d.createElement("script");
    s.async = true;
    s.src = u + "?k=" + k;
    var h = d.getElementsByTagName("script")[0];
    h.parentNode?.insertBefore(s, h);
  })(window, document, SDK_URL, NAMESPACE, `EU-${PRODUCT_ID}-1-1`);
}

function init() {
  const win = window;
  win.foldspace("when", "ready", async () => {
    const userContext = await getUserProfile();
    if (userContext) {
      win.foldspace.identify(userContext);
    }

    const configuration = { enableDebugLogs: true };

    if (!LOAD_LOCALLY) {
      const remoteEnv = getRemoteActionsEnv();
      configuration.remoteActionsSettings = {
        enabled: true,
        environment: remoteEnv,
      };
      console.log(`Remote actions enabled (${remoteEnv})`);
    } else {
      console.log("Loading actions locally from localhost:3007");
    }

    const agent = win.foldspace.agent({
      apiName: AGENT_API_NAME,
      configuration,
    });

    win.__FOLDSPACE_AGENT__ = agent;

    agent.show();
    agent.on("*", (e) => {
      if (e.eventName === "agent.ready" && LOAD_LOCALLY) {
        loadRemoteActionsLocally();
      }
      console.log(e);
    });
  });
}

initFoldspaceSDK();
init();
