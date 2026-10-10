# SLO burn-down board — Collaborative Immersive

- **ID:** `premium-data-viz-monitoring-068`
- **Category:** data-viz-monitoring (Charts, observability, monitoring, scientific/data exploration and visual analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** immersive-stage — immersive full-viewport stage with overlay controls and scene panel
- **Density:** default | **Tone:** social

## Design rationale
SLO burn-down board for charts, observability, monitoring, scientific/data exploration and visual analytics, expressed as a immersive full-viewport stage with overlay controls and scene panel in the "Collaborative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
