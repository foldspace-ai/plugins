// This file is the entry point for remote action handlers.
// Create one file per action, then register each handler object here.
// Handler values must be objects with an execute function; do not register bare async functions.

type RemoteActionHandler = {
  execute: (params: unknown) => Promise<unknown> | unknown;
  awaitUserInput?: boolean;
  render?: (
    params: unknown,
    host: unknown,
    header: unknown,
    callback: (value: unknown) => void,
    cancel: () => void,
  ) => Promise<void> | void;
};

const actions: Record<string, RemoteActionHandler> = {
  // example_action_key: {
  //   execute: async (params) => {
  //     return {
  //       success: true,
  //       message: "Done",
  //     };
  //   },
  // },
};
(window as any).__FOLDSPACE_REMOTE_ACTIONS__ = actions;
