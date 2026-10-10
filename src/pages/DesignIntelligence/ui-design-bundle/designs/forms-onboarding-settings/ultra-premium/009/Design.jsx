/**
 * ultra-forms-onboarding-settings-009 — Multi-step signup wizard — Data-dense Advanced
 * Category: forms-onboarding-settings | Tier: Ultra Premium+ | Layout: bento-modular
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-forms-onboarding-settings-009 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Multi-step signup wizard — Data-dense Advanced</h2>
          <p>A clear headline area with the key action up front.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-forms-onboarding-settings-009" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Latency breakdown</h3>
            <p className="mz-metric">525%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity overview</h3>
            <p className="mz-metric">942</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity overview</h3>
            <p className="mz-metric">379k</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":86 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":46 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":69 }}></span><span className="mz-spark" style={{ "--h":88 }}></span></div>
      </main>
    </div>
  );
}
