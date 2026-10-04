import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Serves the repository by default; `node scripts/serve.mjs dist` serves exactly what is deployed.
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)),process.argv[2]||'.');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.epub':'application/epub+zip'};
http.createServer((req,res)=>{
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  const resolved=path.resolve(root,'.'+name);if(resolved!==root&&!resolved.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const target=resolved.endsWith(path.sep)||fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory()?path.join(resolved,'index.html'):resolved;
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end('Not found');return;}
  res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');fs.createReadStream(target).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Serving http://127.0.0.1:4173'));
