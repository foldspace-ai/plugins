# Navigation

Read this **before creating a route**. Routes look like config and are not.

## It is an implicit native action

Navigation is a platform built-in. You register no handler and write no code —
the agent can offer to take the user somewhere as soon as routes exist. Grepping
a client repo for navigation code and finding nothing is correct.

A **navigation agent** chooses the route. Routes are not string-matched against
the user's words.

## The description is the retrieval surface

Route descriptions go into a **RAG index and a search runs automatically**
against the user's intent. The description is the only thing deciding whether a
route is ever offered.

> **Write what the page is FOR, not where it sits.**
>
> ✗ "All files inside one project." — an information architecture. Nobody
> phrases an intent that way, so it retrieves against nothing.
>
> ✓ "Where a team keeps the work for one project — use when someone wants to
> find, open or share the designs for a specific initiative, or check what a
> project contains before a review."

Name the page's **jobs and use cases**. Aliases help at the margin; the
description carries the retrieval.

## Every dynamic parameter needs a lookup action

`/design/{fileKey}/{fileName}` is only reachable if something can produce a
`fileKey`. The navigation agent does not invent one.

**Pair them or ship neither.** A parameterised route without its lookup action
appears in the route list, reads as working capability, and can never fire.

The lookup action should return, per result, the identifier, the URL-ready slug,
**and which route that result belongs to** — so a board is not opened as a
design file.

## Parameter values may not come from an API

Apps do not reliably follow a guessable path convention, and the value you need
may not be exposed by any endpoint. It may live in:

- the current URL, when the user is already in context
- a **cookie or session store**
- client-side state the app never sends anywhere

Discover where it actually lives by watching the app, not by assuming REST.

## Publishing

**Navigation is a published module, and the MCP has no publish tool.**
`get_navigation_route` returns only `isActive` — publish state is not observable
over the API, so an unpublished active route looks identical to a working one.
Publish in Agent Studio and tell the customer you did.

## Checklist

1. Can you state the page's **jobs**, in the user's words? That is the description.
2. Dynamic parameters? Name the lookup action and build it in the same pass.
3. Have you **seen the real URL**, with real values, in the running app? A route
   inferred from a sibling's shape is a guess (gate 6).
4. Would a user ever want to be sent here? Routes nobody asks for add retrieval noise.
