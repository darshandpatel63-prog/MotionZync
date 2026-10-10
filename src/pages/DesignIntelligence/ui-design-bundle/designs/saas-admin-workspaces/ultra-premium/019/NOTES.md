# Role and permission matrix — Data-dense Advanced

- **ID:** `ultra-saas-admin-workspaces-019`
- **Category:** saas-admin-workspaces (SaaS applications, admin panels, team workspaces, CRM/project tools)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** table-first — data table as primary surface with toolbar, filters and row detail drawer
- **Density:** compact | **Tone:** analytical

## Design rationale
Role and permission matrix for saas applications, admin panels, team workspaces, crm/project tools, expressed as a data table as primary surface with toolbar, filters and row detail drawer in the "Data-dense" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
