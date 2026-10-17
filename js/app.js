/* ศึกเทพหิมพานต์ · หน้าจอและการเชื่อมต่อ (กติกาอยู่ใน rules.js) */
/* ===================== STORAGE ===================== */
let STORE=null,ME=null,LOCAL=true;
const localGames={};let localSubs=[];
function fireLocal(){localSubs.forEach(f=>f())}
async function createGame(data){return STORE.create(data)}
async function mutate(gid,fn){
  if(isTut(gid)){const S=clone(localGames[gid]);let res;try{res=fn(S)}catch(e){console.error(e);toast('เกิดข้อผิดพลาด: '+(e&&e.message||e));render();return false}if(res===false){render();return false}try{checkSavable(S)}catch(e){console.error(e);toast('ข้อมูลผิดรูปแบบ: '+e.message)}localGames[gid]=S;fireLocal();return true}
  let r;
  try{r=await STORE.mutate(gid,fn)}catch(e){console.error(e);r={ok:false,why:'error',detail:String(e&&e.message||e).slice(0,80)}}
  if(!r.ok)setTimeout(render,0);
  if(!r.ok&&r.why){toast(r.why==='missing'?'ไม่พบห้องนี้แล้ว':r.why==='denied'?'คุณไม่ได้อยู่ในห้องนี้ จึงเดินแทนไม่ได้':r.why==='offline'?'ต่ออินเทอร์เน็ตไม่ได้ ลองอีกครั้ง':'บันทึกไม่สำเร็จ ('+(r.detail||'ไม่ทราบสาเหตุ')+') ลองรีเฟรชแล้วทำใหม่ ถ้ายังไม่ได้ส่งภาพหน้าจอนี้มา')}
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
function activeSeat(S){if(S.status!=='play')return -1;if(S.battle)return S.battle.d;if(S.retreat)return S.retreat.chooser;if(S.disarm)return disarmBy(S.disarm);if(S.follow)return S.follow.seat;return S.order[S.pos]}
function viewers(S){return S.solo?[...Array(S.n).keys()]:mySeats(S)}
function iControl(S,s){return s>=0&&S.seats[s]&&S.seats[s].uid===ME}
function myName(){try{return localStorage.getItem('hmp-name')||''}catch(e){return ''}}
function setMyName(n){try{localStorage.setItem('hmp-name',n)}catch(e){}}
const cleanName=v=>String(v||'').replace(/\s+/g,' ').trim().slice(0,20);
const linkFor=id=>location.origin+location.pathname+'#g-'+id;
function copyText(t,msg){const done=()=>toast(msg||'คัดลอกลิงก์แล้ว ส่งให้เพื่อนได้เลย');
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,()=>toast('คัดลอกไม่ได้ กดค้างที่ลิงก์เพื่อคัดลอกเอง'))}else toast('กดค้างที่ลิงก์เพื่อคัดลอกเอง')}

/* ===================== RENDER: LOBBY ===================== */
let lobbyRows=[];
function clearPops(){['battlepop','turnpop','sky'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove()})}
function showLobby(){
  clearPops();
  try{document.title='ศึกเทพหิมพานต์'}catch(e){}
  TUT=null;
  view={name:'lobby'};GID=null;G=null;ui={mode:null};chatStop();
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
  const hid=hiddenRooms();const vis=lobbyRows.filter(r=>!hid.includes(r.id));
  const rows=vis.filter(r=>r.d&&r.d.status!=='done').slice(0,12);
  const done=vis.filter(r=>r.d&&r.d.status==='done').slice(0,5);
  const gameRow=r=>{const d=r.d;const filled=d.seats.filter(x=>x.uid).length;
    const st=d.status==='lobby'?`รอผู้เล่น ${filled}/${d.n}`:d.status==='draft'?'กำลังเลือกเทพ':d.status==='play'?`กำลังเล่น · รอบ ${d.round}`:'จบแล้ว';
    const myTurn=(d.status==='play'&&iControl(d,activeSeat(d)))||(d.status==='draft'&&iControl(d,d.draftOrder[d.draftPos]));
    return `<div class="lg"><div><span class="code">${esc(r.id)}</span> <span class="muted small">· ${d.n} คน${d.solo?' · ทดสอบคนเดียว':''} · เป้า ${d.target} คะแนน</span><div class="small ${myTurn?'':'muted'}">${myTurn?'<b>ถึงตาคุณแล้ว</b> · ':''}${st}</div></div>
    <div class="row"><button class="${myTurn?'primary':''}" data-open="${esc(r.id)}">${d.status==='done'?'ดูผล':'เข้าห้อง'}</button>${d.host===ME?`<button class="ghost small" data-del="${esc(r.id)}">ลบ</button>`:`<button class="ghost small" data-hide="${esc(r.id)}" title="ซ่อนจากรายการในเครื่องนี้">ซ่อน</button>`}</div></div>`};
  app.innerHTML=`
  <div class="hero">
    <div><div class="herotitle">${EMBLEM}<h1>ศึกเทพหิมพานต์</h1></div>
      <p>เทพไทย 2–7 องค์ ชิงวัดและเขาพระสุเมรุ เกมเดินแบบผลัดตา ใครว่างก็เข้ามาเดินตาของตัวเอง ไม่ต้องออนไลน์พร้อมกัน</p>
      <p><button class="primary" id="learn">เรียนวิธีเล่น (ประมาณ 5 นาที)</button></p>
      ${modeNote()}
    </div>
    <div class="panel stack">
      <label class="form"><span class="small">ชื่อในเกมของคุณ</span><input id="nick" maxlength="20" placeholder="เช่น มิล" value="${esc(myName())}" autocomplete="nickname"></label>
      ${idBox()}
      <form class="row" id="joinf"><input id="jcode" maxlength="6" placeholder="รหัสห้อง 6 ตัว" style="text-transform:uppercase;flex:1 1 140px" aria-label="รหัสห้อง" autocomplete="off"><button type="submit">เข้าห้อง</button></form>
      <details ${rows.length?'':'open'}><summary>เปิดห้องใหม่</summary>
      <form class="form" id="newf" style="margin-top:10px">
        <label>จำนวนผู้เล่น<select id="nf-n">${[2,3,4,5,6,7].map(n=>`<option value="${n}"${n===2?' selected':''}>${n} คน</option>`).join('')}</select></label>
        <label>คะแนนที่ต้องได้<select id="nf-t"><option value="6">6 (เกมสั้น)</option><option value="8" selected>8</option><option value="10">10 (เกมยาว)</option></select></label>
        <label>แผนที่<select id="nf-map"><option value="random" selected>สุ่ม (${MAPS.length} แบบ)</option>${MAPS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></label>
        <fieldset class="linepick"><legend>สายการ์ดที่ใช้</legend><div class="row">${LINE_ORDER.map(l=>`<label class="row lchip line-${l}"><input type="checkbox" name="nf-line" value="${l}" ${defaultLines(2).includes(l)?'checked':''}> ${LINES[l]}</label>`).join('')}</div><p class="small muted" id="nf-supply"></p></fieldset>
        <label class="row"><input type="checkbox" id="nf-l3" checked> ใช้การ์ดเลเวล 3 ด้วย</label>
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
  /* ตั้งค่าสายการ์ดตามจำนวนคน จนกว่าเจ้าของห้องจะเลือกเอง และบอกว่าการ์ดพอไหม */
  {const nSel=document.getElementById('nf-n'),l3=document.getElementById('nf-l3'),boxes=[...document.querySelectorAll('[name=nf-line]')];let touchedL=false,touched3=false;
   const upd=()=>{const n=+nSel.value;if(!touchedL)boxes.forEach(b=>b.checked=defaultLines(n).includes(b.value));if(!touched3)l3.checked=true;
     const ls=boxes.filter(b=>b.checked).map(b=>b.value);const c=cardCount(ls,l3.checked);document.getElementById('nf-supply').innerHTML=supplyNote(n,c,ls.length)};
   nSel.onchange=upd;boxes.forEach(b=>b.onchange=()=>{touchedL=true;if(!boxes.some(x=>x.checked))b.checked=true;upd()});l3.onchange=()=>{touched3=true;upd()};upd()}
  document.getElementById('newf').onsubmit=async e=>{e.preventDefault();
    const n=+document.getElementById('nf-n').value,target=+document.getElementById('nf-t').value,useL3=document.getElementById('nf-l3').checked,solo=document.getElementById('nf-solo').checked;
    const nm=cleanName(nick.value);setMyName(nm);
    const seats=[...Array(n)].map(()=>({uid:null,god:null,name:''}));
    if(solo){const gs=GODS.map(g=>g.k).sort(()=>Math.random()-.5);seats.forEach((x,i)=>{x.uid=ME;x.god=gs[i];x.name=nm})}
    const openCards=document.getElementById('nf-open').checked;
    const mapPick=document.getElementById('nf-map').value;
    const lines=[...document.querySelectorAll('[name=nf-line]:checked')].map(b=>b.value);
    const data={v:1,created:Date.now(),host:ME,status:'lobby',solo,n,target,useL3,lines,openCards,mapPick,seats,log:[]};
    try{const id=await createGame(data);openGame(id)}catch(err){toast('เปิดห้องไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง')}
  };
  app.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openGame(b.dataset.open));
  app.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(!confirmTwice(b))return;b.disabled=true;
    try{await STORE.del(b.dataset.del);lobbyRows=lobbyRows.filter(r=>r.id!==b.dataset.del);toast('ลบห้องแล้ว');render()}catch(e){toast('ลบไม่สำเร็จ');b.disabled=false}});
  app.querySelectorAll('[data-hide]').forEach(b=>b.onclick=()=>{const h=hiddenRooms();h.push(b.dataset.hide);try{localStorage.setItem('hmp-hidden',JSON.stringify(h.slice(-100)))}catch(e){}toast('ซ่อนแล้ว (ลบจริงได้เฉพาะเจ้าของห้อง)');render()});
  document.getElementById('learn').onclick=startTutorial;
  wireId();
}
/* ตัวตนผู้เล่น: ปกติจำไว้ในเบราว์เซอร์ ผูก Google ได้เพื่อใช้ตัวตนเดิมข้ามเครื่อง */
function idBox(){
  if(!STORE.online)return '';
  if(STORE.google)return `<div class="small idbox">✓ ตัวตนของคุณผูกกับ Google แล้ว (${esc(STORE.google)}) เปลี่ยนเครื่องก็กด "ใช้ Google ที่ผูกไว้" ที่หน้าแรกของเครื่องใหม่ แล้วเล่นต่อได้เลย</div>`;
  return `<div class="small idbox"><b>เน็ตหลุดไม่เป็นไร</b> เว็บจำคุณไว้ในเบราว์เซอร์นี้ กลับมาเปิดลิงก์เดิมก็เล่นต่อได้ ถ้าอยากเล่นต่อจาก<b>เครื่องอื่น</b>ด้วย (เช่น คอมกับ iPad) ให้ผูก Google ไว้ก่อน
    <div class="row" style="margin-top:6px"><button id="glink">ผูกกับ Google</button><button class="ghost" id="glink2">ใช้ Google ที่ผูกไว้ (เครื่องใหม่)</button></div></div>`}
function wireId(){
  const go=async()=>{try{const r=await STORE.linkGoogle();
      if(r==='switched'){toast('กลับมาเป็นตัวตนเดิมแล้ว กำลังโหลดใหม่');setTimeout(()=>location.reload(),900)}else{toast('ผูกกับ Google แล้ว');render()}}
    catch(e){const c=e&&e.code;toast(c==='auth/operation-not-allowed'?'ยังไม่ได้เปิดการเข้าสู่ระบบด้วย Google ใน Firebase (ดู README ขั้นที่ 6)':c==='auth/popup-blocked'?'เบราว์เซอร์บล็อกหน้าต่าง ลองกดอีกครั้ง':c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request'?'ยกเลิกแล้ว':'ผูกไม่สำเร็จ: '+(c||e))}};
  ['glink','glink2'].forEach(id=>{const b=document.getElementById(id);if(b)b.onclick=go});
}
function hiddenRooms(){try{return JSON.parse(localStorage.getItem('hmp-hidden')||'[]')}catch(e){return []}}
function rulesRef(){return `<details class="panel" style="margin-top:20px"><summary>สรุปกติกาแบบย่อ</summary>
<div class="stack small" style="margin-top:10px">
<p>แต่ละรอบ ผู้เล่นผลัดกันทำคนละ 1 แอคชัน รวม 3 แอคชันต่อคน แอคชันเดียวกันใช้ได้ครั้งเดียวต่อรอบ: เกณฑ์ทัพ (ได้ 2 ตัว จ่ายบุญตัวละ 1 บุญ), เดินทัพ, ทำบุญ, ขอพร (ซื้อการ์ดพลังหรือพาหนะ)</p>
<p>เดินเข้าช่องศัตรู = รบ ทั้งสองฝ่ายลงการ์ดคว่ำแล้วเปิดพร้อมกัน พลังรบ = ทหาร + พลังการ์ด + โบนัส พลังสูงกว่าชนะ เสมอฝ่ายรับชนะ ทั้งสองฝ่ายเสียทหารตามแต้มฆ่าในการ์ดของอีกฝ่าย ฝ่ายแพ้ที่เหลือรอดถอย 1 ช่อง ฝ่ายชนะเป็นคนเลือก บุกชนะและยังเหลือทหารได้ 1 คะแนนถาวรและบาป +1 บาปถึง 3 เสียทหาร 2 ตัว</p>
<table class="ref"><tr><th>การ์ดรบ</th><th>พลัง</th><th>ฆ่า</th></tr>${CARD.map((c,i)=>`<tr><td>${c.n}${i===4?' (ตำราพิชัยสงคราม)':''}</td><td>${c.s}</td><td>${c.k}</td></tr>`).join('')}</table>
<p><b>พื้นที่มีหน้าที่</b>: 🌳 ป่า ตั้งรับ +1 · 🌾 ทุ่ง บุกออกจากทุ่ง +1 · 🌲 ป่าลึก เดินไปป่าลึกช่องไหนก็ได้ (ห้ามบุก) และคนอื่นไม่เห็นจำนวนทหาร · 💧 ริมน้ำ จบรอบได้การ์ดรบที่ใช้แล้วคืน 1 ใบ</p>
<p><b>เทพ 4 สาย</b>: ⚔ สงคราม · 🙏 บุญบารมี · 🌀 มายา · 🛡 ผู้พิทักษ์ · <b>การ์ดพลัง 4 สาย</b>: แดง ฤทธิ์ · น้ำเงิน คุ้มกัน · เหลือง บุญ · ม่วง มายา (เทเลพอร์ต พิษ ซ่อนข้อมูล)</p>
<p>วัดมีจำนวนเท่าผู้เล่น +1 (รวมวัดหลวงข้างเขาพระสุเมรุ) ยึดวัดได้ 1 คะแนนชั่วคราว เขาพระสุเมรุ 2 คะแนน <b>ครองแดน</b>: จบรอบ<b>กลางคืน</b> ยึดวัด 2 แห่งขึ้นไปหรือเขาพระสุเมรุ ได้ +1 คะแนนถาวร กลางวันได้บุญ +1 ต่อวัด กลางคืนฝ่ายบุก +1 <b>การชนะ</b>: ใครถึงคะแนนเป้าตอน<b>จบรอบกลางคืน</b> จะกลายเป็น <b>ผู้ท้าชิง</b> (ขึ้นเตือนทุกคน) แล้วต้อง<b>รักษาคะแนนให้ถึงเป้าต่ออีก 1 วัน</b> (ผ่านกลางวันและกลางคืนถัดไป) ถ้าจบกลางคืนถัดไปยังถึงเป้าอยู่ = ชนะ (นับคะแนน<b>ก่อน</b>ได้ครองแดนจบรอบ ตามตัวเลขที่ทุกคนเห็นบนจอ) ถ้าหลุดก็เล่นต่อจนกว่าจะมีคนรักษาไว้ได้ (ผู้ท้าชิงหลายคนรักษาได้พร้อมกัน คะแนนมากสุดชนะ)</p>
<table class="ref"><tr><th>เทพ</th><th>ความสามารถ</th><th>พาหนะประจำองค์</th></tr>${GODS.map(g=>`<tr><td>${g.name}</td><td><b>${g.ab}</b>: ${g.txt} · ${g.weak}</td><td>${MOUNTS[g.mount].name}</td></tr>`).join('')}</table>
<p class="muted">ฝ่ายบุกเห็นการ์ดของตัวเองระหว่างรอ หลังรบทุกคนเห็นการ์ดทั้งสองฝ่ายและที่มาของพลังรบในกล่อง "ศึกล่าสุด" ห้องที่ติ๊ก "เปิดการ์ด" ฝ่ายรับจะเห็นการ์ดฝ่ายบุกก่อนเลือกด้วย</p>
</div></details>`}

/* ===================== RENDER: GAME ===================== */
function openGame(id){
  clearPops();
  GID=id;view={name:'game'};ui={mode:null};G=null;chatStart(id);
  try{history.replaceState(null,'','#g-'+id)}catch(e){}
  try{localStorage.setItem('hmp-last',id)}catch(e){}
  watchGame(id,S=>{
    if(!S){G=null;render();return}
    const firstCb=!G;const prevS=G;const prevTurn=G?activeSeat(G):null;const prevKey=G&&G.status==='play'?turnKey(G):null;G=S;
    if(prevTurn!==activeSeat(S))ui={mode:null};
    noteNames(S);render();chatDraw();if(!firstCb)boardFx(prevS,S);tutTick(S);battleShow(S,firstCb);checkPhase(S);endShow(S);
    if(S.status==='play'&&turnKey(S)!==prevKey)turnPopup(S,prevKey===null);
  });
  render();
}
function render(){
  try{renderInner()}catch(e){console.error(e);app.innerHTML=`<div class="panel stack"><h2>หน้านี้แสดงไม่ได้</h2><p class="small">เกิดข้อผิดพลาด: ${esc(e&&e.message||e)} ส่งภาพหน้าจอนี้มาได้</p><div class="row"><button id="back">กลับหน้ารวม</button><button class="ghost" id="rl">รีเฟรช</button></div></div>`;
    document.getElementById('back').onclick=showLobby;document.getElementById('rl').onclick=()=>location.reload()}
}
/* ปุ่มลบแบบกดสองครั้ง: ครั้งแรกเปลี่ยนเป็น "กดอีกครั้งเพื่อยืนยัน" */
function confirmTwice(b){if(b.dataset.armed)return true;b.dataset.armed='1';const t=b.textContent;b.textContent='กดอีกครั้งเพื่อยืนยันลบ';b.classList.add('danger');setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent=t;b.classList.remove('danger')}},4000);return false}
function renderInner(){
  if(view.name==='lobby')return renderLobby();
  if(!G){app.innerHTML=`<p class="muted">กำลังโหลดเกม… <button class="ghost" id="back">กลับหน้ารวม</button></p>`;document.getElementById('back').onclick=showLobby;return}
  if(G.status==='lobby'||G.status==='draft')return renderSeating();
  if(!isTut(GID)&&G.B&&G.B.length!==SECT*G.n+2){app.innerHTML=`<div class="panel stack"><h2>ห้องนี้ใช้แผนที่รุ่นเก่า</h2><p class="small">แผนที่ถูกปรับใหม่ (ผู้เล่นละ 6 ช่อง) ห้องที่เริ่มเล่นก่อนอัปเดตเปิดต่อไม่ได้ เปิดห้องใหม่ได้เลย${G.host===ME?' หรือลบห้องนี้ทิ้ง':''}</p><div class="row"><button class="primary" id="back">กลับหน้ารวม</button>${G.host===ME?'<button class="ghost" id="delold">ลบห้องนี้</button>':''}</div></div>`;
    document.getElementById('back').onclick=showLobby;const d=document.getElementById('delold');if(d)d.onclick=async()=>{try{await STORE.del(GID)}catch(e){}showLobby()};return}
  renderGame();
}
function topBar(S,extra){
  return `<div class="top"><div class="row"><button class="ghost" id="back">← ห้องทั้งหมด</button><h1>ศึกเทพหิมพานต์</h1><button class="ghost small" id="snd" aria-pressed="${sndOn()}" title="เปิด/ปิดเสียง">${sndOn()?'🔊 เสียง':'🔇 ปิดเสียง'}</button></div>
  <div class="meta"><span class="pill tab">${isTut(GID)?'บทเรียน':'ห้อง '+esc(GID)}</span>${extra||''}</div></div>`}
/* แผนที่ของห้องนี้ ให้ทุกคนเห็นก่อนเลือกเทพ */
function draftMapBox(S,isHost){
  if(!S.map)return '';const P=previewState(S);const M=mapOf(P);const c=terrCount(P);
  const order=['temple','forest','deep','plain','water'];
  const homes=t=>MK.filter(k=>MOUNTS[k].home===t).map(k=>mPic(k)).join('');
  return `<div class="panel stack"><div class="row" style="justify-content:space-between"><h2>แผนที่: ${esc(M.name)}</h2>${isHost&&S.draftPos===0&&(!S.mapPick||S.mapPick==='random')?`<button class="ghost small" id="remap">สุ่มแผนที่ใหม่</button>`:''}</div>
    <p class="small">${esc(M.desc)} · วงสีคือเมืองของแต่ละที่นั่ง ดูก่อนเลือกเทพได้เลย</p>
    <div class="row small">${order.filter(t=>c[t]).map(t=>`<span class="chip">${TNAME[t]} ${c[t]} ช่อง ${homes(t)}</span>`).join('')}<span class="chip">วัดหลวง ${c.royal||0} ${homes('royal')}</span><span class="chip">เขาพระสุเมรุ 1 ${homes('sumeru')}</span></div>
    <div class="mapbox">${mapSVG(P,[],null,[])}</div></div>`}
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
      <div>${x.god?`<button class="godlink" ${infoAttr('god:'+x.god)}>${godPic(x.god,'av')}<b>${GOD[x.god].name}</b></button>`:`<span class="muted">${draft?(now?'กำลังเลือก…':'รอเลือก'):''}</span>`}</div></div>`};
  const order=draft?S.draftOrder:S.seats.map((_,i)=>i);
  let body='';
  if(!draft){
    body=`<div class="panel stack"><h2>ขั้นที่ 1 · เข้านั่ง</h2>
      <p class="small">รหัสห้อง <span class="code">${esc(GID)}</span> ส่งลิงก์ให้เพื่อน ทุกคนเข้านั่งให้ครบ ${S.n} ที่ แล้วเจ้าของห้องกดเริ่มเลือกเทพ ระบบจะเปิดแผนที่ให้ทุกคนเห็น (${S.mapPick&&MAPBY[S.mapPick]?esc(MAPBY[S.mapPick].name):'สุ่ม'}) และสุ่มว่าใครได้เลือกก่อน</p>
      <div class="share"><code id="slink">${esc(linkFor(GID))}</code><button id="copy">คัดลอกลิงก์</button></div>
      <div class="seats">${order.map(seatCard).join('')}</div>
      ${linesBox(S,isHost)}
      ${seated?`<p><button class="ghost" id="leave">ลุกจากที่นั่ง</button></p>`:full?'<p class="muted">ห้องเต็มแล้ว</p>':`<div class="row"><label class="form" style="flex:1 1 220px"><span class="small">ชื่อในเกมของคุณ</span><input id="nick2" maxlength="20" placeholder="เช่น มิล" value="${esc(myName())}"></label><button class="primary" id="sit" style="align-self:flex-end">เข้านั่ง</button></div>`}
      </div>
      <div class="row">${isHost&&S.solo?`<button class="primary" id="startsolo">เริ่มเกม (สุ่มเทพให้)</button><button class="ghost" id="del">ลบห้องนี้</button>`:isHost?`<button class="primary" id="startdraft" ${full?'':'disabled'}>เริ่มเลือกเทพ</button><span class="small muted">${full?'ครบแล้ว':'รอให้ครบทุกที่นั่ง'}</span><button class="ghost" id="del">ลบห้องนี้</button>`:'<span class="muted">รอเจ้าของห้องกดเริ่มเลือกเทพ</span>'}</div>`;
  }else{
    body=`<div class="panel stack"><h2>ขั้นที่ 2 · เลือกเทพตามลำดับ</h2>
      <p class="small">${myPick?'<b>ถึงตาคุณเลือกแล้ว</b> เลือกเทพที่ยังว่างด้านล่าง':`รอ <b>${esc(who(picker))}</b> เลือก`} · คนที่เลือกทีหลังสุดจะได้เดินก่อนในรอบแรก</p>
      <div class="seats">${order.map(seatCard).join('')}</div></div>
      ${draftMapBox(S,isHost)}
      <div class="panel"><h3>เทพ</h3><div class="gods" style="margin-top:10px">${GODS.map(g=>{const t=taken.has(g.k);const owner=S.seats.findIndex(x=>x.god===g.k);
        return `<button class="god ${t?'taken':''} ${!t&&myPick?'canpick':''}" data-god="${g.k}" aria-label="ดูการ์ด${g.name}${t?' (ถูกเลือกแล้ว)':''}"><span class="godart">${godPic(g.k,'banner')}<span class="godname"><b>${g.name}</b>${g.arch?`<span class="archtag">${archIc(g.arch)} ${ARCH[g.arch].n}</span>`:''}</span>${t?`<span class="godtaken">${esc(who(owner))}</span>`:''}</span><div class="small"><b>${g.ab}</b>: ${g.txt}</div><div class="small muted">จุดอ่อน: ${g.weak} · พาหนะ ${MOUNTS[g.mount].ic} ${MOUNTS[g.mount].name}</div></button>`}).join('')}</div></div>
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
    T.seats.forEach(x=>x.god=null);T.map=pickMap(T);T.seed=Math.floor(Math.random()*1e9);T.draftOrder=[...Array(T.n).keys()].sort(()=>Math.random()-.5);T.draftPos=0;T.status='draft'});
  if($('remap'))$('remap').onclick=()=>mutate(GID,T=>{if(T.status!=='draft'||T.host!==ME||T.draftPos>0)return false;const cur=T.map;let m=cur;if(!T.mapPick||T.mapPick==='random'){const others=MAPS.filter(x=>x.id!==cur);m=others[Math.floor(Math.random()*others.length)].id}T.map=m;T.seed=Math.floor(Math.random()*1e9)});
  app.querySelectorAll('[data-god]').forEach(b=>b.onclick=e=>{e.stopPropagation();openGodPick(b.dataset.god,b)});
  app.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>mutate(GID,T=>{if(T.status!=='lobby'||T.host!==ME)return false;const cur=activeLines(T);const l=b.dataset.line;
    const nx=cur.includes(l)?cur.filter(x=>x!==l):[...cur,l];if(nx.length<1){toast('ต้องเหลืออย่างน้อย 1 สาย');return false}T.lines=LINE_ORDER.filter(x=>nx.includes(x))}));
  app.querySelectorAll('[data-l3]').forEach(b=>b.onclick=()=>mutate(GID,T=>{if(T.status!=='lobby'||T.host!==ME)return false;T.useL3=!T.useL3}));
  wireSeatingDel();
}
function linesBox(S,isHost){const act=activeLines(S);const c=cardCount(act,S.useL3);
  return `<div class="linepick"><div class="small"><b>สายการ์ดที่ใช้</b>${isHost?' (กดเพื่อเปิด/ปิด ก่อนเริ่มเกม)':''}</div>
    <div class="row">${LINE_ORDER.map(l=>isHost?`<button class="lchip line-${l} ${act.includes(l)?'on':''}" data-line="${l}" aria-pressed="${act.includes(l)}">${act.includes(l)?'✓ ':''}${LINES[l]}</button>`:act.includes(l)?`<span class="lchip line-${l} on">${LINES[l]}</span>`:'').join('')}
    ${isHost?`<button class="lchip ${S.useL3?'on':''}" data-l3="1" aria-pressed="${!!S.useL3}">${S.useL3?'✓ ':''}เลเวล 3</button>`:S.useL3?'<span class="lchip on">มีเลเวล 3</span>':'<span class="lchip">ไม่มีเลเวล 3</span>'}</div>
    <p class="small muted">${supplyNote(S.n,c,act.length)}</p></div>`}
function pickGod(k){
    mutate(GID,T=>{if(T.status!=='draft')return false;const s=T.draftOrder[T.draftPos];if(!iControl(T,s))return false;if(T.seats.some(x=>x.god===k))return false;
      T.seats[s].god=k;T.draftPos++;
      if(T.draftPos>=T.n){const picks=T.draftOrder.map(i=>T.seats[i].god);const order=[...T.draftOrder].reverse();setupGame(T);T.order=order;T.pos=0;
        log(T,`เลือกเทพเสร็จ: ${picks.map(g=>GOD[g].name).join(' → ')} · ${GOD[T.seats[order[0]].god].name}ได้เดินก่อน`)}})}
function wireSeatingDel(){const $=id=>document.getElementById(id);
  if($('del'))$('del').onclick=()=>{$('confirm').innerHTML=`<div class="banner warn row">ลบห้องนี้ถาวร? <button id="del2">ลบ</button><button class="ghost" id="del3">ยกเลิก</button></div>`;
    $('del3').onclick=()=>render();
    $('del2').onclick=async()=>{try{await STORE.del(GID)}catch(e){toast('ลบไม่สำเร็จ')}showLobby()}};
}

function mrng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const LAYOUT_CACHE={};
function mapLayout(S){
  const key=S.n+':'+(S.seed||1)+':'+(hasRoyal(S)?1:0)+':'+(S.map||'');if(LAYOUT_CACHE[key])return LAYOUT_CACHE[key];
  const n=S.n,rnd=mrng((S.seed||1)^0x9e3779b9),W=1000,H=800,cx=500,cy=400,Rx=430,Ry=325;
  const span=Math.PI*2/n;
  // ตำแหน่งตามบล็อก k: [รัศมี, ระยะมุมในบล็อก]
  /* ตำแหน่งตามช่อง k ในบล็อก: [รัศมี, ระยะมุมในบล็อก] */
  const K=[[1.00,0.50],[0.90,0.20],[0.90,0.80],[0.70,0.50],[0.50,0.16],[0.42,0.80]];
  const roy=hasRoyal(S);const pos=[{x:roy?cx-60:cx,y:cy}];
  for(let s=0;s<n;s++)for(let k=0;k<SECT;k++){
    const [r0,o]=K[k];const r=r0*(1+(rnd()-.5)*0.08);const a=-Math.PI/2+s*span+o*span+(rnd()-.5)*span*0.05;
    pos.push({x:cx+Rx*r*Math.cos(a),y:cy+Ry*r*Math.sin(a)});
  }
  if(roy)pos.push({x:cx+100,y:cy+18});
  // ความโค้งของเส้นทาง สุ่มคงที่ต่อห้อง
  const ring=Math.PI*(Rx+Ry)/(4*n);
  const r=Math.max(22,Math.min(40,ring*0.30));
  /* ดันช่องที่อยู่ชิดกันเกินไปให้ห่างออก (ไม่ขยับเขาพระสุเมรุ) */
  {const minD=r*2.6;for(let it=0;it<80;it++){let moved=false;
    for(let i=1;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){const a=pos[i],b=pos[j];let dx=b.x-a.x,dy=b.y-a.y;const d=Math.hypot(dx,dy)||0.01;
      const need=(j===0||i===0)?r*3.2:minD;if(d<need){const push=(need-d)/2;dx/=d;dy/=d;a.x-=dx*push;a.y-=dy*push;b.x+=dx*push;b.y+=dy*push;moved=true}}
    for(let i=1;i<pos.length;i++){const p=pos[i];const d0=Math.hypot(p.x-pos[0].x,p.y-pos[0].y);if(d0<r*3.4){const k=r*3.4/d0;p.x=pos[0].x+(p.x-pos[0].x)*k;p.y=pos[0].y+(p.y-pos[0].y)*k}
      p.x=Math.max(r+6,Math.min(W-r-6,p.x));p.y=Math.max(r+6,Math.min(H-r-6,p.y))}
    if(!moved)break}}
  /* เลือกความโค้งของเส้นทางให้ไม่ผ่านใกล้ช่องอื่น และไม่ทับเส้นอื่น จะได้ไม่งงว่าเส้นไปช่องไหน */
  const rad=i=>i===0?r*1.7:r;const bend={};const drawn=[];
  const qpts=(a,b,bd)=>{const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,qx=mx-dy*bd,qy=my+dx*bd;const out=[];
    for(let k=1;k<20;k++){const t=k/20,u=1-t;out.push({x:u*u*a.x+2*u*t*qx+t*t*b.x,y:u*u*a.y+2*u*t*qy+t*t*b.y})}return out};
  const edges=[];for(let i=0;i<pos.length;i++)for(const j of adj(S,i))if(j>i)edges.push([i,j]);
  const toC=(i,j)=>i===0||j===0||isRoyal(S,i)||isRoyal(S,j);
  edges.sort((e1,e2)=>toC(...e1)-toC(...e2));
  for(const [i,j] of edges){const a=pos[i],b=pos[j];const pref=(rnd()-.5)*0.3;
    let best=null,bestScore=-1e9;
    for(const bd of [pref,0,0.18,-0.18,0.32,-0.32,0.48,-0.48]){
      const pts=qpts(a,b,bd);let clear=1e9;
      for(let k=0;k<pos.length;k++){if(k===i||k===j)continue;const c=pos[k];for(const p of pts){const d=Math.hypot(p.x-c.x,p.y-c.y)-rad(k);if(d<clear)clear=d}}
      let near=0;for(const q of drawn){for(let m=0;m<pts.length;m+=3)for(let n2=0;n2<q.length;n2+=3){if(Math.hypot(pts[m].x-q[n2].x,pts[m].y-q[n2].y)<10)near++}}
      const score=Math.min(clear,18)*3-near*4-Math.abs(bd)*10;
      if(score>bestScore){bestScore=score;best=bd}
    }
    bend[i+'-'+j]=best;if(!toC(i,j))drawn.push(qpts(a,b,best));
  }
  return LAYOUT_CACHE[key]={W,H,cx,cy,pos,bend,r};
}
function showArrows(){try{return localStorage.getItem('hmp-arrows')!=='0'}catch(e){return true}}
/* ลูกศรการเคลื่อนไหว: ศึกที่รอฝ่ายรับ + การกระทำล่าสุด 6 อย่าง (1 = ล่าสุด) */
function arrowsSVG(S,M){
  const rad=i=>i===0?M.r*1.7:M.r;let out='';
  /* ลูกศรตามเส้นทางจริง: วิ่งตามเส้นบนแผนที่ผ่านทุกช่องที่เดินผ่าน */
  const ctrl=(u,v)=>{const i=Math.min(u,v),j=Math.max(u,v),A=M.pos[i],B=M.pos[j],bd=(M.bend[i+'-'+j]||0);const dx=B.x-A.x,dy=B.y-A.y;return {x:(A.x+B.x)/2-dy*bd,y:(A.y+B.y)/2+dx*bd}};
  const qat=(P0,Q,P1,t)=>{const u=1-t;return {x:u*u*P0.x+2*u*t*Q.x+t*t*P1.x,y:u*u*P0.y+2*u*t*Q.y+t*t*P1.y}};
  const arrow=(path,col,op,w,dash,label,cls)=>{
    path=(path||[]).filter(i=>M.pos[i]);if(path.length<2)return '';
    const segs=[];for(let k=0;k<path.length-1;k++){const u=path[k],v=path[k+1];segs.push({P0:{...M.pos[u]},Q:ctrl(u,v),P1:{...M.pos[v]},u,v})}
    const f=segs[0],l=segs[segs.length-1];
    {const dx=f.Q.x-f.P0.x,dy=f.Q.y-f.P0.y,L=Math.hypot(dx,dy)||1,k=(rad(f.u)+4)/L;f.P0={x:f.P0.x+dx*k,y:f.P0.y+dy*k}}
    let tip;{const dx=l.P1.x-l.Q.x,dy=l.P1.y-l.Q.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L;tip={x:l.P1.x-ux*(rad(l.v)+6),y:l.P1.y-uy*(rad(l.v)+6),ux,uy};l.P1={x:tip.x-ux*14,y:tip.y-uy*14}}
    let d=`M${f.P0.x.toFixed(1)} ${f.P0.y.toFixed(1)}`;for(const g of segs)d+=`Q${g.Q.x.toFixed(1)} ${g.Q.y.toFixed(1)} ${g.P1.x.toFixed(1)} ${g.P1.y.toFixed(1)}`;
    const px=-tip.uy*9,py=tip.ux*9,hx=tip.x-tip.ux*16,hy=tip.y-tip.uy*16;
    const lp=qat(l.P0,l.Q,l.P1,.5);
    const via=path.slice(1,-1).map(i=>`<circle cx="${M.pos[i].x}" cy="${M.pos[i].y}" r="${rad(i)+3}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="3 4"/>`).join('');
    return `<g class="arw ${cls||''}" opacity="${op}">${via}<path d="${d}" fill="none" stroke="var(--surface)" stroke-width="${w+5}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''}/>
      <polygon points="${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${(hx+px).toFixed(1)},${(hy+py).toFixed(1)} ${(hx-px).toFixed(1)},${(hy-py).toFixed(1)}" fill="${col}" stroke="var(--surface)" stroke-width="1.5"/>
      ${label?`<g><circle cx="${lp.x.toFixed(1)}" cy="${lp.y.toFixed(1)}" r="13" fill="${col}" stroke="var(--surface)" stroke-width="2"/><text x="${lp.x.toFixed(1)}" y="${(lp.y+5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Anuphan,sans-serif">${label}</text></g>`:''}</g>`};
  const tr=(S.trail||[]).slice().reverse();const N=tr.length;
  tr.forEach((x,j)=>{const idx=N-j;const op=idx===1?1:Math.max(.3,1-idx*.15);const col=SEATC(x.s);
    if(x.k==='rec'){const p=M.pos[x.t];if(p)out+=`<g opacity="${op}"><circle cx="${p.x-rad(x.t)*0.8}" cy="${p.y+rad(x.t)*0.8}" r="13" fill="${col}" stroke="var(--surface)" stroke-width="2"/><text x="${p.x-rad(x.t)*0.8}" y="${p.y+rad(x.t)*0.8+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="Anuphan,sans-serif">+${hidesAll(S,x.s)&&!viewers(S).includes(x.s)?'?':x.n}</text></g>`;return}
    if(x.k==='vaj'){const p=M.pos[x.t];if(p)out+=`<g opacity="${op}"><text x="${p.x+rad(x.t)*0.85}" y="${p.y+rad(x.t)*0.95}" text-anchor="middle" font-size="22">⚡</text></g>`;return}
    if(x.f==null)return;
    if(S.battle&&x.k==='atk'&&idx===1)return;
    out+=arrow(x.p&&x.p.length>1?x.p:[x.f,x.t],col,op,x.k==='atk'?6:4,x.k==='ret'?'7 6':'',x.k==='atk'?'⚔':String(idx));
  });
  if(S.battle){const b=S.battle;out+=arrow(b.path&&b.path.length>1?b.path:[b.from,b.to],SEATC(b.a),1,7,'','⚔','live');
    const p=M.pos[b.to],r=rad(b.to);
    out+=`<g class="atkbadge"><circle cx="${p.x}" cy="${p.y}" r="${r+7}" fill="none" stroke="${SEATC(b.a)}" stroke-width="4" class="pulse"/>
      <rect x="${p.x-34}" y="${p.y+r-4}" width="68" height="26" rx="13" fill="${SEATC(b.a)}" stroke="var(--surface)" stroke-width="2"/>
      <text x="${p.x}" y="${p.y+r+14}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="Anuphan,sans-serif">⚔ ${b.n}${mList([b.mount,b.mount2]).map(k=>' '+MOUNTS[k].ic).join('')}</text></g>`}
  return out;
}
/* หน้าที่ของแต่ละพื้นที่ */
/* ไอคอนภาพ: img/icons/<ชื่อ>.webp ถ้ายังไม่มีไฟล์ จะแสดงอีโมจิเดิมแทน */
const ICON_EMO={'arch-war':'⚔','arch-bun':'🙏','arch-maya':'🌀','arch-guard':'🛡','t-forest':'🌳','t-plain':'🌾','t-deep':'🌲','t-water':'💧','t-temple':'🛕','a-recruit':'🪖','a-move':'👣','a-merit':'🪷','a-buy':'✨'};
function ico(name,cls){const e=ICON_EMO[name]||'';if(typeof ICON_HAVE!=='undefined'&&!ICON_HAVE.has(name))return e;return `<img class="gi ${cls||''}" src="img/icons/${name}.webp" alt="" aria-hidden="true" onerror="this.replaceWith(document.createTextNode('${e}'))">`}
const archIc=a=>ico('arch-'+a);
const TERR_ROLE=[['forest','🌳','ป่า','ตั้งรับ +1'],['plain','🌾','ทุ่ง','บุกออกจากทุ่ง +1'],['deep','🌲','ป่าลึก','เดินไปป่าลึกไหนก็ได้ · คนอื่นไม่เห็นจำนวน'],['water','💧','ริมน้ำ','จบรอบได้การ์ดรบคืน 1 ใบ'],['temple','🛕','วัด','+1 คะแนน · กลางวันได้บุญ']];
function terrLegend(){return `<div class="terrleg small">${TERR_ROLE.map(([k,ic,n,d])=>`<span><span class="tsw t-${k}"></span>${ico('t-'+k)} <b>${n}</b> ${d}</span>`).join('')}</div>`}
function trailText(S,x){const g=gname(S,x.s);const route=()=>x.p&&x.p.length>2?x.p.map(i=>cname(S,i)).join(' → '):`${cname(S,x.f)} → ${cname(S,x.t)}`;
  if(x.k==='rec')return `${g} เกณฑ์ทัพ +${hidesAll(S,x.s)&&!viewers(S).includes(x.s)?'?':x.n} ที่${cname(S,x.t)}`;
  if(x.k==='vaj')return `${g} ฟาดวชิราวุธที่${cname(S,x.t)}`;
  if(x.k==='ret')return `${g} ถอย ${x.n} ตัว ${cname(S,x.f)} → ${cname(S,x.t)}`;
  if(x.k==='atk')return `${g} บุก ${x.n} ตัว${x.m?' พร้อม'+MOUNTS[x.m].name:''} ${route()}${x.w==null?' · รอฝ่ายรับ':x.w?' · ชนะ':' · แพ้'}`;
  const hn=!viewers(S).includes(x.s)&&(countHidden(S,x.t,viewers(S))||hidesAll(S,x.s)||terr(S,x.t)==='deep');
  return `${g} เดิน ${hn?'?':x.n} ตัว${x.m?' พร้อม'+MOUNTS[x.m].name:''} ${route()}`}
function trailBox(S){const tr=S.trail||[];if(!tr.length&&!S.battle)return '';const on=showArrows();
  return `<div class="trailbox small"><div class="row" style="justify-content:space-between"><b>ความเคลื่อนไหวล่าสุด</b><label class="row small"><input type="checkbox" id="arrows" ${on?'checked':''}> แสดงลูกศรบนแผนที่</label></div>
    <ol>${tr.map((x,i)=>`<li><span class="ordno sm" style="background:${SEATC(x.s)}">${x.k==='atk'?'⚔':x.k==='rec'?'+':x.k==='vaj'?'⚡':i+1}</span>${esc(trailText(S,x))}${x.r!==S.round?` <span class="muted">(รอบ ${x.r})</span>`:''}</li>`).join('')}</ol></div>`}
/* ลายเส้นจิตรกรรมฝาผนังจางๆ ในช่อง บอกชนิดพื้นที่ (วาดในกรอบ -1..1 แล้วย่อตามขนาดช่อง) */
const GLYPH={
 temple:'M-.55 .5 L.55 .5 M-.48 .5 L-.48 .05 M.48 .5 L.48 .05 M-.7 .1 L0 -.35 L.7 .1 M-.52 -.12 L0 -.55 L.52 -.12 M0 -.55 L0 -.8',
 royal:'M-.55 .5 L.55 .5 M-.48 .5 L-.48 .05 M.48 .5 L.48 .05 M-.7 .1 L0 -.35 L.7 .1 M-.52 -.12 L0 -.55 L.52 -.12 M-.34 -.34 L0 -.7 L.34 -.34 M0 -.7 L0 -.92',
 sumeru:'M-.85 .55 L-.4 -.15 L-.15 .2 L.1 -.6 L.45 .05 L.6 -.15 L.9 .55 Z M.1 -.6 L.02 -.35 L.18 -.38',
 forest:'M-.45 .55 L-.45 .2 M-.45 .2 m-.28 0 a.28 .32 0 1 1 .56 0 a.28 .32 0 1 1 -.56 0 M.35 .55 L.35 .1 M.35 .1 m-.32 0 a.32 .38 0 1 1 .64 0 a.32 .38 0 1 1 -.64 0',
 deep:'M-.6 .55 L-.35 -.1 L-.1 .55 Z M-.2 .55 L.1 -.35 L.4 .55 Z M.2 .55 L.5 -.05 L.78 .55 Z',
 water:'M-.75 -.05 q.19 -.18 .375 0 t.375 0 t.375 0 t.375 0 M-.75 .3 q.19 -.18 .375 0 t.375 0 t.375 0 t.375 0',
 plain:'M-.6 .45 l.1 -.35 M-.5 .45 l0 -.42 M-.4 .45 l-.1 -.35 M.25 .45 l.1 -.35 M.35 .45 l0 -.42 M.45 .45 l-.1 -.35',
 city:'M-.5 .55 L.5 .55 M-.4 .55 L-.4 .1 L.4 .1 L.4 .55 M-.28 .1 L-.28 -.15 L.28 -.15 L.28 .1 M-.16 -.15 L-.16 -.4 L.16 -.4 L.16 -.15 M0 -.4 L0 -.8'};
function glyph(t,x,y,r){const d=GLYPH[t];if(!d)return '';const k=r*0.62;
  return `<path class="glyph" d="${d}" transform="translate(${x} ${y+r*0.05}) scale(${k})" fill="${t==='sumeru'?'#9A6A1222':'none'}" stroke="#6B4E26" stroke-opacity=".32" stroke-width="${(1.6/k).toFixed(3)}" stroke-linecap="round" stroke-linejoin="round"/>`}
/* ตราเกม: เขาพระสุเมรุกลางวงแหวนจักรวาล ล้อมด้วยเมืองของเทพ */
const EMBLEM=(()=>{const n=7,R=40;let dots='';for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;dots+=`<circle cx="${(50+R*Math.cos(a)).toFixed(1)}" cy="${(50+R*Math.sin(a)).toFixed(1)}" r="5" fill="var(--s${i})" stroke="#DDB259" stroke-width="1.2"/>`}
  return `<svg class="emblem" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="#DDB259" stroke-width="1"/><circle cx="50" cy="50" r="40" fill="none" stroke="#DDB259" stroke-width=".6" stroke-dasharray="2 3"/><circle cx="50" cy="50" r="27" fill="#24393C" stroke="#8FC3C6" stroke-width="1"/><path d="M33 62 L42 44 L47 52 L52 34 L60 50 L64 45 L71 62 Z" fill="#DDB259"/><path d="M52 34 L50.5 41 L54 40" fill="none" stroke="#1E0F0C" stroke-width="1"/>${dots}</svg>`})();
function mapSVG(S,clickable,selected,hl){hl=hl||[];
  const M=mapLayout(S),n=L(S);
  let lines='';
  for(let i=0;i<S.B.length;i++)for(const j of adj(S,i)){if(j<i)continue;const a=M.pos[i],b=M.pos[j];
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,bd=M.bend[i+'-'+j]||0;
    const qx=mx-dy*bd,qy=my+dx*bd;const toC=i===0||j===0||isRoyal(S,i)||isRoyal(S,j);
    lines+=`<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="var(--line)" stroke-width="${toC?2:3}" stroke-linecap="round" ${toC?'stroke-dasharray="3 7"':''}/>`}
  // ทะเลสีทันดร: แถบน้ำวงในผ่านช่องริมน้ำทุกช่อง
  const wpts=[];for(let s=0;s<S.n;s++){const k=mapOf(S).types.indexOf('water');if(k>=3)wpts.push(M.pos[1+SECT*s+k])}
  let river='';if(wpts.length>1){const cxm=M.pos[0].x,pts=wpts.map((p,i)=>p);
    const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
    let d=`M${mid(pts.at(-1),pts[0]).x.toFixed(1)} ${mid(pts.at(-1),pts[0]).y.toFixed(1)}`;
    for(let i=0;i<pts.length;i++){const m=mid(pts[i],pts[(i+1)%pts.length]);d+=`Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`}
    river=`<path d="${d}Z" fill="none" stroke="var(--water)" stroke-width="${(M.r*1.5).toFixed(0)}" stroke-linejoin="round" opacity=".9"/><path d="${d}Z" fill="none" stroke="var(--waterline)" stroke-width="1.5" stroke-dasharray="2 10" opacity=".8"/>`}
  lines=river+lines;
  let cells='';
  for(let i=0;i<S.B.length;i++){
    const p=M.pos[i],t=ctype(S,i),c=S.B[i];const rr=i===0?M.r*1.7:M.r;
    const fill=t==='sumeru'?'var(--goldtint)':t==='temple'?'var(--temple)':terr(S,i)==='deep'?'var(--deep)':t==='forest'?'var(--forest)':t==='plain'?'var(--plain)':t==='water'?'var(--water)':'var(--surface)';
    const oc=c.t>0&&c.o>=0?SEATC(c.o):(t==='city'?SEATC(citySeat(i)):'var(--line)');
    const tt=terr(S,i);const cs=tt==='city'?S.seats[citySeat(i)]:null;const lab=tt==='city'?(cs.god?GOD[cs.god].name.replace(/^(พระแม่|พระ|ท้าว)/,''):(cs.name||'ที่นั่ง '+(citySeat(i)+1))):TNAME[tt];
    const ms=MK.filter(k=>S.M[k]&&S.M[k].c===i);
    const cls=['cell',clickable.includes(i)?'click':'',selected===i?'sel':''].join(' ');
    const fs=Math.max(12,Math.min(15,rr*0.36));const hid=countHidden(S,i,viewers(S));
    cells+=`<g class="${cls}" data-cell="${i}" role="${clickable.includes(i)?'button':'img'}" tabindex="${clickable.includes(i)?0:-1}" aria-label="${esc(cname(S,i))} ${c.t>0?'ทหาร '+(hid?'?':c.t):''}">
      ${hl.includes(i)?`<circle class="hlring" cx="${p.x}" cy="${p.y}" r="${rr+9}" fill="none" stroke="var(--gold)" stroke-width="3" stroke-dasharray="5 5"/>`:''}
      <circle class="ring" cx="${p.x}" cy="${p.y}" r="${rr}" fill="${fill}" stroke="${oc}" stroke-width="${c.t>0||t==='city'?3.5:1.5}"/>
      ${c.t>0||tt==='city'?'':glyph(tt,p.x,p.y,rr)}
      <text x="${p.x}" y="${p.y-rr*0.3}" text-anchor="middle" font-size="${fs}" fill="var(--muted)" font-family="Anuphan,sans-serif">${esc(lab)}</text>
      ${c.t>0?`<text x="${p.x}" y="${p.y+rr*0.4}" text-anchor="middle" font-size="${Math.max(17,rr*0.66)}" font-weight="700" fill="${SEATC(c.o)}" font-family="Anuphan,sans-serif">${hid?'?':c.t}</text>`:''}
      ${ms.map((k,j)=>{const mx=p.x+rr*0.8-j*22,my=p.y-rr*0.82;return `<g class="mtok"><circle cx="${mx}" cy="${my}" r="14" fill="var(--surface)" stroke="${SEATC(S.M[k].o)}" stroke-width="3"/>${MOUNT_ART.has(k)?(()=>{const [fx,fy]=MOUNT_FOCUS[k]||[.5,.3];const R2=12.5,W=R2*2*2.1,H=W*IMG_R;return `<clipPath id="mc-${k}"><circle cx="${mx}" cy="${my}" r="${R2}"/></clipPath><image href="img/mounts/${k}.webp" x="${(mx-fx*W).toFixed(1)}" y="${(my-fy*H).toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" clip-path="url(#mc-${k})" preserveAspectRatio="none"/><circle cx="${mx}" cy="${my}" r="14" fill="none" stroke="${SEATC(S.M[k].o)}" stroke-width="3"/>`})():`<text x="${mx}" y="${my+6}" text-anchor="middle" font-size="16">${MOUNTS[k].ic}</text>`}<title>${MOUNTS[k].name} ของ${GOD[godOf(S,S.M[k].o)].name}</title></g>`}).join('')}
      ${i===0?`<text x="${p.x}" y="${p.y+rr*0.55}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="Anuphan,sans-serif">2 คะแนน</text>`:''}
    </g>`;
  }
  return `<svg viewBox="0 0 ${M.W} ${M.H}" aria-label="แผนที่">${lines}${cells}${showArrows()?arrowsSVG(S,M):''}</svg>`;
}

const mapInfoAttr=S=>`data-info="map:${esc(mapOf(S).id)}" data-tip="${esc(mapOf(S).desc)}" aria-haspopup="dialog"`;
/* ป๊อปอัปเปลี่ยนตา: ทุกคนเห็นว่าตอนนี้ตาใคร คนที่ถึงตาเห็นแบบเด่นชัด */
const turnKey=S=>activeSeat(S)+'|'+(S.battle?'b':S.retreat?'r':S.disarm?'x':'n');
function turnWhat(S,a){
  if(S.battle)return {me:'คุณโดนบุก! เลือกการ์ดตั้งรับ',other:`กำลังเลือกการ์ดตั้งรับ (โดน${gname(S,S.battle.a)}บุก${cname(S,S.battle.to)})`};
  if(S.retreat){const rt=S.retreat;if(rt.chooser===rt.loser)return {me:'คุณแพ้ แต่เลือกช่องถอยเองได้ (ถอยทัพ)',other:'กำลังเลือกช่องถอย'};return {me:`คุณชนะ! เลือกช่องให้${gname(S,rt.loser)}ถอย`,other:`กำลังเลือกช่องให้${gname(S,rt.loser)}ถอย`}}
  if(S.disarm){const d=S.disarm;if(disarmBy(d)===d.s)return {me:'โดนริบอาวุธ! เลือกการ์ดรบที่จะทิ้ง 1 ใบ',other:'กำลังเลือกการ์ดรบที่จะทิ้ง (โดนริบอาวุธ)'};return {me:`พิษกระจาย! เลือกการ์ดรบของ${gname(S,d.s)}ให้ทิ้ง 1 ใบ`,other:`กำลังเลือกการ์ดรบของ${gname(S,d.s)}ให้ทิ้ง (พิษกระจาย)`}}
  const p=S.P[a];return {me:`ถึงตาคุณแล้ว · แอคชันที่ ${p.used.length+1} จาก ${actionLimit(S,a)}`,other:`กำลังเดิน · แอคชันที่ ${p.used.length+1} จาก ${actionLimit(S,a)}`};
}
let turnTimer=null;
/* ===================== เอฟเฟกต์และเสียง ===================== */
const reduceMotion=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const sndOn=()=>{try{return localStorage.getItem('hmp-snd')!=='0'}catch(e){return true}};
let AC=null;document.addEventListener('pointerdown',()=>{if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}else if(AC.state==='suspended')AC.resume()},{capture:true});
/* เสียงสังเคราะห์ ไม่ต้องโหลดไฟล์: tone(ความถี่, เวลาเริ่ม, ยาว, ชนิดคลื่น, ความดัง) */
function sfx(kind){if(!sndOn()||!AC)return;const t0=AC.currentTime;
  const tone=(f,at,dur,type,vol,f2)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0+at);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+at+dur);
    g.gain.setValueAtTime(0.0001,t0+at);g.gain.exponentialRampToValueAtTime(vol||0.2,t0+at+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t0+at+dur);o.connect(g).connect(AC.destination);o.start(t0+at);o.stop(t0+at+dur+0.05)};
  const noise=(at,dur,vol)=>{const n=AC.sampleRate*dur,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=900;src.buffer=b;g.gain.value=vol||0.3;src.connect(f).connect(g).connect(AC.destination);src.start(t0+at)};
  if(kind==='turn'){tone(880,0,0.5,'sine',0.18);tone(1320,0.12,0.6,'sine',0.12)}            // ระฆังเล็ก: ถึงตาคุณ
  else if(kind==='step'){tone(160,0,0.12,'triangle',0.15,110)}                                // ฝีเท้า: มีคนเดินทัพ
  else if(kind==='battle'){noise(0,0.25,0.35);tone(110,0,0.4,'square',0.08,70);tone(220,0.18,0.35,'sawtooth',0.05,150)} // กลองศึก
  else if(kind==='gong'){tone(196,0,1.8,'sine',0.22,190);tone(392,0,1.2,'sine',0.08);tone(293,0.02,1.4,'triangle',0.05)} // ฆ้อง: เปลี่ยนรอบ
  else if(kind==='chat'){tone(660,0,0.12,'sine',0.12);tone(990,0.08,0.16,'sine',0.09)}
  else if(kind==='win'){[523,659,784,1047].forEach((f,i)=>tone(f,i*0.12,0.5,'triangle',0.14))}}
/* หลังสถานะเปลี่ยน: ตัวเลขที่เปลี่ยนเด้ง และหมากวิ่งตามทางของการเดินล่าสุด */
function boardFx(prev,S){if(!prev||!prev.B||!S.B||prev.B.length!==S.B.length)return;
  const svg=document.querySelector('.mapbox svg');if(!svg)return;
  for(let i=0;i<S.B.length;i++){const a=prev.B[i],b=S.B[i];if((a.t!==b.t||a.o!==b.o)&&!countHidden(S,i,viewers(S))){const g=svg.querySelector(`.cell[data-cell="${i}"]`);if(g)g.classList.add('cellpop')}}
  const t=S.trail&&S.trail[0],t0=prev.trail&&prev.trail[0];
  if(!t||(t0&&t0.q===t.q))return;
  if(t.k==='atk')sfx('battle');else if(t.k==='move'||t.k==='ret')sfx('step');
  const path=t.p||(t.k==='ret'?[t.f,t.t]:null);if(reduceMotion()||!path||path.length<2)return;
  const M=mapLayout(S);const pts=path.map(i=>M.pos[i]).filter(Boolean);if(pts.length<2)return;
  const ns='http://www.w3.org/2000/svg';const tok=document.createElementNS(ns,'g');tok.setAttribute('class','walker');
  tok.innerHTML=`<circle r="${(M.r*0.5).toFixed(1)}" fill="${SEATC(t.s)}" stroke="#F7E9C8" stroke-width="3"/><text y="6" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Anuphan,sans-serif">${t.k==='atk'?'⚔':''}</text>`;
  svg.appendChild(tok);const seg=420,total=seg*(pts.length-1);const st=performance.now();
  const step=now=>{const k=Math.max(0,Math.min(1,(now-st)/total));const f=k*(pts.length-1);const i=Math.min(pts.length-2,Math.floor(f)),u=f-i;const e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    const x=pts[i].x+(pts[i+1].x-pts[i].x)*e,y=pts[i].y+(pts[i+1].y-pts[i].y)*e;tok.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    if(k<1)requestAnimationFrame(step);else{tok.classList.add('done');setTimeout(()=>tok.remove(),400)}};
  requestAnimationFrame(step)}
/* ===================== แชทในห้อง ===================== */
const CHAT={gid:null,msgs:[],open:false,unread:0,unsub:null,ready:false,err:null,draft:''};
const QUICK=['😂','👍','😱','🙏','😡','GG','รอแป๊บ','ตาคุณแล้ว!'];
function chatStop(){if(CHAT.unsub){try{CHAT.unsub()}catch(e){}}Object.assign(CHAT,{gid:null,msgs:[],unread:0,unsub:null,ready:false,err:null});chatDraw()}
function chatStart(gid){chatStop();if(isTut(gid)||!STORE||!STORE.watchChat)return;CHAT.gid=gid;
  try{CHAT.open=localStorage.getItem('hmp-chat-open')==='1'&&innerWidth>900}catch(e){}
  CHAT.unsub=STORE.watchChat(gid,(list,err)=>{if(CHAT.gid!==gid)return;
    if(!list){CHAT.err=err==='permission-denied'?'rules':'net';chatDraw();return}CHAT.err=null;
    const seen=new Set(CHAT.msgs.map(m=>m.id));const fresh=CHAT.ready?list.filter(m=>!seen.has(m.id)&&m.uid!==ME):[];
    CHAT.msgs=list;
    if(fresh.length){if(!CHAT.open)CHAT.unread+=fresh.length;sfx('chat')}
    CHAT.ready=true;chatDraw(true)})}
function chatSeat(){if(!G)return -1;const a=G.status==='play'?activeSeat(G):-1;if(a>=0&&iControl(G,a))return a;const m=mySeats(G);return m.length?m[0]:-1}
function chatWho(m){const S=G;const god=S&&m.seat>=0&&S.seats[m.seat]&&S.seats[m.seat].god;return (god?GOD[god].name+' · ':'')+(m.uid===ME?'คุณ':(m.name||'ผู้เล่น'))}
async function chatSend(text){text=String(text||'').trim().slice(0,200);if(!text||!CHAT.gid||!G)return;
  if(!mySeats(G).length){toast('ต้องนั่งในห้องนี้ก่อนจึงจะแชทได้');return}
  const seat=chatSeat();const me=seat>=0?G.seats[seat]:null;
  const r=await STORE.sendChat(CHAT.gid,{name:(me&&me.name)||names[ME]||'ผู้เล่น',seat,text});
  if(r==='denied'){CHAT.err='rules';chatDraw()}else if(!r)toast('ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง')}
function chatDraw(scroll){let el=document.getElementById('chat');
  if(!CHAT.gid||view.name!=='game'||!G){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='chat';document.body.appendChild(el)}
  const inp=el.querySelector('#chatin');if(inp){CHAT.draft=inp.value}
  const focused=inp&&document.activeElement===inp;const list=el.querySelector('.chatlist');const atBottom=!list||list.scrollHeight-list.scrollTop-list.clientHeight<40;
  const t=m=>{try{return new Date(m.at).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
  const body=CHAT.err==='rules'?`<p class="small chatnote">แชทยังใช้ไม่ได้: เจ้าของเว็บต้องอัปเดตกฎความปลอดภัย (Rules) ของ Firestore ก่อน</p>`
    :!CHAT.msgs.length?`<p class="small muted chatnote">ยังไม่มีข้อความ ทักทายเพื่อนในห้องได้เลย</p>`
    :CHAT.msgs.map(m=>`<div class="cmsg ${m.uid===ME?'me':''}"><div class="cwho"><span class="dot" style="background:${m.seat>=0?SEATC(m.seat):'var(--muted)'}"></span>${esc(chatWho(m))}<span class="ctime">${t(m)}</span></div><div class="ctext">${esc(m.text)}</div></div>`).join('');
  el.className=CHAT.open?'open':'';
  el.innerHTML=CHAT.open?`<div class="chatpanel" role="dialog" aria-label="แชทในห้อง">
      <div class="chathead"><b>แชทในห้อง</b><button class="ghost small" id="chatclose" aria-label="ปิดแชท">ย่อ</button></div>
      <div class="chatlist" aria-live="polite">${body}</div>
      <div class="chatquick">${QUICK.map(q=>`<button class="ghost small" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <form class="chatform" id="chatform"><input id="chatin" maxlength="200" autocomplete="off" placeholder="พิมพ์ข้อความ…" value="${esc(CHAT.draft)}"><button class="primary small" type="submit">ส่ง</button></form></div>`
    :`<button class="chatfab" id="chatopen" aria-label="เปิดแชท${CHAT.unread?' มีข้อความใหม่ '+CHAT.unread:''}">💬 แชท${CHAT.unread?`<span class="cbadge">${CHAT.unread>9?'9+':CHAT.unread}</span>`:''}</button>`;
  const setOpen=v=>{CHAT.open=v;if(v)CHAT.unread=0;try{localStorage.setItem('hmp-chat-open',v?'1':'0')}catch(e){}chatDraw(true);if(v){const i=document.getElementById('chatin');if(i&&innerWidth>700)i.focus()}};
  const o=el.querySelector('#chatopen');if(o)o.onclick=()=>setOpen(true);
  const c=el.querySelector('#chatclose');if(c)c.onclick=()=>setOpen(false);
  el.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>chatSend(b.dataset.q));
  const f=el.querySelector('#chatform');if(f)f.onsubmit=e=>{e.preventDefault();const i=el.querySelector('#chatin');const v=i.value;i.value='';CHAT.draft='';chatSend(v);i.focus()};
  const l=el.querySelector('.chatlist');if(l&&(scroll&&atBottom||scroll==='force'||!list))l.scrollTop=l.scrollHeight;
  if(focused){const i=el.querySelector('#chatin');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}}
/* คำพูดประจำองค์ บนการ์ดเทพ */
const GOD_FLAVOR={indra:'สายฟ้าแห่งดาวดึงส์ จะฟาดลงทุกที่ที่ข้าชี้',shiva:'จังหวะระบำของข้า คือจุดจบของโลกเก่า',agni:'ทุกสิ่งที่ขวางทาง จะกลายเป็นเถ้าธุลี',
  skanda:'กองทัพเทวดา จงตามข้ามา!',yama:'ทุกชีวิตต้องมาถึงประตูของข้า ไม่ช้าก็เร็ว',brahma:'สิ่งใดที่สูญไป ข้าจะสร้างขึ้นใหม่',
  varuna:'ฝนแรกของฤดู คือพรที่ข้ามอบให้',jupiter:'ปัญญาคือศาสตราที่คมที่สุด',ganesha:'อุปสรรคใดก็ขวางผู้มีศรัทธาไม่ได้',
  saraswati:'เสียงพิณของข้า ปลุกปัญญาให้ตื่นขึ้น',narai:'ทุกการเคลื่อนไหว อยู่ในแผนของข้าแล้ว',vayu:'ตามข้าทันไหมล่ะ?',
  rahu:'เมื่อข้ากลืนจันทร์ ความมืดจะเป็นของข้า',vessuwan:'ยักษ์ทั้งปวง จงก้มหัวต่อราชาแห่งทิศเหนือ',reusi:'ตบะที่บำเพ็ญมานับพันปี เจ้าต้านไม่ไหวหรอก',
  thorani:'ผืนดินนี้ จะไม่มีวันถูกพรากไป',uma:'อ่อนโยนต่อผู้ภักดี ไร้ปรานีต่อผู้รุกราน',ganga:'สายน้ำไหลไปที่ใด ชีวิตย่อมงอกงามที่นั่น',
  chan:'คืนนี้ แสงจันทร์จะคุ้มครองเจ้า',surya:'ตราบที่ตะวันยังส่องแสง ข้าไม่มีวันพ่าย'};
/* จุดโฟกัสของภาพแต่ละองค์ (ตำแหน่งหน้า) ใช้ตอนครอปเป็นแบนเนอร์และวงกลม ปรับเมื่อได้รูปจริง */
const GOD_FOCUS={surya:[.5,.165],chan:[.52,.24],uma:[.53,.21],thorani:[.47,.215],reusi:[.5,.165],vessuwan:[.49,.29],rahu:[.5,.27],vayu:[.40,.27],narai:[.49,.23],saraswati:[.5,.24],ganesha:[.5,.345],jupiter:[.46,.225],varuna:[.4,.19],brahma:[.49,.285],yama:[.375,.26],skanda:[.54,.25],agni:[.45,.345],shiva:[.55,.25],ganga:[.50,.20],indra:[.51,.33]}; /* [x,y] ตำแหน่งกลางหน้า เป็นสัดส่วนของภาพ (ภาพมาตรฐาน 832×1216) */
const IMG_R=1216/832;
function focusStyle(k,cls){const f=GOD_FOCUS[k];if(!f||cls==='full'&&false)return '';const [fx,fy]=f;
  if(cls==='av'||cls==='chip'){const z=2.3;return `style="inset:auto;width:${z*100}%;height:auto;max-width:none;left:${(50-fx*z*100).toFixed(1)}%;top:${(50-fy*IMG_R*z*100).toFixed(1)}%"`}
  const box=cls==='banner'?0.75:cls==='full'?1.4:4/3;const at=cls==='banner'?0.42:0.3;const P=Math.max(0,Math.min(1,(fy*IMG_R-at*box)/(IMG_R-box)));
  return `style="object-position:${(fx*100).toFixed(0)}% ${(P*100).toFixed(0)}%"`}
/* ภาพพาหนะ: ใส่ชื่อใน MOUNT_ART เมื่อมีไฟล์ img/mounts/<รหัส>.webp แล้ว ยังไม่มีภาพใช้อีโมจิแทน */
const ICON_HAVE=new Set(['arch-war','arch-bun','arch-maya','arch-guard','t-forest','t-deep','t-temple','a-recruit','a-move','a-merit','a-buy','t-plain','t-water']);
const MOUNT_ART=new Set(['erawan','garuda','hong','nonthi','buffalo','rhino','naga','rajasi','khotchasi','kilen','durong','kinnaree','makara','hera','hatsadee','kraisorn','asura','kwang','kaisornnaka','thakthor']);
const MOUNT_FOCUS={thakthor:[0.46,0.17],kaisornnaka:[0.33,0.24],kwang:[0.57,0.25],asura:[0.47,0.24],kraisorn:[0.52,0.14],hatsadee:[0.55,0.22],hera:[0.8,0.55],makara:[0.7,0.33],kinnaree:[0.61,0.21],durong:[0.62,0.28],kilen:[0.66,0.31],khotchasi:[0.5,0.36],rajasi:[0.52,0.35],naga:[0.53,0.25],rhino:[0.5,0.46],buffalo:[0.48,0.27],nonthi:[0.58,0.44],hong:[0.53,0.29],garuda:[0.5,0.34],erawan:[0.5,0.32]}; /* [x,y] ตำแหน่งกลางหัวสัตว์ เป็นสัดส่วนของภาพ */
function mPic(k){const m=MOUNTS[k];if(!m)return '';if(!MOUNT_ART.has(k))return m.ic;const [fx,fy]=MOUNT_FOCUS[k]||[.5,.3];const z=2.1;
  return `<span class="mav" aria-hidden="true"><img src="img/mounts/${k}.webp" alt="" loading="lazy" style="width:${z*100}%;left:${(50-fx*z*100).toFixed(1)}%;top:${(50-fy*IMG_R*z*100).toFixed(1)}%"></span>`}
function mountCard(k){const m=MOUNTS[k];const g=GOD[OWNER_GOD[k]];
  return `<article class="gcard mcard" aria-label="การ์ด${esc(m.name)}">
    <span class="portrait full"><img src="img/mounts/${k}.webp" alt="" loading="lazy"></span>
    <div class="gc-badge" title="ราคา"><span class="gc-ic">${m.cost}</span><span class="gc-bn">บุญ</span></div>
    <div class="gc-low">
      <div class="gc-text"><p><span class="gc-key">พาหนะ</span> ${esc(m.txt)}</p><p>ถิ่น: <b>${HOME[k]}</b> รบในช่อง${HOME[k]} +1 ทั้งบุกและรับ</p>${g?`<p class="gc-weak">โบนัสเมื่ออยู่กับ${esc(g.name)}: ${esc(m.bonus.split(': ')[1]||m.bonus)}</p>`:''}</div>
      <div class="gc-name"><b>${esc(m.name)}</b><span>พาหนะประจำ${g?esc(g.name):'—'}</span></div>
    </div></article>`}
/* การ์ดเทพแบบเต็มใบ: ภาพเต็มการ์ด ข้อความวางทับ */
function godCard(k){const g=GOD[k];if(!g)return '';const A=ARCH[g.arch]||{ic:'',n:''};const m=MOUNTS[g.mount];
  return `<article class="gcard arch-${g.arch}" aria-label="การ์ด${esc(g.name)}">
    ${godPic(k,'full')}
    <div class="gc-badge" title="${esc(A.n)}"><span class="gc-ic">${archIc(g.arch)}</span><span class="gc-bn">${esc(A.n.replace('สาย',''))}</span></div>
    <button class="gc-mount" ${infoAttr('mount:'+g.mount)} aria-label="พาหนะ ${esc(m.name)}"><span>${mPic(g.mount)}</span></button>
    <div class="gc-low">
      ${GOD_FLAVOR[k]?`<p class="gc-flavor">“${esc(GOD_FLAVOR[k])}”</p>`:''}
      <div class="gc-text"><p><span class="gc-key">${esc(g.ab)}</span> ${esc(g.txt)}</p><p class="gc-weak">จุดอ่อน: ${esc(g.weak)}</p></div>
      <div class="gc-name"><b>${esc(g.name)}</b><span>${archIc(g.arch)} ${esc(A.n)} · ${mPic(g.mount)} ${esc(m.name)}</span></div>
    </div></article>`}
function openGodPick(k,from){const pop=document.getElementById('pop');if(!pop||!G)return;
  const S=G;const taken=S.seats.findIndex(x=>x.god===k);const can=S.status==='draft'&&iControl(S,draftPicker(S))&&taken<0;
  infoReturn=from||null;
  pop.innerHTML=`<div class="popcard cardpop" role="document">${godCard(k)}
    <div class="row gc-acts">${taken>=0?`<span class="small muted">ถูกเลือกแล้วโดย ${esc(S.seats[taken].uid===ME?'คุณ':(S.seats[taken].name||'ผู้เล่น'))}</span>`:can?'':'<span class="small muted">ยังไม่ถึงตาคุณเลือก</span>'}
      <span style="flex:1"></span>${can?`<button class="primary" id="gcpick">เลือก${esc(GOD[k].name)}</button>`:''}<button class="${can?'ghost':'primary'}" id="popclose">ปิด</button></div></div>`;
  pop.hidden=false;const pb=document.getElementById('gcpick');if(pb){pb.onclick=e=>{e.stopPropagation();closeInfo();pickGod(k)};pb.focus()}else document.getElementById('popclose').focus()}
/* รูปเทพ: วางไฟล์ไว้ที่ img/gods/<รหัสเทพ>.webp ถ้าไม่มีไฟล์ จะแสดงอักษรย่อบนพื้นสีตามสายแทน */
/* การ์ดพอไหม: คนหนึ่งซื้อได้ราวรอบละไม่เกิน 1 ใบ เกมทั่วไปจบราว 10–14 รอบ */
function supplyNote(n,c,nl){const per=c/n;const tone=per<10?'warn':per<13?'':'ok';
  const msg=per<10?'การ์ดน่าจะหมดก่อนจบเกม ลองเปิดการ์ดเลเวล 3 หรือเพิ่มสาย':per<13?'พอสำหรับเกมทั่วไป แต่ถ้าเกมยาว การ์ดดีๆ จะเริ่มหมดช่วงท้าย':'การ์ดพอทั้งเกม';
  return `${nl} สาย รวม ${c} ใบ ≈ ${per.toFixed(1)} ใบต่อคน · <span class="sup-${tone}">${msg}</span>`}
function godPic(k,cls){const g=GOD[k];if(!g)return '';const g0=g.name.replace(/^(พระแม่|พระ|ท้าว)/,'');const ini=(g0.match(/[ก-ฮฤ]/)||[g0[0]])[0];
  return `<span class="portrait ${cls||''} arch-${g.arch||'war'}" aria-hidden="true"><span class="pini">${ini}</span><img src="img/gods/${k}.webp" alt="" loading="lazy" decoding="async" ${focusStyle(k,cls)} onerror="this.remove()"></span>`}
function turnPopup(S,first){
  const a=activeSeat(S);if(a<0)return;const mine=iControl(S,a);
  if(first&&!mine)return;
  clearTimeout(turnTimer);
  const show=()=>{
    if(document.getElementById('sky')||document.getElementById('battlepop')){turnTimer=setTimeout(show,400);return}
    if(!G||view.name!=='game'||turnKey(G)!==turnKey(S))return;
    const old=document.getElementById('turnpop');if(old)old.remove();
    const w=turnWhat(S,a);const d=document.createElement('div');d.id='turnpop';d.className='turnpop'+(mine?' mine':'');d.setAttribute('role','status');
    d.style.setProperty('--c',SEATC(a));
    d.innerHTML=mine?`<div class="tpcard"><div class="tpring"></div><div class="tpkick">🔔 ${S.solo?esc(gname(S,a)):'ตาของคุณ'}</div><b>${esc(w.me)}</b><small>${esc(gname(S,a))} · รอบ ${S.round} · ${S.moon==='wax'?'☀ กลางวัน':'☾ กลางคืน'}</small><button class="primary" id="tpgo">เริ่มเลย</button></div>`
      :`<div class="tpcard"><span class="dot" style="background:${SEATC(a)}"></span><div><div class="tpkick">ตอนนี้ตาของ</div><b>${esc(gname(S,a))}</b> <span class="muted">(${esc(pname(S.seats[a].uid,'ผู้เล่น'))})</span><small>${esc(w.other)}</small></div></div>`;
    document.body.appendChild(d);
    const close=()=>{if(!d.isConnected)return;d.classList.add('out');setTimeout(()=>d.remove(),350)};
    d.onclick=close;const b=document.getElementById('tpgo');if(b)b.onclick=e=>{e.stopPropagation();close()};
    setTimeout(close,mine?6000:2600);
    if(mine)sfx('turn');
    if(mine&&navigator.vibrate){try{navigator.vibrate(120)}catch(e){}}
  };
  show();
}
/* แถบบอกตาที่ติดอยู่ด้านบนจอเสมอ */
function turnBar(S,act,mine){
  if(S.status!=='play'||act<0)return '';const w=turnWhat(S,act);
  return `<div class="turnbar ${mine?'mine':''}" style="--c:${SEATC(act)}"><span class="dot" style="background:${SEATC(act)}"></span>${mine?`<b>${esc(w.me)}</b>`:`ตาของ <b>${esc(gname(S,act))}</b> <span class="muted">(${esc(pname(S.seats[act].uid,'ผู้เล่น'))})</span> · ${esc(w.other)}`}</div>`}
function renderGame(){
  const S=G;const act=activeSeat(S);const mine=iControl(S,act);
  const myTurn=mine&&!S.battle&&!S.retreat&&!S.disarm&&S.status==='play';
  let clickable=[],selected=null;
  if(myTurn){
    if(ui.mode==='move-src'){S.B.forEach((c,i)=>{if(c.o===act&&c.t>0&&Object.keys(reachAny(S,act,i)).length)clickable.push(i)})}
    if(ui.mode==='move-dst'){clickable=Object.keys(ui.dest).map(Number);selected=ui.src}
    if(ui.mode==='move-cfg'){selected=ui.dst}
    if(ui.mode==='recruit'){clickable=recruitTargets(S,act).filter(j=>recruitN(S,act,j)>0)}
    if(ui.mode==='vajra'){clickable=vajraTargets(S,act,S.follow&&S.follow.vfrom)}
    if(ui.mode==='assn'){clickable=vajraTargets(S,act,S.follow&&S.follow.vfrom,true)}
    if(ui.mode==='warp-src'||ui.mode==='swap-a'){clickable=warpSrcs(S,act)}
    if(ui.mode==='warp-dst'){clickable=warpTargets(S,act,ui.src);selected=ui.src}
    if(ui.mode==='swap-b'){clickable=warpSrcs(S,act).filter(j=>j!==ui.src);selected=ui.src}
    if(ui.mode==='avatar-dst'){S.B.forEach((c,i)=>{if((c.o===act&&c.t>0&&mountsAt(S,i,act).length<mLimit(S,act))||i===cityOf(act))if(S.M[ui.am].c!==i)clickable.push(i)})}
  }
  if(S.retreat&&mine&&S.status==='play'){clickable=S.retreat.opts;selected=S.retreat.from}
  const moonPill=`<span class="pill">${S.moon==='wax'?'◐ กลางวัน: วัดได้บุญ +1':'◑ กลางคืน: ฝ่ายบุก +1'}</span>`;
  app.innerHTML=topBar(S,`${isTut(GID)?'':`<button class="ghost small" id="copy">คัดลอกลิงก์ห้อง</button>`}<button class="pill mappill" ${mapInfoAttr(S)}>🗺 ${esc(mapOf(S).name)}</button><span class="pill tab">รอบ ${S.round}</span><span class="pill tab">เป้า ${S.target}</span>`)+`
  <div class="stack">
  ${turnBar(S,act,mine)}
  ${tutBox()}
  ${phaseBox(S)}
  <div class="panel mapbox">${mapSVG(S,clickable,selected,(TUT&&GID==='tut'&&tutStep()&&tutStep().hl)||[])}${terrLegend()}${trailBox(S)}</div>
  <div class="game">
    <div class="stack">${statusBox(S,act,mine)}${lastBattleBox(S)}${S.status==='play'?shopBox(S,myTurn?act:(mySeats(S).length?mySeats(S)[0]:act),myTurn):''}${seatHelpBox(S)}</div>
    <div class="stack">${playersBox(S,act)}<div class="panel"><h3>บันทึก</h3><ul class="log">${S.log.map(t=>`<li>${richLog(t)}</li>`).join('')}</ul></div>${rulesRef()}</div>
  </div></div>`;
  document.getElementById('back').onclick=showLobby;
  try{document.title=(mine&&S.status==='play'?'🔔 ถึงตาคุณ · ':'')+'ศึกเทพหิมพานต์'}catch(e){}
  wireGame(S,act);wireTut();wireId();
  {const ob=document.getElementById('openboard');if(ob)ob.onclick=()=>openBoard(G)}
  {const sb=document.getElementById('snd');if(sb)sb.onclick=()=>{try{localStorage.setItem('hmp-snd',sndOn()?'0':'1')}catch(e){}render();if(sndOn())sfx('turn')}}
  {const a=document.getElementById('arrows');if(a)a.onchange=()=>{try{localStorage.setItem('hmp-arrows',a.checked?'1':'0')}catch(e){}render()}}
  {const $=id=>document.getElementById(id);
   if($('delres'))$('delres').onclick=async()=>{if(!confirmTwice($('delres')))return;try{await STORE.del(GID)}catch(e){toast('ลบไม่สำเร็จ')}showLobby()};
   if($('cpme'))$('cpme').onclick=()=>copyText(ME,'คัดลอกรหัสแล้ว ส่งให้เพื่อนในห้องได้เลย');
   if($('mvgo'))$('mvgo').onclick=()=>{const i=+$('mvseat').value;const code=$('mvcode').value.trim();
     if(!/^[A-Za-z0-9]{20,40}$/.test(code)){toast('รหัสไม่ถูกต้อง ให้เพื่อนกดคัดลอกรหัสแล้วส่งมาใหม่');return}
     mutate(GID,T=>{if(!mySeats(T).length||mySeats(T).includes(i)||T.seats.some(x=>x.uid===code))return false;
       const old=T.seats[i].name||'ผู้เล่น';T.seats[i].uid=code;log(T,`ย้ายที่นั่งของ${gname(T,i)} (${old}) ไปเครื่องใหม่`)}).then(ok=>{if(ok)toast('ย้ายที่นั่งแล้ว ให้เพื่อนรีเฟรชหน้า')})}}const cp=document.getElementById('copy');if(cp)cp.onclick=()=>copyText(linkFor(GID));
}
function statusBox(S,act,mine){
  if(S.status==='done')return resultBox(S);
  if(S.battle){const b=S.battle;
    const showAtk=S.openCards||S.solo||has(S,b.d,'eye')||isGod(S,b.d,'reusi');
    if(mine){return `<div class="banner warn"><h2>${esc(gname(S,b.a))} บุก${esc(cname(S,b.to))}!</h2><p class="small">ฝ่ายบุกมาด้วยทหาร ${b.n} ตัว${mList([b.mount,b.mount2]).length?' และ'+mList([b.mount,b.mount2]).map(k=>MOUNTS[k].name).join(' และ'):''} คุณตั้งรับด้วย ${S.B[b.to].t} ตัว เลือกการ์ดรบ</p>
      ${showAtk?`<div class="eyereveal"><div class="small"><b>${S.openCards||S.solo?'ห้องนี้เปิดการ์ด':isGod(S,b.d,'reusi')?'🧘 ตบะ':'👁 ตาทิพย์'}: ฝ่ายบุกลงการ์ดนี้ไว้แล้ว</b><br><span class="muted">เลือกการ์ดตั้งรับสู้ได้เลย</span></div><div class="bcard big"><span class="cn">${esc(CARD[b.ac].n)}</span><span class="cs">พลัง <b>${CARD[b.ac].s}</b></span><span class="ck">ฆ่า <b>${CARD[b.ac].k}</b></span></div></div>`:'<p class="small muted">ฝ่ายบุกลงการ์ดคว่ำไว้แล้ว จะเปิดพร้อมกันหลังคุณเลือก</p>'}
      ${previewHTML(S,'def')}
      <div class="cards" id="defcards">${availCards(S,b.d).map(c=>cardBtn(c,'data-dc',false)).join('')}</div></div>`}
    const iAtk=iControl(S,b.a);
    return `<div class="banner">รอ${esc(gname(S,b.d))} (${esc(pname(S.seats[b.d].uid,'ผู้เล่น'))}) เลือกการ์ดตั้งรับ ที่${esc(cname(S,b.to))}
      ${iAtk?`<div class="small" style="margin-top:4px">คุณลงการ์ด <b>${CARD[b.ac].n} (พลัง ${CARD[b.ac].s} ฆ่า ${CARD[b.ac].k})</b> ไว้</div>`:showAtk?`<div class="small" style="margin-top:4px">ฝ่ายบุกลงการ์ด <b>${CARD[b.ac].n}</b></div>`:''}
      ${previewHTML(S,iAtk?'atk':'watch')}</div>`}
  if(S.retreat){const rt=S.retreat;const ml=mList(rt.m).map(k=>MOUNTS[k].name).join(' และ');const self=rt.chooser===rt.loser;
    if(mine)return `<div class="banner"><h2>${self?'คุณแพ้ เลือกช่องถอยเอง (ถอยทัพ)':`คุณชนะ! เลือกช่องให้${esc(gname(S,rt.loser))}ถอย`}</h2><p class="small">ทหารที่เหลือ ${rt.n} ตัว${ml?' และ'+esc(ml):''} จะถอยไปช่องที่เลือก กดช่องวงประบนแผนที่</p></div>`;
    return `<div class="banner">รอ${esc(gname(S,rt.chooser))}เลือกช่อง${self?'ถอย':`ให้${esc(gname(S,rt.loser))}ถอย`}</div>`}
  if(S.disarm){const d=S.disarm;const self=disarmBy(d)===d.s;
    if(mine)return `<div class="banner warn"><h2>${self?'โดนริบอาวุธ!':'พิษกระจาย!'}</h2><p class="small">${self?'เลือกการ์ดรบของคุณที่จะทิ้ง 1 ใบ':`เลือกการ์ดรบของ${esc(gname(S,d.s))}ให้ทิ้ง 1 ใบ`} (นับเป็นใช้แล้ว)</p><div class="cards">${availCards(S,d.s).map(c=>cardBtn(c,'data-xc',false)).join('')}</div></div>`;
    return `<div class="banner">รอ${esc(gname(S,disarmBy(d)))}เลือกการ์ดรบ${self?'ที่จะทิ้ง (โดนริบอาวุธ)':`ของ${esc(gname(S,d.s))}ให้ทิ้ง (พิษกระจาย)`}</div>`}
  const who=`<span class="dot" style="background:${SEATC(act)}"></span> ตาของ <b>${esc(gname(S,act))}</b> <span class="muted">(${esc(pname(S.seats[act].uid,'ผู้เล่น'))})</span>`;
  if(!mine)return `<div class="panel"><div class="row">${who}</div><p class="small muted">รอเขาเดิน หน้านี้อัปเดตเองเมื่อมีการเดิน</p></div>`;
  if(S.follow){const f=S.follow;
    return `<div class="panel stack"><div class="row">${who}</div><div class="banner">ทำต่อได้ก่อนจบตา</div>
    <div class="row">${f.vajra?`<button class="primary" id="f-vajra">ใช้วชิราวุธ</button>`:''}${f.assn?`<button class="primary" id="f-assn">ลอบสังหาร</button>`:''}${f.bonusFrom!==null?`<button class="primary" id="f-bonus">เดินต่อ 1 ช่อง (ชัยต่อเนื่อง)</button>`:''}<button id="f-end">จบตา</button></div>
    ${modeBox(S,act)}</div>`}
  const p=S.P[act];
  const moveable=S.B.some((c,i)=>c.o===act&&c.t>0&&Object.keys(reachAny(S,act,i)).length);
  const canRecruit=canRecruitAny(S,act);const rN=recruitN(S,act,cityOf(act));
  const btn=(a,sub,ok)=>`<button data-act="${a}" class="actbtn" ${actionOK(S,act,a)&&ok&&tutAllow(a)?'':'disabled'}><span class="aic">${ico('a-'+a)}</span><b>${ACT[a]}</b><span>${sub}</span></button>`;
  return `<div class="panel stack"><div class="row">${who}</div>
   <div class="small muted tab">แอคชันที่ใช้แล้ว ${p.used.length}/${actionLimit(S,act)}${p.used.length?' · '+p.used.map(a=>ACT[a]).join(', '):''}</div>
   ${ui.mode?modeBox(S,act):`<div class="actions">
    ${btn('recruit',canRecruit?`+${rN} ตัว · จ่าย ${recruitPrice(S,act,rN)} บุญ (คลังเหลือ ${reserve(S,act)})`:reserve(S,act)>0?`ต้องมีบุญ (ตัวละ 1 บุญ)`:'คลังหมดแล้ว',canRecruit)}
    ${btn('move','เลือกกองแล้วเลือกปลายทาง',moveable)}
    ${btn('merit',(has(S,act,'atone')?'บุญ +'+meritAmt(S,act)+' และลบบาป 1':'บุญ +'+meritAmt(S,act)+' หรือลบบาป 1'),true)}
    ${btn('buy','ซื้อการ์ดพลังหรือพาหนะ (รายการด้านล่าง)',true)}
   </div>${stuckNow(S,act)?`<div class="banner row small">ตอนนี้ไม่มีแอคชันที่ทำได้ (บุญไม่พอ/เดินไม่ได้) <button class="primary small" id="pass">ผ่านตา (ได้บุญ +1)</button></div>`:''}`}
   ${!ui.mode?`<div class="row">${isGod(S,act,'narai')&&!p.f.avatar&&mountsOf(S,act).length?`<button id="avatar">อวตาร: ย้ายพาหนะ (ฟรี)</button>`:''}${isGod(S,act,'narai')&&!p.f.avatar&&warpSrcs(S,act).length>=2?`<button id="avswap">อวตาร: สลับกอง (ฟรี)</button>`:''}${warpLeft(S,act)&&warpSrcs(S,act).length?`<button id="warp">🌀 เคลื่อนย้ายมิติ (เหลือ ${warpLeft(S,act)})</button>`:''}${has(S,act,'swap')?(p.f.swap?`<button disabled>🔀 สลับตำแหน่ง (ใช้แล้วรอบนี้)</button>`:warpSrcs(S,act).length>=2?`<button id="cswap">🔀 สลับตำแหน่ง (ฟรี)</button>`:`<button disabled title="ต้องมีกองนอกเมืองอย่างน้อย 2 กอง">🔀 สลับตำแหน่ง (ต้องมีกองนอกเมือง 2 กอง)</button>`):''}</div>`:''}
  </div>`;
}
/* ย้ายที่นั่งให้คนที่เปลี่ยนเครื่อง: คนที่ยังอยู่ในห้องใส่รหัสของเครื่องใหม่ */
function seatHelpBox(S){
  if(isTut(GID)||S.status!=='play'||!STORE.online)return '';
  const mine=mySeats(S);
  if(!mine.length)return `<div class="panel stack"><h3>คุณดูอยู่เฉยๆ ยังไม่ได้นั่งในห้องนี้</h3>
    <p class="small">ถ้าคุณเป็นผู้เล่นในห้องนี้ที่เปลี่ยนเครื่องหรือล้างเบราว์เซอร์ เลือกทางใดทางหนึ่ง</p>
    <p class="small"><b>1.</b> ถ้าเคยผูก Google ไว้ <button id="glink2">ใช้ Google ที่ผูกไว้</button></p>
    <p class="small"><b>2.</b> ส่งรหัสเครื่องนี้ให้เพื่อนในห้อง ให้เขากด "ย้ายที่นั่ง" แล้ววางรหัสนี้</p>
    <div class="share"><code>${esc(ME)}</code><button id="cpme">คัดลอกรหัส</button></div></div>`;
  return `<details class="panel"><summary>เพื่อนเปลี่ยนเครื่อง? ย้ายที่นั่งให้</summary><div class="stack" style="margin-top:10px">
    <p class="small">ให้เพื่อนเปิดลิงก์ห้องนี้ในเครื่องใหม่ จะเห็น "รหัสเครื่องนี้" ให้ส่งรหัสนั้นมา แล้ววางที่นี่</p>
    <label class="form"><span class="small">ที่นั่งของ</span><select id="mvseat">${S.seats.map((x,i)=>mine.includes(i)?'':`<option value="${i}">${esc(gname(S,i))} (${esc(x.name||'ผู้เล่น')})</option>`).join('')}</select></label>
    <label class="form"><span class="small">รหัสเครื่องใหม่</span><input id="mvcode" autocomplete="off" placeholder="วางรหัสที่เพื่อนส่งมา"></label>
    <div><button id="mvgo">ย้ายที่นั่ง</button></div></div></details>`;
}
/* หน้าสรุปผลตอนจบเกม */
function ranking(S){return [...Array(S.n).keys()].sort((a,b)=>(b===S.winner)-(a===S.winner)||total(S,b)-total(S,a)||S.P[b].vp-S.P[a].vp||S.P[a].sin-S.P[b].sin)}
function resultBox(S){
  const rk=ranking(S);const mine=mySeats(S);const iWon=mine.includes(S.winner);const iPlayed=mine.length>0;
  const medal=['🏆','🥈','🥉'];
  return `<div class="panel result stack">
    <div class="restop"><div class="trophy" aria-hidden="true">${iPlayed&&!iWon?'🎖️':'🏆'}</div>
      <div><h2>${iPlayed?(iWon?'คุณชนะ!':'จบเกมแล้ว · '+esc(gname(S,S.winner))+'ชนะ'):esc(gname(S,S.winner))+' ชนะ!'}</h2>
      <p class="small muted">${esc(gname(S,S.winner))} (${esc(pname(S.seats[S.winner].uid,'ผู้เล่น'))}) ได้ ${total(S,S.winner)} คะแนน · จบในรอบที่ ${S.round} · เป้า ${S.target}</p></div></div>
    <ol class="rank">${rk.map((s,i)=>{const p=S.P[s];return `<li class="${s===S.winner?'win':''} ${mine.includes(s)?'me':''}">
      <span class="rno">${medal[i]||i+1}</span><span class="dot" style="background:${SEATC(s)}"></span>
      <span class="rname"><b>${esc(gname(S,s))}</b> <span class="small muted">${esc(pname(S.seats[s].uid,'ผู้เล่น'))}</span>
        <span class="small muted rsub">ถาวร ${p.vp} · วัด ${tempVP(S,s)} · บุญ ${p.merit} · บาป ${p.sin} · พร ${p.pw.length} ใบ ${mountsOf(S,s).map(mIcon).join('')}</span></span>
      <span class="rscore tab">★ ${total(S,s)}</span></li>`}).join('')}</ol>
    <div class="row"><button class="primary" id="back2">กลับหน้ารวม</button>${S.host===ME&&!isTut(GID)?`<button class="ghost" id="delres">ลบห้องนี้</button>`:''}<span class="small muted">กระดานสุดท้ายอยู่ด้านบน เลื่อนดูได้</span></div></div>`;
}
let END_SEEN={};
function endShow(S){
  if(!S||S.status!=='done'||!GID||END_SEEN[GID])return;END_SEEN[GID]=1;
  const key='hmp-end-'+GID;try{if(!isTut(GID)){if(localStorage.getItem(key))return;localStorage.setItem(key,'1')}}catch(e){}
  const mine=mySeats(S);const iWon=mine.includes(S.winner);const lost=mine.length&&!iWon;
  const d=document.createElement('div');d.id='sky';d.className='sky '+(lost?'night':'day')+' endsky';d.setAttribute('role','status');
  d.innerHTML=`<div class="skyorb"><div class="bigtrophy">${lost?'🎖️':'🏆'}</div></div><div class="skytxt"><b>${lost?'จบเกม':'ชัยชนะ!'}</b><span>${esc(gname(S,S.winner))} ชนะด้วย ${total(S,S.winner)} คะแนน</span><small>${lost?'สู้ใหม่ได้เสมอ':'เทพแห่งหิมพานต์'}</small></div><small class="skytap">แตะเพื่อดูสรุปผล</small>`;
  document.body.appendChild(d);const close=()=>{if(!d.isConnected)return;d.classList.add('out');setTimeout(()=>d.remove(),450)};d.onclick=close;setTimeout(close,4200);
}
/* กล่องพรีวิวศึก: พลังรบก่อนลงการ์ดของทั้งสองฝ่าย กดดูที่มาได้ */
function previewHTML(S,who){
  const v=battlePreview(S);if(!v)return '';
  const fmtL=l=>l.map(([n,x])=>`<li><span>${esc(n)}</span><b class="tab">${x>=0?'+':'−'}${Math.abs(x)}</b></li>`).join('');
  const kl=(l,cond)=>l.map(([n,x])=>`<li><span>${esc(n)}${cond?' <i>(ถ้าชนะ)</i>':''}</span><b class="tab">${x>=0?'+':'−'}${Math.abs(x)}</b></li>`).join('');
  const veiled=s=>has(S,s,'veil')&&!viewers(S).includes(s);
  const side=(s,base,parts,kAlways,kWin,label)=>veiled(s)?`<div class="bpside" style="--c:${SEATC(s)}">
     <div class="bphead"><span class="dot" style="background:${SEATC(s)}"></span>${label} · <b>${esc(gname(S,s))}</b></div>
     <div class="bpnum"><b class="tab">${(parts.find(x=>x[0]==='ทหาร')||[0,0])[1]}</b><span>+ โบนัส ? + การ์ด ?</span></div><div class="small muted">ม่านมายา: ซ่อนโบนัสไว้</div></div>`:`<div class="bpside" style="--c:${SEATC(s)}">
     <div class="bphead"><span class="dot" style="background:${SEATC(s)}"></span>${label} · <b>${esc(gname(S,s))}</b></div>
     <div class="bpnum"><b class="tab">${base}</b><span>+ การ์ด ?</span></div>
     <details><summary>ดูที่มาของพลังรบ</summary><ul class="bplist">${fmtL(parts)}</ul></details>
     <div class="bpkill">แต้มฆ่า = การ์ด${kAlways.concat(kWin).length?'':' (ไม่มีตัวปรับ)'}${kAlways.length||kWin.length?`<ul class="bplist">${kl(kAlways,false)}${kl(kWin,true)}</ul>`:''}</div></div>`;
  const diff=v.baseA-v.baseD;
  const tip=who==='def'?(diff>0?`ฝ่ายบุกนำอยู่ <b>${diff}</b> แต้ม · ต้องลงการ์ดพลังมากกว่าฝ่ายบุก <b>${diff}</b> ขึ้นไป ถึงจะชนะ (เสมอ = คุณชนะ)`:diff===0?`พลังเท่ากัน · ลงการ์ดพลังเท่าหรือมากกว่าฝ่ายบุก = คุณชนะ`:`คุณนำอยู่ <b>${-diff}</b> แต้ม · ฝ่ายบุกต้องลงการ์ดพลังมากกว่าคุณเกิน ${-diff} ถึงจะชนะ`)
    :who==='atk'?(diff>0?`คุณนำ <b>${diff}</b> แต้มก่อนลงการ์ด`:`ฝ่ายรับนำ <b>${-diff}</b> แต้ม (เสมอ = ฝ่ายรับชนะ)`)
    :(diff>0?`ฝ่ายบุกนำ ${diff} แต้มก่อนลงการ์ด`:diff===0?'พลังเท่ากันก่อนลงการ์ด (เสมอ = ฝ่ายรับชนะ)':`ฝ่ายรับนำ ${-diff} แต้มก่อนลงการ์ด`);
  const hand=availCards(S,v.A);
  const anyVeil=veiled(v.A)||veiled(v.D);
  return `<div class="bprev"><div class="bptitle">⚔ พลังรบก่อนลงการ์ด</div>
    <div class="bpgrid">${side(v.A,v.baseA,v.pA,v.km.a,v.km.aWin,'ฝ่ายบุก')}<div class="bpvs">VS</div>${side(v.D,v.baseD,v.pD,v.km.d,v.km.dWin,'ฝ่ายรับ')}</div>
    ${v.pre.length?`<div class="small">${esc(v.pre.join(' · '))}</div>`:''}
    <div class="bptip">${anyVeil?'อีกฝ่ายมีม่านมายา ไม่รู้ว่าโบนัสของเขาเท่าไร':tip}</div>
    ${who==='def'&&!(hidesCards(S,v.A)&&!viewers(S).includes(v.A))?`<div class="small muted">การ์ดที่ฝ่ายบุกยังมีในมือ (ใบที่ลงอยู่ในนี้): ${hand.map(c=>`<span class="chip">${CARD[c].n} ${CARD[c].s}/${CARD[c].k}</span>`).join(' ')}</div>`:''}</div>`}
/* ป๊อปอัปผลศึก: เปิดการ์ดทั้งสองฝ่ายให้ทุกคนเห็นหลังรบ */
const BATTLE_SEEN={};
function battleShow(S,first){
  const r=S.last;if(!GID)return;
  if(first){BATTLE_SEEN[GID]=r&&r.id||0;return}
  if(!r||!r.id||!r.pA)return;
  if(BATTLE_SEEN[GID]===r.id)return;BATTLE_SEEN[GID]=r.id;
  if(Date.now()-r.id>10*60*1000)return;
  const nm=l=>l.map(x=>Array.isArray(x)?x:[x.l,x.v]);
  const pA=nm(r.pA),pD=nm(r.pD);const cardOf=l=>(l.find(x=>x[0]==='การ์ด')||[0,0])[1];
  const mine=mySeats(S);
  const side=(s,parts,tot,card,lost,win)=>`<div class="brside ${win?'win':''}" style="--c:${SEATC(s)}">
    <div class="bphead"><span class="dot" style="background:${SEATC(s)}"></span><b>${esc(gname(S,s))}</b>${win?' <span class="chip">ชนะ</span>':''}</div>
    <div class="flip"><div class="bcard big"><span class="cn">${esc(CARD[card].n)}</span><span class="cs">พลัง <b>${CARD[card].s}</b></span><span class="ck">ฆ่า <b>${CARD[card].k}</b></span></div></div>
    <div class="bpnum"><b class="tab">${tot}</b><span>${tot-cardOf(parts)} + การ์ด ${cardOf(parts)}</span></div>
    <div class="brloss">เสีย <b>${lost}</b> ตัว</div></div>`;
  const rt=r.retreat?`${gname(S,r.retreat.s)}ถอยไป${cname(S,r.retreat.to)}`:'';
  const atkWon=r.aWin;
  const head=mine.includes(r.A)?(atkWon?'บุกสำเร็จ!':'บุกไม่สำเร็จ'):mine.includes(r.D)?(atkWon?'เสียช่องนี้ไป':'ป้องกันได้!'):`ศึกที่${cname(S,r.cell)}`;
  const d=document.createElement('div');d.id='battlepop';d.className='sky plain withboard';d.setAttribute('role','dialog');
  d.innerHTML=`<div class="boardcard bres"><div class="bhead"><b>${esc(head)}</b><span class="small muted">${esc(cname(S,r.cell))} · รอบ ${r.round}</span></div>
    <div class="bpgrid">${side(r.A,pA,r.sA,r.ac,r.lossA,atkWon)}<div class="bpvs">VS</div>${side(r.D,pD,r.sD,r.dc,r.lossD,!atkWon)}</div>
    <div class="bwarn">${atkWon?`${esc(gname(S,r.A))} ชนะ${r.lossA<(pA[0]||[0,0])[1]?' · ได้ +1 คะแนนถาวรและบาป +1':''}`:`${esc(gname(S,r.D))} ป้องกันได้${r.sA===r.sD?' (เสมอ ฝ่ายรับชนะ)':''}`}${rt?' · '+esc(rt):''}</div></div>
    <button class="primary skyclose" id="bpclose">ตกลง</button>`;
  const gid=GID;const show=()=>{if(view.name!=='game'||GID!==gid)return;if(document.getElementById('sky')){setTimeout(show,400);return}const o=document.getElementById('battlepop');if(o)o.remove();document.body.appendChild(d);
    const close=()=>{d.classList.add('out');setTimeout(()=>d.remove(),300)};document.getElementById('bpclose').onclick=close;d.onclick=e=>{if(e.target===d)close()}};
  show();
}
function lastBattleBox(S){
  const r=S.last;if(!r||S.battle||!r.kA)return '';
  const fmt=parts=>parts.map(x=>Array.isArray(x)?x:[x.l,x.v]).map(([l,v])=>`${esc(l)} ${v>=0?'+':''}${v}`).join(' · ');
  const side=(s,parts,tot,kparts,lost,win,card)=>`<div style="min-width:0;flex:1 1 150px"><div class="row"><span class="dot" style="background:${SEATC(s)}"></span><b>${esc(gname(S,s))}</b>${win?' <span class="chip">ชนะ</span>':''}</div>
    <div class="small">${esc(CARD[card].n)} · พลังรวม <b class="tab">${tot}</b></div>
    <div class="small muted">${fmt(parts)}</div>
    <div class="small">ฆ่าฝ่ายตรงข้าม: ${fmt(kparts)} · <b>เสียไป ${lost} ตัว</b></div></div>`;
  const rt=r.retreat?`${esc(gname(S,r.retreat.s))}ถอยไป${esc(cname(S,r.retreat.to))}`:'ไม่มีการถอย';
  return `<details class="panel" open><summary>ศึกล่าสุด: ${esc(cname(S,r.cell))} (รอบ ${r.round})</summary>
   <div class="row" style="align-items:flex-start;margin-top:8px;gap:14px">${side(r.A,r.pA,r.sA,r.kA,r.lossA,r.aWin,r.ac)}<div class="muted" style="align-self:center">บุก → รับ</div>${side(r.D,r.pD,r.sD,r.kD,r.lossD,!r.aWin,r.dc)}</div>
   <p class="small muted" style="margin-top:6px">${r.aWin?'ฝ่ายบุกชนะ':'ฝ่ายรับชนะ'}${r.sA===r.sD?' (เสมอ ฝ่ายรับชนะ)':''} · ${rt}</p></details>`;
}
const fmtMods=l=>l.length?l.map(([n,v])=>`${n} ${v>=0?'+':'−'}${Math.abs(v)}`).join(', '):'ไม่มี';
function defBonusText(S,s,cell){const b=S.battle;const m=mountsAt(S,cell,s);
  const bm=battleMods(S,b.a,s,b.n,S.B[cell].t,mList([b.mount,b.mount2]),m,cell,b.from);
  let t=fmtMods(bm.d);if(hm(m,'naga'))t+=' · นาคลดความเสียหาย 1';if(hm(m,'khotchasi'))t+=' · คชสีห์ลดความเสียหาย 1';return t}
function modeBox(S,act){
  const cancel=`<button class="ghost" id="cancel">ยกเลิก</button>`;
  if(ui.mode==='move-src')return `<div class="banner row">เลือกกองที่จะเดิน (วงประ) ${cancel}</div>`;
  if(ui.mode==='move-dst')return `<div class="banner row">เลือกปลายทาง ช่องที่มีศัตรู = รบ ${cancel}</div>`;
  if(ui.mode==='recruit')return `<div class="banner row">เลือกช่องที่จะลงทหาร ${cancel}</div>`;
  if(ui.mode==='vajra')return `<div class="banner row">เลือกกองศัตรูที่จะฟาดวชิราวุธ ${cancel}</div>`;
  if(ui.mode==='assn')return `<div class="banner row">เลือกกองศัตรูที่จะลอบสังหาร (เสีย 1 ตัว) ${cancel}</div>`;
  if(ui.mode==='warp-src')return `<div class="banner row">🌀 เคลื่อนย้ายมิติ: เลือกกองที่จะย้าย (ย้ายทั้งกอง) ${cancel}</div>`;
  if(ui.mode==='warp-dst')return `<div class="banner row">🌀 เลือกช่องปลายทาง (ช่องว่างหรือกองของคุณ) ${cancel}</div>`;
  if(ui.mode==='swap-a')return `<div class="banner row">🔀 เลือกกองแรกที่จะสลับ ${cancel}</div>`;
  if(ui.mode==='swap-b')return `<div class="banner row">🔀 เลือกกองที่สองที่จะสลับด้วย ${cancel}</div>`;
  if(ui.mode==='avatar-pick')return `<div class="banner stack"><div>เลือกพาหนะที่จะย้าย</div><div class="row">${mountsOf(S,act).map(k=>`<button data-am="${k}">${mPic(k)} ${MOUNTS[k].name}</button>`).join('')}${cancel}</div></div>`;
  if(ui.mode==='avatar-dst')return `<div class="banner row">เลือกกองของคุณที่จะให้${MOUNTS[ui.am].name}ไปอยู่ ${cancel}</div>`;
  if(ui.mode==='merit'){return `<div class="banner stack"><div>ทำบุญแบบไหน</div><div class="row"><button class="primary" data-mm="merit">บุญ +${meritAmt(S,act)}</button><button data-mm="sin" ${S.P[act].sin?'':'disabled'}>ลบบาป 1</button>${cancel}</div></div>`}
  if(ui.mode==='move-cfg'){
    const src=ui.src,dst=ui.dst,c=S.B[src];const strike=ui.dest[dst]==='strike';const battle=ui.dest[dst]==='battle'||strike;
    const maxN=c.t;
    const room=battle?99:(cap(S,act,dst)-(S.B[dst].o===act?S.B[dst].t:0));
    const nMax=Math.min(maxN,room,battle?(has(S,act,'fort')?6:5):99);
    if(ui.n==null||ui.n>nMax)ui.n=nMax;
    if(nMax<1)return `<div class="banner row">${esc(cname(S,dst))}มีทหารเต็มแล้ว เลือกช่องอื่น ${cancel}</div>`;
    const co=carryOpts(S,act,src,dst,ui.n,!!ui.bonus);
    if(ui.carry==null||!co.ok.includes(ui.carry))ui.carry=co.def;
    const c2=carry2Opts(S,act,src,dst,ui.carry);if(ui.carry2&&!c2.includes(ui.carry2))ui.carry2='';
    const lim4=twoMountCap(S,act,dst,battle,ui.carry,ui.carry2);if(lim4!=null&&ui.n>lim4)ui.n=Math.max(1,lim4);
    const mlist=mountsAt(S,src,act);
    const carryUI=mlist.length?`<div class="stack" style="gap:4px"><div class="small"><b>พาพาหนะไปด้วยไหม</b> (กองหนึ่งพาได้ ${mLimit(S,act)} ตัว)</div><div class="row">${[''].concat(mlist).map(k=>{const ok=co.ok.includes(k);
      return `<label class="mopt ${ui.carry===k?'on':''} ${ok?'':'off'}"><input type="radio" name="carry" value="${k}" ${ui.carry===k?'checked':''} ${ok?'':'disabled'}>${k?`<span class="mic">${mPic(k)}</span>${esc(MOUNTS[k].name)}`:'ไม่พา'}</label>`}).join('')}</div>${co.note?`<div class="small muted">${esc(co.note)}</div>`:''}
      ${c2.length?`<div class="small"><b>พาหนะตัวที่ 2 (จอมทัพ)</b> · กองที่มีพาหนะ 2 ตัวมีทหารได้ไม่เกิน 4</div><div class="row">${[''].concat(c2).map(k=>`<label class="mopt ${(ui.carry2||'')===k?'on':''}"><input type="radio" name="carry2" value="${k}" ${(ui.carry2||'')===k?'checked':''}>${k?`<span class="mic">${mPic(k)}</span>${esc(MOUNTS[k].name)}`:'ไม่พา'}</label>`).join('')}</div>`:''}</div>`:'';
    return `<div class="banner stack"><div><b>${strike?'🌀 จู่โจมจากเงา บุก':battle?'บุก':'เดินไป'}${esc(cname(S,dst))}</b>${strike?' <span class="small muted">(ชนะแล้วกลับช่องเดิม แพ้แล้วถอยจากช่องเดิม)</span>':''}${battle?` · ศัตรู ${S.B[dst].t} ตัว (${esc(gname(S,S.B[dst].o))})`:''}</div>
      <div class="row">จำนวนทหาร <button id="nm" ${ui.n<=1?'disabled':''} aria-label="ลด">−</button><b class="tab">${ui.n}</b><button id="np" ${ui.n>=(lim4!=null?Math.min(nMax,lim4):nMax)?'disabled':''} aria-label="เพิ่ม">+</button><span class="small muted">สูงสุด ${lim4!=null?Math.min(nMax,lim4):nMax}</span></div>
      ${carryUI}
      ${battle?`<div>เลือกการ์ดรบ (ฝ่ายรับไม่เห็นจนกว่าจะเปิด)</div><div class="cards">${availCards(S,act).map(c=>cardBtn(c,'data-ac',ui.card===c)).join('')}</div>
      <div class="small muted">โบนัสบุกของคุณ: ${atkBonusText(S,act,mList([ui.carry,ui.carry2]),dst,ui.n,src)}</div>`:''}
      <div class="row"><button class="primary" id="go" ${(battle&&ui.card==null)||!co.ok.length?'disabled':''}>${battle?'บุก':'เดิน'}</button>${cancel}</div></div>`;
  }
  return '';
}
/* จอมทัพ: พาหนะตัวที่ 2 */
function carry2Opts(S,s,src,dst,c1){if(!c1||mLimit(S,s)<2)return [];const battle=S.B[dst].t>0&&S.B[dst].o!==s;
  const room=battle||dst===cityOf(s)?2:2-mountsAt(S,dst,s).length;if(room<2)return [];
  return mountsAt(S,src,s).filter(k=>k!==c1)}
/* กองที่จะมีพาหนะ 2 ตัว มีทหารได้สูงสุด 4 */
function twoMountCap(S,s,dst,battle,c1,c2){if(dst===cityOf(s))return null;const inc=mList([c1,c2]).length;
  const tot=inc+(battle?0:mountsAt(S,dst,s).length);if(tot<2)return null;return 4-(battle?0:(S.B[dst].o===s?S.B[dst].t:0))}
/* ตัวเลือกพาพาหนะ: '' = ไม่พา */
function carryOpts(S,s,src,dst,n,bonus){
  const list=mountsAt(S,src,s);const isCity=src===cityOf(s);const battle=S.B[dst].t>0&&S.B[dst].o!==s;
  const dstHas=!battle&&dst!==cityOf(s)&&mountsAt(S,dst,s).length>=mLimit(S,s);
  const can=m=>!!reachable(S,s,src,m||null,bonus?1:0)[dst];
  const ok=[];let note='';
  const mustCarry=!isCity&&list.length&&n===S.B[src].t;
  if(can(null)&&!mustCarry)ok.push('');
  for(const k of list){if(dstHas){note='ปลายทางมีพาหนะของคุณอยู่แล้ว พาไปเพิ่มไม่ได้';continue}if(can(k))ok.push(k)}
  if(mustCarry&&!dstHas)note='ทหารออกหมดกอง พาหนะต้องไปด้วย';
  if(mustCarry&&dstHas&&can(null)){ok.push('');note='ปลายทางมีพาหนะแล้ว พาหนะกองนี้จะกลับเมือง'}
  if(!can(null)&&ok.length&&!note)note='ช่องนี้ไกลเกิน 1 ช่อง ต้องพาพาหนะที่เดินได้ 2 ช่อง';
  const def=!isCity&&list.length&&ok.includes(list[0])?list[0]:ok.includes('')?'':(ok[0]??'');
  return {ok,def,note};
}
function atkBonusText(S,s,m,cell,n,from){const D=S.B[cell].o;const mD=D>=0?mountsAt(S,cell,D):[];
  const bm=battleMods(S,s,D,n,S.B[cell].t,m,mD,cell,from);let t=fmtMods(bm.a);
  if(has(S,s,'vanguard')&&n>S.B[cell].t)t+=' · ทัพหน้า: ศัตรูเสีย 1 ก่อนรบ';if(isGod(S,s,'skanda')&&n>S.B[cell].t)t+=' · ขุนพลเทวดา: ฆ่า +1';
  if(hm(m,'rajasi'))t+=' · ราชสีห์: ชนะแล้วฆ่า +1';if(hm(m,'makara'))t+=' · มกร: รับความเสียหาย −1';return t}
const SUN=`<svg class="phicon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="10" fill="var(--gold)"/>${[0,45,90,135,180,225,270,315].map(d=>`<line x1="24" y1="5" x2="24" y2="11" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" transform="rotate(${d} 24 24)"/>`).join('')}</svg>`;
const MOON=`<svg class="phicon" viewBox="0 0 48 48" aria-hidden="true"><path d="M30 7a17 17 0 1 0 11 29A14 14 0 0 1 30 7z" fill="var(--nightline)"/><circle cx="12" cy="12" r="1.6" fill="var(--nightline)"/><circle cx="40" cy="18" r="1.2" fill="var(--nightline)"/><circle cx="36" cy="42" r="1.4" fill="var(--nightline)"/></svg>`;
/* แอนิเมชันพระอาทิตย์/พระจันทร์ขึ้น เมื่อเข้ารอบใหม่ (จำว่าเครื่องนี้เห็นรอบไหนแล้ว จึงเห็นแม้เปิดมาทีหลัง) */
const PH_SEEN={};
function checkPhase(S){
  if(!S||S.status!=='play'||!GID)return;
  const key='hmp-ph-'+GID;let seen=PH_SEEN[GID];
  if(seen===undefined&&!isTut(GID)){try{const v=localStorage.getItem(key);if(v!=null)seen=+v}catch(e){}}
  PH_SEEN[GID]=S.round;if(!isTut(GID)){try{localStorage.setItem(key,String(S.round))}catch(e){}}
  if(seen!==undefined&&seen<S.round)skyShow(S);
}
const SUN_BIG=`<svg class="orbsvg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="26" fill="#F2B21B"/><circle cx="60" cy="60" r="34" fill="none" stroke="#F2B21B" stroke-opacity=".25" stroke-width="6"/>${[0,30,60,90,120,150,180,210,240,270,300,330].map(d=>`<line x1="60" y1="6" x2="60" y2="18" stroke="#F2B21B" stroke-width="5" stroke-linecap="round" transform="rotate(${d} 60 60)"/>`).join('')}</svg>`;
const MOON_BIG=`<svg class="orbsvg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="40" fill="#F4ECCB" fill-opacity=".12"/><path d="M72 22a38 38 0 1 0 26 64A32 32 0 0 1 72 22z" fill="#F4ECCB"/></svg>`;
/* ผู้ท้าชิง: ถึงเป้าตอนจบกลางคืน ต้องรักษาไว้จนจบกลางคืนถัดไป */
function chalOf(S){return (S.chal||[]).filter(s=>s>=0&&s<S.n)}
const chalNames=(S,l)=>l.map(s=>`<span class="nxt"><span class="ordno sm" style="background:${SEATC(s)}"></span><b>${esc(gname(S,s))}</b></span>`).join(' ');
function chalAlert(S,snap){
  if(!snap)return '';const ch=snap.chal||[],lost=(snap.lost||[]).filter(s=>!ch.includes(s));if(!ch.length&&!lost.length)return '';
  const mine=mySeats(S);const meIn=ch.some(s=>mine.includes(s));
  return `<div class="chalert ${ch.length?'':'ok'}" role="alert">${ch.length?`<div class="chtitle">⚔ ผู้ท้าชิงบัลลังก์!</div>
    <div>${chalNames(S,ch)} ถึง <b>${S.target}</b> คะแนนแล้ว</div>
    ${(snap.lost||[]).some(x=>ch.includes(x))?`<div class="small">(${chalNames(S,(snap.lost||[]).filter(x=>ch.includes(x)))} รักษาคะแนนก่อนจบรอบไม่อยู่ แต่ได้แต้มจบรอบจนกลับมาถึงเป้า เริ่มนับ 1 วันใหม่)</div>`:''}
    <div class="small">${meIn?'คุณต้อง<b>รักษาคะแนนให้ถึงเป้า</b>ผ่านกลางวันนี้และกลางคืนหน้า ถ้าจบกลางคืนหน้ายังถึงอยู่ = ชนะ!':'ยังไม่ชนะ! มีเวลา<b>ทั้งกลางวันนี้และกลางคืนหน้า</b> แย่งวัด/เขาพระสุเมรุคืน ทำให้คะแนนเขาต่ำกว่าเป้าก่อนจบกลางคืน'}</div>`:''}
    ${lost.length?`<div class="small" style="${ch.length?'margin-top:6px;border-top:1px dashed currentColor;padding-top:6px':''}">🛡 ${chalNames(S,lost)} รักษาคะแนนไม่อยู่ หลุดจากผู้ท้าชิง เกมเล่นต่อ</div>`:''}</div>`;
}
function chalBar(S){const ch=chalOf(S);if(!ch.length)return '';const night=S.moon==='wane';
  return `<div class="chalbar" style="flex:1 1 100%">⚔ <b>ผู้ท้าชิง</b>: ${chalNames(S,ch)} · ${night?'<b>จบกลางคืนนี้ ถ้ายังถึง '+S.target+' คะแนน = ชนะ</b>':'ต้องรักษา '+S.target+' คะแนนผ่านกลางวันนี้และกลางคืนหน้า'} <span class="muted">(ตอนนี้ ${ch.map(s=>esc(gname(S,s))+' '+total(S,s)).join(', ')})</span></div>`}
function skyShow(S){sfx('gong');
  const day=S.moon==='wax';const old=document.getElementById('sky');if(old)old.remove();
  const d=document.createElement('div');d.id='sky';d.className='sky withboard '+(day?'day':'night');d.setAttribute('role','dialog');d.setAttribute('aria-label','สรุปคะแนนจบรอบ');
  const snap=S.snap&&S.snap.r===S.round-1?S.snap:null;
  d.innerHTML=`${day?'':'<div class="stars" aria-hidden="true"></div>'}<div class="skyhead"><div class="skyorb sm">${day?SUN_BIG:MOON_BIG}</div>
    <div class="skytxt"><b>${day?'กลางวัน':'กลางคืน'} · รอบ ${S.round}</b><small>${day?'ฝ่ายบุกไม่มีโบนัส · จบรอบนี้วัดให้บุญ +1 · ยังไม่ตัดสินผู้ชนะ':'ฝ่ายบุกได้พลังรบ +1 · '+(chalOf(S).length?'<b>จบรอบนี้ ผู้ท้าชิงที่ยังถึงเป้า = ชนะ!</b>':'จบรอบนี้ใครถึงเป้าจะเป็นผู้ท้าชิง')}</small></div></div>
    ${chalAlert(S,snap)}${boardHTML(S,snap)}<button class="primary skyclose" id="skyclose">ไปต่อ</button>`;
  document.body.appendChild(d);
  const close=()=>{if(!d.isConnected)return;d.classList.add('out');setTimeout(()=>d.remove(),450)};
  document.getElementById('skyclose').onclick=e=>{e.stopPropagation();close()};
  d.onclick=e=>{if(e.target===d)close()};
  animateBoard(d);
}
/* ตารางคะแนน: snap = คะแนนตอนจบรอบ (มีอันดับรอบก่อน ใช้ทำแอนิเมชันเลื่อนอันดับ) ถ้าไม่มีใช้คะแนนสด */
function boardHTML(S,snap){
  const n=S.n;if(snap&&!snap.vp)snap=null;
  const sc=snap?snap.vp.map((v,i)=>[v,snap.tp[i]]):[...Array(n).keys()].map(s=>[S.P[s].vp,tempVP(S,s)]);
  const tot=s=>sc[s][0]+sc[s][1];
  const rank=snap?snap.rank:[...Array(n).keys()].sort((a,b)=>tot(b)-tot(a)||sc[b][0]-sc[a][0]||a-b);
  const prev=snap&&snap.prev&&snap.prev.length===n?snap.prev:rank;
  const prevSc=snap&&snap.pvp?snap.pvp.map((v,i)=>[v,snap.ptp[i]]):null;
  const T=S.target;const best=tot(rank[0]);const mine=mySeats(S);
  const nightNext=S.moon==='wane';
  const rows=rank.map((s,i)=>{const [p,t]=sc[s];const left=Math.max(0,T-tot(s));const was=prev.indexOf(s);const mv=was-i;
    const gain=prevSc?tot(s)-(prevSc[s][0]+prevSc[s][1]):0;
    const danger=left<=2;const lord=snap&&snap.lords&&snap.lords.includes(s);
    const pw=Math.min(100,p/T*100),tw=Math.min(100-pw,t/T*100);
    return `<div class="brow ${danger?'danger':''} ${mine.includes(s)?'me':''}" data-from="${was}" data-to="${i}">
      <span class="bpos" data-final="${i===0?'👑':i+1}">${was===0?'👑':was+1}</span>
      <div class="bmain"><div class="bname"><span class="dot" style="background:${SEATC(s)}"></span><b>${esc(gname(S,s))}</b> <span class="bwho">${esc(pname(S.seats[s].uid,'ผู้เล่น'))}</span>
        ${mv>0?`<span class="bmv up">▲${mv}</span>`:mv<0?`<span class="bmv down">▼${-mv}</span>`:''}${lord?'<span class="btag">ครองแดน +1</span>':''}${chalOf(S).includes(s)?'<span class="btag chal">⚔ ผู้ท้าชิง</span>':''}</div>
        <div class="bbar" aria-hidden="true"><span class="bp" style="width:${pw}%;background:${SEATC(s)}"></span><span class="bt" style="width:${tw}%;--c:${SEATC(s)}"></span></div>
        <div class="bsub">ถาวร <b>${p}</b> · ชั่วคราว <b>${t}</b>${gain?` · รอบนี้ ${gain>0?'+':''}${gain}`:''}</div></div>
      <div class="bscore"><b>${tot(s)}</b><small>${left?`อีก ${left}`:'ถึงเป้า!'}</small></div></div>`}).join('');
  const lead=rank[0];const leadLeft=Math.max(0,T-best);
  const ch=chalOf(S);
  const warn=ch.length?`⚔ ผู้ท้าชิง: ${ch.map(x=>esc(gname(S,x))).join(', ')} ${nightNext?'ถ้ายังถึง '+T+' คะแนนตอนจบกลางคืนนี้ = ชนะ! รุมด่วน':'ต้องรักษา '+T+' คะแนนให้ได้จนจบกลางคืนหน้า'}`
    :leadLeft===0?`⚠ ${esc(gname(S,lead))} ถึง ${T} คะแนนแล้ว${nightNext?' ถ้าถึงเป้าตอนจบกลางคืนนี้ จะเป็นผู้ท้าชิง (ต้องรักษาต่ออีก 1 วัน)':' จบกลางคืนหน้ายังถึงอยู่ จะเป็นผู้ท้าชิง'}`
    :leadLeft<=2?`⚠ ${esc(gname(S,lead))} ขาดอีกแค่ ${leadLeft} คะแนน ระวังไว้`:`เป้าหมาย ${T} คะแนน · ถึงเป้าตอนจบกลางคืน แล้วรักษาไว้ได้อีก 1 วัน = ชนะ`;
  return `<div class="boardcard"><div class="bhead"><b>ตารางคะแนน</b><span class="blegend"><span class="lg1"></span>ถาวร <span class="lg2"></span>ชั่วคราว (วัด/เขา หายได้ถ้าโดนยึด)</span></div>
    <div class="board" style="height:${n*62}px">${rows}</div><div class="bwarn ${leadLeft<=2||ch.length?'hot':''}">${warn}</div></div>`;
}
function animateBoard(root){
  const rows=[...root.querySelectorAll('.brow')];
  rows.forEach(r=>{r.style.transform=`translateY(${(+r.dataset.from)*62}px)`});
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>rows.forEach(r=>{r.style.transform=`translateY(${(+r.dataset.to)*62}px)`;const b=r.querySelector('.bpos');if(b)b.textContent=b.dataset.final;if(r.dataset.from!==r.dataset.to)r.classList.add('moved')}),reduce?0:1100);
}
function openBoard(S){const old=document.getElementById('sky');if(old)old.remove();
  const d=document.createElement('div');d.id='sky';d.className='sky withboard plain';d.setAttribute('role','dialog');
  d.innerHTML=`${boardHTML(S,null)}<button class="primary skyclose" id="skyclose">ปิด</button>`;document.body.appendChild(d);
  const close=()=>{d.classList.add('out');setTimeout(()=>d.remove(),300)};document.getElementById('skyclose').onclick=close;d.onclick=e=>{if(e.target===d)close()};
  d.querySelectorAll('.brow').forEach(r=>{r.style.transform=`translateY(${(+r.dataset.to)*62}px)`;const b=r.querySelector('.bpos');if(b)b.textContent=b.dataset.final})}
function phaseBox(S){
  if(S.status!=='play')return '';
  const day=S.moon==='wax';
  const left=[...Array(S.n).keys()].filter(s=>hasActions(S,s)).length;
  return `<div class="phase ${day?'day':'night'}" role="status">${day?SUN:MOON}
    <div style="min-width:0;flex:1 1 220px"><b class="phtitle">${day?'กลางวัน':'กลางคืน'} · รอบ ${S.round}</b>
      <div class="small">${day?'ตอนจบรอบนี้ ได้บุญ +1 ต่อวัดที่ยึดอยู่ · ยังไม่ตัดสินผู้ชนะ':'ฝ่ายบุกได้พลังรบ +1 ทุกการรบ · '+(chalOf(S).length?'<b>จบรอบนี้ ผู้ท้าชิงที่ยังถึง '+S.target+' คะแนน = ชนะ</b>':'จบรอบนี้ใครถึง '+S.target+' คะแนน จะเป็นผู้ท้าชิง')}</div></div>
    <div class="small phnext">รอบหน้า: <b>${day?'กลางคืน':'กลางวัน'}</b><br>ยังต้องเดินอีก ${left} คนในรอบนี้<br><button class="ghost small" id="openboard">📊 ตารางคะแนน</button></div>
    ${chalBar(S)}<div class="small" style="flex:1 1 100%;border-top:1px dashed var(--line);padding-top:6px"><b>ครองแดน</b> (ยึดวัด 2 แห่งขึ้นไป หรือเขาพระสุเมรุ จน<b>จบรอบกลางคืน</b> ได้ +1 ถาวร${S.moon==='wax'?' · รอบนี้กลางวัน ยังไม่นับ':' · <b>นับตอนจบรอบนี้</b>'}) · ตอนนี้เข้าเงื่อนไข: ${(()=>{const l=[...Array(S.n).keys()].filter(s=>rulesLand(S,s));return l.length?l.map(s=>`<span class="nxt"><span class="ordno sm" style="background:${SEATC(s)}"></span>${esc(gname(S,s))} <span class="muted">(${esc(landWhy(S,s))})</span></span>`).join(' '):'ยังไม่มีใคร'})()}</div></div>`;
}
function playersBox(S,act){
  const nxt=S.status==='play'?nextOrder(S):S.order;
  return `<div class="panel"><h3 style="margin-bottom:4px">ลำดับเล่นรอบนี้</h3><p class="small muted" style="margin:0 0 8px">ทุกต้นรอบเรียงใหม่ คะแนนน้อยสุดเล่นก่อน</p><div class="players">${S.order.map((s,idx)=>{const p=S.P[s];
    const doneAll=S.status==='play'&&!hasActions(S,s);
    return `<div class="pl ${s===act?'turn':''}" style="${doneAll?'opacity:.7':''}"><span class="ordno" style="background:${SEATC(s)}" aria-label="ลำดับที่ ${idx+1}">${idx+1}</span>
     <div><button class="godlink" ${infoAttr('god:'+godOf(S,s))}>${godOf(S,s)?godPic(godOf(S,s),'av'):''}<b>${esc(gname(S,s))}</b></button> <span class="small muted">${esc(pname(S.seats[s].uid,'ผู้เล่น'))}</span>
       <div class="small muted">${s===act?'<b style="color:var(--ink)">กำลังเดิน</b> · ':''}แอคชัน ${p.used.length}/${actionLimit(S,s)}${doneAll?' · เดินครบแล้ว':''}</div></div>
     <div class="stats"><span title="คะแนนรวม">★ ${total(S,s)}</span><span title="บุญ">บุญ ${p.merit}</span><span title="บาป" style="color:${p.sin>=2?'var(--warn)':'inherit'}">บาป ${p.sin}/3</span></div>
     <div class="chips"><span class="chip tab">ถาวร ${p.vp} · วัด ${tempVP(S,s)}</span>${hidesCards(S,s)&&!viewers(S).includes(s)?'<span class="chip muted">การ์ดรบ: ซ่อน</span>':''}<span class="bcmini-wrap" aria-label="การ์ดรบ" ${hidesCards(S,s)&&!viewers(S).includes(s)?'hidden':''}>${hand(S,s).map(c=>{const used=p.uc.includes(c);return `<span class="bcmini ${used?'used':''}" data-tip="${esc(CARD[c].n)} · พลัง ${CARD[c].s} ฆ่า ${CARD[c].k}${used?' · ใช้ไปแล้ว':' · ยังอยู่ในมือ'}" tabindex="0"><b>${CARD[c].s}</b>/${CARD[c].k}</span>`}).join('')}<span class="small muted" style="margin-left:2px">${p.uc.length?`ใช้แล้ว ${p.uc.length} · ใช้ครบเมื่อไรได้คืนทั้งชุด`:'ครบมือ'}</span></span><span class="chip tab">คลัง ${reserveHidden(S,s,viewers(S))?'?':reserve(S,s)}</span>
     ${mountsOf(S,s).map(k=>`<button class="chip info mount" ${infoAttr('mount:'+k)}><span class="mic">${mPic(k)}</span>${MOUNTS[k].name}</button>`).join('')}${p.pw.map(id=>`<button class="chip info line-${PW[id].line}" ${infoAttr('pw:'+id)}>${PW[id].name}</button>`).join('')}</div></div>`}).join('')}</div>
     ${S.status==='play'?`<p class="small" style="margin:10px 0 0"><b>รอบหน้า</b> (ถ้าคะแนนเป็นแบบตอนนี้): ${nxt.map((s,i)=>`<span class="nxt"><span class="ordno sm" style="background:${SEATC(s)}">${i+1}</span>${esc(gname(S,s))}</span>`).join(' ')}</p>`:''}
     ${act>=0&&GOD[godOf(S,act)]?`<p class="small muted" style="margin-top:6px">${esc(GOD[godOf(S,act)].ab)}: ${esc(GOD[godOf(S,act)].txt)}</p>`:''}</div>`;
}
const SHOP={open:false,tab:'pw'};
function shopBox(S,s,live){
  const canBuy=live&&!S.follow&&!S.battle&&!S.retreat&&!S.disarm&&actionOK(S,s,'buy');
  const lab={ok:'',mine:'ของคุณ',taken:'มีเจ้าของ',locked:'ต้องมีเลเวลก่อนหน้า',poor:'บุญไม่พอ',off:'ปิดในห้องนี้',todo:'ยังไม่เปิด'};
  const col=line=>`<div class="stack" style="gap:6px"><b class="lhead line-${line}">${LINES[line]}</b>${[1,2,3].map(lv=>POWERS.filter(p=>p.line===line&&p.lv===lv).map(p=>{const st=powerState(S,s,p.id);
    return `<button class="pw line-${line} ${st==='ok'&&canBuy?'can':''} ${st==='mine'||st==='taken'?'owned':''}" data-buy="${p.id}" ${st==='ok'&&canBuy?'':'disabled'}><span class="nm"><span>${p.name}</span><span class="cost tab"><span>Lv.${p.lv}</span><span>${priceOf(S,s,{pw:p.id})} บุญ</span></span></span><span class="tx">${esc(p.txt)}${lab[st]?'<br><i>'+lab[st]+'</i>':''}</span></button>`}).join('')).join('')}</div>`;
  const freeM=MK.filter(k=>!S.M[k]).length;const freeP=POWERS.filter(p=>!p.todo&&powerState(S,s,p.id)!=='off'&&!S.P.some(q=>q.pw.includes(p.id))).length;
  const note=!live?`<p class="small muted">ยังไม่ใช่ตาคุณ เปิดดูวางแผนได้ ราคาและสถานะคิดจาก${esc(gname(S,s))}</p>`:canBuy?'':`<p class="small muted">${S.battle||S.follow||S.retreat||S.disarm?'ซื้อได้หลังศึกนี้จบ':'รอบนี้ใช้แอคชันขอพรไปแล้ว'}</p>`;
  const tab=(id,label)=>`<button class="shoptab ${SHOP.tab===id?'on':''}" data-shoptab="${id}" role="tab" aria-selected="${SHOP.tab===id}">${label}</button>`;
  return `<details class="panel shopwrap" ${SHOP.open?'open':''} id="shopd"><summary>ขอพร (บุญ${live?'คุณ':'ของ'+esc(gname(S,s))} ${S.P[s].merit})</summary>
   <div class="stack" style="margin-top:10px">
   <div class="shoptabs" role="tablist">${tab('pw',`🃏 การ์ดพลัง <span class="muted">(เหลือ ${freeP})</span>`)}${tab('mount',`🐾 สัตว์พาหนะ <span class="muted">(ว่าง ${freeM})</span>`)}</div>
   ${note}
   ${SHOP.tab==='pw'?`<div class="shop pwshop c${activeLines(S).length}">${activeLines(S).map(col).join('')}</div>`
     :`<div class="shop mshop">${MK.map(k=>{const st=mountState(S,s,k);const m=MOUNTS[k];const own=OWNER_GOD[k]===godOf(S,s);
     return `<button class="pw mnt ${st==='ok'&&canBuy?'can':''} ${st==='mine'||st==='taken'?'owned':''}" data-mount="${k}" ${st==='ok'&&canBuy?'':'disabled'}><span class="nm"><span><span class="mic">${mPic(k)}</span>${m.name}</span><span class="cost tab"><span>${priceOf(S,s,{mount:k})} บุญ</span></span></span><span class="tx">${m.txt} · ถิ่น: ${HOME[k]} +1${own&&m.bonus?' · <b>ของคุณได้โบนัส</b>: '+m.bonus.split(': ')[1]:''}${lab[st]?'<br><i>'+(st==='taken'?'เป็นของ'+esc(gname(S,S.M[k].o)):lab[st])+'</i>':''}</span></button>`}).join('')}</div>`}
   </div></details>`;
}
function wireGame(S,act){
  const $=id=>document.getElementById(id);
  const b2=$('back2');if(b2)b2.onclick=showLobby;
  const re=()=>render();
  const sd=$('shopd');if(sd)sd.ontoggle=()=>{SHOP.open=sd.open};
  app.querySelectorAll('[data-shoptab]').forEach(b=>b.onclick=()=>{SHOP.tab=b.dataset.shoptab;SHOP.open=true;re()});
  if($('cancel'))$('cancel').onclick=()=>{ui={mode:null,shop:ui.shop};re()};
  app.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{
    const a=b.dataset.act;
    if(a==='move'){ui={mode:'move-src',shop:ui.shop};re()}
    else if(a==='recruit'){const t=recruitTargets(S,act).filter(j=>recruitN(S,act,j)>0);if(t.length===1)doRecruit(t[0]);else{ui={mode:'recruit',shop:ui.shop};re()}}
    else if(a==='merit'){if(has(S,act,'atone')||S.P[act].sin===0)doMerit('merit');else{ui={mode:'merit'};re()}}
    else if(a==='buy'){SHOP.open=true;re();const d=$('shopd');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}}
  });
  app.querySelectorAll('[data-mm]').forEach(b=>b.onclick=()=>doMerit(b.dataset.mm));
  if($('pass'))$('pass').onclick=doPass;

  app.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>doBuy({pw:b.dataset.buy}));
  app.querySelectorAll('[data-mount]').forEach(b=>b.onclick=()=>doBuy({mount:b.dataset.mount}));
  app.querySelectorAll('[data-dc]').forEach(b=>b.onclick=()=>doDefend(+b.dataset.dc));
  app.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>{ui.card=+b.dataset.ac;re()});
  if($('nm'))$('nm').onclick=()=>{ui.n--;re()};
  if($('np'))$('np').onclick=()=>{ui.n++;re()};
  app.querySelectorAll('input[name=carry]').forEach(r=>r.onchange=()=>{ui.carry=r.value;re()});
  app.querySelectorAll('input[name=carry2]').forEach(r=>r.onchange=()=>{ui.carry2=r.value;re()});
  app.querySelectorAll('[data-xc]').forEach(b=>b.onclick=()=>{const c=+b.dataset.xc;mutate(GID,T=>{if(!T.disarm||!iControl(T,disarmBy(T.disarm)))return false;if(!doDisarm(T,c))return false})});
  if($('go'))$('go').onclick=e=>{e.currentTarget.disabled=true;doMove()};
  if($('avatar'))$('avatar').onclick=()=>{ui={mode:'avatar-pick'};re()};
  if($('avswap'))$('avswap').onclick=()=>{ui={mode:'swap-a',via:'narai'};re()};
  if($('cswap'))$('cswap').onclick=()=>{ui={mode:'swap-a',via:'card'};re()};
  if($('warp'))$('warp').onclick=()=>{ui={mode:'warp-src'};re()};
  app.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{ui={mode:'avatar-dst',am:b.dataset.am};re()});
  if($('f-end'))$('f-end').onclick=()=>mutate(GID,T=>{if(!T.follow||!iControl(T,T.follow.seat))return false;T.follow=null;advance(T)});
  if($('f-vajra'))$('f-vajra').onclick=()=>{ui={mode:'vajra'};re()};
  if($('f-assn'))$('f-assn').onclick=()=>{ui={mode:'assn'};re()};
  if($('f-bonus'))$('f-bonus').onclick=()=>{const src=S.follow.bonusFrom;const dest=reachAny(S,act,src,1);if(!Object.keys(dest).length){toast('ไม่มีช่องให้เดินต่อ');return}ui={mode:'move-dst',src,dest,bonus:true};re()};
  app.querySelectorAll('.cell.click').forEach(g=>{const h=()=>onCell(S,act,+g.dataset.cell);g.onclick=h;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();h()}}});
}
function onCell(S,act,i){
  if(S.retreat){doRetreat(i);return}
  if(ui.mode==='move-src'){const dest=reachAny(S,act,i);ui={mode:'move-dst',src:i,dest};render()}
  else if(ui.mode==='move-dst'){ui.mode='move-cfg';ui.dst=i;ui.n=null;ui.carry=null;ui.carry2='';ui.card=null;
    render()}
  else if(ui.mode==='recruit')doRecruit(i);
  else if(ui.mode==='vajra')doVajra(i);
  else if(ui.mode==='avatar-dst')doAvatar(ui.am,i);
  else if(ui.mode==='assn')doVajra(i,true);
  else if(ui.mode==='warp-src'){ui={mode:'warp-dst',src:i};render()}
  else if(ui.mode==='warp-dst'){const src=ui.src;ui={mode:null};const s=activeSeat(G);mutate(GID,T=>{if(!guard(T,s))return false;if(!doWarpRule(T,s,src,i))return false})}
  else if(ui.mode==='swap-a'){ui={mode:'swap-b',src:i,via:ui.via};render()}
  else if(ui.mode==='swap-b'){const a=ui.src,via=ui.via;ui={mode:null};const s=activeSeat(G);mutate(GID,T=>{if(!guard(T,s))return false;if(via==='card'?(!has(T,s,'swap')||T.P[s].f.swap):(!isGod(T,s,'narai')||T.P[s].f.avatar))return false;if(!doSwapRule(T,s,a,i,via))return false})}
}
const guard=(T,s)=>T.status==='play'&&!T.battle&&!T.retreat&&!T.disarm&&!T.follow&&T.order[T.pos]===s&&iControl(T,s);
function doRecruit(cell){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'recruit'))return false;if(!recruitTargets(T,s).includes(cell))return false;
    if(!doRecruitRule(T,s,cell))return false;advance(T)})}
/* ไม่มีแอคชันไหนทำได้จริง เช่น บุญหมด ทำบุญไปแล้ว และเดินไม่ได้ */
function stuckNow(S,s){
  const moveable=S.B.some((c,i)=>c.o===s&&c.t>0&&Object.keys(reachAny(S,s,i)).length);
  const anyBuy=POWERS.some(x=>powerState(S,s,x.id)==='ok')||MK.some(k=>mountState(S,s,k)==='ok');
  return !(actionOK(S,s,'recruit')&&canRecruitAny(S,s))&&!(actionOK(S,s,'move')&&moveable)&&!actionOK(S,s,'merit')&&!(actionOK(S,s,'buy')&&anyBuy)&&hasActions(S,s);
}
function doPass(){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!stuckNow(T,s))return false;const a=['buy','recruit','move','merit'].find(x=>actionOK(T,s,x));if(!a)return false;
    markAction(T,s,a);T.P[s].merit+=1;log(T,`${gname(T,s)} ผ่านตา ได้บุญ +1`);advance(T)})}
function doMerit(kind){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'merit'))return false;const p=T.P[s];const g=meritAmt(T,s);
    if(has(T,s,'atone')){p.merit+=g;p.sin=Math.max(0,p.sin-1);log(T,`${gname(T,s)} ทำบุญ +${g} และไถ่บาป`)}
    else if(kind==='sin'&&p.sin>0){p.sin--;log(T,`${gname(T,s)} ทำบุญลบบาป 1`)}
    else{p.merit+=g;log(T,`${gname(T,s)} ทำบุญ +${g}`)}
    const mb=monkBonus(T,s);if(mb)log(T,`${gname(T,s)}${mb.replace(' · ',' ')}`);
    markAction(T,s,'merit');advance(T)})}
function doBuy(item){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!actionOK(T,s,'buy'))return false;const p=T.P[s];
    if(item.pw){if(powerState(T,s,item.pw)!=='ok')return false;const c=priceOf(T,s,item);p.merit-=c;p.pw.push(item.pw);
      if(['vpR','vpK','vpB','vpM'].includes(item.pw))p.vp+=1;log(T,`${gname(T,s)} ขอพรได้${PW[item.pw].name} (−${c} บุญ)`)}
    else{if(mountState(T,s,item.mount)!=='ok')return false;const c=priceOf(T,s,item);p.merit-=c;
      T.M[item.mount]={o:s,c:cityOf(s)};log(T,`${gname(T,s)} ได้${MOUNTS[item.mount].name}มาเป็นพาหนะ (−${c} บุญ)`)}
    markAction(T,s,'buy');advance(T)})}
function doMove(){
  const s=activeSeat(G);const {src,dst,n,card,bonus}=ui;const carry=ui.carry;const carry2=ui.carry2||null;
  if(src==null||dst==null||ui.mode!=='move-cfg'){ui={mode:null};render();return}
  ui={mode:null};
  const fail=m=>{window.__why=m;toast('เดินไม่ได้: '+m);return false};
  mutate(GID,T=>{
    if(bonus){if(!T.follow||T.follow.seat!==s||T.follow.bonusFrom!==src||!iControl(T,s))return fail('หมดจังหวะเดินต่อแล้ว')}
    else{if(!guard(T,s))return fail('ยังไม่ใช่ตาคุณ');if(!actionOK(T,s,'move'))return fail('ใช้แอคชันเดินทัพไปแล้ว')}
    const c=T.B[src];if(!c||c.o!==s||c.t<n||n<1)return fail('กองต้นทางเปลี่ยนไปแล้ว');
    const takeM=carry||null;if(takeM&&!mountsAt(T,src,s).includes(takeM))return fail('พาหนะไม่ได้อยู่ในกองนี้');
    const take2=takeM&&carry2&&carry2!==takeM&&mLimit(T,s)>=2&&mountsAt(T,src,s).includes(carry2)?carry2:null;
    const TK=mList([takeM,take2]);
    const m=takeM||mountAt(T,src,s);
    const dest=reachable(T,s,src,TK,bonus?1:0);const kind=dest[dst];if(!kind)return fail('ไปช่องนั้นไม่ถึง');
    if(TK.length&&kind!=='battle'&&kind!=='strike'&&dst!==cityOf(s)&&mountsAt(T,dst,s).length+TK.length>mLimit(T,s))return fail('ปลายทางมีพาหนะเต็มแล้ว');
    {const l4=twoMountCap(T,s,dst,kind==='battle'||kind==='strike',takeM,take2);if(l4!=null&&n>l4)return fail('กองที่มีพาหนะ 2 ตัว มีทหารได้ไม่เกิน 4')}
    if(!bonus)markAction(T,s,'move');
    const wasVajra=T.follow&&T.follow.vajra;
    T.follow=null;
    if(kind==='battle'||kind==='strike'){
      if(card==null||!availCards(T,s).includes(card))return fail('ยังไม่ได้เลือกการ์ดรบ');
      if(kind==='strike')T.P[s].f.strike=true;
      const path=movePath(T,s,src,dst,TK,bonus?1:0);
      removeTroops(T,src,n);for(const k of TK)T.M[k].c=-1;
      T.battle={a:s,d:T.B[dst].o,to:dst,from:src,path:kind==='strike'?[src,dst]:path,raid:kind==='strike',n,mount:takeM,mount2:take2,ac:card,bonusUsed:!!bonus,vajraPending:bonus?wasVajra:true};
      trail(T,{k:'atk',s,f:src,t:dst,n,m:takeM||null,p:kind==='strike'?[src,dst]:path});markMv(T,s,dst);
      log(T,`${gname(T,s)} ${kind==='strike'?'จู่โจมจากเงา':'ยกทัพ'} ${n} ตัวบุก${cname(T,dst)} ของ${gname(T,T.B[dst].o)}`);
      if(!c.t)sendMountsHome(T,src,s);
      return;
    }
    if(T.B[dst].o===s&&T.B[dst].t+n>cap(T,s,dst))return fail('ช่องปลายทางทหารเต็ม');
    const mpath=movePath(T,s,src,dst,TK,bonus?1:0);
    for(const k of TK)T.M[k].c=-1;removeTroops(T,src,n);placeTroops(T,s,dst,n);for(const k of TK)T.M[k].c=dst;
    trail(T,{k:'move',s,f:src,t:dst,n,m:takeM||null,p:terr(T,src)==='deep'&&terr(T,dst)==='deep'&&mpath.length===2?[src,dst]:mpath});markMv(T,s,dst);
    const hidN=terr(T,dst)==='deep'||has(T,s,'shade')||(isGod(T,s,'rahu')&&T.moon==='wane');
    log(T,`${gname(T,s)} เดินทัพ${hidN?'':' '+n+' ตัว'} ไป${cname(T,dst)}`);
    if(bonus){T.follow={seat:s,vajra:wasVajra&&vajraTargets(T,s,dst).length>0,assn:false,bonusFrom:null,vfrom:dst};if(!T.follow.vajra){T.follow=null;advance(T)}}
    else computeFollow(T,s,true,null,dst);
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
function doVajra(cell,assn){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{const fl=assn?'assn':'vajra';if(!T.follow||T.follow.seat!==s||!T.follow[fl]||!iControl(T,s))return false;if(!vajraTargets(T,s,T.follow.vfrom,!!assn).includes(cell))return false;
    const victim=T.B[cell].o;trail(T,{k:'vaj',s,t:cell,n:1});removeTroops(T,cell,1);T.P[s].f[fl]=true;log(T,`${gname(T,s)} ${assn?'ลอบสังหาร':'ฟาดวชิราวุธ'} ${gname(T,victim)} เสีย 1 ตัวที่${cname(T,cell)}`);
    T.follow[fl]=false;if(!T.follow.vajra&&!T.follow.assn&&T.follow.bonusFrom===null){T.follow=null;advance(T)}})}
function doAvatar(k,cell){const s=activeSeat(G);ui={mode:null};
  mutate(GID,T=>{if(!guard(T,s)||!isGod(T,s,'narai')||T.P[s].f.avatar)return false;if(!T.M[k]||T.M[k].o!==s)return false;
    if(cell!==cityOf(s)&&!(T.B[cell].o===s&&T.B[cell].t>0&&mountsAt(T,cell,s).length<mLimit(T,s)))return false;if(cell!==cityOf(s)&&mountsAt(T,cell,s).length>=1&&T.B[cell].t>4)return false;
    T.M[k].c=cell;T.P[s].f.avatar=true;log(T,`${gname(T,s)} อวตาร ย้าย${MOUNTS[k].name}ไป${cname(T,cell)}`)})}

/* ===================== TUTORIAL ===================== */
let TUT=null;
const isTut=gid=>String(gid||'').startsWith('tut');
const TSTEPS=[
 {k:'info',t:'ยินดีต้อนรับสู่หิมพานต์',hl:[1,4,7,0],b:`คุณคือ <b>พระอินทร์</b> (เมืองของคุณอยู่บนสุด) คู่ฝึกคือบอท <b>พระพิรุณ</b> เป้าหมายคือมี <b>8 คะแนน</b> ตอนจบรอบกลางคืน แล้วรักษาไว้ได้อีก 1 วัน<br>• ยึด <b>วัด</b> ได้ 1 คะแนน (เสียวัดก็เสียคะแนน)<br>• ยึด <b>เขาพระสุเมรุ</b> ตรงกลางได้ 2 คะแนน<br>• <b>บุกชนะ</b> ได้ 1 คะแนนถาวร ไม่มีวันหาย<br>• <b>ครองแดน</b>: จบรอบกลางคืนตอนยึดวัด 2 แห่งขึ้นไป หรือยึดเขาพระสุเมรุ ได้ 1 คะแนนถาวร<br>วงประสีทองบนแผนที่คือจุดที่บทเรียนกำลังพูดถึง`},
 {k:'info',t:'หนึ่งรอบมี 3 แอคชัน',b:`ผู้เล่นผลัดกันทำคนละ 1 แอคชัน จนทุกคนทำครบ 3 แอคชันแล้วรอบจึงจบ แอคชันมี 4 อย่าง ใช้ได้อย่างละครั้งต่อรอบ จึงต้องเลือก 3 จาก 4<br>• <b>เกณฑ์ทัพ</b>: จ่ายบุญตัวละ 1 เพิ่มทหารในเมือง 2 ตัว<br>• <b>เดินทัพ</b>: ย้ายทหาร 1 ช่อง เข้าช่องศัตรู = รบ<br>• <b>ทำบุญ</b>: ได้บุญ (เงินในเกม) หรือลบบาป<br>• <b>ขอพร</b>: ใช้บุญซื้อการ์ดพลังหรือพาหนะ`},
 {k:'do',t:'ลองเกณฑ์ทัพ',hl:[1],allow:['recruit'],b:`กดปุ่ม <b>เกณฑ์ทัพ</b> เพื่อเพิ่มทหาร 2 ตัวในเมืองของคุณ (จ่ายบุญตัวละ 1 บุญ) ทหารมีทั้งหมด 10 ตัว ตัวที่ยังไม่ลงสนามอยู่ใน "คลัง"`,done:S=>S.P[0].used.includes('recruit')},
 {k:'do',t:'ยึดวัดแรก',hl:[4],allow:['move'],b:`วัดอยู่ห่างเมือง 2 ก้าว คุณมีกองหน้า 2 ตัวรออยู่แล้วในป่าที่ติดกับวัด กด <b>เดินทัพ</b> → กดป่าที่มีกองของคุณ → กดวัดที่มีวงประ แล้วกด <b>เดิน</b> ทหารเดินได้ทีละ 1 ช่อง เส้นทางไปเขาพระสุเมรุต้องผ่านป่าลึกวงใน<br><span class="muted">ถ้ามีปุ่ม "ใช้วชิราวุธ" ขึ้นมา กด <b>จบตา</b> ไปก่อน เดี๋ยวสอนทีหลัง</span>`,done:S=>S.B[4].o===0&&S.B[4].t>0&&!S.follow},
 {k:'do',t:'ทำบุญ',allow:['merit'],b:`คุณได้ 1 คะแนนจากวัดแล้ว ดูดาว ★ ในแถบผู้เล่น ต่อไปกด <b>ทำบุญ</b> รับบุญ +2 บุญเอาไว้ซื้อการ์ดพลัง`,done:S=>S.round>1||S.P[0].used.includes('merit')},
 {k:'info',t:'จบรอบ · กลางวันและกลางคืน',b:`เมื่อทุกคนทำครบ 3 แอคชัน รอบจะจบ<br>• ทุกคนได้บุญ +1<br>• รอบ <b>กลางวัน</b> ได้บุญเพิ่ม +1 ต่อวัดที่ยึดอยู่<br>• จากนั้นสลับเป็น <b>กลางคืน</b>: ฝ่ายบุกได้พลังรบ +1 (ดูแถบเหนือแผนที่ ☀ กลางวัน / ☾ กลางคืน)<br>• ใครยึดวัด 2 แห่งขึ้นไป หรือเขาพระสุเมรุไว้ได้จน<b>จบรอบกลางคืน</b> ได้ <b>ครองแดน</b> +1 คะแนนถาวร (ดูชื่อคนที่เข้าเงื่อนไขในแถบเหนือแผนที่)<br>• ใครถึงเป้าตอนจบกลางคืน = <b>ผู้ท้าชิง</b> ต้องรักษาคะแนนไว้ต่ออีก 1 วันถึงจะชนะ คนอื่นมีเวลาทั้งวันรุมแย่งคืน<br>• คนคะแนนน้อยสุดได้เล่นก่อนในรอบถัดไป ดูเลขลำดับหน้าชื่อในแถบผู้เล่น`},
 {k:'do',t:'บุก!',hl:[3],allow:['move'],b:`บอทมีทหาร 2 ตัวในทุ่งข้างเมืองคุณ ลองบุก: กด <b>เดินทัพ</b> → เมืองของคุณ → ทุ่งที่มีวงประ → ส่งทหารให้มากที่สุด แล้ว<b>เลือกการ์ดรบ</b><br><b>พลังรบ</b> = ทหาร + พลังการ์ด + โบนัส ใครสูงกว่าชนะ (เสมอฝ่ายรับชนะ)<br><b>แต้มฆ่า</b> ของการ์ดคือจำนวนทหารที่อีกฝ่ายเสีย ทั้งสองฝ่ายเสียทหารเสมอ<br>คำแนะนำ: ลองเลือก <b>ตั้งมั่น (พลัง 3)</b> เพื่อให้ชนะชัวร์`,done:S=>!!(S.last&&S.last.A===0)},
 {k:'do',t:'วชิราวุธของพระอินทร์',allow:[],b:`ดูกล่อง <b>ศึกล่าสุด</b> ว่าพลังรบมาจากไหน ฝ่ายแพ้ที่เหลือรอดต้องถอยไป 1 ช่อง โดยฝ่ายชนะเป็นคนเลือกช่อง (ถ้ามีช่องเดียวระบบถอยให้เอง)<br>หลังเดินทัพ พระอินทร์ใช้ <b>วชิราวุธ</b> ได้รอบละครั้ง ทำให้กองศัตรูที่อยู่ติดกับกองคุณเสียทหาร 1 ตัวโดยไม่ต้องรบ ลองกด <b>ใช้วชิราวุธ</b> แล้วเลือกกองศัตรู หรือกด <b>จบตา</b>`,done:S=>!S.follow&&!S.battle&&!S.retreat},
 {k:'info',t:'บาป: ราคาของสงคราม',b:`บุกชนะได้คะแนนถาวร แต่ได้ <b>บาป +1</b> ด้วย (ดูในแถบผู้เล่น) ถ้าบาปถึง <b>3</b> จะเสียทหาร 2 ตัวทันที<br>บุกบ่อยได้คะแนนเร็ว แต่ต้องหาจังหวะทำบุญลบบาป นี่คือการตัดสินใจหลักของเกม`},
 {k:'do',t:'ขอพร',allow:['buy'],b:`เปิดรายการ <b>ขอพร</b> ด้านล่าง แล้วซื้อการ์ดพลังเลเวล 1 สักใบ (การ์ดที่สีชัดไม่จางคือซื้อได้ ขอบแดง = สายฤทธิ์ น้ำเงิน = สายคุ้มกัน เหลือง = สายบุญ) การ์ดเลเวล 2 ต้องมีเลเวล 1 ในสายเดียวกันก่อน<br>หรือจะซื้อ <b>ช้างเอราวัณ</b> พาหนะประจำองค์ก็ได้ ถ้าบุญพอ`,done:S=>S.P[0].pw.length>0||mountsOf(S,0).length>0},
 {k:'do',t:'ลบบาป',allow:['merit'],b:`แอคชันสุดท้ายของรอบนี้ กด <b>ทำบุญ</b> แล้วเลือก <b>ลบบาป 1</b> ถ้ามีบาปอยู่`,done:S=>S.round>2||(S.round===2&&S.P[0].used.includes('merit'))},
 {k:'end',t:'พร้อมรบแล้ว!',b:`คุณรู้กติกาหลักครบแล้ว ยังมีอีกหลายอย่างให้ลองเอง: เทพแต่ละองค์มีพลังไม่เหมือนกัน พาหนะของเทพเจ้าของได้โบนัสเพิ่ม และ <b>ครุฑข่มนาค</b> ได้ +2<br>จะเล่นต่อกับบอทในห้องนี้ก็ได้ หรือกลับไปเปิดห้องจริงชวนเพื่อน`}
];
function tutState(){
  const S={v:1,created:Date.now(),host:ME,status:'lobby',solo:false,n:2,target:8,useL3:false,openCards:false,
    seats:[{uid:ME,god:'indra'},{uid:'bot',god:'varuna'}],log:[]};
  setupGame(S);S.map='classic';S.seed=20261012;S.order=[0,1];S.pos=0;S.B[2]={o:0,t:2};S.B[3]={o:1,t:2};S.log=[];log(S,'บทเรียนเริ่ม · กลางวัน');
  return S;
}
function startTutorial(){
  PH_SEEN.tut=undefined;
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
    if(T.disarm){if(T.seats[disarmBy(T.disarm)].uid!=='bot')return false;doDisarm(T,availCards(T,T.disarm.s)[0]);return}
    if(T.follow){if(T.seats[T.follow.seat].uid!=='bot')return false;T.follow=null;advance(T);return}
    const s=T.order[T.pos];if(T.seats[s].uid!=='bot')return false;
    if(actionOK(T,s,'merit')){T.P[s].merit+=2;markAction(T,s,'merit');log(T,`${gname(T,s)} ทำบุญ +2`)}
    else if(actionOK(T,s,'recruit')&&recruitN(T,s,cityOf(s))>0){doRecruitRule(T,s,cityOf(s))}
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
  if(kind==='mount')return MOUNTS[id]?MOUNTS[id].txt+' · ถิ่น: '+HOME[id]+' +1':'';
  if(kind==='god')return GOD[id]?GOD[id].ab+': '+GOD[id].txt:'';
  if(kind==='map')return MAPBY[id]?MAPBY[id].desc:'';
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
    if(false)return `<!--card-->${mountCard(id)}${id==='garuda'||id==='naga'?'<p class="small">ครุฑข่มนาค: เมื่อกองที่มีครุฑรบกับกองที่มีนาค ฝ่ายครุฑได้ +2 และนาคใช้ความสามารถไม่ได้</p>':''}${owner}`;
    return `<p class="small muted">พาหนะ · ราคา ${m.cost} บุญ</p><h2><span class="mic big">${mPic(id)}</span>${esc(m.name)}</h2><p>${esc(m.txt)}</p><p><b>ถิ่น: ${HOME[id]}</b> รบในช่อง${HOME[id]} ได้พลังรบ +1 ทั้งบุกและรับ</p>
      ${g?`<p class="small"><b>โบนัสเมื่ออยู่กับ${esc(g.name)}</b> (เจ้าของในตำนาน): ${esc(m.bonus.split(': ')[1]||m.bonus)}</p>`:''}
      ${id==='garuda'||id==='naga'?'<p class="small">ครุฑข่มนาค: เมื่อกองที่มีครุฑรบกับกองที่มีนาค ฝ่ายครุฑได้ +2 และนาคใช้ความสามารถไม่ได้</p>':''}
      <p class="small muted">พาหนะอยู่กับกองทหาร กองละ 1 ตัว (ในเมืองพักไว้ได้หลายตัว) ไม่นับเป็นทหาร และไม่ตาย ถ้ากองหมด พาหนะกลับเมือง</p>${owner}`}
  if(kind==='map'){const m=MAPBY[id];if(!m)return '';return `<p class="small muted">แผนที่</p><h2>🗺 ${esc(m.name)}</h2><p>${esc(m.desc)}</p><p class="small muted">ทุกแผนที่สมมาตร ทุกที่นั่งเดินถึงวัดและเขาพระสุเมรุได้ไกลเท่ากัน มี ${MAPS.length} แบบ สุ่มใหม่ทุกห้อง</p>`}
  if(kind==='god'){const g=GOD[id];if(!g)return '';
    if(!window.__infoPlain)return `<!--card-->${godCard(id)}${owner}`;
    return `${godPic(id,'hero')}<p class="small muted">เทพ${g.arch?' · '+archIc(g.arch)+' '+ARCH[g.arch].n+' ('+ARCH[g.arch].d+')':''} · พาหนะประจำองค์ ${MOUNTS[g.mount].name}</p><h2>${esc(g.name)}</h2><p><b>${esc(g.ab)}</b>: ${esc(g.txt)}</p><p class="small">จุดอ่อน: ${esc(g.weak)}</p>${owner}`}
  return ''}
let infoReturn=null;
function openInfo(spec,from){const pop=document.getElementById('pop');const h=infoHTML(spec);if(!pop||!h)return;
  infoReturn=from||null;
  pop.innerHTML=`<div class="popcard ${h.startsWith('<!--card-->')?'cardpop':''}" role="document">${h}<div class="row" style="justify-content:flex-end"><button class="primary" id="popclose">ปิด</button></div></div>`;
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
