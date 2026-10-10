/**
 * premium-travel-hospitality-booking-085 — Restaurant reservation flow — Compare Geographic/Schematic
 * Category: travel-hospitality-booking | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-travel-hospitality-booking-085 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Restaurant reservation flow — Compare Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-travel-hospitality-booking-085" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Restaurant reservation flow — Compare Geographic/Schematic</h2>
          <CARDS2 seed="premium-travel-hospitality-booking-085" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">72%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">30%</p></div>
        </section>
      </main>
    </div>
  );
}
