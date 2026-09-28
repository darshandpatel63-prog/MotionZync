# MotionZync — ChatGPT Project Common Instructions

## Repository
Only work on:
darshandpatel63-prog/MotionZync

## Current feature branch
feature/design-intelligence

## Scope
Only add/update the Design Intelligence + UI Generation feature.

Primary folder:
src/pages/DesignIntelligence/

Minimum integration files:
src/App.jsx
src/components/Navbar/Navbar.jsx
Only touch another integration file when it is proven necessary.

## Mandatory first read for a new chat
When the user says Start, Continue or Start/Continue:
1. Read src/pages/DesignIntelligence/START_HERE.md
2. Read src/pages/DesignIntelligence/handover.md
3. Read src/pages/DesignIntelligence/MotionZync_Design_Intelligence_Master_Prompt_README.md
4. Inspect every current file in src/pages/DesignIntelligence/
5. Inspect the minimum integration files named in handover.md
6. Continue from FIRST UNFINISHED TASK

## Protection rules
- Never work on main unless the user explicitly says so.
- Do not rewrite or remove existing MotionZync features.
- Do not create a standalone MotionZync replacement.
- Do not touch unrelated features.
- Do not duplicate the Design Intelligence database.
- Do not fabricate 1,000+ or 10,000+ records.
- Do not claim tests/builds were run when they were not.
- Update handover.md after every meaningful milestone.

## Product rules
- Design Intelligence is a real tool, not a static gallery.
- Use separate routes/pages within /design-intelligence/*.
- Navigation between feature pages must work.
- Web mode must not require npm.
- Deterministic core first; AI is enhancement, not a hard dependency.
- Web, developer and future AI-agent interfaces must use one canonical core.
- Free/Premium/Ultra Premium+ access must be server-authoritative when billing is eventually implemented.
- Premium API keys must never be fake frontend values.
- Reuse existing Google auth instead of making a second auth system.

## Truth status
Every handover entry must say whether work is:
IMPLEMENTED / VERIFIED / UNVERIFIED / ARCHITECTURALLY SUPPORTED / PLANNED-FUTURE.

## Safety checkpoint
Before each milestone check:
existing-feature regression, functionality, accessibility, privacy/security, performance, data quality, build/test and documentation.


## Extended project requirements
- Preserve and expand the existing blueprint; do not delete earlier requirements when adding new domains.
- Design Intelligence is intended to cover web, desktop, mobile/tablet, games, 3D, live effects, animation, accessibility, responsive behavior, design systems, UX, developer architecture and other verified interface domains.
- The generator must avoid converging on one recognizable "AI-made" visual pattern. Use deliberate, compatible design diversity rather than one fixed template or arbitrary randomness.
- Future npm/CLI interfaces should prefer local execution when technically possible; never claim offline/local behavior until it is implemented and verified.
- Premium expiry must be server-authoritative. A frontend timer is not entitlement control. Do not promise physical deletion of premium data already downloaded to a user's device.
- Keep one canonical Design Intelligence core across Web, npm, CLI, API and MCP/agent interfaces.
- For meaningful tasks, follow the Universal Master Orchestrator protocol in MotionZync_Design_Intelligence_Master_Prompt_README.md. Dynamically choose the smallest justified specialist team and use independent challenge/verification when warranted.
- Do not claim that autonomous multi-agent infrastructure exists in the repository unless it has actually been implemented and verified.
