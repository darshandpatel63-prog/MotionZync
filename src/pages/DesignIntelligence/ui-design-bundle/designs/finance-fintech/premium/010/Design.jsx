/**
 * premium-finance-fintech-010 — Budget envelope planner — Narrative Top
 * Category: finance-fintech | Tier: Premium | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-010 mz-density--roomy" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Budget envelope planner — Narrative Top</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-finance-fintech-010" /></section>
        <section className="mz-story">
          <h3>Context and background</h3>
          <p>A supporting narrative block that adds editorial depth without overwhelming the primary content. Sample copy only.</p>
        </section>
        <blockquote className="mz-quote">
          <p>It feels considered in a way tools rarely do.</p>
          <cite>— Sample customer (fictional)</cite>
        </blockquote>
      </main>
    </div>
  );
}
