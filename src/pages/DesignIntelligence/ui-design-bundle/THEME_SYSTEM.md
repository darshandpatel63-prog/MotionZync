# Theme system

Four semantic token sets: `light`, `dark`, `colorful`, `high-contrast`.
Every design must render under `light`, `dark`, and `colorful` (validator-enforced via the
manifest); `high-contrast` is available bundle-wide through the same tokens.

Tokens (`--mz-surface`, `--mz-surface-alt`, `--mz-surface-raised`, `--mz-text`,
`--mz-text-muted`, `--mz-border`, `--mz-accent`, `--mz-accent-soft`, `--mz-on-accent`,
`--mz-focus`, `--mz-success`, `--mz-warning`, `--mz-warning-soft`, `--mz-info`,
`--mz-gridline`, type scale) are defined in `themes/*.json` and `shared/tokens.css`.

Switching themes must not change layout, hierarchy, or affordances — only color. Components
never hard-code text colors against assumed backgrounds.
