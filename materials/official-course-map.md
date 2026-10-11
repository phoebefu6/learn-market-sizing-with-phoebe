# Official course map - learn-market-sizing-with-phoebe ("Market Sizing for Data Teams")

Internal build document. Never link it from an audience page. Built 2026-10-10.
Bucket data, d3, audience both (marketing / BD / leaders, and data analysts / data scientists).
Two tracks, 10 sessions x 45 min: Business b1-b4 (no code) + Analyst a1-a6 (hands-on, browser
widgets on real rows). a6 is the bench. Running case: Kettle & Co, a constructed DTC tea brand
(the same constructed company as Marketing Analytics), asking "how big is the Japan market for us?"
and, in b-track examples, "how big is the B2B office tea market for us?".

## Evidence tiers

- **read-at-source**: I opened the primary document on 2026-10-10 and read the figure or claim myself.
- **reported**: known from secondary summaries, the author's reputation, or memory; pages must say
  "reported" or paraphrase as a lens, never quote, never attach a number.
- **constructed**: invented for teaching, labelled on the page and on the widget.

## Verified facts

### F1. Japan, household tea spend (read-at-source)
Statistics Bureau of Japan, Family Income and Expenditure Survey (FIES), two-or-more-person
households, "item ranking by prefectural capital and designated city, 2023-2025 average",
drinks workbook `rank11.xlsx`, page https://www.stat.go.jp/data/kakei/5.html. Yen per household
per year (grams where marked). 52 cities plus the national row. Extracted to
`materials/fies-drinks-2023-2025.csv` by `materials/extract-fies.py`.

National row (yen per household per year, 2023-2025 average):
| Item | Yen | Grams |
|---|---|---|
| Tea, total (the survey's tea group) | 14,370 | |
| Green tea leaf | 3,187 | 647 |
| Black tea leaf | 878 | 192 |
| Other tea leaf (the survey's catch-all leaf item) | 1,672 | 1,161 |
| Bottled and canned tea drinks | 8,633 | |
| Lactic acid drinks | 5,757 | |
| Mineral water | 4,421 | |
| Sports drinks | 1,595 | |

- The four tea items add to the tea total exactly in the national row; in 15 city rows they differ
  by 1 or 2 yen (rounding of published averages). Teach as: published tables do not always add up,
  and a check that demands exact equality fails on real data.
- Leaf items (green + black + other leaf) = 5,737 yen; bottled tea drinks are 60 percent of the
  tea total (8,633 / 14,370 = 0.601). Do not claim what "other tea leaf" contains.
- City spread, green tea leaf: highest Shizuoka 7,697 yen, lowest Naha 1,246 yen, national 3,187.
  Shizuoka leaf total 9,694 yen against national 5,737 (1.69x).
- The table covers two-or-more-person households only. One-person households are a separate
  survey population and are NOT in this table.

### F2. Japan, households (read-at-source)
Statistics Bureau of Japan, 2020 Population Census, Basic Complete Tabulation on Population and
Households, results outline (outline_01.pdf), Table I-4-2 "general households by number of
household members": 55,704,949 general households in 2020; 21,151,042 one-person households
(38.0 percent). Two-or-more-person households = 34,553,907 (derived by subtraction).
https://www.stat.go.jp/data/kokusei/2020/kekka/pdf/outline_01.pdf

### F3. Damodaran, the big market delusion (read-at-source, blog)
- Aswath Damodaran, "Big Markets, Over Confidence and the Macro Delusion", Musings on Markets,
  28 August 2015. Method: take each listed online advertising company's market value, solve for
  the 2025 revenue it implies, add them up. The imputed 2025 online ad revenues totalled about
  $523 billion against his optimistic 2025 online ad market estimate of about $466 billion
  (built from about $545 billion global advertising in 2014, $138 billion of it digital). The
  sum exceeds the market, so the group is collectively overpriced. Section heading lens:
  individual rationality, collective irrationality.
- Aswath Damodaran, "The Market is Huge! Revisiting the Big Market Delusion", Musings on Markets,
  29 December 2019. Three ingredients: a big market story, overconfidence, and companies that are
  priced rather than valued. Some companies will succeed; the group is overpriced; a correction
  follows. Short quote allowed (under 15 words): "young companies tend to be priced, not valued".
- The paper: Brad Cornell and Aswath Damodaran, "The Big Market Delusion: Valuation and
  Investment Implications". **reported** (SSRN returned 403; journal and year not read). Name it,
  never date it.
- Cite in the form read: "Damodaran, Musings on Markets, 2015 and 2019 posts".

### F4. April Dunford, Obviously Awesome (reported)
Positioning components in order: competitive alternatives, unique attributes, value, target
customers, market category (some summaries add trends). Category comes last: it is chosen as the
frame that makes the value obvious. Read only in secondary summaries: pages say "reported" and
paraphrase; no quotes.

### F5. Mark Roberge (reported)
The Sales Acceleration Formula (2015) and his later writing on scaling: do not scale go-to-market
spend before your own numbers show readiness (retention / win rate / sales cycle / payback).
Paraphrase as his stance, "reported". No quotes, no numbers attributed to him.

### F6. Bass diffusion (reported)
Frank Bass, "A New Product Growth Model for Consumer Durables", Management Science, 1969 (reported).
Use only as a shape: adoption starts slow (innovators), accelerates (imitators), saturates.
No parameters attributed to the paper. Any p and q on a page is constructed.

### F7. New-entrant share base rates
No base-rate study was read at source. Teach as a principle: in a crowded category most entrants
end small, and a plan should be checked against the shares that comparable entrants actually
reached, with a constructed worked example labelled constructed. Never quote a percentage.

### F8. Analyst-firm market sizes (contested, principle)
Method usually not published in the summary; vendors sell the report; definitions of the category
vary between firms. Teach the disagreement: some teams use them as an outside anchor, others treat
any figure without method as unusable. No firm named, no figure quoted.

## Constructed (Kettle & Co, labelled on every widget)

Assumptions (lo / mid / hi): premium share of leaf spend 0.25 / 0.33 / 0.40; share bought online
0.22 / 0.30 / 0.40; households that buy the category online 3.5% / 4.5% / 5.5%; spend per order
2,100 / 2,400 / 2,700 yen; orders per buyer per year 2.8 / 3.5 / 4.2. Analyst figure 50 billion yen
(no method). Year-5 plans: Kettle & Co 10%, Entrant B 18%, Entrant C 22%, Entrant D 15%,
incumbents holding 55%.

## Bench canon (node `materials/run-ladder.js` = python `materials/msz_reference.py`, identical by value)

Agreement check: `python3 materials/compare-ladder.py` compares the two outputs by parsed value and
exits 0 only when every shared number is identical (2026-10-11: 0 differences; verified to report
37 differences against a planted 0.1 percent fault). A raw text compare of the two JSON dumps
always differs, at char 153: node prints one extra key, `selfTest` (the engine's on-load checks,
not implemented in Python). That was a formatting difference, not a numeric mismatch.

Billions of yen a year, 2 dp; ratios 2 dp. Default: premium loose-leaf, two-or-more-person households.

| Rung | Printed |
|---|---|
| 1 top-down only | 19.63 (range 10.90 to 31.72) |
| 2 bottom-up only | 13.06 (range 7.11 to 21.55) |
| 3 triangulated | gap 1.50x; overlap 10.90 to 21.55; explains most: share bought online, closes 76% of the gap at the edge of its range; then premium share 68, buyers 49, orders 45, spend per order 29 |
| 4 triangulated + hero ("every tea drinker is our customer") | top-down 198.24 (point, filters off); hero multiplier 10.1x; gap 15.18x; ranges do not overlap; best single input closes 7% |
| break: analyst report number | top-down replaced by 50.00; gap 3.83x; "cannot close", no assumption to compare |

Category toggle (top-down middle; gap against the same bottom-up):
tea, all of it 148.96 (range 109.24 to 198.62), gap 11.40x; premium loose-leaf 19.63, gap 1.50x;
wellness drinks 271.00, gap 20.75x. Under tea and wellness, no single input closes the gap
(best: share bought online, 13% and 10%).

Population toggle (one-person households included at the same spend): top-down 31.64, bottom-up
21.06, gap still 1.50x. Lesson: a wrong input that both methods share cancels in the ratio;
triangulation only checks what the two methods do NOT share.

Widget-printed values also quoted on pages (verified in the served page 2026-10-11): a1 top-down
ranges 31.64 (17.58 to 51.13) all households; Shizuoka 33.16 (18.42 to 53.59); Naha leaf 3,279 yen,
11.22 (6.23 to 18.13); a6 population toggle bottom-up 21.06 (11.46 to 34.74). Constructed-only
arithmetic (labelled on the page): a2 sample order rows; a3 office proxies (40,000 tea-providing
offices x 50,000 yen = 2.0 bn; 720,000,000 cups x 5 yen = 3.6 bn; gap 1.8x); b4 ramp 1 / 2.5 / 4.5 /
7 / 10 percent of SAM = 0.20 / 0.49 / 0.88 / 1.37 / 1.96.

Spend profile (a1 widget): applying Shizuoka's leaf spend (9,694 yen) to every household gives a
top-down of 33.16 against 19.63.

Tornado (gap at each input's low / high, others at mid), widest first: share bought online 1.10 /
2.00; premium share 1.14 / 1.82; buyers 1.93 / 1.23; orders 1.88 / 1.25; spend per order 1.72 / 1.34.

Collision (a5 widget): plans add up to 120% of a 19.63 market: 23.55 planned, 3.93 with no customer.
Per player: Kettle 1.96, B 3.53, C 4.32, D 2.94, incumbents 10.79.

Engine self-test (on load): hero must inflate the top-down and widen the gap; the analyst figure
must leave nothing to explain; every range contains its point; tea items add to the survey total
within 2 yen. Verified to FAIL against a planted fault (hero filters left on): 2 failures.

## Per-session coverage

Business (no code):
- **b1 What a market size is for.** The decision a size informs; TAM / SAM / SOM, why TAM is the
  least useful; the category is chosen before the size (Dunford's order, reported); the category
  toggle's three sizes (148.96 / 19.63 / 271.00) as the illustration. Link to Marketing for
  positioning.
- **b2 Reading a sizing deck.** The hero assumption (10.1x), vanity TAM, "1% of a huge market",
  analyst-report numbers without method (contested, F8), the five questions to ask of any slide.
- **b3 Who owns which half.** Evidence (data) vs the bet (marketing / BD); the one-page sizing
  brief: question, decision, owner, category, method, range, the assumption that would change the
  call. Links to Marketing Analytics p2 / p3 for the ownership map and intake (not re-taught).
- **b4 From size to plan.** Realistic penetration, ramp, base rates as principle (F7); an evidence
  gate before anyone believes the share figure (Roberge, reported): win rate, cycle, payback, repeat
  in your own numbers.

Analyst (hands-on, widgets compute in the browser):
- **a1 Top-down.** Census households -> survey spend per household -> segment shares. The survey
  population (two-or-more-person households), item choice, the Shizuoka extrapolation (33.16),
  rounding in published tables. Widget: topdown.
- **a2 Bottom-up.** Buyers x spend per order x orders a year from your own data; where each input
  comes from (pilot, orders table, repeat); the range per input; 13.06 (7.11 to 21.55). Widget: bottomup.
- **a3 Analogy and proxy.** Comparable markets, adjacent categories, proxy signals (search volume,
  job postings, import statistics), each with its failure mode; the office tea question as a proxy
  problem (no government table measures office purchases at item level). No figures beyond F1/F2.
- **a4 Ranges, not points.** Ranges as corners, sensitivity, the tornado (canon above). Widget: tornado.
- **a5 Share realism.** Adoption curve shape (Bass, reported, shape only), base rates as principle,
  distribution ceilings, the collision test (120%, Damodaran's method read at source). Widget: collision.
- **a6 The triangulation bench.** Full ladder, category toggle, population toggle, hero, break.

## Seams (absolute links, say them out loud)

- https://phoebefu6.github.io/learn-marketing-analytics-with-phoebe/courses/p2-the-ownership-map.html
  and p3-intake-and-the-service-menu.html own the DA vs marketing / BD ownership map and intake.
  Market sizing is a "both" row there with a split contract. b3 links, never re-teaches.
- https://phoebefu6.github.io/learn-strategic-thinking-with-phoebe/ owns strategy frameworks.
- https://phoebefu6.github.io/learn-economics-with-phoebe/ owns elasticity and pricing from data.
- https://phoebefu6.github.io/learn-timeseries-forecasting-with-phoebe/ owns forecasting; a5 uses
  adoption curves only as a realism check.
- https://phoebefu6.github.io/learn-marketing-with-phoebe/ owns positioning for marketers; b1
  links there for the category choice.
- https://phoebefu6.github.io/learn-ai-consulting-with-phoebe/ b2 touches sizing in a proposal.

## Not covered (honest list)

- Forecasting market growth over time (Timeseries Forecasting owns it).
- Primary research design: surveys, conjoint, panels (fieldwork is marketing's; not taught).
- Price elasticity and willingness to pay (Economics owns it).
- Office / B2B purchases from a government table: none found at item level; a3 treats it as a proxy problem.
- One-person household tea spend: a separate FIES population, not read; the bench labels the
  "all households" option as an assumption.
- Exchange rates: every figure stays in yen.
- Sampling error of the FIES ranking table: not published in the table read; not quantified.
- Any named analyst firm or its figures.

## Corrections to the course block

- "Office wellness drinks" became "Wellness drinks" (household): no government table measures
  office purchases at item level, so an office category on the real-rows top-down would have been
  constructed end to end. The office question moves to a3 as a proxy problem.
- The hero multiplier is 10.1x (premium and online filters off on the leaf category), matching "~10x".

## Citation appendix (the exact forms pages use)

1. Statistics Bureau of Japan, Family Income and Expenditure Survey, two-or-more-person households, item ranking by prefectural capital and designated city, 2023-2025 average (drinks). Read at source.
2. Statistics Bureau of Japan, 2020 Population Census, Basic Complete Tabulation on Population and Households, Table I-4-2. Read at source.
3. Damodaran, "Big Markets, Over Confidence and the Macro Delusion", Musings on Markets, 2015. Read at source.
4. Damodaran, "The Market is Huge! Revisiting the Big Market Delusion", Musings on Markets, 2019. Read at source.
5. Cornell and Damodaran, "The Big Market Delusion: Valuation and Investment Implications". Reported.
6. April Dunford, Obviously Awesome. Reported.
7. Mark Roberge, The Sales Acceleration Formula. Reported.
8. Frank Bass, "A New Product Growth Model for Consumer Durables", Management Science, 1969. Reported.
