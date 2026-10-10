/**
 * ultra-marketing-landing-pages-044 — App download promo — Alert-first Advanced
 * Category: marketing-landing-pages | Tier: Ultra Premium+ | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-marketing-landing-pages-044 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="App download promo — Alert-first Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-marketing-landing-pages-044" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>App download promo — Alert-first Advanced</h2>
          <CARDS2 seed="ultra-marketing-landing-pages-044" />
        </aside>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> a scheduled sync completes in 12 minutes (demo).
        </div>
      </main>
    </div>
  );
}
