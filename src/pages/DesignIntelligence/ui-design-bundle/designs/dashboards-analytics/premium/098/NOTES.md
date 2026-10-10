# Goal tracking scorecard — Collaborative Asymmetric

- **ID:** `premium-dashboards-analytics-098`
- **Category:** dashboards-analytics (Dashboards and business/product analytics)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** bento-modular — asymmetric bento grid of independently sized content modules
- **Density:** default | **Tone:** social

## Design rationale
Goal tracking scorecard for dashboards and business/product analytics, expressed as a asymmetric bento grid of independently sized content modules in the "Collaborative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
