/**
 * premium-marketing-landing-pages-059 — Customer story showcase — Data-dense Master-Detail
 * Category: marketing-landing-pages | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-marketing-landing-pages-059 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-marketing-landing-pages-059" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Customer story showcase — Data-dense Master-Detail</h2>
            <p>Select an item to inspect its full detail here.</p>
            <CARDS2 seed="premium-marketing-landing-pages-059" />
          </section>
        </div>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">975ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue overview</h3>
            <p className="mz-metric">791ms</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">142k</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":34 }}></span><span className="mz-spark" style={{ "--h":50 }}></span><span className="mz-spark" style={{ "--h":32 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":40 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":89 }}></span></div>
      </main>
    </div>
  );
}
