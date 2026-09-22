#!/usr/bin/env python3
"""Regenerate sitemap.xml from every *.html page in the repo root.
Usage: python3 scripts/sitemap.py   (run after adding or renaming pages)"""
import pathlib, datetime, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://one.group"
today = datetime.date.today().isoformat()
rows = []
for p in sorted(ROOT.glob("*.html")):
    html = p.read_text(encoding="utf-8")
    if re.search(r'name="robots" content="noindex', html):
        continue
    loc = SITE + "/" + ("" if p.name == "index.html" else p.name)
    pr = "1.0" if p.name == "index.html" else ("0.9" if p.name in ("quotes.html", "groups.html", "list-your-group.html") else "0.7")
    rows.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>")
xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(rows) + "\n</urlset>\n"
(ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")
print(f"sitemap.xml: {len(rows)} URLs")
