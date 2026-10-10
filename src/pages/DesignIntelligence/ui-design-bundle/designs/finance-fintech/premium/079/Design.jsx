/**
 * premium-finance-fintech-079 — Tax document organizer — Data-dense Mobile-First
 * Category: finance-fintech | Tier: Premium | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-079 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Tax document organizer — Data-dense Mobile-First</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-finance-fintech-079" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention summary</h3>
            <p className="mz-metric">674ms</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">962k</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity breakdown</h3>
            <p className="mz-metric">944%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":51 }}></span><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":91 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":60 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":45 }}></span></div>
      </main>
    </div>
  );
}
