# Design comparison — five dark-minimal directions

All five render the same content (hero, selected work, stack, experience, blog teaser, contact) so the choice is about the system, not the copy. All five are dark per grilling. No terminal, no overdone SaaS template.

## V1 — Midnight Glass

Dark glassmorphism done deliberately: deep `#070B14` base, aurora radial glows, grid mask, `glass-panel` and `glass-chip` tokens with 22px blur and inset highlights.

- Strengths: premium at first glance. Metric chips read well. Clear CTA hierarchy.
- Weaknesses: `backdrop-filter` over large areas costs GPU on low-end phones. Transparency needs constant contrast checks. More code to maintain per panel.
- Mobile: panels stack cleanly, but blur + glows are the heaviest of the five.
- Maintainability: medium. Tokens are centralized in `styles.css`, but every new surface needs a blur decision.
- Brand fit: good for impressing, weaker for daily reading.

## V2 — Soft Press Dark

Neumorphism translated to dark mode (`#151A23` base, black extrude shadows + faint white lift shadows, `neu-extrude` / `neu-inset` / `neu-inset-deep`). Concentric-circle hero shows the physics.

- Strengths: genuinely tactile, unlike anything else in the set. Calm and memorable.
- Weaknesses: muted text (`#9aa6b5`) needs care to hold AA on the dark clay. Reads as playful next to financial-automation content. Shadows add CSS weight everywhere.
- Mobile: holds up, 44px+ targets, but nested depth circles eat vertical space.
- Maintainability: medium-low. The system only works if everyone respects extrude vs inset rules.
- Brand fit: fun, but the least executive of the five.

## V3 — Editorial Minimal (production pick)

Near-black `#0a0a0b`, single-column measure, numbered hairline sections, one lime accent `#d6fd51`. No cards on the homepage body. Work is a ruled list, not a grid.

- Strengths: fastest (no blur, no shadows, tiny CSS), most readable, most accessible. Copy carries the credibility, which suits a CTO who writes. Cheapest to extend: a new section is headings + hairlines.
- Weaknesses: relies on writing quality. No visual fireworks for visitors who skim.
- Mobile: best of the five. Single column is the mobile layout, so nothing collapses or reorders.
- Maintainability: highest. Fewer tokens, fewer states, fewer ways to drift.
- Brand fit: strongest for 50/50 CTO + engineer speaking to clients, peers, and execs.

## V4 — Hairline Grid

Precision product-grid minimal (`#0b0d10`, hairline `white/8` cells, small-caps mono labels). Work and stack are bordered cells on a shared grid.

- Strengths: scales to dozens of projects without redesign. Familiar to engineers. Density without noise.
- Weaknesses: can read as a tool dashboard rather than a person. Needs real thumbnails or status data to reach its potential, which we deliberately do not fake.
- Mobile: cells collapse to one column cleanly.
- Maintainability: high. Grid + cell pattern repeats predictably.
- Brand fit: good second choice for a builder, weaker for the leadership half.

## V5 — Ink Serif

Warm black `#0e0e0c`, Newsreader serif display, centered rhythm, footnote-style numbering. No cards at all.

- Strengths: most distinctive. Serif confidence plays well with executives.
- Weaknesses: centered long-form text hurts readability. Serif taste splits engineers. Least room for dense technical detail.
- Mobile: fine, but large serif sizes need careful clamping.
- Maintainability: high, but the narrow voice limits future sections (docs, changelogs would fight it).
- Brand fit: strong for keynotes, weaker for week-to-week engineering proof.

## Verdict

**Ship V3.** It is the fastest, most readable, most maintainable, and the most honest container for unverified-scale claims handled carefully (ranges, not fake precision). V1 is the runner-up if drama ever matters more than reading. The production `/` route is V3 refined with full experience, archive, SEO, and footer. All five stay live under `/designs` as process proof.
