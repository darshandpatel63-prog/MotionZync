/**
 * premium-3d-configurator-immersive-019 — Room layout planner — Data-dense Data
 * Category: 3d-configurator-immersive | Tier: Premium | Layout: table-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TABLEROWS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-3d-configurator-immersive-019 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">New entry</button>
      </header>
      <main className="mz-main">
        <div className="mz-toolbar" role="toolbar" aria-label="Table tools">
          <input className="mz-input" type="search" aria-label="Search rows" placeholder="Search…" />
          <button type="button" className="mz-btn">Filter</button>
          <button type="button" className="mz-btn mz-btn--primary">New record</button>
        </div>
        <table className="mz-table">
          <caption className="mz-sr-only">Room layout planner — Data-dense Data</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Updated</th></tr></thead>
          <tbody><TABLEROWS seed="premium-3d-configurator-immersive-019" /></tbody>
        </table>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity summary</h3>
            <p className="mz-metric">125k</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage summary</h3>
            <p className="mz-metric">252ms</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">107%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":85 }}></span><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":33 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":82 }}></span></div>
      </main>
    </div>
  );
}
