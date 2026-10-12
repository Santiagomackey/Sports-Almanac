/* Same local calendar date only. Never substitute an unrelated anniversary. */
(() => {
 const heading=document.getElementById('historyHeading');if(!heading)return;
 const byId=id=>document.getElementById(id);
 const key=d=>`${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const sports=/\b(olympic(?:s| games)?|paralympic(?:s| games)?|world series|super bowl|nba|nhl|nfl|fifa|uefa|wimbledon|grand prix|formula (?:one|1)|stanley cup|cricket|rugby|marathon|baseball|basketball|football|soccer|tennis|boxing|handball|tour de france|100.metres?|100.meters?)\b/i;
 let dateKey='',events=[],pending=false,failed=false,requestId=0;
 function localEvents(date){return D.events.filter(e=>e.date===key(date)&&e.year<date.getFullYear()).sort((a,b)=>b.year-a.year);}
 function render(){
  const date=new Date(),event=events[0];heading.textContent='TODAY, SOME YEARS AGO';
  byId('month').textContent=date.toLocaleString('en',{month:'short'}).toUpperCase();byId('day').textContent=date.getDate();
  byId('historyYear').textContent=event?String(event.year):'ON THIS DAY';
  byId('historyDescription').textContent=event?event.text:pending?'Finding sports events from this day in history…':failed?'Today’s history feed is unavailable. No saved event matches this date.':'No sports anniversary is available for this date yet.';
  const age=byId('historyAge');if(age)age.textContent=event?`${date.getFullYear()-event.year} YEARS AGO · ${event.sport||'SPORTS'}`:'';
 }
 function details(){
  const date=new Date();if(key(date)!==dateKey)refresh();
  dialog('Today, some years ago',`<p>Sports events from ${esc(date.toLocaleDateString('en',{month:'long',day:'numeric'}))} in previous years.</p>`+(events.length?events.map(e=>`<article class="history-event"><span>${e.year} · ${date.getFullYear()-e.year} YEARS AGO · ${esc(e.sport||'SPORTS')}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>${sourceLink(e.url,e.fromFeed?'WIKIPEDIA SOURCE ↗':'VIEW SOURCE ↗')}</article>`).join(''):`<p>${pending?'Loading today’s anniversaries…':failed?'The history feed could not be reached. Try again shortly.':'No sports events are available for this date yet.'}</p>`)+`<p class="archive-note">Dates follow your device’s local calendar. Additional event summaries: Wikipedia / Wikimedia On this day, under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.</p>`,'SAME DAY · DIFFERENT YEARS');
 }
 const previous=showModal;showModal=function(type){if(type==='history')details();else previous(type);};
 async function refresh(){
  const date=new Date();dateKey=key(date);const activeKey=dateKey,id=++requestId;events=localEvents(date);pending=true;failed=false;render();
  try{
   const response=await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${activeKey.replace('-','/')}`,{signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw new Error('History feed unavailable');const data=await response.json();if(!Array.isArray(data.events))throw new Error('Invalid history feed');if(id!==requestId)return;
   const added=data.events.filter(e=>Number.isInteger(e.year)&&e.year<date.getFullYear()&&typeof e.text==='string'&&sports.test(e.text)).map(e=>{
    const page=(e.pages||[]).find(p=>p.content_urls?.desktop?.page?.startsWith('https://en.wikipedia.org/'));
    return {date:activeKey,year:e.year,sport:'SPORTS',title:page?.normalizedtitle||'On this day',text:e.text,url:page?.content_urls.desktop.page||`https://en.wikipedia.org/wiki/${date.toLocaleString('en',{month:'long'})}_${date.getDate()}`,fromFeed:true};
   });
   // Curated anniversaries lead the card; suppress matching feed descriptions.
   for(const e of added){const tokens=e.text.toLowerCase().match(/[a-z]{5,}/g)||[];if(!events.some(x=>x.year===e.year&&tokens.filter(w=>x.text.toLowerCase().includes(w)).length>=2))events.push(e);}
  }catch(error){if(id!==requestId)return;failed=true;}
  finally{if(id===requestId){pending=false;render();if(!overlay.hidden&&byId('dialogTitle').textContent==='Today, some years ago')details();}}
 }
 const rollover=()=>{if(key(new Date())!==dateKey)refresh();};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)rollover();});setInterval(rollover,60000);refresh();
})();
