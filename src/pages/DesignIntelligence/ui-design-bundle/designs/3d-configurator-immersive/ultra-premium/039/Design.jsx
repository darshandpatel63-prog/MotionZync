/**
 * ultra-3d-configurator-immersive-039 — Jewelry material viewer — Data-dense Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-039 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Jewelry material viewer — Data-dense Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-3d-configurator-immersive-039" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Jewelry material viewer — Data-dense Advanced</h2>
          <CARDS2 seed="ultra-3d-configurator-immersive-039" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">653k</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">343</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">608k</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":68 }}></span><span className="mz-spark" style={{ "--h":48 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":33 }}></span><span className="mz-spark" style={{ "--h":66 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":74 }}></span></div>
      </main>
    </div>
  );
}
