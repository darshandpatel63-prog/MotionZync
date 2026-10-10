# Spreadsheet analysis sheet — Empty-state Master-Detail

- **ID:** `premium-desktop-productivity-036`
- **Category:** desktop-productivity (Desktop web apps, productivity, documents, files, IDE-like and creative tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** split-pane — master-detail split pane with resizable list and detail surface
- **Density:** roomy | **Tone:** onboarding

## Design rationale
Spreadsheet analysis sheet for desktop web apps, productivity, documents, files, ide-like and creative tools, expressed as a master-detail split pane with resizable list and detail surface in the "Empty-state" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
