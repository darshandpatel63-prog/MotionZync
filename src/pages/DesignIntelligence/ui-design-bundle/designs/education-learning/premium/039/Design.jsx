/**
 * premium-education-learning-039 — Quiz assessment runner — Data-dense Master-Detail
 * Category: education-learning | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-education-learning-039 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-education-learning-039" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Quiz assessment runner — Data-dense Master-Detail</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="premium-education-learning-039" />
          </section>
        </div>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Latency summary</h3>
            <p className="mz-metric">115ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Accuracy summary</h3>
            <p className="mz-metric">505%</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">437%</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":81 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":88 }}></span><span className="mz-spark" style={{ "--h":75 }}></span></div>
      </main>
    </div>
  );
}
