# Furniture AR preview — Compact Advanced

- **ID:** `ultra-3d-configurator-immersive-062`
- **Category:** 3d-configurator-immersive (Product configurators, 3D/immersive web interfaces, scene controls, spatial content)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** command-center — multi-monitor style command center with status wall and alert stream
- **Density:** compact | **Tone:** efficient

## Design rationale
Furniture AR preview for product configurators, 3d/immersive web interfaces, scene controls, spatial content, expressed as a multi-monitor style command center with status wall and alert stream in the "Compact" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
