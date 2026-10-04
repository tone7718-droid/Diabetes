import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chapters } from '../content/book.mjs';
import { ui } from '../content/ui.mjs';
import { sources, reviewed } from '../content/sources.mjs';
import { drugClasses, ingredients, rules } from '../content/drugs.mjs';
import { research } from '../content/research.mjs';
import { makeEpub } from './epub.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const langs = ['ko','en','vi'];
const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const pick = (value, lang) => value[lang];
const write = (name, value) => { fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); fs.writeFileSync(path.join(root, name), value); };
export function sourceHash(chapter) {
  const ko = JSON.stringify(chapter, (key, value) => value && typeof value === 'object' && Object.hasOwn(value, 'ko') ? value.ko : value);
  return crypto.createHash('sha256').update(ko).digest('hex');
}
const registryPath = path.join(root, 'content/translation-review.json');
const sharedTranslations = { ui, drugClasses, ingredients, rules, research };
if (process.argv.includes('--record-translation-review')) {
  write('content/translation-review.json', JSON.stringify(Object.fromEntries([...chapters.map(c => [c.id, { sourceHash: sourceHash(c), reviewed, status: 'educational-draft' }]), ...Object.entries(sharedTranslations).map(([id,value])=>['shared-'+id,{sourceHash:sourceHash(value),reviewed,status:'educational-draft'}])]), null, 2) + '\n');
}
const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf8')) : {};
function references(ids, lang) {
  return `<details class="evidence"><summary>${esc(pick(ui.evidence, lang))}</summary><ul>${[...new Set(ids)].map(id => {
    const r = sources[id]; if (!r) throw Error('Unknown source: ' + id);
    return `<li><span class="badge">${esc(pick(ui.types[r.type], lang))}</span> <a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a></li>`;
  }).join('')}</ul></details>`;
}
function illustration(c, lang, base) {
  return `<figure><img src="${base}assets/illustrations/${c.image}.jpg" width="1200" height="800" alt="${esc(pick(c.caption, lang))}" loading="lazy" decoding="async"/><figcaption>${esc(pick(c.caption, lang))} <span class="muted">${esc(pick(ui.illustration, lang))}</span></figcaption></figure>`;
}
function classTable(lang) {
  return `<div class="table-wrap" tabindex="0"><table><caption>${esc(pick(ui.class,lang))}</caption><thead><tr><th scope="col">${esc(pick(ui.class,lang))}</th><th scope="col">${esc(pick(ui.mechanism,lang))}</th><th scope="col">${esc(pick(ui.benefit,lang))}</th></tr></thead><tbody>${Object.values(drugClasses).map(c => `<tr><th scope="row">${esc(pick(c.name,lang))}</th><td>${esc(pick(c.mechanism,lang))}</td><td>${esc(pick(c.benefit,lang))}</td></tr>`).join('')}</tbody></table></div>`;
}
function researchCards(c, lang) {
  return research.filter(r => r.chapters.includes(c.id)).map(r => `<details class="research"><summary>${esc(r.title)}</summary><p>${esc(pick(r.finding,lang))}</p><p class="notice">${esc(pick(r.limit,lang))}</p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">DOI · ${esc(r.title)}</a></details>`).join('');
}
function chapterBody(c, lang, base, fullBook = false) {
  const stale = lang !== 'ko' && (registry[c.id]?.sourceHash !== sourceHash(c) || Object.entries(sharedTranslations).some(([id,value])=>registry['shared-'+id]?.sourceHash!==sourceHash(value)));
  return `<article data-chapter="${c.file}" id="${c.id}" class="chapter"><p class="eyebrow">${String(chapters.indexOf(c)+1).padStart(2,'0')} / 09 · ${esc(pick(ui.updated,lang))} ${reviewed}</p><h1>${c.emoji} ${esc(pick(c.title,lang))}</h1><p class="lead">${esc(pick(c.summary,lang))}</p>${stale ? `<p role="status" class="notice">${esc(pick(ui.stale,lang))}</p>` : ''}${illustration(c,lang,base)}
    <nav class="section-toc" aria-label="${esc(pick(ui.menu,lang))}">${c.sections.map(s=>`<a href="#${fullBook?c.id+'-':''}${s.id}">${esc(pick(s.title,lang))}</a>`).join('')}</nav>
    ${c.sections.map(s=>`<section id="${fullBook?c.id+'-':''}${s.id}"><h2>${esc(pick(s.title,lang))}</h2>${s.paragraphs.map(p=>`<p>${esc(pick(p,lang))}</p>`).join('')}${c.id==='medicines' && s.id==='map'?classTable(lang):''}${s.actions.length?`<div class="action"><h3>${esc(pick(ui.action,lang))}</h3><ul>${s.actions.map(a=>`<li>${esc(pick(a,lang))}</li>`).join('')}</ul></div>`:''}${s.caution?`<aside class="notice"><h3>${esc(pick(ui.caution,lang))}</h3><p>${esc(pick(s.caution,lang))}</p></aside>`:''}${references(s.refs,lang)}</section>`).join('')}${researchCards(c,lang)}${c.id==='medicines'&&!fullBook?`<p><a class="button primary" href="medicines.html">${esc(pick(ui.tool,lang))} →</a></p>`:''}</article>`;
}
function shell(lang, file, title, body, {base='../',sidebar=true}={}) {
  const directory = base === '' ? '' : lang + '/';
  const languageLinks = langs.map(l => `<a href="${base}${l}/${file}" hreflang="${l}" lang="${l}" ${l===lang?'aria-current="true"':''}>${{ko:'한국어',en:'English',vi:'Tiếng Việt'}[l]}</a>`).join('');
  const clientText = JSON.stringify(Object.fromEntries(Object.entries(ui).filter(([,v])=>v && Object.hasOwn(v,'ko')).map(([k,v])=>[k,v[lang]]))).replaceAll('<','\\u003c');
  const nav = `<nav id="book-menu" aria-label="${esc(pick(ui.menu,lang))}"><a href="index.html" ${file==='index.html'?'aria-current="page"':''}>${esc(pick(ui.home,lang))}</a>${chapters.map((c,i)=>`<a href="${c.file}" ${c.file===file?'aria-current="page"':''}><span>${i+1}.</span> ${esc(pick(c.title,lang))}</a>`).join('')}<a href="medicines.html">💊 ${esc(pick(ui.tool,lang))}</a><a href="sources.html">${esc(pick(ui.sources,lang))}</a><a href="book.html">${esc(pick(ui.book,lang))}</a><a href="${base}downloads/diabetes-${lang}.epub" download>${esc(pick(ui.epub,lang))}</a></nav>`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="description" content="${esc(pick(ui.hero,lang))}"/><title>${esc(title)} · ${esc(pick(ui.site,lang))}</title><link rel="stylesheet" href="${base}css/style.css"/>${langs.map(l=>`<link rel="alternate" hreflang="${l}" href="${base}${l}/${file}"/>`).join('')}</head><body data-lang="${lang}" data-file="${file}" data-base="${base}" data-directory="${directory}"><a class="skip" href="#main">${esc(pick(ui.skip,lang))}</a><div id="progress" aria-hidden="true"></div><header class="site"><a class="logo" href="index.html">${esc(pick(ui.site,lang))}</a><nav class="languages" aria-label="Language">${languageLinks}</nav><button id="menu-btn" aria-controls="book-menu" aria-expanded="false" hidden>${esc(pick(ui.menu,lang))}</button></header><div class="tools"><label for="font-size">${esc(pick(ui.font,lang))}</label><select id="font-size"><option value="17">17</option><option value="20">20</option><option value="23">23</option></select><button id="print-btn">${esc(pick(ui.print,lang))}</button><a id="resume" hidden>${esc(pick(ui.resume,lang))}</a><button id="clear-resume">${esc(pick(ui.clearResume,lang))}</button></div><div class="reader-grid">${sidebar?`<aside class="sidebar">${nav}</aside>`:''}<main id="main" tabindex="-1">${body}<section class="search no-print"><h2>${esc(pick(ui.search,lang))}</h2><form id="search-form" role="search"><label class="sr-only" for="search-query">${esc(pick(ui.search,lang))}</label><input id="search-query" type="search" maxlength="200" placeholder="${esc(pick(ui.searchPlaceholder,lang))}"/><button>${esc(pick(ui.search,lang))}</button></form><div id="search-results" role="status" aria-live="polite"></div></section></main></div><footer><p>${esc(pick(ui.disclaimer,lang))}</p><p>${esc(pick(ui.emergency,lang))}</p>${lang!=='ko'?`<p>${esc(pick(ui.translation,lang))}</p>`:''}<a href="sources.html">${esc(pick(ui.sources,lang))} · ${reviewed}</a></footer><script id="ui-text" type="application/json">${clientText}</script><script type="module" src="${base}js/main.js"></script></body></html>`;
}
function home(lang,base) {
  const cards = chapters.map((c,i)=>`<a class="toc-card" href="${c.file}"><span class="eyebrow">${String(i+1).padStart(2,'0')}</span><h2>${c.emoji} ${esc(pick(c.title,lang))}</h2><p>${esc(pick(c.summary,lang))}</p></a>`).join('');
  return `<section class="hero"><p class="eyebrow">${esc(pick(ui.intro,lang))}</p><h1>${esc(pick(ui.site,lang))}</h1><p class="lead">${esc(pick(ui.hero,lang))}</p><a class="button primary" href="chapter1.html">${esc(pick(ui.start,lang))} →</a> <a class="button" href="medicines.html">${esc(pick(ui.tool,lang))}</a></section>${illustration(chapters[0],lang,base)}<div class="toc-grid">${cards}</div><section><h2>${esc(pick(ui.faq,lang))}</h2>${ui.faqItems.map(x=>`<details><summary>${esc(pick(x.q,lang))}</summary><p>${esc(pick(x.a,lang))}</p></details>`).join('')}</section>`;
}
function tool(lang,base) {
  return `<h1>💊 ${esc(pick(ui.tool,lang))}</h1><p class="lead">${esc(pick(ui.scope,lang))}</p>${illustration(chapters.find(c=>c.id==='medicines'),lang,base)}<form id="drug-form"><label for="ingredients">${esc(pick(ui.input,lang))}</label><p id="input-help" class="muted">${esc(pick(ui.inputHelp,lang))}</p><textarea id="ingredients" rows="4" maxlength="4000" aria-describedby="input-help" placeholder="${esc(pick(ui.placeholder,lang))}" required></textarea><label class="check"><input type="checkbox" id="renal"/>${esc(pick(ui.renal,lang))}</label><label class="check"><input type="checkbox" id="heart"/>${esc(pick(ui.heart,lang))}</label><div class="button-row"><button class="primary">${esc(pick(ui.analyze,lang))}</button><button type="button" id="sample">${esc(pick(ui.sample,lang))}</button><button type="reset">${esc(pick(ui.reset,lang))}</button></div></form><p class="muted">${esc(pick(ui.privacy,lang))}</p><noscript><p>${esc(pick(ui.disclaimer,lang))} JavaScript: ${esc(pick(ui.tool,lang))}.</p></noscript><div id="drug-results" tabindex="-1" aria-live="polite"></div><details><summary>${esc(pick(ui.catalog,lang))}</summary><ul class="catalog">${ingredients.map(d=>`<li><button type="button" data-ingredient="${esc(pick(d.name,lang))}">${esc(pick(d.name,lang))}</button> <span class="muted">${esc(d.id)}</span></li>`).join('')}</ul></details>`;
}
function sourcesBody(lang,base) {
  return `<h1>${esc(pick(ui.sources,lang))}</h1><p class="lead">${esc(pick(ui.sourceIntro,lang))}</p>${illustration(chapters.find(c=>c.id==='supplements'),lang,base)}<h2>${esc(pick(ui.evidencePolicy,lang))}</h2><p>${esc(pick(ui.evidenceText,lang))}</p><p>${esc(pick(ui.updateText,lang))}</p><p class="muted">${esc(pick(ui.updated,lang))}: ${reviewed}. ${esc(pick(ui.translation,lang))}</p><ol class="references">${Object.entries(sources).map(([id,r])=>`<li id="source-${id}"><span class="badge">${esc(pick(ui.types[r.type],lang))}</span> <a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a>${r.year?` · ${r.year}`:''}</li>`).join('')}</ol><h2>${esc(pick(ui.evidence,lang))}</h2>${research.map(r=>`<details><summary>${esc(r.title)}</summary><p>${esc(pick(r.finding,lang))}</p><p class="notice">${esc(pick(r.limit,lang))}</p><a href="${esc(r.url)}">DOI</a></details>`).join('')}`;
}
for (const lang of langs) {
  for (const base of lang==='ko'?['../','']:['../']) {
    const prefix = base === '' ? '' : lang + '/';
    write(prefix+'index.html', shell(lang,'index.html',pick(ui.home,lang),home(lang,base),{base}));
    for(const [i,c] of chapters.entries()) {
      const pager = `<nav class="pager">${i>0?`<a href="${chapters[i-1].file}">← ${esc(pick(ui.previous,lang))}</a>`:'<span></span>'}${i<chapters.length-1?`<a href="${chapters[i+1].file}">${esc(pick(ui.next,lang))} →</a>`:`<a href="index.html">${esc(pick(ui.home,lang))}</a>`}</nav>`;
      write(prefix+c.file,shell(lang,c.file,pick(c.title,lang),chapterBody(c,lang,base)+pager,{base}));
    }
    write(prefix+'medicines.html',shell(lang,'medicines.html',pick(ui.tool,lang),tool(lang,base),{base}));
    write(prefix+'sources.html',shell(lang,'sources.html',pick(ui.sources,lang),sourcesBody(lang,base),{base}));
    const full = `<h1>${esc(pick(ui.site,lang))}</h1><p>${esc(pick(ui.disclaimer,lang))}</p>${chapters.map(c=>chapterBody(c,lang,base,true)).join('')}<section>${sourcesBody(lang,base)}</section>`;
    write(prefix+'book.html',shell(lang,'book.html',pick(ui.book,lang),full,{base,sidebar:false}));
  }
  const search = chapters.flatMap(c=>c.sections.map(s=>({file:c.file,id:s.id,title:pick(s.title,lang),chapter:pick(c.title,lang),text:[...s.paragraphs,...s.actions,...(s.caution?[s.caution]:[])].map(p=>pick(p,lang)).join(' ')})));
  search.push({file:'medicines.html',id:'drug-form',title:pick(ui.tool,lang),chapter:pick(ui.tool,lang),text:ingredients.map(d=>[pick(d.name,lang),d.id,...d.aliases].join(' ')).join(' ')});
  write(`assets/search-${lang}.json`,JSON.stringify(search));
  makeEpub({root,lang,title:pick(ui.site,lang),chapters,render:c=>chapterBody(c,lang,'',true),sourceBody:sourcesBody(lang,''),reviewed});
}
write('assets/review-manifest.json', JSON.stringify({ reviewed, chapters: [...chapters.map(c=>({id:c.id,sourceHash:sourceHash(c),translationHash:registry[c.id]?.sourceHash||null})),...Object.entries(sharedTranslations).map(([id,value])=>({id:'shared-'+id,sourceHash:sourceHash(value),translationHash:registry['shared-'+id]?.sourceHash||null}))] },null,2)+'\n');
console.log('Built 52 HTML pages, 3 search indexes and 3 EPUB books.');
