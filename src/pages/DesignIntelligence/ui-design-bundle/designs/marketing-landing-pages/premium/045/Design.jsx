/**
 * premium-marketing-landing-pages-045 — App download promo — Compare Immersive
 * Category: marketing-landing-pages | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-marketing-landing-pages-045 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="App download promo — Compare Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-marketing-landing-pages-045" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>App download promo — Compare Immersive</h2>
          <CARDS2 seed="premium-marketing-landing-pages-045" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">71%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">29%</p></div>
        </section>
      </main>
    </div>
  );
}
