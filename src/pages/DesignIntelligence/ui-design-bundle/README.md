# MotionZync Premium + Ultra Premium+ UI Design Bundle

A review-only UI design asset pack for the MotionZync Design Intelligence feature:
**3,600 distinct designs** — 18 categories × (100 Premium + 100 Ultra Premium+), each with
light / dark / colorful theme support via semantic tokens, responsive CSS, accessibility notes
and fictional sample data.

## MotionZync repository location

This source pack lives under src/pages/DesignIntelligence/ui-design-bundle/. It is an asset pack only; Explorer/Generator catalog wiring is a separate controlled integration step.

## Contents
- `manifest.json` — schema version, bundle version, theme IDs, per-category counts, full design inventory.
- `themes/` — `light`, `dark`, `colorful`, `high-contrast` semantic token sets (JSON).
- `shared/` — `tokens.css` (the same tokens as CSS custom properties), primitives notes, and a safe `preview-shell/` (no eval, no remote scripts, no dangerouslySetInnerHTML).
- `designs/<category>/<tier>/<NNN>/` — each design folder contains `Design.jsx`, `design.css`, `NOTES.md` (rationale, responsive + accessibility notes, preview instructions).
- `scripts/validate-bundle.mjs` — acceptance-gate validator (`npm run validate`).
- `scripts/build-preview.mjs` — builds `preview-index.html`, a static index of all designs.

## Previewing a design
Designs are plain React function components. In any React app:

```jsx
import PreviewShell from "./shared/preview-shell/PreviewShell";
import Design from "./designs/dashboards-analytics/premium/001/Design";
<PreviewShell title="premium-dashboards-analytics-001" theme="dark"><Design /></PreviewShell>
```

The shell sets `data-theme` and loads semantic tokens from `shared/tokens.css`.
No remote images, fonts or scripts are required.

## Tier meaning
`premium` / `ultra-premium` are library access labels only. This bundle contains **no**
entitlement logic, API keys, payment or auth wiring. MotionZync's server enforces access.

## Human review checklist (visual originality)
The automated validator checks structural fingerprints, but cannot prove visual originality.
Reviewers should spot-check per category: (1) open 3 random designs per layout family and
confirm compositions differ meaningfully; (2) confirm no design copies a recognizable
proprietary product; (3) confirm theme switching preserves hierarchy and readability;
(4) confirm sample copy is fictional; (5) confirm motion (where present) respects
prefers-reduced-motion.
