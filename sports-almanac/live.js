(() => {
 'use strict';
 const root=document.querySelector('[data-live-desk]');
 if(!root || document.body.dataset.sport || (document.body.dataset.archiveView && document.body.dataset.archiveView!=='live'))return;
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const leagues={nfl:['NFL','football/nfl'],nba:['NBA','basketball/nba'],mlb:['MLB','baseball/mlb'],nhl:['NHL','hockey/nhl'],epl:['PREMIER LEAGUE','soccer/eng.1'],laliga:['LA LIGA','soccer/esp.1'],argentina:['ARGENTINA','soccer/arg.1'],worldcup:['WORLD CUP','soccer/fifa.world'],f1:['FORMULA 1','']};
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 const requested=new URLSearchParams(location.search).get('league');
 let league=leagues[requested]?requested:'nfl',view='scores',selectedDate=today(),controller,serial=0,busy=false,lastSuccess=null,gameSerial=0;
 root.innerHTML=`<div class="section-bar">THE LIVE DESK <span>2026 & BEYOND · CONNECTED SCORES</span></div><div class="live-intro"><div><span class="live-eyebrow">THE ALMANAC, UP TO THE MINUTE</span><h2>NEW SEASON. NEW NUMBERS.</h2><p>Scores, schedules, standings and game-day player statistics, straight from the feeds.</p></div><a class="yellow-btn" href="live.html">FULL LIVE CENTER ↗</a></div><div class="live-leagues" aria-label="Choose a live league">${Object.entries(leagues).map(([k,[name]])=>`<button data-league="${k}" aria-pressed="${league===k}">${name}</button>`).join('')}</div><div class="live-toolbar"><label>VIEW<select id="liveView"><option value="scores">SCORES & SCHEDULE</option><option value="standings">SEASON STANDINGS</option></select></label><label id="liveDateLabel">MATCH DATE<input id="liveDate" type="date" value="${selectedDate}"></label><button class="yellow-btn" id="liveToday">TODAY</button><button class="yellow-btn" id="liveRefresh">REFRESH ↻</button><label class="live-auto"><input type="checkbox" id="liveAuto" checked> AUTO REFRESH</label></div><p class="live-status" id="liveStatus" role="status">Connecting to the score desk…</p><div id="liveContent" aria-busy="true"></div><div id="liveGame" hidden tabindex="-1"></div><p class="archive-note">ESPN scores refresh every 30 seconds while this tab is visible. Standings refresh every 5 minutes. Formula 1 uses Jolpica championship results, not live timing. Feeds can be delayed; retrieval time is not the time of the last play. Match times use your device’s time zone. Other sports remain in the historical archive.</p>`;
 const $=id=>root.querySelector('#'+id);
 const table=(headers,rows)=>`<div class="live-table-scroll"><table class="live-table"><thead><tr>${headers.map(h=>`<th scope="col">${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${E(v)}</td>`:`<th scope="row">${E(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const empty=text=>`<div class="live-empty"><h3>NOTHING ON THE BOARD</h3><p>${E(text)}</p></div>`;
 function directURL(kind,event){
  if(league==='f1')return 'https://api.jolpi.ca/ergast/f1/current/driverStandings/?limit=100';
  const path=leagues[league][1];
  if(kind==='standings')return `https://site.api.espn.com/apis/v2/sports/${path}/standings`;
  return `https://site.api.espn.com/apis/site/v2/sports/${path}/${kind==='game'?'summary?event='+encodeURIComponent(event):'scoreboard?limit=200&dates='+selectedDate.replaceAll('-','')}`;
 }
 async function request(kind,event,signal){
  const q=new URLSearchParams({league,kind,date:selectedDate.replaceAll('-','')});if(event)q.set('event',event);
  // ESPN permits browser CORS. Prefer the included same-origin function when deployed.
  if(location.protocol!=='file:'){
   const r=await fetch('/api/live?'+q,{signal});
   if(r.ok&&r.headers.get('content-type')?.includes('application/json')){const body=await r.json();if(body.data)return body;throw new Error(body.error||'Invalid feed response');}
   if(r.status!==404&&r.status!==405&&!(r.ok&&!r.headers.get('content-type')?.includes('application/json')))throw new Error('The feed is temporarily unavailable. Please retry.');
  }
  if(league==='f1')throw new Error('Formula 1 requires the included /api/live server function. Deploy this folder on Vercel to enable it.');
  const url=directURL(kind,event),r=await fetch(url,{signal});if(!r.ok)throw new Error('The feed is temporarily unavailable. Please retry.');
  return {data:await r.json(),retrievedAt:new Date().toISOString(),source:'ESPN',sourceUrl:url};
 }
 function scores(d){
  if(!Array.isArray(d.events))throw new Error('The provider did not return a score board.');
  const season=d.leagues?.[0]?.season;
  return `<div class="live-context"><strong>${E(d.leagues?.[0]?.name||leagues[league][0])}</strong><span>${E(season?.displayName||season?.year||'')} · ${E(season?.type?.name||'Schedule')} · ${E(selectedDate)}</span></div>`+(d.events.length?`<div class="live-score-grid">${d.events.map(event=>{
   const c=event.competitions?.[0],s=c?.status||event.status,teams=[...(c?.competitors||[])].sort((a,b)=>a.homeAway==='away'?-1:b.homeAway==='away'?1:0);
   return `<article class="live-score-card ${s?.type?.state==='in'?'is-live':''}"><div class="live-game-state">${s?.type?.state==='in'?'<span class="live-dot"></span>':''}${E(s?.type?.shortDetail||s?.type?.description||'Scheduled')}</div>${teams.map(t=>`<div class="live-team ${t.winner?'is-winner':''}"><span><small>${E(t.homeAway)}</small>${E(t.team?.displayName||t.athlete?.displayName||'TBC')}<em>${E(t.records?.[0]?.summary||'')}</em></span><b>${E(s?.type?.state==='pre'?'—':t.score??'—')}</b></div>`).join('')}<p>${E(new Date(event.date).toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}))} · ${E(c?.venue?.fullName||'Venue TBC')}</p>${(c?.headlines||[]).slice(0,1).map(h=>`<p>${E(h.shortLinkText||h.description||'')}</p>`).join('')}<button class="live-detail-button" data-game="${E(event.id)}">GAME STATS & DETAILS →</button></article>`;
  }).join('')}</div>`:empty('No games returned for this date. Choose another date or check the season standings.'));
 }
 function standings(d){
  const groups=[];function walk(node){if(node.standings?.entries)groups.push({name:node.name||node.standings.displayName,entries:node.standings.entries});(node.children||[]).forEach(walk);}walk(d);
  if(!groups.length)return empty('No standings were returned for the current season. The league may be between seasons.');
  const preferred=['wins','losses','ties','otLosses','points','gamesPlayed','winPercent','gamesBehind','pointsFor','pointsAgainst','pointDifferential','streak'];
  return `<div class="live-context"><strong>${E(d.name||leagues[league][0])} STANDINGS</strong><span>Provider season: ${E(d.season?.displayName||d.season?.year||'not supplied')}</span></div>`+groups.map(g=>{
   const all=g.entries.flatMap(e=>e.stats||[]),keys=preferred.filter(k=>all.some(s=>s.name===k));
   return `<h3 class="live-group-title">${E(g.name)}</h3>`+table(['TEAM',...keys.map(k=>all.find(s=>s.name===k)?.abbreviation||k)],g.entries.map(e=>[e.team?.displayName||e.team?.name||'Unknown',...keys.map(k=>(e.stats||[]).find(s=>s.name===k)?.displayValue??'—')]));
  }).join('');
 }
 function f1(d){
  const lists=d.MRData?.StandingsTable?.StandingsLists;if(!Array.isArray(lists))throw new Error('The provider did not return F1 standings.');
  if(!lists.length)return empty('No Formula 1 championship standings are available yet.');
  const s=lists[0];return `<div class="live-context"><strong>FORMULA 1 · ${E(s.season)}</strong><span>Classified results through round ${E(s.round)} · Not live timing</span></div>`+table(['POS','DRIVER','CONSTRUCTOR','POINTS','WINS'],(s.DriverStandings||[]).map(r=>[r.position,`${r.Driver?.givenName||''} ${r.Driver?.familyName||''}`,(r.Constructors||[]).map(c=>c.name).join(', '),r.points,r.wins]));
 }
 function detail(d){
  const c=d.header?.competitions?.[0];
  let out=`<h3>${E((c?.competitors||[]).map(t=>t.team?.displayName).join(' vs ')||'GAME STATISTICS')}</h3><p>${E(c?.status?.type?.detail||'')}</p>`;
  for(const team of d.boxscore?.teams||[])out+=`<h4>${E(team.team?.displayName)} · TEAM STATS</h4>`+table(['STATISTIC','VALUE'],(team.statistics||[]).map(s=>[s.label||s.name,s.displayValue]));
  for(const group of d.boxscore?.players||[])for(const category of group.statistics||[])out+=`<h4>${E(group.team?.displayName)} · ${E(category.text||category.name||'PLAYER STATS')}</h4>`+table(['PLAYER',...(category.labels||category.names||[])],(category.athletes||[]).map(p=>[p.athlete?.displayName,...(p.stats||[])]));
  if(!d.boxscore?.teams?.length&&!d.boxscore?.players?.length)out+=empty('Player and team statistics have not been supplied for this game yet.');
  return out;
 }
 function controls(){
  root.querySelectorAll('[data-league]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.league===league));
  $('liveView').disabled=league==='f1';$('liveDateLabel').hidden=view!=='scores'||league==='f1';$('liveToday').hidden=view!=='scores'||league==='f1';$('liveGame').hidden=true;
 }
 async function load(){
  controller?.abort();controller=new AbortController();const id=++serial,activeController=controller;busy=true;gameSerial++;
  $('liveContent').setAttribute('aria-busy','true');$('liveContent').innerHTML='<p>Loading current data…</p>';$('liveStatus').textContent='Fetching the latest provider data…';
  const timer=setTimeout(()=>activeController.abort(),15000);
  try{const r=await request(league==='f1'?'standings':view,undefined,activeController.signal);if(id!==serial)return;
   $('liveContent').innerHTML=league==='f1'?f1(r.data):view==='scores'?scores(r.data):standings(r.data);
   lastSuccess=Date.now();$('liveStatus').textContent=`CONNECTED · ${r.source} · Retrieved ${new Date(r.retrievedAt).toLocaleString()} · ${$('liveAuto').checked?'Auto refresh on':'Manual refresh'}`;
  }catch(error){if(id!==serial)return;$('liveContent').innerHTML=empty(error.name==='AbortError'?'The feed timed out. Use Refresh to try again.':error.message);$('liveStatus').textContent='OFFLINE / FEED UNAVAILABLE · No current statistics displayed';}
  finally{clearTimeout(timer);if(id===serial){busy=false;$('liveContent').setAttribute('aria-busy','false');}}
 }
 root.addEventListener('click',async e=>{
  const b=e.target.closest('[data-league]');if(b){league=b.dataset.league;controls();load();return;}
  const game=e.target.closest('[data-game]');if(game){
   const box=$('liveGame');box.hidden=false;box.innerHTML='<p>Loading game statistics…</p>';box.focus();const id=serial,gameId=++gameSerial;
   try{const r=await request('game',game.dataset.game,AbortSignal.timeout(15000));if(id!==serial||gameId!==gameSerial)return;box.innerHTML=`<button class="yellow-btn" data-close-game>CLOSE DETAILS ×</button><p class="archive-note">${E(r.source)} · Retrieved ${E(new Date(r.retrievedAt).toLocaleString())} · Snapshot; reopen to refresh.</p>`+detail(r.data);}catch(err){if(id===serial&&gameId===gameSerial)box.innerHTML=`<button class="yellow-btn" data-close-game>CLOSE DETAILS ×</button>`+empty('Game statistics are unavailable. Please try again.');}
  }
  if(e.target.closest('[data-close-game]')){gameSerial++;$('liveGame').hidden=true;$('liveRefresh').focus();}
 });
 $('liveView').onchange=e=>{view=e.target.value;controls();load();};
 $('liveDate').onchange=e=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value))return;selectedDate=e.target.value;load();};
 $('liveToday').onclick=()=>{selectedDate=today();$('liveDate').value=selectedDate;load();};
 $('liveRefresh').onclick=load;
 $('liveAuto').onchange=()=>{if($('liveAuto').checked)load();else $('liveStatus').textContent+=' · Auto refresh paused';};
 setInterval(()=>{if(!document.hidden&&!busy&&$('liveAuto').checked&&(Date.now()-(lastSuccess||0)>=(view==='scores'&&league!=='f1'?30000:300000)))load();},30000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('liveAuto').checked)load();});
 controls();load();
})();
