/**
 * ultra-ecommerce-marketplaces-045 — Deal of the day board — Compare Advanced
 * Category: ecommerce-marketplaces | Tier: Ultra Premium+ | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-ecommerce-marketplaces-045 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Deal of the day board — Compare Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-ecommerce-marketplaces-045" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Deal of the day board — Compare Advanced</h2>
          <CARDS2 seed="ultra-ecommerce-marketplaces-045" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">98%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">31%</p></div>
        </section>
      </main>
    </div>
  );
}
