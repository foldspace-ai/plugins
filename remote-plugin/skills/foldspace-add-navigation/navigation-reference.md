# Navigation Reference

Use this focused reference when configuring Foldspace navigation labels.

## Navigation Labels

Navigation labels are defined and published in Agent Studio or through Foldspace MCP. The navigation runtime is provided automatically, so this skill should focus on labels, route patterns, continuation context, and browser verification rather than writing handlers.

Good labels are stable, user-facing destinations:

- `projects`: opens the projects list.
- `project_detail`: opens a specific project by project ID.
- `settings_billing`: opens billing settings.

Avoid labels tied to one-off object IDs, brittle DOM text, or account-specific menu names.