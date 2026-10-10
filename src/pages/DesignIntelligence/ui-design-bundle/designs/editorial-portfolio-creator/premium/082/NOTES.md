# Writing resume hybrid — Compact Single-Task

- **ID:** `premium-editorial-portfolio-creator-082`
- **Category:** editorial-portfolio-creator (Editorial, blogs, portfolios, creator pages and publishing)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** single-task — single-task focused flow with one dominant action per screen
- **Density:** compact | **Tone:** efficient

## Design rationale
Writing resume hybrid for editorial, blogs, portfolios, creator pages and publishing, expressed as a single-task focused flow with one dominant action per screen in the "Compact" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
