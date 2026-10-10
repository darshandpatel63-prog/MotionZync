/**
 * ultra-forms-onboarding-settings-049 — Team invite flow — Data-dense Advanced
 * Category: forms-onboarding-settings | Tier: Ultra Premium+ | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-forms-onboarding-settings-049 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Team invite flow — Data-dense Advanced</h2></header>
          <p className="mz-lede">Designed for long, comfortable reading sessions.</p>
          <PARAGRAPHS seed="ultra-forms-onboarding-settings-049" />
        </article>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity summary</h3>
            <p className="mz-metric">526ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention summary</h3>
            <p className="mz-metric">605k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">73</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":41 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":33 }}></span><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":31 }}></span><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":28 }}></span><span className="mz-spark" style={{ "--h":62 }}></span></div>
      </main>
    </div>
  );
}
