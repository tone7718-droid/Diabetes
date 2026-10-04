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
test('thousands separators are not treated as ingredient separators',()=>{
  for(const input of ['메트포르민 1,000mg','metformin 1,000 mg','Metformin 1,000mg, sitagliptin 50mg']){
    const r=analyze(input);assert.equal(r.recognized[0]?.id,'metformin',input);assert.equal(r.unknown.length,0,input);
  }
  assert.deepEqual(analyze('metformin 500mg, sitagliptin 50mg').recognized.map(x=>x.id),['metformin','sitagliptin']);
});
test('Korean tablet suffixes, salt forms and attached strengths are recognized',()=>{
  const expected={'메트포르민정':'metformin','글리메피리드정 2mg':'glimepiride','glimepiride 2mg tab':'glimepiride','metformin500mg':'metformin',
    '피오글리타존염산염':'pioglitazone','알로글립틴벤조산염':'alogliptin','로베글리타존황산염':'lobeglitazone','미티글리니드칼슘수화물':'mitiglinide',
    '제미글립틴타르타르산염세스퀴수화물':'gemigliptin','에보글립틴타르타르산염정':'evogliptin','테네리글립틴브롬화수소산염수화물':'teneligliptin',
    '이프라글리플로진L-프롤린':'ipragliflozin','saxagliptin hydrochloride':'saxagliptin','alogliptin benzoate':'alogliptin'};
  for(const [input,id] of Object.entries(expected)){const r=analyze(input);assert.equal(r.recognized[0]?.id,id,input);assert.equal(r.unknown.length,0,input)}
});
test('suffix stripping never turns an unknown word into a medicine',()=>{
  for(const input of ['칼슘','염산염','정','tab','metforminx정','자누메트정'])assert.equal(analyze(input).recognized.length,0,input);
  assert.equal(analyze('칼슘').unknown.length,1);
});
test('space-separated ingredients are split only when every word group is a known name',()=>{
  assert.deepEqual(analyze('메트포르민 시타글립틴').recognized.map(x=>x.id),['metformin','sitagliptin']);
  assert.deepEqual(analyze('insulin glargine insulin aspart').recognized.map(x=>x.id),['insulin-glargine','insulin-aspart']);
  const r=analyze('metformin imaginarydrug');assert.equal(r.recognized.length,0);assert.equal(r.unknown[0].input,'metformin imaginarydrug');
});
test('concentrations and strength-only fragments do not raise an unknown-ingredient warning',()=>{
  for(const [input,id] of [['insulin glargine 300 units/mL','insulin-glargine'],['인슐린 글라진 100단위/mL','insulin-glargine'],['Semaglutide 0.25mg/0.5mL','semaglutide'],['시타글립틴/메트포르민 50/500mg','sitagliptin']]){
    const r=analyze(input);assert.equal(r.recognized[0]?.id,id,input);assert.equal(r.unknown.length,0,input);assert.ok(!r.ruleIds.includes('incomplete'),input);
  }
});
test('no alias contains a digit, because strengths are removed before matching',()=>{
  for(const d of ingredients)for(const alias of d.aliases)assert.ok(!/\d/.test(alias),alias);
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
