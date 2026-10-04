import {useState} from 'react'
import './DesignIntelligence.css'

function CopyCommand({children}) {
  const [copied,setCopied]=useState(false)
  const copy=async()=>{
    try{
      await navigator.clipboard.writeText(String(children))
      setCopied(true)
      window.setTimeout(()=>setCopied(false),1600)
    }catch{
      setCopied(false)
    }
  }
  return <div className="di-code-wrap">
    <pre className="di-code">{children}</pre>
    <button type="button" className="di-copy-btn" onClick={copy} aria-label={copied?'Copied command':'Copy command'}>
      {copied?'Copied':'Copy'}
    </button>
  </div>
}

export default function DesignIntelligenceDocs(){return <div className="di-page">
  <section className="di-page-intro">
    <span className="di-kicker">HOW TO USE</span>
    <h1>Design Intelligence workflow</h1>
    <p>This page explains how to use the same canonical Design Intelligence core from the MotionZync web app and the npm package.</p>
  </section>

  <section className="di-grid-2">
    <article className="di-surface"><span className="di-step">01</span><h2>Describe</h2><p>Tell the system what you are building, for whom, on which platform, with which mood and constraints.</p></article>
    <article className="di-surface"><span className="di-step">02</span><h2>Interpret</h2><p>The deterministic core extracts product, industry, platform, light/dark mode and mood signals without requiring an LLM.</p></article>
    <article className="di-surface"><span className="di-step">03</span><h2>Search</h2><p>Search structured styles, palettes, typography, charts, stacks and recipes, then choose the direction that fits the product.</p></article>
    <article className="di-surface"><span className="di-step">04</span><h2>Check compatibility</h2><p>Review compatibility warnings for contrast, chart suitability, typography, mode and other recipe constraints.</p></article>
    <article className="di-surface"><span className="di-step">05</span><h2>Review the recipe</h2><p>The recipe combines the selected style, palette, typography, navigation, layout, charts, UX and technology direction.</p></article>
    <article className="di-surface"><span className="di-step">06</span><h2>Export</h2><p>Current Phase-A exports include portable recipe JSON and CSS custom-property tokens. Rich executable code exporters are future work.</p></article>
  </section>

  <section className="di-surface">
    <span className="di-kicker">NPM / DEVELOPER MODE</span>
    <h2>Install the same canonical core</h2>
    <p>After the package is published to the public npm registry, any developer can install it with the standard npm command. No separate database is created.</p>
    <CopyCommand>npm install @motionzync/design-intelligence</CopyCommand>
    <p>Then a developer can search and compose designs directly:</p>
    <CopyCommand>{`import { searchCatalog, buildRecipe, recipeToCSSVariables } from '@motionzync/design-intelligence'

const styles = searchCatalog('healthcare minimal', 'styles', 'free')
const recipe = buildRecipe('dark healthcare analytics dashboard', 'free')
const css = recipeToCSSVariables(recipe)

console.log(styles)
console.log(recipe.style.name, recipe.palette.name, recipe.typography.name)
console.log(css)`}</CopyCommand>
    <p className="di-muted">The npm package exposes the canonical design records, deterministic engine, schema, search index, relationships, validation helpers and supported export helpers.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">WHAT YOU CAN CHOOSE</span>
    <h2>Design directions available in the current seed</h2>
    <div className="di-table">
      <div><b>Styles</b><span>Minimalism, Glassmorphism, Neumorphism, Brutalism, Neo-Brutalism, Bento, Claymorphism, Aurora UI, Editorial, Dark UI.</span></div>
      <div><b>Palettes</b><span>Slate + Cyan, Violet + Indigo, Healthcare Teal, Warm Amber.</span></div>
      <div><b>Typography</b><span>Inter + Inter, Space Grotesk + Inter, Playfair Display + Inter, Manrope + Inter, DM Sans + DM Sans.</span></div>
      <div><b>Charts</b><span>KPI + Time Series, Grouped Bar Comparison, Stacked Bar Composition, Donut, Heatmap Matrix, Scatter Relationship.</span></div>
      <div><b>Stacks</b><span>React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter and Tailwind CSS.</span></div>
    </div>
  </section>

  <section className="di-surface">
    <span className="di-kicker">ACCESS MODEL</span>
    <h2>Free, Premium and Ultra Premium+</h2>
    <div className="di-table">
      <div><b>Free · no login</b><span>Simple/public knowledge, deterministic recipes and supported free exports.</span></div>
      <div><b>Premium · Google login · ₹0</b><span>Verified Firebase identity can unlock protected Premium knowledge through the server-authoritative access path.</span></div>
      <div><b>Ultra Premium+ · payment launch pending</b><span>Paid server-authorized tier reserved for the later payment launch. The public checkout is temporarily disabled.</span></div>
      <div><b>Special animation + effects</b><span>API-only capability requiring Ultra Premium+ and a valid server-issued MotionZync API key.</span></div>
    </div>
  </section>

  <section className="di-surface">
    <span className="di-kicker">SPECIAL ANIMATION + EFFECTS API</span>
    <h2>Ultra Premium+ developer capability</h2>
    <p>The API exposes a bounded, server-authorized special-effects capability. An authorized Ultra Premium+ API key can list supported effects and request a safe CSS implementation. The service returns CSS only and does not execute arbitrary JavaScript.</p>
    <p className="di-muted">Current bounded effects: Shimmer, Float, Glow Pulse, Gradient Shift and Spin. Each includes a reduced-motion fallback. Cross-origin browser use is deny-by-default until an allowed origin is configured on the server.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">ONE SOURCE OF TRUTH</span>
    <h2>Web → npm → future interfaces</h2>
    <p>The web app, npm/local mode, future CLI, REST API and future MCP/AI-agent interfaces are designed to use the same canonical Design Intelligence core. No duplicate design database is introduced for npm.</p>
  </section>

  <section className="di-surface">
    <span className="di-kicker">PAYMENT STATUS</span>
    <h2>Public payment launch is temporarily pending</h2>
    <p>The public payment UI is currently held back while the payment launch is prepared. The server-side Cashfree order, webhook verification, entitlement and API-key security infrastructure remains in the repository and is not being removed.</p>
  </section>
</div>}
