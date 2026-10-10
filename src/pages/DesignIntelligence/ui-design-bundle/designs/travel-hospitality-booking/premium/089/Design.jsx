/**
 * premium-travel-hospitality-booking-089 — Restaurant reservation flow — Data-dense Geographic/Schematic
 * Category: travel-hospitality-booking | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-travel-hospitality-booking-089 mz-density--compact" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Restaurant reservation flow — Data-dense Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-travel-hospitality-booking-089" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Restaurant reservation flow — Data-dense Geographic/Schematic</h2>
          <CARDS2 seed="premium-travel-hospitality-booking-089" />
        </aside>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">115</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput breakdown</h3>
            <p className="mz-metric">787%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention overview</h3>
            <p className="mz-metric">986ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":85 }}></span><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":75 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":54 }}></span></div>
      </main>
    </div>
  );
}
