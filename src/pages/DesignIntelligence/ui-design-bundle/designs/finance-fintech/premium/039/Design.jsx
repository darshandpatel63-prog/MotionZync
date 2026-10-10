/**
 * premium-finance-fintech-039 — Portfolio holdings analyzer — Data-dense Full-Bleed
 * Category: finance-fintech | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-039 mz-density--compact" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Portfolio holdings analyzer — Data-dense Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-finance-fintech-039" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Portfolio holdings analyzer — Data-dense Full-Bleed</h2>
          <CARDS2 seed="premium-finance-fintech-039" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Uptime overview</h3>
            <p className="mz-metric">851k</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement summary</h3>
            <p className="mz-metric">229ms</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage breakdown</h3>
            <p className="mz-metric">834ms</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":77 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":78 }}></span><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":41 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":64 }}></span></div>
      </main>
    </div>
  );
}
