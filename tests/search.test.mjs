import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fold, search } from '../js/search.mjs';
const index = lang => JSON.parse(fs.readFileSync(new URL('../assets/search-' + lang + '.json', import.meta.url)));
test('Vietnamese search ignores tone marks and đ',()=>{
  assert.equal(fold('Hạ đường huyết','vi'),'ha duong huyet');
  const plain=search(index('vi'),'ha duong huyet','vi'),marked=search(index('vi'),'hạ đường huyết','vi');
  assert.ok(plain.length>0);assert.deepEqual(plain.map(x=>x.file+'#'+x.id),marked.map(x=>x.file+'#'+x.id));
  assert.ok(search(index('vi'),'ban chan','vi').some(x=>x.file==='chapter9.html'));
});
test('word-start matching and heading-first ordering',()=>{
  assert.ok(!search([{chapter:'',title:'',text:'khác'}],'ha','vi').length);
  assert.ok(search([{chapter:'',title:'',text:'hạ'}],'ha','vi').length);
  const r=search(index('vi'),'ha duong huyet','vi');assert.ok(fold(r[0].chapter+' '+r[0].title,'vi').includes('ha duong huyet'),r[0].title);
});
test('Korean syllables are not split by accent folding',()=>{
  assert.equal(fold('저혈당','ko'),'저혈당');
  assert.ok(!fold('점심','ko').includes('저'));
  assert.ok(search(index('ko'),'저혈당','ko').length>0);
});
test('all query words must match, in any order',()=>{
  assert.ok(search(index('en'),'feet daily','en').length>0);
  assert.equal(search(index('en'),'feet zzzzunlikely','en').length,0);
  assert.equal(search(index('en'),'   ','en').length,0);
});
test('key points are searchable in every language',()=>{
  for(const lang of ['ko','en','vi'])assert.equal(index(lang).filter(x=>x.id==='key-points').length,9);
});
