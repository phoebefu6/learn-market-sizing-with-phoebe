/* msz-live.js - the triangulation engine for learn-market-sizing-with-phoebe.
 * Pure functions, no DOM: runs the same in the browser (window.MSZ) and in node (module.exports).
 * Real inputs: Japan FIES 2023-2025 spend per household (msz-sample.js rows) and 2020 Census
 * household counts. Constructed inputs: every Kettle & Co assumption, the analyst figure, the plans.
 * materials/msz_reference.py must print the same numbers (to 4 significant figures) for every rung.
 *
 * Top-down  = households x survey spend per household on the category's items
 *             x premium share (only where the category is premium) x online share.
 * Bottom-up = households x share that buys the category online x spend per order x orders a year.
 * Ranges carry each assumption from its low to its high together (the corners of the box).
 * Gap = top-down mid / bottom-up mid. "Explains most" = the single assumption that, moved to the
 * edge of its own range in the closing direction, closes the largest part of log(gap).
 */
(function (root) {
  "use strict";

  function col(S, name) { return S.cols.indexOf(name); }
  function rowFor(S, place) {
    for (var i = 0; i < S.rows.length; i++) if (S.rows[i][0] === place) return S.rows[i];
    return S.rows[0];
  }
  function category(S, id) {
    for (var i = 0; i < S.categories.length; i++) if (S.categories[i].id === id) return S.categories[i];
    return S.categories[1];
  }
  function spendPerHousehold(S, catId, place) {
    var r = rowFor(S, place || S.rows[0][0]), c = category(S, catId), t = 0;
    c.items.forEach(function (it) { t += r[col(S, it)]; });
    return t;
  }
  function households(S, scope) { return scope === "all" ? S.households.general : S.households.twoPlus; }

  /* the value of an assumption at "lo" | "mid" | "hi", with the user's mid applied as a scale */
  function val(S, opts, key, at) {
    var a = S.assume[key], mid = (opts && opts[key] != null) ? opts[key] : a.mid;
    if (at === "mid") return mid;
    return mid * (a[at] / a.mid);
  }

  function topDown(S, o) {
    o = o || {};
    var cat = category(S, o.category || "leaf");
    if (o.analyst) {
      return { analyst: true, mid: S.analystFigure, lo: null, hi: null, chain: [{ step: "An analyst report says", value: S.analystFigure, unit: "yen", constructed: true }] };
    }
    var H = households(S, o.scope), s = spendPerHousehold(S, cat.id, o.place);
    var usePrem = cat.premium && !o.hero, useOn = !o.hero;
    function at(w) {
      var v = H * s;
      if (usePrem) v *= val(S, o, "prem", w);
      if (useOn) v *= val(S, o, "online", w);
      return v;
    }
    var chain = [{ step: o.scope === "all" ? "General households (one-person included)" : "Two-or-more-person households", value: H, unit: "households" },
                 { step: "Survey spend per household on " + cat.label.toLowerCase(), value: s, unit: "yen a year" }];
    if (usePrem) chain.push({ step: "x premium share", value: val(S, o, "prem", "mid"), unit: "share", constructed: true });
    if (useOn) chain.push({ step: "x share bought online", value: val(S, o, "online", "mid"), unit: "share", constructed: true });
    return { analyst: false, hero: !!o.hero, category: cat.id, mid: at("mid"), lo: at("lo"), hi: at("hi"), chain: chain,
             keys: [usePrem ? "prem" : null, useOn ? "online" : null].filter(Boolean) };
  }

  function bottomUp(S, o) {
    o = o || {};
    var H = households(S, o.scope);
    function at(w) { return H * val(S, o, "buyer", w) * val(S, o, "price", w) * val(S, o, "freq", w); }
    return { mid: at("mid"), lo: at("lo"), hi: at("hi"), keys: ["buyer", "price", "freq"],
             chain: [{ step: "Households", value: H, unit: "households" },
                     { step: "x share that buys the category online", value: val(S, o, "buyer", "mid"), unit: "share", constructed: true },
                     { step: "x spend per order", value: val(S, o, "price", "mid"), unit: "yen", constructed: true },
                     { step: "x orders per buyer a year", value: val(S, o, "freq", "mid"), unit: "per year", constructed: true }] };
  }

  /* how much of log(gap) one assumption closes at the edge of its own range */
  function closes(S, o, key, side, gap) {
    var mid = val(S, o, key, "mid"), lo = val(S, o, key, "lo"), hi = val(S, o, key, "hi");
    var down = gap > 1; // top-down is the bigger one: lower a td input, or raise a bu input
    var factor = side === "td" ? (down ? mid / lo : hi / mid) : (down ? hi / mid : mid / lo);
    return Math.log(factor) / Math.abs(Math.log(gap));
  }

  function triangulate(S, o) {
    o = o || {};
    var td = topDown(S, o), bu = bottomUp(S, o);
    var gap = td.mid / bu.mid, res = { td: td, bu: bu, gap: gap, overlap: null, explains: null, ranked: [], verdict: "" };
    if (td.analyst) {
      res.verdict = "cannot-close";
      return res;
    }
    var lo = Math.max(td.lo, bu.lo), hi = Math.min(td.hi, bu.hi);
    if (lo <= hi) res.overlap = [lo, hi];
    if (Math.abs(Math.log(gap)) < 1e-9) { res.verdict = "agree"; return res; }
    var cand = td.keys.map(function (k) { return { key: k, side: "td" }; }).concat(bu.keys.map(function (k) { return { key: k, side: "bu" }; }));
    res.ranked = cand.map(function (c) { return { key: c.key, side: c.side, label: S.assume[c.key].label, closes: closes(S, o, c.key, c.side, gap) }; })
      .sort(function (a, b) { return b.closes - a.closes || (a.key < b.key ? -1 : 1); });
    res.explains = res.ranked[0];
    res.verdict = res.overlap ? "overlap" : (res.explains.closes >= 1 ? "one-input" : "no-input");
    return res;
  }

  /* tornado: the gap at each assumption's low and high, every other input at its mid */
  function tornado(S, o) {
    o = o || {};
    var base = triangulate(S, o), keys = base.td.analyst ? [] : base.td.keys.concat(base.bu.keys), out = [];
    keys.forEach(function (k) {
      var lo = {}, hi = {}, x; for (x in o) { lo[x] = o[x]; hi[x] = o[x]; }
      var a = S.assume[k], mid = val(S, o, k, "mid");
      lo[k] = mid * (a.lo / a.mid); hi[k] = mid * (a.hi / a.mid);
      // keep the band anchored to the default ratios: evaluate the gap with this input moved
      var gl = topDown(S, lo).mid / bottomUp(S, lo).mid, gh = topDown(S, hi).mid / bottomUp(S, hi).mid;
      out.push({ key: k, label: a.label, side: a.side, gapLo: gl, gapHi: gh, swing: Math.abs(Math.log(gh) - Math.log(gl)) });
    });
    out.sort(function (a, b) { return b.swing - a.swing || (a.key < b.key ? -1 : 1); });
    return { gap: base.gap, rows: out };
  }

  /* the collision test: add up every player's planned share of the same market */
  function collision(S, market) {
    var total = 0; S.plans.forEach(function (p) { total += p.share; });
    var m = market == null ? topDown(S, {}).mid : market;
    return { totalShare: total, market: m, plannedRevenue: total * m, overshoot: total - 1,
             rows: S.plans.map(function (p) { return { who: p.who, kind: p.kind, share: p.share, revenue: p.share * m }; }) };
  }

  function ladder(S) {
    var tdOnly = topDown(S, {}), buOnly = bottomUp(S, {}), tri = triangulate(S, {}), hero = triangulate(S, { hero: true }), an = triangulate(S, { analyst: true });
    var cats = S.categories.map(function (c) { var t = triangulate(S, { category: c.id }); return { id: c.id, label: c.label, td: t.td.mid, gap: t.gap }; });
    return { topDown: tdOnly, bottomUp: buOnly, triangulated: tri, hero: hero, heroMultiplier: hero.td.mid / tri.td.mid,
             analyst: an, categories: cats, tornado: tornado(S, {}), collision: collision(S) };
  }

  /* properties the engine must hold; run on load. Each one fails against a planted fault. */
  function selfTest(S) {
    var fails = [], L = ladder(S);
    if (!(L.heroMultiplier > 1)) fails.push("hero assumption must inflate the top-down");
    if (!(L.hero.gap > L.triangulated.gap)) fails.push("hero assumption must widen the gap");
    if (L.analyst.explains !== null || L.analyst.overlap !== null) fails.push("analyst figure has no method, so nothing can explain its gap");
    var t = L.triangulated;
    if (!(t.td.lo <= t.td.mid && t.td.mid <= t.td.hi && t.bu.lo <= t.bu.mid && t.bu.mid <= t.bu.hi)) fails.push("every range must contain its point");
    if (Math.abs(spendPerHousehold(S, "tea") - S.rows[0][col(S, "tea_all_yen")]) > 2) fails.push("tea items must add up to the survey's tea total");
    return { ok: fails.length === 0, fails: fails };
  }

  var api = { topDown: topDown, bottomUp: bottomUp, triangulate: triangulate, tornado: tornado, collision: collision,
              ladder: ladder, selfTest: selfTest, spendPerHousehold: spendPerHousehold, households: households, val: val };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.MSZ = api;
})(this);
