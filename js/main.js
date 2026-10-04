import { analyze } from './drug-engine.mjs';
import { ingredients, drugClasses, rules } from '../content/drugs.mjs';
import { sources } from '../content/sources.mjs';
const $=s=>document.querySelector(s), lang=document.body.dataset.lang, base=document.body.dataset.base, page=document.body.dataset.file;
const ui=JSON.parse($('#ui-text').textContent), pick=v=>v[lang];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}},remove:k=>{try{localStorage.removeItem(k)}catch{}}};
document.documentElement.classList.add('enhanced');
const menu=$('#book-menu'),mb=$('#menu-btn');
if(menu&&mb){mb.hidden=false;mb.onclick=()=>{mb.setAttribute('aria-expanded',String(menu.classList.toggle('open')))};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus()}})}
const size=$('#font-size'),saved=storage.get('diabetes-font-v2');
if(['17','20','23'].includes(saved))size.value=saved;
const setFont=()=>document.documentElement.style.setProperty('--reading-size',size.value+'px');
setFont();size.onchange=()=>{setFont();storage.set('diabetes-font-v2',size.value)};
let position=null;const pk='diabetes-reading-v2';
try{const v=JSON.parse(storage.get(pk));if(v&&/^chapter[1-9]\.html$/.test(v.file)&&Number.isFinite(v.y)&&v.y>=0)position=v}catch{}
if(position){$('#resume').href=position.file+'?resume=1';$('#resume').hidden=false}
$('#clear-resume').onclick=()=>{storage.remove(pk);position=null;$('#resume').hidden=true};
if(position&&position.file===page&&new URLSearchParams(location.search).has('resume'))window.addEventListener('load',()=>setTimeout(()=>scrollTo({top:position.y,behavior:'instant'}),50));
const save=()=>{if(/^chapter[1-9]\.html$/.test(page))storage.set(pk,JSON.stringify({file:page,y:Math.round(scrollY)}))};
const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%'};
let timer;window.addEventListener('scroll',()=>{progress();clearTimeout(timer);timer=setTimeout(save,400)},{passive:true});window.addEventListener('resize',progress);window.addEventListener('pagehide',save);progress();
document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',()=>{const url=new URL(a.href);url.hash=location.hash;a.href=url.href}));
$('#print-btn').onclick=async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));window.print()};
let searchIndex;
$('#search-form').onsubmit=async e=>{e.preventDefault();const q=$('#search-query').value.trim().toLocaleLowerCase(lang),target=$('#search-results');target.replaceChildren();if(!q)return;try{searchIndex||=await fetch(base+'assets/search-'+lang+'.json').then(r=>{if(!r.ok)throw Error('search');return r.json()});const found=searchIndex.filter(x=>(x.title+' '+x.text).toLocaleLowerCase(lang).includes(q)).slice(0,30);if(!found.length){target.textContent=ui.noSearch;return}const ul=document.createElement('ul');for(const x of found){const li=document.createElement('li'),a=document.createElement('a');a.href=x.file+'#'+x.id;a.textContent=x.chapter+' · '+x.title;li.append(a);ul.append(li)}target.append(ul)}catch{target.textContent=ui.noSearch}};
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
  html+='<h2>'+esc(ui.recognized)+'</h2>';
  if(!r.recognized.length)html+='<p>'+esc(ui.noKnown)+'</p>';
  for(const d of r.recognized){const c=drugClasses[d.class];html+='<article class="drug-card"><h3>'+esc(pick(d.name))+' <span class="muted">'+esc(d.id)+'</span></h3><p class="badge">'+esc(pick(c.name))+'</p><dl>'+['mechanism','benefit','common','serious','lifestyle'].map(k=>'<dt>'+esc(ui[k])+'</dt><dd>'+esc(pick(c[k]))+'</dd>').join('')+'</dl>'+refs([...c.refs,...d.refs])+'</article>'}
  html+='<section><h2>'+esc(ui.ruleHeading)+'</h2>'+(r.ruleIds.length?r.ruleIds.map(id=>{const w=rules[id];return '<aside class="notice"><h3>'+esc(pick(w.title))+'</h3><p>'+esc(pick(w.text))+'</p>'+refs(w.refs)+'</aside>'}).join(''):'<p>'+esc(ui.noRules)+'</p>')+'</section>';
  results.innerHTML=html;results.focus();
 };
}
