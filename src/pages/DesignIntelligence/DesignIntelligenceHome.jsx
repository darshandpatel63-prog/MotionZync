import {Link} from 'react-router-dom'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS} from './catalog.js'
import {ULTRA_PREMIUM_PRICE_INR} from './access.js'
import './DesignIntelligence.css'
const Stat=({value,label})=><div className="di-stat"><strong>{value}</strong><span>{label}</span></div>
export default function DesignIntelligenceHome(){
  return <div className="di-page">
    <section className="di-hero">
      <div className="di-eyebrow">DESIGN INTELLIGENCE + UI GENERATION</div>
      <h1>From a rough idea to a <span>usable interface recipe.</span></h1>
      <p>Search design knowledge, assemble compatible choices, generate a deterministic Design Recipe, preview it, and export the structure. AI can enhance the process later; the core does not depend on an LLM.</p>
      <div className="di-actions"><Link to="/design-intelligence/generator" className="di-btn di-btn-primary">Start generating →</Link><Link to="/design-intelligence/explorer" className="di-btn di-btn-secondary">Explore knowledge</Link></div>
      <div className="di-stats"><Stat value={DI_STYLES.length} label="seed styles"/><Stat value={DI_PALETTES.length} label="seed palettes"/><Stat value={DI_TYPOGRAPHY.length} label="font pairings"/><Stat value={DI_CHARTS.length} label="chart patterns"/><Stat value={DI_STACKS.length} label="tech stacks"/></div>
      <p className="di-truth">These are current seed records, not a claim of 1,000+ implemented records. The architecture is intended to scale without fake duplicates.</p>
    </section>

    <section className="di-grid-3">
      <article className="di-feature-card"><span>01</span><h2>Discover</h2><p>Search and filter structured design knowledge by style, palette, typography, chart, stack and recipe.</p><Link to="/design-intelligence/explorer">Open Explorer →</Link></article>
      <article className="di-feature-card"><span>02</span><h2>Generate</h2><p>Enter a product requirement. The deterministic engine interprets basic constraints and assembles compatible choices.</p><Link to="/design-intelligence/generator">Open Generator →</Link></article>
      <article className="di-feature-card"><span>03</span><h2>Use</h2><p>Review the recipe, tokens, warnings and implementation direction. Access level is enforced separately from the deterministic core.</p><Link to="/design-intelligence/docs">Read workflow →</Link></article>
    </section>

    <section className="di-surface">
      <span className="di-kicker">ACCESS</span>
      <h2>Three clear levels</h2>
      <div className="di-table">
        <div><b>Free · no login</b><span>Simple/public designs and normal web use.</span></div>
        <div><b>Premium · Google login · ₹0</b><span>Premium protected knowledge and generation, plus the same canonical core for npm use.</span></div>
        <div><b>Ultra Premium+ · ₹{ULTRA_PREMIUM_PRICE_INR}</b><span>All web-accessible Design Intelligence knowledge and the developer API.</span></div>
        <div><b>Special animation + effects</b><span>Only through the Ultra Premium+ API; not a free/premium browser-only feature.</span></div>
      </div>
      <Link to="/design-intelligence/pricing">See the full access model →</Link>
    </section>

    <section className="di-surface">
      <span className="di-kicker">ARCHITECTURE</span>
      <h2>One canonical intelligence core</h2>
      <div className="di-flow"><div>Canonical data</div><b>→</b><div>Deterministic search</div><b>→</b><div>Compatibility + ranking</div><b>→</b><div>Design Recipe</div><b>→</b><div>Web / npm / API / AI adapters</div></div>
      <p className="di-muted">The same source of truth is intended to power browser use, npm/local access and future API + MCP/AI-agent access. No duplicate knowledge databases.</p>
    </section>
  </div>
}
