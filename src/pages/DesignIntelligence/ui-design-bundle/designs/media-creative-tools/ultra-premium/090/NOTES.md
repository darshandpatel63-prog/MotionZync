# Soundboard trigger pad — Narrative Advanced

- **ID:** `ultra-media-creative-tools-090`
- **Category:** media-creative-tools (Audio/video, podcasts, timelines, media libraries and creator/production tools)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** table-first — data table as primary surface with toolbar, filters and row detail drawer
- **Density:** roomy | **Tone:** editorial

## Design rationale
Soundboard trigger pad for audio/video, podcasts, timelines, media libraries and creator/production tools, expressed as a data table as primary surface with toolbar, filters and row detail drawer in the "Narrative" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
