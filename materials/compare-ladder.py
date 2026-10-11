"""Compare the node engine canon with the Python reference, by value.
Usage: python3 materials/compare-ladder.py   (exit 0 = every shared number identical)
The node output carries one extra key, selfTest (the engine's on-load checks), which the Python
reference does not implement; it is reported, then excluded. A byte or text compare of the two
JSON dumps always differs at that key, so compare parsed values, never raw text.
"""
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
node = json.loads(subprocess.check_output(["node", os.path.join(here, "run-ladder.js")]))
py = json.loads(subprocess.check_output([sys.executable, os.path.join(here, "msz_reference.py")]))
st = node.pop("selfTest", None)
print("node selfTest:", st)
diffs = []
def walk(a, b, p=""):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)): walk(a.get(k), b.get(k), p + "." + k)
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b)): walk(x, y, f"{p}[{i}]")
    elif a != b: diffs.append((p, a, b))
walk(node, py)
for d in diffs: print("DIFF", *d)
print("identical" if not diffs and st and st.get("ok") else "MISMATCH", "-", len(diffs), "differences")
sys.exit(1 if diffs or not (st and st.get("ok")) else 0)
