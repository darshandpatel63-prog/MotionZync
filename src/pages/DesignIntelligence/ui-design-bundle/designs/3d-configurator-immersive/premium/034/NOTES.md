# Jewelry material viewer — Alert-first Full-Bleed

- **ID:** `premium-3d-configurator-immersive-034`
- **Category:** 3d-configurator-immersive (Product configurators, 3D/immersive web interfaces, scene controls, spatial content)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** canvas-first — full-bleed canvas/graph surface with floating tool panels
- **Density:** default | **Tone:** operational

## Design rationale
Jewelry material viewer for product configurators, 3d/immersive web interfaces, scene controls, spatial content, expressed as a full-bleed canvas/graph surface with floating tool panels in the "Alert-first" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
