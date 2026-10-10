/**
 * ultra-games-hud-menus-089 — Crafting recipe bench — Data-dense Advanced
 * Category: games-hud-menus | Tier: Ultra Premium+ | Layout: single-task
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {FORMFIELDS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-games-hud-menus-089 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <section className="mz-task" aria-labelledby="task-t">
          <p className="mz-kicker">Step 2 of 5</p>
          <h2 id="task-t">Crafting recipe bench — Data-dense Advanced</h2>
          <p>Focused single-task surface with a clear primary action.</p>
          <FORMFIELDS seed="ultra-games-hud-menus-089" />
          <div className="mz-task__actions">
            <button type="button" className="mz-btn mz-btn--ghost">Back</button>
            <button type="button" className="mz-btn mz-btn--primary">Continue</button>
          </div>
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Conversion summary</h3>
            <p className="mz-metric">692%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">900%</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency overview</h3>
            <p className="mz-metric">234ms</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":90 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":88 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":86 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":86 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":92 }}></span></div>
      </main>
    </div>
  );
}
