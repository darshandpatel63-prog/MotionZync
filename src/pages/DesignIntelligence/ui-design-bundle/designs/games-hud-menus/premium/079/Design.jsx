/**
 * premium-games-hud-menus-079 — Character loadout screen — Data-dense Master-Detail
 * Category: games-hud-menus | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-079 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-games-hud-menus-079" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Character loadout screen — Data-dense Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-games-hud-menus-079" />
          </section>
        </div>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity overview</h3>
            <p className="mz-metric">476</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">994k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue summary</h3>
            <p className="mz-metric">592ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":64 }}></span><span className="mz-spark" style={{ "--h":88 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":20 }}></span><span className="mz-spark" style={{ "--h":61 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":88 }}></span><span className="mz-spark" style={{ "--h":87 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":88 }}></span><span className="mz-spark" style={{ "--h":27 }}></span></div>
      </main>
    </div>
  );
}
