/**
 * ultra-finance-fintech-039 — Portfolio holdings analyzer — Data-dense Advanced
 * Category: finance-fintech | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-finance-fintech-039 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Portfolio holdings analyzer — Data-dense Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-finance-fintech-039" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Portfolio holdings analyzer — Data-dense Advanced</h2>
          <CARDS2 seed="ultra-finance-fintech-039" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Accuracy trend</h3>
            <p className="mz-metric">548</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime summary</h3>
            <p className="mz-metric">682</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement summary</h3>
            <p className="mz-metric">978ms</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":60 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":26 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":70 }}></span><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":93 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":62 }}></span><span className="mz-spark" style={{ "--h":88 }}></span></div>
      </main>
    </div>
  );
}
