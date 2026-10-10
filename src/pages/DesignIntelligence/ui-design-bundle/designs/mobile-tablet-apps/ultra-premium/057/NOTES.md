# Mobile banking summary — Focus-mode Advanced

- **ID:** `ultra-mobile-tablet-apps-057`
- **Category:** mobile-tablet-apps (Mobile-first Android/iOS and tablet app interfaces, touch-oriented navigation)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** editorial-column — single wide editorial column with pull-quotes and reading rhythm
- **Density:** compact | **Tone:** minimal

## Design rationale
Mobile banking summary for mobile-first android/ios and tablet app interfaces, touch-oriented navigation, expressed as a single wide editorial column with pull-quotes and reading rhythm in the "Focus-mode" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
