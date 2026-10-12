/* ศึกเทพหิมพานต์ · กติกาเกมทั้งหมด (ไม่มีโค้ดหน้าจอ) */
/* ===================== DATA ===================== */
const GODS=[
 {k:'indra',name:'พระอินทร์',mount:'erawan',ab:'วชิราวุธ',txt:'รอบละครั้ง หลังเดินทัพ ทำให้กองศัตรูที่ติดกับกองคุณเสียทหาร 1 ตัว',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'narai',name:'พระนารายณ์',mount:'garuda',ab:'อวตาร',txt:'รอบละครั้ง ย้ายพาหนะของคุณไปกองไหนก็ได้ของตัวเอง (ฟรี)',weak:'เก่งเมื่อมีพาหนะ'},
 {k:'brahma',name:'พระพรหม',mount:'hong',ab:'สร้างสรรพสิ่ง',txt:'เกณฑ์ทัพได้ 3 ตัวแทน 2',weak:'รบปกติ ชนะด้วยจำนวน'},
 {k:'shiva',name:'พระอิศวร',mount:'nonthi',ab:'ระบำทำลายล้าง',txt:'บุกชนะ แต้มฆ่า +1',weak:'บุกชนะได้บาป +2'},
 {k:'yama',name:'พระยม',mount:'buffalo',ab:'ยมโลก',txt:'ทหารตายในศึกที่คุณเกี่ยว ได้บุญ +1 ต่อตัว',weak:'ไม่แรงขึ้นในศึก'},
 {k:'agni',name:'พระเพลิง',mount:'rhino',ab:'เผาผลาญ',txt:'บุกได้พลังรบ +1',weak:'ตั้งรับ −1'},
 {k:'varuna',name:'พระพิรุณ',mount:'naga',ab:'หลั่งฝน',txt:'จบรอบได้บุญ +1 ต่อวัด และตั้งรับในป่า +1',weak:'บุกปกติ'}
];
const GOD=Object.fromEntries(GODS.map(g=>[g.k,g]));
const MOUNTS={
 erawan:{name:'ช้างเอราวัณ',ic:'🐘',cost:4,home:'forest',txt:'ตั้งรับ +2',bonus:'พระอินทร์: วชิราวุธถึงกองที่ห่างเอราวัณ 2 ช่อง'},
 garuda:{name:'ครุฑ',ic:'🦅',cost:4,home:'sumeru',txt:'บุก +1 และเดินได้ 2 ช่อง',bonus:'พระนารายณ์: บินข้ามช่องศัตรูได้'},
 hong:{name:'หงส์',ic:'🦢',cost:3,home:'temple',txt:'จบรอบในวัดหรือเขาพระสุเมรุ ได้บุญ +1',bonus:'พระพรหม: เกณฑ์ทัพลงกองที่มีหงส์ได้'},
 nonthi:{name:'โคนนทิ',ic:'🐂',cost:3,home:'royal',txt:'พลังรบ +1 ทั้งบุกและรับ',bonus:'พระอิศวร: บุกชนะได้บาปแค่ +1'},
 buffalo:{name:'กระบือ',ic:'🐃',cost:2,home:'plain',txt:'บุกชนะแล้วไม่ได้บาป',bonus:'พระยม: ยมโลก +2 ต่อตัวในศึกของกองนี้'},
 rhino:{name:'แรด',ic:'🦏',cost:3,home:'deep',txt:'บุก +2',bonus:'พระเพลิง: กองนี้ไม่โดนตั้งรับ −1'},
 naga:{name:'นาค',ic:'🐍',cost:4,home:'water',txt:'รับความเสียหาย −1 (ครุฑลบล้าง)',bonus:'พระพิรุณ: +1 เมื่ออยู่ในวัด'},
 rajasi:{name:'ราชสีห์',ic:'🦁',cost:4,home:'plain',txt:'บุกชนะ แต้มฆ่า +1'},
 khotchasi:{name:'คชสีห์',ic:'🐯',cost:4,home:'forest',txt:'ตั้งรับ +1 และตอนตั้งรับรับความเสียหาย −1'},
 kilen:{name:'กิเลน',ic:'🦄',cost:3,home:'temple',txt:'จบรอบ บาป −1'},
 durong:{name:'ดุรงค์ปักษิน (ม้าปีก)',ic:'🐎',cost:3,home:'sumeru',txt:'เดินได้ 2 ช่อง'},
 kinnaree:{name:'กินรี',ic:'🧚',cost:2,home:'water',txt:'ทำบุญได้บุญ +1 เพิ่ม'},
 makara:{name:'มกร',ic:'🐊',cost:3,home:'water',txt:'ตอนบุก รับความเสียหาย −1'},
 hera:{name:'เหรา',ic:'🦎',cost:2,home:'deep',txt:'ตั้งรับ +1'},
 hatsadee:{name:'นกหัสดีลิงค์',ic:'🦚',cost:3,home:'deep',txt:'กลางคืน บุก +2'},
 kraisorn:{name:'ไกรสรปักษา',ic:'🦜',cost:3,home:'sumeru',txt:'กลางวัน ตั้งรับ +2'},
 asura:{name:'อสุรปักษา',ic:'👹',cost:2,home:'forest',txt:'บุก +1'},
 kwang:{name:'กวางทอง',ic:'🦌',cost:2,home:'temple',txt:'จบรอบ ได้บุญ +1'},
 kaisornnaka:{name:'ไกรสรนาคา',ic:'🐲',cost:3,home:'royal',txt:'บุกชนะ ได้บุญ +2'},
 thakthor:{name:'ทักทอ',ic:'🐐',cost:3,home:'plain',txt:'เกณฑ์ทัพลงกองที่มีทักทอได้'}
};
/* ถิ่นของพาหนะ: รบในช่องถิ่นของตัวเอง พลังรบ +1 ทั้งบุกและรับ */
const HOMENAME={forest:'ป่า',deep:'ป่าลึก',plain:'ทุ่ง',water:'ริมน้ำ',temple:'วัด',sumeru:'เขาพระสุเมรุ',royal:'วัดหลวง'};
const HOME=Object.fromEntries(Object.entries(MOUNTS).map(([k,m])=>[k,HOMENAME[m.home]]));
const HOMEK={forest:1,temple:2,plain:3,water:4,deep:5};
function inHome(S,m,i){
  if(!m||!MOUNTS[m])return false;const h=MOUNTS[m].home;
  if(h==='sumeru')return i===0;
  if(h==='royal')return isRoyal(S,i);
  if(i===0||isRoyal(S,i))return false;
  return kOf(i)===HOMEK[h];
}
const MK=Object.keys(MOUNTS);
const OWNER_GOD={erawan:'indra',garuda:'narai',hong:'brahma',nonthi:'shiva',buffalo:'yama',rhino:'agni',naga:'varuna'};
const mIcon=k=>MOUNTS[k]?MOUNTS[k].ic:'';
const LINES={rit:'สายฤทธิ์',kum:'สายคุ้มกัน',bun:'สายบุญ'};
const P=(id,line,lv,name,txt,todo)=>({id,line,lv,name,txt,todo:!!todo});
const POWERS=[
 P('weapon','rit',1,'ศาสตราวุธ','บุก +1'),P('swift','rit',1,'ม้าเร็ว','เดินทัพได้ 2 ช่อง'),P('banner','rit',1,'ธงรบ','กลางคืน บุก +1 เพิ่ม'),P('rally','rit',1,'ปลุกใจ','ตอนบุก รับความเสียหาย −1'),
 P('raid','rit',2,'จู่โจม','บุกชนะ ศัตรูเสียเพิ่ม 1'),P('vanguard','rit',2,'ทัพหน้า','บุกด้วยทหารมากกว่า ศัตรูเสีย 1 ก่อนรบ'),P('secret','rit',2,'ทางลับ','เข้าเขาพระสุเมรุจากช่องไหนก็ได้'),P('chain','rit',2,'ชัยต่อเนื่อง','บุกชนะ เดินต่อได้อีก 1 ช่อง'),
 P('manual','rit',3,'ตำราพิชัยสงคราม','ได้การ์ดรบเลข 4'),P('divine','rit',3,'อาวุธเทวะ','บุก +2'),P('sky','rit',3,'กองทัพฟ้า','เดินทัพได้ 2 ครั้งต่อรอบ (แอคชันที่ 4)'),P('vpR','rit',3,'ชัยชนะอมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('armor','kum',1,'เกราะเพชร','ตั้งรับ +1'),P('levy','kum',1,'ไพร่พล','เกณฑ์ทัพ +1 ตัว'),P('wall','kum',1,'กำแพงวัด','ตั้งรับในวัด +1'),P('ward','kum',1,'มนต์คุ้มกาย','ตอนตั้งรับ รับความเสียหาย −1'),
 P('reserve','kum',2,'กองหนุน','เกณฑ์ทัพลงช่องติดเมืองได้'),P('unity','kum',2,'สามัคคี','กอง 5 ตัวขึ้นไป ตั้งรับ +1'),P('counter','kum',2,'โต้กลับ','ตั้งรับชนะ ฝ่ายบุกเสียเพิ่ม 1'),P('fort','kum',2,'ป้อมค่าย','กองละ 6 ตัวได้'),
 P('guardian','kum',3,'ทวารบาล','ตั้งรับ +2'),P('dominion','kum',3,'ครองแผ่นดิน','ยึดวัดแห่งเดียวก็ได้ครองแดน'),P('reinforce','kum',3,'กำลังเสริม','จบรอบได้ทหาร 2 ตัวลงเมือง'),P('vpK','kum',3,'ผู้พิทักษ์อมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('holy','bun',1,'น้ำมนต์','ทำบุญได้ +3'),P('alms','bun',1,'ทานบารมี','ซื้อของถูกลง 1 บุญ'),P('chant','bun',1,'สวดมนต์','จบรอบได้บุญ +1'),P('pray','bun',1,'อธิษฐาน','จบรอบได้การ์ดรบที่ใช้แล้วคืน 1 ใบ'),
 P('angel','bun',2,'เทวดารักษา','จบรอบลบบาป 1'),P('offer','bun',2,'ถวายวัด','จบรอบได้บุญ +1 ต่อวัด'),P('atone','bun',2,'ไถ่บาป','ทำบุญได้ทั้งบุญและลบบาป'),P('foresight','bun',2,'ญาณหยั่งรู้','เปลี่ยนการ์ดหลังเปิด (ยังไม่เปิดในเวอร์ชันออนไลน์)',1),
 P('miracle','bun',3,'ปาฏิหาริย์','รอบละครั้ง ทำแอคชันที่ใช้แล้วซ้ำได้'),P('pure','bun',3,'ผู้ทรงศีล','บาปเต็มไม่เสียทหาร'),P('blessed','bun',3,'บุญหนุนนำ','จบรอบถ้าบาป 0 ได้บุญ +2'),P('vpB','bun',3,'บุญบารมีอมตะ','ได้ 1 คะแนนถาวรทันที')
];
const PW=Object.fromEntries(POWERS.map(p=>[p.id,p]));
const COST=[0,2,3,4];
const CARD=[{s:0,k:3,n:'ถล่มทลาย'},{s:1,k:2,n:'ประจัญบาน'},{s:2,k:1,n:'รุกคืบ'},{s:3,k:1,n:'ตั้งมั่น'},{s:4,k:2,n:'พิชัยยุทธ'}];
const cardBtn=(c,attr,on)=>`<button class="bcard ${on?'on':''}" ${attr}="${c}" aria-label="${CARD[c].n} พลัง ${CARD[c].s} ฆ่า ${CARD[c].k}"><span class="cn">${CARD[c].n}</span><span class="cs">พลัง <b>${CARD[c].s}</b></span><span class="ck">ฆ่า <b>${CARD[c].k}</b></span></button>`;
const ACT={recruit:'เกณฑ์ทัพ',move:'เดินทัพ',merit:'ทำบุญ',buy:'ขอพร'};
const SEATC=i=>`var(--s${i})`;

/* ===================== RULES ===================== */
/* แผนที่ v2: ผู้เล่นละ 6 ช่อง เรียงเป็นบล็อก
   k=0 เมือง · 1 ป่า · 2 วัด · 3 ทุ่ง (วงนอก)  k=4 ริมน้ำ (ทะเลสีทันดรล้อมเขาพระสุเมรุ) · 5 ป่าลึก (วงใน ป่าลึกติดเขาพระสุเมรุ) */
const SECT=6;
const L=S=>SECT*S.n;
const KTYPE=['city','forest','temple','plain','water','forest'];
const KNAME=['เมือง','ป่า','วัด','ทุ่ง','ริมน้ำ','ป่าลึก'];
const kOf=i=>(i-1)%SECT;
/* วัดหลวง: วัดที่ n+1 อยู่ติดเขาพระสุเมรุและป่าลึกทุกช่อง (ห้องที่สร้างก่อนมีวัดหลวงจะไม่มีช่องนี้) */
const royalOf=S=>SECT*S.n+1;
const hasRoyal=S=>!!(S.B&&S.B.length>SECT*S.n+1);
const isRoyal=(S,i)=>hasRoyal(S)&&i===royalOf(S);
const ctype=(S,i)=>i===0?'sumeru':isRoyal(S,i)?'temple':KTYPE[kOf(i)];
const citySeat=i=>(i-1)/SECT;
const cityOf=s=>1+SECT*s;
const has=(S,s,id)=>S.P[s].pw.includes(id);
const godOf=(S,s)=>S.seats[s].god;
const isGod=(S,s,k)=>godOf(S,s)===k;
function adj(S,i){
  const n=S.n,B=(t,k)=>1+SECT*(((t%n)+n)%n)+k;
  const R=hasRoyal(S)?[royalOf(S)]:[];
  if(i===0){const out=[];for(let t=0;t<n;t++)out.push(B(t,5));return out.concat(R)}
  if(isRoyal(S,i)){const out=[0];for(let t=0;t<n;t++)out.push(B(t,5));return out}
  const t=Math.floor((i-1)/SECT),k=kOf(i);
  switch(k){
    case 0:return [B(t,1),B(t-1,3)];
    case 1:return [B(t,0),B(t,2),B(t,4)];
    case 2:return [B(t,1),B(t,3),B(t,5)];
    case 3:return [B(t,2),B(t+1,0)];
    case 4:return [B(t,1),B(t,5),B(t-1,5)];
    default:return [B(t,2),B(t,4),B(t+1,4),0].concat(R);
  }
}
function nbs(S,i,s){
  if(i===0){if(has(S,s,'secret')){const out=[];for(let j=1;j<S.B.length;j++)out.push(j);return out}return adj(S,0)}
  const out=adj(S,i);
  if(has(S,s,'secret')&&!out.includes(0))out.push(0);
  return out;
}
function mountAt(S,cell,s){for(const k of MK){const m=S.M[k];if(m&&m.o===s&&m.c===cell)return k}return null}
/* เมืองเก็บพาหนะได้หลายตัว กองนอกเมืองมีพาหนะได้ 1 ตัว */
function mountsAt(S,cell,s){return MK.filter(k=>{const m=S.M[k];return m&&m.o===s&&m.c===cell})}
const ownsM=(S,s,k)=>!!(S.M[k]&&S.M[k].o===s);
const meritAmt=(S,s)=>(has(S,s,'holy')?3:2)+(ownsM(S,s,'kinnaree')?1:0);
function mountsOf(S,s){return MK.filter(k=>S.M[k]&&S.M[k].o===s)}
function onBoard(S,s){let t=0;for(const c of S.B)if(c.o===s)t+=c.t;if(S.battle&&S.battle.a===s)t+=S.battle.n;if(S.retreat&&S.retreat.loser===s)t+=S.retreat.n;return t}
const reserve=(S,s)=>10-onBoard(S,s);
const cap=(S,s,i)=>i===cityOf(s)?99:(has(S,s,'fort')?6:5);
function templesHeld(S,s){let n=0;for(let i=1;i<S.B.length;i++)if(ctype(S,i)==='temple'&&S.B[i].o===s&&S.B[i].t>0)n++;return n}
function tempVP(S,s){return templesHeld(S,s)+(S.B[0].o===s&&S.B[0].t>0?2:0)}
const total=(S,s)=>S.P[s].vp+tempVP(S,s);
const hand=(S,s)=>has(S,s,'manual')?[0,1,2,3,4]:[0,1,2,3];
const availCards=(S,s)=>hand(S,s).filter(c=>!S.P[s].uc.includes(c));
function useCard(S,s,c){const p=S.P[s];p.uc.push(c);if(hand(S,s).every(x=>p.uc.includes(x)))p.uc=[]}
function log(S,t){S.log.unshift(`ร.${S.round} · ${t}`);if(S.log.length>50)S.log.length=50}
const gname=(S,s)=>GOD[godOf(S,s)].name;

function actionLimit(S,s){const p=S.P[s];return 3+(has(S,s,'sky')?1:0)+(has(S,s,'miracle')&&!p.f.miracle?1:0)}
function actionOK(S,s,a){
  const p=S.P[s];if(p.used.length>=actionLimit(S,s))return false;
  const cnt=p.used.filter(x=>x===a).length;
  const lim=(a==='move'&&has(S,s,'sky'))?2:1;
  if(cnt<lim)return true;
  return has(S,s,'miracle')&&!p.f.miracle;
}
function markAction(S,s,a){
  const p=S.P[s];const cnt=p.used.filter(x=>x===a).length;const lim=(a==='move'&&has(S,s,'sky'))?2:1;
  if(cnt>=lim){p.f.miracle=true;log(S,`${gname(S,s)} ใช้ปาฏิหาริย์ ทำ${ACT[a]}ซ้ำ`)}
  p.used.push(a);
}
function hasActions(S,s){return ['recruit','move','merit','buy'].some(a=>actionOK(S,s,a))}

function priceOf(S,s,item){const base=item.mount?MOUNTS[item.mount].cost:COST[PW[item.pw].lv];return Math.max(1,base-(has(S,s,'alms')?1:0))}
function powerState(S,s,id){
  const p=PW[id];
  if(p.todo)return 'todo';
  if(p.lv===3&&!S.useL3)return 'off';
  for(let i=0;i<S.n;i++)if(S.P[i].pw.includes(id))return i===s?'mine':'taken';
  if(p.lv>1&&!S.P[s].pw.some(x=>PW[x].line===p.line&&PW[x].lv===p.lv-1))return 'locked';
  if(S.P[s].merit<priceOf(S,s,{pw:id}))return 'poor';
  return 'ok';
}
function mountState(S,s,k){
  const m=S.M[k];if(m)return m.o===s?'mine':'taken';
  if(S.P[s].merit<priceOf(S,s,{mount:k}))return 'poor';
  return 'ok';
}

function recruitTargets(S,s){
  const out=[cityOf(s)];
  if(has(S,s,'reserve')){for(const j of adj(S,cityOf(s))){const c=S.B[j];if(c.t===0||c.o===s)out.push(j)}}
  if(isGod(S,s,'brahma')&&S.M.hong&&S.M.hong.o===s&&!out.includes(S.M.hong.c))out.push(S.M.hong.c);
  if(ownsM(S,s,'thakthor')&&S.M.thakthor.c>=0&&!out.includes(S.M.thakthor.c))out.push(S.M.thakthor.c);
  return out.filter(j=>j===cityOf(s)||S.B[j].t<cap(S,s,j));
}
const recruitAmt=(S,s)=>(isGod(S,s,'brahma')?3:2)+(has(S,s,'levy')?1:0);

function reachable(S,s,src,carry,maxRange){
  let range=has(S,s,'swift')||carry==='garuda'||carry==='durong'?2:1;if(maxRange)range=Math.min(range,maxRange);
  const fly=carry==='garuda'&&isGod(S,s,'narai');
  const res={};const seen=new Set([src]);let front=[src];
  for(let d=0;d<range;d++){const nx=[];
    for(const c of front)for(const nb of nbs(S,c,s)){
      if(seen.has(nb))continue;
      if(ctype(S,nb)==='city'&&citySeat(nb)!==s)continue;
      const o=S.B[nb];const enemy=o.t>0&&o.o!==s;
      if(enemy){if(!res[nb])res[nb]='battle';if(fly){seen.add(nb);nx.push(nb)}continue}
      res[nb]='move';seen.add(nb);nx.push(nb);
    }
    front=nx;
  }
  return res;
}
/* ช่องที่ไปได้จากกองนี้ ไม่ว่าจะพาพาหนะตัวไหนไป (หรือไม่พา) */
function reachAny(S,s,src,maxRange){const out={};for(const m of [null,...mountsAt(S,src,s)])Object.assign(out,reachable(S,s,src,m,maxRange));return out}
function placeTroops(S,s,cell,n){const c=S.B[cell];if(c.t===0||c.o!==s){c.o=s;c.t=0}c.t+=n}
function removeTroops(S,cell,n){const c=S.B[cell];c.t=Math.max(0,c.t-n);if(c.t===0){const ow=c.o;if(ctype(S,cell)!=='city')c.o=-1;sendMountsHome(S,cell,ow)}}
function sendMountsHome(S,cell,ow){if(ow<0)return;for(const k of MK){const m=S.M[k];if(m&&m.o===ow&&m.c===cell&&cell!==cityOf(ow)){m.c=cityOf(ow)}}}

function checkSin(S,s){
  const p=S.P[s];if(p.sin<3)return;
  if(has(S,s,'pure')){p.sin=0;log(S,`${gname(S,s)} บาปเต็ม แต่ผู้ทรงศีลคุ้มไว้`);return}
  let lose=2;const city=cityOf(s);
  const take=i=>{const t=Math.min(lose,S.B[i].t);if(t>0){removeTroops(S,i,t);lose-=t}};
  take(city);
  const groups=[];S.B.forEach((c,i)=>{if(c.o===s&&c.t>0&&i!==city)groups.push(i)});
  groups.sort((a,b)=>S.B[a].t-S.B[b].t);
  for(const g of groups){if(lose<=0)break;take(g)}
  p.sin=0;log(S,`${gname(S,s)} บาปเต็ม เสียทหาร 2 ตัว`);
}

function retreatOpts(S,s,cell,n){
  return nbs(S,cell,s).filter(j=>{
    if(j===cell)return false;
    if(ctype(S,j)==='city'&&citySeat(j)!==s)return false;
    const c=S.B[j];
    if(c.t===0)return true;
    return c.o===s&&c.t+n<=cap(S,s,j);
  });
}
function placeRetreat(S,s,j,n,m){
  const had=mountAt(S,j,s);placeTroops(S,s,j,n);
  if(m){if(had&&j!==cityOf(s))S.M[m].c=cityOf(s);else S.M[m].c=j}
}
function resolveBattle(S,defCard){
  const b=S.battle;const A=b.a,D=b.d,cell=b.to;
  const notes=[];
  let nA=b.n,nD=S.B[cell].t;const mA=b.mount,mD=mountAt(S,cell,D);
  let deaths=0;
  if(has(S,A,'vanguard')&&nA>nD&&nD>0){nD--;deaths++;notes.push('ทัพหน้า')}
  const cA=CARD[b.ac],cD=CARD[defCard];
  const temple=ctype(S,cell)==='temple',forest=ctype(S,cell)==='forest';
  const pA=[['ทหาร',nA],['การ์ด',cA.s]],pD=[['ทหาร',nD],['การ์ด',cD.s]];
  const a=(l,v)=>pA.push([l,v]),d=(l,v)=>pD.push([l,v]);
  if(has(S,A,'weapon'))a('ศาสตราวุธ',1);if(has(S,A,'divine'))a('อาวุธเทวะ',2);
  if(S.moon==='wane'){a('กลางคืน',1);if(has(S,A,'banner'))a('ธงรบ',1)}
  if(isGod(S,A,'agni'))a('เผาผลาญ',1);
  if(mA==='garuda')a('ครุฑ',1);if(mA==='nonthi')a('โคนนทิ',1);if(mA==='rhino')a('แรด',2);
  if(mA==='naga'&&temple&&isGod(S,A,'varuna'))a('นาคในวัด',1);
  if(has(S,D,'armor'))d('เกราะเพชร',1);if(temple&&has(S,D,'wall'))d('กำแพงวัด',1);if(nD>=5&&has(S,D,'unity'))d('สามัคคี',1);if(has(S,D,'guardian'))d('ทวารบาล',2);
  if(isGod(S,D,'agni')&&!(mD==='rhino'))d('เผาผลาญ (รับ)',-1);
  if(isGod(S,D,'varuna')&&forest)d('ป่า',1);
  if(mD==='erawan')d('เอราวัณ',2);if(mD==='nonthi')d('โคนนทิ',1);
  if(mD==='naga'&&temple&&isGod(S,D,'varuna'))d('นาคในวัด',1);
  if(mA==='garuda'&&mD==='naga'){a('ครุฑข่มนาค',2);notes.push('ครุฑข่มนาค')}
  if(mD==='garuda'&&mA==='naga'){d('ครุฑข่มนาค',2);notes.push('ครุฑข่มนาค')}
  if(mA==='asura')a('อสุรปักษา',1);if(mA==='hatsadee'&&S.moon==='wane')a('หัสดีลิงค์ยามค่ำ',2);
  if(mD==='hera')d('เหรา',1);if(mD==='khotchasi')d('คชสีห์',1);if(mD==='kraisorn'&&S.moon==='wax')d('ไกรสรปักษายามวัน',2);
  if(inHome(S,mA,cell))a(MOUNTS[mA].name+'ในถิ่น',1);
  if(inHome(S,mD,cell))d(MOUNTS[mD].name+'ในถิ่น',1);
  const sA=pA.reduce((t,x)=>t+x[1],0),sD=pD.reduce((t,x)=>t+x[1],0);
  const aWin=sA>sD;
  // damage each side deals
  const kA=[['การ์ด',cA.k]],kD=[['การ์ด',cD.k]];
  if(aWin){if(has(S,A,'raid'))kA.push(['จู่โจม',1]);if(isGod(S,A,'shiva'))kA.push(['ระบำทำลายล้าง',1]);if(mA==='rajasi')kA.push(['ราชสีห์',1])}
  else{if(has(S,D,'counter'))kD.push(['โต้กลับ',1])}
  // reductions on the receiving side
  if(mD==='naga'&&mA!=='garuda')kA.push(['นาคกันไว้',-1]);
  if(has(S,D,'ward'))kA.push(['มนต์คุ้มกาย',-1]);
  if(mA==='naga'&&mD!=='garuda')kD.push(['นาคกันไว้',-1]);
  if(has(S,A,'rally'))kD.push(['ปลุกใจ',-1]);
  if(mD==='khotchasi')kA.push(['คชสีห์',-1]);
  if(mA==='makara')kD.push(['มกร',-1]);
  const dmgA=Math.max(0,kA.reduce((t,x)=>t+x[1],0)),dmgD=Math.max(0,kD.reduce((t,x)=>t+x[1],0));
  const lossD=Math.min(nD,dmgA),lossA=Math.min(nA,dmgD);
  const survA=nA-lossA,survD=nD-lossD;deaths+=lossA+lossD;
  useCard(S,A,b.ac);useCard(S,D,defCard);
  const W=aWin?A:D,Lz=aWin?D:A;
  const survW=aWin?survA:survD,survL=aWin?survD:survA;
  const mW=aWin?mA:mD,mL=aWin?mD:mA;
  // clear the cell, then decide who holds it
  S.B[cell].t=0;S.B[cell].o=-1;
  let holder=-1,holdN=0,holdM=null,retreat=null;
  if(survW>0){holder=W;holdN=survW;holdM=mW;if(survL>0)retreat={s:Lz,n:survL,m:mL};else if(mL)S.M[mL].c=cityOf(Lz)}
  else if(survL>0){holder=Lz;holdN=survL;holdM=mL;if(mW)S.M[mW].c=cityOf(W)}
  else{if(mA)S.M[mA].c=cityOf(A);if(mD)S.M[mD].c=cityOf(D)}
  if(holder>=0){S.B[cell].o=holder;S.B[cell].t=holdN;if(holdM)S.M[holdM].c=cell}
  const attackerHeld=aWin&&survA>0;
  if(attackerHeld){
    S.P[A].vp+=1;
    let sin=1;if(isGod(S,A,'shiva'))sin=(S.M.nonthi&&S.M.nonthi.o===A)?1:2;
    if(mA==='buffalo')sin=0;
    S.P[A].sin+=sin;
    if(mA==='kaisornnaka'){S.P[A].merit+=2;notes.push('ไกรสรนาคา +2 บุญ')}
  }
  for(const s of [A,D]){if(isGod(S,s,'yama')&&deaths>0){const grpM=s===A?mA:mD;const g=deaths*(grpM==='buffalo'?2:1);S.P[s].merit+=g;notes.push(`ยมโลก +${g} บุญ`)}}
  const ob=x=>x.map(([l,v])=>({l,v}));
  S.last={cell,A,D,ac:b.ac,dc:defCard,sA,sD,pA:ob(pA),pD:ob(pD),kA:ob(kA),kD:ob(kD),aWin,lossA,lossD,round:S.round,retreat:null};
  log(S,`ศึก${cname(S,cell)}: ${gname(S,A)} ${cA.n} พลัง ${sA} ต่อ ${gname(S,D)} ${cD.n} พลัง ${sD} → ${gname(S,W)} ชนะ · บุกเสีย ${lossA} รับเสีย ${lossD}${notes.length?' ('+notes.join(', ')+')':''}${aWin&&survA===0?' · ฝ่ายบุกไม่เหลือทหาร ไม่ได้คะแนน':''}`);
  S.battle=null;
  checkSin(S,A);
  const post={A,chain:attackerHeld&&has(S,A,'chain')&&!b.bonusUsed?cell:null,vp:!!b.vajraPending};
  if(retreat){
    const opts=retreatOpts(S,retreat.s,cell,retreat.n);
    if(opts.length<=1){const j=opts.length?opts[0]:cityOf(retreat.s);doRetreatApply(S,retreat.s,j,retreat.n,retreat.m,cell)}
    else{S.retreat={loser:retreat.s,chooser:W,n:retreat.n,m:retreat.m,from:cell,opts,post};return}
  }
  postBattle(S,post);
}
function doRetreatApply(S,s,j,n,m,from){
  placeRetreat(S,s,j,n,m);
  if(S.last)S.last.retreat={s,to:j};
  log(S,`${gname(S,s)} ถอย ${n} ตัว จาก${cname(S,from)} ไป${cname(S,j)}`);
}
function postBattle(S,post){
  if(S.status!=='play')return;
  const A=post.A;S.follow=null;
  const f={seat:A,vajra:post.vp&&isGod(S,A,'indra')&&!S.P[A].f.vajra&&vajraTargets(S,A).length>0,bonusFrom:post.chain};
  if(f.bonusFrom!==null&&!(S.B[f.bonusFrom].o===A&&S.B[f.bonusFrom].t>0))f.bonusFrom=null;
  if(f.vajra||f.bonusFrom!==null)S.follow=f;else advance(S);
}
function cname(S,i){if(i===0)return'เขาพระสุเมรุ';if(isRoyal(S,i))return'วัดหลวง';const k=kOf(i);if(k===0)return'เมือง'+gname(S,citySeat(i));return KNAME[k]}

function vajraTargets(S,s){
  const out=new Set();
  const own=[];S.B.forEach((c,i)=>{if(c.o===s&&c.t>0)own.push(i)});
  for(const i of own)for(const nb of nbs(S,i,s)){const c=S.B[nb];if(c.t>0&&c.o!==s&&ctype(S,nb)!=='city')out.add(nb)}
  if(S.M.erawan&&S.M.erawan.o===s){const e=S.M.erawan.c;for(const a of nbs(S,e,s)){for(const b of [a,...nbs(S,a,s)]){const c=S.B[b];if(c.t>0&&c.o!==s&&ctype(S,b)!=='city')out.add(b)}}}
  return [...out];
}
function computeFollow(S,s,afterMove,bonusFrom){
  const f={seat:s,vajra:false,bonusFrom:bonusFrom??null};
  if(afterMove&&isGod(S,s,'indra')&&!S.P[s].f.vajra&&vajraTargets(S,s).length)f.vajra=true;
  if(f.bonusFrom!==null&&!(S.B[f.bonusFrom].o===s&&S.B[f.bonusFrom].t>0))f.bonusFrom=null;
  S.follow=(f.vajra||f.bonusFrom!==null)?f:null;
  if(!S.follow)advance(S);
}
function advance(S){
  if(S.status!=='play')return;
  for(let k=1;k<=S.n;k++){const pos=(S.pos+k)%S.n;const s=S.order[pos];if(hasActions(S,s)){S.pos=pos;return}}
  endRound(S);
}
/* ครองแดน: จบรอบ ยึดวัด 2 แห่งขึ้นไป หรือยึดเขาพระสุเมรุ ได้ +1 ถาวร (มีการ์ดครองแผ่นดิน: วัดแห่งเดียวก็พอ) */
function holdsSumeru(S,s){return S.B[0].o===s&&S.B[0].t>0}
function rulesLand(S,s){const th=templesHeld(S,s);return th>=2||holdsSumeru(S,s)||(has(S,s,'dominion')&&th>=1)}
function endRound(S){
  const lords=[...Array(S.n).keys()].filter(s=>rulesLand(S,s));
  lords.forEach(s=>S.P[s].vp+=1);
  if(lords.length)log(S,`ครองแดน +1 ถาวร: ${lords.map(s=>gname(S,s)).join(', ')}`);
  const scores=[...Array(S.n).keys()].map(s=>total(S,s));
  const best=Math.max(...scores);
  if(best>=S.target){
    const cands=[...Array(S.n).keys()].filter(s=>scores[s]===best);
    cands.sort((a,b)=>S.P[b].vp-S.P[a].vp||S.P[a].sin-S.P[b].sin);
    S.status='done';S.winner=cands[0];log(S,`${gname(S,cands[0])} ชนะด้วย ${best} คะแนน`);return;
  }
  for(let s=0;s<S.n;s++){
    const p=S.P[s];const th=templesHeld(S,s);
    if(S.moon==='wax')p.merit+=th;
    p.merit+=1;
    if(isGod(S,s,'varuna'))p.merit+=th;
    if(S.M.hong&&S.M.hong.o===s){const c=S.M.hong.c;if((ctype(S,c)==='temple'||c===0)&&S.B[c].o===s&&S.B[c].t>0)p.merit+=1}
    if(has(S,s,'chant'))p.merit+=1;
    if(ownsM(S,s,'kwang'))p.merit+=1;
    if(ownsM(S,s,'kilen'))p.sin=Math.max(0,p.sin-1);
    if(has(S,s,'offer'))p.merit+=th;
    if(has(S,s,'angel'))p.sin=Math.max(0,p.sin-1);
    if(has(S,s,'pray')&&p.uc.length){p.uc.sort((a,b)=>b-a);p.uc.shift()}
    if(has(S,s,'reinforce')){const r=Math.min(2,reserve(S,s));if(r>0)placeTroops(S,s,cityOf(s),r)}
    if(has(S,s,'blessed')&&p.sin===0)p.merit+=2;
    p.used=[];p.f={};
  }
  S.moon=S.moon==='wax'?'wane':'wax';
  S.round++;
  S.order=[...Array(S.n).keys()].sort((a,b)=>scores[a]-scores[b]||S.order.indexOf(a)-S.order.indexOf(b));
  S.pos=0;S.follow=null;
  log(S,`เริ่มรอบใหม่ · ${S.moon==='wax'?'กลางวัน':'กลางคืน'}`);
}
function setupGame(S){
  S.mapV=2;S.seed=Math.floor(Math.random()*1e9);const cells=SECT*S.n+2;S.B=Array.from({length:cells},()=>({o:-1,t:0}));
  for(let s=0;s<S.n;s++){S.B[cityOf(s)]={o:s,t:4}}
  S.P=[...Array(S.n)].map(()=>({merit:3,sin:0,vp:0,pw:[],uc:[],used:[],f:{}}));
  S.M={};S.round=1;S.moon='wax';
  S.order=[...Array(S.n).keys()].sort(()=>Math.random()-.5);S.pos=0;
  S.battle=null;S.follow=null;S.status='play';S.log=[];
  log(S,'เกมเริ่ม · กลางวัน');
}
const clone=o=>JSON.parse(JSON.stringify(o));
if(typeof module!=='undefined')module.exports={GODS,MOUNTS,POWERS,CARD,setupGame,resolveBattle,advance,endRound};
/* ลำดับเล่นรอบหน้าถ้าคะแนนเป็นแบบตอนนี้: คะแนนน้อยสุดก่อน เสมอกันใครเคยเล่นก่อนได้ก่อน */
function nextOrder(S){const sc=[...Array(S.n).keys()].map(s=>total(S,s));return [...Array(S.n).keys()].sort((a,b)=>sc[a]-sc[b]||S.order.indexOf(a)-S.order.indexOf(b))}
/* คำอธิบายเต็มของการ์ดพลัง ใช้ในป๊อปอัปรายละเอียด */
const PW_DETAIL={
 weapon:'ทุกครั้งที่คุณเป็นฝ่ายบุก พลังรบ +1',
 swift:'เดินทัพได้ไกลสุด 2 ช่องต่อครั้ง ช่องที่ผ่านต้องว่างหรือเป็นกองของคุณ ถ้าเจอศัตรูระหว่างทางจะหยุดรบที่ช่องนั้น',
 banner:'รอบกลางคืนฝ่ายบุกได้ +1 อยู่แล้ว การ์ดนี้เพิ่มให้อีก +1 รวมเป็น +2',
 rally:'ตอนคุณเป็นฝ่ายบุก ความเสียหายที่ได้รับลดลง 1 (เสียทหารน้อยลง 1 ตัว)',
 raid:'บุกแล้วชนะ แต้มฆ่าของคุณ +1 ฝ่ายรับเสียทหารเพิ่ม',
 vanguard:'ตอนบุก ถ้าทหารของคุณมากกว่าฝ่ายรับ ฝ่ายรับเสียทหาร 1 ตัวทันทีก่อนเปิดการ์ด',
 secret:'เดินเข้าและออกจากเขาพระสุเมรุได้จากทุกช่อง ไม่ต้องผ่านป่าลึก',
 chain:'บุกชนะและยังเหลือทหาร เดินต่อจากช่องนั้นได้อีก 1 ช่องในตาเดียวกัน ถ้าเจอศัตรูก็รบต่อได้ (ไม่นับเป็นแอคชัน)',
 manual:'ได้การ์ดรบ "พิชัยยุทธ" (พลัง 4 ฆ่า 2) เพิ่มในมือ เป็นการ์ดรบที่แรงที่สุด',
 divine:'ทุกครั้งที่คุณเป็นฝ่ายบุก พลังรบ +2',
 sky:'แอคชันเดินทัพใช้ได้ 2 ครั้งต่อรอบ และมีแอคชันรวมเป็น 4 ต่อรอบ',
 vpR:'ได้ 1 คะแนนถาวรทันทีที่ซื้อ',
 armor:'ทุกครั้งที่คุณเป็นฝ่ายตั้งรับ พลังรบ +1',
 levy:'แอคชันเกณฑ์ทัพได้ทหารเพิ่ม 1 ตัว',
 wall:'ตั้งรับในวัด พลังรบ +1',
 ward:'ตอนคุณเป็นฝ่ายตั้งรับ ความเสียหายที่ได้รับลดลง 1',
 reserve:'เกณฑ์ทัพลงช่องที่ติดกับเมืองของคุณได้ ถ้าช่องนั้นว่างหรือมีกองของคุณอยู่',
 unity:'ตั้งรับด้วยทหาร 5 ตัวขึ้นไป พลังรบ +1',
 counter:'ตั้งรับแล้วชนะ แต้มฆ่าของคุณ +1 ฝ่ายบุกเสียทหารเพิ่ม',
 fort:'กองนอกเมืองมีทหารได้สูงสุด 6 ตัว (ปกติ 5)',
 guardian:'ทุกครั้งที่คุณเป็นฝ่ายตั้งรับ พลังรบ +2',
 dominion:'ครองแดนปกติต้องยึดวัด 2 แห่งหรือเขาพระสุเมรุตอนจบรอบ การ์ดนี้ทำให้ยึดวัดแค่แห่งเดียวก็ได้ +1 คะแนนถาวรทุกจบรอบ',
 reinforce:'ทุกครั้งที่จบรอบ ได้ทหาร 2 ตัวจากคลังลงเมืองฟรี',
 vpK:'ได้ 1 คะแนนถาวรทันทีที่ซื้อ',
 holy:'แอคชันทำบุญได้บุญ +3 แทน +2',
 alms:'ซื้อการ์ดพลังและพาหนะถูกลง 1 บุญ (จ่ายอย่างน้อย 1)',
 chant:'ทุกครั้งที่จบรอบ ได้บุญ +1',
 pray:'ทุกครั้งที่จบรอบ การ์ดรบที่ใช้ไปแล้วใบที่แรงที่สุดกลับขึ้นมือ 1 ใบ',
 angel:'ทุกครั้งที่จบรอบ บาป −1',
 offer:'ทุกครั้งที่จบรอบ ได้บุญ +1 ต่อวัดที่คุณยึดอยู่',
 atone:'แอคชันทำบุญได้ทั้งบุญและลบบาป 1 พร้อมกัน ไม่ต้องเลือก',
 foresight:'รอบละครั้ง จ่าย 1 บุญเพื่อเปลี่ยนการ์ดรบหลังเปิดแล้ว ยังไม่เปิดใช้ในเวอร์ชันเว็บ',
 miracle:'รอบละครั้ง ได้แอคชันเพิ่ม 1 ครั้ง ใช้ทำแอคชันที่ใช้ไปแล้วซ้ำได้',
 pure:'บาปถึง 3 แล้วไม่เสียทหาร แค่รีเซ็ตบาปเป็น 0',
 blessed:'ทุกครั้งที่จบรอบ ถ้าบาปเป็น 0 ได้บุญ +2',
 vpB:'ได้ 1 คะแนนถาวรทันทีที่ซื้อ'
};
