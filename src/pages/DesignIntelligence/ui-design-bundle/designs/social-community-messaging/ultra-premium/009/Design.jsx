/**
 * ultra-social-community-messaging-009 — Community feed stream — Data-dense Advanced
 * Category: social-community-messaging | Tier: Ultra Premium+ | Layout: sidebar-command
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-social-community-messaging-009 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Settings</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Community feed stream — Data-dense Advanced</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-social-community-messaging-009" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-social-community-messaging-009" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Revenue breakdown</h3>
            <p className="mz-metric">490</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity breakdown</h3>
            <p className="mz-metric">870</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity breakdown</h3>
            <p className="mz-metric">726k</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":95 }}></span><span className="mz-spark" style={{ "--h":76 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":31 }}></span><span className="mz-spark" style={{ "--h":28 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":81 }}></span><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":68 }}></span></div>
      </main>
    </div>
  );
}
