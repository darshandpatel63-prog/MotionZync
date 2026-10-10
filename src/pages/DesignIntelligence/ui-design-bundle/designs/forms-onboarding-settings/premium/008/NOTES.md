# Multi-step signup wizard — Collaborative Asymmetric

- **ID:** `premium-forms-onboarding-settings-008`
- **Category:** forms-onboarding-settings (Forms, multi-step onboarding, account/profile/settings, validation and workflow forms)
- **Tier:** Premium (library access label only — no entitlements in this bundle)
- **Layout family:** bento-modular — asymmetric bento grid of independently sized content modules
- **Density:** default | **Tone:** social

## Design rationale
Multi-step signup wizard for forms, multi-step onboarding, account/profile/settings, validation and workflow forms, expressed as a asymmetric bento grid of independently sized content modules in the "Collaborative" variant. Production-minded composition with strong hierarchy, accessible controls and coherent token usage.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
