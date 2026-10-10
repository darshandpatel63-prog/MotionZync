# Lab results explorer — Alert-first Vertical

- **ID:** `premium-healthcare-wellness-054`
- **Category:** healthcare-wellness (Healthcare, appointments, wellness, clinic and patient-facing interfaces)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** timeline-first — vertical or horizontal timeline spine with anchored event cards
- **Density:** default | **Tone:** operational

## Design rationale
Lab results explorer for healthcare, appointments, wellness, clinic and patient-facing interfaces, expressed as a vertical or horizontal timeline spine with anchored event cards in the "Alert-first" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
