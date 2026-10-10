# Flashcard review session — Empty-state Advanced

- **ID:** `ultra-education-learning-076`
- **Category:** education-learning (Learning platforms, student dashboards, courses, assessments and education tools)
- **Tier:** Ultra Premium+ (library access label only — no entitlements in this bundle)
- **Layout family:** topbar-flow — top navigation bar with horizontal step/section flow
- **Density:** roomy | **Tone:** onboarding

## Design rationale
Flashcard review session for learning platforms, student dashboards, courses, assessments and education tools, expressed as a top navigation bar with horizontal step/section flow in the "Empty-state" variant. Advanced information architecture: layered panels, refined interaction states, configurable density and purposeful, reduced-motion-aware choreography.

## Responsive behavior
Fluid CSS grid; below 48rem the composition collapses to a single column, split panes stack, topbar nav links collapse behind the menu button. Touch targets are ≥ 2.5rem.

## Accessibility notes
Semantic landmarks (nav/main/table/article), labelled controls, visible focus rings via `--mz-focus`, status shown with text plus color, reduced-motion media query disables all transitions. Sample data is fictional.

## Preview
Import `Design.jsx` from this folder with `design.css` inside the shared preview shell (`shared/preview-shell`). Pick any of the three required themes via the shell's theme switcher.
