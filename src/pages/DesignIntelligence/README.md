# @motionzync/design-intelligence

Canonical MotionZync Design Intelligence core for deterministic design knowledge, search, relationships, recipe generation, compatibility checks and access-aware data handling.

## Installation

```bash
npm install @motionzync/design-intelligence
```

The package is intended to share the same canonical Design Intelligence core used by MotionZync Web. It does not create a second Design Intelligence database.

## Core usage

The package exports the canonical access helpers, catalog, deterministic engine, schema, lexical search index and relationship layer.

```js
import {
  buildRecipe,
  evaluateCompatibility,
  searchCatalog,
  validateRecipe,
} from '@motionzync/design-intelligence'
```

Basic deterministic generation does not require an external AI provider.

## Public npm usage guide

After installation, the package can be used directly from JavaScript/TypeScript projects:

```bash
npm install @motionzync/design-intelligence
```

### 1. Search for a design choice

Search the canonical catalog by words such as `minimal`, `dashboard`, `healthcare`, `dark`, `chart`, `react`, or `creative`:

```js
import { searchCatalog } from '@motionzync/design-intelligence'

const styles = searchCatalog('minimal dashboard', 'styles')
const palettes = searchCatalog('healthcare', 'palettes')
const typography = searchCatalog('modern', 'typography')
const charts = searchCatalog('comparison', 'charts')
const stacks = searchCatalog('react', 'stacks')
```

Each result is a canonical record. The package does not generate fake catalog entries.

### 2. Ask for a complete design recipe

Give the deterministic engine a plain-language UI request:

```js
import {
  buildRecipe,
  recipeToExport,
  recipeToCSSVariables,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe(
  'dark SaaS analytics dashboard for developers using React'
)

console.log(recipe.style.name)
console.log(recipe.palette.name)
console.log(recipe.typography.name)
console.log(recipe.chart?.name)
console.log(recipe.stack.name)
console.log(recipe.compatibility)
```

The recipe can select a **style, color palette, typography pairing, chart, technology stack, layout/navigation direction and UX guidance** from the canonical records. The current deterministic engine works without an external AI provider.

### 3. Take a specific design from the catalog

You can search first and then use the returned record IDs in your own application, design system or generator. For example, a project can choose a style such as **Minimalism**, **Glassmorphism**, **Bento**, **Editorial** or **Dark UI**, then combine it with a palette and typography pairing selected by the same canonical catalog.

The current public package intentionally contains a verified Phase-A seed catalog, not a claimed 1,000+/10,000+ dataset. More records are added only through verified-data milestones.

### 4. Export design tokens

A generated recipe can be converted to CSS custom properties:

```js
const css = recipeToCSSVariables(recipe)
console.log(css)
```

The export includes canonical variables for primary/secondary/accent/CTA colors, background/surface/text/muted colors, spacing/radius and heading/body fonts. A portable recipe object is also available:

```js
const portable = recipeToExport(recipe)
```

This lets a UI generator or design-system tool consume the result without creating another Design Intelligence database.

### 5. Validate and check compatibility

Use the same core to check whether a recipe is structurally valid and whether choices fit the requested platform/data purpose:

```js
import {
  evaluateCompatibility,
  validateRecipe,
} from '@motionzync/design-intelligence'

const compatibility = evaluateCompatibility(recipe)
const validation = validateRecipe(recipe)

console.log(compatibility.status)
console.log(validation.valid)
console.log(validation.warnings)
```

Checks include platform/stack fit, text and CTA contrast, style/industry suitability, chart-purpose suitability and other bounded compatibility rules.

### What can be built with the package

The public package is useful for **UI generators, design-system tooling, dashboards, landing-page generators, React/Next.js/Vue/Svelte workflows, mobile UI planning, CSS-token generation, recipe search and developer tools**. It provides the design-intelligence decision layer; your application remains responsible for rendering the final UI.

**Typical flow:** user describes a product → `buildRecipe()` interprets it → the engine selects compatible design records → your app renders the recipe → optional `recipeToCSSVariables()` / `recipeToExport()` output feeds the renderer or design system.

## Remote protected knowledge

The package includes a client for the server-authoritative MotionZync knowledge endpoint:

```js
import { createRemoteKnowledgeClient } from '@motionzync/design-intelligence'

const client = createRemoteKnowledgeClient({
  baseUrl: 'https://motion-zync.vercel.app',
  bearerToken: 'SERVER_ISSUED_MOTIONZYNC_API_KEY',
})

const knowledge = await client.fetchKnowledge('styles')
```

Protected Premium/Ultra knowledge and developer API access remain server-authorized capabilities. Do not treat a provider BYOK key as proof of MotionZync entitlement.

## Ultra Premium+ special effects

The package also includes a remote client for the Ultra Premium+ special-effects API:

```js
import { createSpecialEffectsClient } from '@motionzync/design-intelligence'

const effects = createSpecialEffectsClient({
  baseUrl: 'https://motion-zync.vercel.app',
  apiKey: 'SERVER_ISSUED_MOTIONZYNC_API_KEY',
})

const supported = await effects.listEffects()
```

The server controls entitlement. The package does not fabricate or embed MotionZync API keys.

## Canonical-core rule

Web, future npm/CLI, API and future MCP/AI-agent adapters are designed to reuse one canonical Design Intelligence core.

The current package contains the bounded Phase-A seed catalog. It does not claim 1,000+ or 10,000+ implemented records.

## Current publication status

The public npm package has been published as `@motionzync/design-intelligence@0.1.0`. A clean external consumer installation/import from the public npm registry has also been VERIFIED in GitHub Actions. The package is still intentionally bounded to the verified Phase-A seed catalog.


## Verified npm release

- Package: `@motionzync/design-intelligence`
- Published version: `0.1.0`
- Registry: public npm
- Public registry installation/import: **VERIFIED**
- Verified CI consumer test: fresh directory → `npm install @motionzync/design-intelligence@0.1.0` → package import/export smoke test
- Verified public exports include `buildRecipe`, `searchCatalog`, `createRemoteKnowledgeClient` and `createSpecialEffectsClient`
- The package does not contain a second Design Intelligence database.
- Large 1,000+/10,000+ content expansion remains a separate future verified-data milestone.
