// Accent-insensitive matching: "ha duong huyet" finds "hạ đường huyết".
// Marks are removed after NFD and the text is recomposed with NFC, so Korean syllables stay whole
// ("저" does not match inside "점").
export function fold(value, lang) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')
    .replace(/[đĐ]/g, 'd').toLocaleLowerCase(lang).replace(/\s+/g, ' ').trim();
}
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Every word of the query must appear in the entry. In English and Vietnamese a word must match from the
// start of a word ("ha" finds "hạ" but not "khác"); Korean attaches particles, so any position counts.
// Entries whose heading contains the whole query come first, then entries whose text contains it.
export function search(entries, query, lang, limit = 30) {
  const phrase = fold(query, lang), terms = phrase.split(' ').filter(Boolean);
  if (!terms.length) return [];
  const start = lang === 'ko' ? '' : '(?:^|[^\\p{L}\\p{N}])';
  const patterns = terms.map(term => new RegExp(start + escape(term), 'u'));
  const scored = [];
  for (const entry of entries) {
    const text = fold(entry.chapter + ' ' + entry.title + ' ' + entry.text, lang);
    if (!patterns.every(pattern => pattern.test(text))) continue;
    const heading = fold(entry.chapter + ' ' + entry.title, lang);
    scored.push({ entry, score: heading.includes(phrase) ? 2 : text.includes(phrase) ? 1 : 0 });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map(x => x.entry);
}
