/**
 * premium-editorial-portfolio-creator-061 — Magazine issue layout — Standard Immersive
 * Category: editorial-portfolio-creator | Tier: Premium | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-editorial-portfolio-creator-061 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Magazine issue layout — Standard Immersive canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-editorial-portfolio-creator-061" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Magazine issue layout — Standard Immersive</h2>
          <CARDS2 seed="premium-editorial-portfolio-creator-061" />
        </aside>

      </main>
    </div>
  );
}
