/**
 * premium-forms-onboarding-settings-099 — Data export request flow — Data-dense Mobile-First
 * Category: forms-onboarding-settings | Tier: Premium | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-forms-onboarding-settings-099 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Data export request flow — Data-dense Mobile-First</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-forms-onboarding-settings-099" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">122k</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage overview</h3>
            <p className="mz-metric">304k</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime trend</h3>
            <p className="mz-metric">189k</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":55 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":42 }}></span></div>
      </main>
    </div>
  );
}
