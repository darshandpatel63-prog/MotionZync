# Accessibility notes

Covered by construction and enforced by the validator:
- Semantic landmarks (`nav`, `main`, `table`, `article`, labelled `aside`/`section`).
- Every input has an associated `<label>`; icon-only controls carry `aria-label`.
- Visible focus indicators (`:focus-visible` with `--mz-focus`) in all 3,600 stylesheets.
- Status never relies on color alone (text badges + color).
- Touch targets ≥ 2.5rem; responsive collapse below 48rem.
- `prefers-reduced-motion: reduce` disables transitions/animations in every stylesheet.

Known gaps (do not overstate conformance): sample copy has not been screen-reader tested
end-to-end; canvas-first designs provide keyboard hints but full spatial keyboard navigation
is integrator work; no formal WCAG audit has been performed.
