# Budget envelope planner — Narrative Top

- **ID:** `premium-finance-fintech-010`
- **Category:** finance-fintech (Finance, budgeting, banking, invoicing and fintech interfaces)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** topbar-flow — top navigation bar with horizontal step/section flow
- **Density:** roomy | **Tone:** editorial

## Design rationale
Budget envelope planner for finance, budgeting, banking, invoicing and fintech interfaces, expressed as a top navigation bar with horizontal step/section flow in the "Narrative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
