"""Extract the tea and drinks rows from the Statistics Bureau of Japan ranking workbook.
Source (read at source 2026-10-10): Family Income and Expenditure Survey, two-or-more-person
households, item ranking by prefectural capital and designated city, 2023-2025 average,
file https://www.stat.go.jp/data/kakei/zuhyou/rank11.xlsx (drinks), page https://www.stat.go.jp/data/kakei/5.html
Each column of the workbook is a separately sorted ranking (city, value); this script re-pairs
them into one row per city. Units: yen per household per year, grams where marked.
Usage: python3 extract-fies.py <rank11.xlsx>   -> writes fies-drinks-2023-2025.csv next to this file
"""
import csv, os, sys
import openpyxl

CITY_EN = {"全国": "Japan (national)", "札幌市": "Sapporo", "青森市": "Aomori", "盛岡市": "Morioka", "仙台市": "Sendai",
 "秋田市": "Akita", "山形市": "Yamagata", "福島市": "Fukushima", "水戸市": "Mito", "宇都宮市": "Utsunomiya",
 "前橋市": "Maebashi", "さいたま市": "Saitama", "千葉市": "Chiba", "東京都区部": "Tokyo (ward area)", "横浜市": "Yokohama",
 "川崎市": "Kawasaki", "相模原市": "Sagamihara", "新潟市": "Niigata", "富山市": "Toyama", "金沢市": "Kanazawa",
 "福井市": "Fukui", "甲府市": "Kofu", "長野市": "Nagano", "岐阜市": "Gifu", "静岡市": "Shizuoka", "浜松市": "Hamamatsu",
 "名古屋市": "Nagoya", "津市": "Tsu", "大津市": "Otsu", "京都市": "Kyoto", "大阪市": "Osaka", "堺市": "Sakai",
 "神戸市": "Kobe", "奈良市": "Nara", "和歌山市": "Wakayama", "鳥取市": "Tottori", "松江市": "Matsue", "岡山市": "Okayama",
 "広島市": "Hiroshima", "山口市": "Yamaguchi", "徳島市": "Tokushima", "高松市": "Takamatsu", "松山市": "Matsuyama",
 "高知市": "Kochi", "福岡市": "Fukuoka", "北九州市": "Kitakyushu", "佐賀市": "Saga", "長崎市": "Nagasaki",
 "熊本市": "Kumamoto", "大分市": "Oita", "宮崎市": "Miyazaki", "鹿児島市": "Kagoshima", "那覇市": "Naha"}
# (workbook item index, csv column)
KEEP = [(1, "tea_all_yen"), (2, "green_leaf_yen"), (3, "green_leaf_g"), (4, "black_leaf_yen"), (5, "black_leaf_g"),
        (6, "other_leaf_yen"), (7, "other_leaf_g"), (8, "tea_drinks_yen"), (17, "lactic_drinks_yen"),
        (19, "mineral_water_yen"), (20, "sports_drinks_yen")]

def main(path):
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    data = {}
    for r in rows[4:]:
        if r[0] is None or r[1] is None: continue
        for k, col in KEEP:
            city, val = r[1 + 2 * k], r[2 + 2 * k]
            data.setdefault(city, {})[col] = int(val)
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fies-drinks-2023-2025.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["city"] + [c for _, c in KEEP])
        for city in sorted(data, key=lambda c: (c != "全国", CITY_EN[c])):
            w.writerow([CITY_EN[city]] + [data[city][c] for _, c in KEEP])
    print("wrote", out, len(data), "rows")

if __name__ == "__main__":
    main(sys.argv[1])
