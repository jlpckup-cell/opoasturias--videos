import {readStudy} from './study.js';
export const SCHEMA = 1;
export function blankState(){return {schemaVersion:SCHEMA,watched:[],favorites:[],notes:{},lastTopic:null,study:{},dailyGoal:2};}
export function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function validateBackup(data,topicIds,videoIds){
  if(!data || typeof data!=='object' || Array.isArray(data) || data.schemaVersion!==SCHEMA)throw Error('La copia no tiene un formato compatible.');
  const out=blankState();
  for(const key of ['watched','favorites']){
    if(!Array.isArray(data[key]) || data[key].some(x=>typeof x!=='string'))throw Error('La lista de vídeos no es válida.');
    out[key]=[...new Set(data[key])].filter(x=>videoIds.has(x));
  }
  if(!data.notes || typeof data.notes!=='object' || Array.isArray(data.notes))throw Error('Las notas no son válidas.');
  for(const [id,note] of Object.entries(data.notes)){
    if(typeof note!=='string' || note.length>50000)throw Error('Una nota no es válida o supera los 50.000 caracteres.');
    if(topicIds.has(id))out.notes[id]=note;
  }
  if(data.lastTopic!==null && data.lastTopic!==undefined && typeof data.lastTopic!=='string')throw Error('El último tema no es válido.');
  out.lastTopic=topicIds.has(data.lastTopic)?data.lastTopic:null;
  out.study=readStudy(data.study,topicIds);
  if(data.dailyGoal!==undefined&&(!Number.isInteger(data.dailyGoal)||data.dailyGoal<1||data.dailyGoal>5))throw Error('El objetivo diario no es válido.');
  out.dailyGoal=data.dailyGoal??2;
  return out;
}
export function selectVideos(topic,catalog,filters,state){
  const query=normalize(filters.query.trim());
  const topicMatch=normalize(topic.id+' '+topic.title+' '+topic.officialTitle).includes(query);
  return topic.videos.filter(link=>{
    const v=catalog.videos.find(v=>v.id===link.videoId);
    if(!v)return false;
    if(filters.channel==='paco' && !v.preferred)return false;
    if(filters.channel==='otros' && v.preferred)return false;
    if(filters.status==='pending' && state.watched.includes(v.id))return false;
    if(filters.status==='watched' && !state.watched.includes(v.id))return false;
    if(filters.status==='favorites' && !state.favorites.includes(v.id))return false;
    return !query || topicMatch || normalize(v.title+' '+v.channel+' '+link.scope).includes(query);
  });
}
