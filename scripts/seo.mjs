// Absolute canonical and hreflang links need the public address of the site. It is read at build time from
// SITE_URL, or from VERCEL_PROJECT_PRODUCTION_URL, which Vercel provides during its builds. Without either,
// these links are omitted, because search engines ignore relative hreflang and canonical URLs are best absolute.
export const langs = ['ko', 'en', 'vi'];
export function siteUrl(env = process.env) {
  const raw = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + env.VERCEL_PROJECT_PRODUCTION_URL : '');
  if (!raw) return '';
  const url = new URL(/^https?:\/\//.test(raw) ? raw : 'https://' + raw);
  return url.origin + url.pathname.replace(/\/+$/, '');
}
const pageUrl = (site, lang, file) => `${site}/${lang}/${file === 'index.html' ? '' : file}`;
// The Korean pages also exist at the site root; those copies point to /ko/ as the canonical address.
export function headLinks(site, lang, file) {
  if (!site) return '';
  const esc = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `<link rel="canonical" href="${esc(pageUrl(site, lang, file))}"/>`
    + langs.map(l => `<link rel="alternate" hreflang="${l}" href="${esc(pageUrl(site, l, file))}"/>`).join('')
    + `<link rel="alternate" hreflang="x-default" href="${esc(pageUrl(site, 'ko', file))}"/>`;
}
