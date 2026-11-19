// Traducción ES → EN sobre el DOM: busca cada texto en src/i18n/en.json.
import EN from '../i18n/en.json';

(() => {
  const D = EN, orig = new WeakMap(), attrOrig = new WeakMap();
  const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
  let lang = localStorage.getItem('sc-lang') === 'en' ? 'en' : 'es';
  const SEP = /(\s+·\s+|\s+—\s+|\s+→\s+|\s+\/\s+)/;
  function tr(s) {
    const t = s.replace(/\s+/g, ' ').trim();
    if (!t) return null;
    if (D[t] != null) return D[t];
    if (/^—\s?/.test(t)) { const r = tr(t.replace(/^—\s?/, '')); if (r != null) return '— ' + r; }
    if (/^["“].*["”]$/.test(t)) { const r = tr(t.slice(1, -1)); if (r != null) return t[0] + r + t[t.length - 1]; }
    const parts = t.split(SEP);
    if (parts.length > 1) {
      let hit = false;
      const out = parts.map((p, i) => { if (i % 2) return p; const r = D[p]; if (r != null) { hit = true; return r; } return p; });
      if (hit) return out.join('');
    }
    return null;
  }
  function apply(node) {
    if (node.nodeType === 3) {
      const p = node.parentNode; if (!p || /^(SCRIPT|STYLE)$/.test(p.nodeName)) return;
      if (lang === 'en') {
        const src = orig.has(node) ? orig.get(node) : node.nodeValue;
        const r = tr(src); if (r == null) return;
        if (!orig.has(node)) orig.set(node, src);
        const lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0];
        const v = lead + r + trail; if (node.nodeValue !== v) node.nodeValue = v;
      } else if (orig.has(node)) { if (node.nodeValue !== orig.get(node)) node.nodeValue = orig.get(node); }
      return;
    }
    if (node.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(node.nodeName)) return;
    for (const a of ATTRS) {
      if (!node.hasAttribute(a)) continue;
      let m = attrOrig.get(node); if (!m) attrOrig.set(node, m = {});
      if (lang === 'en') { const src = m[a] ?? node.getAttribute(a); const r = tr(src); if (r != null) { m[a] = src; node.setAttribute(a, r); } }
      else if (m[a] != null) node.setAttribute(a, m[a]);
    }
    for (const c of node.childNodes) apply(c);
  }
  let busy = false;
  function run(root) { busy = true; apply(root); busy = false; }
  function setLang(l) {
    lang = l; localStorage.setItem('sc-lang', l);
    document.documentElement.lang = l;
    run(document.body);
    const t = document.title; document.title = l === 'en' ? (tr(t) || t) : (document.documentElement.dataset.titleEs || t);
    document.querySelectorAll('.lang').forEach(b => { b.dataset.active = l; b.setAttribute('aria-label', l === 'en' ? 'Ver en español' : 'View in English'); });
  }
  document.documentElement.dataset.titleEs = document.title;
  new MutationObserver(ms => { if (busy || lang !== 'en') return; busy = true; for (const m of ms) m.addedNodes.forEach(apply); busy = false; })
    .observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', e => { const b = e.target.closest('.lang'); if (!b) return; e.preventDefault(); setLang(lang === 'en' ? 'es' : 'en'); });
  window.setLang = setLang;
  if (lang === 'en') setLang('en'); else document.querySelectorAll('.lang').forEach(b => b.dataset.active = 'es');
})();
