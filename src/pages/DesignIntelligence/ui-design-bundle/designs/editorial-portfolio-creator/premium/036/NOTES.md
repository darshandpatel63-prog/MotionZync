# Podcast show notes page — Empty-state Responsive

- **ID:** `premium-editorial-portfolio-creator-036`
- **Category:** editorial-portfolio-creator (Editorial, blogs, portfolios, creator pages and publishing)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** card-grid — responsive card grid with filter rail and comparison affordances
- **Density:** roomy | **Tone:** onboarding

## Design rationale
Podcast show notes page for editorial, blogs, portfolios, creator pages and publishing, expressed as a responsive card grid with filter rail and comparison affordances in the "Empty-state" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
