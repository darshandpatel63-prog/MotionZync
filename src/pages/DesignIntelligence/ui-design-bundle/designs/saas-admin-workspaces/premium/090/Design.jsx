/**
 * premium-saas-admin-workspaces-090 — Integration settings hub — Narrative Responsive
 * Category: saas-admin-workspaces | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-saas-admin-workspaces-090 mz-density--roomy" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Integration settings hub — Narrative Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-saas-admin-workspaces-090" /></section>
        <section className="mz-story">
          <h3>Why this works</h3>
          <p>A supporting narrative block that adds editorial depth without overwhelming the primary content. Sample copy only.</p>
        </section>
        <blockquote className="mz-quote">
          <p>The clearest interface we have used in this category.</p>
          <cite>— Sample customer (fictional)</cite>
        </blockquote>
      </main>
    </div>
  );
}
