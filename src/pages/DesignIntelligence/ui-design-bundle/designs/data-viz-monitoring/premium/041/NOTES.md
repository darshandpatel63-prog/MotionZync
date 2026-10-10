# Experiment scatter lab — Standard Fixed

- **ID:** `premium-data-viz-monitoring-041`
- **Category:** data-viz-monitoring (Charts, observability, monitoring, scientific/data exploration and visual analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** sidebar-command — fixed left navigation rail with dense work area
- **Density:** default | **Tone:** balanced

## Design rationale
Experiment scatter lab for charts, observability, monitoring, scientific/data exploration and visual analytics, expressed as a fixed left navigation rail with dense work area in the "Standard" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
