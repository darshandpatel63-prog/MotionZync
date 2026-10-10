# Inbox triage workspace — Compact Multi-Monitor

- **ID:** `premium-saas-admin-workspaces-062`
- **Category:** saas-admin-workspaces (SaaS applications, admin panels, team workspaces, CRM/project tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** command-center — multi-monitor style command center with status wall and alert stream
- **Density:** compact | **Tone:** efficient

## Design rationale
Inbox triage workspace for saas applications, admin panels, team workspaces, crm/project tools, expressed as a multi-monitor style command center with status wall and alert stream in the "Compact" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
