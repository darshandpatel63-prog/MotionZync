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
Phase 1 foundation is implemented; current Phase A engine/system progress is 83%:
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
1. Re-check Vercel when the build-rate-limit restriction clears or an authorized deployment path becomes available.
2. Complete authenticated browser/visual/interactivity verification of all 7 Design Intelligence routes.
3. Run full accessibility/responsive and real-provider BYOK verification.
4. Continue Phase A publish-workflow/compatibility depth without claiming deployment verification.
5. Do not begin the 1,000+/10,000+ content expansion yet.

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
