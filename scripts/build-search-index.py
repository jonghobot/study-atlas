#!/usr/bin/env python3
"""Build search-index.json for the static Study Atlas site."""
from pathlib import Path
from html.parser import HTMLParser
import json
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'search-index.json'

class Extractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.meta = ''
        self.text = []
        self._in_title = False
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self._in_title = True
        if tag == 'meta' and attrs.get('name') == 'description':
            self.meta = attrs.get('content', '')
        if tag in {'script', 'style', 'nav', 'footer'}:
            self.skip += 1

    def handle_endtag(self, tag):
        if tag == 'title':
            self._in_title = False
        if tag in {'script', 'style', 'nav', 'footer'} and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        data = data.strip()
        if not data:
            return
        if self._in_title:
            self.title += data
        elif not self.skip:
            self.text.append(data)

def section_for(path: Path) -> str:
    s = path.as_posix()
    if 'deepseek-v4/reviews/' in s:
        return 'DeepSeek review'
    if 'deepseek-v4' in s:
        return 'DeepSeek V4'
    if 'pop2piano' in s:
        return 'Pop2Piano'
    return 'Study Atlas'

def main() -> None:
    items = []
    for p in sorted(ROOT.rglob('*.html')):
        if '.git' in p.parts:
            continue
        ex = Extractor()
        ex.feed(p.read_text(encoding='utf-8'))
        rel = p.relative_to(ROOT)
        text = re.sub(r'\s+', ' ', ' '.join(ex.text)).strip()
        title = (ex.title or p.stem).replace(' · Study Atlas', '').strip()
        items.append({
            'title': title,
            'description': ex.meta,
            'url': rel.as_posix(),
            'section': section_for(rel),
            'text': text[:5000],
        })
    OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'wrote {len(items)} pages to {OUT.name}')

if __name__ == '__main__':
    main()
