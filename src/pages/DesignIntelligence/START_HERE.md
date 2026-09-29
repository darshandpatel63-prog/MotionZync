# MotionZync — Design Intelligence START HERE

This folder contains the Design Intelligence + UI Generation feature only.

## Mandatory first-read order for every new chat
1. START_HERE.md
2. handover.md
3. MotionZync_Design_Intelligence_Master_Prompt_README.md
4. CHATGPT_PROJECT_COMMON_INSTRUCTIONS.md
5. Inspect every current file inside src/pages/DesignIntelligence/
6. Inspect only the minimum integration files named by handover.md
7. Resume from FIRST UNFINISHED TASK in handover.md

## Absolute rules
- Work only on feature/design-intelligence.
- Never work on or merge to main unless explicitly requested.
- Never rewrite, remove or “clean up” unrelated MotionZync code.
- Existing MotionZync behaviour is protected.
- Prefer additive, minimum-scope integration.
- Keep one canonical Design Intelligence data core.
- Do not fabricate 1,000+/10,000+ records.
- Never claim a build/test/live result that was not actually verified.
- Update handover.md after every meaningful milestone.

## Current implementation
Phase 1 foundation is implemented; current Phase A engine/system progress is 88%:
- multipage route family under /design-intelligence/*
- internal navigation
- structured seed catalog
- deterministic search
- entitlement-aware deterministic recipe generation
- canonical recipe relationship layer
- relationship-aware deterministic selection
- canonical recipe compatibility result
- optional AI-assisted refinement through the existing BYOK provider bridge
- visual preview
- design-token output
- Free/Premium/Ultra Premium+ access taxonomy
- Google-login entry using existing MotionZync AuthContext
- in-product workflow/help documentation
- continuation/common-instruction files

## FIRST UNFINISHED TASK
1. Complete authenticated production browser/visual/interactivity verification of all 7 Design Intelligence routes.
2. Complete manual accessibility/responsive audit, including screen-reader/device checks; automated serious/critical axe gate is now verified in CI.
3. Verify real BYOK provider execution, provider-specific CORS behavior and model compatibility.
4. Continue Phase A publication workflow and deeper compatibility foundation.
5. Implement provider-specific payment webhook signature verification and connect the selected gateway before exposing paid checkout.
6. Add server-authoritative protected Design Intelligence entitlement/API-key issuance, rotation and revocation.
7. Do not begin the 1,000+/10,000+ content expansion yet.

## Existing AI / API-key integration context

MotionZync already has a reusable BYOK AI system and encrypted local API-key vault. Design Intelligence must reuse it; do not create a second provider/vault system.

Relevant existing files:
- src/ai/providers/AIProviderContext.jsx
- src/ai/providers/keyVault.js
- src/ai/providers/VaultContext.jsx
- src/ai/settings/APIKeyManager.jsx

Target flow:
User prompt → Design Intelligence core → Design Recipe/constraints → existing selected AI provider/model → provider API → generated result → Design Intelligence validation/preview/export.

AI-assisted generation is optional. Deterministic Design Intelligence must remain usable without an external AI key.

Current status: **IMPLEMENTED / UNVERIFIED** for the end-to-end connection. DesignIntelligenceGenerator now calls the existing `useAI()` / `generateText()` bridge; real provider execution, CORS/model compatibility and browser verification remain unverified.


## 2026-09-29 — Automated accessibility audit foundation

### IMPLEMENTED
- Design Intelligence CI browser verification now includes an axe-core audit on each of the 7 Design Intelligence routes.
- The CI gate fails on **serious/critical** accessibility violations while keeping lower-severity findings visible for follow-up.
- This audit is CI-only and does not add a runtime production dependency.

### VERIFIED
- The corrected axe audit CI execution completed successfully (GitHub Actions run 36545680689).
- The audit reported zero serious/critical violations inside `.di-shell`.
- Existing seven-route browser smoke, responsive checks, focus-visible checks and Admin DI Billing checks also passed in that run.

### UNVERIFIED
- Full screen-reader/device testing remains unverified.



### CI correction
- The first axe-audit attempt exposed a CI-only dependency pruning issue; Playwright and axe are now installed together in one CI step.
- Status: **VERIFIED** by GitHub Actions run 36545680689.



### Axe runner correction
- The accessibility runner now creates a Playwright browser context before constructing the page required by axe-core.
- Status: **VERIFIED** by GitHub Actions run 36545680689.


### Accessibility audit scope correction
- The CI axe gate is intentionally scoped to `.di-shell` so existing unrelated MotionZync Navbar/Footer styling is not reclassified as a Design Intelligence regression.
- The previously observed serious `color-contrast` findings were outside the DI shell.
- Status: **VERIFIED** by GitHub Actions run 36545680689.


## 2026-09-29 — Cashfree webhook verification foundation

### IMPLEMENTED
- Added a server-side Cashfree webhook verification foundation.
- Signed webhook requests are verified from the raw request body with `x-webhook-signature` + `x-webhook-timestamp`.
- Cashfree order/payment status is checked server-side before a verified payment can be recorded.
- Premium permanent is currently constrained to the finalized INR 500 server-authorized order contract; Ultra Premium+ checkout remains disabled until its price is finalized.

### VERIFIED
- New Cashfree helper/webhook source passed Node syntax checking in an isolated local verification step.
- Synthetic HMAC verification accepted a valid signature and rejected a forged signature.
- No paid checkout, fake Premium key, second database or client-side payment secret was added.

### UNVERIFIED
- Current Vercel deployment for this code is still BUILDING.
- Real Cashfree sandbox/production credentials and transactions.
- Real webhook delivery/retry/refund lifecycle.
- Authenticated production browser verification, manual device/screen-reader audit and real BYOK provider execution remain unverified.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**
