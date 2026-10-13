/* ศึกเทพหิมพานต์ · กติกาเกมทั้งหมด (ไม่มีโค้ดหน้าจอ) */
/* ===================== DATA ===================== */
const GODS=[
 {k:'indra',name:'พระอินทร์',mount:'erawan',ab:'วชิราวุธ',txt:'รอบละครั้ง หลังเดินทัพ ทำให้กองศัตรูที่ติดกับกองคุณเสียทหาร 1 ตัว',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'narai',name:'พระนารายณ์',mount:'garuda',ab:'อวตาร',txt:'รอบละครั้ง ย้ายพาหนะของคุณไปกองไหนก็ได้ของตัวเอง (ฟรี)',weak:'เก่งเมื่อมีพาหนะ'},
 {k:'brahma',name:'พระพรหม',mount:'hong',ab:'สร้างสรรพสิ่ง',txt:'เกณฑ์ทัพได้ 3 ตัวแทน 2',weak:'รบปกติ ชนะด้วยจำนวน'},
 {k:'shiva',name:'พระอิศวร',mount:'nonthi',ab:'ระบำทำลายล้าง',txt:'บุกชนะ แต้มฆ่า +1',weak:'บุกชนะได้บาป +2'},
 {k:'yama',name:'พระยม',mount:'buffalo',ab:'ยมโลก',txt:'ทหารตายในศึกที่คุณเกี่ยว ได้บุญ +1 ต่อตัว',weak:'ไม่แรงขึ้นในศึก'},
 {k:'agni',name:'พระเพลิง',mount:'rhino',ab:'เผาผลาญ',txt:'บุกได้พลังรบ +1',weak:'ตั้งรับ −1'},
 {k:'varuna',name:'พระพิรุณ',mount:'naga',ab:'หลั่งฝน',txt:'จบรอบได้บุญ +1 ต่อวัด และตั้งรับในป่า +1',weak:'บุกปกติ'},
 {k:'surya',name:'พระอาทิตย์',mount:'rajasi',ab:'สุริยเดช',txt:'กลางวัน พลังรบ +1 ทั้งบุกและรับ',weak:'กลางคืน ตั้งรับ −1'},
 {k:'chan',name:'พระจันทร์',mount:'durong',ab:'จันทรคติ',txt:'กลางคืน ตั้งรับ +1',weak:'กลางวันไม่มีโบนัส'},
 {k:'jupiter',name:'พระพฤหัสบดี',mount:'kwang',ab:'ครูเทวดา',txt:'การ์ดพลังเลเวล 2–3 ถูกลง 1 บุญ',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'ganga',name:'พระแม่คงคา',mount:'makara',ab:'สายน้ำศักดิ์สิทธิ์',txt:'รบในช่องริมน้ำ +1 ทั้งบุกและรับ และเดินจากริมน้ำไปริมน้ำไหนก็ได้',weak:'รบที่อื่นปกติ'},
 {k:'vayu',name:'พระพาย',mount:'kraisorn',ab:'วายุ',txt:'กลางวัน เดินทัพได้ 2 ช่อง (ก้าวที่ 2 บุกไม่ได้)',weak:'เกณฑ์ทัพได้น้อยลง 1 ตัว และกองนอกเมืองมีได้แค่ 4 ตัว'},
 {k:'thorani',name:'พระแม่ธรณี',mount:'hera',ab:'ธรณีสาร',txt:'ตั้งรับ +1 ทุกที่',weak:'บุก −1'},
 {k:'vessuwan',name:'ท้าวเวสสุวรรณ',mount:'asura',ab:'จอมอสูร',txt:'บุกชนะ ขโมยบุญฝ่ายแพ้ 1',weak:'บาปเต็มเสียทหาร 3 ตัว (ปกติ 2)'},
 {k:'rahu',name:'พระราหู',mount:'kaisornnaka',ab:'อุปราคา',txt:'กลางคืน บุก +1 เพิ่ม (รวม +2)',weak:'กลางวันไม่มีโบนัส'},
 {k:'uma',name:'พระแม่อุมา',mount:'khotchasi',ab:'ศักติ',txt:'กองที่มีพาหนะ พลังรบ +1 ทั้งบุกและรับ',weak:'ไม่มีพาหนะก็ไม่มีโบนัส'},
 {k:'skanda',name:'พระขันธกุมาร',mount:'hatsadee',ab:'ขุนพลเทวดา',txt:'บุกด้วยทหารมากกว่าฝ่ายรับ แต้มฆ่า +1',weak:'ไม่มีโบนัสตอนตั้งรับ'},
 {k:'ganesha',name:'พระพิฆเนศ',mount:'thakthor',ab:'ขจัดอุปสรรค',txt:'เริ่มเกมด้วยบุญ 6 (ปกติ 3)',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'saraswati',name:'พระสุรัสวดี',mount:'kinnaree',ab:'ปัญญาญาณ',txt:'การ์ดพลังเลเวล 1 ราคา 1 บุญ',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'reusi',name:'พระฤๅษี',mount:'kilen',ab:'ตบะ',txt:'บุกชนะครั้งแรกของแต่ละรอบไม่ได้บาป',weak:'มีทหารทั้งหมด 9 ตัว (ปกติ 10)'}
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
 rajasi:{name:'ราชสีห์',ic:'🦁',cost:4,home:'plain',txt:'บุกชนะ แต้มฆ่า +1',bonus:'พระอาทิตย์: บุก +1 เพิ่ม'},
 khotchasi:{name:'คชสีห์',ic:'🐯',cost:4,home:'forest',txt:'ตั้งรับ +1 และตอนตั้งรับรับความเสียหาย −1',bonus:'พระแม่อุมา: บุกก็ +1 ด้วย'},
 kilen:{name:'กิเลน',ic:'🦄',cost:3,home:'temple',txt:'จบรอบ บาป −1',bonus:'พระฤๅษี: จบรอบได้บุญ +1 ด้วย'},
 durong:{name:'ดุรงค์ปักษิน (ม้าปีก)',ic:'🐎',cost:4,home:'sumeru',txt:'เดินได้ 2 ช่อง (ก้าวที่ 2 บุกไม่ได้)',bonus:'พระจันทร์: ตั้งรับ +1'},
 kinnaree:{name:'กินรี',ic:'🧚',cost:2,home:'water',txt:'ทำบุญได้บุญ +1 เพิ่ม',bonus:'พระสุรัสวดี: ทำบุญ +2 แทน +1'},
 makara:{name:'มกร',ic:'🐊',cost:3,home:'water',txt:'ตอนบุก รับความเสียหาย −1',bonus:'พระแม่คงคา: ตอนตั้งรับก็รับความเสียหาย −1'},
 hera:{name:'เหรา',ic:'🦎',cost:2,home:'deep',txt:'ตั้งรับ +1',bonus:'พระแม่ธรณี: ตั้งรับ +2 แทน +1'},
 hatsadee:{name:'นกหัสดีลิงค์',ic:'🦚',cost:3,home:'deep',txt:'กลางคืน บุก +2',bonus:'พระขันธกุมาร: กลางวันบุก +1 ด้วย'},
 kraisorn:{name:'ไกรสรปักษา',ic:'🦜',cost:3,home:'sumeru',txt:'กลางวัน ตั้งรับ +2',bonus:'พระพาย: กลางคืนตั้งรับ +1 ด้วย'},
 asura:{name:'อสุรปักษา',ic:'👹',cost:2,home:'forest',txt:'บุก +1',bonus:'ท้าวเวสสุวรรณ: บุก +2 แทน +1'},
 kwang:{name:'กวางทอง',ic:'🦌',cost:2,home:'temple',txt:'จบรอบ ได้บุญ +1',bonus:'พระพฤหัสบดี: ได้บุญ +2 แทน +1'},
 kaisornnaka:{name:'ไกรสรนาคา',ic:'🐲',cost:3,home:'royal',txt:'บุกชนะ ได้บุญ +2',bonus:'พระราหู: ได้บุญ +3 แทน +2'},
 thakthor:{name:'ทักทอ',ic:'🐐',cost:3,home:'plain',txt:'เกณฑ์ทัพลงกองที่มีทักทอได้',bonus:'พระพิฆเนศ: เกณฑ์ลงกองทักทอได้ +1 ตัว'}
};
/* ถิ่นของพาหนะ: รบในช่องถิ่นของตัวเอง พลังรบ +1 ทั้งบุกและรับ */
const HOMENAME={forest:'ป่า',deep:'ป่าลึก',plain:'ทุ่ง',water:'ริมน้ำ',temple:'วัด',sumeru:'เขาพระสุเมรุ',royal:'วัดหลวง'};
const HOME=Object.fromEntries(Object.entries(MOUNTS).map(([k,m])=>[k,HOMENAME[m.home]]));
const HOMEK={forest:1,temple:2,plain:3,water:4,deep:5};
function inHome(S,m,i){
  if(!m||!MOUNTS[m])return false;return terr(S,i)===MOUNTS[m].home;
}
const MK=Object.keys(MOUNTS);
const OWNER_GOD=Object.fromEntries(GODS.map(g=>[g.mount,g.k]));
const ownBond=(S,s,m)=>!!m&&OWNER_GOD[m]===godOf(S,s);
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
const SECT=8;
const L=S=>SECT*S.n;
const TNAME={city:'เมือง',forest:'ป่า',temple:'วัด',plain:'ทุ่ง',water:'ริมน้ำ',deep:'ป่าลึก',sumeru:'เขาพระสุเมรุ',royal:'วัดหลวง'};
const kOf=i=>(i-1)%SECT;
/* แผนที่ 7 แบบ (รุ่น 3: ผู้เล่นละ 8 ช่อง) ทุกแบบสมมาตรต่อผู้เล่น จึงแฟร์ทุกที่นั่ง
   ช่องในบล็อก k: 0 เมือง · 1 ป่านอก · 2 ทุ่งนอก · 3 ป่าใน · 4 ทุ่งใน · 5 วัด · 6 ริมน้ำ · 7 ป่าลึก
   ระยะจากเมือง: วัดของตัวเอง 3 ก้าว · วัดเพื่อนบ้าน 3 ก้าวขึ้นไป · เขาพระสุเมรุและวัดหลวง 5 ก้าวขึ้นไป
   edges: [k1, dt, k2] = ช่อง k1 ของผู้เล่น t ติดกับช่อง k2 ของผู้เล่น t+dt
   sumK: ช่องที่ติดเขาพระสุเมรุ · royK: ช่องที่ติดวัดหลวง */
const T8=['city','forest','plain','forest','plain','temple','water','deep'];
const BASE_EDGES=[[0,0,1],[0,0,2],[1,0,3],[2,0,4],[3,0,5],[4,0,5],[3,0,6],[5,0,7],[6,0,7],[2,1,1],[7,1,6]];
const MAPS=[
 {id:'classic',name:'วงแหวนหิมพานต์',desc:'แผนที่มาตรฐาน วัดอยู่ห่างเมือง 3 ก้าว ทางไปเขาพระสุเมรุต้องผ่านป่าลึก',types:T8,edges:BASE_EDGES,sumK:[7],royK:[7]},
 {id:'sea',name:'ทะเลสีทันดร',desc:'ริมน้ำทุกช่องต่อกันเป็นวง เดินอ้อมไปตีเพื่อนบ้านทางน้ำได้',types:T8,edges:[...BASE_EDGES,[6,1,6]],sumK:[7],royK:[7]},
 {id:'border',name:'ชายแดนเปิด',desc:'ทุ่งนอกติดทุ่งในของเพื่อนบ้านด้วย วัดเพื่อนบ้านอยู่ใกล้แค่ 3 ก้าว บุกกันดุ',types:T8,edges:[...BASE_EDGES,[2,1,4]],sumK:[7],royK:[7]},
 {id:'rivertemple',name:'วัดริมฝั่ง',desc:'วัดย้ายไปอยู่ริมน้ำวงใน ติดป่าลึกของเพื่อนบ้าน วัดถูกแย่งง่ายขึ้น',types:['city','forest','plain','forest','plain','water','temple','deep'],edges:BASE_EDGES,sumK:[7],royK:[7]},
 {id:'lonely',name:'เขาโดดเดี่ยว',desc:'เขาพระสุเมรุติดกับวัดหลวงเท่านั้น ต้องยึดวัดหลวงก่อนถึงจะขึ้นเขาได้',types:T8,edges:BASE_EDGES,sumK:[],royK:[7]},
 {id:'divide',name:'แม่น้ำแบ่งแดน',desc:'วงนอกไม่ติดกับเพื่อนบ้านเลย ต้องเดินเข้าวงในแล้วข้ามทางน้ำไปหากัน ช่วงแรกสงบ',types:T8,edges:[...BASE_EDGES.filter(e=>!(e[0]===2&&e[1]===1&&e[2]===1)),[6,1,6]],sumK:[7],royK:[7]},
 {id:'dense',name:'ป่ารก',desc:'ทางในบ้านตัดกันไปมา เดินอ้อมหลบศึกได้หลายทาง',types:T8,edges:[...BASE_EDGES,[1,0,4],[2,0,3]],sumK:[7],royK:[7]}
];
const MAPBY=Object.fromEntries(MAPS.map(m=>[m.id,m]));
const mapOf=S=>MAPBY[S.map]||MAPS[0];
function terr(S,i){if(i===0)return 'sumeru';if(isRoyal(S,i))return 'royal';return mapOf(S).types[kOf(i)]}
/* วัดหลวง: วัดที่ n+1 อยู่ติดเขาพระสุเมรุและป่าลึกทุกช่อง (ห้องที่สร้างก่อนมีวัดหลวงจะไม่มีช่องนี้) */
const royalOf=S=>SECT*S.n+1;
const hasRoyal=S=>!!(S.B&&S.B.length>SECT*S.n+1);
const isRoyal=(S,i)=>hasRoyal(S)&&i===royalOf(S);
const ctype=(S,i)=>{const t=terr(S,i);return t==='royal'?'temple':t==='deep'?'forest':t};
const citySeat=i=>(i-1)/SECT;
const cityOf=s=>1+SECT*s;
const has=(S,s,id)=>S.P[s].pw.includes(id);
const godOf=(S,s)=>S.seats[s].god;
const isGod=(S,s,k)=>godOf(S,s)===k;
const ADJC={};
function adjTable(S){
  const key=(S.map||'classic')+':'+S.n+':'+(hasRoyal(S)?1:0);if(ADJC[key])return ADJC[key];
  const n=S.n,M=mapOf(S),N=SECT*n+(hasRoyal(S)?2:1);const A=[...Array(N)].map(()=>new Set());
  const B=(t,k)=>1+SECT*(((t%n)+n)%n)+k;const link=(x,y)=>{if(x!==y){A[x].add(y);A[y].add(x)}};
  for(let t=0;t<n;t++){for(const [k1,dt,k2] of M.edges)link(B(t,k1),B(t+dt,k2));for(const k of M.sumK)link(0,B(t,k))}
  if(hasRoyal(S)){const r=royalOf(S);link(0,r);for(let t=0;t<n;t++)for(const k of M.royK)link(r,B(t,k))}
  return ADJC[key]=A.map(x=>[...x].sort((p,q)=>p-q));
}
function adj(S,i){return adjTable(S)[i]||[]}
function nbs(S,i,s){
  if(i===0){if(has(S,s,'secret')){const out=[];for(let j=1;j<S.B.length;j++)out.push(j);return out}return adj(S,0)}
  const out=adj(S,i).slice();
  if(has(S,s,'secret')&&!out.includes(0))out.push(0);
  if(isGod(S,s,'ganga')&&terr(S,i)==='water'){for(let j=1;j<S.B.length;j++)if(j!==i&&terr(S,j)==='water'&&!out.includes(j))out.push(j)}
  return out;
}
function mountAt(S,cell,s){for(const k of MK){const m=S.M[k];if(m&&m.o===s&&m.c===cell)return k}return null}
/* เมืองเก็บพาหนะได้หลายตัว กองนอกเมืองมีพาหนะได้ 1 ตัว */
function mountsAt(S,cell,s){return MK.filter(k=>{const m=S.M[k];return m&&m.o===s&&m.c===cell})}
const ownsM=(S,s,k)=>!!(S.M[k]&&S.M[k].o===s);
const meritAmt=(S,s)=>(has(S,s,'holy')?3:2)+(ownsM(S,s,'kinnaree')?(isGod(S,s,'saraswati')?2:1):0);
function mountsOf(S,s){return MK.filter(k=>S.M[k]&&S.M[k].o===s)}
function onBoard(S,s){let t=0;for(const c of S.B)if(c.o===s)t+=c.t;if(S.battle&&S.battle.a===s)t+=S.battle.n;if(S.retreat&&S.retreat.loser===s)t+=S.retreat.n;return t}
const reserve=(S,s)=>(isGod(S,s,'reusi')?9:10)-onBoard(S,s);
const cap=(S,s,i)=>i===cityOf(s)?99:(has(S,s,'fort')?6:5)-(isGod(S,s,'vayu')?1:0);
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

function priceOf(S,s,item){let base=item.mount?MOUNTS[item.mount].cost:COST[PW[item.pw].lv];
  if(item.pw){const lv=PW[item.pw].lv;if(isGod(S,s,'jupiter')&&lv>=2)base-=1;if(isGod(S,s,'saraswati')&&lv===1)base=1}
  return Math.max(1,base-(has(S,s,'alms')?1:0))}
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
const recruitAmt=(S,s,cell)=>(isGod(S,s,'brahma')?3:isGod(S,s,'vayu')?1:2)+(has(S,s,'levy')?1:0)+(cell!=null&&isGod(S,s,'ganesha')&&ownsM(S,s,'thakthor')&&S.M.thakthor.c===cell&&cell!==cityOf(s)?1:0);

function reachable(S,s,src,carry,maxRange){
  const fast=has(S,s,'swift')||carry==='garuda'||carry==='durong';let range=fast||(isGod(S,s,'vayu')&&S.moon==='wax')?2:1;const vayuOnly=(!fast&&range===2)||(carry==='durong'&&!has(S,s,'swift'));if(maxRange)range=Math.min(range,maxRange);
  const fly=carry==='garuda'&&isGod(S,s,'narai');
  const res={};const seen=new Set([src]);let front=[src];
  for(let d=0;d<range;d++){const nx=[];
    for(const c of front)for(const nb of nbs(S,c,s)){
      if(seen.has(nb))continue;
      if(ctype(S,nb)==='city'&&citySeat(nb)!==s)continue;
      const o=S.B[nb];const enemy=o.t>0&&o.o!==s;
      if(enemy){if(vayuOnly&&d>=1)continue;if(!res[nb])res[nb]='battle';if(fly){seen.add(nb);nx.push(nb)}continue}
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
  let lose=isGod(S,s,'vessuwan')?3:2;const city=cityOf(s);
  const take=i=>{const t=Math.min(lose,S.B[i].t);if(t>0){removeTroops(S,i,t);lose-=t}};
  take(city);
  const groups=[];S.B.forEach((c,i)=>{if(c.o===s&&c.t>0&&i!==city)groups.push(i)});
  groups.sort((a,b)=>S.B[a].t-S.B[b].t);
  for(const g of groups){if(lose<=0)break;take(g)}
  p.sin=0;log(S,`${gname(S,s)} บาปเต็ม เสียทหาร ${isGod(S,s,'vessuwan')?3:2} ตัว`);
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
  const pA=[['ทหาร',nA],['การ์ด',cA.s]],pD=[['ทหาร',nD],['การ์ด',cD.s]];
  const bm=battleMods(S,A,D,nA,nD,mA,mD,cell);pA.push(...bm.a);pD.push(...bm.d);if(bm.note)notes.push(...bm.note);
  const sA=pA.reduce((t,x)=>t+x[1],0),sD=pD.reduce((t,x)=>t+x[1],0);
  const aWin=sA>sD;
  // damage each side deals
  const km=killMods(S,A,D,mA,mD,b.n,S.B[cell].t);
  const kA=[['การ์ด',cA.k],...km.a,...(aWin?km.aWin:[])],kD=[['การ์ด',cD.k],...km.d,...(aWin?[]:km.dWin)];
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
    if(isGod(S,A,'reusi')&&!S.P[A].f.reusi){sin=0;S.P[A].f.reusi=true;notes.push('ตบะ ไม่ได้บาป')}
    if(isGod(S,A,'vessuwan')&&S.P[D].merit>0){S.P[D].merit--;S.P[A].merit++;notes.push('จอมอสูรขโมยบุญ 1')}
    S.P[A].sin+=sin;
    if(mA==='kaisornnaka'){const g=isGod(S,A,'rahu')?3:2;S.P[A].merit+=g;notes.push(`ไกรสรนาคา +${g} บุญ`)}
  }
  for(const s of [A,D]){if(isGod(S,s,'yama')&&deaths>0){const grpM=s===A?mA:mD;const g=deaths*(grpM==='buffalo'?2:1);S.P[s].merit+=g;notes.push(`ยมโลก +${g} บุญ`)}}
  const ob=x=>x.map(([l,v])=>({l,v}));
  if(S.trail&&S.trail[0]&&S.trail[0].k==='atk'&&S.trail[0].t===cell)S.trail[0].w=aWin?1:0;
  S.last={id:Date.now(),cell,A,D,ac:b.ac,dc:defCard,sA,sD,pA:ob(pA),pD:ob(pD),kA:ob(kA),kD:ob(kD),aWin,lossA,lossD,round:S.round,retreat:null};
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
/* โบนัสพลังรบทั้งหมดนอกจากทหารและการ์ด ใช้ทั้งตอนรบจริงและตอนแสดงในหน้าจอ */
function battleMods(S,A,D,nA,nD,mA,mD,cell){
  const a=[],d=[],note=[];const A_=(l,v)=>a.push([l,v]),D_=(l,v)=>d.push([l,v]);
  const t=terr(S,cell),temple=ctype(S,cell)==='temple',forest=ctype(S,cell)==='forest',day=S.moon==='wax',night=!day;
  if(has(S,A,'weapon'))A_('ศาสตราวุธ',1);if(has(S,A,'divine'))A_('อาวุธเทวะ',2);
  if(night){A_('กลางคืน',1);if(has(S,A,'banner'))A_('ธงรบ',1)}
  if(isGod(S,A,'agni'))A_('เผาผลาญ',1);
  if(mA==='garuda')A_('ครุฑ',1);if(mA==='nonthi')A_('โคนนทิ',1);if(mA==='rhino')A_('แรด',2);
  if(mA==='naga'&&temple&&isGod(S,A,'varuna'))A_('นาคในวัด',1);
  if(mA==='asura')A_('อสุรปักษา',isGod(S,A,'vessuwan')?2:1);
  if(mA==='hatsadee'){if(night)A_('หัสดีลิงค์ยามค่ำ',2);else if(isGod(S,A,'skanda'))A_('หัสดีลิงค์',1)}
  if(mA==='rajasi'&&isGod(S,A,'surya'))A_('ราชสีห์ของพระอาทิตย์',1);
  if(mA==='khotchasi'&&isGod(S,A,'uma'))A_('คชสีห์ของพระแม่อุมา',1);
  if(has(S,D,'armor'))D_('เกราะเพชร',1);if(temple&&has(S,D,'wall'))D_('กำแพงวัด',1);if(nD>=5&&has(S,D,'unity'))D_('สามัคคี',1);if(has(S,D,'guardian'))D_('ทวารบาล',2);
  if(isGod(S,D,'agni')&&!(mD==='rhino'))D_('เผาผลาญ (รับ)',-1);
  if(isGod(S,D,'varuna')&&forest)D_('ป่า',1);
  if(mD==='erawan')D_('เอราวัณ',2);if(mD==='nonthi')D_('โคนนทิ',1);
  if(mD==='naga'&&temple&&isGod(S,D,'varuna'))D_('นาคในวัด',1);
  if(mD==='hera')D_('เหรา',isGod(S,D,'thorani')?2:1);if(mD==='khotchasi')D_('คชสีห์',1);
  if(mD==='kraisorn'){if(day)D_('ไกรสรปักษา',2);else if(isGod(S,D,'vayu'))D_('ไกรสรปักษา',1)}
  // เทพ
  if(isGod(S,A,'surya')&&day)A_('สุริยเดช',1);if(isGod(S,D,'surya'))D_(day?'สุริยเดช':'สุริยเดช (กลางคืน)',day?1:-1);
  if(isGod(S,D,'chan')&&night)D_('จันทรคติ',1);if(mD==='durong'&&isGod(S,D,'chan'))D_('ม้าปีกของพระจันทร์',1);
  if(t==='water'){if(isGod(S,A,'ganga'))A_('สายน้ำศักดิ์สิทธิ์',1);if(isGod(S,D,'ganga'))D_('สายน้ำศักดิ์สิทธิ์',1)}
  if(isGod(S,D,'thorani'))D_('ธรณีสาร',1);if(isGod(S,A,'thorani'))A_('ธรณีสาร (บุก)',-1);
  if(isGod(S,A,'rahu')&&night)A_('อุปราคา',1);
  if(isGod(S,A,'uma')&&mA)A_('ศักติ',1);if(isGod(S,D,'uma')&&mD)D_('ศักติ',1);
  if(mA==='garuda'&&mD==='naga'){A_('ครุฑข่มนาค',2);note.push('ครุฑข่มนาค')}
  if(mD==='garuda'&&mA==='naga'){D_('ครุฑข่มนาค',2);note.push('ครุฑข่มนาค')}
  if(inHome(S,mA,cell))A_(MOUNTS[mA].name+'ในถิ่น',1);
  if(inHome(S,mD,cell))D_(MOUNTS[mD].name+'ในถิ่น',1);
  return {a,d,note};
}
/* ร่องรอยการเคลื่อนไหวล่าสุด ให้ทุกคนเห็นบนแผนที่ว่าใครเดินจากไหนไปไหน */
/* ตรวจข้อมูลก่อนบันทึก: Firestore ไม่รับ undefined และอาร์เรย์ซ้อนอาร์เรย์ */
function checkSavable(o,path){path=path||'S';
  if(o===undefined)throw new Error('ค่าว่าง (undefined) ที่ '+path);
  if(Array.isArray(o)){o.forEach((x,i)=>{if(Array.isArray(x))throw new Error('อาร์เรย์ซ้อนที่ '+path+'['+i+']');checkSavable(x,path+'['+i+']')});return}
  if(o&&typeof o==='object')for(const k in o)checkSavable(o[k],path+'.'+k);
}
function trail(S,o){S.trail=S.trail||[];S.seq=(S.seq||0)+1;S.trail.unshift(Object.assign({r:S.round,q:S.seq},o));if(S.trail.length>6)S.trail.length=6}
/* แต้มฆ่าที่ไม่ได้มาจากการ์ด: a/d = ได้เสมอ (รวมการลดความเสียหาย), aWin/dWin = ได้เมื่อชนะ */
function killMods(S,A,D,mA,mD,nA,nD){
  const a=[],d=[],aWin=[],dWin=[];
  if(isGod(S,A,'skanda')&&nA>nD)a.push(['ขุนพลเทวดา',1]);
  if(has(S,A,'raid'))aWin.push(['จู่โจม',1]);if(isGod(S,A,'shiva'))aWin.push(['ระบำทำลายล้าง',1]);if(mA==='rajasi')aWin.push(['ราชสีห์',1]);
  if(has(S,D,'counter'))dWin.push(['โต้กลับ',1]);
  if(mD==='naga'&&mA!=='garuda')a.push(['นาคกันไว้',-1]);
  if(has(S,D,'ward'))a.push(['มนต์คุ้มกาย',-1]);
  if(mA==='naga'&&mD!=='garuda')d.push(['นาคกันไว้',-1]);
  if(has(S,A,'rally'))d.push(['ปลุกใจ',-1]);
  if(mD==='khotchasi')a.push(['คชสีห์',-1]);
  if(mA==='makara')d.push(['มกร',-1]);
  if(mD==='makara'&&isGod(S,D,'ganga'))a.push(['มกรของพระแม่คงคา',-1]);
  return {a,d,aWin,dWin};
}
/* พรีวิวศึกที่รออยู่: พลังรบและแต้มฆ่า "ไม่รวมการ์ด" ให้ทุกคนเห็น */
function battlePreview(S){
  const b=S.battle;if(!b)return null;const A=b.a,D=b.d,cell=b.to;const mA=b.mount,mD=mountAt(S,cell,D);
  let nD=S.B[cell].t;const pre=[];if(has(S,A,'vanguard')&&b.n>nD&&nD>0){nD--;pre.push('ทัพหน้า: ฝ่ายรับเสีย 1 ตัวก่อนรบ')}
  const bm=battleMods(S,A,D,b.n,nD,mA,mD,cell);
  const pA=[['ทหาร',b.n],...bm.a],pD=[['ทหาร',nD],...bm.d];
  const sum=x=>x.reduce((t,y)=>t+y[1],0);
  return {A,D,mA,mD,nA:b.n,nD,pA,pD,baseA:sum(pA),baseD:sum(pD),km:killMods(S,A,D,mA,mD,b.n,S.B[cell].t),pre,notes:bm.note||[]};
}
function doRetreatApply(S,s,j,n,m,from){
  placeRetreat(S,s,j,n,m);trail(S,{k:'ret',s,f:from,t:j,n});
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
function cname(S,i){const t=terr(S,i);if(t==='city'){const x=S.seats[citySeat(i)];return'เมือง'+(x&&x.god?gname(S,citySeat(i)):(x&&x.name)||'')}return TNAME[t]}

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
/* เหตุผลที่เข้าเงื่อนไขครองแดน (ไว้แสดงบนจอ) */
function landWhy(S,s){const th=templesHeld(S,s);const r=[];if(holdsSumeru(S,s))r.push('ยึดเขาพระสุเมรุ');if(th>=2)r.push('วัด '+th+' แห่ง');else if(th>=1&&has(S,s,'dominion'))r.push('วัด 1 แห่ง + การ์ดครองแผ่นดิน');return r.join(' · ')}
function rulesLand(S,s){const th=templesHeld(S,s);return th>=2||holdsSumeru(S,s)||(has(S,s,'dominion')&&th>=1)}
function endRound(S){
  /* ครองแดนนับเฉพาะตอนจบรอบกลางคืน (คู่กับการตัดสินผู้ชนะ) */
  const lords=S.moon==='wane'?[...Array(S.n).keys()].filter(s=>rulesLand(S,s)):[];
  lords.forEach(s=>S.P[s].vp+=1);
  /* บันทึกคะแนนตอนจบรอบ ไว้แสดงตารางคะแนนและการเลื่อนอันดับ */
  {const sc=[...Array(S.n).keys()].map(s=>[S.P[s].vp,tempVP(S,s)]);const rank=[...Array(S.n).keys()].sort((a,b)=>(sc[b][0]+sc[b][1])-(sc[a][0]+sc[a][1])||sc[b][0]-sc[a][0]||a-b);
   const old=S.snap&&S.snap.vp?S.snap:null;
   /* Firestore เก็บอาร์เรย์ซ้อนอาร์เรย์ไม่ได้ จึงแยกเป็น vp กับ tp */
   S.snap={r:S.round,moon:S.moon,vp:sc.map(x=>x[0]),tp:sc.map(x=>x[1]),rank,prev:old?old.rank:null,pvp:old?old.vp:null,ptp:old?old.tp:null,lords}}
  if(lords.length)log(S,`ครองแดน +1 ถาวร: ${lords.map(s=>gname(S,s)).join(', ')}`);
  const scores=[...Array(S.n).keys()].map(s=>total(S,s));
  const best=Math.max(...scores);
  /* ตัดสินผู้ชนะเฉพาะตอนจบรอบกลางคืน */
  if(best>=S.target&&S.moon==='wane'){
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
    if(ownsM(S,s,'kwang'))p.merit+=isGod(S,s,'jupiter')?2:1;
    if(ownsM(S,s,'kilen')){p.sin=Math.max(0,p.sin-1);if(isGod(S,s,'reusi'))p.merit+=1}
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
function pickMap(S){return (S.mapPick&&MAPBY[S.mapPick])?S.mapPick:MAPS[Math.floor(Math.random()*MAPS.length)].id}
/* กระดานเปล่าสำหรับดูแผนที่ก่อนเลือกเทพ */
function previewState(S){return {n:S.n,map:S.map,seed:S.seed,seats:S.seats,B:Array.from({length:SECT*S.n+2},(_,i)=>({o:i>0&&i<=SECT*S.n&&kOf(i)===0?citySeat(i):-1,t:0})),M:{}}}
function terrCount(S){const c={};for(let i=0;i<S.B.length;i++){const t=terr(S,i);c[t]=(c[t]||0)+1}return c}
function setupGame(S){
  S.mapV=3;S.seed=S.seed||Math.floor(Math.random()*1e9);const cells=SECT*S.n+2;S.B=Array.from({length:cells},()=>({o:-1,t:0}));
  for(let s=0;s<S.n;s++){S.B[cityOf(s)]={o:s,t:4}}
  S.map=MAPBY[S.map]?S.map:pickMap(S);
  S.P=[...Array(S.n)].map((_,s)=>({merit:S.seats&&S.seats[s]&&S.seats[s].god==='ganesha'?6:3,sin:0,vp:0,pw:[],uc:[],used:[],f:{}}));
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
 dominion:'ครองแดนปกติต้องยึดวัด 2 แห่งหรือเขาพระสุเมรุตอนจบรอบกลางคืน การ์ดนี้ทำให้ยึดวัดแค่แห่งเดียวก็ได้ +1 คะแนนถาวร',
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
