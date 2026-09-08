import {emptyStudy,review,day,stages} from './study.js';
import {dashboard,topicStudy} from './study-ui.js';
import {isAndroid,braveIntent} from './android.js';
import {blankState,validateBackup,selectVideos} from './state.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const onAndroid=isAndroid(navigator.userAgent);
const key='opoasturias:v1:'+new URL('./',location.href).pathname;
let catalog,state=blankState(),filters={query:'',channel:'all',status:'all'},installPrompt,pendingRestore;
let byVideo,topicIds,videoIds;
let usingBrave=false;
try{usingBrave=await navigator.brave?.isBrave()||false;}catch{}
if(usingBrave)$('#install').textContent=onAndroid?'Añadir al inicio':'Instalar en Brave';
const appAddress=new URL('./',location.href).href;
const braveHelp=appAddress+'#ayuda-brave';
if(onAndroid&&location.protocol==='https:'){$('#open-brave').hidden=false;$('#open-brave').href=braveIntent(appAddress,braveHelp);}
$('#copy-url').onclick=async()=>{try{await navigator.clipboard.writeText(appAddress);$('#copy-status').textContent='Dirección copiada. Pégala en Brave.';}catch{$('#copy-status').textContent='Copia esta dirección: '+appAddress;}};
function tell(text){$('#notice').textContent=text;$('#notice').hidden=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{tell('No se han podido guardar los cambios en este navegador. Exporta tus datos desde el botón de ajustes.');return false;}}
function route(){const hash=location.hash.slice(1);return hash.startsWith('tema/')?hash.slice(5):hash==='biblioteca'?'biblioteca':'inicio';}
function stats(){return {total:catalog.videos.length,seen:state.watched.length,linked:catalog.topics.filter(t=>t.videos.length).length};}
function shell(){
  $('#syllabus').innerHTML=catalog.blocks.map(b=>`<details class="block-nav" ${route().startsWith(b.id+'.')?'open':''}><summary><span class="block-number">${b.id}</span><span>${esc(b.title)}</span><span class="chevron">⌄</span></summary><div>${catalog.topics.filter(t=>t.blockId===b.id).map(t=>`<a href="#tema/${t.id}" ${route()===t.id?'aria-current="page"':''}><span>${t.id}</span><span class="nav-topic-title">${esc(t.officialTitle)}</span><i class="${t.videos.length?'has-video':'no-video'}" title="${t.videos.length?'Con vídeos':'Sin vídeo localizado'}"></i></a>`).join('')}</div></details>`).join('');
  document.querySelectorAll('[data-nav]').forEach(el=>{if(el.dataset.nav===route())el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  $('#catalog-info').textContent=`34 temas del ANEXO II · Catálogo revisado el ${catalog.checkedAt.split('-').reverse().join('/')} · ${catalog.videos.length} vídeos. Base: convocatoria BOPA 2026-06678.`;
}
function home(){
  const s=stats(),last=catalog.topics.find(t=>t.id===state.lastTopic);
  $('#crumb').textContent='Escritorio';
  $('#main').innerHTML=`<section class="hero"><div class="eyebrow"><span></span> ADMINISTRATIVO C1 · ASTURIAS</div><h1>Tu plaza empieza<br>con el <em>siguiente tema.</em></h1><p>Las explicaciones que necesitas, en el orden de tu convocatoria.<br class="desktop"> Estudia a tu ritmo. Guarda lo importante. Sigue avanzando.</p><div class="hero-actions"><a class="button primary" href="#tema/${last?last.id:'I.1'}">${last?'Continuar por '+last.id:'Empezar por el tema I.1'} <span aria-hidden="true">↗</span></a><a class="text-link" href="#biblioteca">Explorar los vídeos →</a></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="art-card"><span>MI PRÓXIMO PASO</span><b>${last?last.id:'I.1'}</b><div class="play-symbol">▶</div><small>Un vídeo más cerca</small></div><span class="art-stamp">A TU RITMO ✦</span></div></section>
  <section class="stats" aria-label="Resumen de estudio"><div><strong>${s.total}</strong><span>vídeos seleccionados</span></div><div><strong>${s.seen}<small> / ${s.total}</small></strong><span>vídeos marcados como vistos</span></div><div><strong>${s.linked}<small> / 34</small></strong><span>temas con algún vídeo</span></div><div><strong>${state.favorites.length}</strong><span>favoritos para repasar</span></div></section>
  ${dashboard(catalog,state)}<section class="blocks-section"><div class="section-heading"><div><div class="eyebrow">TU HOJA DE RUTA</div><h2>Cinco bloques. Un objetivo.</h2></div><span class="subtle">El orden exacto del programa oficial</span></div><div class="block-grid">${catalog.blocks.map((b,i)=>{const ts=catalog.topics.filter(t=>t.blockId===b.id),ids=[...new Set(ts.flatMap(t=>t.videos.map(v=>v.videoId)))],seen=ids.filter(id=>state.watched.includes(id)).length;return `<a class="block-card block-${b.id}" href="#tema/${ts[0].id}"><div class="card-top"><span class="block-number">${b.id}</span><span>${ts.length} TEMAS</span><span class="arrow">↗</span></div><h3>${esc(b.title)}</h3><p>${esc(b.description)}</p><div class="card-bottom"><span>${ids.length} vídeos</span><span>${seen} vistos</span></div><div class="progress-track"><div style="width:${ids.length?seen/ids.length*100:0}%"></div></div></a>`;}).join('')}<div class="study-card"><span class="eyebrow">MEJOR POCO, CADA DÍA</span><h3>Entender.<br>Recordar.<br>Repetir.</h3><p>Tus notas y favoritos se quedan contigo. Exporta una copia para seguir en otro dispositivo.</p><button class="text-link" data-settings>Guardar mi progreso ↗</button></div></div></section>
  <section class="official-index"><div class="section-heading"><div><div class="eyebrow">ANEXO II · TURNO LIBRE</div><h2>Tu temario oficial, tema a tema</h2></div></div>${catalog.blocks.map(b=>`<section class="index-block"><h3>Bloque ${b.id} · ${esc(b.title)}</h3><ol>${catalog.topics.filter(t=>t.blockId===b.id).map(t=>`<li><a href="#tema/${t.id}"><strong>Tema ${t.id} · ${esc(stages[(state.study[t.id]||emptyStudy()).stage])}</strong><span>${esc(t.officialTitle)}</span><small class="${t.videos.length?'':'missing-label'}">${t.videos.length?t.videos.length+' vídeos · cobertura parcial':'No hay ningún vídeo disponible en este catálogo'}</small></a></li>`).join('')}</ol></section>`).join('')}</section><div class="coverage-note"><span aria-hidden="true">ⓘ</span><p><strong>Un mapa honesto de tu temario.</strong> Tener vídeos no significa que un tema esté cubierto por completo. Encontrarás el alcance y los apartados pendientes dentro de cada tema.</p></div>`;
}
function toolbar(){return `<section class="filters" aria-label="Buscar y filtrar"><label class="search-box"><span aria-hidden="true">⌕</span><span class="sr-only">Buscar por tema, ley o vídeo</span><input id="query" type="search" placeholder="Buscar por tema, ley o vídeo…" value="${esc(filters.query)}"></label><label><span class="sr-only">Canal</span><select id="channel"><option value="all">Todos los canales</option><option value="paco" ${filters.channel==='paco'?'selected':''}>Paco Barbié</option><option value="otros" ${filters.channel==='otros'?'selected':''}>Otros canales</option></select></label><label><span class="sr-only">Estado del vídeo</span><select id="status"><option value="all">Todos los vídeos</option><option value="pending" ${filters.status==='pending'?'selected':''}>Pendientes de ver</option><option value="watched" ${filters.status==='watched'?'selected':''}>Vistos</option><option value="favorites" ${filters.status==='favorites'?'selected':''}>Favoritos</option></select></label><button id="clear" class="text-link">Limpiar</button></section>`;}
function videoCard(link,index){
  const v=byVideo.get(link.videoId),seen=state.watched.includes(v.id),fav=state.favorites.includes(v.id);
  return `<article class="video-card ${seen?'watched':''}"><div class="video-order">${String(index+1).padStart(2,'0')}</div><div class="video-main"><div class="video-meta"><span class="channel-tag ${v.preferred?'preferred':''}">${esc(v.channel)}</span>${v.duration?`<span>${esc(v.duration)}</span>`:''}<span>${link.kind==='supplement'?'Apoyo complementario':link.kind==='audio'?'Lectura de la norma':'Explicación'}</span></div><h3><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">${esc(v.title)}</a></h3><p class="scope">${esc(link.scope)}</p>${v.warning?`<p class="video-warning">${esc(v.warning)}</p>`:''}<details class="verification"><summary>Fuente y comprobación</summary><p>${esc(v.verification)} Fecha de comprobación: ${esc(v.checkedAt)}.${v.publishedAt?' Publicado: '+esc(v.publishedAt)+'.':''}</p><a href="${esc(v.sourceUrl)}" target="_blank" rel="noopener noreferrer">Consultar fuente</a></details><div class="video-actions"><a class="button watch-link" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> Ver en YouTube ↗</a><button class="toggle ${seen?'active':''}" data-watch="${v.id}" aria-pressed="${seen}" aria-label="${seen?'Marcar como pendiente':'Marcar como visto'}: ${esc(v.title)}">${seen?'✓ Visto':'○ Marcar visto'}</button><button class="toggle favorite ${fav?'active':''}" data-favorite="${v.id}" aria-pressed="${fav}" aria-label="${fav?'Quitar de':'Añadir a'} favoritos: ${esc(v.title)}">${fav?'★':'☆'} <span>Favorito</span></button></div></div></article>`;
}
function renderResults(){
  const current=route(),topics=current==='biblioteca'?catalog.topics:catalog.topics.filter(t=>t.id===current);
  let count=0;
  const result=topics.map(t=>{const links=selectVideos(t,catalog,filters,state);count+=links.length;if(!links.length&&current!=='biblioteca')return '';return `${current==='biblioteca'?`<div class="result-topic"><div class="eyebrow">BLOQUE ${t.blockId} · TEMA ${t.id}</div><h2><a href="#tema/${t.id}">${esc(t.officialTitle)}</a></h2><span>${t.videos.length} vídeos disponibles · ${links.length} con estos filtros</span></div>`:''}${links.length?links.map(l=>videoCard(l,t.videos.indexOf(l))).join(''):`<div class="empty topic-empty"><h3>${t.videos.length?'No hay vídeos con estos filtros':'No hay ningún vídeo disponible en este catálogo para este tema'}</h3><p>${t.videos.length?'Prueba otros filtros para ver los recursos de este tema.':'No se ha localizado un vídeo público adecuado en la búsqueda realizada. El tema sigue formando parte de la oposición.'}</p><a class="text-link" href="#tema/${t.id}">Abrir tema ${t.id} y mis notas →</a></div>`}`;}).join('');
  $('#results').innerHTML=result||`<div class="empty"><span aria-hidden="true">▤</span><h3>${topics.length===1&&!topics[0].videos.length?'No hay ningún vídeo disponible en este catálogo para este tema':'No hay vídeos con estos filtros'}</h3><p>${topics.length===1&&!topics[0].videos.length?'El tema permanece en su lugar del programa. Consulta el alcance pendiente y utiliza las notas para organizar tu estudio.':'Prueba otra búsqueda o pulsa «Limpiar».'}</p></div>`;
  $('#result-count').textContent=`${count} ${count===1?'enlace':'enlaces'}${current==='biblioteca'?' en el orden del temario':''}`;
  document.querySelectorAll('.video-card').forEach(card=>{
    const id=card.querySelector('[data-watch]').dataset.watch;
    const link=topics.flatMap(t=>selectVideos(t,catalog,filters,state)).filter(l=>l.videoId===id);
    // A repeated video can target a different chapter in each topic.
    const occurrences=[...document.querySelectorAll(`[data-watch="${id}"]`)];
    const occurrence=occurrences.indexOf(card.querySelector('[data-watch]'));
    const chapters=link[occurrence]?.chapters;if(!chapters?.length)return;
    const links=document.createElement('div');links.className='chapter-links';
    const label=document.createElement('span');label.textContent='Ir al apartado:';links.append(label);
    for(const chapter of chapters){const a=document.createElement('a');a.href=byVideo.get(id).url+'&t='+chapter.seconds+'s';a.target='_blank';a.rel='noopener noreferrer';a.textContent=chapter.label+' ↗';links.append(a);}
    card.querySelector('.scope').after(links);
  });
  androidLinks();
}
function library(topic){
  $('#crumb').textContent=topic?'Tema '+topic.id:'Todos los vídeos';
  const head=topic?`<div class="eyebrow">BLOQUE ${topic.blockId} · TEMA ${topic.id}</div><h1 class="official-title">${esc(topic.officialTitle)}</h1><div class="topic-coverage"><span class="badge ${topic.videos.length?'partial':'missing'}">${topic.videos.length?'Cobertura parcial':'Sin vídeo localizado'}</span><p>${esc(topic.coverageNote)}</p></div>`:`<div class="eyebrow">TU BIBLIOTECA</div><h1>Los 34 temas del programa oficial</h1><p class="intro">Paco Barbié y otros autores, organizados según el ANEXO II.<br>Elige un tema o encuentra la explicación que necesitas.</p>`;
  $('#main').innerHTML=`<section class="library-heading">${head}</section>${topic?`<nav class="topic-shortcuts"><a class="button" href="#study-title" data-scroll="study-title">Mi preparación ↓</a><a class="button" href="#results" data-scroll="results">Ir a los vídeos ↓</a><a class="button" href="#topic-note" data-scroll="topic-note">Mis notas ↓</a></nav>`:''}${toolbar()}<div class="results-header"><h2>${topic?'Ruta de vídeos del tema':'Explorar vídeos'}</h2><span id="result-count"></span></div><section id="results" aria-label="Vídeos encontrados"></section>${topic?topicStudy(topic,state):''}${topic?`<section class="notes"><div class="section-heading"><h2>Mis notas · ${topic.id}</h2><span id="note-status" role="status">Guardadas en este dispositivo</span></div><label for="topic-note">Lo que quiero recordar de este tema</label><textarea id="topic-note" data-topic="${topic.id}" maxlength="50000" placeholder="Anota dudas, artículos clave o lo que quieres repasar…">${esc(state.notes[topic.id]||'')}</textarea><p>Las notas no se publican en GitHub. Puedes guardarlas en una copia desde los ajustes.</p></section><nav class="topic-pagination" aria-label="Cambiar de tema">${neighbor(topic,-1)}${neighbor(topic,1)}</nav>`:''}`;
  renderResults();
}
function androidLinks(){
  if(!onAndroid)return;
  document.querySelectorAll('.watch-link, .video-card h3 a, .chapter-links a').forEach(a=>{
    const normal=a.href;
    a.href=braveIntent(normal,braveHelp);a.removeAttribute('target');
    if(a.classList.contains('watch-link')){
      a.textContent='▶ Ver en Brave ↗';
      const fallback=document.createElement('a');fallback.href=normal;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.className='normal-video-link';fallback.textContent='Enlace normal';a.parentElement.append(fallback);
    }
  });
}
function neighbor(topic,delta){const t=catalog.topics[catalog.topics.indexOf(topic)+delta];return t?`<a class="button" href="#tema/${t.id}">${delta<0?'← Anterior':'Siguiente →'} · ${t.id}</a>`:'<span></span>';}
function render(){
  const r=route(),topic=catalog.topics.find(t=>t.id===r);shell();
  if(topic){state.lastTopic=topic.id;save();library(topic);}else if(r==='biblioteca')library();else home();
  document.body.classList.remove('menu-open');$('#menu').setAttribute('aria-expanded','false');
}
window.addEventListener('hashchange',()=>{if(!catalog)return;filters={query:'',channel:'all',status:'all'};render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});if(location.hash==='#ayuda-brave')$('#settings').showModal();});
document.addEventListener('click',e=>{
  const jump=e.target.closest('[data-scroll]');if(jump){e.preventDefault();document.getElementById(jump.dataset.scroll)?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  const rate=e.target.closest('[data-review]');if(rate){const id=route();state.study[id]=review(state.study[id]||emptyStudy(),rate.dataset.review);const ok=save();render();document.querySelector('.study-panel')?.scrollIntoView();if(!ok)tell('No se ha guardado el repaso. Exporta una copia.');return;}

  const close=e.target.closest('[data-close]');if(close)close.closest('dialog').close();
  if(e.target.closest('[data-settings]'))$('#settings').showModal();
  const watched=e.target.closest('[data-watch]'),favorite=e.target.closest('[data-favorite]');
  if(watched||favorite){const group=watched?'watched':'favorites',id=watched?watched.dataset.watch:favorite.dataset.favorite;state[group]=state[group].includes(id)?state[group].filter(x=>x!==id):[...state[group],id];save();renderResults();const replacement=document.querySelector(`[${watched?'data-watch':'data-favorite'}="${id}"]`);replacement?.focus({preventScroll:true});}
  if(e.target.closest('#clear')){filters={query:'',channel:'all',status:'all'};$('#query').value='';$('#channel').value='all';$('#status').value='all';renderResults();}
});
document.addEventListener('input',e=>{
  if(e.target.id==='study-errors'){const id=route();state.study[id]??=emptyStudy();state.study[id].errors=e.target.value;$('#study-save').textContent=save()?'Cuaderno guardado':'No se ha podido guardar. Exporta una copia.';}
  if(e.target.id==='query'){filters.query=e.target.value;renderResults();}
  if(e.target.id==='topic-note'){state.notes[e.target.dataset.topic]=e.target.value;$('#note-status').textContent=save()?'Nota guardada':'Sin guardar: exporta una copia';}
});
document.addEventListener('change',e=>{
  if(e.target.id==='daily-goal'){state.dailyGoal=Number(e.target.value);save();home();return;}
  if(e.target.id==='study-stage'||e.target.id==='review-date'||e.target.matches('[data-study-check]')){
    const id=route();const st=state.study[id]??=emptyStudy();
    if(e.target.id==='study-stage')st.stage=e.target.value;
    else if(e.target.id==='review-date')st.reviewAt=e.target.value;
    else {const v=e.target.dataset.studyCheck;st.checks=e.target.checked?[...new Set([...st.checks,v])]:st.checks.filter(x=>x!==v);}
    $('#study-save').textContent=save()?'Seguimiento guardado':'No se ha podido guardar. Exporta una copia.';
  }
if(['channel','status'].includes(e.target.id)){filters[e.target.id]=e.target.value;renderResults();}});
document.addEventListener('submit',e=>{
  if(e.target.id!=='practice-form')return;e.preventDefault();
  const data=new FormData(e.target),total=Number(data.get('total')),correct=Number(data.get('correct'));
  if(!Number.isInteger(total)||total<1||total>1000||!Number.isInteger(correct)||correct<0||correct>total){$('#practice-message').textContent='Los aciertos deben estar entre cero y el total de preguntas.';return;}
  const st=state.study[route()]??=emptyStudy();st.attempts=[...st.attempts,{date:day(),total,correct}].slice(-20);if(st.stage==='pending')st.stage='studying';
  const ok=save();render();document.querySelector('.practice-form')?.scrollIntoView();$('#practice-message').textContent=ok?'Resultado guardado.':'No se ha guardado: exporta una copia.';
});
$('#menu').onclick=()=>{const open=document.body.classList.toggle('menu-open');$('#menu').setAttribute('aria-expanded',String(open));};
$('#backup').onclick=()=>$('#settings').showModal();
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='opoasturias-progreso-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#import').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>5000000)throw Error('El archivo supera el límite de 5 MB.');const raw=JSON.parse(await file.text());pendingRestore=validateBackup(raw,topicIds,videoIds);$('#restore-info').textContent=`Contiene ${pendingRestore.watched.length} vídeos vistos, ${pendingRestore.favorites.length} favoritos y ${Object.keys(pendingRestore.notes).length} notas y ${Object.keys(pendingRestore.study).length} temas con seguimiento compatibles con este catálogo. Las referencias que ya no existan se omitirán.`;$('#restore').showModal();}catch(err){$('#import-status').textContent=err.message;}finally{e.target.value='';}
};
$('#confirm-restore').onclick=()=>{state=pendingRestore;save();$('#restore').close();$('#settings').close();render();tell('Copia restaurada. Tu progreso y tus notas ya están disponibles.');};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#install').textContent=usingBrave?(onAndroid?'Añadir al inicio':'Instalar en Brave ↗'):'Instalar app ↗';});
$('#install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;}else $('#settings').showModal();};
window.addEventListener('appinstalled',()=>{$('#install').hidden=true;tell('OpoAsturias ya está instalada.');});
function connection(){$('#connection').textContent=navigator.onLine?'Catálogo y notas disponibles sin conexión':'Sin conexión · los vídeos necesitan internet';}
window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
let displayedDay=day();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&catalog&&day()!==displayedDay){displayedDay=day();if(route()==='inicio')home();}});
try{
  const response=await fetch('./data/catalog.json');if(!response.ok)throw Error('No se ha podido cargar el catálogo.');catalog=await response.json();
  byVideo=new Map(catalog.videos.map(v=>[v.id,v]));topicIds=new Set(catalog.topics.map(t=>t.id));videoIds=new Set(byVideo.keys());
  try{const raw=localStorage.getItem(key);if(raw)state=validateBackup(JSON.parse(raw),topicIds,videoIds);}catch{tell('No se ha podido leer el progreso guardado. Puedes restaurar una copia desde los ajustes.');}
  render();
  if(location.hash==='#ayuda-brave')$('#settings').showModal();
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(reg=>{
      function available(){if(!reg.waiting)return;tell('Hay una nueva versión. ');const b=document.createElement('button');b.className='text-link';b.textContent='Actualizar ahora';b.onclick=()=>reg.waiting?.postMessage({type:'SKIP_WAITING'});$('#notice').append(b);}
      available();reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',()=>{if(reg.waiting&&navigator.serviceWorker.controller)available();}));
    }).catch(()=>tell('No se ha activado el modo sin conexión. La biblioteca sigue disponible con internet.'));
    let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshing){refreshing=true;location.reload();}});
  }
}catch(err){$('#main').innerHTML=`<div class="empty"><h1>No se ha podido abrir la biblioteca</h1><p>${esc(err.message)}</p><p>Comprueba la conexión y abre la aplicación desde su dirección de GitHub Pages o un servidor local.</p><button class="button" onclick="location.reload()">Volver a intentar</button></div>`;}
