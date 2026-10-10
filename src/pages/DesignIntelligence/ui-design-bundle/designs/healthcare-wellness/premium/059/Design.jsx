/**
 * premium-healthcare-wellness-059 — Lab results explorer — Data-dense Vertical
 * Category: healthcare-wellness | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-059 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Lab results explorer — Data-dense Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-healthcare-wellness-059" /></ol>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention overview</h3>
            <p className="mz-metric">551ms</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Accuracy breakdown</h3>
            <p className="mz-metric">488ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime breakdown</h3>
            <p className="mz-metric">550</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":40 }}></span><span className="mz-spark" style={{ "--h":77 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":78 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":53 }}></span></div>
      </main>
    </div>
  );
}
