# Realtime ops pulse — Narrative Responsive

- **ID:** `premium-dashboards-analytics-040`
- **Category:** dashboards-analytics (Dashboards and business/product analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** card-grid — responsive card grid with filter rail and comparison affordances
- **Density:** roomy | **Tone:** editorial

## Design rationale
Realtime ops pulse for dashboards and business/product analytics, expressed as a responsive card grid with filter rail and comparison affordances in the "Narrative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
