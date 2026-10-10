/**
 * ultra-ai-agent-workflows-059 — Evaluation run dashboard — Data-dense Advanced
 * Category: ai-agent-workflows | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-ai-agent-workflows-059 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Evaluation run dashboard — Data-dense Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-ai-agent-workflows-059" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Evaluation run dashboard — Data-dense Advanced</h2>
          <CARDS2 seed="ultra-ai-agent-workflows-059" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Accuracy breakdown</h3>
            <p className="mz-metric">994k</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">773%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">112</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":90 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":91 }}></span></div>
      </main>
    </div>
  );
}
