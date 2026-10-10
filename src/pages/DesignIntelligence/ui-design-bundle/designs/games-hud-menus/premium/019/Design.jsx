/**
 * premium-games-hud-menus-019 — In-game HUD overlay — Data-dense Multi-Monitor
 * Category: games-hud-menus | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-019 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">In-game HUD overlay — Data-dense Multi-Monitor</h2>
          <p>Snapshot of what needs attention today.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-games-hud-menus-019" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-games-hud-menus-019" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Throughput overview</h3>
            <p className="mz-metric">135k</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency overview</h3>
            <p className="mz-metric">875%</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput summary</h3>
            <p className="mz-metric">877%</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":33 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":46 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":40 }}></span></div>
      </main>
    </div>
  );
}
