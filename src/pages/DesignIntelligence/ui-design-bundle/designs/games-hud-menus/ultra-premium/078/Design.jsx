/**
 * ultra-games-hud-menus-078 — Character loadout screen — Collaborative Advanced
 * Category: games-hud-menus | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-games-hud-menus-078 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Reports</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-games-hud-menus-078" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Character loadout screen — Collaborative Advanced</h2>
            <p>Select an item to inspect its full detail here.</p>
            <CARDS2 seed="ultra-games-hud-menus-078" />
          </section>
        </div>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>9 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>J. Okafor (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> added a file <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
