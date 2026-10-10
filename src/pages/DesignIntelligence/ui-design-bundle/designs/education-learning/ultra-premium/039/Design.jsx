/**
 * ultra-education-learning-039 — Quiz assessment runner — Data-dense Advanced
 * Category: education-learning | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-education-learning-039 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-education-learning-039" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Quiz assessment runner — Data-dense Advanced</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="ultra-education-learning-039" />
          </section>
        </div>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Uptime breakdown</h3>
            <p className="mz-metric">548%</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput trend</h3>
            <p className="mz-metric">99</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">851%</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":85 }}></span><span className="mz-spark" style={{ "--h":60 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":68 }}></span><span className="mz-spark" style={{ "--h":28 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":45 }}></span></div>
      </main>
    </div>
  );
}
