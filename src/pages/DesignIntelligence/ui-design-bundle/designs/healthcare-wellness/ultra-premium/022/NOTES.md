# Medication schedule tracker — Compact Advanced

- **ID:** `ultra-healthcare-wellness-022`
- **Category:** healthcare-wellness (Healthcare, appointments, wellness, clinic and patient-facing interfaces)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** bottom-nav-touch — mobile-first bottom tab bar with thumb-reach primary actions
- **Density:** compact | **Tone:** efficient

## Design rationale
Medication schedule tracker for healthcare, appointments, wellness, clinic and patient-facing interfaces, expressed as a mobile-first bottom tab bar with thumb-reach primary actions in the "Compact" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
