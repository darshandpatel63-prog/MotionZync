# Subtitle caption editor — Compare Geographic/Schematic

- **ID:** `premium-media-creative-tools-065`
- **Category:** media-creative-tools (Audio/video, podcasts, timelines, media libraries and creator/production tools)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** map-geo — geographic/schematic map surface with layered legend and region panels
- **Density:** default | **Tone:** analytical

## Design rationale
Subtitle caption editor for audio/video, podcasts, timelines, media libraries and creator/production tools, expressed as a geographic/schematic map surface with layered legend and region panels in the "Compare" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
