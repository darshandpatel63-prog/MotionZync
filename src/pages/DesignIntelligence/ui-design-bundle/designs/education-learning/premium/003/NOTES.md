# Course catalog explorer — Expanded Fixed

- **ID:** `premium-education-learning-003`
- **Category:** education-learning (Learning platforms, student dashboards, courses, assessments and education tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** sidebar-command — fixed left navigation rail with dense work area
- **Density:** roomy | **Tone:** spacious

## Design rationale
Course catalog explorer for learning platforms, student dashboards, courses, assessments and education tools, expressed as a fixed left navigation rail with dense work area in the "Expanded" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
