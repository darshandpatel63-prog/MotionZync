/**
 * premium-ecommerce-marketplaces-041 — Deal of the day board — Standard Immersive
 * Category: ecommerce-marketplaces | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ecommerce-marketplaces-041 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Deal of the day board — Standard Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ecommerce-marketplaces-041" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Deal of the day board — Standard Immersive</h2>
          <CARDS2 seed="premium-ecommerce-marketplaces-041" />
        </aside>

      </main>
    </div>
  );
}
