/**
 * premium-3d-configurator-immersive-049 — Scene lighting console — Data-dense Tabbed
 * Category: 3d-configurator-immersive | Tier: Premium | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-3d-configurator-immersive-049 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">History</button>
        <button role="tab" aria-selected="false" className="mz-tab">Members</button>
        <button role="tab" aria-selected="false" className="mz-tab">Details</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Scene lighting console — Data-dense Tabbed</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-3d-configurator-immersive-049" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">317ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">351%</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement trend</h3>
            <p className="mz-metric">472%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":46 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":87 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":81 }}></span></div>
      </main>
    </div>
  );
}
