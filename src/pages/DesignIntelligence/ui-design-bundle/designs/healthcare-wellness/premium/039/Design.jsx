/**
 * premium-healthcare-wellness-039 — Wellness habit dashboard — Data-dense Responsive
 * Category: healthcare-wellness | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-039 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Reports</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Wellness habit dashboard — Data-dense Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-healthcare-wellness-039" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement overview</h3>
            <p className="mz-metric">541ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">908%</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput overview</h3>
            <p className="mz-metric">27k</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":69 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":31 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":86 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":66 }}></span><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":89 }}></span></div>
      </main>
    </div>
  );
}
