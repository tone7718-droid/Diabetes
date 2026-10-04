import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {analyze} from '../js/drug-engine.mjs';
import {ingredients,drugClasses,rules} from '../content/drugs.mjs';
import {sources} from '../content/sources.mjs';
import {ui} from '../content/ui.mjs';
import {search} from '../js/search.mjs';
const root=new URL('../',import.meta.url);
test('human insulin never silently selects regular or NPH',()=>{
 for(const name of ['human insulin','사람 인슐린','휴먼인슐린','insulin human','insulin người']){
  const r=analyze(name);assert.equal(r.recognized[0].id,'human-insulin-unspecified');assert.ok(r.ruleIds.includes('insulinForm'));assert.ok(r.ruleIds.includes('hypoglycemia'));
 }
 for(const name of ['regular human insulin','레귤러 인슐린'])assert.equal(analyze(name).recognized[0].id,'regular-insulin');
 assert.equal(analyze('NPH insulin').recognized[0].id,'nph-insulin');
 assert.equal(ingredients.length,42);
});
test('miglitol has its own glucose warning when combined with hypoglycemia-risk medicines',()=>{
 for(const name of ['glimepiride','insulin glargine','repaglinide'])assert.ok(analyze('miglitol + '+name).ruleIds.includes('miglitol'));
 assert.ok(!analyze('miglitol').ruleIds.includes('miglitol'));
 assert.ok(rules.miglitol.refs.includes('miglitol'));
});
// Execute the actual client handlers with deterministic DOM/storage/event adapters; no browser dependency in CI.
function client(lang='ko',kind='chapter'){
 const values=new Map([['diabetes-reading-v3',JSON.stringify({file:'safety.html',y:700})]]),events={},timers=new Map();let next=0;
 const element=()=>({dataset:{size:'normal',px:'20'},style:{setProperty(){}},classList:{add(){},remove(){}},setAttribute(){},querySelectorAll:()=>[],replaceChildren(){this.innerHTML=''},focus(){},hidden:false,innerHTML:'',value:''});
 const nodes=new Map(),get=s=>{if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)};
 get('#ui-text').textContent=JSON.stringify(Object.fromEntries(Object.entries(ui).filter(([,v])=>v?.ko).map(([k,v])=>[k,v[lang]])));
 get('.font-size').querySelectorAll=()=>[element()];
 const ctx={analyze,ingredients,drugClasses,rules,sources,search,document:{body:{dataset:{lang,base:'../',file:'safety.html',kind}},documentElement:{...element(),scrollHeight:5000},querySelector:get,querySelectorAll:()=>[],getElementById:()=>null,addEventListener(){},images:[]},localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},window:{addEventListener:(k,f)=>events[k]=f},innerHeight:800,scrollY:700,URLSearchParams,location:{search:'',hash:''},setTimeout:f=>{timers.set(++next,f);return next},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(fs.readFileSync(new URL('js/main.js',root),'utf8').replace(/^import .*;\n/gm,''),ctx);
 return{get,values,events,timers,ctx};
}
test('clearing reading history survives pending saves, later scrolls and page exit',()=>{
 const c=client();c.events.scroll();assert.equal(c.timers.size,1);c.get('#clear-resume').onclick();assert.equal(c.timers.size,0);
 c.events.scroll();for(const f of c.timers.values())f();c.events.pagehide();assert.equal(c.values.has('diabetes-reading-v3'),false);
 const next=client();next.events.pagehide();assert.ok(next.values.has('diabetes-reading-v3'));
});
for(const lang of ['ko','en','vi'])test('context ingredients remain visible with limited scope: '+lang,()=>{
 const c=client(lang,'page');c.get('#ingredients').value='metformin + clopidogrel + gemfibrozil';c.get('#drug-form').onsubmit({preventDefault(){}});
 const html=c.get('#drug-results').innerHTML;
 for(const text of [ui.contextHeading[lang],ui.contextNote[lang],lang==='ko'?'클로피도그렐':'Clopidogrel',lang==='ko'?'겜피브로질':'Gemfibrozil'])assert.ok(html.includes(text));
 c.get('#ingredients').value='repaglinide + clopidogrel';c.get('#drug-form').onsubmit({preventDefault(){}});assert.ok(c.get('#drug-results').innerHTML.includes(rules.repClop.title[lang]));
});
for(const lang of ['ko','en','vi'])test('class cautions and studies are searchable with valid visible targets: '+lang,()=>{
 const index=JSON.parse(fs.readFileSync(new URL('assets/search-'+lang+'.json',root)));
 for(const query of ['PPAR','LEADER',rules.miglitol.title[lang],drugClasses.dpp4.serious[lang]]){
  const found=search(index,query,lang);assert.ok(found.length,query);
  for(const hit of found)assert.ok(fs.readFileSync(new URL(lang+'/'+hit.file,root),'utf8').includes('id="'+hit.id+'"'));
 }
});

test('reference links open collapsed details, including enclosing details',()=>{
 const c=client();const outer={parentElement:null,open:false};const inner={parentElement:{closest:()=>outer},open:false};let scrolled=false;
 c.ctx.document.getElementById=id=>id==='class-dpp4'?{closest:()=>inner,scrollIntoView(){scrolled=true}}:null;
 c.ctx.location.hash='#class-dpp4';c.events.hashchange();assert.ok(inner.open&&outer.open&&scrolled);
 c.ctx.location.hash='#%zz';assert.doesNotThrow(()=>c.events.hashchange());
});
