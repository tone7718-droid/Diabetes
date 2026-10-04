import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, normalize } from '../js/drug-engine.mjs';
import { ingredients, drugClasses, rules } from '../content/drugs.mjs';
import { sources } from '../content/sources.mjs';
test('all supported names and aliases identify the intended ingredient',()=>{
  assert.equal(ingredients.length,42);
  for(const d of ingredients)for(const alias of d.aliases)assert.equal(analyze(alias).recognized[0]?.id,d.id,alias);
});
test('Korean salt, doses, release form and combination separators',()=>{
  const r=analyze('메트포르민염산염 500mg 서방정 / 시타글립틴 50mg');
  assert.deepEqual(r.recognized.map(x=>x.id),['metformin','sitagliptin']);assert.equal(r.unknown.length,0);
});
test('units per ml and English salt are parsed without guessing a dose',()=>{
  assert.equal(analyze('insulin glargine 100U/ml').recognized[0].id,'insulin-glargine');
  assert.equal(analyze('Metformin hydrochloride (500 mg) XR').recognized[0].id,'metformin');
});
test('duplicate alias does not generate duplicate medicine cards',()=>{
  const r=analyze('metformin + 메트포르민');assert.equal(r.recognized.length,1);assert.ok(r.ruleIds.includes('duplicate'));
});
test('uncertain and incomplete input never gives a safety clearance',()=>{
  const r=analyze('metformin + imaginarydrug');assert.equal(r.unknown.length,1);assert.ok(r.ruleIds.includes('incomplete'));
  assert.equal(analyze('자누메트').recognized.length,0);assert.equal(analyze('insulin').recognized.length,0);
});
test('typo suggestion is never automatically selected',()=>{
  const r=analyze('metformim');assert.equal(r.recognized.length,0);assert.ok(r.unknown[0].suggestions.includes('metformin'));
});
test('incretin combination and dual incretin are flagged',()=>{
  assert.ok(analyze('sitagliptin + semaglutide').ruleIds.includes('dppIncretin'));
  assert.ok(analyze('semaglutide + tirzepatide').ruleIds.includes('sameClass'));
});
test('acarbose plus secretagogue has glucose-specific warning',()=>{
  assert.ok(analyze('acarbose + glimepiride').ruleIds.includes('acarbose'));
  assert.ok(!analyze('metformin').ruleIds.includes('acarbose'));
});
test('meal-related secretagogues and insulin are classified for low glucose',()=>{
  for(const name of ['repaglinide','gliclazide','insulin degludec'])assert.ok(analyze(name).ruleIds.includes('hypoglycemia'));
});
test('repaglinide interactions cannot be hidden by a recognized context medicine',()=>{
  assert.ok(analyze('repaglinide + gemfibrozil').ruleIds.includes('repGem'));
  assert.ok(analyze('レパグリニド + clopidogrel').ruleIds.includes('incomplete'));
  assert.ok(analyze('repaglinide + clopidogrel').ruleIds.includes('repClop'));
});
test('renal and heart context and ingredient-specific warnings',()=>{
  const r=analyze('pioglitazone + insulin lispro',{renal:true,heart:true});
  for(const id of ['renal','heart','insulinTzd'])assert.ok(r.ruleIds.includes(id));
  assert.ok(analyze('saxagliptin').ruleIds.includes('sax'));
  assert.ok(analyze('alogliptin').ruleIds.includes('alogliptin'));
  assert.ok(analyze('semaglutide').ruleIds.includes('semaglutide'));
});
test('planned basal plus mealtime insulin is not a duplicate-class flag',()=>{
  assert.ok(!analyze('insulin glargine + insulin aspart').ruleIds.includes('sameClass'));
});
test('empty and oversized inputs are handled',()=>{
  assert.ok(analyze('   ').empty);assert.throws(()=>analyze('a'.repeat(4001)),RangeError);assert.throws(()=>analyze(null),RangeError);
});
test('every caution and class cites existing sources and has all translations',()=>{
  for(const x of [...Object.values(drugClasses),...Object.values(rules)]){
    for(const id of x.refs)assert.ok(sources[id],id);
    for(const [key,value]of Object.entries(x))if(value?.ko)for(const lang of ['ko','en','vi'])assert.ok(value[lang]?.trim(),key+':'+lang);
  }
});
