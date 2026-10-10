/**
 * ultra-social-community-messaging-100 — Polls and reactions board — Narrative Advanced
 * Category: social-community-messaging | Tier: Ultra Premium+ | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-social-community-messaging-100 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Polls and reactions board — Narrative Advanced</h2></header>
          <p className="mz-lede">A considered take on the topic, written for readers first.</p>
          <PARAGRAPHS seed="ultra-social-community-messaging-100" />
        </article>
        <section className="mz-story">
          <h3>Why this works</h3>
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
