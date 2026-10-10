# Shared primitives

Designs in this bundle compose from semantic tokens (`../tokens.css`) and a small set of
CSS class primitives already embedded per design (`mz-btn`, `mz-input`, `mz-card`, `mz-badge`,
`mz-chip`, `mz-table`, `mz-row`, `mz-avatar`). Each design scopes its styles under its own
`mz-<id>` namespace so nothing leaks across designs or into a host app. No global resets.
