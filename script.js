function showAnswer(id){const e=document.getElementById(id); if(e) e.style.display='block'}

(function initSiteSearch(){
  const currentScript = document.currentScript;
  const siteRoot = currentScript ? new URL('.', currentScript.src) : new URL('./', location.href);
  const indexUrl = new URL('search-index.json', siteRoot);
  let searchIndexPromise;

  function normalize(text){
    return (text || '').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function escapeHtml(text){
    return (text || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function loadIndex(){
    if(!searchIndexPromise){
      searchIndexPromise = fetch(indexUrl, {cache:'no-cache'})
        .then(r => r.ok ? r.json() : Promise.reject(new Error('search index load failed')))
        .then(items => items.map(item => ({...item, haystack: normalize([item.title,item.description,item.text,item.tags].join(' '))})))
        .catch(() => []);
    }
    return searchIndexPromise;
  }

  function scoreItem(item, terms){
    let score = 0;
    const title = normalize(item.title);
    const desc = normalize(item.description);
    for(const term of terms){
      if(!item.haystack.includes(term)) return 0;
      if(title.includes(term)) score += 8;
      if(desc.includes(term)) score += 4;
      score += Math.min(5, item.haystack.split(term).length - 1);
    }
    return score;
  }

  function makeSnippet(item, terms){
    const text = (item.text || item.description || '').replace(/\s+/g,' ').trim();
    const lower = text.toLowerCase();
    let pos = -1;
    for(const term of terms){ pos = lower.indexOf(term); if(pos >= 0) break; }
    if(pos < 0) pos = 0;
    const start = Math.max(0, pos - 70);
    const end = Math.min(text.length, pos + 170);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function renderResults(container, items, query){
    const terms = normalize(query).split(' ').filter(Boolean);
    if(!terms.length){
      container.innerHTML = '<p class="search-empty">검색어를 입력하면 모든 페이지에서 제목과 본문을 찾아줍니다.</p>';
      return;
    }
    const results = items
      .map(item => ({item, score: scoreItem(item, terms)}))
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 12);

    if(!results.length){
      container.innerHTML = '<p class="search-empty">검색 결과가 없습니다. 다른 키워드로 시도해보세요.</p>';
      return;
    }

    container.innerHTML = results.map(({item}) => {
      const href = new URL(item.url, siteRoot).href;
      return `<a class="search-result" href="${href}"><span class="tag">${escapeHtml(item.section || 'page')}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(makeSnippet(item, terms))}</small></a>`;
    }).join('');
  }

  function installSearch(){
    const nav = document.querySelector('.nav');
    if(!nav || nav.querySelector('.site-search')) return;

    const search = document.createElement('div');
    search.className = 'site-search';
    search.innerHTML = `
      <input class="site-search-input" type="search" placeholder="전체 검색" aria-label="전체 페이지 검색">
      <div class="search-popover" role="listbox"><p class="search-empty">검색어를 입력하면 모든 페이지에서 제목과 본문을 찾아줍니다.</p></div>
    `;
    nav.appendChild(search);

    const input = search.querySelector('.site-search-input');
    const popover = search.querySelector('.search-popover');
    let timer;

    function open(){ search.classList.add('open'); }
    function close(){ setTimeout(() => search.classList.remove('open'), 160); }
    function run(){
      clearTimeout(timer);
      timer = setTimeout(async () => {
        open();
        const items = await loadIndex();
        renderResults(popover, items, input.value);
      }, 80);
    }

    input.addEventListener('focus', () => { open(); run(); });
    input.addEventListener('input', run);
    input.addEventListener('blur', close);
    input.addEventListener('keydown', e => {
      if(e.key === 'Escape'){ input.blur(); search.classList.remove('open'); }
      if(e.key === 'Enter'){
        const first = popover.querySelector('.search-result');
        if(first) location.href = first.href;
      }
    });
    document.addEventListener('keydown', e => {
      if(e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)){
        e.preventDefault(); input.focus();
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installSearch);
  else installSearch();
})();
