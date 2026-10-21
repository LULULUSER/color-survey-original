import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'site');
const prefix=process.argv[3]==='/'?'':(process.argv[3]||'/color-survey-original');
const server=http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname===prefix){res.writeHead(302,{Location:prefix+'/'});res.end();return;}
  if(!pathname.startsWith(prefix+'/')){res.writeHead(404);res.end();return;}
  if(req.method!=='GET'){res.writeHead(405);res.end();return;}
  const target=path.resolve(root,'.'+pathname.slice(prefix.length)+(pathname.endsWith('/')?'index.html':''));
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{const body=await readFile(target);res.writeHead(200,{'Content-Type':target.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});res.end(body);}
  catch{res.writeHead(404);res.end();}
});
server.listen(0,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+server.address().port+prefix+'/'));
