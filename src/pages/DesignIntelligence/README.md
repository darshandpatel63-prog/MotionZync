# @motionzync/design-intelligence

Canonical MotionZync Design Intelligence core for deterministic design knowledge, search, relationships, recipe generation, compatibility checks and access-aware data handling.

## What this package is

This package lets developers use the same canonical Design Intelligence core used by MotionZync Web.

It is designed for:

`Search → Choose → Compose → Validate → Export`

It is **not** a second Design Intelligence database and it does not require an external AI provider for the basic deterministic workflow.

### Current package capabilities

The published package is intended to let a developer:

- search the Design Intelligence catalog
- discover styles, palettes, typography pairings, charts, technology stacks and recipes
- generate a deterministic Design Recipe from a natural-language product description
- respect Free/Premium/Ultra Premium+ access boundaries
- validate recipe structure and compatibility
- generate design tokens and CSS custom-property output
- export a portable recipe JSON structure
- connect to the server-authoritative MotionZync knowledge API when authorized
- connect to the Ultra Premium+ special-effects API when authorized

The current Phase-A package contains a **bounded verified seed catalog**. It does **not** claim 1,000+ or 10,000+ implemented records.

## Installation

After the package is available on the public npm registry:

```bash
npm install @motionzync/design-intelligence
```

Then import the canonical APIs:

```js
import {
  DI_STYLES,
  DI_PALETTES,
  DI_TYPOGRAPHY,
  DI_CHARTS,
  DI_STACKS,
  DI_RECIPES,
  searchCatalog,
  buildRecipe,
  validateRecipe,
  recipeToExport,
  recipeToTokens,
  recipeToCSSVariables,
} from '@motionzync/design-intelligence'
```

The package is ESM and is intended for Node.js 18+ environments.

## How to find a design

There are two normal ways to choose a design direction.

### 1. Search the catalog

Search one domain:

```js
const styles = searchCatalog(
  'minimal healthcare',
  'styles',
  'free'
)

console.log(styles)
```

Search everything:

```js
const results = searchCatalog(
  'dashboard dark technical',
  'all',
  'free'
)
```

The result is made from the canonical records rather than generated filler.

### 2. Ask Design Intelligence for a complete direction

Give it a product description:

```js
const recipe = buildRecipe(
  'dark healthcare analytics dashboard with a professional technical mood',
  'free'
)

console.log(recipe.style.name)
console.log(recipe.palette.name)
console.log(recipe.typography.name)
console.log(recipe.stack.name)
console.log(recipe.chart?.name)
```

The deterministic engine interprets product, industry, platform, light/dark mode and mood signals, then selects compatible records from the accessible catalog.

Basic generation does not require an LLM.

## Current design knowledge in the Phase-A seed catalog

### Styles

Current seeded styles include:

- Minimalism
- Glassmorphism
- Neumorphism
- Brutalism
- Neo-Brutalism
- Bento
- Claymorphism
- Aurora UI
- Editorial
- Dark UI

### Palettes

Current seeded palettes include:

- Slate + Cyan
- Violet + Indigo
- Healthcare Teal
- Warm Amber

### Typography

Current seeded pairings include:

- Inter + Inter
- Space Grotesk + Inter
- Playfair Display + Inter
- Manrope + Inter
- DM Sans + DM Sans

### Charts

Current seeded chart patterns include:

- KPI + Time Series
- Grouped Bar Comparison
- Stacked Bar Composition
- Donut for Small Part-to-Whole
- Heatmap Matrix
- Scatter Relationship

### Technology stacks

Current seeded stacks include:

- React
- Next.js
- Vue
- Svelte
- SwiftUI
- React Native
- Flutter
- Tailwind CSS

### Recipes

Current seeded recipes include:

- Focused SaaS Analytics Dashboard
- AI Developer Workspace

This list is intentionally limited to the currently implemented canonical seed data. Future expansion must use meaningful, verified records rather than artificial count inflation.

## How to directly inspect/select a specific design record

Every catalog record has a stable ID.

Example:

```js
import {
  DI_STYLES,
  getAccessibleRecord,
} from '@motionzync/design-intelligence'

const style = getAccessibleRecord(
  DI_STYLES,
  'style-bento',
  'free'
)

console.log(style)
```

The same pattern can be used with palettes, typography, charts, stacks or recipes.

## Build → validate → export

A normal local workflow can look like this:

```js
import {
  buildRecipe,
  validateRecipe,
  recipeToExport,
  recipeToCSSVariables,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe(
  'professional SaaS analytics dashboard for a healthcare product',
  'free'
)

const validation = validateRecipe(recipe, 'free')

if (!validation.valid) {
  console.error(validation.errors)
}

console.log('Warnings:', validation.warnings)

const portable = recipeToExport(recipe)
const css = recipeToCSSVariables(recipe)

console.log(portable)
console.log(css)
```

The output can then be used by the developer's own UI-generation or component layer.

### Design tokens

You can also read the raw token object:

```js
const tokens = recipeToTokens(recipe)
console.log(tokens)
```

The generated token set includes the canonical palette, typography and base spacing/radius values exposed by the current recipe.

## Compatibility and quality checks

Design Intelligence does not intentionally combine records at random.

The canonical engine evaluates compatibility and can return:

- `compatible`
- `acceptable`
- `questionable`
- `incompatible`

The recipe validator also checks record references, tier access and recipe structure.

Example:

```js
console.log(recipe.compatibility.status)
console.log(recipe.compatibility.issues)
```

## Free/local usage

Free deterministic knowledge is designed to work locally after installing the package.

You can:

`search → build recipe → inspect relationships → validate → export`

without a MotionZync API key and without an external AI key for the deterministic core.

## Protected Premium / Ultra Premium+ knowledge

Protected MotionZync knowledge is server-authorized.

For remote protected knowledge, use the server-issued MotionZync credential:

```js
import { createRemoteKnowledgeClient } from '@motionzync/design-intelligence'

const client = createRemoteKnowledgeClient({
  baseUrl: 'https://motion-zync.vercel.app',
  bearerToken: 'SERVER_ISSUED_MOTIONZYNC_API_KEY',
})

const knowledge = await client.fetchKnowledge('styles')
```

Important:

- Do not put a provider BYOK key here.
- Do not invent a MotionZync API key.
- A provider API key is not proof of MotionZync entitlement.
- Protected access is checked by the MotionZync server.

## Ultra Premium+ special effects

Special animation/effects capability is API-only and requires an authorized Ultra Premium+ MotionZync API key:

```js
import { createSpecialEffectsClient } from '@motionzync/design-intelligence'

const effects = createSpecialEffectsClient({
  baseUrl: 'https://motion-zync.vercel.app',
  apiKey: 'SERVER_ISSUED_MOTIONZYNC_API_KEY',
})

const supported = await effects.listEffects()
console.log(supported)
```

The current API exposes a bounded set of safe CSS effects. It does not fabricate arbitrary executable JavaScript.

## Relationship to MotionZync Web

The web application and npm package are designed around the same canonical Design Intelligence core.

The intended architecture is:

`Web`
→ canonical Design Intelligence core

`npm / local`
→ canonical Design Intelligence core

`future CLI / API / MCP / AI agents`
→ same canonical Design Intelligence core

This avoids maintaining separate, conflicting design databases.

## Security and privacy boundary

The package does not contain Firebase Admin credentials, Cashfree secrets, npm publishing credentials or private MotionZync API-key values.

MotionZync API access remains server-authoritative.

The existing MotionZync BYOK system is separate from MotionZync entitlement. When a user supplies their own provider API key, processing occurs according to that provider's service and privacy terms.

Do not execute generated HTML/JavaScript as trusted code merely because it was returned by an AI model. Generated executable previews require appropriate isolation.

## What this package does not claim yet

The following are not claimed as completed merely because the package exists:

- 1,000+ or 10,000+ records
- automatic semantic search
- a complete CLI
- MCP/AI-agent runtime adapters
- full arbitrary HTML/React/Vue/etc. code generation
- production-wide screen-reader/device verification
- real provider execution for every BYOK model
- automatic payment activation in the public UI
- frontend-only premium entitlement

## Publication status

The repository contains the package and a guarded npm publication workflow.

Registry publication is a separate milestone from local package verification. Once the package is successfully published to npm, developers will be able to install it with:

```bash
npm install @motionzync/design-intelligence
```

Then normal imports work directly from the public package name.

## Source and repository

Repository:

https://github.com/darshandpatel63-prog/MotionZync

Package directory:

`src/pages/DesignIntelligence`

The package reuses the canonical repository implementation and does not maintain a second data source.
