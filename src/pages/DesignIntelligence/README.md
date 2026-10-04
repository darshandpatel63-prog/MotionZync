
# @motionzync/design-intelligence

MotionZync Design Intelligence is a reusable, deterministic design-knowledge core for searching design patterns, selecting compatible design ingredients, building Design Recipes, validating combinations, and exporting design tokens.

It is the same canonical core used by MotionZync Web. The npm adapter does **not** create a second Design Intelligence database.

## Installation

After the package is published to the public npm registry:

```bash
npm install @motionzync/design-intelligence
```

Then import the API from the package:

```js
import {
  buildRecipe,
  searchCatalog,
  evaluateCompatibility,
  validateRecipe,
  recipeToTokens,
  recipeToCSSVariables,
  recipeToExport,
  DI_STYLES,
  DI_PALETTES,
  DI_TYPOGRAPHY,
  DI_CHARTS,
  DI_STACKS,
  DI_RECIPES,
} from '@motionzync/design-intelligence'
```

## What npm users can do

The package currently gives developers a deterministic design-intelligence toolkit. You can:

1. Search the canonical seed catalog.
2. Read individual styles, palettes, typography pairings, charts, technology stacks and recipes.
3. Generate a Design Recipe from a plain-language requirement.
4. Keep recipe selection inside the requested entitlement tier.
5. Check whether the selected design pieces are compatible.
6. Validate a recipe before using it in an application.
7. Convert a recipe into design-token objects.
8. Convert a recipe into CSS custom-property declarations.
9. Convert a recipe into portable JSON.
10. Connect to protected MotionZync knowledge through the server-authorized remote client.
11. Connect to the Ultra Premium+ special-effects API when you have an authorized MotionZync API key.

The deterministic core does not require an external AI provider.

## Choose a design directly

Every catalog record has a stable canonical ID. You can inspect the public seed catalog and select exactly the design ingredient you need.

```js
import {
  DI_STYLES,
  DI_PALETTES,
  DI_TYPOGRAPHY,
  DI_CHARTS,
  DI_STACKS,
} from '@motionzync/design-intelligence'

const style = DI_STYLES.find(item => item.id === 'style-minimalism')
const palette = DI_PALETTES.find(item => item.id === 'palette-health-teal')
const typography = DI_TYPOGRAPHY.find(item => item.id === 'type-inter-inter')
const chart = DI_CHARTS.find(item => item.id === 'chart-kpi-line')
const stack = DI_STACKS.find(item => item.id === 'stack-react')
```

Use the returned record data as structured input to your own UI system. The package does not force one fixed visual template.

## Search for a design

Search is deterministic and lexical. It looks across useful record fields such as name, description, tags, suited-for information, stack focus, layout, navigation, UX and chart purpose.

```js
import { searchCatalog } from '@motionzync/design-intelligence'

const styles = searchCatalog('minimal', 'styles', 'free')
const stacks = searchCatalog('developer', 'stacks', 'free')
const dashboardRecipes = searchCatalog('dashboard', 'recipes', 'free')
```

You can also search all supported public domains:

```js
const results = searchCatalog('accessibility', 'all', 'free')
```

The current semantic/LLM search layer is not part of this deterministic npm API yet.

## Generate a design from a requirement

The simplest developer workflow is:

**requirement → interpretation → compatible recipe → tokens / JSON**

```js
import {
  buildRecipe,
  recipeToExport,
  recipeToCSSVariables,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe(
  'healthcare dashboard web dark professional',
  'free',
)

console.log(recipe.style.name)
console.log(recipe.palette.name)
console.log(recipe.typography.name)
console.log(recipe.layout)
console.log(recipe.navigation)
console.log(recipe.compatibility)

const portableRecipe = recipeToExport(recipe)
const css = recipeToCSSVariables(recipe)

console.log(portableRecipe)
console.log(css)
```

The parser currently recognizes basic product, industry, platform, light/dark and mood signals. More advanced natural-language interpretation is a future enhancement.

## Build the design yourself

A Design Recipe is structured, so you can change the selected ingredients in your own code and run validation before using the result.

A recipe contains canonical references for:

- style
- palette
- typography
- chart
- technology stack
- layout
- navigation
- UX guidance
- composition family
- entitlement tier
- compatibility result
- warnings

This makes the package useful as a design decision layer inside your own UI generator, component library, application, CLI or build system.

## Validate compatibility

Use the compatibility engine to detect combinations that need review.

```js
import {
  buildRecipe,
  evaluateCompatibility,
  validateRecipe,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe('analytics dashboard dark technical', 'free')

const compatibility = evaluateCompatibility(recipe)
const validation = validateRecipe(recipe, 'free')

if (!validation.valid) {
  console.error(validation.errors)
}

console.log(compatibility.status)
console.log(compatibility.issues)
```

Possible compatibility states are:

- `compatible`
- `acceptable`
- `questionable`
- `incompatible`

The package does not claim that every combination is automatically correct. The result is intended to be reviewed by the developer or generation pipeline.

## Turn a recipe into design tokens

```js
import {
  buildRecipe,
  recipeToTokens,
  recipeToCSSVariables,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe('saas dashboard professional', 'free')

const tokens = recipeToTokens(recipe)

const cssVariables = recipeToCSSVariables(recipe)

console.log(tokens)
/*
{
  '--mz-primary': '...',
  '--mz-secondary': '...',
  '--mz-accent': '...',
  '--mz-cta': '...',
  '--mz-background': '...',
  '--mz-surface': '...',
  '--mz-text': '...',
  '--mz-muted': '...',
  '--mz-radius': '16px',
  '--mz-spacing': '8px',
  '--mz-font-heading': '...',
  '--mz-font-body': '...'
}
*/

console.log(cssVariables)
```

You can attach these values to your own CSS, design-system layer or component theme.

## Portable recipe JSON

```js
import {
  buildRecipe,
  recipeToExport,
} from '@motionzync/design-intelligence'

const recipe = buildRecipe('portfolio editorial web', 'free')
const json = recipeToExport(recipe)

console.log(JSON.stringify(json, null, 2))
```

The exported object uses the MotionZync Design Recipe format and stable canonical IDs so another compatible MotionZync adapter can resolve the same ingredients.

## Current public catalog

The Phase-A package currently contains a deliberately bounded seed set. It is real structured content, not filler data.

### Styles

Minimalism, Glassmorphism, Neumorphism, Brutalism, Neo-Brutalism, Bento, Claymorphism, Aurora UI, Editorial, Dark UI.

### Palettes

Slate + Cyan, Violet + Indigo, Healthcare Teal, Warm Amber.

### Typography

Inter + Inter, Space Grotesk + Inter, Playfair Display + Inter, Manrope + Inter, DM Sans + DM Sans.

### Charts

KPI + Time Series, Grouped Bar Comparison, Stacked Bar Composition, Donut for Small Part-to-Whole, Heatmap Matrix, Scatter Relationship.

### Technology stacks

React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind CSS.

### Ready-made recipes

Focused SaaS Analytics Dashboard, AI Developer Workspace.

The project deliberately does **not** claim 1,000+ or 10,000+ implemented records yet. Large-scale content expansion is a future verified-data milestone.

## Protected MotionZync knowledge

The package also exposes a remote client for the server-authoritative MotionZync knowledge API.

```js
import { createRemoteKnowledgeClient } from '@motionzync/design-intelligence'

const client = createRemoteKnowledgeClient({
  baseUrl: 'https://motion-zync.vercel.app',
  bearerToken: process.env.MOTIONZYNC_API_KEY,
})

const knowledge = await client.fetchKnowledge('styles')
```

The bearer token must be authorized by MotionZync. A provider BYOK key is not a substitute for MotionZync entitlement.

For security, keep MotionZync API keys in a server-side or otherwise appropriate protected environment. Do not publish them in client-side source, public repositories or screenshots.

## Ultra Premium+ special effects

Authorized Ultra Premium+ developers can use the same package adapter for the special-effects API:

```js
import { createSpecialEffectsClient } from '@motionzync/design-intelligence'

const effects = createSpecialEffectsClient({
  baseUrl: 'https://motion-zync.vercel.app',
  apiKey: process.env.MOTIONZYNC_API_KEY,
})

const available = await effects.listEffects()

const result = await effects.createEffect('shimmer', {
  durationMs: 1400,
})
```

The current bounded effects capability includes:

- Shimmer
- Float
- Glow Pulse
- Gradient Shift
- Spin

The server controls entitlement and the allowed capability set. The effects API returns CSS and includes reduced-motion fallbacks; it does not execute arbitrary JavaScript.

## Access model

The package follows the MotionZync access model:

**Free**

Public deterministic knowledge and recipes can be used locally.

**Premium**

Protected knowledge can be delivered by the MotionZync server after the existing Google/Firebase identity is verified server-side.

**Ultra Premium+**

Protected developer API access and special-effects API access require a server-authorized Ultra Premium+ entitlement and a valid MotionZync API key.

The npm package never fabricates an entitlement or a MotionZync API key.

## What this package does not currently provide

The current `0.1.0` package does not claim:

- executable React/Next.js/Vue/Svelte/Flutter code generation
- a standalone CLI binary
- an MCP server
- semantic/LLM search as a built-in requirement
- a second Design Intelligence database
- thousands of fabricated records
- offline access to protected Premium/Ultra knowledge without server authorization

Those are separate future milestones unless/ until their implementations are actually published and verified.

## Canonical-core architecture

MotionZync uses one canonical Design Intelligence core:

**Web → npm → future CLI/API → future MCP/AI-agent adapters**

The goal is to keep the same IDs, schemas, relationships, compatibility rules and Design Recipe model across interfaces rather than maintaining separate datasets.

## Registry publication status

Source package, metadata, tarball creation and clean local installation have been verified in CI.

Public npm registry publication and a registry-backed external installation are currently a separate release gate and are not claimed as complete until the registry package is actually available.

Once published, the public installation command is:

```bash
npm install @motionzync/design-intelligence
```

Repository: https://github.com/darshandpatel63-prog/MotionZync

Web: https://motion-zync.vercel.app/design-intelligence
