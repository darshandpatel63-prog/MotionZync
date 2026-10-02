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
Phase 1 foundation is implemented; current Phase A engine/system progress is 96%:
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

### CURRENT COMMERCIAL PRICE
- Ultra Premium+ is currently **₹200 permanent (one-time)**. Historical ₹500 entries below describe the superseded contract and are retained only as changelog history.

## 2026-09-29 — Access contract: Free / Premium login / Ultra Premium+ API

### IMPLEMENTED
- Guest/no-login users remain on the Free tier for simple/public Design Intelligence web use.
- Google/Firebase-authenticated users now receive Premium web access at ₹0 through the server-authoritative entitlement path.
- ₹500 one-time payment is now bound to the Ultra Premium+ plan in the Cashfree order and webhook contract.
- Developer API key issue/rotate is restricted server-side to Ultra Premium+ only.
- Protected knowledge delivery is tier-scoped: Premium receives Premium records; Ultra Premium+ receives Premium + Ultra records.
- Generator AI context now passes only IDs accessible to the current entitlement tier.
- Pricing, Home, Docs and Admin Billing wording were aligned with the new access model.
- The Design Intelligence folder is now package-ready for a future npm publication through a local package.json + npm-entry.js adapter using the same canonical core.
- Special animation/effects remain an API-only Ultra Premium+ capability in the product contract; no fake effect records or frontend bypass were added.

### VERIFIED
- Source changes are committed on feature/design-intelligence.
- The public browser catalog still contains only Free records.
- The existing protected records remain server-only; no duplicate database or filler catalog was introduced.
- API-key lifecycle logic now rejects Premium-only sessions and requires Ultra Premium+.
- Cashfree order metadata and webhook validation now agree on Ultra Premium+ / ₹500.

### UNVERIFIED
- Latest Vercel deployment/build for this access-contract milestone.
- Real Firebase-authenticated Premium runtime response.
- Real paid Ultra entitlement and Cashfree transaction/webhook/payment-status lifecycle.
- Production API-key issuance/rotation/revocation using a real Ultra entitlement.
- Published npm package and external npm installation.
- Real special-animation/effects API endpoint and consumer integration.
- Full browser, screen-reader/device and BYOK provider verification.

### CHECKPOINT
- Regression: additive Design Intelligence access changes only; unrelated MotionZync features were not intentionally changed.
- Functionality: access contract IMPLEMENTED; production runtime UNVERIFIED.
- Accessibility: copy-only/access-state changes; manual audit remains UNVERIFIED.
- Privacy/security: Firebase token remains server-verified; protected records are tier-filtered server-side; API secrets remain hash-only in Firestore.
- Performance: tier filtering is bounded Phase 1 in-memory work; production profiling UNVERIFIED.
- Data quality: no fabricated 1,000+/10,000+ records; existing protected records were reused.
- Build/test: source verification completed; newest deployment/test result pending.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **96% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**

## 2026-09-29 — Access contract hardening and Knowledge route alignment

### IMPLEMENTED
- Hardened API-key status/issuance so Premium-at-₹0 users cannot obtain or enumerate active developer API keys; Ultra Premium+ is required.
- Hardened API-key record creation to accept only the Ultra Premium+ plan.
- Updated the Design Intelligence Knowledge route to consume entitlement-scoped server knowledge instead of showing only the public seed bundle.
- Current access semantics are now consistent across Pricing, Home, Docs, Explorer, Generator, Knowledge, billing, Cashfree and API-key foundations.

### VERIFIED
- Source inspection on feature/design-intelligence confirms the access checks are aligned across the touched layers.
- No protected record was reintroduced into the browser-shipped public catalog.
- No second database, fake payment, fake API key or filler record was introduced.

### UNVERIFIED
- The newest commits after the first access-contract deployment are not yet represented by a READY Vercel deployment.
- Real Premium-login and Ultra-payment runtime responses remain unverified.
- API-key use authentication, published npm installation and the actual API-only animation/effects implementation remain future/unverified.
- Full production browser, device/screen-reader and real BYOK verification remain unverified.

### CHECKPOINT
- Regression: additive access-control/knowledge-route changes only.
- Functionality: access contract hardening IMPLEMENTED; runtime UNVERIFIED.
- Accessibility: existing DI semantics retained; manual audit UNVERIFIED.
- Privacy/security: protected knowledge remains server-gated; API secrets remain hash-only; Premium cannot issue developer keys.
- Performance: bounded entitlement/catalog filtering only; production profiling UNVERIFIED.
- Data quality: no fabricated records.
- Build/test: source-level verification complete; newest deployment/build pending.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**

## 2026-09-29 — Ultra Premium+ API-key access foundation

### IMPLEMENTED
- Added server-side MotionZync API-key authentication against the existing canonical Firestore apiKeys collection.
- API-key access requires an active server-issued key plus an active Ultra Premium+ entitlement; Premium-at-₹0 cannot use the developer API.
- /api/di-knowledge now accepts either a verified Firebase ID token for web/member access or a valid Ultra Premium+ MotionZync API key for developer/npm access.
- API-key usage updates server-side lastUsedAt metadata without storing the plaintext secret.
- Pricing page now reads server entitlement, shows the current access tier, and provides issue / rotate / revoke controls for Ultra Premium+ users.
- Newly issued/rotated plaintext API secrets are shown only in the current UI state and are not persisted by the client.
- NPM entry can use the same canonical knowledge API by passing the server-issued MotionZync API key as its bearer token.
- Special animation/effects remain explicitly API-only and Ultra-only, but the actual special-effects capability endpoint is still a future implementation milestone; no fake effect records were added.

### VERIFIED
- Source inspection confirms the API-key bearer path is separated from Firebase ID-token authentication.
- API-key status/issuance/rotation/revocation remains server-authoritative and hash-only in Firestore.
- Protected records remain outside the public browser catalog.
- No second database, fake API key, fake payment or filler content was introduced.

### UNVERIFIED
- Current Vercel deployment containing these latest API/pricing commits is blocked by the project's Vercel build-rate-limit status; therefore these latest changes are not claimed live.
- Real Ultra entitlement + API-key issuance/rotation/revocation against production Firestore.
- Real API-key-authenticated /api/di-knowledge request.
- Published npm installation and external package registry publication.
- Actual special animation/effects API endpoint/consumer integration.
- Full browser, accessibility/device and BYOK provider verification.

### CHECKPOINT
- Regression: additive DI API and Pricing changes only.
- Functionality: Ultra API access foundation IMPLEMENTED; production runtime UNVERIFIED.
- Accessibility: Pricing controls retain semantic buttons/status regions; manual audit UNVERIFIED.
- Privacy/security: API secrets are server-generated and hash-only at rest; bearer API access requires Ultra entitlement.
- Performance: one bounded key lookup plus entitlement check per API request; production profiling UNVERIFIED.
- Data quality: no fabricated API users/keys/effects/records.
- Build/test: latest source is pushed; Vercel status remains build-rate-limit failure; no false READY claim.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**

## 2026-09-29 — Ultra-only special animation/effects API

### IMPLEMENTED
- Added server-only `api/_lib/di-effects.js` with bounded, deterministic special-effects definitions; these are capabilities, not fabricated catalog records.
- Added `api/di-effects.js` as a developer API endpoint restricted to a valid server-issued Ultra Premium+ MotionZync API key.
- The endpoint supports listing the supported effects and generating safe CSS implementations for a requested effect.
- Current bounded effects: Shimmer, Float, Glow Pulse, Gradient Shift and Spin.
- Every effect includes a `prefers-reduced-motion` fallback.
- The endpoint returns CSS only and explicitly marks executable script as false; it does not generate or execute arbitrary JavaScript.
- Cross-origin browser requests are deny-by-default and require an explicit `MOTIONZYNC_API_ALLOWED_ORIGINS` server allowlist.
- The package-ready npm entry now exposes a remote special-effects client using the same server API key; no second dataset was created.
- Documentation now describes the actual API capability and its security/access boundary.

### VERIFIED
- Source inspection confirms the endpoint authenticates through the existing server-side MotionZync API-key path, which requires Ultra Premium+.
- No special-effects records were added to the canonical catalog and no frontend-only bypass was introduced.
- Response headers use `private, no-store`, vary on Authorization/Origin and include basic response hardening.
- Payload options are bounded by explicit numeric ranges; unknown effect IDs are rejected.
- No plaintext API key is logged or persisted by the endpoint.

### UNVERIFIED
- Production/Vercel runtime of `/api/di-effects`.
- Real Ultra entitlement + API-key request/rotation/revocation exercise.
- Real cross-origin request after configuring a production origin allowlist.
- End-user visual acceptance of every generated effect.
- Full production browser/device/screen-reader audit.
- Vercel deployment of this current HEAD remains pending.
- GitHub Actions browser smoke fix remains pending after the previous Axe/navigation-race failure.

### CHECKPOINT
- Regression: additive server-only DI capability plus npm adapter/docs; no unrelated MotionZync routes/features modified.
- Functionality: special-effects API IMPLEMENTED; production runtime UNVERIFIED.
- Accessibility: reduced-motion fallbacks included; full manual audit remains UNVERIFIED.
- Privacy/security: Ultra API-key authentication is server-authoritative; no catalog/secret duplication; CORS is allowlist-based rather than wildcard.
- Performance: bounded computation with no database query; production profiling UNVERIFIED.
- Data quality: no fabricated catalog rows; five deterministic effect capabilities with explicit schemas.
- Build/test: build passed in the prior CI run before the browser/Axe failure; a new CI run for this milestone is now expected/pending.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**


## 2026-09-29 — Special-effects API payload hardening

### IMPLEMENTED
- Added a 16KB maximum request payload guard to `/api/di-effects` for POST effect requests.
- The guard checks declared Content-Length when available and also validates the parsed JSON payload size before effect generation.
- Oversized payloads return HTTP 413; effect options remain bounded by the existing per-effect numeric ranges.

### VERIFIED
- Source inspection confirms the limit is enforced inside the server-only effects endpoint and does not add frontend bypasses or a new data store.
- Existing Ultra Premium+ API-key authentication, deny-by-default CORS and reduced-motion/CSS-only behavior remain unchanged.
- Current branch remains `feature/design-intelligence`.

### UNVERIFIED
- Current HEAD still has no matching READY Vercel deployment.
- The latest READY Vercel effects deployment points to the earlier effects commit, not this hardening commit.
- Production 413 behavior, real Ultra API-key calls, production CORS and end-user visual acceptance remain unverified.

### CHECKPOINT
- Regression: additive API input hardening only; unrelated MotionZync features untouched.
- Functionality: payload guard IMPLEMENTED; deployed runtime UNVERIFIED.
- Accessibility: no UI behavior changed; manual audit remains UNVERIFIED.
- Privacy/security: request-size bound reduces oversized-input exposure; no new secret storage or entitlement bypass.
- Performance: constant-size validation; no database query added.
- Data quality: no catalog records changed.
- Build/test: source inspection only for this hardening; current-head workflow/deployment verification pending.
- Documentation: UPDATED.

### PHASE STATUS
- Phase A — Engine / System: **89% — IN PROGRESS**
- Phase B — Publish: **0% — NOT STARTED**
- Phase C — Continuous Content Expansion: **0% — NOT STARTED**

## FIRST UNFINISHED TASK
1. Verify a Vercel deployment containing the latest access contract, tier-scoped knowledge, Ultra API-key authentication, Pricing API-key controls, security headers and the new Ultra-only effects API after the Vercel build-rate-limit restriction clears.
2. Complete authenticated production browser/visual/interactivity verification of all 7 Design Intelligence routes on that newest deployment.
3. Complete manual accessibility/responsive audit, including screen-reader/device checks.
4. Verify real BYOK provider execution, provider-specific CORS behaviour and model compatibility.
5. Exercise /api/di-knowledge with unauthenticated/free, real Firebase Premium, real Ultra Firebase entitlement, and real Ultra MotionZync API-key callers; confirm Premium never receives Ultra-only records.
6. Run a real Cashfree sandbox order + Checkout + signed webhook + server-side payment-status test after merchant credentials/configuration are available.
7. Verify Ultra-only API-key issuance/rotation/revocation against a real entitlement.
8. Verify the new API-only special animation/effects capability in the deployed environment without bypassing Ultra entitlement.
9. Publish and externally install the package-ready canonical npm adapter; keep one canonical dataset and the remote special-effects client.
10. Continue Phase A publication workflow and deeper compatibility foundation.
11. Keep 1,000+/10,000+ content expansion deferred until the foundation is ready.