from pathlib import Path
from html.parser import HTMLParser
import json,re,xml.etree.ElementTree as ET,html
root=Path(__file__).parent
pages=sorted(root.rglob('*.html'))
titles={}; problems=[]
class Scan(HTMLParser):
 def __init__(self): super().__init__(); self.h1=0; self.ids=[]; self.refs=[]; self.missing_alt=[]; self.jsonld=[]; self.in_json=False; self.json_buf=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1': self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag in ('a','link') and 'href' in a:self.refs.append(a['href'])
  if tag in ('img','script') and tag=='img':
   if 'alt' not in a:self.missing_alt.append(a.get('src','(no src)'))
   if 'src' in a:self.refs.append(a['src'])
  if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True;self.json_buf=[]
 def handle_endtag(self,tag):
  if tag=='script' and self.in_json:
   self.jsonld.append(''.join(self.json_buf));self.in_json=False
 def handle_data(self,data):
  if self.in_json:self.json_buf.append(data)
for p in pages:
 t=p.read_text(encoding='utf-8-sig'); rel=p.relative_to(root).as_posix(); title=re.search(r'<title>(.*?)</title>',t,re.S|re.I); desc=re.search(r'<meta\s+name="description"\s+content="([^"]*)"',t,re.S|re.I); canon=re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"',t,re.S|re.I)
 if not title or not desc or not canon: problems.append(f'Metadata missing: {rel}');continue
 title=html.unescape(title.group(1));description=html.unescape(desc.group(1));titles.setdefault(title,[]).append(rel)
 s=Scan();s.feed(t)
 if s.h1!=1:problems.append(f'H1 count {s.h1}: {rel}')
 if len(description)>165:problems.append(f'Description too long ({len(description)}): {rel}')
 if len(s.ids)!=len(set(s.ids)):problems.append(f'Duplicate id: {rel}')
 if s.missing_alt:problems.append(f'Missing image alt: {rel} {s.missing_alt}')
 for raw in s.jsonld:
  try:json.loads(raw)
  except Exception as e:problems.append(f'Invalid JSON-LD {rel}: {e}')
 for ref in s.refs:
  if not ref or ref.startswith(('#','http:','https:','mailto:','tel:','javascript:','data:')):continue
  target=ref.split('#')[0].split('?')[0]
  if not target:continue
  if target.startswith('/'):target=target.lstrip('/')
  q=(p.parent/target).resolve()
  if not q.exists():problems.append(f'Broken local ref: {rel} -> {ref}')
 if 'charset="utf-8"' not in t.lower():problems.append(f'UTF-8 charset missing: {rel}')
 if not re.search(r'name="robots" content="index, follow',t,re.I):problems.append(f'Robots missing: {rel}')
 print(f'{rel}: title={len(title)} chars, description={len(description)} chars, h1={s.h1}, canonical={canon.group(1)}')
for title,paths in titles.items():
 if len(paths)>1:problems.append(f'Duplicate title: {title} ({", ".join(paths)})')
try:ET.parse(root/'sitemap.xml')
except Exception as e:problems.append(f'Invalid sitemap XML: {e}')
if not (root/'robots.txt').exists():problems.append('robots.txt missing')
print('\nProblems:',len(problems))
for p in problems:print('-',p)
