/**
 * premium-editorial-portfolio-creator-079 — Video essay gallery — Data-dense Master-Detail
 * Category: editorial-portfolio-creator | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-editorial-portfolio-creator-079 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-editorial-portfolio-creator-079" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Video essay gallery — Data-dense Master-Detail</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="premium-editorial-portfolio-creator-079" />
          </section>
        </div>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention trend</h3>
            <p className="mz-metric">20</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention overview</h3>
            <p className="mz-metric">66ms</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency overview</h3>
            <p className="mz-metric">172k</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":61 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":69 }}></span></div>
      </main>
    </div>
  );
}
