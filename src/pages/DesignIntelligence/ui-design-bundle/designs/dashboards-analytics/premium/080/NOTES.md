# Experiment results lab — Narrative Master-Detail

- **ID:** `premium-dashboards-analytics-080`
- **Category:** dashboards-analytics (Dashboards and business/product analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** split-pane — master-detail split pane with resizable list and detail surface
- **Density:** roomy | **Tone:** editorial

## Design rationale
Experiment results lab for dashboards and business/product analytics, expressed as a master-detail split pane with resizable list and detail surface in the "Narrative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
