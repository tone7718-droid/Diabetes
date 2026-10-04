import { ingredients, contextIngredients } from '../content/drugs.mjs';
export function normalize(value) {
  return String(value).normalize('NFKC').toLowerCase().trim()
    .replace(/\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|iu|units?|u)(?:\s*\/\s*ml)?\b/gi, '')
    .replace(/\d+(?:\.\d+)?\s*(?:밀리그램|마이크로그램|단위)/g, '')
    .replace(/\b(?:xr|er|sr|mr|extended[ -]release|tablet(?:s)?|injection)\b/gi, '')
    .replace(/서방정|서방형|일반정|정제|주사제|주사액/g, '')
    // Strength is never used for identification, so bare numbers are dropped too (no alias contains a digit).
    .replace(/\d+(?:\.\d+)?/g, '')
    .replace(/[()\[\] ._,-]/g, '');
}
// Dosage-form and salt suffixes printed on Korean and international labels. They are only stripped
// when what remains is an exact supported name, so an unknown word is never guessed.
const suffix = /(?:필름코팅정|장용정|정|캡슐|프리필드펜|펜주|주|tabs?|capsules?|caps?|pen|브롬화수소산염|염산염|벤조산염|황산염|타르타르산염|인산염|프로판디올|세스퀴수화물|일수화물|반수화물|수화물|칼슘|엘프롤린|l프롤린|hydrochloride|hcl|hydrobromide|benzoate|sulfate|tartrate|phosphate|propanediol|sesquihydrate|monohydrate|hemihydrate|hydrate|calcium|lproline)$/;
const index = new Map();
for (const item of [...ingredients, ...contextIngredients]) {
  for (const alias of item.aliases) {
    const key = normalize(alias);
    if (index.has(key) && index.get(key).id !== item.id) throw new Error('Ambiguous alias: ' + alias);
    index.set(key, item);
  }
}
function lookup(token) {
  let key = normalize(token);
  for (let i = 0; i < 6 && key; i++) {
    if (index.has(key)) return index.get(key);
    const shorter = key.replace(suffix, '');
    if (shorter === key) break;
    key = shorter;
  }
  return null;
}
// Space-separated names ("metformin sitagliptin") are accepted only when every word group is an exact
// supported name; otherwise the whole token stays unknown.
function lookupWords(token) {
  const words = token.split(/\s+/).filter(word => normalize(word));
  if (words.length < 2) return null;
  const found = [];
  for (let i = 0; i < words.length;) {
    let j = words.length;
    while (j > i && !lookup(words.slice(i, j).join(' '))) j--;
    if (j === i) return null;
    found.push(lookup(words.slice(i, j).join(' ')));
    i = j;
  }
  return found;
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
  // Normalize thousands separators and concentrations first so their comma or slash does not split a name.
  const text = input.normalize('NFKC')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
    .replace(/(\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|iu|units?|u|단위|밀리그램|마이크로그램))\s*\/\s*(?:\d+(?:\.\d+)?\s*)?ml\b/gi, '$1');
  const tokens = text.split(/[\n,;+\/|、，；]+/).map(x => x.trim()).filter(Boolean);
  const recognized = [], unknown = [], duplicates = [], contexts = [];
  const seen = new Set();
  for (const token of tokens) {
    // A token that is only a strength or form ("500mg", "50", "XR") identifies nothing and is not an unknown medicine.
    if (!normalize(token)) continue;
    const single = lookup(token);
    const matches = single ? [single] : lookupWords(token);
    if (!matches) { unknown.push({ input: token, suggestions: suggest(token) }); continue; }
    for (const match of matches) {
      if (seen.has(match.id)) duplicates.push(match.id);
      else { seen.add(match.id); (match.class ? recognized : contexts).push(match); }
    }
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
