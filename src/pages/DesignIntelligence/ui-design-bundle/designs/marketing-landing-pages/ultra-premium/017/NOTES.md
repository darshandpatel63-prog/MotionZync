# Feature comparison narrative — Focus-mode Advanced

- **ID:** `ultra-marketing-landing-pages-017`
- **Category:** marketing-landing-pages (Marketing websites, product launches, SaaS landing pages and conversion pages)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** card-grid — responsive card grid with filter rail and comparison affordances
- **Density:** compact | **Tone:** minimal

## Design rationale
Feature comparison narrative for marketing websites, product launches, saas landing pages and conversion pages, expressed as a responsive card grid with filter rail and comparison affordances in the "Focus-mode" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
