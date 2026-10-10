# Order tracking timeline — Alert-first Advanced

- **ID:** `ultra-ecommerce-marketplaces-054`
- **Category:** ecommerce-marketplaces (Ecommerce, storefronts, product detail, catalog, checkout and marketplaces)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** split-pane — master-detail split pane with resizable list and detail surface
- **Density:** default | **Tone:** operational

## Design rationale
Order tracking timeline for ecommerce, storefronts, product detail, catalog, checkout and marketplaces, expressed as a master-detail split pane with resizable list and detail surface in the "Alert-first" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
