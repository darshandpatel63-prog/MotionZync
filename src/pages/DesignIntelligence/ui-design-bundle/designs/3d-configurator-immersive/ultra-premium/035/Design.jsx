/**
 * ultra-3d-configurator-immersive-035 — Jewelry material viewer — Compare Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-035 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Jewelry material viewer — Compare Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-3d-configurator-immersive-035" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Jewelry material viewer — Compare Advanced</h2>
          <CARDS2 seed="ultra-3d-configurator-immersive-035" />
        </aside>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">54%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">19%</p></div>
        </section>
      </main>
    </div>
  );
}
