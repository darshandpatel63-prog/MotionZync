/**
 * ultra-education-learning-089 — Certificate showcase wall — Data-dense Advanced
 * Category: education-learning | Tier: Ultra Premium+ | Layout: table-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TABLEROWS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-education-learning-089 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <div className="mz-toolbar" role="toolbar" aria-label="Table tools">
          <input className="mz-input" type="search" aria-label="Search rows" placeholder="Search…" />
          <button type="button" className="mz-btn">Filter</button>
          <button type="button" className="mz-btn mz-btn--primary">New record</button>
        </div>
        <table className="mz-table">
          <caption className="mz-sr-only">Certificate showcase wall — Data-dense Advanced</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Updated</th></tr></thead>
          <tbody><TABLEROWS seed="ultra-education-learning-089" /></tbody>
        </table>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Revenue overview</h3>
            <p className="mz-metric">193</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency overview</h3>
            <p className="mz-metric">381k</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput summary</h3>
            <p className="mz-metric">260%</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":77 }}></span><span className="mz-spark" style={{ "--h":51 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":99 }}></span><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":56 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":81 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":68 }}></span><span className="mz-spark" style={{ "--h":75 }}></span></div>
      </main>
    </div>
  );
}
