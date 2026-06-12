# Foldspace Action Error Handling

Every `execute` function must return clear, safe data for the LLM agent. The
agent needs enough information to recover, retry, or ask the user for a better
input, but it must not receive internal implementation details.

## Requirements

- Wrap the whole `execute` body in `try/catch`.
- Validate required params before network calls or mutations.
- Check HTTP response status codes explicitly.
- Return structured success and failure objects.
- Do not expose stack traces, internal URLs, database errors, auth tokens, or
  server internals.
- Keep error messages user-actionable when possible.

## Pattern

```javascript
execute: async (params) => {
  try {
    if (!params.requiredField) {
      return {
        success: false,
        error: "Missing required field: requiredField",
      };
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      return {
        success: false,
        error: `Operation failed (status ${response.status}). Please try again.`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...relevantFields,
    };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
```

## Review Checklist

- Params match the Foldspace action schema.
- Required params are checked before use.
- Network failures become safe LLM-facing errors.
- The success return includes only data the agent needs.
- The failure return gives the agent a clear next step when possible.
