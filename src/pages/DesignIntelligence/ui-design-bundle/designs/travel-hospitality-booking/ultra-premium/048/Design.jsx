/**
 * ultra-travel-hospitality-booking-048 — Booking checkout flow — Collaborative Advanced
 * Category: travel-hospitality-booking | Tier: Ultra Premium+ | Layout: immersive-stage
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-travel-hospitality-booking-048 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Annotate">Annotate</button>
        <button type="button" className="mz-toolbtn" aria-label="Snap">Snap</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Zoom">Zoom</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Booking checkout flow — Collaborative Advanced canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="ultra-travel-hospitality-booking-048" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Booking checkout flow — Collaborative Advanced</h2>
          <CARDS2 seed="ultra-travel-hospitality-booking-048" />
        </aside>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>7 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>M. Chen (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>A. Rivera (sample)</strong> added a file <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
