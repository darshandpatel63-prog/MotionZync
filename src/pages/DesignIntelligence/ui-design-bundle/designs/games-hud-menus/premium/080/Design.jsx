/**
 * premium-games-hud-menus-080 — Character loadout screen — Narrative Master-Detail
 * Category: games-hud-menus | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-080 mz-density--roomy" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-games-hud-menus-080" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Character loadout screen — Narrative Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-games-hud-menus-080" />
          </section>
        </div>
        <section className="mz-story">
          <h3>The thinking behind it</h3>
          <p>A supporting narrative block that adds editorial depth without overwhelming the primary content. Sample copy only.</p>
        </section>
        <blockquote className="mz-quote">
          <p>The clearest interface we have used in this category.</p>
          <cite>— Sample customer (fictional)</cite>
        </blockquote>
      </main>
    </div>
  );
}
