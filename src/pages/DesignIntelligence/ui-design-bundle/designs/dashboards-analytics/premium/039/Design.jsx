/**
 * premium-dashboards-analytics-039 — Realtime ops pulse — Data-dense Responsive
 * Category: dashboards-analytics | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-dashboards-analytics-039 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Settings</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Realtime ops pulse — Data-dense Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-dashboards-analytics-039" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Uptime overview</h3>
            <p className="mz-metric">995ms</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime summary</h3>
            <p className="mz-metric">112%</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">613k</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":62 }}></span><span className="mz-spark" style={{ "--h":85 }}></span><span className="mz-spark" style={{ "--h":61 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":99 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":22 }}></span></div>
      </main>
    </div>
  );
}
