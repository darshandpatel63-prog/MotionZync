/**
 * ultra-ecommerce-marketplaces-085 — Subscription box builder — Compare Advanced
 * Category: ecommerce-marketplaces | Tier: Ultra Premium+ | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-ecommerce-marketplaces-085 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Subscription box builder — Compare Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-ecommerce-marketplaces-085" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Subscription box builder — Compare Advanced</h2>
          <CARDS2 seed="ultra-ecommerce-marketplaces-085" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">75%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">50%</p></div>
        </section>
      </main>
    </div>
  );
}
