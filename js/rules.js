/* ศึกเทพหิมพานต์ · กติกาเกมทั้งหมด (ไม่มีโค้ดหน้าจอ) */
/* ===================== DATA ===================== */
const GODS=[
 {k:'indra',name:'พระอินทร์',mount:'erawan',ab:'วชิราวุธ',txt:'รอบละครั้ง หลังเดินทัพ ทำให้กองศัตรูที่ติดกับกองคุณเสียทหาร 1 ตัว',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'narai',name:'พระนารายณ์',mount:'garuda',ab:'อวตาร',txt:'รอบละครั้ง ย้ายพาหนะของคุณไปกองไหนก็ได้ของตัวเอง (ฟรี)',weak:'เก่งเมื่อมีพาหนะ'},
 {k:'brahma',name:'พระพรหม',mount:'hong',ab:'สร้างสรรพสิ่ง',txt:'เกณฑ์ทัพได้ 3 ตัวแทน 2',weak:'รบปกติ ชนะด้วยจำนวน'},
 {k:'shiva',name:'พระอิศวร',mount:'nonthi',ab:'ระบำทำลายล้าง',txt:'บุกชนะ ศัตรูเสียทหารเพิ่ม 1 ตัว',weak:'บุกชนะได้บาป +2'},
 {k:'yama',name:'พระยม',mount:'buffalo',ab:'ยมโลก',txt:'ทหารตายในศึกที่คุณเกี่ยว ได้บุญ +1 ต่อตัว',weak:'ไม่แรงขึ้นในศึก'},
 {k:'agni',name:'พระเพลิง',mount:'rhino',ab:'เผาผลาญ',txt:'บุกได้พลังรบ +1',weak:'ตั้งรับ −1'},
 {k:'varuna',name:'พระพิรุณ',mount:'naga',ab:'หลั่งฝน',txt:'จบรอบได้บุญ +1 ต่อวัด และตั้งรับในป่า +1',weak:'บุกปกติ'}
];
const GOD=Object.fromEntries(GODS.map(g=>[g.k,g]));
const MOUNTS={
 erawan:{name:'ช้างเอราวัณ',sh:'ช',cost:4,txt:'ตั้งรับ +2',bonus:'พระอินทร์: วชิราวุธถึงกองที่ห่างเอราวัณ 2 ช่อง'},
 garuda:{name:'ครุฑ',sh:'ค',cost:4,txt:'บุก +1 และเดินได้ 2 ช่อง',bonus:'พระนารายณ์: บินข้ามช่องศัตรูได้'},
 hong:{name:'หงส์',sh:'ห',cost:3,txt:'จบรอบในวัดหรือเขาพระสุเมรุ ได้บุญ +1',bonus:'พระพรหม: เกณฑ์ทัพลงกองที่มีหงส์ได้'},
 nonthi:{name:'โคนนทิ',sh:'โ',cost:3,txt:'พลังรบ +1 ทั้งบุกและรับ',bonus:'พระอิศวร: บุกชนะได้บาปแค่ +1'},
 buffalo:{name:'กระบือ',sh:'ก',cost:2,txt:'บุกชนะแล้วไม่ได้บาป',bonus:'พระยม: ยมโลก +2 ต่อตัวในศึกของกองนี้'},
 rhino:{name:'แรด',sh:'ร',cost:3,txt:'บุก +2',bonus:'พระเพลิง: กองนี้ไม่โดนตั้งรับ −1'},
 naga:{name:'นาค',sh:'น',cost:4,txt:'รับความเสียหาย −1 (ครุฑลบล้าง)',bonus:'พระพิรุณ: +1 เมื่ออยู่ในวัด'}
};
const MK=Object.keys(MOUNTS);
const OWNER_GOD={erawan:'indra',garuda:'narai',hong:'brahma',nonthi:'shiva',buffalo:'yama',rhino:'agni',naga:'varuna'};
const LINES={rit:'สายฤทธิ์',kum:'สายคุ้มกัน',bun:'สายบุญ'};
const P=(id,line,lv,name,txt,todo)=>({id,line,lv,name,txt,todo:!!todo});
const POWERS=[
 P('weapon','rit',1,'ศาสตราวุธ','บุก +1'),P('swift','rit',1,'ม้าเร็ว','เดินทัพได้ 2 ช่อง'),P('banner','rit',1,'ธงรบ','ข้างแรม บุก +1 เพิ่ม'),P('rally','rit',1,'ปลุกใจ','ตอนบุก รับความเสียหาย −1'),
 P('raid','rit',2,'จู่โจม','บุกชนะ ศัตรูเสียเพิ่ม 1'),P('vanguard','rit',2,'ทัพหน้า','บุกด้วยทหารมากกว่า ศัตรูเสีย 1 ก่อนรบ'),P('secret','rit',2,'ทางลับ','เข้าเขาพระสุเมรุจากช่องไหนก็ได้'),P('chain','rit',2,'ชัยต่อเนื่อง','บุกชนะ เดินต่อได้อีก 1 ช่อง'),
 P('manual','rit',3,'ตำราพิชัยสงคราม','ได้การ์ดรบเลข 4'),P('divine','rit',3,'อาวุธเทวะ','บุก +2'),P('sky','rit',3,'กองทัพฟ้า','เดินทัพได้ 2 ครั้งต่อรอบ (แอคชันที่ 4)'),P('vpR','rit',3,'ชัยชนะอมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('armor','kum',1,'เกราะเพชร','ตั้งรับ +1'),P('levy','kum',1,'ไพร่พล','เกณฑ์ทัพ +1 ตัว'),P('wall','kum',1,'กำแพงวัด','ตั้งรับในวัด +1'),P('ward','kum',1,'มนต์คุ้มกาย','ตอนตั้งรับ รับความเสียหาย −1'),
 P('reserve','kum',2,'กองหนุน','เกณฑ์ทัพลงช่องติดเมืองได้'),P('unity','kum',2,'สามัคคี','กอง 5 ตัวขึ้นไป ตั้งรับ +1'),P('counter','kum',2,'โต้กลับ','ตั้งรับชนะ ฝ่ายบุกเสียเพิ่ม 1'),P('fort','kum',2,'ป้อมค่าย','กองละ 6 ตัวได้'),
 P('guardian','kum',3,'ทวารบาล','ตั้งรับ +2'),P('dominion','kum',3,'ครองแผ่นดิน','จบรอบยึด 2 วัดขึ้นไป ได้ 1 คะแนนถาวร'),P('reinforce','kum',3,'กำลังเสริม','จบรอบได้ทหาร 2 ตัวลงเมือง'),P('vpK','kum',3,'ผู้พิทักษ์อมตะ','ได้ 1 คะแนนถาวรทันที'),
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
const L=S=>3*S.n;
const ctype=(S,i)=>i===0?'sumeru':['city','forest','temple'][(i-1)%3];
const citySeat=i=>(i-1)/3;
const cityOf=s=>1+3*s;
const has=(S,s,id)=>S.P[s].pw.includes(id);
const godOf=(S,s)=>S.seats[s].god;
const isGod=(S,s,k)=>godOf(S,s)===k;
function ringNb(S,i){const n=L(S);return [((i-2+n)%n)+1,(i%n)+1]}
function nbs(S,i,s){
  if(i===0){const out=[];for(let j=1;j<=L(S);j++){if(ctype(S,j)==='temple'||has(S,s,'secret'))out.push(j)}return out}
  const out=ringNb(S,i);
  if(ctype(S,i)==='temple'||has(S,s,'secret'))out.push(0);
  return out;
}
function mountAt(S,cell,s){for(const k of MK){const m=S.M[k];if(m&&m.o===s&&m.c===cell)return k}return null}
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
  if(has(S,s,'reserve')){for(const j of ringNb(S,cityOf(s))){const c=S.B[j];if(c.t===0||c.o===s)out.push(j)}}
  if(isGod(S,s,'brahma')&&S.M.hong&&S.M.hong.o===s&&!out.includes(S.M.hong.c))out.push(S.M.hong.c);
  return out.filter(j=>j===cityOf(s)||S.B[j].t<cap(S,s,j));
}
const recruitAmt=(S,s)=>(isGod(S,s,'brahma')?3:2)+(has(S,s,'levy')?1:0);

function reachable(S,s,src,carry,maxRange){
  let range=has(S,s,'swift')||carry==='garuda'?2:1;if(maxRange)range=Math.min(range,maxRange);
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
  placeTroops(S,s,j,n);
  if(m){if(mountAt(S,j,s))S.M[m].c=cityOf(s);else S.M[m].c=j}
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
  if(S.moon==='wane'){a('ข้างแรม',1);if(has(S,A,'banner'))a('ธงรบ',1)}
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
  const sA=pA.reduce((t,x)=>t+x[1],0),sD=pD.reduce((t,x)=>t+x[1],0);
  const aWin=sA>sD;
  // damage each side deals
  const kA=[['การ์ด',cA.k]],kD=[['การ์ด',cD.k]];
  if(aWin){if(has(S,A,'raid'))kA.push(['จู่โจม',1]);if(isGod(S,A,'shiva'))kA.push(['ระบำทำลายล้าง',1])}
  else{if(has(S,D,'counter'))kD.push(['โต้กลับ',1])}
  // reductions on the receiving side
  if(mD==='naga'&&mA!=='garuda')kA.push(['นาคกันไว้',-1]);
  if(has(S,D,'ward'))kA.push(['มนต์คุ้มกาย',-1]);
  if(mA==='naga'&&mD!=='garuda')kD.push(['นาคกันไว้',-1]);
  if(has(S,A,'rally'))kD.push(['ปลุกใจ',-1]);
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
  }
  for(const s of [A,D]){if(isGod(S,s,'yama')&&deaths>0){const grpM=s===A?mA:mD;const g=deaths*(grpM==='buffalo'?2:1);S.P[s].merit+=g;notes.push(`ยมโลก +${g} บุญ`)}}
  S.last={cell,A,D,ac:b.ac,dc:defCard,sA,sD,pA,pD,kA,kD,aWin,lossA,lossD,round:S.round,retreat:null};
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
function cname(S,i){const t=ctype(S,i);if(t==='sumeru')return'เขาพระสุเมรุ';if(t==='city')return'เมือง'+gname(S,citySeat(i));return t==='temple'?'วัด':'ป่า'}

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
function endRound(S){
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
    if(has(S,s,'offer'))p.merit+=th;
    if(has(S,s,'angel'))p.sin=Math.max(0,p.sin-1);
    if(has(S,s,'pray')&&p.uc.length){p.uc.sort((a,b)=>b-a);p.uc.shift()}
    if(has(S,s,'dominion')&&th>=2)p.vp+=1;
    if(has(S,s,'reinforce')){const r=Math.min(2,reserve(S,s));if(r>0)placeTroops(S,s,cityOf(s),r)}
    if(has(S,s,'blessed')&&p.sin===0)p.merit+=2;
    p.used=[];p.f={};
  }
  S.moon=S.moon==='wax'?'wane':'wax';
  S.round++;
  S.order=[...Array(S.n).keys()].sort((a,b)=>scores[a]-scores[b]||S.order.indexOf(a)-S.order.indexOf(b));
  S.pos=0;S.follow=null;
  log(S,`เริ่มรอบใหม่ · ${S.moon==='wax'?'ข้างขึ้น':'ข้างแรม'}`);
}
function setupGame(S){
  const cells=3*S.n+1;S.B=Array.from({length:cells},()=>({o:-1,t:0}));
  for(let s=0;s<S.n;s++){S.B[cityOf(s)]={o:s,t:4}}
  S.P=[...Array(S.n)].map(()=>({merit:3,sin:0,vp:0,pw:[],uc:[],used:[],f:{}}));
  S.M={};S.round=1;S.moon='wax';
  S.order=[...Array(S.n).keys()].sort(()=>Math.random()-.5);S.pos=0;
  S.battle=null;S.follow=null;S.status='play';S.log=[];
  log(S,'เกมเริ่ม · ข้างขึ้น');
}
const clone=o=>JSON.parse(JSON.stringify(o));
if(typeof module!=='undefined')module.exports={GODS,MOUNTS,POWERS,CARD,setupGame,resolveBattle,advance,endRound};
