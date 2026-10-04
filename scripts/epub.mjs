import fs from 'node:fs';
import path from 'node:path';
const xml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function crc32(data) {
  let crc = 0xffffffff;
  for(const byte of data) { crc ^= byte; for(let j=0;j<8;j++) crc = (crc>>>1) ^ (crc&1 ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff)>>>0;
}
// Store-only ZIP: EPUB mimetype MUST be first and uncompressed.
export function zip(entries) {
  const parts=[],central=[]; let offset=0;
  for(const [name,value] of entries) {
    const n=Buffer.from(name),data=Buffer.isBuffer(value)?value:Buffer.from(value),crc=crc32(data);
    const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x0800,6);h.writeUInt16LE(0x21,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(n.length,26);
    parts.push(h,n,data);
    const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x0800,8);c.writeUInt16LE(0x21,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=h.length+n.length+data.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...parts,directory,end]);
}
export function makeEpub({root,lang,title,sourcesTitle,chapters,render,sourceBody,reviewed}) {
  const wrap = (body,name) => `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}"><head><title>${xml(name)}</title><link rel="stylesheet" href="style.css"/></head><body>${body.replaceAll('&nbsp;','&#160;')}</body></html>`;
  const entries=[['mimetype','application/epub+zip'],['META-INF/container.xml','<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>']];
  const images = [...new Set(chapters.map(c=>c.image))];
  const manifest=chapters.map(c=>`<item id="${c.id}" href="${c.id}.xhtml" media-type="application/xhtml+xml"/>`).join('') + images.map(n=>`<item id="image-${n}" href="assets/illustrations/${n}.jpg" media-type="image/jpeg"/>`).join('');
  const opf=`<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">urn:diabetes:${lang}:${reviewed}</dc:identifier><dc:title>${xml(title)}</dc:title><dc:language>${lang}</dc:language><meta property="dcterms:modified">${reviewed}T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/><item id="css" href="style.css" media-type="text/css"/><item id="sources" href="sources.xhtml" media-type="application/xhtml+xml"/>${manifest}</manifest><spine>${chapters.map(c=>`<itemref idref="${c.id}"/>`).join('')}<itemref idref="sources"/></spine></package>`;
  entries.push(['OEBPS/package.opf',opf]);
  const nav=`<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}"><head><title>${xml(title)}</title></head><body><nav epub:type="toc"><h1>${xml(title)}</h1><ol>${chapters.map(c=>`<li><a href="${c.id}.xhtml">${xml(c.title[lang])}</a></li>`).join('')}<li><a href="sources.xhtml">${xml(sourcesTitle)}</a></li></ol></nav></body></html>`;
  entries.push(['OEBPS/nav.xhtml',nav],['OEBPS/style.css','body{font-family:sans-serif;line-height:1.7;margin:5%;}img{max-width:100%;height:auto;}figure{margin:1em 0;}figcaption{font-size:.85em;}table{border-collapse:collapse;}td,th{border:1px solid #bbb;padding:.5em;}h1,h2{color:#146c60;}details{display:block;}summary{font-weight:bold;}a{color:#146c60;}']);
  for(const c of chapters) entries.push([`OEBPS/${c.id}.xhtml`,wrap(render(c),c.title[lang])]);
  entries.push(['OEBPS/sources.xhtml',wrap(sourceBody,sourcesTitle)]);
  for(const n of images) entries.push([`OEBPS/assets/illustrations/${n}.jpg`,fs.readFileSync(path.join(root,'assets/illustrations',n+'.jpg'))]);
  fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
  fs.writeFileSync(path.join(root,'downloads',`diabetes-${lang}.epub`),zip(entries));
}
