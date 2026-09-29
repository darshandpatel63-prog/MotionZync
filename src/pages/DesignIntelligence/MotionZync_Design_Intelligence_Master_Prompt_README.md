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

## 6. 1000+ / 10000+ TARGET — PER MEANINGFUL SUB-CATEGORY

The 1,000+ target applies to **each meaningful design sub-category**, not merely to each top-level category.

For example, if "UI Layout Systems" contains Sidebar, Top Navigation, Bottom Navigation, Dashboard Layout, Tabs, Split View, Master-Detail, Bento, Grid, Workspace, Mobile Layouts and other legitimate sub-categories, each meaningful sub-category is itself a future **1,000+ genuine pattern/record target**.

The same rule applies across the entire canonical taxonomy:
- layouts and layout sub-types
- components and component sub-types
- navigation patterns
- UX/state patterns
- animation/motion sub-types
- live/interactive effects
- 3D/graphics patterns
- game UI sub-types
- responsive/platform patterns
- accessibility patterns
- charts/data-visualization sub-types
- product/industry patterns
- design-system/token patterns
- typography/color/style sub-types
- and any other meaningful domain or sub-domain added later.

This does **not** mean generating trivial permutations. A record counts only when it represents a genuinely meaningful and sufficiently distinct design pattern, structure, behavior, interaction, composition, or system. Changing only color, border radius, font size, spacing, icon, or another superficial property is not enough to create a new record.

1,000+ per meaningful sub-category is a long-term content target, not permission to fabricate records.
10,000+ is a later expansion target and may be far exceeded as the taxonomy grows.

Never create Style001 / Style002 filler.
Never make fake duplicates solely to hit a count.
Prefer hierarchical taxonomies, validated relationships and meaningful combinations.

Current seed dataset is intentionally much smaller than these future targets.

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

The preferred commercial model is **permanent access**, rather than a time-limited monthly or two-month Premium subscription, if time-limited entitlement/revocation cannot be implemented reliably.

Primary planned permanent plan:
- **₹500 — Permanent**
- includes all entitled Premium/Ultra Premium+ features and knowledge available under the plan
- includes a personal authorized API key for the purchaser
- API usage is intended for the purchaser's own unlimited projects, subject to future abuse/rate/security controls

Optional lower-cost plan, **only if technically enforceable**:
- **₹250 — Permanent**
- intended to allow the entitled UI/design capabilities permanently
- API/design usage may be bound to a maximum of **10 registered projects**
- this plan must not be offered unless reliable server-side project-count enforcement is actually implemented and verified

If the 10-project restriction cannot be enforced reliably, do not offer the ₹250 plan; use the ₹500 permanent model instead.

The previously discussed ₹50 first month, ₹80/month and ₹150/two-month options are superseded by this preferred permanent-access model unless a later verified architecture explicitly reintroduces time-limited plans.

These are product-plan requirements, not proof that billing is currently connected.

Real billing and entitlement must later be implemented through a secure backend/payment provider and verified server-side.

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


## 29. EXPANDED DESIGN INTELLIGENCE TAXONOMY

The owner requires Design Intelligence to grow beyond the initial UUPM-style reference categories. Existing sections and requirements must remain; this section expands them.

The canonical knowledge model should eventually cover, where verified and meaningful:

### Product / UI types
- websites, landing pages, web apps, SaaS, dashboards, admin panels, analytics, CRM, ERP
- ecommerce, marketplaces, portfolios, blogs, documentation, AI products, developer tools
- fintech, healthcare, education, social/community, media/streaming, booking, travel, food/hospitality
- productivity, communication, monitoring, IoT, enterprise, search, authentication, onboarding
- profile, settings, pricing, checkout, payment, forms, tables, command centers and other legitimate product patterns

### Platforms and devices
- desktop web, laptop, tablet web, mobile web
- Windows, macOS, Linux desktop applications
- Android, iOS, iPadOS
- React Native, Flutter and other verified cross-platform targets
- PWA/offline web, browser extensions, embedded interfaces, kiosk/large displays
- future wearable, TV, automotive, spatial/AR/VR and other verified interfaces

A platform-specific design is not considered equivalent to a responsive web design. Platform conventions, input methods, navigation, accessibility and performance constraints must be represented separately.

### Layout systems
- sidebar, top navigation, bottom navigation, tabs, command palette
- split view, master-detail, bento, masonry, dashboard grids
- full-screen, modal/drawer driven, multi-column, floating, canvas and spatial layouts
- adaptive layouts that transform between mobile/tablet/desktop rather than merely shrinking

### Component intelligence
Buttons, cards, forms, inputs, selects, menus, navigation, dialogs, drawers, popovers, tooltips, tables/data grids, charts, pagination, search, uploaders, editors, timelines, steppers, progress, skeletons, notifications, carousels and other validated reusable patterns.

### UX/state intelligence
Normal, hover, focus, pressed, disabled, loading, skeleton, empty, partial, success, warning, error, offline, permission-denied, expired-session, destructive-confirmation, retry and recovery states.

### Motion / animation
- micro-interactions
- hover/press/focus/toggle transitions
- page and route transitions
- expand/collapse and shared-element transitions
- scroll/parallax/stagger/text/number animations
- drag/gesture/spring/physics-based motion
- reduced-motion alternatives

### Live / interactive effects
- cursor/touch reactive effects
- real-time data visualizations
- live counters and status indicators
- streaming interfaces
- dynamic gradients and backgrounds
- particle systems
- audio-reactive effects
- presence and collaborative/live states
- interaction-driven visual effects

### 3D / graphics
- CSS 3D and perspective
- Three.js / React Three Fiber
- WebGL / Canvas / SVG
- 3D cards, product viewers, scenes, particles, lighting, depth, reflections, distortion and shaders
- performance-aware 3D fallbacks for mobile and low-power devices

Do not claim a 3D technology is supported by the generator until its adapter is actually implemented and verified.

### Game UI intelligence
Support meaningful game UI knowledge for PC, mobile and tablet targets, including:
- action, RPG, strategy, racing, simulation, puzzle, adventure, platformer, shooter, sports, card, board, casual and multiplayer patterns
- HUD, health/mana, inventory, skills, quests, maps/minimaps, leaderboard, shop, battle UI
- pause/settings/loading screens, achievements/rewards, notifications, dialogue and multiplayer lobbies
- touch, mouse/keyboard, controller and adaptive input considerations
- performance and readability constraints for games

Game UI knowledge must remain separate from claims about game-engine implementation unless an engine adapter is actually implemented.

### Design systems and tokens
Colors, semantic colors, typography scales, spacing, radii, borders, elevation, shadows, z-index, breakpoints, motion durations/easing, component states and theme variants.

### Accessibility and inclusive design
Keyboard navigation, focus management, semantic structure, screen-reader support, ARIA where appropriate, contrast, target sizes, reduced motion, color-vision considerations, readable typography, localization, RTL and cognitive accessibility.

Never claim formal accessibility compliance without actual validation.

### Internationalization
Eventually support design guidance for:
- localization
- RTL layouts
- long/short translated strings
- date/time/number/currency formats
- locale-specific typography and spacing
- culturally appropriate patterns

### Developer and architecture intelligence
Eventually cover, where actually implemented:
- frontend architecture
- component architecture
- state management
- data fetching/caching
- routing
- authentication/authorization
- forms/validation
- API integration
- error handling
- offline/PWA behavior
- testing
- observability
- logging
- performance budgets
- SEO where relevant
- security/privacy considerations
- deployment/build considerations
- maintainability and scalability

This knowledge must complement, not replace, the canonical design recipe.

### Additional output contexts
Future adapters may support verified patterns for:
- web
- desktop
- mobile/tablet
- browser extensions
- email interfaces
- printable/document interfaces
- widgets/embedded components
- PWA/offline experiences
- game interfaces
- spatial/3D experiences

Only advertise an output context after its adapter and validation exist.

## 30. HUMAN-DESIGN / ANTI-TEMPLATE CONVERGENCE PRINCIPLE

The generated UI must NOT converge into one recognizable "AI-made" visual pattern.

The goal is not random ugliness and not arbitrary variation. The goal is deliberate design diversity.

The engine should eventually combine independent design dimensions:
- product purpose
- information architecture
- platform conventions
- layout grammar
- typography
- color system
- component language
- density
- spacing rhythm
- imagery direction
- iconography
- motion language
- interaction model
- accessibility requirements
- performance constraints
- brand/mood
- industry context

The generator should support multiple valid design directions for the same request.

Avoid:
- one universal card style
- one universal gradient treatment
- one universal hero section
- one universal sidebar
- one universal border radius
- one universal typography pairing
- one universal animation style
- repeated AI-looking spacing/structure
- copying a reference site's exact visual identity

Use controlled variation, compatibility rules and optional reproducible seeds. Randomness must never override usability, accessibility or consistency.

A generated result should feel like a purpose-built design system for its request, not a fixed MotionZync template.

## 31. NPM / LOCAL-FIRST EXECUTION MODEL

The long-term npm/package experience must support local execution on the user's own computer whenever the selected feature is designed to run locally.

Target architecture:
- npm package contains the reusable client/core/adapters that are actually licensed for local use.
- local generation/search/rendering should run on the user's machine without sending ordinary design-generation work to MotionZync servers.
- the canonical Design Intelligence schema/core must remain reusable by Web, npm, CLI and future API/MCP interfaces.
- platform-specific adapters may use the user's local runtime and installed dependencies.
- the package must clearly state which capabilities require internet access, a remote API, GPU/WebGL, native dependencies or external services.

Privacy principle:
If a feature can run locally without a server, prefer local execution.

Do not falsely claim "100% offline" until network behavior has been tested and documented.

## 32. PREMIUM SUBSCRIPTION EXPIRATION / ENTITLEMENT MODEL

A time-limited premium subscription must not be implemented as a frontend-only timer.

Future authoritative model:
1. User authenticates.
2. Payment is verified by the backend/payment provider.
3. Server creates an entitlement with plan, start time, expiry time and status.
4. Server/API verifies entitlement on every protected operation or through a short-lived signed session.
5. Expiry causes premium API access and protected generation to stop.
6. Renewal extends the server entitlement.
7. Revocation/cancellation can invalidate access independently of the client.

Important limitation:
Once premium knowledge has been downloaded to a user's machine as plain client-readable files, no web application can guarantee physical deletion from that machine.

Therefore:
- Do not ship protected premium datasets permanently inside an unrestricted frontend/npm package if revocation is required.
- Keep authoritative premium knowledge behind an authenticated API when revocation is required.
- A local client may cache authorized results for performance, but cached premium data must be treated as revocable application data, not as a promise of secure physical deletion.
- If strong local protection is ever required, investigate a server-issued, short-lived, cryptographically protected licensing model and document its real limitations. Never claim DRM-like protection that the architecture cannot provide.

Free local/npm content may be distributed openly.
Premium/Ultra Premium+ access must remain server-authoritative when access control is required.

## 33. CANONICAL CORE + MULTI-INTERFACE RULE

There must remain exactly one canonical Design Intelligence knowledge model and rule engine.

Interfaces:
Web UI
→ canonical core

npm/local interface
→ canonical core

CLI
→ canonical core

REST/API
→ canonical core

MCP/AI-agent interface
→ canonical core

Do not fork the dataset or create separate incompatible business logic for each interface.

Where runtime constraints differ, create adapters around the same canonical schema and rules.

## 34. UNIVERSAL MASTER ORCHESTRATOR

For every meaningful implementation/research task in this project, first activate a Universal Master Orchestrator workflow.

The orchestrator must dynamically decide:
1. whether one agent is enough
2. whether multiple specialists are justified
3. exactly which specialties are needed
4. each agent's responsibility and boundaries
5. dependencies and communication
6. which outputs require independent verification
7. which agents should challenge/audit other work
8. how disagreements will be resolved
9. when temporary specialist agents should be added
10. which final quality-control process is required

There is no fixed agent count. Two agents may be enough; a large multidisciplinary team may be justified for a complex task. Never create agents merely to increase the count.

### Agent operating rules
Every specialist must have:
- objective
- scope
- inputs
- outputs
- evidence requirements
- uncertainty reporting
- review relationships
- explicit exclusions where useful

For complex work, use as appropriate:
Round 1: independent analysis
Round 2: knowledge exchange
Round 3: cross-critique
Round 4: conflict resolution
Round 5: verification
Round 6: synthesis
Round 7: final audit

Not every task needs every round.

### Truth-first orchestration
Agents must never fabricate facts, records, sources, citations, calculations, APIs, compatibility, tests, implementation results or certainty.

If something is unknown, label it unknown.
If something is inferred, label it inferred.
If something is planned, label it planned.
If something is unverified, label it unverified.

Never optimize for the appearance of intelligence.

### Adversarial review
For complex, risky or important work, create one or more independent challenge/audit roles to search for:
- unsupported claims
- logical errors
- security/privacy issues
- accessibility problems
- performance problems
- data-quality problems
- missing edge cases
- outdated assumptions
- regressions
- hidden dependencies

Do not automatically accept a majority vote. Resolve disagreements by comparing evidence and assumptions; preserve uncertainty when it cannot be resolved.

### Final synthesis
Before a significant milestone is declared complete, the orchestrator must ensure the final result:
- covers the request
- respects repository constraints
- distinguishes implemented from planned work
- has appropriate verification
- does not expose private chain-of-thought or internal agent transcripts
- is documented in handover.md

This project-specific orchestrator rule is a coordination protocol, not a claim that the repository currently contains 100+ autonomous agents. Actual agent/tool availability depends on the runtime.

## 35. FUTURE KNOWLEDGE EXPANSION — DO NOT STOP AT THIS LIST

The taxonomy is intentionally extensible.

When a future specialist identifies another genuinely useful design/development domain, it should propose the addition before changing the canonical schema.

Potential future areas include:
- voice UI
- multimodal interfaces
- accessibility-first design systems
- AI interaction patterns
- agentic UI
- collaborative interfaces
- offline-first systems
- spatial computing
- AR/VR
- robotics interfaces
- industrial/HMI interfaces
- scientific visualization
- GIS/map interfaces
- education/learning interfaces
- medical/clinical interfaces
- command-line/TUI design
- developer IDE interfaces
- browser extension UI
- automotive interfaces
- TV/10-foot UI
- wearable UI
- embedded/device UI
- security/admin consoles
- data-heavy enterprise systems

These are candidates, not claims that all are already implemented.

## 36. EXPANSION SAFETY RULE

Before adding large new catalog domains, check:
- schema fit
- provenance/source quality
- duplicates
- relationship correctness
- platform compatibility
- accessibility
- performance
- privacy/security
- licensing/copyright
- testability
- documentation

Then update the canonical catalog and handover.

## 37. STATUS

The sections above describe the target architecture and requirements unless separately marked implemented in the repository.

Current implementation remains Phase 1 as described in earlier sections. Expanded taxonomy, local npm execution, premium expiry enforcement, anti-template convergence, advanced animation/3D/game intelligence and universal orchestration are predominantly PLANNED / FUTURE until their implementation and verification milestones are completed.


## 38. GRANULAR 1000+ COVERAGE RULE

The project's large-scale content goal is intentionally **recursive/granular**.

"1,000+" must be interpreted at the lowest meaningful catalog level, not only at the parent-category level. A parent category containing many sub-categories must not be counted as satisfying the target merely because its combined children total 1,000 records.

Example:
UI Layout Systems → Sidebar → 1,000+ genuinely distinct sidebar patterns.
UI Layout Systems → Dashboard Layout → 1,000+ genuinely distinct dashboard patterns.
UI Layout Systems → Tabs → 1,000+ genuinely distinct tab patterns.

The same principle applies to every other domain and its meaningful descendants.

Quality rule:
- no cosmetic-only permutations
- no duplicate records
- no fabricated filler
- no "same UI with one tiny change" counting
- meaningful structural, behavioral, interaction, contextual, platform, accessibility, motion or composition differences are required where appropriate
- records must remain compatible with the canonical schema and relationship graph

This is a **knowledge/pattern coverage target**. It does not mean every record must be a standalone complete webpage. The generator should compose these validated building blocks into complete interfaces.

The eventual catalog can therefore become much larger than 10,000 records as the taxonomy expands. The exact final count must be measured from real, validated records rather than invented in advance.

## 39. OUTPUT DIVERSITY APPLIES TO ALL GENERATED UI

The Human-Design / Anti-Template Convergence Principle applies to **every UI produced, recommended, composed or exported by Design Intelligence**, not only the Design Intelligence website itself.

This includes future:
- web UI
- desktop UI
- mobile/tablet UI
- game UI
- 3D/spatial UI
- animated/live UI
- component compositions
- design-system outputs
- code-generated interfaces
- npm/local generated interfaces
- API/MCP/AI-agent generated interfaces

The system should provide the knowledge, constraints, relationships and compatible design directions. It should not force every user or external AI to place every component in one universal MotionZync pattern.

Where placement/composition depends on product requirements, content, platform, brand and user/AI decisions, the system must preserve that flexibility while still validating usability, accessibility, performance and consistency.

The objective is not to make every generated UI look "random" or "different" for its own sake. The objective is to prevent a recognizable fixed AI/MotionZync template while producing purposeful, context-appropriate design systems.

## 40. STATUS OF THESE EXPANSIONS

The granular 1,000+ per meaningful sub-category rule, permanent-plan preference, conditional ₹250/10-project plan, and all-output anti-template scope are **PLANNED / FUTURE requirements** unless separately verified as implemented.

They must not be represented as existing production capabilities until the corresponding data, entitlement, enforcement, generation and validation systems are actually implemented and verified.


## 41. USER-PROVIDED AI / BYOK GENERATION INTEGRATION

The existing MotionZync AI provider/API-key system is the canonical starting point for Design Intelligence's future AI-assisted generation flow.

Do **not** create a second API-key vault, second provider configuration system or duplicate AI settings UI.

Existing reusable AI infrastructure currently includes:
- `src/ai/providers/AIProviderContext.jsx`
- `src/ai/providers/keyVault.js`
- `src/ai/providers/VaultContext.jsx`
- `src/ai/settings/APIKeyManager.jsx`

The Design Intelligence generator should integrate with this existing system rather than inventing a new one.

### Intended AI-assisted workflow

User prompt
→ Design Intelligence requirement interpretation
→ canonical schema / relationships
→ compatibility rules
→ anti-template diversity constraints
→ Design Recipe / structured generation context
→ existing user-selected AI provider/model
→ provider API
→ generated design/UI/code result
→ Design Intelligence validation/preview/export

The selected AI is an **execution/generation model**, while Design Intelligence supplies the domain knowledge, constraints, compatible design directions and validation context.

The user must be able to use the web feature without an AI API key. AI assistance is an enhancement, not a hard dependency for basic browsing/search/recipe generation.

### BYOK privacy model

The current MotionZync BYOK system is browser/local-first:
- provider API keys are protected by the existing passphrase-based vault
- keys are encrypted at rest with AES-GCM using a PBKDF2-derived key
- decrypted keys are kept in memory while the vault is unlocked
- direct provider requests currently originate from the browser
- Ollama can run locally without a provider API key

Do not weaken this protection or create duplicate storage.

### Security hardening requirements

The existing vault is a meaningful protection layer but is not equivalent to a server-side secret manager.

Future hardening must consider:
- strict Content Security Policy where compatible with MotionZync
- XSS prevention and safe rendering of generated HTML/code
- never place provider secrets in `NEXT_PUBLIC_*` or other public build variables
- never log plaintext API keys, prompts containing secrets, authorization headers or provider responses that contain sensitive data
- clear decrypted key material from memory when the vault locks or the user leaves the relevant session where practical
- validate provider/model/endpoint configuration before requests
- restrict custom endpoint handling to prevent unsafe request targets where applicable
- apply request timeouts, cancellation and reasonable payload limits
- do not execute generated code merely because an AI returned it
- isolate generated previews from the application origin when HTML/script execution is ever introduced
- preserve the existing delete-key and lock-vault controls
- review third-party provider CORS/direct-browser requirements individually
- prefer a server-side relay only when the product explicitly needs server-controlled provider credentials, entitlement enforcement, or other capabilities that cannot safely be client-side

Important:
The current browser vault protects keys **at rest** but cannot fully protect a decrypted key from an active XSS payload executing in the same page while the vault is unlocked. Do not describe client-only storage as absolute security.

### AI-provider processing boundary

When the user chooses their own provider API key, ordinary AI processing is intended to occur on the selected provider's infrastructure, subject to that provider's terms, retention, logging and privacy policies.

MotionZync must not claim that prompts or generated content are automatically private from the selected provider.

The Design Intelligence layer should send only the minimum structured context required for the requested generation and must avoid unnecessary transmission of private MotionZync data.

### Non-AI direct design mode

The user must also be able to use Design Intelligence without asking an external AI to generate the interface:
- browse/search canonical knowledge
- inspect patterns and relationships
- build a Design Recipe
- configure platform/layout/components
- preview supported compositions
- use supported exports when actually implemented

This keeps Design Intelligence useful even when no provider API key is configured.

## 42. REFERENCE-BASED DESIGN INPUT

Design Intelligence should eventually accept a user's reference website/UI/image or structured description as **design evidence**, where technically and legally appropriate.

The system should extract or represent useful characteristics such as:
- information architecture
- layout grammar
- density
- navigation model
- typography direction
- color relationships
- component language
- interaction/motion direction
- responsive behavior

It must not promise exact cloning of another product's protected visual identity.

The reference becomes an input to the canonical recipe/compatibility system, not a command to copy the reference exactly.

## 43. NPM / LOCAL USER CONTROL

When the npm/CLI/local interface is implemented, users/developers should be able to configure the design themselves instead of being forced through one MotionZync template.

The local interface should expose the canonical knowledge, schema, relationships, compatibility checks and generation/composition primitives so the developer can choose:
- platform
- layout
- components
- typography
- palette
- motion
- 3D/effects
- density
- brand direction
- accessibility constraints
- output technology

The same anti-template rules apply, but composition remains context-sensitive and user-controlled.

Premium/Ultra Premium capabilities must be enforced according to the authoritative entitlement model. Do not rely on a frontend-only flag in the npm package.

## 44. ACCESS / ENTITLEMENT FOR AI + LOCAL MODES

Access control applies to both web and future developer interfaces.

Free:
- free canonical knowledge and free deterministic generation
- no premium entitlement required

Premium / Ultra Premium:
- protected knowledge and protected generation capabilities only after authoritative entitlement verification
- personal authorized API capability only where the paid plan explicitly includes it

For a permanent ₹500 plan:
- intended to include entitled Premium/Ultra Premium+ knowledge/features
- intended personal API access
- intended use across the purchaser's own projects, subject to rate/security/abuse controls

For a possible permanent ₹250 plan:
- offer only after server-side enforcement can reliably bind usage to a maximum of 10 registered projects
- if reliable enforcement is not available, do not expose this plan as purchasable

The user's external provider API key is **not** the same thing as MotionZync Premium entitlement. A user can supply a provider key and still require MotionZync entitlement for protected MotionZync knowledge/capabilities.

## 45. STATUS OF BYOK / AI INTEGRATION REQUIREMENTS

**ARCHITECTURALLY SUPPORTED**
- Existing MotionZync BYOK infrastructure can be reused by Design Intelligence.
- Design Intelligence can prepare structured generation context and pass it to a selected AI provider.
- AI-assisted and non-AI direct design modes can coexist.
- NPM/local interfaces can reuse the same canonical core.

**IMPLEMENTED**
- Existing MotionZync API-key/vault infrastructure is already present and reusable.
- Design Intelligence itself is not yet wired into that provider execution flow.

**UNVERIFIED**
- End-to-end Design Intelligence → selected provider → generated UI/code flow.
- Security of every provider's direct-browser API/CORS behavior.
- Safe execution/isolation of generated code or HTML.
- Production server-authoritative entitlement enforcement.

**PLANNED / FUTURE**
- Wire the Design Intelligence Generator to the existing `useAI()` provider system.
- Add structured Design Recipe context to provider prompts.
- Add provider capability-aware generation.
- Add validation of AI output against the canonical recipe/compatibility rules.
- Add safe preview/export adapters.
