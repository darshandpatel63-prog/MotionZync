/**
 * premium-mobile-tablet-apps-024 — Mobile wallet passbook — Alert-first Playful
 * Category: mobile-tablet-apps | Tier: Premium | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-024 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Story</p><h2>Mobile wallet passbook — Alert-first Playful</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="premium-mobile-tablet-apps-024" />
        </article>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> a scheduled sync completes in 12 minutes (demo).
        </div>
      </main>
    </div>
  );
}
