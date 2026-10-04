import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { siteUrl, headLinks } from '../scripts/seo.mjs';
test('site address comes from SITE_URL or the Vercel production domain',()=>{
  assert.equal(siteUrl({}),'');
  assert.equal(siteUrl({VERCEL_PROJECT_PRODUCTION_URL:'diabetes.example.app'}),'https://diabetes.example.app');
  assert.equal(siteUrl({SITE_URL:'https://example.org/book/',VERCEL_PROJECT_PRODUCTION_URL:'x.vercel.app'}),'https://example.org/book');
});
test('canonical and hreflang links are absolute, and root Korean copies point to /ko/',()=>{
  assert.equal(headLinks('','ko','index.html'),'');
  const links=headLinks('https://example.org','ko','feet.html');
  assert.ok(links.includes('<link rel="canonical" href="https://example.org/ko/feet.html"/>'));
  for(const l of ['ko','en','vi'])assert.ok(links.includes(`hreflang="${l}" href="https://example.org/${l}/feet.html"`));
  assert.ok(links.includes('hreflang="x-default" href="https://example.org/ko/feet.html"'));
  assert.ok(headLinks('https://example.org','vi','index.html').includes('href="https://example.org/vi/"'));
});
test('pages built without a site address carry no relative hreflang links',()=>{
  const html=fs.readFileSync(new URL('../ko/index.html',import.meta.url),'utf8');
  assert.ok(!/hreflang="[a-z-]+" href="(?!https?:)/.test(html));
});
