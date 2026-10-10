# Quiz assessment runner — Expanded Master-Detail

- **ID:** `premium-education-learning-033`
- **Category:** education-learning (Learning platforms, student dashboards, courses, assessments and education tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** split-pane — master-detail split pane with resizable list and detail surface
- **Density:** roomy | **Tone:** spacious

## Design rationale
Quiz assessment runner for learning platforms, student dashboards, courses, assessments and education tools, expressed as a master-detail split pane with resizable list and detail surface in the "Expanded" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
