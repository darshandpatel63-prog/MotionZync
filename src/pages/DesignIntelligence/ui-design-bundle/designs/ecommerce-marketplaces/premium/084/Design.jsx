/**
 * premium-ecommerce-marketplaces-084 — Subscription box builder — Alert-first Geographic/Schematic
 * Category: ecommerce-marketplaces | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ecommerce-marketplaces-084 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Subscription box builder — Alert-first Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ecommerce-marketplaces-084" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Subscription box builder — Alert-first Geographic/Schematic</h2>
          <CARDS2 seed="premium-ecommerce-marketplaces-084" />
        </aside>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> a scheduled sync completes in 12 minutes (demo).
        </div>
      </main>
    </div>
  );
}
