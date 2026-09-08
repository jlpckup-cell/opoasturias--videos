import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const c=JSON.parse(await readFile(new URL('data/catalog.json',root),'utf8'));
const b=JSON.parse(await readFile(new URL('data/readings.json',root),'utf8'));
assert.deepEqual(Object.keys(b.topics),c.topics.map(t=>t.id));
let questions=0;
for(const t of c.topics){const r=b.topics[t.id];assert.equal(r.title,t.officialTitle);assert.ok(r.html.length>500);assert.match(r.html,/<h2>/);assert.equal((r.questions.match(/class="reading-question"/g)||[]).length,2);assert.equal((r.questions.match(/<li>/g)||[]).length,8);assert.equal((r.questions.match(/Ver solución razonada/g)||[]).length,2);questions+=2;assert.doesNotMatch(r.html+r.questions,/<script|onerror=|javascript:/i);}
assert.equal(questions,68);assert.match(b.extras,/<table>/);assert.match(b.extras,/Supuesto 5/);
console.log('34 complete topic mappings, 68 questions and shared reading materials passed.');
