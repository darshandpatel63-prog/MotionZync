/**
 * ultra-saas-admin-workspaces-009 — Team member directory — Data-dense Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-009 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Team member directory — Data-dense Advanced</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-saas-admin-workspaces-009" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Throughput trend</h3>
            <p className="mz-metric">819</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention summary</h3>
            <p className="mz-metric">429k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Accuracy summary</h3>
            <p className="mz-metric">858%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":99 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":98 }}></span></div>
      </main>
    </div>
  );
}
