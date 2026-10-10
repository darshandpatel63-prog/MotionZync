/**
 * premium-games-hud-menus-059 — World map navigator — Data-dense Vertical
 * Category: games-hud-menus | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-059 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">World map navigator — Data-dense Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-games-hud-menus-059" /></ol>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention breakdown</h3>
            <p className="mz-metric">127%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">611</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue overview</h3>
            <p className="mz-metric">898%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":99 }}></span><span className="mz-spark" style={{ "--h":70 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":68 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":57 }}></span></div>
      </main>
    </div>
  );
}
