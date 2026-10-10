# Marketing attribution board — Compare Fixed

- **ID:** `premium-dashboards-analytics-045`
- **Category:** dashboards-analytics (Dashboards and business/product analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** sidebar-command — fixed left navigation rail with dense work area
- **Density:** default | **Tone:** analytical

## Design rationale
Marketing attribution board for dashboards and business/product analytics, expressed as a fixed left navigation rail with dense work area in the "Compare" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
