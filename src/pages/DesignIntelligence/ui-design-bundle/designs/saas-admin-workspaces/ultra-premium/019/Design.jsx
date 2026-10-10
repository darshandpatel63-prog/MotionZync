/**
 * ultra-saas-admin-workspaces-019 — Role and permission matrix — Data-dense Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: table-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TABLEROWS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-019 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Reports</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Start</button>
      </header>
      <main className="mz-main">
        <div className="mz-toolbar" role="toolbar" aria-label="Table tools">
          <input className="mz-input" type="search" aria-label="Search rows" placeholder="Search…" />
          <button type="button" className="mz-btn">Filter</button>
          <button type="button" className="mz-btn mz-btn--primary">New record</button>
        </div>
        <table className="mz-table">
          <caption className="mz-sr-only">Role and permission matrix — Data-dense Advanced</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Updated</th></tr></thead>
          <tbody><TABLEROWS seed="ultra-saas-admin-workspaces-019" /></tbody>
        </table>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Accuracy summary</h3>
            <p className="mz-metric">916%</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Accuracy summary</h3>
            <p className="mz-metric">994ms</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">534k</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":81 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":66 }}></span><span className="mz-spark" style={{ "--h":44 }}></span><span className="mz-spark" style={{ "--h":77 }}></span><span className="mz-spark" style={{ "--h":44 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":48 }}></span><span className="mz-spark" style={{ "--h":86 }}></span></div>
      </main>
    </div>
  );
}
