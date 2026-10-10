/**
 * premium-healthcare-wellness-009 — Appointment booking flow — Data-dense Single
 * Category: healthcare-wellness | Tier: Premium | Layout: editorial-column
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-009 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Deep dive</p><h2>Appointment booking flow — Data-dense Single</h2></header>
          <p className="mz-lede">Designed for long, comfortable reading sessions.</p>
          <PARAGRAPHS seed="premium-healthcare-wellness-009" />
        </article>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Uptime overview</h3>
            <p className="mz-metric">132%</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity overview</h3>
            <p className="mz-metric">46ms</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention trend</h3>
            <p className="mz-metric">284k</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":28 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":87 }}></span></div>
      </main>
    </div>
  );
}
