# Recurring bills calendar — Data-dense Advanced

- **ID:** `ultra-finance-fintech-069`
- **Category:** finance-fintech (Finance, budgeting, banking, invoicing and fintech interfaces)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** command-center — multi-monitor style command center with status wall and alert stream
- **Density:** compact | **Tone:** analytical

## Design rationale
Recurring bills calendar for finance, budgeting, banking, invoicing and fintech interfaces, expressed as a multi-monitor style command center with status wall and alert stream in the "Data-dense" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
