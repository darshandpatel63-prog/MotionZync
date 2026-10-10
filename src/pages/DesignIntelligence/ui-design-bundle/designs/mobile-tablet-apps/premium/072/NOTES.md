# Music mini player — Compact Mobile-First

- **ID:** `premium-mobile-tablet-apps-072`
- **Category:** mobile-tablet-apps (Mobile-first Android/iOS and tablet app interfaces, touch-oriented navigation)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** bottom-nav-touch — mobile-first bottom tab bar with thumb-reach primary actions
- **Density:** compact | **Tone:** efficient

## Design rationale
Music mini player for mobile-first android/ios and tablet app interfaces, touch-oriented navigation, expressed as a mobile-first bottom tab bar with thumb-reach primary actions in the "Compact" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
