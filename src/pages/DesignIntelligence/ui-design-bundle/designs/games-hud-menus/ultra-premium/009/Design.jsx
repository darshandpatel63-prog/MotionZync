/**
 * ultra-games-hud-menus-009 — Main menu scene — Data-dense Advanced
 * Category: games-hud-menus | Tier: Ultra Premium+ | Layout: editorial-column
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-games-hud-menus-009 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Feature</p><h2>Main menu scene — Data-dense Advanced</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="ultra-games-hud-menus-009" />
        </article>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">263</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue summary</h3>
            <p className="mz-metric">310ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency breakdown</h3>
            <p className="mz-metric">637ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":51 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":70 }}></span><span className="mz-spark" style={{ "--h":69 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":78 }}></span><span className="mz-spark" style={{ "--h":26 }}></span><span className="mz-spark" style={{ "--h":54 }}></span></div>
      </main>
    </div>
  );
}
