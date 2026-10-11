# Agent brief - shared by every fan-out page of learn-market-sizing-with-phoebe

Filled from course-builder `references/agent-brief.template.md` on 2026-10-11. Internal build
document: never link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including how many options each question has (FOUR options, A to D):
   - Business: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-market-sizing-with-phoebe/courses/b1-what-a-market-size-is-for.html`
   - Analyst: `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-market-sizing-with-phoebe/courses/a1-top-down.html`
     (the bench page `a6-the-triangulation-bench.html` shows the same grammar on a bench night)
2. The source map: every verified number, its evidence tier, per-session coverage, the seams. Use
   ONLY its numbers; never invent a statistic; if a fact is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-market-sizing-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines only):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-market-sizing-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY "Business session N of 4" or "Analyst session N of 6", #toggle-all,
#zoom-toggle) · masthead (eyebrow "Learn Market Sizing with Phoebe · Business session N of 4" /
"... · Analyst session N of 6", h1 with one `<span class="accent">`, .sub, .chip-row with the level
chip given in your outline, then two `.chip.audience` and a `.chip.time` "45 min", .agenda a1-a4) ·
main.wrap · section#intro (Part 0: kicker, .lede, .legend pills copied from the template,
.callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with
section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`,
`.caret ▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page ·
section#demo-1 Build-along (kicker klabel "Build-along", `.tag.demo "★ 22 min · everyone works it
through"` on Business pages or `"★ 22 min · everyone builds"` on Analyst pages, .lede, ONE figure,
`.steps > .step`, each with a `<p>` then a `.prompt-box.good` carrying a `span.label`; Analyst
pages that have a widget mount it as `<div class="msz-widget" data-mode="MODE"></div>` right
after the build-along .lede, exactly as a1 does) · section#exercise Homework (ol, 4 items) ·
section#quiz (3 x `.quiz-q data-answer="0-based"`, `p.qtext`, four `button.qopt` "A · ..." to
"D · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the correct letter) ·
section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY
"Every fact on this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Business session N cheat sheet <span>· pin this</span>" or
"Analyst session N cheat sheet ...", .grid-2 of six .cheat-item) · `.callout.next` with `.nx-pill`
"Next session" · footer.pagefoot · scripts.

Scripts at the end of body, exactly:
- Business pages and Analyst pages WITHOUT a widget: `<script src="../assets/app.js?v=9"></script>`
- Analyst pages WITH a widget (a2, a4, a5):
  `<script src="../assets/msz-sample.js?v=1"></script>` `<script src="../assets/msz-live.js?v=1"></script>`
  `<script src="../assets/msz-bench.js?v=2"></script>` `<script src="../assets/app.js?v=9"></script>`

Head: the template's social meta block with this page's own title/description/url;
`<title>Business session N · TITLE - learn market sizing with phoebe</title>` (or Analyst);
`<link rel="stylesheet" href="../assets/style.css?v=9">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "Analyst session 4" style cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. Widget numbers: quote ONLY the
  values listed in the map's "Bench canon" section (they are what the engine prints at default
  settings). For anything a learner changes, print "your numbers will differ", never invented outputs.
- Never quote a percentage or figure for new-entrant base rates, analyst-firm sizes, Bass
  parameters, Dunford or Roberge: the map marks them reported or principle-only. Paraphrase,
  say "reported", never quote. Damodaran: cite as "Damodaran, Musings on Markets, 2015 and 2019
  posts"; the only allowed quote is the one in the map (under 15 words).
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
- NEVER "lottery" or "lotteries". No Chinese terms. No cross mark glyphs (✗ or ×) as bullets or labels.
- No `.prompt-box.bad` with a cross; if you need a wrong-way example, label it plainly ("Wrong way · ...").
- Titles, widget ids and class names must not collide with siblings; use only the titles below.
- Kettle &amp; Co is a constructed DTC tea brand; never a real employer, client or Phoebe's own work.
- Japan figures stay in yen; no exchange rates.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): `#005F6B` (accent) `#003D45` (accent-deep)
`#1B7280` (accent-mid) `#B8DADD` (soft) `#EAF4F5` (50-tint) `#102A2E` (ink) `#4F6366` (muted)
`#C5D3D5` (faint) `#E2EBEC` (hairline) `#8A5300` (amber, the contrast fill) `#5A3600` (amber-ink)
`#FBF1E0` (amber-50) · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a
wrong-way panel. White text (`#FFFFFF`) only on `#8A5300`, `#005F6B` or `#003D45` fills; amber-ink
text only on white, `#FBF1E0` or `#EAF4F5`.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" role="img" aria-label="the data, not the
  shape">` > `<defs>` + `<style>` + content, then `<figcaption>🔍 Click to zoom - takeaway</figcaption>`.
  Grow H, never W.
- Prefix unique per figure, used for every class and id: page id + figure letter, e.g. `b2a`,
  `b2b`, `b2c`, `b2d` (filter `b2aSk`, hachure `b2aHc`, arrow `b2aAr`, classes `.b2aH` etc.).
  Every `marker-end` must reference its OWN figure's arrow id.
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  accent line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink stroke
  1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#102A2E" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for
  hand-placed items, under 1 for panels). Fills: white, `#EAF4F5`, the hachure for "the pile" or
  "the data", and `#8A5300` ONLY for the one thing the figure is about. Real statistic = solid
  stroke; constructed input = `stroke-dasharray="6 5"` (as a1 and a6 do). One doodle anchor per
  figure, simple strokes, never a mascot, placed where it crosses NO text. Text classes: `.PH` 800
  12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px muted · `.PB` 800 11px amber-ink ·
  `.PV` 800 16-20px accent-deep value · `.PW` 800 12px white on a fill · `.PA` 700 11px accent axis
  caption · `.PN` 400 12px muted note. Never style text with an inline `style=`; add a class.
- ALL `<text>` outside any filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it
  by 8px. No path or line may cross a text label. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along. Draw the MECHANISM (the chain of links,
  the ranges as intervals, the two halves of a brief and who signs each, the ramp against a
  ceiling, plans stacked against one market), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story from the map's cases. Kettle &amp; Co, its people (marketing
lead, BD lead, head of data, analysts), its shares, pilot numbers, plans, rivals (Entrant B, C, D)
and the analyst figure are constructed: say "Constructed Kettle &amp; Co example" in each story.
Analyst-firm market sizes: contested, no firm named, no figure quoted beyond the constructed 50.00.

## Cross-links (absolute URLs)

- Ownership map and intake (never re-teach): https://phoebefu6.github.io/learn-marketing-analytics-with-phoebe/courses/p2-the-ownership-map.html and https://phoebefu6.github.io/learn-marketing-analytics-with-phoebe/courses/p3-intake-and-the-service-menu.html
- Strategy frameworks: https://phoebefu6.github.io/learn-strategic-thinking-with-phoebe/
- Elasticity and pricing: https://phoebefu6.github.io/learn-economics-with-phoebe/
- Forecasting (a5 uses adoption curves only as a realism check): https://phoebefu6.github.io/learn-timeseries-forecasting-with-phoebe/
- Positioning for marketers: https://phoebefu6.github.io/learn-marketing-with-phoebe/
- Sizing inside a consulting proposal: https://phoebefu6.github.io/learn-ai-consulting-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Footer left: "Business session N of 4 · learn-market-sizing-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>" (or Analyst session N of 6).
Footer right, as in the templates: `<a href="PREV">← Prev: SHORT</a> &nbsp;·&nbsp; <a href="NEXT">Next: SHORT →</a>`;
the last page of a track ends with `<a href="../index.html">Course home</a>` instead of Next.

Business chain: b1-what-a-market-size-is-for.html (What a market size is for) -> b2-reading-a-sizing-deck.html
(Reading a sizing deck) -> b3-who-owns-which-half.html (Who owns which half) -> b4-from-size-to-plan.html
(From size to plan) -> Course home.
Analyst chain: a1-top-down.html (Top-down) -> a2-bottom-up.html (Bottom-up) -> a3-analogy-and-proxy.html
(Analogy and proxy) -> a4-ranges-not-points.html (Ranges, not points) -> a5-share-realism.html
(Share realism) -> a6-the-triangulation-bench.html (The triangulation bench) -> Course home.

Session titles (exact h1 text, sentence case, one accent span):
- b2 "Reading a sizing deck" · b3 "Who owns which half" · b4 "From size to plan"
- a2 "Bottom-up: customers, price and frequency" · a3 "Sizing by analogy and proxy"
- a4 "Ranges, not points" · a5 "Share realism and the collision test"
