/**
 * premium-ai-agent-workflows-009 — Chat assistant workspace — Data-dense Asymmetric
 * Category: ai-agent-workflows | Tier: Premium | Layout: bento-modular
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ai-agent-workflows-009 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Start</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Chat assistant workspace — Data-dense Asymmetric</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-ai-agent-workflows-009" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement trend</h3>
            <p className="mz-metric">133ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement trend</h3>
            <p className="mz-metric">957%</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">554</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":56 }}></span><span className="mz-spark" style={{ "--h":41 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":90 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":73 }}></span></div>
      </main>
    </div>
  );
}
