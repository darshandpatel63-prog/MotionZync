/**
 * ultra-mobile-tablet-apps-039 — Fitness tracker rings — Data-dense Advanced
 * Category: mobile-tablet-apps | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-mobile-tablet-apps-039 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Fitness tracker rings — Data-dense Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-mobile-tablet-apps-039" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Fitness tracker rings — Data-dense Advanced</h2>
          <CARDS2 seed="ultra-mobile-tablet-apps-039" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Conversion overview</h3>
            <p className="mz-metric">477k</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">564k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">283ms</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":81 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":98 }}></span></div>
      </main>
    </div>
  );
}
