/**
 * ultra-education-learning-059 — Study group lounge — Data-dense Advanced
 * Category: education-learning | Tier: Ultra Premium+ | Layout: bento-modular
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-education-learning-059 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Create</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Study group lounge — Data-dense Advanced</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-education-learning-059" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Accuracy overview</h3>
            <p className="mz-metric">897ms</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">420ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue summary</h3>
            <p className="mz-metric">804%</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":32 }}></span><span className="mz-spark" style={{ "--h":40 }}></span><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":66 }}></span><span className="mz-spark" style={{ "--h":58 }}></span></div>
      </main>
    </div>
  );
}
