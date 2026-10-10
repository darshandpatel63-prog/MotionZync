# Billing and plan console — Focus-mode Tabbed

- **ID:** `premium-saas-admin-workspaces-047`
- **Category:** saas-admin-workspaces (SaaS applications, admin panels, team workspaces, CRM/project tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** tabbed-workspace — tabbed multi-view workspace with persistent context header
- **Density:** compact | **Tone:** minimal

## Design rationale
Billing and plan console for saas applications, admin panels, team workspaces, crm/project tools, expressed as a tabbed multi-view workspace with persistent context header in the "Focus-mode" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
