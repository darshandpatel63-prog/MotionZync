/**
 * ultra-desktop-productivity-049 — IDE-like code bench — Data-dense Advanced
 * Category: desktop-productivity | Tier: Ultra Premium+ | Layout: single-task
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {FORMFIELDS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-desktop-productivity-049 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <section className="mz-task" aria-labelledby="task-t">
          <p className="mz-kicker">Step 2 of 5</p>
          <h2 id="task-t">IDE-like code bench — Data-dense Advanced</h2>
          <p>One decision per screen keeps this flow effortless.</p>
          <FORMFIELDS seed="ultra-desktop-productivity-049" />
          <div className="mz-task__actions">
            <button type="button" className="mz-btn mz-btn--ghost">Back</button>
            <button type="button" className="mz-btn mz-btn--primary">Continue</button>
          </div>
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Throughput breakdown</h3>
            <p className="mz-metric">237%</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">278</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage overview</h3>
            <p className="mz-metric">14ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":40 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":79 }}></span></div>
      </main>
    </div>
  );
}
