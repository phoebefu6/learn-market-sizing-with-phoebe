/* msz-bench.js - the sizing widgets. Renders into any element with class "msz-widget":
 *   data-mode="topdown"   Analyst session 1, the top-down chain on the real survey rows
 *   data-mode="bottomup"  Analyst session 2, customers x price x frequency (constructed inputs)
 *   data-mode="tornado"   Analyst session 4, which assumption moves the gap most
 *   data-mode="collision" Analyst session 5, every player's planned share of one market, added up
 *   data-mode="bench"     Analyst session 6, the triangulation bench (rungs, category, hero, break)
 * Every number is computed by msz-live.js the moment a control changes; nothing is stored. */
(function () {
  "use strict";
  var S, L;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function bn(x) { return (Math.round(x / 1e7) / 100).toFixed(2); }
  function yen(x) { return Math.round(x).toLocaleString("en-US"); }
  function pct(x, dp) { return (x * 100).toFixed(dp == null ? 1 : dp) + "%"; }
  function r2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function fmtVal(a, v) { return a.unit === "share" ? pct(v, a.lo < 0.1 ? 1 : 0) : a.unit === "yen" ? yen(v) + " yen" : v.toFixed(1); }

  function metric(box, kind) {
    var m = el("div", "mb-metric"), value = el("span", "mb-mvalue", ""), label = el("span", "mb-mlabel", "");
    m.appendChild(value); m.appendChild(label); m.appendChild(el("span", "mb-mkind " + (kind === "real" ? "is-measured" : "is-heuristic"), kind === "real" ? "survey rows" : kind));
    box.appendChild(m);
    return { set: function (v, l) { value.textContent = v; label.textContent = l; }, node: m };
  }

  function slider(parent, key, state, onChange) {
    var a = S.assume[key], wrap = el("label", "mb-ctl mb-range msz-slider");
    wrap.appendChild(document.createTextNode(a.label));
    var inp = document.createElement("input"); inp.type = "range";
    var step = a.unit === "yen" ? 50 : a.unit === "share" ? (a.lo < 0.1 ? 0.0025 : 0.01) : 0.1;
    inp.min = String(a.lo * 0.6); inp.max = String(a.hi * 1.4); inp.step = String(step); inp.value = String(a.mid);
    inp.setAttribute("aria-label", a.label);
    var out = el("b", null, fmtVal(a, a.mid));
    inp.addEventListener("input", function () { state[key] = parseFloat(inp.value); out.textContent = fmtVal(a, state[key]); onChange(); });
    wrap.appendChild(inp); wrap.appendChild(out);
    parent.appendChild(wrap);
    return { reset: function () { inp.value = String(a.mid); out.textContent = fmtVal(a, a.mid); } };
  }

  function select(parent, label, options, value, onChange) {
    var lab = el("label", "mb-ctl"); lab.appendChild(document.createTextNode(label + " "));
    var s = document.createElement("select"); s.setAttribute("aria-label", label);
    options.forEach(function (o) { var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; s.appendChild(op); });
    s.value = value; s.addEventListener("change", function () { onChange(s.value); });
    lab.appendChild(s); parent.appendChild(lab); return s;
  }

  function chainList(chain) {
    var ol = el("ol", "msz-chain");
    chain.forEach(function (c) {
      var li = el("li", c.constructed ? "is-constructed" : "is-real");
      li.appendChild(el("span", "msz-step", c.step));
      var v = c.unit === "households" ? yen(c.value) + " households" : c.unit === "share" ? pct(c.value, c.value < 0.1 ? 1 : 0)
        : c.unit === "yen a year" ? yen(c.value) + " yen a year" : c.unit === "yen" ? (c.value >= 1e8 ? bn(c.value) + " billion yen" : yen(c.value) + " yen") : c.value.toFixed(1) + " a year";
      li.appendChild(el("b", null, v));
      li.appendChild(el("em", null, c.constructed ? "constructed" : "real"));
      ol.appendChild(li);
    });
    return ol;
  }

  function scopeOptions() { return [["two", "Two-or-more-person households (the survey's own population)"], ["all", "All households, one-person included (assumes they spend the same)"]]; }
  function catOptions() { return S.categories.map(function (c) { return [c.id, c.label]; }); }

  /* ---------- top-down (a1) ---------- */
  function buildTopDown(root) {
    var st = { category: "leaf", scope: "two", place: S.rows[0][0] };
    var wrap = el("div", "mb-wrap"); wrap.appendChild(el("h4", null, "The top-down chain, on the real survey rows"));
    wrap.appendChild(el("p", "mb-intro", "Households from the 2020 Census, spend per household from the Family Income and Expenditure Survey (2023-2025 average). The two shares are constructed Kettle & Co planning assumptions. Change the category, the population, or whose spending you assume."));
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    select(ctl, "Category", catOptions(), st.category, function (v) { st.category = v; render(); });
    select(ctl, "Population", scopeOptions(), st.scope, function (v) { st.scope = v; render(); });
    select(ctl, "Spend per household as in", S.rows.map(function (r) { return [r[0], r[0]]; }), st.place, function (v) { st.place = v; render(); });
    var sl = el("div", "mb-ctls"); wrap.appendChild(sl);
    slider(sl, "prem", st, render); slider(sl, "online", st, render);
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var chainBox = el("div"); wrap.appendChild(chainBox);
    var hint = el("p", "mb-hint", ""); wrap.appendChild(hint);
    root.appendChild(wrap);
    function render() {
      var o = { category: st.category, scope: st.scope === "all" ? "all" : null, place: st.place, prem: st.prem, online: st.online };
      var t = L.topDown(S, o);
      verdict.textContent = "Top-down: " + bn(t.mid) + " billion yen a year (range " + bn(t.lo) + " to " + bn(t.hi) + ")";
      chainBox.innerHTML = ""; chainBox.appendChild(chainList(t.chain));
      hint.textContent = st.place === S.rows[0][0] ? "Shares are applied only where the category needs them: the premium share applies to premium loose-leaf only. Real rows are marked real; your own shares will differ."
        : "You are applying one city's spend per household to every household in Japan. The survey measured that rate in " + st.place + " only; the chain now extrapolates it.";
    }
    render();
  }

  /* ---------- bottom-up (a2) ---------- */
  function buildBottomUp(root) {
    var st = {};
    var wrap = el("div", "mb-wrap"); wrap.appendChild(el("h4", null, "The bottom-up chain: buyers x spend per order x orders a year"));
    wrap.appendChild(el("p", "mb-intro", "The household count is real (2020 Census, two-or-more-person households). The three inputs are constructed Kettle & Co pilot numbers, each with the low and high its own data supports."));
    var sl = el("div", "mb-ctls"); wrap.appendChild(sl);
    ["buyer", "price", "freq"].forEach(function (k) { slider(sl, k, st, render); });
    var verdict = el("div", "mb-verdict is-ok"); wrap.appendChild(verdict);
    var chainBox = el("div"); wrap.appendChild(chainBox);
    wrap.appendChild(el("p", "mb-hint", "Each input's range moves with its slider: the low and high keep the same ratio to the middle as Kettle & Co's pilot gives. Your numbers will differ."));
    root.appendChild(wrap);
    function render() {
      var b = L.bottomUp(S, st);
      verdict.textContent = "Bottom-up: " + bn(b.mid) + " billion yen a year (range " + bn(b.lo) + " to " + bn(b.hi) + ")";
      chainBox.innerHTML = ""; chainBox.appendChild(chainList(b.chain));
    }
    render();
  }

  /* ---------- tornado (a4) ---------- */
  function tornadoTable(t) {
    var box = el("div", "msz-tornado"), max = 0;
    t.rows.forEach(function (r) { max = Math.max(max, Math.abs(Math.log(r.gapLo)), Math.abs(Math.log(r.gapHi))); });
    var scale = function (g) { return 50 + 46 * Math.log(g / t.gap) / (max || 1); };
    t.rows.forEach(function (r) {
      var row = el("div", "msz-trow");
      row.appendChild(el("span", "msz-tlabel", r.label + (r.side === "td" ? " (top-down)" : " (bottom-up)")));
      var bar = el("span", "msz-tbar"), a = scale(Math.min(r.gapLo, r.gapHi)), b = scale(Math.max(r.gapLo, r.gapHi));
      var fill = el("i"); fill.style.left = Math.max(0, a) + "%"; fill.style.width = Math.max(1, b - a) + "%"; bar.appendChild(fill);
      var mid = el("u"); mid.style.left = "50%"; bar.appendChild(mid);
      row.appendChild(bar);
      row.appendChild(el("span", "msz-tval", "gap " + r2(r.gapLo) + " at low, " + r2(r.gapHi) + " at high"));
      box.appendChild(row);
    });
    return box;
  }
  function buildTornado(root) {
    var wrap = el("div", "mb-wrap"); wrap.appendChild(el("h4", null, "The tornado: the gap between the two methods, one assumption at a time"));
    wrap.appendChild(el("p", "mb-intro", "Each bar moves one assumption from its low to its high while every other input sits at its middle. The line in the middle is today's gap. Premium loose-leaf, two-or-more-person households; constructed inputs, real survey rows."));
    var t = L.tornado(S, {});
    var v = el("div", "mb-verdict is-ok", "Gap at the middle of every input: top-down is " + r2(t.gap) + " times bottom-up. Widest bar: " + t.rows[0].label.toLowerCase() + ".");
    wrap.appendChild(v); wrap.appendChild(tornadoTable(t));
    wrap.appendChild(el("p", "mb-hint", "A gap of 1.00 means the two methods agree. Sorted by how far each bar swings on a log scale. Change an input on the bench in Analyst session 6 and the order can change."));
    root.appendChild(wrap);
  }

  /* ---------- collision (a5) ---------- */
  function buildCollision(root) {
    var c = L.collision(S);
    var wrap = el("div", "mb-wrap"); wrap.appendChild(el("h4", null, "The collision test: add up everyone's plan"));
    wrap.appendChild(el("p", "mb-intro", "Five constructed year-5 plans, each a share of the same market: premium loose-leaf bought online, sized top-down at its middle. Each deck is reasonable on its own page."));
    var tw = el("div", "mk-tablewrap"), t = el("table", "mk-table msz-ctable"), hr = el("tr");
    ["Who", "Planned share", "Planned revenue, billion yen"].forEach(function (h) { hr.appendChild(el("th", null, h)); });
    var th = el("thead"); th.appendChild(hr); t.appendChild(th);
    var tb = el("tbody");
    c.rows.forEach(function (r) { var tr = el("tr"); tr.appendChild(el("td", null, r.who)); tr.appendChild(el("td", "mk-n", pct(r.share, 0))); tr.appendChild(el("td", "mk-n", bn(r.revenue))); tb.appendChild(tr); });
    var tr = el("tr", "msz-total"); tr.appendChild(el("td", null, "All plans added up")); tr.appendChild(el("td", "mk-n", pct(c.totalShare, 0))); tr.appendChild(el("td", "mk-n", bn(c.plannedRevenue))); tb.appendChild(tr);
    t.appendChild(tb); tw.appendChild(t);
    var v = el("div", "mb-verdict " + (c.totalShare > 1 ? "is-bad" : "is-good"),
      c.totalShare > 1 ? "The plans add up to " + pct(c.totalShare, 0) + " of a " + bn(c.market) + " billion yen market: " + bn(c.plannedRevenue - c.market) + " billion yen of planned revenue has no customer." : "The plans fit inside the market.");
    wrap.appendChild(v); wrap.appendChild(tw);
    wrap.appendChild(el("p", "mb-hint", "Every plan and every player is constructed. The test is the method: the same addition run on real valuations is in the reading below."));
    root.appendChild(wrap);
  }

  /* ---------- the bench (a6) ---------- */
  var RUNGS = [
    { id: "td", name: "1 · Top-down only", note: "Census households x survey spend x two shares. One method, one range." },
    { id: "bu", name: "2 · Bottom-up only", note: "Households x buyers x spend per order x orders. Kettle & Co's own pilot numbers." },
    { id: "tri", name: "3 · Triangulated", note: "Both methods side by side: the gap, the overlap, and the assumption that explains most of the gap." },
    { id: "hero", name: "4 · Triangulated, hero assumption", note: "Every tea drinker is our customer: the premium and online filters come off.", anti: true }
  ];
  function buildBench(root) {
    var st = { rung: "tri", category: "leaf", scope: "two", analyst: false, mids: {} }, sliders = [];
    var wrap = el("div", "mb-wrap"); wrap.appendChild(el("h4", null, "The triangulation bench: how big is premium loose-leaf tea online in Japan, for Kettle & Co?"));
    wrap.appendChild(el("p", "mb-intro", "Real rows: 34,553,907 two-or-more-person households (2020 Census) and their tea spend per household (Family Income and Expenditure Survey, 2023-2025 average). Constructed: every Kettle & Co share, price and frequency, the analyst figure. Press a rung, change an input, toggle the category, then press the break button."));
    var presets = el("div", "mb-presets"), inputs = [];
    RUNGS.forEach(function (g) {
      var lab = el("label", "mb-preset" + (g.anti ? " is-anti" : "")), inp = document.createElement("input");
      inp.type = "radio"; inp.name = "msz-rung"; inp.value = g.id; lab.appendChild(inp);
      var name = el("span", "mb-pname", g.name); lab.appendChild(name); if (g.anti) name.appendChild(el("em", "mb-anti", " · anti-lever"));
      lab.appendChild(el("span", "mb-pnote", g.note));
      inp.addEventListener("change", function () { st.rung = g.id; render(); });
      presets.appendChild(lab); inputs.push(inp);
    });
    wrap.appendChild(presets);
    var ctl = el("div", "mb-ctls"); wrap.appendChild(ctl);
    select(ctl, "Category", catOptions(), st.category, function (v) { st.category = v; render(); });
    select(ctl, "Population", scopeOptions(), st.scope, function (v) { st.scope = v; render(); });
    var brk = el("button", "mb-break", "Break it: use the analyst report number"); brk.type = "button";
    brk.addEventListener("click", function () { st.analyst = !st.analyst; brk.textContent = st.analyst ? "Go back to the method" : "Break it: use the analyst report number"; render(); });
    ctl.appendChild(brk);
    var sl = el("div", "mb-ctls"); wrap.appendChild(sl);
    ["prem", "online", "buyer", "price", "freq"].forEach(function (k) { sliders.push(slider(sl, k, st.mids, render)); });
    var verdict = el("div", "mb-verdict"); wrap.appendChild(verdict);
    var mbox = el("div", "mb-metrics"); wrap.appendChild(mbox);
    var mTd = metric(mbox, "modelled"), mBu = metric(mbox, "constructed"), mGap = metric(mbox, "modelled"), mWhy = metric(mbox, "modelled");
    var tbox = el("div"); wrap.appendChild(tbox);
    wrap.appendChild(el("p", "mb-hint", "Ranges carry every assumption to its low and its high together. 'Explains most' is the one input that, moved to the edge of its own range, closes the largest part of the gap on a log scale. Your numbers will differ as soon as you move a slider."));
    root.appendChild(wrap);

    function render() {
      inputs.forEach(function (inp) { inp.checked = inp.value === st.rung; inp.parentNode.classList.toggle("is-on", inp.checked); });
      var o = { category: st.category, scope: st.scope === "all" ? "all" : null, hero: st.rung === "hero", analyst: st.analyst };
      for (var k in st.mids) o[k] = st.mids[k];
      var t = L.triangulate(S, o), showTd = st.rung !== "bu", showBu = st.rung !== "td", both = showTd && showBu;
      mTd.node.style.display = showTd ? "" : "none"; mBu.node.style.display = showBu ? "" : "none";
      mGap.node.style.display = both ? "" : "none"; mWhy.node.style.display = both ? "" : "none";
      var tdPoint = !t.td.analyst && bn(t.td.lo) === bn(t.td.hi);
      mTd.set(t.td.analyst || tdPoint ? bn(t.td.mid) : bn(t.td.lo) + " to " + bn(t.td.hi), t.td.analyst ? "top-down replaced by an analyst report figure, billion yen (constructed, no method)" : tdPoint ? "top-down, billion yen a year: a point, the hero assumption leaves no share to vary" : "top-down range, billion yen a year (middle " + bn(t.td.mid) + ")");
      mBu.set(bn(t.bu.lo) + " to " + bn(t.bu.hi), "bottom-up range, billion yen a year (middle " + bn(t.bu.mid) + ")");
      mGap.set(r2(t.gap) + "x", "the gap: top-down middle / bottom-up middle" + (t.overlap ? "; ranges overlap " + bn(t.overlap[0]) + " to " + bn(t.overlap[1]) : "; ranges do not overlap"));
      mWhy.set(t.explains ? t.explains.label : "unknown", t.explains ? "explains most: at the edge of its range it closes " + Math.round(t.explains.closes * 100) + "% of the gap" : "no method, so no assumption to compare");
      var v;
      if (st.rung === "td") v = { cls: "is-ok", text: "One method: " + bn(t.td.lo) + " to " + bn(t.td.hi) + " billion yen a year. Nothing yet checks it." };
      else if (st.rung === "bu") v = { cls: "is-ok", text: "One method: " + bn(t.bu.lo) + " to " + bn(t.bu.hi) + " billion yen a year, from Kettle & Co's own pilot. Nothing yet checks it." };
      else if (t.verdict === "cannot-close") v = { cls: "is-bad", text: "Triangulation cannot close: the analyst figure of " + bn(t.td.mid) + " billion yen has no method, so there is no assumption to compare and no way to know which number is wrong. Gap " + r2(t.gap) + "x, unexplainable." };
      else if (t.verdict === "overlap") v = { cls: "is-good", text: "The two methods overlap from " + bn(t.overlap[0]) + " to " + bn(t.overlap[1]) + " billion yen a year. Gap " + r2(t.gap) + "x; " + t.explains.label.toLowerCase() + " explains most of it." };
      else if (t.verdict === "one-input") v = { cls: "is-ok", text: "The ranges miss each other, but one input inside its own range closes the gap: " + t.explains.label.toLowerCase() + ". Gap " + r2(t.gap) + "x. Go and measure that input." };
      else v = { cls: "is-bad", text: "Gap " + r2(t.gap) + "x and no single input inside its range closes it (the best, " + t.explains.label.toLowerCase() + ", closes " + Math.round(t.explains.closes * 100) + "%). The two methods are not sizing the same thing." };
      verdict.className = "mb-verdict " + v.cls; verdict.textContent = v.text;
      tbox.innerHTML = "";
      if (both && !t.td.analyst) { tbox.appendChild(el("p", "msz-tcap", "Tornado for these settings: the gap with one input at its low and its high")); tbox.appendChild(tornadoTable(L.tornado(S, o))); }
    }
    render();
    window.MSZ_BENCH = { rung: function (id) { st.rung = id; render(); }, category: function (c) { st.category = c; render(); }, analyst: function (on) { st.analyst = !!on; render(); },
      read: function () { var o = { category: st.category, scope: st.scope === "all" ? "all" : null, hero: st.rung === "hero", analyst: st.analyst }; for (var k in st.mids) o[k] = st.mids[k]; return L.triangulate(S, o); } };
  }

  function init() {
    if (!window.MSZ || !window.MSZ_SAMPLE) return;
    S = window.MSZ_SAMPLE; L = window.MSZ;
    var test = L.selfTest(S);
    document.querySelectorAll(".msz-widget").forEach(function (root) {
      root.innerHTML = "";
      if (!test.ok) { root.appendChild(el("p", "mb-verdict is-bad", "Engine self-test failed: " + test.fails.join("; "))); return; }
      var m = root.getAttribute("data-mode");
      if (m === "topdown") buildTopDown(root); else if (m === "bottomup") buildBottomUp(root);
      else if (m === "tornado") buildTornado(root); else if (m === "collision") buildCollision(root); else buildBench(root);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
