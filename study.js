export const stages={pending:'Sin empezar',studying:'En estudio',review:'Para repasar',ready:'Preparado según mi valoración'};
export const steps={law:'He leído la normativa o material oficial',outline:'He preparado mi esquema',recall:'Puedo explicarlo sin mirar',practice:'He practicado preguntas o supuestos'};
export function day(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function validDay(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !Number.isNaN(+d)&&day(d)===s;}
export function afterDays(n,today=day()){const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+n);return day(d);}
export function emptyStudy(){return {stage:'pending',checks:[],reviewAt:'',interval:0,errors:'',attempts:[]};}
export function readStudy(raw,ids){
  if(raw===undefined)return {};
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('El seguimiento de temas no es válido.');
  const result={};
  for(const [id,v] of Object.entries(raw)){
    if(!ids.has(id))continue;
    if(!v||!Object.hasOwn(stages,v.stage)||!Array.isArray(v.checks)||v.checks.some(s=>!Object.hasOwn(steps,s))||typeof v.errors!=='string'||v.errors.length>10000||!(v.reviewAt===''||validDay(v.reviewAt))||!Number.isInteger(v.interval)||v.interval<0||v.interval>5||!Array.isArray(v.attempts)||v.attempts.length>20)throw Error('El seguimiento de un tema no es válido.');
    for(const a of v.attempts)if(!a||!validDay(a.date)||!Number.isInteger(a.total)||a.total<1||a.total>1000||!Number.isInteger(a.correct)||a.correct<0||a.correct>a.total)throw Error('Un resultado de práctica no es válido.');
    result[id]={stage:v.stage,checks:[...new Set(v.checks)],reviewAt:v.reviewAt,interval:v.interval,errors:v.errors,attempts:v.attempts.map(a=>({date:a.date,total:a.total,correct:a.correct}))};
  }return result;
}
export function review(s,rating,today=day()){
  const out={...s};
  if(rating==='again'){out.interval=0;out.reviewAt=afterDays(1,today);out.stage='review';}
  else {out.interval=Math.min(5,s.interval+1);out.reviewAt=afterDays([1,3,7,14,30][out.interval-1],today);if(out.stage==='pending')out.stage='studying';}
  return out;
}
export function plan(topics,study,limit=2,today=day()){
  const queue=topics.map((t,i)=>{const s=study[t.id]||emptyStudy(),last=s.attempts.at(-1);let priority=5,reason='Primera vuelta';
    if(s.reviewAt&&s.reviewAt<=today){priority=0;reason='Repaso pendiente: '+s.reviewAt;}
    else if(last&&last.correct/last.total<0.7){priority=1;reason='Refuerza tu última práctica';}
    else if(s.stage==='review'&&!s.reviewAt){priority=2;reason='Marcado para repasar';}
    else if(s.stage==='studying'){priority=3;reason='Continúa el estudio';}
    else if(s.stage==='ready'||s.reviewAt>today){priority=6;reason='Próximo repaso: '+(s.reviewAt||'sin fecha');}
    return {topic:t,priority,reason,index:i};
  }).filter(x=>x.priority<6).sort((a,b)=>a.priority-b.priority||a.index-b.index);
  return queue.slice(0,limit);
}
