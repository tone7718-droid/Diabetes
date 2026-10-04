import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chapters } from '../content/book.mjs';
import { sources } from '../content/sources.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()&&!['.git','node_modules','test-output'].includes(x.name)?walk(path.join(dir,x.name)):x.isFile()?[path.join(dir,x.name)]:[]);
test('all content fields have Korean, English and Vietnamese',()=>{
  const visit=v=>{if(!v||typeof v!=='object')return;if(Object.hasOwn(v,'ko'))for(const lang of ['ko','en','vi'])assert.ok(typeof v[lang]==='string'&&v[lang].trim(),lang);else for(const x of Object.values(v))visit(x)};visit(chapters);
  assert.equal(chapters.length,9);assert.equal(new Set(chapters.map(x=>x.id)).size,9);
});
test('translation reviews match source hashes',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/review-manifest.json')));
  for(const c of manifest.chapters)assert.equal(c.sourceHash,c.translationHash,'Review translations after changing '+c.id);
});
test('chapter sections and images use existing source IDs',()=>{
  for(const c of chapters){assert.ok(fs.existsSync(path.join(root,'assets/illustrations',c.image+'.jpg')));assert.equal(new Set(c.sections.map(s=>s.id)).size,c.sections.length);for(const s of c.sections){assert.ok(s.refs.length);for(const id of s.refs)assert.ok(sources[id],id)}}
});
const checkLinks=(dir,files)=>{
  for(const file of files){const html=fs.readFileSync(file,'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate IDs in '+file);
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){const target=match[1];if(/^https?:|^mailto:/.test(target))continue;const [name,hash]=target.split('#');const dest=name?path.resolve(path.dirname(file),name.split('?')[0]):file;assert.ok(fs.existsSync(dest),file+' -> '+target);if(hash&&dest.endsWith('.html'))assert.ok(fs.readFileSync(dest,'utf8').includes('id="'+hash+'"'),file+' -> '+target)}
  }
};
test('all generated local resources and anchor targets exist',()=>{
  const files=walk(root).filter(p=>p.endsWith('.html')&&!p.startsWith(path.join(root,'dist')));assert.equal(files.length,92);checkLinks(root,files);
});
test('the deployed dist folder is self-contained and leaves out build-only files',()=>{
  const dist=path.join(root,'dist'),files=walk(dist);
  checkLinks(dist,files.filter(p=>p.endsWith('.html')));
  for(const file of files.filter(p=>/\.m?js$/.test(p)))for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:from|import)\s*'(\.[^']+)'/g))assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[1])),file+' imports '+m[1]);
  for(const hidden of ['scripts','tests','docs','.github','package.json','README.md','vercel.json','content/ui.mjs','content/research.mjs','content/translation-review.json','assets/review-manifest.json'])assert.ok(!fs.existsSync(path.join(dist,hidden)),hidden);
  for(const lang of ['ko','en','vi'])assert.ok(fs.existsSync(path.join(dist,'downloads','diabetes-'+lang+'.epub')));
});
test('old chapterN addresses forward to the renamed topic pages',()=>{
  for(const dir of ['','ko','en','vi'])for(const c of chapters){const html=fs.readFileSync(path.join(root,dir,c.oldFile),'utf8');assert.ok(html.includes('url='+c.file+'"'),dir+'/'+c.oldFile);assert.ok(html.includes('noindex'))}
  assert.equal(new Set(chapters.map(c=>c.file)).size,9);assert.ok(chapters.every(c=>!/^chapter\d/.test(c.file)));
});
test('images have their own descriptions instead of repeating the caption',()=>{
  for(const c of chapters)for(const lang of ['ko','en','vi'])assert.notEqual(c.alt[lang],c.caption[lang]);
  const html=fs.readFileSync(path.join(root,'ko',chapters[0].file),'utf8');assert.ok(html.includes('alt="'+chapters[0].alt.ko));
});
test('language pages declare the correct language and do not hide article text',()=>{
  for(const lang of ['ko','en','vi'])for(const c of chapters){const html=fs.readFileSync(path.join(root,lang,c.file),'utf8');assert.ok(html.includes('<html lang="'+lang+'">'));assert.ok(html.includes('alt="'));assert.ok(html.includes('aria-current="page"'));}
  assert.ok(!fs.readFileSync(path.join(root,'css/style.css'),'utf8').includes('opacity:0'));
});
test('EPUB archives have first uncompressed mimetype and valid end records',()=>{
  for(const lang of ['ko','en','vi']){const data=fs.readFileSync(path.join(root,'downloads','diabetes-'+lang+'.epub'));assert.equal(data.readUInt32LE(0),0x04034b50);assert.equal(data.readUInt16LE(8),0);const n=data.readUInt16LE(26);assert.equal(data.subarray(30,30+n).toString(),'mimetype');assert.equal(data.subarray(30+n,30+n+20).toString(),'application/epub+zip');assert.equal(data.readUInt32LE(data.length-22),0x06054b50);}
});
