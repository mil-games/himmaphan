/* ศึกเทพหิมพานต์ · หน้าจอและการเชื่อมต่อ (กติกาอยู่ใน rules.js) */
/* ===================== STORAGE ===================== */
let STORE=null,ME=null,LOCAL=true;
const localGames={};let localSubs=[];
function fireLocal(){localSubs.forEach(f=>f())}
async function createGame(data){return STORE.create(data)}
async function mutate(gid,fn){
  if(isTut(gid)){const S=clone(localGames[gid]);if(fn(S)===false)return false;localGames[gid]=S;fireLocal();return true}
  const r=await STORE.mutate(gid,fn);
  if(!r.ok&&r.why){toast(r.why==='missing'?'ไม่พบห้องนี้แล้ว':r.why==='denied'?'คุณไม่ได้อยู่ในห้องนี้ จึงเดินแทนไม่ได้':'บันทึกไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง')}
  return r.ok;
}
let unsub=null;
function stopWatch(){if(unsub){unsub();unsub=null}localSubs=[]}
function watchGame(gid,cb){
  stopWatch();
  if(isTut(gid)){const f=()=>cb(localGames[gid]?clone(localGames[gid]):null);localSubs=[f];f();return}
  unsub=STORE.watchGame(gid,S=>{if(S===undefined){toast('การเชื่อมต่อหลุด กำลังลองใหม่');return}cb(S)});
}
function watchLobby(cb){stopWatch();unsub=STORE.watchMine(cb)}

/* ===================== UI STATE ===================== */
const app=document.getElementById('app');
let view={name:'lobby'},G=null,GID=null;
let ui={mode:null};
const names={};
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>el.hidden=true,3200)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function noteNames(S){if(!S||!S.seats)return;for(const x of S.seats)if(x.uid&&x.name)names[x.uid]=x.name}
function resolveNames(){}
const pname=(uid,fallback)=>uid===ME?'คุณ':uid==='bot'?'บอทฝึก':(names[uid]||fallback);
function mySeats(S){return S.seats.map((x,i)=>x.uid===ME?i:-1).filter(i=>i>=0)}
function activeSeat(S){if(S.status!=='play')return -1;if(S.battle)return S.battle.d;if(S.retreat)return S.retreat.chooser;if(S.follow)return S.follow.seat;return S.order[S.pos]}
function iControl(S,s){return s>=0&&S.seats[s]&&S.seats[s].uid===ME}
function myName(){try{return localStorage.getItem('hmp-name')||''}catch(e){return ''}}
function setMyName(n){try{localStorage.setItem('hmp-name',n)}catch(e){}}
const cleanName=v=>String(v||'').replace(/\s+/g,' ').trim().slice(0,20);
const linkFor=id=>location.origin+location.pathname+'#g-'+id;
function copyText(t){const done=()=>toast('คัดลอกลิงก์แล้ว ส่งให้เพื่อนได้เลย');
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,()=>toast('คัดลอกไม่ได้ กดค้างที่ลิงก์เพื่อคัดลอกเอง'))}else toast('กดค้างที่ลิงก์เพื่อคัดลอกเอง')}

/* ===================== RENDER: LOBBY ===================== */
let lobbyRows=[];
function showLobby(){
  TUT=null;
  view={name:'lobby'};GID=null;G=null;ui={mode:null};
  try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
  watchLobby(rows=>{lobbyRows=rows.sort((a,b)=>(b.d.upd||b.d.created||0)-(a.d.upd||a.d.created||0));rows.forEach(r=>noteNames(r.d));render()});
  render();
}
function modeNote(){
  if(STORE.online)return '';
  if(STORE.configured&&STORE.error)return `<div class="banner warn small">ต่อฐานข้อมูลไม่สำเร็จ: ${esc(STORE.error)} ตอนนี้เล่นได้แค่ในเครื่องนี้ ตรวจค่าใน firebase-config.js และการตั้งค่าใน README</div>`;
  return `<div class="banner small"><b>โหมดในเครื่อง:</b> ยังไม่ได้ตั้งค่า Firebase จึงเล่นได้บนเครื่องนี้เครื่องเดียว และห้องจะหายเมื่อรีเฟรช ทำตาม README ข้อ 2 เพื่อเล่นกับเพื่อน</div>`;
}
function renderLobby(){
  const rows=lobbyRows.filter(r=>r.d&&r.d.status!=='done').slice(0,12);
  const done=lobbyRows.filter(r=>r.d&&r.d.status==='done').slice(0,5);
  const gameRow=r=>{const d=r.d;const filled=d.seats.filter(x=>x.uid).length;
    const st=d.status==='lobby'?`รอผู้เล่น ${filled}/${d.n}`:d.status==='draft'?'กำลังเลือกเทพ':d.status==='play'?`กำลังเล่น · รอบ ${d.round}`:'จบแล้ว';
    const myTurn=(d.status==='play'&&iControl(d,activeSeat(d)))||(d.status==='draft'&&iControl(d,d.draftOrder[d.draftPos]));
    return `<div class="lg"><div><span class="code">${esc(r.id)}</span> <span class="muted small">· ${d.n} คน${d.solo?' · ทดสอบคนเดียว':''} · เป้า ${d.target} คะแนน</span><div class="small ${myTurn?'':'muted'}">${myTurn?'<b>ถึงตาคุณแล้ว</b> · ':''}${st}</div></div>
    <button class="${myTurn?'primary':''}" data-open="${esc(r.id)}">${d.status==='done'?'ดูผล':'เข้าห้อง'}</button></div>`};
  app.innerHTML=`
  <div class="hero">
    <div><h1>ศึกเทพหิมพานต์</h1>
      <p>เทพไทย 2–7 องค์ ชิงวัดและเขาพระสุเมรุ เกมเดินแบบผลัดตา ใครว่างก็เข้ามาเดินตาของตัวเอง ไม่ต้องออนไลน์พร้อมกัน</p>
      <p><button class="primary" id="learn">เรียนวิธีเล่น (ประมาณ 5 นาที)</button></p>
      ${modeNote()}
    </div>
    <div class="panel stack">
      <label class="form"><span class="small">ชื่อในเกมของคุณ</span><input id="nick" maxlength="20" placeholder="เช่น มิล" value="${esc(myName())}" autocomplete="nickname"></label>
      <form class="row" id="joinf"><input id="jcode" maxlength="6" placeholder="รหัสห้อง 6 ตัว" style="text-transform:uppercase;flex:1 1 140px" aria-label="รหัสห้อง" autocomplete="off"><button type="submit">เข้าห้อง</button></form>
      <details ${rows.length?'':'open'}><summary>เปิดห้องใหม่</summary>
      <form class="form" id="newf" style="margin-top:10px">
        <label>จำนวนผู้เล่น<select id="nf-n">${[2,3,4,5,6,7].map(n=>`<option value="${n}"${n===2?' selected':''}>${n} คน</option>`).join('')}</select></label>
        <label>คะแนนที่ต้องได้<select id="nf-t"><option value="6">6 (เกมสั้น)</option><option value="8" selected>8</option><option value="10">10 (เกมยาว)</option></select></label>
        <label class="row"><input type="checkbox" id="nf-l3"> ใช้การ์ดเลเวล 3 ด้วย (36 ใบ)</label>
        <label class="row"><input type="checkbox" id="nf-open"> เปิดการ์ด: ฝ่ายรับเห็นการ์ดฝ่ายบุกก่อนเลือก</label>
        <label class="row"><input type="checkbox" id="nf-solo"> ทดสอบคนเดียว (คุมทุกฝ่ายเอง)</label>
        <button class="primary" type="submit">เปิดห้อง</button>
      </form></details>
    </div>
  </div>
  <h2 style="margin-bottom:8px">ห้องของฉัน</h2>
  <div class="lobbylist">${rows.length?rows.map(gameRow).join(''):`<div class="panel muted">ยังไม่มีห้อง เปิดห้องใหม่ หรือใส่รหัสห้องที่เพื่อนส่งมา</div>`}</div>
  ${done.length?`<h3 style="margin:18px 0 8px">จบแล้วล่าสุด</h3><div class="lobbylist">${done.map(gameRow).join('')}</div>`:''}
  ${rulesRef()}`;
  const nick=document.getElementById('nick');nick.onchange=()=>setMyName(cleanName(nick.value));
  document.getElementById('joinf').onsubmit=async e=>{e.preventDefault();
    const code=document.getElementById('jcode').value.toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(code.length!==6){toast('รหัสห้องมี 6 ตัว');return}
    const d=await STORE.get(code).catch(()=>null);if(!d){toast('ไม่พบห้อง '+code);return}
    openGame(code)};
  document.getElementById('newf').onsubmit=async e=>{e.preventDefault();
    const n=+document.getElementById('nf-n').value,target=+document.getElementById('nf-t').value,useL3=document.getElementById('nf-l3').checked,solo=document.getElementById('nf-solo').checked;
    const nm=cleanName(nick.value);setMyName(nm);
    const seats=[...Array(n)].map(()=>({uid:null,god:null,name:''}));
    if(solo){const gs=GODS.map(g=>g.k).sort(()=>Math.random()-.5);seats.forEach((x,i)=>{x.uid=ME;x.god=gs[i];x.name=nm})}
    const openCards=document.getElementById('nf-open').checked;
    const data={v:1,created:Date.now(),host:ME,status:'lobby',solo,n,target,useL3,openCards,seats,log:[]};
    try{const id=await createGame(data);openGame(id)}catch(err){toast('เปิดห้องไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง')}
  };
  app.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openGame(b.dataset.open));
  document.getElementById('learn').onclick=startTutorial;
}
function rulesRef(){return `<details class="panel" style="margin-top:20px"><summary>สรุปกติกาแบบย่อ</summary>
<div class="stack small" style="margin-top:10px">
<p>แต่ละรอบ ผู้เล่นผลัดกันทำคนละ 1 แอคชัน รวม 3 แอคชันต่อคน แอคชันเดียวกันใช้ได้ครั้งเดียวต่อรอบ: เกณฑ์ทัพ, เดินทัพ, ทำบุญ, ขอพร (ซื้อการ์ดพลังหรือพาหนะ)</p>
<p>เดินเข้าช่องศัตรู = รบ ทั้งสองฝ่ายลงการ์ดคว่ำแล้วเปิดพร้อมกัน พลังรบ = ทหาร + พลังการ์ด + โบนัส พลังสูงกว่าชนะ เสมอฝ่ายรับชนะ ทั้งสองฝ่ายเสียทหารตามแต้มฆ่าในการ์ดของอีกฝ่าย ฝ่ายแพ้ที่เหลือรอดถอย 1 ช่อง ฝ่ายชนะเป็นคนเลือก บุกชนะและยังเหลือทหารได้ 1 คะแนนถาวรและบาป +1 บาปถึง 3 เสียทหาร 2 ตัว</p>
<table class="ref"><tr><th>การ์ดรบ</th><th>พลัง</th><th>ฆ่า</th></tr>${CARD.map((c,i)=>`<tr><td>${c.n}${i===4?' (ตำราพิชัยสงคราม)':''}</td><td>${c.s}</td><td>${c.k}</td></tr>`).join('')}</table>
<p>ยึดวัดได้ 1 คะแนนชั่วคราว เขาพระสุเมรุ 2 คะแนน ข้างขึ้นได้บุญ +1 ต่อวัด ข้างแรมฝ่ายบุก +1 ใครถึงคะแนนเป้าตอนจบรอบชนะ</p>
<table class="ref"><tr><th>เทพ</th><th>ความสามารถ</th><th>พาหนะประจำองค์</th></tr>${GODS.map(g=>`<tr><td>${g.name}</td><td><b>${g.ab}</b>: ${g.txt} · ${g.weak}</td><td>${MOUNTS[g.mount].name}</td></tr>`).join('')}</table>
<p class="muted">ฝ่ายบุกเห็นการ์ดของตัวเองระหว่างรอ หลังรบทุกคนเห็นการ์ดทั้งสองฝ่ายและที่มาของพลังรบในกล่อง "ศึกล่าสุด" ห้องที่ติ๊ก "เปิดการ์ด" ฝ่ายรับจะเห็นการ์ดฝ่ายบุกก่อนเลือกด้วย</p>
</div></details>`}

/* ===================== RENDER: GAME ===================== */
function openGame(id){
  GID=id;view={name:'game'};ui={mode:null};G=null;
  try{history.replaceState(null,'','#g-'+id)}catch(e){}
  try{localStorage.setItem('hmp-last',id)}catch(e){}
  watchGame(id,S=>{
    if(!S){G=null;render();return}
    const prevTurn=G?activeSeat(G):null;G=S;
    if(prevTurn!==activeSeat(S))ui={mode:null};
    noteNames(S);render();tutTick(S);
  });
  render();
}
function render(){
  if(view.name==='lobby')return renderLobby();
  if(!G){app.innerHTML=`<p class="muted">กำลังโหลดเกม… <button class="ghost" id="back">กลับหน้ารวม</button></p>`;document.getElementById('back').onclick=showLobby;return}
  if(G.status==='lobby'||G.status==='draft')return renderSeating();
  renderGame();
}
function topBar(S,extra){
  return `<div class="top"><div class="row"><button class="ghost" id="back">← ห้องทั้งหมด</button><h1>ศึกเทพหิมพานต์</h1></div>
  <div class="meta"><span class="pill tab">${isTut(GID)?'บทเรียน':'ห้อง '+esc(GID)}</span>${extra||''}</div></div>`}
function draftPicker(S){return S.status==='draft'?S.draftOrder[S.draftPos]:-1}
function renderSeating(){
  const S=G;const isHost=S.host===ME;const mine=mySeats(S);const seated=mine.length>0;
  const full=S.seats.every(x=>x.uid);
  const draft=S.status==='draft';const picker=draftPicker(S);const myPick=draft&&iControl(S,picker);
  const taken=new Set(S.seats.map(x=>x.god).filter(Boolean));
  const who=i=>{const x=S.seats[i];return x.uid?(x.uid===ME?'คุณ':(x.name||'ผู้เล่น')):'ว่าง'};
  const seatCard=i=>{const x=S.seats[i];const pos=draft?S.draftOrder.indexOf(i):-1;const now=draft&&i===picker;
    return `<div class="seat" style="${now?'border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset':''}"><div class="row"><span class="dot" style="background:${SEATC(i)}"></span><b>${esc(who(i))}</b></div>
      ${draft?`<div class="small muted">ลำดับเลือกที่ ${pos+1}</div>`:''}
      <div>${x.god?`<button class="godlink" ${infoAttr('god:'+x.god)}><b>${GOD[x.god].name}</b></button>`:`<span class="muted">${draft?(now?'กำลังเลือก…':'รอเลือก'):''}</span>`}</div></div>`};
  const order=draft?S.draftOrder:S.seats.map((_,i)=>i);
  let body='';
  if(!draft){
    body=`<div class="panel stack"><h2>ขั้นที่ 1 · เข้านั่ง</h2>
      <p class="small">รหัสห้อง <span class="code">${esc(GID)}</span> ส่งลิงก์ให้เพื่อน ทุกคนเข้านั่งให้ครบ ${S.n} ที่ แล้วเจ้าของห้องกดเริ่มเลือกเทพ ระบบจะสุ่มว่าใครได้เลือกก่อน</p>
      <div class="share"><code id="slink">${esc(linkFor(GID))}</code><button id="copy">คัดลอกลิงก์</button></div>
      <div class="seats">${order.map(seatCard).join('')}</div>
      ${seated?`<p><button class="ghost" id="leave">ลุกจากที่นั่ง</button></p>`:full?'<p class="muted">ห้องเต็มแล้ว</p>':`<div class="row"><label class="form" style="flex:1 1 220px"><span class="small">ชื่อในเกมของคุณ</span><input id="nick2" maxlength="20" placeholder="เช่น มิล" value="${esc(myName())}"></label><button class="primary" id="sit" style="align-self:flex-end">เข้านั่ง</button></div>`}
      </div>
      <div class="row">${isHost&&S.solo?`<button class="primary" id="startsolo">เริ่มเกม (สุ่มเทพให้)</button><button class="ghost" id="del">ลบห้องนี้</button>`:isHost?`<button class="primary" id="startdraft" ${full?'':'disabled'}>เริ่มเลือกเทพ</button><span class="small muted">${full?'ครบแล้ว':'รอให้ครบทุกที่นั่ง'}</span><button class="ghost" id="del">ลบห้องนี้</button>`:'<span class="muted">รอเจ้าของห้องกดเริ่มเลือกเทพ</span>'}</div>`;
  }else{
    body=`<div class="panel stack"><h2>ขั้นที่ 2 · เลือกเทพตามลำดับ</h2>
      <p class="small">${myPick?'<b>ถึงตาคุณเลือกแล้ว</b> เลือกเทพที่ยังว่างด้านล่าง':`รอ <b>${esc(who(picker))}</b> เลือก`} · คนที่เลือกทีหลังสุดจะได้เดินก่อนในรอบแรก</p>
      <div class="seats">${order.map(seatCard).join('')}</div></div>
      <div class="panel"><h3>เทพ</h3><div class="gods" style="margin-top:10px">${GODS.map(g=>{const t=taken.has(g.k);const owner=S.seats.findIndex(x=>x.god===g.k);
        return `<button class="god ${t?'taken':''}" data-god="${g.k}" ${t||!myPick?'disabled':''}><b>${g.name}</b>${t?` · ${esc(who(owner))}`:''}<div class="small"><b>${g.ab}</b>: ${g.txt}</div><div class="small muted">${g.weak} · พาหนะ ${MOUNTS[g.mount].name}</div></button>`}).join('')}</div></div>
      ${isHost?`<div class="row"><button class="ghost" id="del">ลบห้องนี้</button></div>`:''}`;
  }
  app.innerHTML=topBar(S,`<span class="pill">${S.n} คน · เป้า ${S.target}</span>`)+`<div class="stack">${body}<div id="confirm"></div></div>`;
  const $=id=>document.getElementById(id);
  $('back').onclick=showLobby;
  if($('copy'))$('copy').onclick=()=>copyText(linkFor(GID));
  if($('sit'))$('sit').onclick=()=>{const nm=cleanName($('nick2').value);if(!nm){toast('ใส่ชื่อในเกมก่อน');$('nick2').focus();return}setMyName(nm);
    mutate(GID,T=>{if(T.status!=='lobby'||T.seats.some(x=>x.uid===ME))return false;const i=T.seats.findIndex(x=>!x.uid);if(i<0){toast('ห้องเต็มแล้ว');return false}T.seats[i]={uid:ME,god:null,name:nm}})};
  if($('leave'))$('leave').onclick=()=>mutate(GID,T=>{if(T.status!=='lobby')return false;const i=T.seats.findIndex(x=>x.uid===ME);if(i<0)return false;T.seats[i]={uid:null,god:null,name:''}});
  if($('startsolo'))$('startsolo').onclick=()=>mutate(GID,T=>{if(T.status!=='lobby'||T.host!==ME)return false;setupGame(T)});
  if($('startdraft'))$('startdraft').onclick=()=>mutate(GID,T=>{if(T.status!=='lobby'||T.host!==ME||!T.seats.every(x=>x.uid))return false;
    T.seats.forEach(x=>x.god=null);T.draftOrder=[...Array(T.n).keys()].sort(()=>Math.random()-.5);T.draftPos=0;T.status='draft'});
  app.querySelectorAll('[data-god]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.god;
    mutate(GID,T=>{if(T.status!=='draft')return false;const s=T.draftOrder[T.draftPos];if(!iControl(T,s))return false;if(T.seats.some(x=>x.god===k))return false;
      T.seats[s].god=k;T.draftPos++;
      if(T.draftPos>=T.n){const picks=T.draftOrder.map(i=>T.seats[i].god);const order=[...T.draftOrder].reverse();setupGame(T);T.order=order;T.pos=0;
        log(T,`เลือกเทพเสร็จ: ${picks.map(g=>GOD[g].name).join(' → ')} · ${GOD[T.seats[order[0]].god].name}ได้เดินก่อน`)}})});
  if($('del'))$('del').onclick=()=>{$('confirm').innerHTML=`<div class="banner warn row">ลบห้องนี้ถาวร? <button id="del2">ลบ</button><button class="ghost" id="del3">ยกเลิก</button></div>`;
    $('del3').onclick=()=>render();
    $('del2').onclick=async()=>{try{await STORE.del(GID)}catch(e){toast('ลบไม่สำเร็จ')}showLobby()}};
}

function mrng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const LAYOUT_CACHE={};
function mapLayout(S){
  const key=S.n+':'+(S.seed||1);if(LAYOUT_CACHE[key])return LAYOUT_CACHE[key];
  const n=S.n,rnd=mrng((S.seed||1)^0x9e3779b9),W=1000,H=700,cx=500,cy=355,Rx=440,Ry=300;
  const span=Math.PI*2/n;
  // ตำแหน่งตามบล็อก k: [รัศมี, ระยะมุมในบล็อก]
  const K=[[1.00,0.00],[0.95,0.27],[1.02,0.52],[0.93,0.77],[0.60,0.24],[0.56,0.63]];
  const pos=[{x:cx,y:cy}];
  for(let s=0;s<n;s++)for(let k=0;k<6;k++){
    const [r0,o]=K[k];const r=r0*(1+(rnd()-.5)*0.16);const a=-Math.PI/2+s*span+o*span+(rnd()-.5)*span*0.07;
    pos.push({x:cx+Rx*r*Math.cos(a),y:cy+Ry*r*Math.sin(a)});
  }
  // ความโค้งของเส้นทาง สุ่มคงที่ต่อห้อง
  const bend={};for(let i=0;i<pos.length;i++)for(const j of adj(S,i))if(j>i)bend[i+'-'+j]=(rnd()-.5)*0.45;
  const ring=Math.PI*(Rx+Ry)/(4*n);
  const r=Math.max(24,Math.min(44,ring*0.36));
  return LAYOUT_CACHE[key]={W,H,cx,cy,pos,bend,r};
}
function mapSVG(S,clickable,selected,hl){hl=hl||[];
  const M=mapLayout(S),n=L(S);
  let lines='';
  for(let i=0;i<=n;i++)for(const j of adj(S,i)){if(j<i)continue;const a=M.pos[i],b=M.pos[j];
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,bd=M.bend[i+'-'+j]||0;
    const qx=mx-dy*bd,qy=my+dx*bd;const toC=i===0||j===0;
    lines+=`<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="var(--line)" stroke-width="${toC?2:3}" stroke-linecap="round" ${toC?'stroke-dasharray="3 7"':''}/>`}
  let cells='';
  for(let i=0;i<=n;i++){
    const p=M.pos[i],t=ctype(S,i),c=S.B[i];const rr=i===0?M.r*1.7:M.r;
    const fill=t==='sumeru'?'var(--goldtint)':t==='temple'?'var(--temple)':t==='forest'?'var(--forest)':t==='plain'?'var(--plain)':'var(--surface)';
    const oc=c.t>0&&c.o>=0?SEATC(c.o):(t==='city'?SEATC(citySeat(i)):'var(--line)');
    const lab=i===0?'เขาพระสุเมรุ':t==='city'?GOD[godOf(S,citySeat(i))].name.replace('พระ',''):KNAME[kOf(i)];
    const ms=MK.filter(k=>S.M[k]&&S.M[k].c===i);
    const cls=['cell',clickable.includes(i)?'click':'',selected===i?'sel':''].join(' ');
    const fs=Math.max(12,Math.min(15,rr*0.36));
    cells+=`<g class="${cls}" data-cell="${i}" role="${clickable.includes(i)?'button':'img'}" tabindex="${clickable.includes(i)?0:-1}" aria-label="${esc(cname(S,i))} ${c.t>0?'ทหาร '+c.t:''}">
      ${hl.includes(i)?`<circle class="hlring" cx="${p.x}" cy="${p.y}" r="${rr+9}" fill="none" stroke="var(--gold)" stroke-width="3" stroke-dasharray="5 5"/>`:''}
      <circle class="ring" cx="${p.x}" cy="${p.y}" r="${rr}" fill="${fill}" stroke="${oc}" stroke-width="${c.t>0||t==='city'?3.5:1.5}"/>
      <text x="${p.x}" y="${p.y-rr*0.3}" text-anchor="middle" font-size="${fs}" fill="var(--muted)" font-family="Anuphan,sans-serif">${esc(lab)}</text>
      ${c.t>0?`<text x="${p.x}" y="${p.y+rr*0.4}" text-anchor="middle" font-size="${Math.max(17,rr*0.66)}" font-weight="700" fill="${SEATC(c.o)}" font-family="Anuphan,sans-serif">${c.t}</text>`:''}
      ${ms.map((k,j)=>`<g><circle cx="${p.x+rr*0.78-j*18}" cy="${p.y-rr*0.8}" r="12" fill="${SEATC(S.M[k].o)}"/><text x="${p.x+rr*0.78-j*18}" y="${p.y-rr*0.8+5}" text-anchor="middle" font-size="13" fill="var(--surface)" font-weight="700" font-family="Anuphan,sans-serif">${MOUNTS[k].sh}</text><title>${MOUNTS[k].name} ของ${GOD[godOf(S,S.M[k].o)].name}</title></g>`).join('')}
      ${i===0?`<text x="${p.x}" y="${p.y+rr*0.55}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="Anuphan,sans-serif">2 คะแนน</text>`:''}
    </g>`;
  }
  return `<svg viewBox="0 0 ${M.W} ${M.H}" aria-label="แผนที่">${lines}${cells}</svg>`;
}

function renderGame(){
  const S=G;const act=activeSeat(S);const mine=iControl(S,act);
  const myTurn=mine&&!S.battle&&!S.retreat&&S.status==='play';
  let clickable=[],selected=null;
  if(myTurn){
    if(ui.mode==='move-src'){S.B.forEach((c,i)=>{if(c.o===act&&c.t>0&&Object.keys(reachable(S,act,i,mountAt(S,i,act))).length)clickable.push(i)})}
    if(ui.mode==='move-dst'){clickable=Object.keys(ui.dest).map(Number);selected=ui.src}
    if(ui.mode==='move-cfg'){selected=ui.dst}
    if(ui.mode==='recruit'){clickable=recruitTargets(S,act)}
    if(ui.mode==='vajra'){clickable=vajraTargets(S,act)}
    if(ui.mode==='avatar-dst'){S.B.forEach((c,i)=>{if((c.o===act&&c.t>0||i===cityOf(act))&&!mountAt(S,i,act))clickable.push(i)})}
  }
  if(S.retreat&&mine&&S.status==='play'){clickable=S.retreat.opts;selected=S.retreat.from}
  const moonPill=`<span class="pill">${S.moon==='wax'?'◐ ข้างขึ้น: วัดได้บุญ +1':'◑ ข้างแรม: ฝ่ายบุก +1'}</span>`;
  app.innerHTML=topBar(S,`${isTut(GID)?'':`<button class="ghost small" id="copy">คัดลอกลิงก์ห้อง</button>`}<span class="pill tab">รอบ ${S.round}</span>${moonPill}<span class="pill tab">เป้า ${S.target}</span>`)+`
  <div class="stack">
  ${tutBox()}
  <div class="panel mapbox">${mapSVG(S,clickable,selected,(TUT&&GID==='tut'&&tutStep()&&tutStep().hl)||[])}</div>
  <div class="game">
    <div class="stack">${statusBox(S,act,mine)}${lastBattleBox(S)}${myTurn?shopBox(S,act):''}</div>
    <div class="stack">${playersBox(S,act)}<div class="panel"><h3>บันทึก</h3><ul class="log">${S.log.map(t=>`<li>${richLog(t)}</li>`).join('')}</ul></div>${rulesRef()}</div>
  </div></div>`;
  document.getElementById('back').onclick=showLobby;
  wireGame(S,act);wireTut();const cp=document.getElementById('copy');if(cp)cp.onclick=()=>copyText(linkFor(GID));
}
function statusBox(S,act,mine){
  if(S.status==='done'){return `<div class="banner"><h2>${esc(gname(S,S.winner))} ชนะ!</h2><p class="small">${total(S,S.winner)} คะแนน ในรอบที่ ${S.round}</p><button id="back2">กลับหน้ารวม</button></div>`}
  if(S.battle){const b=S.battle;
    const showAtk=S.openCards||S.solo;
    if(mine){return `<div class="banner warn"><h2>${esc(gname(S,b.a))} บุก${esc(cname(S,b.to))}!</h2><p class="small">ฝ่ายบุกมาด้วยทหาร ${b.n} ตัว${b.mount?' และ'+MOUNTS[b.mount].name:''} คุณตั้งรับด้วย ${S.B[b.to].t} ตัว เลือกการ์ดรบ</p>
      ${showAtk?`<p class="small"><b>ฝ่ายบุกลงการ์ด ${CARD[b.ac].n} (พลัง ${CARD[b.ac].s} ฆ่า ${CARD[b.ac].k})</b> (ห้องนี้เปิดการ์ด)</p>`:'<p class="small muted">ฝ่ายบุกลงการ์ดคว่ำไว้แล้ว จะเปิดพร้อมกันหลังคุณเลือก</p>'}
      <div class="cards" id="defcards">${availCards(S,b.d).map(c=>cardBtn(c,'data-dc',false)).join('')}</div>
      <p class="small muted" style="margin-top:6px">ฝ่ายรับมีโบนัส: ${defBonusText(S,b.d,b.to)}</p></div>`}
    const iAtk=iControl(S,b.a);
    return `<div class="banner">รอ${esc(gname(S,b.d))} (${esc(pname(S.seats[b.d].uid,'ผู้เล่น'))}) เลือกการ์ดตั้งรับ ที่${esc(cname(S,b.to))}
      ${iAtk?`<div class="small" style="margin-top:4px">คุณลงการ์ด <b>${CARD[b.ac].n} (พลัง ${CARD[b.ac].s} ฆ่า ${CARD[b.ac].k})</b> ไว้ · โบนัสบุก: ${esc(atkBonusText(S,b.a,b.mount,b.to,b.n))}</div>`:showAtk?`<div class="small" style="margin-top:4px">ฝ่ายบุกลงการ์ด <b>${CARD[b.ac].n}</b></div>`:''}</div>`}
  if(S.retreat){const rt=S.retreat;
    if(mine)return `<div class="banner"><h2>คุณชนะ! เลือกช่องให้${esc(gname(S,rt.loser))}ถอย</h2><p class="small">ทหารที่เหลือ ${rt.n} ตัว${rt.m?' และ'+MOUNTS[rt.m].name:''} จะถอยไป 1 ช่อง กดช่องวงประบนแผนที่</p></div>`;
    return `<div class="banner">รอ${esc(gname(S,rt.chooser))}เลือกช่องให้${esc(gname(S,rt.loser))}ถอย</div>`}
  const who=`<span class="dot" style="background:${SEATC(act)}"></span> ตาของ <b>${esc(gname(S,act))}</b> <span class="muted">(${esc(pname(S.seats[act].uid,'ผู้เล่น'))})</span>`;
  if(!mine)return `<div class="panel"><div class="row">${who}</div><p class="small muted">รอเขาเดิน หน้านี้อัปเดตเองเมื่อมีการเดิน</p></div>`;
  if(S.follow){const f=S.follow;
    return `<div class="panel stack"><div class="row">${who}</div><div class="banner">ทำต่อได้ก่อนจบตา</div>
    <div class="row">${f.vajra?`<button class="primary" id="f-vajra">ใช้วชิราวุธ</button>`:''}${f.bonusFrom!==null?`<button class="primary" id="f-bonus">เดินต่อ 1 ช่อง (ชัยต่อเนื่อง)</button>`:''}<button id="f-end">จบตา</button></div>
    ${modeBox(S,act)}</div>`}
  const p=S.P[act];
  const moveable=S.B.some((c,i)=>c.o===act&&c.t>0&&Object.keys(reachable(S,act,i,mountAt(S,i,act))).length);
  const canRecruit=reserve(S,act)>0&&recruitTargets(S,act).length;
  const btn=(a,sub,ok)=>`<button data-act="${a}" ${actionOK(S,act,a)&&ok&&tutAllow(a)?'':'disabled'}><b>${ACT[a]}</b><span>${sub}</span></button>`;
  return `<div class="panel stack"><div class="row">${who}</div>
   <div class="small muted tab">แอคชันที่ใช้แล้ว ${p.used.length}/${actionLimit(S,act)}${p.used.length?' · '+p.used.map(a=>ACT[a]).join(', '):''}</div>
   ${ui.mode?modeBox(S,act):`<div class="actions">
    ${btn('recruit',`+${Math.min(recruitAmt(S,act),reserve(S,act))} ตัว (คลังเหลือ ${reserve(S,act)})`,canRecruit)}
    ${btn('move','เลือกกองแล้วเลือกปลายทาง',moveable)}
    ${btn('merit',(has(S,act,'atone')?'บุญ +'+(has(S,act,'holy')?3:2)+' และลบบาป 1':'บุญ +'+(has(S,act,'holy')?3:2)+' หรือลบบาป 1'),true)}
    ${btn('buy','ซื้อการ์ดพลังหรือพาหนะ (รายการด้านล่าง)',true)}
   </div>`}
   ${isGod(S,act,'narai')&&!p.f.avatar&&mountsOf(S,act).length&&!ui.mode?`<button id="avatar">อวตาร: ย้ายพาหนะ (ฟรี รอบละครั้ง)</button>`:''}
  </div>`;
}
function lastBattleBox(S){
  const r=S.last;if(!r||S.battle||!r.kA)return '';
  const fmt=parts=>parts.map(([l,v])=>`${esc(l)} ${v>=0?'+':''}${v}`).join(' · ');
  const side=(s,parts,tot,kparts,lost,win,card)=>`<div style="min-width:0;flex:1 1 150px"><div class="row"><span class="dot" style="background:${SEATC(s)}"></span><b>${esc(gname(S,s))}</b>${win?' <span class="chip">ชนะ</span>':''}</div>
    <div class="small">${esc(CARD[card].n)} · พลังรวม <b class="tab">${tot}</b></div>
    <div class="small muted">${fmt(parts)}</div>
    <div class="small">ฆ่าฝ่ายตรงข้าม: ${fmt(kparts)} · <b>เสียไป ${lost} ตัว</b></div></div>`;
  const rt=r.retreat?`${esc(gname(S,r.retreat.s))}ถอยไป${esc(cname(S,r.retreat.to))}`:'ไม่มีการถอย';
  return `<details class="panel" open><summary>ศึกล่าสุด: ${esc(cname(S,r.cell))} (รอบ ${r.round})</summary>
   <div class="row" style="align-items:flex-start;margin-top:8px;gap:14px">${side(r.A,r.pA,r.sA,r.kA,r.lossA,r.aWin,r.ac)}<div class="muted" style="align-self:center">บุก → รับ</div>${side(r.D,r.pD,r.sD,r.kD,r.lossD,!r.aWin,r.dc)}</div>
   <p class="small muted" style="margin-top:6px">${r.aWin?'ฝ่ายบุกชนะ':'ฝ่ายรับชนะ'}${r.sA===r.sD?' (เสมอ ฝ่ายรับชนะ)':''} · ${rt}</p></details>`;
}
function defBonusText(S,s,cell){const t=[];const m=mountAt(S,cell,s);
  if(has(S,s,'armor'))t.push('เกราะเพชร +1');if(ctype(S,cell)==='temple'&&has(S,s,'wall'))t.push('กำแพงวัด +1');if(S.B[cell].t>=5&&has(S,s,'unity'))t.push('สามัคคี +1');if(has(S,s,'guardian'))t.push('ทวารบาล +2');
  if(isGod(S,s,'agni')&&m!=='rhino')t.push('เผาผลาญ −1');if(isGod(S,s,'varuna')&&ctype(S,cell)==='forest')t.push('ป่า +1');
  if(m==='erawan')t.push('เอราวัณ +2');if(m==='nonthi')t.push('โคนนทิ +1');if(m==='naga')t.push('นาค (รับความเสียหาย −1)');
  return t.length?t.join(', '):'ไม่มี';}
function modeBox(S,act){
  const cancel=`<button class="ghost" id="cancel">ยกเลิก</button>`;
  if(ui.mode==='move-src')return `<div class="banner row">เลือกกองที่จะเดิน (วงประ) ${cancel}</div>`;
  if(ui.mode==='move-dst')return `<div class="banner row">เลือกปลายทาง ช่องที่มีศัตรู = รบ ${cancel}</div>`;
  if(ui.mode==='recruit')return `<div class="banner row">เลือกช่องที่จะลงทหาร ${cancel}</div>`;
  if(ui.mode==='vajra')return `<div class="banner row">เลือกกองศัตรูที่จะฟาดวชิราวุธ ${cancel}</div>`;
  if(ui.mode==='avatar-pick')return `<div class="banner stack"><div>เลือกพาหนะที่จะย้าย</div><div class="row">${mountsOf(S,act).map(k=>`<button data-am="${k}">${MOUNTS[k].name}</button>`).join('')}${cancel}</div></div>`;
  if(ui.mode==='avatar-dst')return `<div class="banner row">เลือกกองของคุณที่จะให้${MOUNTS[ui.am].name}ไปอยู่ ${cancel}</div>`;
  if(ui.mode==='merit'){return `<div class="banner stack"><div>ทำบุญแบบไหน</div><div class="row"><button class="primary" data-mm="merit">บุญ +${has(S,act,'holy')?3:2}</button><button data-mm="sin" ${S.P[act].sin?'':'disabled'}>ลบบาป 1</button>${cancel}</div></div>`}
  if(ui.mode==='move-cfg'){
    const src=ui.src,dst=ui.dst,c=S.B[src];const battle=ui.dest[dst]==='battle';const mnt=mountAt(S,src,act);
    const isCity=src===cityOf(act);const maxN=c.t;
    const room=battle?99:(cap(S,act,dst)-(S.B[dst].o===act?S.B[dst].t:0));
    const nMax=Math.min(maxN,room,battle?(has(S,act,'fort')?6:5):99);
    if(ui.n==null||ui.n>nMax)ui.n=nMax;
    const dstM=mountAt(S,dst,act);
    const carryAllowed=mnt&&!(dstM&&!battle);
    const mustCarry=mnt&&!isCity&&ui.n===c.t;
    if(ui.carry==null)ui.carry=!!carryAllowed&&!isCity;
    if(mustCarry)ui.carry=true;
    if(!carryAllowed)ui.carry=false;
    return `<div class="banner stack"><div><b>${battle?'บุก':'เดินไป'}${esc(cname(S,dst))}</b>${battle?` · ศัตรู ${S.B[dst].t} ตัว (${esc(gname(S,S.B[dst].o))})`:''}</div>
      <div class="row">จำนวนทหาร <button id="nm" ${ui.n<=1?'disabled':''} aria-label="ลด">−</button><b class="tab">${ui.n}</b><button id="np" ${ui.n>=nMax?'disabled':''} aria-label="เพิ่ม">+</button><span class="small muted">สูงสุด ${nMax}</span></div>
      ${mnt?`<label class="row small"><input type="checkbox" id="carry" ${ui.carry?'checked':''} ${!carryAllowed||mustCarry?'disabled':''}> พา${MOUNTS[mnt].name}ไปด้วย${!carryAllowed?' (ปลายทางมีพาหนะแล้ว)':mustCarry?' (ต้องไปด้วย เพราะกองนี้ว่าง)':''}</label>`:''}
      ${battle?`<div>เลือกการ์ดรบ (ฝ่ายรับไม่เห็นจนกว่าจะเปิด)</div><div class="cards">${availCards(S,act).map(c=>cardBtn(c,'data-ac',ui.card===c)).join('')}</div>
      <div class="small muted">โบนัสบุกของคุณ: ${atkBonusText(S,act,ui.carry?mnt:null,dst,ui.n)}</div>`:''}
      <div class="row"><button class="primary" id="go" ${battle&&ui.card==null?'disabled':''}>${battle?'บุก':'เดิน'}</button>${cancel}</div></div>`;
  }
  return '';
}
function atkBonusText(S,s,m,cell,n){const t=[];
  if(has(S,s,'weapon'))t.push('ศาสตราวุธ +1');if(has(S,s,'divine'))t.push('อาวุธเทวะ +2');if(S.moon==='wane'){t.push('ข้างแรม +1');if(has(S,s,'banner'))t.push('ธงรบ +1')}
  if(isGod(S,s,'agni'))t.push('เผาผลาญ +1');if(m==='garuda')t.push('ครุฑ +1');if(m==='nonthi')t.push('โคนนทิ +1');if(m==='rhino')t.push('แรด +2');
  if(has(S,s,'vanguard')&&n>S.B[cell].t)t.push('ทัพหน้า: ศัตรูเสีย 1 ก่อนรบ');
  return t.length?t.join(', '):'ไม่มี';}
function playersBox(S,act){
  return `<div class="panel"><h3 style="margin-bottom:8px">ผู้เล่น</h3><div class="players">${S.order.map(s=>{const p=S.P[s];
    return `<div class="pl ${s===act?'turn':''}"><span class="dot" style="background:${SEATC(s)}"></span>
     <div><button class="godlink" ${infoAttr('god:'+godOf(S,s))}><b>${esc(gname(S,s))}</b></button> <span class="small muted">${esc(pname(S.seats[s].uid,'ผู้เล่น'))}</span></div>
     <div class="stats"><span title="คะแนนรวม">★ ${total(S,s)}</span><span title="บุญ">บุญ ${p.merit}</span><span title="บาป" style="color:${p.sin>=2?'var(--warn)':'inherit'}">บาป ${p.sin}/3</span></div>
     <div class="chips"><span class="chip tab">ถาวร ${p.vp} · วัด ${tempVP(S,s)}</span><span class="chip tab">การ์ดรบ ${availCards(S,s).map(c=>CARD[c].s+'/'+CARD[c].k).join(' ')}</span><span class="chip tab">คลัง ${reserve(S,s)}</span>
     ${mountsOf(S,s).map(k=>`<button class="chip info mount" ${infoAttr('mount:'+k)}>${MOUNTS[k].name}</button>`).join('')}${p.pw.map(id=>`<button class="chip info line-${PW[id].line}" ${infoAttr('pw:'+id)}>${PW[id].name}</button>`).join('')}</div></div>`}).join('')}</div>
     <p class="small muted" style="margin-top:6px">เรียงตามลำดับเล่นรอบนี้ · ${GOD[godOf(S,act)]?esc(GOD[godOf(S,act)].ab)+': '+esc(GOD[godOf(S,act)].txt):''}</p></div>`;
}
function shopBox(S,s){
  if(S.follow||S.battle)return '';
  const canBuy=actionOK(S,s,'buy');
  const lab={ok:'',mine:'ของคุณ',taken:'มีเจ้าของ',locked:'ต้องมีเลเวลก่อนหน้า',poor:'บุญไม่พอ',off:'ปิดในห้องนี้',todo:'ยังไม่เปิด'};
  const col=line=>`<div class="stack" style="gap:6px"><b>${LINES[line]}</b>${[1,2,3].map(lv=>POWERS.filter(p=>p.line===line&&p.lv===lv).map(p=>{const st=powerState(S,s,p.id);
    return `<button class="pw ${st==='ok'&&canBuy?'can':''} ${st==='mine'||st==='taken'?'owned':''}" data-buy="${p.id}" ${st==='ok'&&canBuy?'':'disabled'}><span class="nm"><span>${p.name}</span><span class="tab">L${p.lv} · ${priceOf(S,s,{pw:p.id})}</span></span><span class="tx">${esc(p.txt)}${lab[st]?' · '+lab[st]:''}</span></button>`}).join('')).join('')}</div>`;
  return `<details class="panel" ${ui.shop?'open':''} id="shopd"><summary>ขอพร: การ์ดพลังและพาหนะ (บุญคุณมี ${S.P[s].merit})</summary>
   <div class="stack" style="margin-top:10px">${canBuy?'':'<p class="small muted">รอบนี้ใช้แอคชันขอพรไปแล้ว</p>'}
   <div><b>พาหนะ</b><div class="shop" style="margin-top:6px">${MK.map(k=>{const st=mountState(S,s,k);const m=MOUNTS[k];const own=OWNER_GOD[k]===godOf(S,s);
     return `<button class="pw ${st==='ok'&&canBuy?'can':''} ${st==='mine'||st==='taken'?'owned':''}" data-mount="${k}" ${st==='ok'&&canBuy?'':'disabled'}><span class="nm"><span>${m.name}</span><span class="tab">${priceOf(S,s,{mount:k})}</span></span><span class="tx">${m.txt}${own?' · <b>ของคุณได้โบนัส</b>: '+m.bonus.split(': ')[1]:''}${lab[st]?' · '+lab[st]:''}</span></button>`}).join('')}</div></div>
   <div class="shop">${col('rit')}${col('kum')}${col('bun')}</div></div></details>`;
}

function wireGame(S,act){
  const $=id=>document.getElementById(id);
  const b2=$('back2');if(b2)b2.onclick=showLobby;
  const re=()=>render();
  const sd=$('shopd');if(sd)sd.ontoggle=()=>{ui.shop=sd.open};
  if($('cancel'))$('cancel').onclick=()=>{ui={mode:null,shop:ui.shop};re()};
  app.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{
    const a=b.dataset.act;
    if(a==='move'){ui={mode:'move-src',shop:ui.shop};re()}
    else if(a==='recruit'){const t=recruitTargets(S,act);if(t.length===1)doRecruit(t[0]);else{ui={mode:'recruit'};re()}}
    else if(a==='merit'){if(has(S,act,'atone')||S.P[act].sin===0)doMerit('merit');else{ui={mode:'merit'};re()}}
    else if(a==='buy'){ui.shop=true;re();const d=$('shopd');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}}
  });
  app.querySelectorAll('[data-mm]').forEach(b=>b.onclick=()=>doMerit(b.dataset.mm));
  app.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>doBuy({pw:b.dataset.buy}));
  app.querySelectorAll('[data-mount]').forEach(b=>b.onclick=()=>doBuy({mount:b.dataset.mount}));
  app.querySelectorAll('[data-dc]').forEach(b=>b.onclick=()=>doDefend(+b.dataset.dc));
  app.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>{ui.card=+b.dataset.ac;re()});
  if($('nm'))$('nm').onclick=()=>{ui.n--;re()};
  if($('np'))$('np').onclick=()=>{ui.n++;re()};
  if($('carry'))$('carry').onchange=e=>{ui.carry=e.target.checked;re()};
  if($('go'))$('go').onclick=doMove;
  if($('avatar'))$('avatar').onclick=()=>{ui={mode:'avatar-pick'};re()};
  app.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{ui={mode:'avatar-dst',am:b.dataset.am};re()});
  if($('f-end'))$('f-end').onclick=()=>mutate(GID,T=>{if(!T.follow||!iControl(T,T.follow.seat))return false;T.follow=null;advance(T)});
  if($('f-vajra'))$('f-vajra').onclick=()=>{ui={mode:'vajra'};re()};
  if($('f-bonus'))$('f-bonus').onclick=()=>{const src=S.follow.bonusFrom;const dest=reachable(S,act,src,mountAt(S,src,act),1);if(!Object.keys(dest).length){toast('ไม่มีช่องให้เดินต่อ');return}ui={mode:'move-dst',src,dest,bonus:true};re()};
  app.querySelectorAll('.cell.click').forEach(g=>{const h=()=>onCell(S,act,+g.dataset.cell);g.onclick=h;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();h()}}});
}
function onCell(S,act,i){
  if(S.retreat){doRetreat(i);return}
  if(ui.mode==='move-src'){const dest=reachable(S,act,i,mountAt(S,i,act));ui={mode:'move-dst',src:i,dest};render()}
  else if(ui.mode==='move-dst'){ui.mode='move-cfg';ui.dst=i;ui.n=null;ui.carry=null;ui.card=null;
    const m=mountAt(S,ui.src,act);if(m!=='garuda'&&!(has(S,act,'swift'))){} render()}
  else if(ui.mode==='recruit')doRecruit(i);
  else if(ui.mode==='vajra')doVajra(i);
  else if(ui.mode==='avatar-dst')doAvatar(ui.am,i);
}
const guard=(T,s)=>T.status==='play'&&!T.battle&&!T.retreat&&!T.follow&&T.order[T.pos]===s&&iControl(T,s);
function doRecruit(cell){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'recruit'))return false;if(!recruitTargets(T,s).includes(cell))return false;
    const room=cell===cityOf(s)?99:cap(T,s,cell)-(T.B[cell].o===s?T.B[cell].t:0);
    const n=Math.min(recruitAmt(T,s),reserve(T,s),room);if(n<=0)return false;
    placeTroops(T,s,cell,n);markAction(T,s,'recruit');log(T,`${gname(T,s)} เกณฑ์ทัพ ${n} ตัว ลง${cname(T,cell)}`);advance(T)})}
function doMerit(kind){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'merit'))return false;const p=T.P[s];const g=has(T,s,'holy')?3:2;
    if(has(T,s,'atone')){p.merit+=g;p.sin=Math.max(0,p.sin-1);log(T,`${gname(T,s)} ทำบุญ +${g} และไถ่บาป`)}
    else if(kind==='sin'&&p.sin>0){p.sin--;log(T,`${gname(T,s)} ทำบุญลบบาป 1`)}
    else{p.merit+=g;log(T,`${gname(T,s)} ทำบุญ +${g}`)}
    markAction(T,s,'merit');advance(T)})}
function doBuy(item){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'buy'))return false;const p=T.P[s];
    if(item.pw){if(powerState(T,s,item.pw)!=='ok')return false;const c=priceOf(T,s,item);p.merit-=c;p.pw.push(item.pw);
      if(['vpR','vpK','vpB'].includes(item.pw))p.vp+=1;log(T,`${gname(T,s)} ขอพรได้${PW[item.pw].name} (−${c} บุญ)`)}
    else{if(mountState(T,s,item.mount)!=='ok')return false;const c=priceOf(T,s,item);p.merit-=c;
      let cell=cityOf(s);if(mountAt(T,cell,s)){const alt=T.B.findIndex((x,i)=>x.o===s&&x.t>0&&!mountAt(T,i,s));if(alt>=0)cell=alt}
      T.M[item.mount]={o:s,c:cell};log(T,`${gname(T,s)} ได้${MOUNTS[item.mount].name}มาเป็นพาหนะ (−${c} บุญ)`)}
    markAction(T,s,'buy');advance(T)})}
function doMove(){
  const s=activeSeat(G);const {src,dst,n,card,bonus}=ui;const carry=ui.carry;ui={mode:null};
  mutate(GID,T=>{
    if(bonus){if(!T.follow||T.follow.seat!==s||T.follow.bonusFrom!==src||!iControl(T,s))return false}
    else{if(!guard(T,s)||!actionOK(T,s,'move'))return false}
    const c=T.B[src];if(c.o!==s||c.t<n||n<1)return false;
    const m=mountAt(T,src,s);const takeM=carry&&m?m:null;
    const dest=reachable(T,s,src,takeM,bonus?1:0);const kind=dest[dst];if(!kind)return false;
    if(!bonus)markAction(T,s,'move');
    const wasVajra=T.follow&&T.follow.vajra;
    T.follow=null;
    if(kind==='battle'){
      if(card==null||!availCards(T,s).includes(card))return false;
      removeTroops(T,src,n);if(takeM)T.M[takeM].c=-1;
      T.battle={a:s,d:T.B[dst].o,to:dst,from:src,n,mount:takeM,ac:card,bonusUsed:!!bonus,vajraPending:bonus?wasVajra:true};
      log(T,`${gname(T,s)} ยกทัพ ${n} ตัวบุก${cname(T,dst)} ของ${gname(T,T.B[dst].o)}`);
      if(!c.t&&m&&!takeM)sendMountsHome(T,src,s);
      return;
    }
    if(T.B[dst].o===s&&T.B[dst].t+n>cap(T,s,dst))return false;
    removeTroops(T,src,n);placeTroops(T,s,dst,n);if(takeM)T.M[takeM].c=dst;
    log(T,`${gname(T,s)} เดินทัพ ${n} ตัว ไป${cname(T,dst)}`);
    if(bonus){T.follow={seat:s,vajra:wasVajra,bonusFrom:null};if(!T.follow.vajra){T.follow=null;advance(T)}}
    else computeFollow(T,s,true,null);
  });
}
function doDefend(card){
  mutate(GID,T=>{const b=T.battle;if(!b||!iControl(T,b.d)||!availCards(T,b.d).includes(card))return false;resolveBattle(T,card)});
}
function doRetreat(cell){ui={mode:null};
  mutate(GID,T=>{const rt=T.retreat;if(!rt||!iControl(T,rt.chooser)||!rt.opts.includes(cell))return false;
    const o=T.B[cell];if(!(o.t===0||(o.o===rt.loser&&o.t+rt.n<=cap(T,rt.loser,cell)))&&cell!==cityOf(rt.loser))return false;
    T.retreat=null;doRetreatApply(T,rt.loser,cell,rt.n,rt.m,rt.from);postBattle(T,rt.post)});
}
function doVajra(cell){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!T.follow||T.follow.seat!==s||!T.follow.vajra||!iControl(T,s))return false;if(!vajraTargets(T,s).includes(cell))return false;
    const victim=T.B[cell].o;removeTroops(T,cell,1);T.P[s].f.vajra=true;log(T,`${gname(T,s)} ฟาดวชิราวุธ ${gname(T,victim)} เสีย 1 ตัวที่${cname(T,cell)}`);
    T.follow.vajra=false;if(T.follow.bonusFrom===null){T.follow=null;advance(T)}})}
function doAvatar(k,cell){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!isGod(T,s,'narai')||T.P[s].f.avatar)return false;if(!T.M[k]||T.M[k].o!==s)return false;
    if(!((T.B[cell].o===s&&T.B[cell].t>0)||cell===cityOf(s))||mountAt(T,cell,s))return false;
    T.M[k].c=cell;T.P[s].f.avatar=true;log(T,`${gname(T,s)} อวตาร ย้าย${MOUNTS[k].name}ไป${cname(T,cell)}`)})}

/* ===================== TUTORIAL ===================== */
let TUT=null;
const isTut=gid=>String(gid||'').startsWith('tut');
const TSTEPS=[
 {k:'info',t:'ยินดีต้อนรับสู่หิมพานต์',hl:[1,3,9,0],b:`คุณคือ <b>พระอินทร์</b> (เมืองของคุณอยู่บนสุด) คู่ฝึกคือบอท <b>พระพิรุณ</b> เป้าหมายคือได้ <b>8 คะแนน</b> ก่อนตอนจบรอบ<br>• ยึด <b>วัด</b> ได้ 1 คะแนน (เสียวัดก็เสียคะแนน)<br>• ยึด <b>เขาพระสุเมรุ</b> ตรงกลางได้ 2 คะแนน<br>• <b>บุกชนะ</b> ได้ 1 คะแนนถาวร ไม่มีวันหาย<br>วงประสีทองบนแผนที่คือจุดที่บทเรียนกำลังพูดถึง`},
 {k:'info',t:'หนึ่งรอบมี 3 แอคชัน',b:`ผู้เล่นผลัดกันทำคนละ 1 แอคชัน จนทุกคนทำครบ 3 แอคชันแล้วรอบจึงจบ แอคชันมี 4 อย่าง ใช้ได้อย่างละครั้งต่อรอบ จึงต้องเลือก 3 จาก 4<br>• <b>เกณฑ์ทัพ</b>: เพิ่มทหารในเมือง<br>• <b>เดินทัพ</b>: ย้ายทหาร 1 ช่อง เข้าช่องศัตรู = รบ<br>• <b>ทำบุญ</b>: ได้บุญ (เงินในเกม) หรือลบบาป<br>• <b>ขอพร</b>: ใช้บุญซื้อการ์ดพลังหรือพาหนะ`},
 {k:'do',t:'ลองเกณฑ์ทัพ',hl:[1],allow:['recruit'],b:`กดปุ่ม <b>เกณฑ์ทัพ</b> เพื่อเพิ่มทหาร 2 ตัวในเมืองของคุณ ทหารมีทั้งหมด 10 ตัว ตัวที่ยังไม่ลงสนามอยู่ใน "คลัง"`,done:S=>S.P[0].used.includes('recruit')},
 {k:'do',t:'ยึดวัดแรก',hl:[3],allow:['move'],b:`คุณมีกองหน้า 2 ตัวรออยู่ในป่าข้างเมือง และวัดที่ถัดไปยังว่าง กด <b>เดินทัพ</b> → กดป่าที่มีกองของคุณ → กดวัดที่มีวงประ แล้วกด <b>เดิน</b> ทหารเดินได้ทีละ 1 ช่อง เส้นทางไปเขาพระสุเมรุต้องผ่านป่าลึกวงใน<br><span class="muted">ถ้ามีปุ่ม "ใช้วชิราวุธ" ขึ้นมา กด <b>จบตา</b> ไปก่อน เดี๋ยวสอนทีหลัง</span>`,done:S=>S.B[3].o===0&&S.B[3].t>0&&!S.follow},
 {k:'do',t:'ทำบุญ',allow:['merit'],b:`คุณได้ 1 คะแนนจากวัดแล้ว ดูดาว ★ ในแถบผู้เล่น ต่อไปกด <b>ทำบุญ</b> รับบุญ +2 บุญเอาไว้ซื้อการ์ดพลัง`,done:S=>S.round>1||S.P[0].used.includes('merit')},
 {k:'info',t:'จบรอบ และดวงจันทร์',b:`เมื่อทุกคนทำครบ 3 แอคชัน รอบจะจบ<br>• ทุกคนได้บุญ +1<br>• รอบ <b>ข้างขึ้น</b> ได้บุญเพิ่ม +1 ต่อวัดที่ยึดอยู่<br>• จากนั้นดวงจันทร์สลับ รอบนี้เป็น <b>ข้างแรม</b>: ฝ่ายบุกได้พลังรบ +1 (ดูป้ายด้านบน)<br>• คนคะแนนน้อยสุดได้เล่นก่อนในรอบถัดไป`},
 {k:'do',t:'บุก!',hl:[10],allow:['move'],b:`บอทมีทหาร 2 ตัวในทุ่งข้างเมืองคุณ ลองบุก: กด <b>เดินทัพ</b> → เมืองของคุณ → ทุ่งที่มีวงประ → ส่งทหารให้มากที่สุด แล้ว<b>เลือกการ์ดรบ</b><br><b>พลังรบ</b> = ทหาร + พลังการ์ด + โบนัส ใครสูงกว่าชนะ (เสมอฝ่ายรับชนะ)<br><b>แต้มฆ่า</b> ของการ์ดคือจำนวนทหารที่อีกฝ่ายเสีย ทั้งสองฝ่ายเสียทหารเสมอ<br>คำแนะนำ: ลองเลือก <b>ตั้งมั่น (พลัง 3)</b> เพื่อให้ชนะชัวร์ (ระวัง พระพิรุณตั้งรับในป่าได้ +1)`,done:S=>!!(S.last&&S.last.A===0)},
 {k:'do',t:'วชิราวุธของพระอินทร์',allow:[],b:`ดูกล่อง <b>ศึกล่าสุด</b> ว่าพลังรบมาจากไหน ฝ่ายแพ้ที่เหลือรอดต้องถอยไป 1 ช่อง โดยฝ่ายชนะเป็นคนเลือกช่อง (ถ้ามีช่องเดียวระบบถอยให้เอง)<br>หลังเดินทัพ พระอินทร์ใช้ <b>วชิราวุธ</b> ได้รอบละครั้ง ทำให้กองศัตรูที่อยู่ติดกับกองคุณเสียทหาร 1 ตัวโดยไม่ต้องรบ ลองกด <b>ใช้วชิราวุธ</b> แล้วเลือกกองศัตรู หรือกด <b>จบตา</b>`,done:S=>!S.follow&&!S.battle&&!S.retreat},
 {k:'info',t:'บาป: ราคาของสงคราม',b:`บุกชนะได้คะแนนถาวร แต่ได้ <b>บาป +1</b> ด้วย (ดูในแถบผู้เล่น) ถ้าบาปถึง <b>3</b> จะเสียทหาร 2 ตัวทันที<br>บุกบ่อยได้คะแนนเร็ว แต่ต้องหาจังหวะทำบุญลบบาป นี่คือการตัดสินใจหลักของเกม`},
 {k:'do',t:'ขอพร',allow:['buy'],b:`เปิดรายการ <b>ขอพร</b> ด้านล่าง แล้วซื้อการ์ดพลังเลเวล 1 สักใบ (การ์ดที่มีขอบสีเขียวคือซื้อได้) การ์ดเลเวล 2 ต้องมีเลเวล 1 ในสายเดียวกันก่อน<br>หรือจะซื้อ <b>ช้างเอราวัณ</b> พาหนะประจำองค์ก็ได้ ถ้าบุญพอ`,done:S=>S.P[0].pw.length>0||mountsOf(S,0).length>0},
 {k:'do',t:'ลบบาป',allow:['merit'],b:`แอคชันสุดท้ายของรอบนี้ กด <b>ทำบุญ</b> แล้วเลือก <b>ลบบาป 1</b> ถ้ามีบาปอยู่`,done:S=>S.round>2||(S.round===2&&S.P[0].used.includes('merit'))},
 {k:'end',t:'พร้อมรบแล้ว!',b:`คุณรู้กติกาหลักครบแล้ว ยังมีอีกหลายอย่างให้ลองเอง: เทพแต่ละองค์มีพลังไม่เหมือนกัน พาหนะของเทพเจ้าของได้โบนัสเพิ่ม และ <b>ครุฑข่มนาค</b> ได้ +2<br>จะเล่นต่อกับบอทในห้องนี้ก็ได้ หรือกลับไปเปิดห้องจริงชวนเพื่อน`}
];
function tutState(){
  const S={v:1,created:Date.now(),host:ME,status:'lobby',solo:false,n:2,target:8,useL3:false,openCards:false,
    seats:[{uid:ME,god:'indra'},{uid:'bot',god:'varuna'}],log:[]};
  setupGame(S);S.seed=20261012;S.order=[0,1];S.pos=0;S.B[2]={o:0,t:2};S.B[10]={o:1,t:2};S.log=[];log(S,'บทเรียนเริ่ม · ข้างขึ้น');
  return S;
}
function startTutorial(){
  localGames.tut=tutState();TUT={i:0,snap:null,busy:false};openGame('tut');
}
function tutStep(){return TUT?TSTEPS[TUT.i]:null}
function tutAllow(a){if(!TUT||GID!=='tut')return true;const st=tutStep();if(!st||st.k==='end')return true;return (st.allow||[]).includes(a)}
function tutTick(S){
  if(!TUT||GID!=='tut'||!S)return;
  let moved=false;
  while(true){const st=tutStep();if(st&&st.k==='do'&&st.done(S)){TUT.i++;TUT.snap=null;moved=true}else break}
  const st=tutStep();if(st&&st.k==='do'&&!TUT.snap)TUT.snap=clone(S);
  if(moved)render();
  const a=activeSeat(S);
  if(a>=0&&S.seats[a].uid==='bot'&&!TUT.busy){TUT.busy=true;setTimeout(()=>{botAct();TUT&&(TUT.busy=false);if(G)tutTick(G)},900)}
}
function botAct(){
  mutate('tut',T=>{
    if(T.status!=='play')return false;
    if(T.battle){if(T.seats[T.battle.d].uid!=='bot')return false;const c=availCards(T,T.battle.d);resolveBattle(T,c.includes(3)?3:c[0]);return}
    if(T.retreat){if(T.seats[T.retreat.chooser].uid!=='bot')return false;const rt=T.retreat;T.retreat=null;doRetreatApply(T,rt.loser,rt.opts[0],rt.n,rt.m,rt.from);postBattle(T,rt.post);return}
    if(T.follow){if(T.seats[T.follow.seat].uid!=='bot')return false;T.follow=null;advance(T);return}
    const s=T.order[T.pos];if(T.seats[s].uid!=='bot')return false;
    if(actionOK(T,s,'merit')){T.P[s].merit+=2;markAction(T,s,'merit');log(T,`${gname(T,s)} ทำบุญ +2`)}
    else if(actionOK(T,s,'recruit')&&reserve(T,s)>0){const n=Math.min(recruitAmt(T,s),reserve(T,s));placeTroops(T,s,cityOf(s),n);markAction(T,s,'recruit');log(T,`${gname(T,s)} เกณฑ์ทัพ ${n} ตัว`)}
    else{markAction(T,s,actionOK(T,s,'buy')?'buy':'recruit');log(T,`${gname(T,s)} ผ่านตา`)}
    advance(T);
  });
}
function tutBox(){
  if(!TUT||GID!=='tut')return '';
  const st=tutStep();if(!st)return '';
  const n=TSTEPS.length;
  const btns=st.k==='info'?`<button class="primary" id="tut-next">ถัดไป</button>`
    :st.k==='do'?`<span class="small muted">ลองทำตามบนกระดานได้เลย</span><button class="ghost" id="tut-reset">เริ่มขั้นนี้ใหม่</button>`
    :`<button class="primary" id="tut-done">เล่นต่อกับบอท</button><button id="tut-lobby">เปิดห้องจริงชวนเพื่อน</button>`;
  return `<div class="panel tut stack" style="gap:8px"><div class="row" style="justify-content:space-between"><span class="pill tab">บทเรียน ${TUT.i+1}/${n}</span><button class="ghost small" id="tut-exit">ออกจากบทเรียน</button></div>
   <div class="tutbar" aria-hidden="true"><span style="width:${Math.round((TUT.i+1)/n*100)}%"></span></div>
   <h2>${st.t}</h2><div class="small">${st.b}</div><div class="row">${btns}</div></div>`;
}
function wireTut(){
  const $=id=>document.getElementById(id);
  if($('tut-next'))$('tut-next').onclick=()=>{TUT.i++;TUT.snap=null;tutTick(G);render()};
  if($('tut-reset'))$('tut-reset').onclick=()=>{if(TUT.snap){localGames.tut=clone(TUT.snap);ui={mode:null};fireLocal()}};
  if($('tut-exit'))$('tut-exit').onclick=()=>{TUT=null;showLobby()};
  if($('tut-lobby'))$('tut-lobby').onclick=()=>{TUT=null;showLobby()};
  if($('tut-done'))$('tut-done').onclick=()=>{TUT.i=TSTEPS.length;render()};
}


/* ===================== INFO POPUP ===================== */
function infoTip(spec){const [kind,id]=spec.split(':');
  if(kind==='pw')return PW[id]?PW[id].txt:'';
  if(kind==='mount')return MOUNTS[id]?MOUNTS[id].txt:'';
  if(kind==='god')return GOD[id]?GOD[id].ab+': '+GOD[id].txt:'';
  return ''}
const infoAttr=spec=>`data-info="${esc(spec)}" data-tip="${esc(infoTip(spec))}" aria-haspopup="dialog"`;
function ownerOf(kind,id){if(!G||!G.P)return null;
  if(kind==='pw'){for(let s=0;s<G.n;s++)if(G.P[s].pw.includes(id))return s}
  if(kind==='mount'&&G.M&&G.M[id])return G.M[id].o;
  if(kind==='god'){const s=G.seats.findIndex(x=>x.god===id);return s>=0?s:null}
  return null}
function infoHTML(spec){const [kind,id]=spec.split(':');const own=ownerOf(kind,id);
  const owner=own!=null&&G?`<p class="small">ของ <span class="dot" style="background:${SEATC(own)}"></span> <b>${esc(gname(G,own))}</b></p>`:'';
  if(kind==='pw'){const p=PW[id];if(!p)return '';
    return `<p class="small muted">${LINES[p.line]} · เลเวล ${p.lv} · ราคา ${COST[p.lv]} บุญ</p><h2>${esc(p.name)}</h2><p>${esc(PW_DETAIL[id]||p.txt)}</p>${owner}
      ${p.lv>1?`<p class="small muted">ซื้อได้เมื่อมีการ์ด${LINES[p.line]}เลเวล ${p.lv-1} อย่างน้อย 1 ใบ</p>`:''}`}
  if(kind==='mount'){const m=MOUNTS[id];if(!m)return '';const g=GOD[OWNER_GOD[id]];
    return `<p class="small muted">พาหนะ · ราคา ${m.cost} บุญ</p><h2>${esc(m.name)}</h2><p>${esc(m.txt)}</p>
      <p class="small"><b>โบนัสเมื่ออยู่กับ${esc(g.name)}</b> (เจ้าของในตำนาน): ${esc(m.bonus.split(': ')[1]||m.bonus)}</p>
      ${id==='garuda'||id==='naga'?'<p class="small">ครุฑข่มนาค: เมื่อกองที่มีครุฑรบกับกองที่มีนาค ฝ่ายครุฑได้ +2 และนาคใช้ความสามารถไม่ได้</p>':''}
      <p class="small muted">พาหนะอยู่กับกองทหาร 1 กอง ไม่นับเป็นทหาร และไม่ตาย ถ้ากองหมด พาหนะกลับเมือง</p>${owner}`}
  if(kind==='god'){const g=GOD[id];if(!g)return '';
    return `<p class="small muted">เทพ · พาหนะประจำองค์ ${MOUNTS[g.mount].name}</p><h2>${esc(g.name)}</h2><p><b>${esc(g.ab)}</b>: ${esc(g.txt)}</p><p class="small">จุดอ่อน / แนวเล่น: ${esc(g.weak)}</p>${owner}`}
  return ''}
let infoReturn=null;
function openInfo(spec,from){const pop=document.getElementById('pop');const h=infoHTML(spec);if(!pop||!h)return;
  infoReturn=from||null;
  pop.innerHTML=`<div class="popcard" role="document">${h}<div class="row" style="justify-content:flex-end"><button class="primary" id="popclose">ปิด</button></div></div>`;
  pop.hidden=false;document.getElementById('popclose').focus()}
function closeInfo(){const pop=document.getElementById('pop');if(!pop||pop.hidden)return;pop.hidden=true;pop.innerHTML='';if(infoReturn&&document.contains(infoReturn))infoReturn.focus();infoReturn=null}
document.addEventListener('click',e=>{
  const pop=document.getElementById('pop');
  if(pop&&!pop.hidden){if(e.target===pop||e.target.id==='popclose'){closeInfo()}return}
  const t=e.target.closest('[data-info]');if(t){e.preventDefault();openInfo(t.dataset.info,t)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeInfo()});
/* ทำชื่อพร พาหนะ และเทพในบันทึกให้กดดูรายละเอียดได้ */
const LOG_LINKS=(()=>{const arr=[...POWERS.map(p=>[p.name,'pw:'+p.id]),...MK.map(k=>[MOUNTS[k].name,'mount:'+k])];arr.sort((a,b)=>b[0].length-a[0].length);return arr})();
function richLog(t){let h=esc(t);const marks=[];
  LOG_LINKS.forEach(([nm,spec],i)=>{const e=esc(nm);if(h.includes(e)){h=h.split(e).join(`\u0001${i}\u0002`);marks[i]=`<button class="loglink" ${infoAttr(spec)}>${e}</button>`}});
  return h.replace(/\u0001(\d+)\u0002/g,(_,i)=>marks[+i]);}

/* ===================== BOOT ===================== */
function boot(){
  STORE=window.HMP_STORE;ME=STORE.me;LOCAL=!STORE.online;
  const h=(location.hash||'').match(/^#g-([A-Za-z0-9]+)$/);
  if(h&&!isTut(h[1]))openGame(h[1].toUpperCase());else showLobby();
}
window.addEventListener('hashchange',()=>{const h=(location.hash||'').match(/^#g-([A-Za-z0-9]+)$/);if(h&&h[1]!==GID&&!isTut(h[1]))openGame(h[1].toUpperCase())});
if(window.HMP_STORE)boot();else window.addEventListener('hmp-store-ready',boot,{once:true});
