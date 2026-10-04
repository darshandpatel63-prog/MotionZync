import {ULTRA_PREMIUM_PRICE_INR} from './access.js'
import './DesignIntelligence.css'
export default function DesignIntelligenceDocs(){return <div className="di-page">
  <section className="di-page-intro"><span className="di-kicker">HOW TO USE</span><h1>Design Intelligence workflow</h1><p>This page is the in-product explanation a new user should be able to read before touching the generator.</p></section>

  <section className="di-grid-2">
    <article className="di-surface"><span className="di-step">01</span><h2>Describe</h2><p>Tell the system what you are building, for whom, on which platform, with what mood, constraints and data needs.</p></article>
    <article className="di-surface"><span className="di-step">02</span><h2>Interpret</h2><p>The deterministic core extracts basic product, industry, platform, color/mode and mood signals. Nothing is hidden behind an LLM.</p></article>
    <article className="di-surface"><span className="di-step">03</span><h2>Search</h2><p>The engine searches structured records and relationships. Later semantic search can improve this without duplicating the dataset.</p></article>
    <article className="di-surface"><span className="di-step">04</span><h2>Check compatibility</h2><p>Choices should be reviewed together: contrast, chart suitability, typography readability, responsive behaviour and technology support.</p></article>
    <article className="di-surface"><span className="di-step">05</span><h2>Review the recipe</h2><p>The recipe tells you style, palette, typography, navigation, layout, charts, UX and stack direction.</p></article>
    <article className="di-surface"><span className="di-step">06</span><h2>Generate / export</h2><p>Future adapters will produce HTML/CSS, React, Next.js, Vue, Svelte, Flutter, React Native, CSS variables, JSON and design tokens where supported.</p></article>
  </section>

  <section className="di-surface">
    <span className="di-kicker">FREE VS PREMIUM VS ULTRA</span>
    <h2>What access means</h2>
    <div className="di-table">
      <div><b>Free · no login</b><span>Simple/public knowledge and free recipes can be used immediately.</span></div>
      <div><b>Premium · Google login · ₹0</b><span>Verified Firebase identity unlocks Premium protected knowledge server-side and keeps the same canonical core available for npm/local usage.</span></div>
      <div><b>Ultra Premium+ · ₹{ULTRA_PREMIUM_PRICE_INR}</b><span>Paid server-authorized tier with all web-accessible knowledge and developer API access.</span></div>
      <div><b>Special animation + effects</b><span>API-only; requires Ultra Premium+ and a valid server-issued API key.</span></div>
    </div>
  </section>

  <section className="di-surface">
    <span className="di-kicker">SPECIAL ANIMATION + EFFECTS API</span>
    <h2>Ultra Premium+ developer capability</h2>
    <p>The API now exposes a bounded, server-authorized special-effects capability. A valid Ultra Premium+ MotionZync API key can list supported effects and request a safe CSS implementation for the selected effect. The service returns CSS only; it does not return or execute arbitrary JavaScript. POST requests are additionally capped at 16 KB before effect generation.</p>
    <p className="di-muted">Current capability includes Shimmer, Float, Glow Pulse, Gradient Shift and Spin. Each effect includes a reduced-motion fallback. Cross-origin browser use is deny-by-default until an origin is explicitly configured in the server allowlist.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">NPM / DEVELOPER MODE</span>
    <h2>Install the published canonical core</h2>
    <p>The public npm package is now published as <b>@motionzync/design-intelligence@0.1.0</b>. It uses the same canonical Design Intelligence core as the web app and does not create a second database.</p>
    <pre className="di-code">npm install @motionzync/design-intelligence</pre>
    <p>The package exposes the deterministic search engine, requirement-to-recipe engine, compatibility and validation helpers, canonical catalog records, relationships and supported recipe export helpers. Protected knowledge and Ultra Premium+ effects remain server-authorized capabilities.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">IMPORTANT</span>
    <h2>What is not live yet</h2>
    <p>Live ₹{ULTRA_PREMIUM_PRICE_INR} Cashfree checkout, production API-key usage, MCP service, large-scale content ingestion and final accessibility/performance automation remain verification/release milestones. The public npm package @motionzync/design-intelligence@0.1.0 has been published and its clean registry-backed installation/import has been verified. The access contract and server-side enforcement foundation are being aligned now; no fake API key or fake payment is created.</p>
  </section>
</div>}
