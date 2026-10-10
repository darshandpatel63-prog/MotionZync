# MotionZync integration compatibility

This bundle is an **incoming UI-design asset pack for review**. It is not a database, product,
AI provider, auth system, or entitlement system, and it wires to nothing (no Firebase,
Firestore, payment providers, API vaults, or env secrets).

For the integrator:
1. **Import without rewrite** — each design is a self-contained `Design.jsx` + `design.css`,
   scoped under `mz-<design-id>` class namespaces. Copy the folder, register the entry path.
2. **Map category/tier metadata** — `manifest.json` mirrors MotionZync's category IDs and
   Premium / Ultra Premium+ tiers, so entries map 1:1 into the canonical catalog and existing
   server-side access rules.
3. **Themes via semantic tokens** — host sets `data-theme="light|dark|colorful|high-contrast"`
   and includes `shared/tokens.css` (or maps tokens to the host design system).
4. **Safe preview** — render inside `shared/preview-shell` or any sandboxed container; the
   bundle contains no eval/remote-script/dangerouslySetInnerHTML patterns.
5. **Separation of concerns** — UI templates stay assets; knowledge database and
   subscription/entitlement decisions stay in MotionZync's canonical core.
6. **Incremental adoption** — add approved designs one folder at a time; nothing here
   changes routes or the existing npm/web/API architecture.
