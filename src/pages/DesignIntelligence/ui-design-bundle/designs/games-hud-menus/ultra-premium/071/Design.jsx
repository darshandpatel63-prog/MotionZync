/**
 * ultra-games-hud-menus-071 — Character loadout screen — Standard Advanced
 * Category: games-hud-menus | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-games-hud-menus-071 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-games-hud-menus-071" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Character loadout screen — Standard Advanced</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="ultra-games-hud-menus-071" />
          </section>
        </div>

      </main>
    </div>
  );
}
