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
Phase 1 foundation is implemented; current Phase A engine/system progress is 89%:
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
1. Verify the latest combined Vercel deployment/build for Cashfree + API-key lifecycle + protected knowledge delivery.
2. Complete authenticated production browser/visual/interactivity verification of all 7 Design Intelligence routes once the current code is deployed.
3. Complete manual accessibility/responsive audit, including screen-reader/device checks; automated serious/critical axe gate is verified in CI.
4. Verify real BYOK provider execution, provider-specific CORS behavior and model compatibility.
5. Exercise protected knowledge with a real Firebase Premium/Ultra entitlement and verify that unauthenticated/free requests do not receive protected records.
6. Run a real Cashfree sandbox order/webhook/payment-status test after merchant credentials are configured.
7. Integrate protected knowledge into Premium Explorer/Generator without shipping protected records in the public bundle.
8. Continue Phase A publication workflow and deeper compatibility foundation.
9. Do not begin the 1,000+/10,000+ content expansion yet.

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


## 2026-09-29 — Cashfree authenticated order foundation

### IMPLEMENTED
- Added a shared authenticated Firebase-user verification helper for server-side payment initiation.
- Added `api/cashfree-create-order.js`.
- The endpoint derives the Firebase UID/email from the verified ID token and does not accept a client-supplied entitlement identity.
- The paid amount is server-authorized at **₹500 INR for Premium permanent**; the browser cannot change the amount/plan.
- Customer phone is validated server-side before order creation.
- Cashfree order creation is server-side and returns only the Cashfree `payment_session_id` and non-secret order metadata to the caller.
- MotionZync-specific plan and user metadata are attached to the Cashfree order for later webhook reconciliation.
- Server-created pending orders are stored in the existing Firestore billing model; no second database is created.
- Paid checkout UI remains unexposed until merchant configuration and end-to-end gateway verification are complete.

### VERIFIED
- Current source files were re-inspected on `feature/design-intelligence`.
- Current Vercel deployments exist for the new API commits; the latest fix commit `0a048035fce7f5a316e05b1819f6a782cee8ce67` is currently queued, so the final order-flow deployment is not yet claimed READY.

### UNVERIFIED
- Local clone/build could not run because this environment could not resolve github.com; therefore no local build result is claimed for this milestone.
- Real Cashfree credentials/merchant configuration are not present in this verification.
- Real Cashfree sandbox order creation, Checkout SDK execution, webhook delivery/retry and payment-status reconciliation remain unverified.
- Production browser verification, manual device/screen-reader audit and real BYOK provider execution remain unverified.

### SECURITY / PRIVACY CHECKPOINT
- Regression: additive server/API work only; no existing DI route or unrelated UI was removed.
- Functionality: server-authoritative order contract IMPLEMENTED; runtime integration UNVERIFIED.
- Accessibility: no new public UI was exposed; manual audit remains UNVERIFIED.
- Privacy/security: Firebase identity is server-verified; Cashfree secret remains server-side; no raw payment credentials are stored.
- Performance: order creation uses one Cashfree create-order request plus one bounded Firestore write; production latency UNVERIFIED.
- Data quality: price/plan are server-authorized; no fabricated payment record is generated.
- Build/test: source review completed; local build UNVERIFIED due environment DNS restriction; Vercel latest fix currently QUEUED.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**


## 2026-09-29 — Server-authoritative API-key lifecycle foundation

### IMPLEMENTED
- Added server-side entitlement lookup from the existing Firestore `users` record.
- Added secure MotionZync API-key issue/rotate/revoke/status operations through `/api/di-api-key`.
- API secrets use high-entropy random generation; Firestore stores only a SHA-256 hash, non-secret prefix and metadata.
- Plaintext API secrets are returned only at issue/rotation time and are not recoverable from the backend later.
- Existing canonical `apiKeys` collection is reused; no second database or fake frontend key was introduced.

### VERIFIED
- Source implementation is committed on `feature/design-intelligence`.
- Existing Firebase Admin auth is reused for the protected endpoint.

### UNVERIFIED
- Latest API-key lifecycle deployment/build result.
- Real Premium entitlement + production Firestore exercise.
- Real API request authentication using a MotionZync-issued key.
- Full server-side protection of Premium knowledge/data delivery.
- Production browser, manual device/screen-reader and real BYOK verification.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**


## 2026-09-29 — Protected Design Intelligence knowledge delivery foundation

### IMPLEMENTED
- Premium/Ultra seed records were removed from the browser-shipped `catalog.js` and retained in server-only `api/_lib/di-protected-catalog.js`.
- Added `api/di-knowledge.js` for entitlement-gated server delivery using the existing Firebase Admin + Firestore entitlement model.
- Free/public records remain available without Premium.
- Protected records are returned only after valid Firebase authentication + active Premium/Ultra entitlement.
- Home/Pricing/Docs wording was synchronized so the UI does not falsely describe the new backend foundation as nonexistent.

### VERIFIED
- Source implementation exists on `feature/design-intelligence`.
- No new filler catalog records were introduced.
- No second Design Intelligence database was created.

### UNVERIFIED
- Latest Vercel deployment/build for the combined code.
- Runtime protected/unprotected endpoint behavior with real Firebase credentials/entitlements.
- Protected Explorer/Generator client integration.
- Real payment, API-key usage, BYOK and manual device/screen-reader verification.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**


## 2026-09-29 — Protected knowledge integrated into Explorer + Generator

### IMPLEMENTED
- Explorer and Generator now consume the entitlement-scoped `/api/di-knowledge` service.
- Premium/Ultra records remain server-only until an entitled response is received.
- Deterministic engine supports runtime catalog overrides while keeping the public/free catalog as its default.
- AI refinement receives only the currently allowed catalog IDs.
- No fake or filler records were added.

### VERIFIED
- Source integration is present on `feature/design-intelligence`.
- Premium/Ultra records remain absent from public client `catalog.js`.

### UNVERIFIED
- Latest Vercel deployment/build for these commits.
- Real free vs Premium/Ultra API response with production Firebase entitlements.
- Current production browser verification of all 7 routes.
- Manual screen-reader/device audit, real BYOK provider execution and Cashfree E2E.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**
