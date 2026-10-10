/**
 * premium-media-creative-tools-070 — Subtitle caption editor — Narrative Geographic/Schematic
 * Category: media-creative-tools | Tier: Premium | Layout: map-geo
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, FLOATINGNODES} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-media-creative-tools-070 mz-density--roomy" data-motion="none">
      <div className="mz-nav mz-nav--floating" role="toolbar" aria-label="Tools">
                <button type="button" className="mz-toolbtn" aria-label="Pan">Pan</button>
        <button type="button" className="mz-toolbtn" aria-label="Layers">Layers</button>
        <button type="button" className="mz-toolbtn" aria-label="Select">Select</button>
        <button type="button" className="mz-toolbtn" aria-label="Measure">Measure</button>
      </div>
      <main className="mz-main">
        <div className="mz-canvas" role="application" aria-label="Subtitle caption editor — Narrative Geographic/Schematic canvas">
          <div className="mz-canvas__hint">Canvas area — keyboard: arrows to pan, +/- to zoom</div>
          <FLOATINGNODES seed="premium-media-creative-tools-070" />
        </div>
        <aside className="mz-canvaspanel" aria-label="Inspector">
          <h2>Subtitle caption editor — Narrative Geographic/Schematic</h2>
          <CARDS2 seed="premium-media-creative-tools-070" />
        </aside>
        <section className="mz-story">
          <h3>The thinking behind it</h3>
          <p>A supporting narrative block that adds editorial depth without overwhelming the primary content. Sample copy only.</p>
        </section>
        <blockquote className="mz-quote">
          <p>This finally made the workflow click for our whole team.</p>
          <cite>— Sample customer (fictional)</cite>
        </blockquote>
      </main>
    </div>
  );
}
