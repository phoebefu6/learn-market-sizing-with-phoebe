// node materials/run-ladder.js - runs the real browser engine on the generated sample, prints the canon as JSON
const fs = require("fs"), path = require("path");
const M = require(path.join(__dirname, "..", "assets", "msz-live.js"));
const src = fs.readFileSync(path.join(__dirname, "..", "assets", "msz-sample.js"), "utf8");
const win = {}; new Function("window", src)(win);
const S = win.MSZ_SAMPLE;
const b = (x) => x == null ? null : Math.round(x / 1e7) / 100; // billions of yen, 2 dp
const r2 = (x) => Math.round(x * 100) / 100;
const L = M.ladder(S);
const tri = (t) => ({ td: b(t.td.mid), tdLo: b(t.td.lo), tdHi: b(t.td.hi), bu: b(t.bu.mid), buLo: b(t.bu.lo), buHi: b(t.bu.hi),
  gap: r2(t.gap), overlap: t.overlap ? t.overlap.map(b) : null, explains: t.explains ? t.explains.key : null,
  explainsPct: t.explains ? Math.round(t.explains.closes * 100) : null, verdict: t.verdict,
  ranked: t.ranked.map((x) => [x.key, Math.round(x.closes * 100)]) });
const out = {
  selfTest: M.selfTest(S),
  spend: { tea: M.spendPerHousehold(S, "tea"), leaf: M.spendPerHousehold(S, "leaf"), wellness: M.spendPerHousehold(S, "wellness") },
  households: S.households,
  rung1_topDownOnly: { mid: b(L.topDown.mid), lo: b(L.topDown.lo), hi: b(L.topDown.hi) },
  rung2_bottomUpOnly: { mid: b(L.bottomUp.mid), lo: b(L.bottomUp.lo), hi: b(L.bottomUp.hi) },
  rung3_triangulated: tri(L.triangulated),
  rung4_hero: Object.assign(tri(L.hero), { heroMultiplier: Math.round(L.heroMultiplier * 10) / 10 }),
  break_analyst: tri(L.analyst),
  categories: L.categories.map((c) => ({ id: c.id, td: b(c.td), gap: r2(c.gap) })),
  scopeAll: tri(M.triangulate(S, { scope: "all" })),
  tornado: L.tornado.rows.map((x) => ({ key: x.key, gapLo: r2(x.gapLo), gapHi: r2(x.gapHi) })),
  collision: { totalShare: Math.round(L.collision.totalShare * 100), market: b(L.collision.market), planned: b(L.collision.plannedRevenue) },
};
console.log(JSON.stringify(out, null, 1));
