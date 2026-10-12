const leagues = {nfl:'football/nfl',nba:'basketball/nba',mlb:'baseball/mlb',nhl:'hockey/nhl',epl:'soccer/eng.1',laliga:'soccer/esp.1',argentina:'soccer/arg.1',worldcup:'soccer/fifa.world'};
export async function GET(request) {
 const q=new URL(request.url).searchParams, league=q.get('league')||'nfl',kind=q.get('kind')||'scores';
 const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if(![...Object.keys(leagues),'f1'].includes(league)||!['scores','standings','game'].includes(kind))return reply({error:'Unsupported feed'},400);
 let url;
 if(league==='f1')url='https://api.jolpi.ca/ergast/f1/current/driverStandings/?limit=100';
 else {
  const path=leagues[league];
  url=kind==='standings'?`https://site.api.espn.com/apis/v2/sports/${path}/standings`:`https://site.api.espn.com/apis/site/v2/sports/${path}/${kind==='game'?'summary':'scoreboard'}`;
  const params=new URLSearchParams({limit:'200'});
  if(kind==='scores'&&q.has('date')){if(!/^\d{8}$/.test(q.get('date')))return reply({error:'Invalid date'},400);params.set('dates',q.get('date'));}
  if(kind==='game'){if(!/^\d{1,15}$/.test(q.get('event')||''))return reply({error:'Invalid event'},400);params.set('event',q.get('event'));}
  url+='?'+params;
 }
 try {
  const response=await fetch(url,{signal:AbortSignal.timeout(10000),headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`Provider HTTP ${response.status}`);
  const data=await response.json();
  if(!data||typeof data!=='object')throw new Error('Invalid provider response');
  return reply({data,retrievedAt:new Date().toISOString(),source:league==='f1'?'Jolpica-F1':'ESPN',sourceUrl:url});
 }catch(error){console.error('Sports feed unavailable',league,kind,error.message);return reply({error:'The sports feed is temporarily unavailable. Please retry.'},502);}
}
