/**
 * premium-forms-onboarding-settings-069 — Survey builder canvas — Data-dense Tabbed
 * Category: forms-onboarding-settings | Tier: Premium | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-forms-onboarding-settings-069 mz-density--compact" data-motion="none">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">Members</button>
        <button role="tab" aria-selected="false" className="mz-tab">Overview</button>
        <button role="tab" aria-selected="false" className="mz-tab">History</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Survey builder canvas — Data-dense Tabbed</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-forms-onboarding-settings-069" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">835k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime overview</h3>
            <p className="mz-metric">554k</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion breakdown</h3>
            <p className="mz-metric">353k</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":56 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":33 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":45 }}></span></div>
      </main>
    </div>
  );
}
