/**
 * ultra-ai-agent-workflows-018 — Agent builder node canvas — Collaborative Advanced
 * Category: ai-agent-workflows | Tier: Ultra Premium+ | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-ai-agent-workflows-018 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
        <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Agent builder node canvas — Collaborative Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-ai-agent-workflows-018" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Agent builder node canvas — Collaborative Advanced</h2>
          <CARDS2 seed="ultra-ai-agent-workflows-018" />
        </aside>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>6 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>L. Haddad (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>M. Chen (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> closed a task <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
