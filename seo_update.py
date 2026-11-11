from pathlib import Path
import json, re, html

ROOT = Path(__file__).parent
BASE = 'https://itsmathewtj.github.io/MOS_SOLAR/'
PAGES = {
 'index.html': ('Solar Panel Installation Company in Kerala | MOS Solar', 'Explore rooftop solar installation, residential systems, commercial solar and EPC solutions from MOS Solar in Kerala. Talk with our team in Ernakulam.', 'solar company Kerala, solar panel installation Kerala, rooftop solar Kerala, solar EPC Kerala'),
 'about.html': ('About MOS Solar | Solar Energy Company in Kerala', 'Learn about MOS Solar, a Kerala solar energy provider supporting rooftop systems, solar EPC projects, inverter solutions and service for homes and businesses.', 'about MOS Solar Kerala, solar energy company Kerala, renewable energy Kerala'),
 'blog.html': ('Solar Energy Guides & Articles in Kerala | MOS Solar', 'Read MOS Solar guides about rooftop solar, system choices, maintenance, energy planning and subsidy topics for households and businesses in Kerala.', 'solar energy guides Kerala, rooftop solar advice, solar maintenance'),
 'blog/blog-details.html': ('Home Rooftop Solar Guide for Kerala | MOS Solar', 'Explore questions to consider when planning a home rooftop solar system, including energy use, roof conditions, system options and next steps.', 'home rooftop solar Kerala, residential solar guide, solar planning'),
 'calculator.html': ('Solar Savings Calculator for Kerala | MOS Solar', 'Create an illustrative solar estimate using your electricity bill, tariff, roof area and system assumptions. Download or print your estimate for discussion.', 'solar calculator Kerala, solar savings estimate, rooftop system sizing'),
 'contact.html': ('Contact MOS Solar in Ernakulam, Kerala | Get a Quote', 'Contact MOS Solar in Kaloor, Ernakulam to discuss residential, commercial or industrial solar, inverter and service support, or a site inspection.', 'contact solar company Kerala, solar installation Ernakulam, solar company Kaloor'),
 'products.html': ('Solar Panels, Inverters & Batteries in Kerala | MOS Solar', 'Explore solar panels, inverters, battery storage and related equipment with MOS Solar. Confirm current models, specifications and availability with the team.', 'solar panels Kerala, solar inverters Kerala, solar batteries, solar equipment'),
 'projects.html': ('Solar Projects & Portfolio in Kerala | MOS Solar', 'Explore illustrative solar project records and portfolio concepts from MOS Solar. Project details and images require verification and customer permission.', 'solar projects Kerala, rooftop solar installations, solar EPC projects'),
 'quote.html': ('Request a Solar Installation Quote in Kerala | MOS Solar', 'Request a solar consultation from MOS Solar. Share your property type, energy use and preferred system to begin a site-specific project discussion.', 'solar installation quote Kerala, solar consultation, rooftop solar quote'),
 'service.html': ('Solar Installation & EPC Services in Kerala | MOS Solar', 'Explore residential, commercial and industrial solar services from MOS Solar, including rooftop installation, EPC planning, inverter and service support.', 'solar installation Kerala, solar EPC company Kerala, solar maintenance'),
 'solutions.html': ('Solar Solutions for Homes & Business in Kerala | MOS Solar', 'Compare residential, commercial, industrial, on-grid, off-grid and hybrid solar options with MOS Solar. Discuss the right configuration for your site.', 'solar solutions Kerala, home solar, commercial solar, hybrid solar'),
 'subsidy.html': ('PM Surya Ghar Subsidy Guide | MOS Solar Kerala', 'Review current PM Surya Ghar residential rooftop assistance and official scheme resources. Eligibility and final assistance are determined by authorities.', 'PM Surya Ghar Kerala, rooftop solar subsidy, solar subsidy guide'),
 'team.html': ('Talk with the MOS Solar Team in Kerala | Consultation', 'Reach the MOS Solar team in Ernakulam to discuss your property, solar project requirements, service questions and possible next steps.', 'MOS Solar team Kerala, solar consultation Ernakulam'),
 'projects/project-commercial.html': ('Commercial Solar Project Template | MOS Solar Kerala', 'Review an illustrative commercial rooftop solar project template. Replace sample details with verified project information and obtain permission before publication.', 'commercial solar project Kerala, rooftop solar project template'),
 'projects/project-industrial.html': ('Industrial Solar Project Template | MOS Solar Kerala', 'Review an illustrative industrial solar project template. Add verified scope, location and capacity details only when documented and approved.', 'industrial solar project Kerala, solar EPC project template'),
 'projects/project-residential.html': ('Residential Solar Project Template | MOS Solar Kerala', 'Review an illustrative residential rooftop solar project template. Replace sample information with verified details and customer-approved photographs.', 'residential solar project Kerala, rooftop solar project template'),
 'solutions/commercial-solar.html': ('Commercial Solar Installation in Kerala | MOS Solar', 'Explore commercial rooftop solar planning shaped around property conditions, operating patterns, energy use and project requirements.', 'commercial solar installation Kerala, business rooftop solar'),
 'solutions/hybrid-solar.html': ('Hybrid Solar Systems in Kerala | MOS Solar', 'Learn about hybrid solar system planning that can combine solar, grid connection and battery storage options according to site priorities and design.', 'hybrid solar system Kerala, solar with battery storage'),
 'solutions/industrial-solar.html': ('Industrial Solar EPC in Kerala | MOS Solar', 'Discuss industrial solar EPC planning for factories and large facilities, starting with site conditions, available space and energy requirements.', 'industrial solar EPC Kerala, factory rooftop solar'),
 'solutions/off-grid.html': ('Off-Grid Solar Systems in Kerala | MOS Solar', 'Explore off-grid solar for sites that need independent power, with battery capacity and system design planned around energy demand and conditions.', 'off-grid solar Kerala, standalone solar system, solar battery system'),
 'solutions/on-grid.html': ('On-Grid Solar Systems in Kerala | MOS Solar', 'Learn how grid-connected solar works alongside a utility connection. Confirm system design, approvals and applicable utility requirements for your site.', 'on-grid solar Kerala, grid connected rooftop solar'),
 'solutions/residential-solar.html': ('Residential Rooftop Solar in Kerala | MOS Solar', 'Explore home rooftop solar, system configurations, installation planning and the roof, energy-use and site details that shape a suitable design.', 'residential solar installation Kerala, home rooftop solar'),
}

def canonical(path):
    rel = path.relative_to(ROOT).as_posix()
    return BASE if rel == 'index.html' else BASE + rel

def escape_attr(value):
    return html.escape(value, quote=True)

def inject_head(text, rel, title, description, keywords):
    url = canonical(rel)
    rel_name = rel.relative_to(ROOT).as_posix()
    image_candidates = re.findall(r'<img\b[^>]*\bsrc=["\']([^"\']+)["\']', text, flags=re.I)
    image_url = BASE+'img/1.png'
    for candidate in image_candidates:
        candidate = candidate.split('?')[0]
        local_image = (rel.parent/candidate).resolve()
        if local_image.exists() and local_image.suffix.lower() in ('.png','.jpg','.jpeg','.webp'):
            image_url = BASE + local_image.relative_to(ROOT).as_posix()
            break
    # Normalize existing metadata and add a complete page-specific set.
    text = re.sub(r'<title\b[^>]*>.*?</title>', '<title>'+html.escape(title)+'</title>', text, flags=re.I|re.S)
    metas = {
      'description': description,
      'keywords': keywords,
      'robots': 'index, follow, max-image-preview:large',
      'og:type': 'website', 'og:site_name': 'MOS Solar', 'og:title': title,
      'og:description': description, 'og:url': url,
      'og:image': image_url, 'og:image:alt': 'Solar energy systems for homes and businesses',
      'og:locale': 'en_IN', 'twitter:card': 'summary_large_image',
      'twitter:title': title, 'twitter:description': description, 'twitter:image': image_url
    }
    for key, value in metas.items():
        if key.startswith('og:'):
            tag = 'property'
        elif key == 'twitter:card' or key.startswith('twitter:'):
            tag = 'name'
        else:
            tag = 'name'
        pattern = rf'<meta\s+{tag}=["\']{re.escape(key)}["\'][^>]*>'
        replacement = f'<meta {tag}="{key}" content="{escape_attr(value)}">'
        if re.search(pattern, text, flags=re.I):
            text = re.sub(pattern, lambda _: replacement, text, count=1, flags=re.I)
        else:
            text = re.sub(r'</head>', '    '+replacement+'\n</head>', text, count=1, flags=re.I)
    can = f'<link rel="canonical" href="{escape_attr(url)}">'
    if re.search(r'<link\s+rel=["\']canonical["\']', text, flags=re.I):
        text = re.sub(r'<link\s+rel=["\']canonical["\'][^>]*>', lambda _: can, text, count=1, flags=re.I)
    else:
        text = re.sub(r'</head>', '    '+can+'\n</head>', text, count=1, flags=re.I)
    # Maintain utf-8 and mobile viewport metadata.
    if not re.search(r'<meta\s+charset=["\']utf-8["\']', text, flags=re.I):
        text = re.sub(r'<head[^>]*>', lambda m: m.group(0)+'\n<meta charset="utf-8">', text, count=1, flags=re.I)
    if not re.search(r'<meta\s+name=["\']viewport["\']', text, flags=re.I):
        text = re.sub(r'</head>', '<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>', text, count=1, flags=re.I)
    return text

def schema(rel, title, description):
    url = canonical(rel)
    rel_name = rel.relative_to(ROOT).as_posix()
    graph = [
      {'@type':'Organization','@id':BASE+'#organization','name':'MOS Solar','alternateName':'MOS Systems & Controls','url':BASE,'logo':BASE+'img/logo.png','email':'info@mossolar.in','telephone':'+91 96560 03990','sameAs':['https://www.instagram.com/mossolar/']},
      {'@type':'LocalBusiness','@id':BASE+'#localbusiness','name':'MOS Solar','url':BASE,'image':BASE+'img/1.png','telephone':'+91 96560 03990','email':'info@mossolar.in','address':{'@type':'PostalAddress','streetAddress':'B 1305, JLN Stadium, Kaloor','addressLocality':'Ernakulam','addressRegion':'Kerala','postalCode':'682017','addressCountry':'IN'},'areaServed':{'@type':'AdministrativeArea','name':'Kerala'}},
      {'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':'MOS Solar','publisher':{'@id':BASE+'#organization'},'inLanguage':'en-IN'},
      {'@type':'WebPage','@id':url+'#webpage','url':url,'name':title,'description':description,'isPartOf':{'@id':BASE+'#website'},'about':{'@id':BASE+'#organization'},'inLanguage':'en-IN'}
    ]
    if rel_name.startswith('solutions/') or rel_name == 'service.html':
        graph.append({'@type':'Service','@id':url+'#service','name':title.split('|')[0].strip(),'description':description,'provider':{'@id':BASE+'#organization'},'areaServed':{'@type':'AdministrativeArea','name':'Kerala'}})
    if rel_name != 'index.html':
        segments = rel_name.split('/')
        parents = [('Home',BASE)]
        if segments[0] == 'solutions' and len(segments) > 1:
            parents.append(('Solar solutions',BASE+'solutions.html'))
        elif segments[0] == 'projects' and len(segments) > 1:
            parents.append(('Projects',BASE+'projects.html'))
        elif segments[0] == 'blog' and len(segments) > 1:
            parents.append(('Solar guides',BASE+'blog.html'))
        parents.append((title.split('|')[0].strip(),url))
        graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':i,'name':name,'item':href} for i,(name,href) in enumerate(parents,1)]})
    return '<script type="application/ld+json">\n'+json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,indent=2)+'\n</script>'

for rel, (title, description, keywords) in PAGES.items():
    path = ROOT / rel
    if not path.exists():
        print('MISSING', rel)
        continue
    text = path.read_text(encoding='utf-8-sig')
    text = inject_head(text, path, title, description, keywords)
    if rel == 'index.html':
        # The rotating slides are secondary headings; keep the displayed showcase as the sole H1.
        if len(re.findall(r'<h1\b', text, flags=re.I)) > 1:
            seen = [0]
            def slide_heading(match):
                seen[0] += 1
                return '<h2>'+match.group(1)+'</h2>' if seen[0] <= 4 else match.group(0)
            text = re.sub(r'<h1>(.*?)</h1>', slide_heading, text, count=4, flags=re.S)
        text = text.replace('Power today,<br><em>protect tomorrow.</em>', 'Solar panel installation<br><em>company in Kerala.</em>')
        text = text.replace('<h2>Solar panel installation<br><em>company in Kerala.</em></h2>', '<h1>Solar panel installation<br><em>company in Kerala.</em></h1>')
        text = text.replace('Discover solar designed for your home or business, with a local team to guide you from planning through installation.', 'MOS Solar supports residential solar installation, commercial solar and industrial EPC projects across Kerala. Compare on-grid, off-grid and hybrid systems, solar panels, inverters and rooftop service support. Our team works from Kaloor, Ernakulam and helps customers explore suitable next steps for their property.')
    block = schema(path, title, description)
    text = re.sub(r'<script\s+type=["\']application/ld\+json["\'][^>]*>.*?</script>', '', text, flags=re.I|re.S)
    text = re.sub(r'</head>', block+'\n</head>', text, count=1, flags=re.I)
    # Preserve eagerly loaded hero assets; lazy-load images after the hero header.
    def lazy(match):
        tag = match.group(0)
        if 'loading=' in tag.lower(): return tag
        if not re.search(r'\balt\s*=', tag, re.I): tag = tag[:-1].rstrip('/')+' alt="">'
        core = tag[:-1].rstrip()
        if core.endswith('/'): core = core[:-1].rstrip()
        # Explicit intrinsic dimensions reduce layout shifts as images load.
        src_match = re.search(r'\bsrc=["\']([^"\']+)["\']',core,re.I)
        if src_match and not re.search(r'\bwidth\s*=',core,re.I):
            src = src_match.group(1).split('?')[0]
            image_path = (path.parent/src).resolve()
            if image_path.exists() and image_path.suffix.lower() in ('.jpg','.jpeg','.png','.webp','.gif'):
                try:
                    from PIL import Image
                    with Image.open(image_path) as im: width,height=im.size
                    core += f' width="{width}" height="{height}"'
                except Exception:
                    pass
        return core+' loading="lazy">'
    header_end = text.lower().find('</header>')
    if header_end >= 0:
        start = header_end + len('</header>')
        text = text[:start] + re.sub(r'<img\b[^>]*>', lazy, text[start:], flags=re.I)
    path.write_text(text, encoding='utf-8')

robots = 'User-agent: *\nAllow: /\nSitemap: '+BASE+'sitemap.xml\n'
(ROOT/'robots.txt').write_text(robots,encoding='utf-8')
urls = [canonical(ROOT/rel) for rel in PAGES]
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>'+html.escape(u)+'</loc></url>\n' for u in urls) + '</urlset>\n'
(ROOT/'sitemap.xml').write_text(sitemap,encoding='utf-8')
print('Updated',len(PAGES),'pages; generated robots.txt and sitemap.xml')
