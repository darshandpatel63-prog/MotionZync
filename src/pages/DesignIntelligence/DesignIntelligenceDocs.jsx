import './DesignIntelligence.css'
export default function DesignIntelligenceDocs(){return <div className="di-page">
  <section className="di-page-intro"><span className="di-kicker">HOW TO USE</span><h1>Design Intelligence workflow</h1><p>This page is the in-product explanation a new user should be able to read before touching the generator.</p></section>

  <section className="di-grid-2">
    <article className="di-surface"><span className="di-step">01</span><h2>Describe</h2><p>Tell the system what you are building, for whom, on which platform, with what mood, constraints and data needs.</p></article>
    <article className="di-surface"><span className="di-step">02</span><h2>Interpret</h2><p>The deterministic core extracts basic product, industry, platform, color/mode and mood signals. Nothing is hidden behind an LLM.</p></article>
    <article className="di-surface"><span className="di-step">03</span><h2>Search</h2><p>The engine searches structured records and relationships. Later semantic search can improve this without duplicating the dataset.</p></article>
    <article className="di-surface"><span className="di-step">04</span><h2>Check compatibility</h2><p>Choices should be reviewed together: contrast, chart suitability, typography readability, responsive behaviour and technology support.</p></article>
    <article className="di-surface"><span className="di-step">05</span><h2>Review the recipe</h2><p>The recipe tells you style, palette, typography, navigation, layout, charts, UX and stack direction.</p></article>
    <article className="di-surface"><span className="di-step">06</span><h2>Use the output</h2><p>Phase A exports canonical recipe JSON, design-token objects and CSS custom-property declarations. Executable UI/code-generation adapters are separate future milestones.</p></article>
  </section>

  <section className="di-surface">
    <span className="di-kicker">NPM / DEVELOPER MODE</span>
    <h2>Use the same Design Intelligence core in your own project</h2>
    <p>After the public npm release, install the package with <code>npm install @motionzync/design-intelligence</code>. The package exposes deterministic search, canonical design records, recipe generation, compatibility checks, recipe validation, design tokens and portable recipe JSON without requiring an AI provider.</p>
    <div className="di-code">import {'{ buildRecipe, searchCatalog, recipeToTokens, recipeToExport }'} from '@motionzync/design-intelligence'{'\n\n'}const recipe = buildRecipe('healthcare dashboard web dark professional', 'free'){'\n'}const styles = searchCatalog('minimal', 'styles', 'free'){'\n'}const tokens = recipeToTokens(recipe){'\n'}const json = recipeToExport(recipe)</div>
    <p className="di-muted">You can choose a design directly by canonical record ID, search by meaningful terms, or start from a requirement and let the deterministic engine compose a Design Recipe. Protected Premium/Ultra knowledge is still server-authorized.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">FREE VS PREMIUM VS ULTRA</span>
    <h2>What access means</h2>
    <div className="di-table">
      <div><b>Free · no login</b><span>Simple/public knowledge and free recipes can be used immediately.</span></div>
      <div><b>Premium · Google login · no payment shown here</b><span>Verified Firebase identity unlocks Premium protected knowledge server-side and keeps the same canonical core available for npm/local usage.</span></div>
      <div><b>Ultra Premium+</b><span>The paid server-authorized tier is currently pending public payment launch. Developer API access will remain server-controlled.</span></div>
      <div><b>Special animation + effects</b><span>API-only; requires Ultra Premium+ and a valid server-issued API key.</span></div>
    </div>
  </section>

  <section className="di-surface">
    <span className="di-kicker">SPECIAL ANIMATION + EFFECTS API</span>
    <h2>Ultra Premium+ developer capability</h2>
    <p>The API exposes a bounded, server-authorized special-effects capability. A valid Ultra Premium+ MotionZync API key can list supported effects and request a safe CSS implementation for the selected effect. The service returns CSS only; it does not return or execute arbitrary JavaScript. POST requests are additionally capped at 16 KB before effect generation.</p>
    <p className="di-muted">Current capability includes Shimmer, Float, Glow Pulse, Gradient Shift and Spin. Each effect includes a reduced-motion fallback. Cross-origin browser use is deny-by-default until an origin is explicitly configured in the server allowlist.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">PUBLIC PACKAGE GUIDE</span>
    <h2>What can you get from npm?</h2>
    <p>Use the package to search and select styles such as Minimalism, Glassmorphism, Bento or Editorial; choose palettes and typography; select appropriate charts and technology stacks; generate a structured recipe; inspect compatibility warnings; and export tokens or portable JSON into your own application.</p>
    <p>For example, a developer can search for <code>dashboard</code>, select a chart and React stack, or generate a recipe from a requirement such as <code>healthcare dashboard web dark professional</code>. The package supplies structured design intelligence; your own application remains responsible for rendering the final UI.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">IMPORTANT</span>
    <h2>Current release boundary</h2>
    <p>Public payment launch is temporarily pending. Cashfree order/webhook/security infrastructure remains in the server code but is not exposed as a public checkout flow. Public npm registry publication, registry-backed installation, richer executable code-generation adapters, MCP service and large-scale content expansion are separate release/verification milestones.</p>
  </section>
</div>}