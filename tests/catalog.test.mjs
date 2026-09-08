import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const c=JSON.parse(await readFile(new URL('data/catalog.json',root),'utf8'));
const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root),'utf8'));
const counts=[8,9,5,5,7],romans=['I','II','III','IV','V'];
const expected=romans.flatMap((r,i)=>Array.from({length:counts[i]},(_,n)=>`${r}.${n+1}`));
assert.deepEqual(c.topics.map(t=>t.id),expected);
const ids=new Set(c.videos.map(v=>v.id));assert.equal(ids.size,c.videos.length);
for(const v of c.videos){assert.match(v.id,/^[\w-]{11}$/);assert.equal(new URL(v.url).hostname,'www.youtube.com');assert.ok(v.title&&v.channel&&v.checkedAt&&v.verification);}
for(const t of c.topics){assert.ok(t.officialTitle&&t.coverageNote);assert.equal(new Set(t.videos.map(l=>l.videoId)).size,t.videos.length);for(const link of t.videos){assert.ok(ids.has(link.videoId));assert.ok(link.scope);for(const ch of link.chapters||[])assert.ok(Number.isInteger(ch.seconds)&&ch.seconds>=0);}}
assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
for(const icon of manifest.icons)await access(new URL(icon.src,root));
console.log(`Catálogo correcto: ${c.topics.length} temas y ${ids.size} vídeos.`);
