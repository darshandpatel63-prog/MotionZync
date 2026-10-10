/**
 * ultra-social-community-messaging-049 — Direct message inbox — Data-dense Advanced
 * Category: social-community-messaging | Tier: Ultra Premium+ | Layout: single-task
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {FORMFIELDS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-social-community-messaging-049 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <section className="mz-task" aria-labelledby="task-t">
          <p className="mz-kicker">Step 2 of 5</p>
          <h2 id="task-t">Direct message inbox — Data-dense Advanced</h2>
          <p>Focused single-task surface with a clear primary action.</p>
          <FORMFIELDS seed="ultra-social-community-messaging-049" />
          <div className="mz-task__actions">
            <button type="button" className="mz-btn mz-btn--ghost">Back</button>
            <button type="button" className="mz-btn mz-btn--primary">Continue</button>
          </div>
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">332ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput summary</h3>
            <p className="mz-metric">286</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput overview</h3>
            <p className="mz-metric">157k</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":76 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":90 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":85 }}></span><span className="mz-spark" style={{ "--h":99 }}></span><span className="mz-spark" style={{ "--h":26 }}></span><span className="mz-spark" style={{ "--h":49 }}></span></div>
      </main>
    </div>
  );
}
