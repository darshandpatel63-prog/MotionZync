/**
 * premium-ecommerce-marketplaces-083 — Subscription box builder — Expanded Geographic/Schematic
 * Category: ecommerce-marketplaces | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ecommerce-marketplaces-083 mz-density--roomy" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Subscription box builder — Expanded Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-ecommerce-marketplaces-083" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Subscription box builder — Expanded Geographic/Schematic</h2>
          <CARDS2 seed="premium-ecommerce-marketplaces-083" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Retention rose 4% after the onboarding change (sample data).</p>
        </aside>
      </main>
    </div>
  );
}
