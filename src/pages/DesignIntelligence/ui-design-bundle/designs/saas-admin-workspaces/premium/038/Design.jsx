/**
 * premium-saas-admin-workspaces-038 — CRM contact 360 — Collaborative Full-Bleed
 * Category: saas-admin-workspaces | Tier: Premium | Layout: canvas-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-saas-admin-workspaces-038 mz-density--default" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="CRM contact 360 — Collaborative Full-Bleed canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-saas-admin-workspaces-038" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>CRM contact 360 — Collaborative Full-Bleed</h2>
          <CARDS2 seed="premium-saas-admin-workspaces-038" />
        </aside>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>3 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>J. Okafor (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> closed a task <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
