import { analyze } from './drug-engine.mjs';
import { ingredients, drugClasses, rules } from '../content/drugs.mjs';
import { sources } from '../content/sources.mjs';
import { search } from './search.mjs';
const $=s=>document.querySelector(s), lang=document.body.dataset.lang, base=document.body.dataset.base, page=document.body.dataset.file;
const ui=JSON.parse($('#ui-text').textContent), pick=v=>v[lang];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}},remove:k=>{try{localStorage.removeItem(k)}catch{}}};
document.documentElement.classList.add('enhanced');
const menu=$('#book-menu'),mb=$('#menu-btn');
// On phones the contents open as a full-screen panel from the bottom bar; on wide screens the sidebar is always shown.
const closeMenu=()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded','false')};
if(menu&&mb){mb.onclick=e=>{if(!matchMedia('(max-width:900px)').matches)return;e.preventDefault();const open=menu.classList.toggle('open');mb.setAttribute('aria-expanded',String(open));if(open)(menu.querySelector('[aria-current="page"]')||menu.querySelector('a')).focus()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();mb.focus()}})}
const fontGroup=$('.font-size'),fontButtons=[...fontGroup.querySelectorAll('[data-size]')];
const setFont=id=>{const b=fontButtons.find(x=>x.dataset.size===id)||fontButtons[0];document.documentElement.style.setProperty('--reading-size',b.dataset.px+'px');document.documentElement.dataset.fontSize=b.dataset.size;fontButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))};
setFont(storage.get('diabetes-font-v3'));fontGroup.hidden=false;
fontButtons.forEach(b=>b.onclick=()=>{setFont(b.dataset.size);storage.set('diabetes-font-v3',b.dataset.size)});
let position=null;const pk='diabetes-reading-v3',isChapter=document.body.dataset.kind==='chapter',validFile=/^[a-z][a-z-]*\.html$/;
try{const v=JSON.parse(storage.get(pk));if(v&&validFile.test(v.file)&&Number.isFinite(v.y)&&v.y>=0)position=v}catch{}
if(position){$('#resume').href=position.file+'?resume=1';$('#resume').hidden=false}
let historyCleared=false;
$('#clear-resume').onclick=()=>{historyCleared=true;clearTimeout(timer);storage.remove(pk);position=null;$('#resume').hidden=true};
if(position&&position.file===page&&new URLSearchParams(location.search).has('resume'))window.addEventListener('load',()=>setTimeout(()=>scrollTo({top:position.y,behavior:'instant'}),50));
const save=()=>{if(isChapter&&!historyCleared)storage.set(pk,JSON.stringify({file:page,y:Math.round(scrollY)}))};
const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%'};
let timer;window.addEventListener('scroll',()=>{progress();clearTimeout(timer);timer=setTimeout(save,400)},{passive:true});window.addEventListener('resize',progress);window.addEventListener('pagehide',save);progress();
document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',()=>{const url=new URL(a.href);url.hash=location.hash;a.href=url.href}));
$('#print-btn').onclick=async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));window.print()};
let searchIndex;
$('#search-form').onsubmit=async e=>{e.preventDefault();const q=$('#search-query').value.trim(),target=$('#search-results');target.replaceChildren();if(!q)return;try{searchIndex||=await fetch(base+'assets/search-'+lang+'.json').then(r=>{if(!r.ok)throw Error('search');return r.json()});const found=search(searchIndex,q,lang);if(!found.length){target.textContent=ui.noSearch;return}const ul=document.createElement('ul');for(const x of found){const li=document.createElement('li'),a=document.createElement('a');a.href=x.file+'#'+x.id;a.textContent=x.chapter+' · '+x.title;li.append(a);ul.append(li)}target.append(ul)}catch{target.textContent=ui.noSearch}};
const refs=ids=>'<details><summary>'+esc(ui.evidence)+'</summary><ul>'+[...new Set(ids)].map(id=>'<li><a href="'+esc(sources[id].url)+'" target="_blank" rel="noopener noreferrer">'+esc(sources[id].title)+'</a></li>').join('')+'</ul></details>';
const form=$('#drug-form');
if(form){
 const input=$('#ingredients'),results=$('#drug-results');
 $('#sample').onclick=()=>{input.value=ui.placeholder;input.focus()};
 document.querySelectorAll('[data-ingredient]').forEach(b=>b.onclick=()=>{input.value=(input.value.trim()?input.value.trim()+' + ':'')+b.dataset.ingredient;input.focus()});
 form.onreset=()=>results.replaceChildren();
 form.onsubmit=e=>{
  e.preventDefault();let r;try{r=analyze(input.value,{renal:$('#renal').checked,heart:$('#heart').checked})}catch{results.textContent=ui.tooLong;results.focus();return}
  if(r.empty){results.textContent=ui.nothing;return}
  let html='';
  if(r.unknown.length)html+='<section class="notice"><h2>'+esc(ui.unknown)+'</h2><ul>'+r.unknown.map(x=>'<li><strong>'+esc(x.input)+'</strong>'+(x.suggestions.length?'<p>'+esc(ui.suggestion)+': '+x.suggestions.map(id=>esc(pick(ingredients.find(d=>d.id===id).name))).join(', ')+'</p>':'')+'</li>').join('')+'</ul></section>';
  if(r.contexts.length)html+='<section class="notice"><h2>'+esc(ui.contextHeading)+'</h2><p>'+esc(ui.contextNote)+'</p><ul>'+r.contexts.map(d=>'<li>'+esc(pick(d.name))+'</li>').join('')+'</ul></section>';
  html+='<h2>'+esc(ui.recognized)+'</h2>';
  if(!r.recognized.length)html+='<p>'+esc(ui.noKnown)+'</p>';
  for(const d of r.recognized){const c=drugClasses[d.class];html+='<article class="drug-card"><h3>'+esc(pick(d.name))+' <span class="muted">'+esc(d.id)+'</span></h3><p class="badge">'+esc(pick(c.name))+'</p><dl>'+['mechanism','benefit','common','serious','lifestyle'].map(k=>'<dt>'+esc(ui[k])+'</dt><dd>'+esc(pick(c[k]))+'</dd>').join('')+'</dl>'+refs([...c.refs,...d.refs])+'</article>'}
  html+='<section><h2>'+esc(ui.ruleHeading)+'</h2>'+(r.ruleIds.length?r.ruleIds.map(id=>{const w=rules[id];return '<aside class="notice"><h3>'+esc(pick(w.title))+'</h3><p>'+esc(pick(w.text))+'</p>'+refs(w.refs)+'</aside>'}).join(''):'<p>'+esc(ui.noRules)+'</p>')+'</section>';
  results.innerHTML=html;results.focus();
 };
}

// Open searchable reference sections when navigating to a deep link.
function revealReference() {
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const target=document.getElementById(id);if(!target)return;
 let detail=target.closest('details');while(detail){detail.open=true;detail=detail.parentElement?.closest('details')}
 if(target.closest('details'))target.scrollIntoView();
}
window.addEventListener('hashchange',revealReference);revealReference();
