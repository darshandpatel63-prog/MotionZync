# Community feed stream — Alert-first Advanced

- **ID:** `ultra-social-community-messaging-004`
- **Category:** social-community-messaging (Communities, profiles, feeds, messaging, groups and collaboration)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** sidebar-command — fixed left navigation rail with dense work area
- **Density:** default | **Tone:** operational

## Design rationale
Community feed stream for communities, profiles, feeds, messaging, groups and collaboration, expressed as a fixed left navigation rail with dense work area in the "Alert-first" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
