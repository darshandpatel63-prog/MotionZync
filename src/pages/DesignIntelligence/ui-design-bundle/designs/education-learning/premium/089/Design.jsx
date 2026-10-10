/**
 * premium-education-learning-089 — Certificate showcase wall — Data-dense Data
 * Category: education-learning | Tier: Premium | Layout: table-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TABLEROWS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-education-learning-089 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <div className="mz-toolbar" role="toolbar" aria-label="Table tools">
          <input className="mz-input" type="search" aria-label="Search rows" placeholder="Search…" />
          <button type="button" className="mz-btn">Filter</button>
          <button type="button" className="mz-btn mz-btn--primary">New record</button>
        </div>
        <table className="mz-table">
          <caption className="mz-sr-only">Certificate showcase wall — Data-dense Data</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Updated</th></tr></thead>
          <tbody><TABLEROWS seed="premium-education-learning-089" /></tbody>
        </table>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">949</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention breakdown</h3>
            <p className="mz-metric">296%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity summary</h3>
            <p className="mz-metric">520%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":60 }}></span><span className="mz-spark" style={{ "--h":77 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":79 }}></span></div>
      </main>
    </div>
  );
}
