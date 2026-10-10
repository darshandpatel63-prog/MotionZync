/**
 * ultra-desktop-productivity-069 — Task Gantt scheduler — Data-dense Advanced
 * Category: desktop-productivity | Tier: Ultra Premium+ | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-desktop-productivity-069 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Task Gantt scheduler — Data-dense Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-desktop-productivity-069" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Task Gantt scheduler — Data-dense Advanced</h2>
          <CARDS2 seed="ultra-desktop-productivity-069" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">293</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue trend</h3>
            <p className="mz-metric">376</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput summary</h3>
            <p className="mz-metric">587ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":23 }}></span><span className="mz-spark" style={{ "--h":61 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":44 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":38 }}></span></div>
      </main>
    </div>
  );
}
