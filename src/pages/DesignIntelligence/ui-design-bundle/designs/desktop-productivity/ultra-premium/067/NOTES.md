# Task Gantt scheduler — Focus-mode Advanced

- **ID:** `ultra-desktop-productivity-067`
- **Category:** desktop-productivity (Desktop web apps, productivity, documents, files, IDE-like and creative tools)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** map-geo — geographic/schematic map surface with layered legend and region panels
- **Density:** compact | **Tone:** minimal

## Design rationale
Task Gantt scheduler for desktop web apps, productivity, documents, files, ide-like and creative tools, expressed as a geographic/schematic map surface with layered legend and region panels in the "Focus-mode" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
