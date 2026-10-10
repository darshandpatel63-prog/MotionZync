# Import preparation note

This asset pack is stored under src/pages/DesignIntelligence/ui-design-bundle/ so its README.md and package.json do not collide with MotionZync's repository-root files.

The original archive contained unresolved JSX references: BENTO, ROWS5, CARDS2, CARDS4, FLOATINGNODES, PARAGRAPHS, TIMELINEITEMS, FORMFIELDS, CARDS6, and TABLEROWS. Import preparation replaces those references with statically imported sample-data React parts in shared/parts/GeneratedParts.jsx. It also HTML-escapes manifest fields in the static-preview builder and strengthens validation against unresolved references.

This directory is an asset pack, not yet a live Design Intelligence route or catalog registration. Do not grant access based on these asset labels; continue to use the existing server-authoritative entitlement and API-key checks. Full human visual originality and real-device review remain UNVERIFIED.
