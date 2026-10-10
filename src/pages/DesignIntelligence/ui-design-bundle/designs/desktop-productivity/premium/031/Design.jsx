/**
 * premium-desktop-productivity-031 — Spreadsheet analysis sheet — Standard Master-Detail
 * Category: desktop-productivity | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-desktop-productivity-031 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Reports</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-desktop-productivity-031" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Spreadsheet analysis sheet — Standard Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-desktop-productivity-031" />
          </section>
        </div>

      </main>
    </div>
  );
}
