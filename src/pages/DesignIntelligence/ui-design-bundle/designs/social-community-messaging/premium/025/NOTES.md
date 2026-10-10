# Member profile page — Compare Immersive

- **ID:** `premium-social-community-messaging-025`
- **Category:** social-community-messaging (Communities, profiles, feeds, messaging, groups and collaboration)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** immersive-stage — immersive full-viewport stage with overlay controls and scene panel
- **Density:** default | **Tone:** analytical

## Design rationale
Member profile page for communities, profiles, feeds, messaging, groups and collaboration, expressed as a immersive full-viewport stage with overlay controls and scene panel in the "Compare" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
