# MOTIONZYNC — DESIGN INTELLIGENCE + UI GENERATION SYSTEM

Repository: darshandpatel63-prog/MotionZync
Feature branch: feature/design-intelligence
Feature folder: src/pages/DesignIntelligence/
Route family: /design-intelligence/*

## 1. NON-NEGOTIABLE PROJECT RULE

This is an extension of the existing MotionZync product, not a replacement website.

Never:
- rebuild MotionZync from scratch
- remove unrelated pages/tools
- rewrite unrelated architecture
- break existing routes/authentication/Admin/Firebase/Vercel APIs
- create a second unrelated AI provider/vault system
- create a second unrelated design-knowledge database
- work on or merge to main unless explicitly instructed

Prefer additive, minimum-scope integration.

Minimum integration files currently:
- src/App.jsx
- src/components/Navbar/Navbar.jsx

Everything else for this feature belongs inside src/pages/DesignIntelligence/ unless a future milestone proves another integration file is necessary.

## 2. PRODUCT

Design Intelligence is a reusable Design Intelligence + UI Generation platform inside MotionZync.

Human workflow:
Search → Discover → Configure → Generate → Preview → Modify → Regenerate → Export

Developer/AI workflow:
Install/Connect → Query Design Intelligence → Receive structured knowledge → Generate UI → Validate against recipe

The web interface must work without npm installation.

## 3. MULTIPAGE REQUIREMENT

The feature must use real route pages, not a single-page tab illusion.

Current route family:
- /design-intelligence
- /design-intelligence/explorer
- /design-intelligence/generator
- /design-intelligence/knowledge
- /design-intelligence/stacks
- /design-intelligence/docs
- /design-intelligence/pricing

Every section needs visible navigation and direct URL access.

## 4. SINGLE SOURCE OF TRUTH

One canonical Design Intelligence core must power:
- Web UI
- future npm/package/CLI interface
- future REST API
- future MCP / AI-agent interface

Do not maintain separate website, npm and AI datasets.

## 5. DATA ARCHITECTURE

Use structured domain data, stable IDs and relationships.

Potential domains:
styles, palettes, typography, charts, technologies, layouts, components, navigation, UX, motion, accessibility, responsive design, industries, landing patterns, dashboards, forms, ecommerce, SaaS, mobile, design tokens, relationships, recipes, schemas, search and engine.

Never place thousands of unrelated records in one React component.

## 6. 1000+ / 10000+ TARGET

1,000+ is a scalability target, not permission to fabricate records.
10,000+ is a later expansion target.

Never create Style001 / Style002 filler.
Never make fake duplicates solely to hit a count.
Prefer hierarchical taxonomies and meaningful combinations.

Current seed dataset is intentionally much smaller than 1,000.

## 7. TRUTH-FIRST CONTENT

Never fabricate:
- fonts
- technologies
- frameworks
- libraries
- standards
- chart capabilities
- accessibility compliance claims
- package APIs
- MCP behavior
- compatibility claims

Research must respect licenses/copyright and should favor original structured knowledge plus verified facts.

Public references may inform taxonomy, but MotionZync must not blindly copy proprietary descriptions/data.

## 8. DESIGN INTELLIGENCE ENGINE

Core must work without an LLM.

Deterministic responsibilities:
- structured filters
- search
- ranking
- compatibility rules
- relationships
- design tokens
- templates
- Design Recipe generation

AI may later enhance:
- natural-language interpretation
- semantic search
- recipe refinement
- code generation

Do not make an LLM a hard dependency for basic browsing/search/recipe generation.

## 9. DESIGN RECIPE

A recipe should eventually contain:
- request/constraints
- product type
- industry
- target users
- platform
- mood
- style
- palette
- typography
- layout
- components
- charts
- navigation
- UX
- accessibility
- responsive strategy
- technology
- performance notes
- warnings/conflicts

Recipe should be machine-readable and portable.

## 10. COMPATIBILITY

Do not combine records randomly.

The engine must eventually distinguish:
- compatible
- acceptable
- questionable
- incompatible

Examples:
- poor-contrast palette + translucent style → warning
- unsuitable chart for data type → reject/warn
- unreadable typography combination → warning
- incompatible technology/output → reject

Conflicts must be visible.

## 11. VISUAL UI GENERATOR

The browser feature should eventually generate a visual preview, not only text.

Possible preview families:
landing, dashboard, SaaS, ecommerce, mobile, auth, admin, analytics, profile, pricing, checkout, healthcare, education, developer tools.

Current Phase 1 preview is intentionally lightweight and deterministic.

## 12. EXPORT ROADMAP

Future adapters may support only formats that are actually implemented:
- JSON
- design tokens
- CSS variables
- Markdown
- HTML/CSS
- React
- Next.js
- Vue
- Svelte
- Flutter
- React Native
- Tailwind

Never show an export format as supported until it is implemented.

## 13. TECH STACK INTELLIGENCE

Initial public-reference seed includes:
React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter and Tailwind CSS.

More technology knowledge must be verified before publication.

## 14. CONTENT INGESTION PIPELINE

Future production pipeline:
Source/research
→ normalization
→ schema validation
→ deduplication
→ relationship generation
→ quality review
→ accessibility validation
→ index generation
→ production dataset

It must scale to 10,000+ and later 100,000+ records without redesigning the whole application.

## 15. PERFORMANCE

MotionZync already contains heavy systems.

Design Intelligence must use:
- lazy loading where appropriate
- code splitting
- paginated/virtualized lists where needed
- indexed search
- cached data
- selective loading
- efficient filtering

Never load thousands of records into the browser unnecessarily.

## 16. ACCESSIBILITY

Implement from the beginning:
- keyboard navigation
- visible focus
- semantic HTML
- accessible labels
- meaningful contrast
- reduced-motion support
- accessible filters/forms/dialogs/charts

Do not call the feature WCAG-compliant unless relevant requirements were actually validated.

## 17. PRIVACY / SECURITY

Never expose:
- Firebase Admin credentials
- GitHub tokens
- provider/API secrets
- npm publishing credentials
- private server keys

Keep public design knowledge separate from private admin/user data.

Google login already exists in MotionZync and should be reused.

## 18. FREE / PREMIUM / ULTRA PREMIUM+

Product access model requested by the owner:

FREE
- free design knowledge
- free recipes
- free npm/package access when the package exists

PREMIUM
- premium designs
- Ultra Premium+ design access is intended to require the paid entitlement
- verified MotionZync API key
- Google account identity required

ULTRA PREMIUM+
- highest protected design tier
- server-side entitlement required

Important:
Frontend code must never self-grant premium access.
No fake API key may be generated or stored as proof of entitlement.

## 19. PRICING MODEL REQUESTED

Planned product pricing:
- first month: ₹50
- recurring month: ₹80/month
- 2 months: ₹150
- permanent: ₹200–₹250

These are product-plan requirements, not proof that billing is currently connected.

Real billing must later be implemented through a secure backend/payment provider and verified server-side.

## 20. API KEY MODEL

The intended future model:
Google login
→ paid entitlement verified
→ server issues private API key
→ key allows authorized premium/ultra queries

Future API must support secure:
- issuance
- hashing/storage strategy
- rotation
- revocation
- usage controls
- abuse protection

Never place the authoritative entitlement check in frontend-only code.

## 21. ADMIN

Extend existing MotionZync Admin architecture when appropriate.

Do not create a separate authentication system just for Design Intelligence.

Future Admin capabilities:
add, edit, delete, tag, relate, import, export, validate and publish knowledge records.

Public users must never receive Admin permissions.

## 22. DEVELOPER / NPM / CLI / MCP

The long-term system must allow the same canonical data to be queried by:
- Web
- npm/package
- CLI
- REST API
- MCP
- AI-agent integration

Example conceptual commands are architecture ideas only until implemented.

Do not publish or advertise fake package names or fake APIs.

## 23. AGENT ORCHESTRATION

Use the Universal Master Orchestrator principle for future complex implementation:
- decide whether one or multiple specialists are justified
- define responsibilities/dependencies
- exchange structured findings/decisions/tests
- use adversarial review when warranted
- synthesize from evidence and repository constraints
- never create unnecessary agents for count

## 24. PHASED ROADMAP

Phase 1
Architecture, schemas, deterministic seed core, multipage web shell, search and recipe foundation.

Phase 2
Verified content expansion, stronger schemas and compatibility rules.

Phase 3
Search index and semantic search.

Phase 4
Visual generation and richer previews.

Phase 5
Export/code-generation adapters.

Phase 6
Admin content pipeline.

Phase 7
Premium billing, entitlement and API key backend.

Phase 8
npm/CLI developer interface.

Phase 9
MCP/AI-agent interface.

Phase 10
1,000+ and later 10,000+ meaningful records plus automated QA/accessibility/performance/regression.

## 25. VERIFICATION RULE

Before declaring any milestone:
- regression
- functionality
- accessibility
- privacy/security
- performance
- data quality
- build/test
- documentation/handover

Record exact status:
IMPLEMENTED
VERIFIED
UNVERIFIED
ARCHITECTURALLY SUPPORTED
PLANNED / FUTURE

Never turn an unverified item into a verified claim.

## 26. CURRENT PHASE 1 REALITY

Implemented:
- dedicated multipage route family
- navigation
- seed catalog
- deterministic search
- basic recipe generation
- token output
- access taxonomy
- Google login entry
- continuation docs

Not yet implemented:
- production billing
- server-side premium entitlement
- real premium API key issuance
- npm package
- CLI
- MCP
- 1,000+ dataset
- full relationship graph
- semantic search
- complete export adapter set
- automated full QA suite

The current UI must be honest about these limitations.

## 27. START/CONTINUE PROTOCOL

When a new chat says only Start, Continue or Start/Continue:
1. Read START_HERE.md.
2. Read handover.md.
3. Read this file.
4. Inspect all current DesignIntelligence files.
5. Inspect only minimum integration files named by handover.md.
6. Resume from FIRST UNFINISHED TASK.
7. Never rebuild completed work.
8. Update handover.md after meaningful changes.
9. Stay on feature/design-intelligence.

## 28. MASTER RULE

INSPECT FIRST.
UNDERSTAND SECOND.
ARCHITECT THIRD.
IMPLEMENT FOURTH.
VERIFY FIFTH.
AUDIT SIXTH.

Never destroy existing MotionZync to build Design Intelligence.
Never fabricate the dataset.
Never create a second unrelated knowledge core.
