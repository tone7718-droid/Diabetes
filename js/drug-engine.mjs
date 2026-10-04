import { ingredients, contextIngredients } from '../content/drugs.mjs';
export function normalize(value) {
  return String(value).normalize('NFKC').toLowerCase().trim()
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|iu|units?|u)(?:\s*\/\s*ml)?\b/gi, '')
    .replace(/\d+(?:\.\d+)?\s*(?:밀리그램|마이크로그램|단위)/g, '')
    .replace(/\b(?:xr|er|sr|mr|extended[ -]release|tablet(?:s)?|injection)\b/gi, '')
    .replace(/서방정|서방형|일반정|정제|주사제|주사액/g, '')
    .replace(/[()\[\] ._-]/g, '');
}
const index = new Map();
for (const item of [...ingredients, ...contextIngredients]) {
  for (const alias of item.aliases) {
    const key = normalize(alias);
    if (index.has(key) && index.get(key).id !== item.id) throw new Error('Ambiguous alias: ' + alias);
    index.set(key, item);
  }
}
function distance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    previous = row;
  }
  return previous[b.length];
}
export function suggest(token) {
  const key = normalize(token);
  if (key.length < 3 || key.length > 60) return [];
  return ingredients.map(item => ({ item, score: Math.min(...item.aliases.map(a => distance(key, normalize(a)))) }))
    .filter(x => x.score <= (key.length > 8 ? 2 : 1)).sort((a, b) => a.score - b.score).slice(0, 3).map(x => x.item.id);
}
export function analyze(input, context = {}) {
  if (typeof input !== 'string' || input.length > 4000) throw new RangeError('Input must be text up to 4000 characters');
  // Normalize dose concentrations first so their slash does not split a name.
  const text = input.normalize('NFKC').replace(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|iu|u))\s*\/\s*ml/gi, '$1');
  const tokens = text.split(/[\n,;+\/|、，；]+/).map(x => x.trim()).filter(Boolean);
  const recognized = [], unknown = [], duplicates = [], contexts = [];
  const seen = new Set();
  for (const token of tokens) {
    const match = index.get(normalize(token));
    if (!match) { unknown.push({ input: token, suggestions: suggest(token) }); continue; }
    if (seen.has(match.id)) duplicates.push(match.id);
    else { seen.add(match.id); (match.class ? recognized : contexts).push(match); }
  }
  const classes = new Set(recognized.map(x => x.class));
  const has = name => classes.has(name);
  const ruleIds = [];
  if (unknown.length) ruleIds.push('incomplete');
  if (duplicates.length) ruleIds.push('duplicate');
  if (has('insulin') || has('su') || has('glinide')) ruleIds.push('hypoglycemia');
  if (has('dpp4') && (has('glp1') || has('dual'))) ruleIds.push('dppIncretin');
  if (seen.has('acarbose') && (has('insulin') || has('su') || has('glinide'))) ruleIds.push('acarbose');
  if (has('insulin') && has('tzd')) ruleIds.push('insulinTzd');
  if (recognized.some(x => x.id === 'repaglinide') && seen.has('gemfibrozil')) ruleIds.push('repGem');
  if (recognized.some(x => x.id === 'repaglinide') && seen.has('clopidogrel')) ruleIds.push('repClop');
  if (seen.has('saxagliptin')) ruleIds.push('sax');
  if (seen.has('alogliptin')) ruleIds.push('alogliptin');
  if (seen.has('semaglutide')) ruleIds.push('semaglutide');
  if (context.renal && recognized.length) ruleIds.push('renal');
  if (context.heart && (has('tzd') || has('sglt2'))) ruleIds.push('heart');
  if (has('sglt2')) ruleIds.push('sglt2');
  const counts = new Map();
  for (const x of recognized) counts.set(x.class, (counts.get(x.class) || 0) + 1);
  if ([...counts].some(([cls, count]) => cls !== 'insulin' && count > 1)) ruleIds.push('sameClass');
  if (has('glp1') && has('dual')) ruleIds.push('sameClass');
  return { recognized, contexts, unknown, duplicates: [...new Set(duplicates)], ruleIds: [...new Set(ruleIds)], empty: tokens.length === 0 };
}
