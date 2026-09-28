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
