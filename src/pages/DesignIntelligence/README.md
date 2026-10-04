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
