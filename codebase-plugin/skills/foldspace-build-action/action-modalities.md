# Foldspace Action Modalities

Use this reference when deciding whether a Foldspace action should be
Text-Only, a Chatterblock, or backed by Shared State.

## Text-Only Action

Use Text-Only when the action can run in the background and the agent can
respond in chat after receiving the returned data.

Common examples:

- Invite a user.
- Create a task.
- Update a record.
- Fetch details for the agent to summarize.

```javascript
foldspace("when", "ready", () => {
  foldspace.agent("agentName").addActionHandlers({
    create_task: {
      execute: async (params) => {
        const { title, body } = params;
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify({ title, body, userId: "playground" }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        return {
          id: data.id,
          title: data.title,
          body: data.body,
          userId: data.userId,
          link: `https://jsonplaceholder.typicode.com/posts/${data.id}`,
        };
      },
    },
  });
});
```

## Chatterblock

Use a Chatterblock when the user needs to confirm, edit, or provide details
inside the chat before the action completes. `execute` runs first, then
`awaitUserInput: true` pauses the agent while `render` displays UI. Calling
`callback` returns data to the LLM and resumes the conversation.

This plugin will usually be used from inside the user's frontend codebase.
Before creating Chatterblock UI from scratch, search that frontend for existing
components, form controls, cards, modals, buttons, validation helpers, and
styling patterns that can be reused for the feature. Create a new component
only when no suitable existing component exists. When a new component is
necessary, match the frontend's framework, styling system, accessibility
conventions, and product voice.

Common examples:

- If the user needs to put a lot of information then they can put
  a bit of the needed info and then show the default information in the
  chatterblock and have them confirm everything through there
- Confirm destructive changes.
- Collect missing required fields.
- Show a preview card before saving.
- Let the user choose from multiple records.

```javascript
foldspace("when", "ready", () => {
  foldspace.agent("agentName").addActionHandlers({
    show_task: {
      execute: async (params) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.taskId}`);
        return await response.json();
      },
      awaitUserInput: true,
      render: (task, host, header, callback, cancel) => {
        const card = document.createElement("div");
        const titleInput = document.createElement("input");
        titleInput.value = task.title ?? "";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.onclick = () => {
          callback({ id: task.id, title: titleInput.value });
        };

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = cancel;

        card.append(titleInput, saveBtn, cancelBtn);
        host.appendChild(card);
      },
    },
  });
});
```

## Shared State

Use Shared State when the agent needs awareness of the current page or form, or
when the agent should update visible app state. It is usually an enhancement
after core actions work.
