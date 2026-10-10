/**
 * ultra-saas-admin-workspaces-033 — CRM contact 360 — Expanded Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-033 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Undo">Undo</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="CRM contact 360 — Expanded Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-saas-admin-workspaces-033" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>CRM contact 360 — Expanded Advanced</h2>
          <CARDS2 seed="ultra-saas-admin-workspaces-033" />
        </aside>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Three items need review before the weekly sync.</p>
        </aside>
      </main>
    </div>
  );
}
