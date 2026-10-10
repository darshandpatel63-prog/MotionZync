# Payment method vault — Expanded Top

- **ID:** `premium-forms-onboarding-settings-023`
- **Category:** forms-onboarding-settings (Forms, multi-step onboarding, account/profile/settings, validation and workflow forms)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** topbar-flow — top navigation bar with horizontal step/section flow
- **Density:** roomy | **Tone:** spacious

## Design rationale
Payment method vault for forms, multi-step onboarding, account/profile/settings, validation and workflow forms, expressed as a top navigation bar with horizontal step/section flow in the "Expanded" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
