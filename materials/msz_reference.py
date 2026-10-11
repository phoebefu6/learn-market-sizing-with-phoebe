"""Python reference for the triangulation bench (Analyst session 6) and the widgets on a1-a5.
Independent re-implementation of assets/msz-live.js from the same inputs (build-sample.py).
It must print the same canon as `node materials/run-ladder.js` (billions of yen to 2 dp, ratios
to 2 dp, percentages to the integer). Usage: python3 materials/msz_reference.py
"""
import importlib.util, json, math, os

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("bs", os.path.join(here, "build-sample.py"))
bs = importlib.util.module_from_spec(spec); spec.loader.exec_module(bs)
S = bs.SAMPLE
NAT = dict(zip(S["cols"], S["rows"][0]))
CATS = {c["id"]: c for c in S["categories"]}
A = S["assume"]

def H(scope=None): return S["households"]["general"] if scope == "all" else S["households"]["twoPlus"]
def spend(cat): return sum(NAT[i] for i in CATS[cat]["items"])
def v(key, at, mids):
    mid = mids.get(key, A[key]["mid"])
    return mid if at == "mid" else mid * A[key][at] / A[key]["mid"]

def top_down(category="leaf", hero=False, analyst=False, scope=None, **mids):
    if analyst: return dict(mid=S["analystFigure"], lo=None, hi=None, keys=[], analyst=True)
    c = CATS[category]; prem = c["premium"] and not hero; on = not hero
    def at(w):
        x = H(scope) * spend(category)
        if prem: x *= v("prem", w, mids)
        if on: x *= v("online", w, mids)
        return x
    return dict(mid=at("mid"), lo=at("lo"), hi=at("hi"), keys=[k for k, u in (("prem", prem), ("online", on)) if u], analyst=False)

def bottom_up(scope=None, **mids):
    at = lambda w: H(scope) * v("buyer", w, mids) * v("price", w, mids) * v("freq", w, mids)
    return dict(mid=at("mid"), lo=at("lo"), hi=at("hi"), keys=["buyer", "price", "freq"])

def triangulate(**o):
    mids = {k: o[k] for k in A if k in o}
    td = top_down(o.get("category", "leaf"), o.get("hero", False), o.get("analyst", False), o.get("scope"), **mids)
    bu = bottom_up(o.get("scope"), **mids)
    gap = td["mid"] / bu["mid"]
    res = dict(td=td, bu=bu, gap=gap, overlap=None, ranked=[], verdict="")
    if td["analyst"]: res["verdict"] = "cannot-close"; return res
    lo, hi = max(td["lo"], bu["lo"]), min(td["hi"], bu["hi"])
    if lo <= hi: res["overlap"] = [lo, hi]
    down = gap > 1
    ranked = []
    for side, keys in (("td", td["keys"]), ("bu", bu["keys"])):
        for k in keys:
            mid, l, h = v(k, "mid", mids), v(k, "lo", mids), v(k, "hi", mids)
            f = (mid / l if down else h / mid) if side == "td" else (h / mid if down else mid / l)
            ranked.append((k, math.log(f) / abs(math.log(gap))))
    ranked.sort(key=lambda x: (-x[1], x[0]))
    res["ranked"] = ranked
    res["verdict"] = "overlap" if res["overlap"] else ("one-input" if ranked[0][1] >= 1 else "no-input")
    return res

b = lambda x: None if x is None else round(x / 1e7) / 100
r2 = lambda x: round(x * 100) / 100

def tri(t):
    return dict(td=b(t["td"]["mid"]), tdLo=b(t["td"]["lo"]), tdHi=b(t["td"]["hi"]), bu=b(t["bu"]["mid"]),
                buLo=b(t["bu"]["lo"]), buHi=b(t["bu"]["hi"]), gap=r2(t["gap"]),
                overlap=[b(x) for x in t["overlap"]] if t["overlap"] else None,
                explains=t["ranked"][0][0] if t["ranked"] else None,
                explainsPct=round(t["ranked"][0][1] * 100) if t["ranked"] else None, verdict=t["verdict"],
                ranked=[[k, round(c * 100)] for k, c in t["ranked"]])

def tornado():
    base = triangulate(); rows = []
    for k in base["td"]["keys"] + base["bu"]["keys"]:
        g = {}
        for w in ("lo", "hi"):
            m = {k: A[k][w]}
            g[w] = top_down(**m)["mid"] / bottom_up(**m)["mid"]
        rows.append((abs(math.log(g["hi"]) - math.log(g["lo"])), k, g))
    rows.sort(key=lambda x: (-x[0], x[1]))
    return [dict(key=k, gapLo=r2(g["lo"]), gapHi=r2(g["hi"])) for _, k, g in rows]

def main():
    t3, t4, an = triangulate(), triangulate(hero=True), triangulate(analyst=True)
    td0, bu0 = top_down(), bottom_up()
    share = sum(p["share"] for p in S["plans"])
    out = dict(
        spend=dict(tea=spend("tea"), leaf=spend("leaf"), wellness=spend("wellness")),
        households=S["households"],
        rung1_topDownOnly=dict(mid=b(td0["mid"]), lo=b(td0["lo"]), hi=b(td0["hi"])),
        rung2_bottomUpOnly=dict(mid=b(bu0["mid"]), lo=b(bu0["lo"]), hi=b(bu0["hi"])),
        rung3_triangulated=tri(t3),
        rung4_hero=dict(tri(t4), heroMultiplier=round(t4["td"]["mid"] / t3["td"]["mid"] * 10) / 10),
        break_analyst=tri(an),
        categories=[dict(id=c, td=b(triangulate(category=c)["td"]["mid"]), gap=r2(triangulate(category=c)["gap"])) for c in CATS],
        scopeAll=tri(triangulate(scope="all")),
        tornado=tornado(),
        collision=dict(totalShare=round(share * 100), market=b(td0["mid"]), planned=b(share * td0["mid"])),
    )
    print(json.dumps(out, indent=1))

if __name__ == "__main__":
    main()
