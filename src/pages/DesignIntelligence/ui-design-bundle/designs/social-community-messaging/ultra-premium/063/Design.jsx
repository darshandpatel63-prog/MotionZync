/**
 * ultra-social-community-messaging-063 — Creator supporter wall — Expanded Advanced
 * Category: social-community-messaging | Tier: Ultra Premium+ | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-social-community-messaging-063 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
        <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Creator supporter wall — Expanded Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-social-community-messaging-063" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Creator supporter wall — Expanded Advanced</h2>
          <CARDS2 seed="ultra-social-community-messaging-063" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>The north region outperforms forecast by 12% (demo).</p>
        </aside>
      </main>
    </div>
  );
}
