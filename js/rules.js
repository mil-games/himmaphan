/* ศึกเทพหิมพานต์ · กติกาเกมทั้งหมด (ไม่มีโค้ดหน้าจอ) */
/* ===================== DATA ===================== */
const GODS=[
 {k:'indra',name:'พระอินทร์',mount:'erawan',ab:'วชิราวุธ',txt:'รอบละครั้ง หลังเดินทัพ ทำให้กองศัตรูที่ติดกับกองที่เพิ่งเดินเสียทหาร 1 ตัว',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'narai',name:'พระนารายณ์',mount:'garuda',ab:'อวตาร',txt:'รอบละครั้ง ย้ายพาหนะไปกองไหนก็ได้ของตัวเอง หรือสลับตำแหน่งกอง 2 กองของตัวเอง (ฟรี)',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'brahma',name:'พระพรหม',mount:'hong',ab:'สร้างสรรพสิ่ง',txt:'เกณฑ์ทัพได้ 3 ตัว (จ่ายบุญแค่ 2) และเกณฑ์ลงวัดที่ยึดอยู่ได้',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'shiva',name:'พระอิศวร',mount:'nonthi',ab:'ระบำทำลายล้าง',txt:'บุกชนะได้แต้มโทสะ 1 (สูงสุด 3) บุก +1 ต่อแต้ม รอบไหนไม่บุก แต้มหายหมด',weak:'บุกชนะได้บาป +2'},
 {k:'yama',name:'พระยม',mount:'buffalo',ab:'ยมโลก',txt:'ทหารตายในศึกที่คุณเกี่ยว ได้บุญ +1 ต่อตัว',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'agni',name:'พระเพลิง',mount:'rhino',ab:'เผาผลาญ',txt:'บุกได้พลังรบ +1',weak:'ตั้งรับ −1'},
 {k:'varuna',name:'พระพิรุณ',mount:'naga',ab:'หลั่งฝน',txt:'จบรอบได้บุญ +1 ต่อวัด และตั้งรับในวัด +1',weak:'บุกไม่มีโบนัส'},
 {k:'surya',name:'พระอาทิตย์',mount:'rajasi',ab:'สุริยเดช',txt:'กลางวัน พลังรบ +1 ทั้งบุกและรับ และจบรอบกลางวัน กองในวัดที่มีไม่ถึง 3 ได้ทหาร +1',weak:'กลางคืน ตั้งรับ −1'},
 {k:'chan',name:'พระจันทร์',mount:'durong',ab:'จันทรคติ',txt:'กลางคืน ตั้งรับ +1 และกองที่ไม่ได้ขยับทั้งรอบ ตั้งรับ +1',weak:'กลางวันเหลือแค่โบนัสกองที่ไม่ได้ขยับ'},
 {k:'jupiter',name:'พระพฤหัสบดี',mount:'kwang',ab:'ครูเทวดา',txt:'ตอนยึดวัดหรือเขาพระสุเมรุอยู่ การ์ดพลังเลเวล 2–3 ถูกลง 1 บุญ',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'ganga',name:'พระแม่คงคา',mount:'makara',ab:'สายน้ำศักดิ์สิทธิ์',txt:'รบในช่องริมน้ำ +1 ทั้งบุกและรับ และเดินจากริมน้ำไปริมน้ำไหนก็ได้',weak:'รบนอกริมน้ำไม่มีโบนัส'},
 {k:'vayu',name:'พระพาย',mount:'kraisorn',ab:'วายุ',txt:'เดินทัพได้ 2 ช่อง ทั้งกลางวันและกลางคืน ก้าวที่ 2 บุกได้ (แต่เข้าวัดหรือเขาไม่ได้)',weak:'กองนอกเมืองมีได้แค่ 4 ตัว'},
 {k:'thorani',name:'พระแม่ธรณี',mount:'hera',ab:'แผ่นดินค้ำจุน',txt:'ตั้งรับ +1 และ +1 ต่อกองของคุณที่อยู่ติดช่องนั้น (รวมสูงสุด +3)',weak:'บุกไม่มีโบนัส'},
 {k:'vessuwan',name:'ท้าวเวสสุวรรณ',mount:'asura',ab:'จอมอสูร',txt:'บุกชนะ ขโมยบุญฝ่ายแพ้ 1 และคนอื่นไม่เห็นการ์ดรบในมือคุณ',weak:'บาปเต็มเสียทหาร 3 ตัว (ปกติ 2)'},
 {k:'rahu',name:'พระราหู',mount:'kaisornnaka',ab:'อุปราคา',txt:'กลางคืน บุก +1 เพิ่ม (รวม +2) และคนอื่นไม่เห็นจำนวนทหารในกองนอกเมืองของคุณ',weak:'กลางวันไม่มีโบนัส'},
 {k:'uma',name:'พระแม่อุมา',mount:'khotchasi',ab:'ศักติ',txt:'กองที่มีพาหนะ พลังรบ +1 ทั้งบุกและรับ',weak:'ไม่มีพาหนะก็ไม่มีโบนัส'},
 {k:'skanda',name:'พระขันธกุมาร',mount:'hatsadee',ab:'ขุนพลเทวดา',txt:'บุกด้วยทหารมากกว่าฝ่ายรับ แต้มฆ่า +1',weak:'ไม่มีโบนัสตอนตั้งรับ'},
 {k:'ganesha',name:'พระพิฆเนศ',mount:'thakthor',ab:'ขจัดอุปสรรค',txt:'เริ่มด้วยบุญ 5 และทำบุญตอนยึดวัดหรือเขาอยู่ ได้บุญ +1',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'saraswati',name:'พระสุรัสวดี',mount:'kinnaree',ab:'ปัญญาญาณ',txt:'การ์ดพลังเลเวล 1 ราคา 1 บุญ',weak:'ไม่มีโบนัสตอนรบ'},
 {k:'reusi',name:'พระฤๅษี',mount:'kilen',ab:'ตบะ',txt:'บุกชนะครั้งแรกของแต่ละรอบไม่ได้บาป และตั้งรับเห็นการ์ดฝ่ายบุกก่อนเลือก',weak:'มีทหารทั้งหมด 9 ตัว (ปกติ 10)'}
];
/* แนวทางเล่นของเทพ 4 สาย */
const ARCH={war:{n:'สายสงคราม',ic:'⚔',d:'ยิ่งรบต่อเนื่องยิ่งเก่ง แต่เปลืองทหาร'},bun:{n:'สายบุญบารมี',ic:'🙏',d:'ยึดวัดและเขาแล้วได้ทรัพยากร'},maya:{n:'สายมายา',ic:'🌀',d:'เคลื่อนที่หลอกล่อ ซ่อนข้อมูล'},guard:{n:'สายผู้พิทักษ์',ic:'🛡',d:'ยืนเฝ้านานยิ่งแข็ง กองช่วยกันเอง'}};
const GOD_ARCH={"war": ["indra", "shiva", "agni", "skanda", "yama"], "bun": ["brahma", "varuna", "jupiter", "ganesha", "saraswati"], "maya": ["narai", "vayu", "rahu", "vessuwan", "reusi"], "guard": ["thorani", "uma", "ganga", "chan", "surya"]};
GODS.forEach(g=>{for(const a in GOD_ARCH)if(GOD_ARCH[a].includes(g.k))g.arch=a});
const GOD=Object.fromEntries(GODS.map(g=>[g.k,g]));
const MOUNTS={
 erawan:{name:'ช้างเอราวัณ',ic:'🐘',cost:4,home:'forest',txt:'ตั้งรับ +1 และกองที่มีเอราวัณจุทหารได้เพิ่ม 1 ตัว',bonus:'พระอินทร์: ถ้าเอราวัณเดินมากับกองนั้น วชิราวุธถึงกองที่ห่าง 2 ช่อง'},
 garuda:{name:'ครุฑ',ic:'🦅',cost:4,home:'sumeru',txt:'บุก +1 และเดินได้ 2 ช่อง',bonus:'พระนารายณ์: บินข้ามช่องศัตรูได้'},
 hong:{name:'หงส์',ic:'🦢',cost:3,home:'temple',txt:'จบรอบในวัดหรือเขาพระสุเมรุ ได้บุญ +1',bonus:'พระพรหม: เกณฑ์ทัพลงกองที่มีหงส์ได้'},
 nonthi:{name:'โคนนทิ',ic:'🐂',cost:3,home:'royal',txt:'พลังรบ +1 ทั้งบุกและรับ',bonus:'พระอิศวร: บุกชนะได้บาปแค่ +1'},
 buffalo:{name:'กระบือ',ic:'🐃',cost:2,home:'plain',txt:'บุกชนะแล้วไม่ได้บาป',bonus:'พระยม: ยมโลก +2 ต่อตัวในศึกของกองนี้'},
 rhino:{name:'แรด',ic:'🦏',cost:3,home:'deep',txt:'บุก +2',bonus:'พระเพลิง: กองนี้ไม่โดนตั้งรับ −1'},
 naga:{name:'นาค',ic:'🐍',cost:4,home:'water',txt:'รับความเสียหาย −1 (ครุฑลบล้าง) · บุกออกจากริมน้ำหรือบุกเข้าริมน้ำ +2',bonus:'พระพิรุณ: +1 เมื่ออยู่ในวัด'},
 rajasi:{name:'ราชสีห์',ic:'🦁',cost:4,home:'plain',txt:'เดินได้ 2 ช่อง · บุกชนะ แต้มฆ่า +1',bonus:'พระอาทิตย์: บุก +1 เพิ่ม'},
 khotchasi:{name:'คชสีห์',ic:'🐯',cost:4,home:'forest',txt:'ตั้งรับ +1 และตอนตั้งรับรับความเสียหาย −1',bonus:'พระแม่อุมา: บุกก็ +1 ด้วย'},
 kilen:{name:'กิเลน',ic:'🦄',cost:3,home:'temple',txt:'จบรอบ บาป −1',bonus:'พระฤๅษี: จบรอบได้บุญ +1 ด้วย'},
 durong:{name:'ดุรงค์ปักษิน (ม้าปีก)',ic:'🐎',cost:4,home:'sumeru',txt:'เดินได้ 2 ช่อง',bonus:'พระจันทร์: ตั้งรับ +1'},
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
const LINES={rit:'สายฤทธิ์',kum:'สายคุ้มกัน',bun:'สายบุญ',maya:'สายมายา'};
const LINE_ORDER=['rit','kum','bun','maya'];
/* สายการ์ดที่ใช้ในห้อง: ห้องเก่าที่ไม่ได้ตั้งไว้ใช้ครบ 4 สาย · ค่าเริ่มต้นห้องใหม่: 2–3 คนใช้ 3 สายแรก 4 คนขึ้นไปใช้ 4 สาย */
const activeLines=S=>Array.isArray(S.lines)&&S.lines.length?LINE_ORDER.filter(l=>S.lines.includes(l)):LINE_ORDER;
const defaultLines=n=>n<=3?['rit','kum','bun']:[...LINE_ORDER];
const cardCount=(lines,useL3)=>POWERS.filter(p=>!p.todo&&(useL3||p.lv<3)&&lines.includes(p.line)).length;
const P=(id,line,lv,name,txt,todo)=>({id,line,lv,name,txt,todo:!!todo});
const POWERS=[
 P('weapon','rit',1,'ศาสตราวุธ','บุก +1'),P('swift','rit',1,'ม้าเร็ว','เดินทัพได้ 2 ช่อง'),P('banner','rit',1,'ธงรบ','กลางคืน บุก +1 เพิ่ม'),P('rally','rit',1,'ปลุกใจ','ตอนบุก รับความเสียหาย −1'),
 P('raid','rit',2,'จู่โจม','บุกชนะ ศัตรูเสียเพิ่ม 1'),P('vanguard','rit',2,'ทัพหน้า','บุกด้วยทหารน้อยกว่า แต้มฆ่า +1'),P('secret','rit',2,'ทางลับ','วัดและริมน้ำ เดินเข้าออกเขาพระสุเมรุได้ตรงๆ'),P('chain','rit',2,'ชัยต่อเนื่อง','บุกชนะ เดินต่อได้อีก 1 ช่อง'),
 P('manual','rit',3,'ตำราพิชัยสงคราม','ได้การ์ดรบเลข 4'),P('divine','rit',3,'อาวุธเทวะ','บุก +2'),P('sky','rit',3,'กองทัพฟ้า','เดินทัพได้ 2 ครั้งต่อรอบ (แอคชันที่ 4)'),P('vpR','rit',3,'ชัยชนะอมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('plunder','rit',1,'ปล้นสะดม','บุกชนะ ได้บุญ +2'),P('ambush','rit',1,'ซุ่มโจมตี','บุกออกจากวัดหรือเขาพระสุเมรุ +1'),P('horn','rit',1,'แตรศึก','บุกตอนกลางวัน +1'),P('disarm','rit',1,'ริบอาวุธ','บุกชนะ ฝ่ายรับต้องทิ้งการ์ดรบ 1 ใบ'),
 P('blitz','rit',2,'สายฟ้าแลบ','บุกด้วยทหารไม่เกิน 2 ตัว +2'),P('pursuit','rit',2,'ไล่ล่า','บุกชนะ ฝ่ายแพ้ต้องถอย 2 ช่อง'),P('fury','rit',2,'เดือดดาล','บุกกองที่ทหารมากกว่าคุณ +1'),
 P('storm','rit',3,'พายุศึก','อีกฝ่ายทหารมากกว่า +2 (บุกและรับ)'),P('warlord','rit',3,'จอมทัพ','กองหนึ่งพาพาหนะได้ 2 ตัว (กองนั้นทหารสูงสุด 4)'),P('siege','rit',2,'ปิดล้อม','บุกวัดหรือเขาพระสุเมรุ +1'),P('conquest','rit',3,'ผู้พิชิต','บุกชนะครั้งแรกของรอบ +1 ถาวรเพิ่ม'),
 P('armor','kum',1,'เกราะเพชร','ตั้งรับ +1'),P('levy','kum',1,'ไพร่พล','เกณฑ์ทัพ +1 ตัว'),P('wall','kum',1,'กำแพงวัด','ตั้งรับในวัด +1'),P('ward','kum',1,'มนต์คุ้มกาย','ตอนตั้งรับ รับความเสียหาย −1'),
 P('reserve','kum',2,'กองหนุน','เกณฑ์ทัพลงช่องที่ติดกองของคุณได้ (ไม่ใช่วัดหรือเขา)'),P('unity','kum',2,'สามัคคี','กอง 5 ตัวขึ้นไป ตั้งรับ +1'),P('counter','kum',2,'โต้กลับ','ตั้งรับชนะ ฝ่ายบุกเสียเพิ่ม 1'),P('fort','kum',2,'ป้อมค่าย','กองนอกเมืองจุทหารได้เพิ่ม 1 ตัว'),
 P('guardian','kum',3,'ทวารบาล','ตั้งรับ +2'),P('dominion','kum',3,'ครองแผ่นดิน','ยึดวัดแห่งเดียวก็ได้ครองแดน'),P('reinforce','kum',3,'กำลังเสริม','จบรอบได้ทหาร 2 ตัวลงเมือง'),P('vpK','kum',3,'ผู้พิทักษ์อมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('drill','kum',1,'ค่ายฝึก','เกณฑ์ทัพจ่ายบุญน้อยลง 1'),P('moat','kum',1,'คูเมือง','ตั้งรับด้วยทหารน้อยกว่า ฝ่ายบุก −1'),P('watch','kum',1,'หอยาม','ตั้งรับตอนกลางคืน +1'),P('militia','kum',1,'กองอาสา','ตั้งรับด้วยทหารไม่เกิน 2 ตัว +2'),
 P('trap','kum',2,'กับดัก','ศัตรูบุกวัดของคุณ −1'),P('fallback','kum',2,'ถอยทัพ','แพ้ศึก คุณเลือกช่องถอยเอง'),P('garrison','kum',2,'ทหารประจำวัด','จบรอบ กองในวัด/เขาที่มีไม่ถึง 3 ได้ +1 ตัว'),
 P('aegis','kum',3,'เกราะเทวะ','ตั้งรับ +1 และรับความเสียหาย −1'),P('citadel','kum',3,'ป้อมเขาพระสุเมรุ','ตั้งรับที่เขาพระสุเมรุหรือวัดหลวง +2'),P('eye','kum',2,'ตาทิพย์','ตั้งรับ เห็นการ์ดฝ่ายบุกก่อนเลือก'),P('stand','kum',3,'ผู้ยืนหยัด','ตั้งรับชนะ +1 ถาวร (รอบละครั้ง)'),
 P('holy','bun',1,'น้ำมนต์','ทำบุญได้ +3'),P('alms','bun',1,'ทานบารมี','ซื้อของถูกลง 1 บุญ'),P('chant','bun',1,'สวดมนต์','จบรอบได้บุญ +1'),P('pray','bun',1,'อธิษฐาน','จบรอบได้การ์ดรบที่ใช้แล้วคืน 1 ใบ'),
 P('angel','bun',2,'เทวดารักษา','จบรอบลบบาป 1'),P('offer','bun',2,'ถวายวัด','จบรอบได้บุญ +1 ต่อวัด'),P('atone','bun',2,'ไถ่บาป','ทำบุญได้ทั้งบุญและลบบาป'),P('foresight','bun',2,'ญาณหยั่งรู้','เปลี่ยนการ์ดหลังเปิด (ยังไม่เปิดในเวอร์ชันออนไลน์)',1),
 P('miracle','bun',3,'ปาฏิหาริย์','รอบละครั้ง ทำแอคชันที่ใช้แล้วซ้ำได้'),P('pure','bun',3,'ผู้ทรงศีล','บาปเต็มไม่เสียทหาร'),P('blessed','bun',3,'บุญหนุนนำ','จบรอบถ้าบาป 0 ได้บุญ +2'),P('vpB','bun',3,'บุญบารมีอมตะ','ได้ 1 คะแนนถาวรทันที'),
 P('shade','maya',1,'เงาพราง','คนอื่นเห็นจำนวนทหารนอกเมืองของคุณเป็น ?'),P('poison','maya',1,'ยาพิษ','ศึกที่คุณแพ้ แต้มฆ่า +1'),P('shadowgate','maya',1,'ประตูเงา','เดินข้ามหัวศัตรูได้ 1 ช่อง'),P('smoke','maya',1,'หมอกควัน','ตั้งรับ ฝ่ายบุกไม่ได้โบนัสพาหนะ'),
 P('forestway','maya',1,'ทางลัดเงา','เดินทัพได้ 2 ช่อง'),P('blackmarket','maya',1,'ตลาดมืด','ซื้อพาหนะถูกลง 1 บุญ'),P('merc','maya',1,'ทหารรับจ้าง','เกณฑ์ทัพ +1 ตัว (บุญเท่าเดิม)'),P('arson','maya',1,'ลอบวางเพลิง','บุกชนะ ขโมยบุญ 1'),
 P('warp','maya',2,'เดินทัพซ้อน','เดินทัพได้ 2 ครั้งต่อรอบ'),P('venom','maya',2,'พิษร้าย','ใครชนะศึกกับคุณ เสียเพิ่ม 1'),P('veil','maya',2,'ม่านมายา','ศัตรูไม่เห็นโบนัสพลังรบของคุณก่อนเปิดการ์ด'),P('rumor','maya',2,'ข่าวลวง','คนอื่นไม่เห็นการ์ดรบในมือคุณ'),
 P('assassin','maya',2,'ลอบสังหาร','รอบละครั้ง เดินแบบไม่บุกแล้วกองศัตรูที่ติดกันเสีย 1'),P('haggler','maya',2,'นักต่อรอง','การ์ดพลัง Lv.2–3 ถูกลง 1 บุญ'),P('mole','maya',2,'หนอนบ่อนไส้','จบรอบ ศัตรูในวัดที่ติดกองคุณเสีย 1'),P('hidden','maya',2,'ซ่อนกำลัง','ตั้งรับในป่าลึก +2'),
 P('shadowstrike','maya',3,'จู่โจมจากเงา','รอบละครั้ง บุกช่องที่ห่างไม่เกิน 3 ช่อง แล้วกลับที่เดิม'),P('illusion','maya',3,'ภาพลวงตา','บุกแล้วเสมอ คุณชนะ'),P('shadowarmy','maya',3,'กองทัพเงา','เดินทัพได้ 2 ครั้ง และมีแอคชันรวม 4 ต่อรอบ'),P('plague','maya',3,'พิษกระจาย','แพ้ศึก เลือกการ์ดรบอีกฝ่ายให้ทิ้ง 1 ใบ'),
 P('merchant','maya',3,'พ่อค้ามายา','ทุกอย่างในร้านถูกลง 1 บุญ'),P('swap','maya',3,'สลับตำแหน่ง','รอบละครั้ง สลับตำแหน่งกอง 2 กองของคุณ (ฟรี)'),P('vpM','maya',3,'ตราประทับมายา','ได้ 1 คะแนนถาวรทันที'),
 P('monk','bun',1,'ธุดงค์','ทำบุญแล้วได้ทหาร 1 ตัวลงเมือง'),P('novice','bun',1,'สามเณร','มีทหารทั้งหมด 11 ตัว'),P('bowl','bun',1,'บิณฑบาต','เกณฑ์ทัพลงวัดที่ยึดอยู่ได้ (ไม่รวมวัดหลวง)'),P('lamp','bun',1,'โคมประทีป','ตั้งรับในวัด ฝ่ายบุกไม่ได้โบนัสกลางคืน'),
 P('bless','bun',2,'อำนวยพร','การ์ดรบเหลือ 1 ใบ ได้คืนทั้งชุด'),P('beast','bun',2,'บารมีสัตว์','พาหนะรบในถิ่น +2 (ปกติ +1)'),P('haven','bun',2,'เขตอภัยทาน','ศัตรูบุกวัดของคุณแล้วแพ้ ต้องถอย 2 ช่อง'),
 P('dharma','bun',3,'กองทัพศรัทธา','ทหารทั้งหมด 12 ตัว แต่กองนอกเมืองจุได้ลดลง 1'),P('deva','bun',3,'เทวดาคุ้มครอง','กองโดนฆ่าหมด ได้ทหารคืนลงเมืองเท่าที่ตาย สูงสุด 3 (รอบละครั้ง)'),P('karma','bun',2,'กรรมตามสนอง','ใครบุกชนะคุณ ได้บาปเพิ่ม 1'),P('rebirth','bun',3,'คืนชีพ','แพ้ศึกจนทหารตายหมด เหลือรอด 1 ตัวเสมอ')
];
/* เรียงตามสายแล้วตามเลเวล ให้ร้านค้าแสดงเลเวลต่อกัน */
POWERS.sort((a,b)=>LINE_ORDER.indexOf(a.line)-LINE_ORDER.indexOf(b.line)||a.lv-b.lv);
const PW=Object.fromEntries(POWERS.map(p=>[p.id,p]));
const COST=[0,2,3,4];
const CARD=[{s:0,k:3,n:'ถล่มทลาย'},{s:1,k:2,n:'ประจัญบาน'},{s:2,k:1,n:'รุกคืบ'},{s:3,k:1,n:'ตั้งมั่น'},{s:4,k:2,n:'พิชัยยุทธ'}];
const cardBtn=(c,attr,on)=>`<button class="bcard ${on?'on':''}" ${attr}="${c}" aria-label="${CARD[c].n} พลัง ${CARD[c].s} ฆ่า ${CARD[c].k}"><span class="cn">${CARD[c].n}</span><span class="cs">พลัง <b>${CARD[c].s}</b></span><span class="ck">ฆ่า <b>${CARD[c].k}</b></span></button>`;
const ACT={recruit:'เกณฑ์ทัพ',move:'เดินทัพ',merit:'ทำบุญ',buy:'ขอพร'};
const SEATC=i=>`var(--s${i})`;

/* ===================== RULES ===================== */
/* แผนที่รุ่น 5: ผู้เล่นละ 7 ช่อง เรียงเป็นบล็อก */
const SECT=7;
const L=S=>SECT*S.n;
const TNAME={city:'เมือง',forest:'ป่า',temple:'วัด',plain:'ทุ่ง',water:'ริมน้ำ',deep:'ป่าลึก',sumeru:'เขาพระสุเมรุ',royal:'วัดหลวง'};
const kOf=i=>(i-1)%SECT;
/* แผนที่ 7 แบบ ทุกแบบสมมาตรต่อผู้เล่น จึงแฟร์ทุกที่นั่ง
   ช่องในบล็อก k: 0 เมือง · 1 ป่า · 2 ทุ่ง · 3 วัด · 4 ริมน้ำ · 5 ป่าลึก · 6 ทุ่งหน้าเขา
   ระยะจากเมือง: วัดของตัวเอง 2 ก้าว · วัดเพื่อนบ้าน 3 ก้าวขึ้นไป · เขาพระสุเมรุและวัดหลวง 5 ก้าว
   edges: [k1, dt, k2] = ช่อง k1 ของผู้เล่น t ติดกับช่อง k2 ของผู้เล่น t+dt
   sumK: ช่องที่ติดเขาพระสุเมรุ · royK: ช่องที่ติดวัดหลวง */
const T6=['city','forest','plain','temple','water','deep','plain'];
const BASE_EDGES=[[0,0,1],[0,0,2],[1,0,3],[2,0,3],[1,0,4],[3,0,5],[4,0,5],[2,1,1],[5,1,4],[5,0,6]];
const MAPS=[
 {id:'classic',name:'วงแหวนหิมพานต์',desc:'แผนที่มาตรฐาน วัดอยู่ห่างเมือง 2 ก้าว ทางไปเขาพระสุเมรุต้องผ่านป่าลึกและทุ่งหน้าเขา',types:T6,edges:BASE_EDGES,sumK:[6],royK:[6]},
 {id:'sea',name:'ทะเลสีทันดร',desc:'ริมน้ำทุกช่องต่อกันเป็นวง เดินอ้อมไปตีเพื่อนบ้านทางน้ำได้',types:T6,edges:[...BASE_EDGES,[4,1,4]],sumK:[6],royK:[6]},
 {id:'border',name:'ชายแดนเปิด',desc:'ทุ่งของเพื่อนบ้านติดกันด้วย ชายแดนกว้าง บุกกันดุ',types:T6,edges:[...BASE_EDGES,[2,1,2]],sumK:[6],royK:[6]},
 {id:'rivertemple',name:'วัดริมฝั่ง',desc:'วัดย้ายไปอยู่ริมน้ำ ติดป่าลึกของเพื่อนบ้าน วัดถูกแย่งง่ายขึ้น',types:['city','forest','plain','water','temple','deep','plain'],edges:BASE_EDGES,sumK:[6],royK:[6]},
 {id:'lonely',name:'เขาโดดเดี่ยว',desc:'เขาพระสุเมรุติดกับวัดหลวงเท่านั้น ต้องยึดวัดหลวงก่อนถึงจะขึ้นเขาได้',types:T6,edges:BASE_EDGES,sumK:[],royK:[6]},
 {id:'divide',name:'แม่น้ำแบ่งแดน',desc:'วงนอกไม่ติดกับเพื่อนบ้านเลย ต้องเดินเข้าวงในแล้วข้ามทางน้ำไปหากัน ช่วงแรกสงบ',types:T6,edges:[...BASE_EDGES.filter(e=>!(e[0]===2&&e[1]===1&&e[2]===1)),[4,1,4]],sumK:[6],royK:[6]},
 {id:'dense',name:'ป่ารก',desc:'ทางในบ้านตัดกันไปมา เดินอ้อมหลบศึกได้หลายทาง',types:T6,edges:[...BASE_EDGES,[2,0,4],[1,0,2]],sumK:[6],royK:[6]}
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
  /* ทางลับ: วัดและริมน้ำทุกช่อง เดินเข้า-ออกเขาพระสุเมรุได้ตรงๆ (ข้ามป่าลึก) */
  const secretGate=j=>{const t=terr(S,j);return t==='temple'||t==='water'};
  if(i===0){const out=adj(S,0).slice();if(has(S,s,'secret'))for(let j=1;j<S.B.length;j++)if(secretGate(j)&&!out.includes(j))out.push(j);return out}
  const out=adj(S,i).slice();
  if(has(S,s,'secret')&&secretGate(i)&&!out.includes(0))out.push(0);
  if(isGod(S,s,'ganga')&&terr(S,i)==='water'){for(let j=1;j<S.B.length;j++)if(j!==i&&terr(S,j)==='water'&&!out.includes(j))out.push(j)}
  return out;
}
function mountAt(S,cell,s){for(const k of MK){const m=S.M[k];if(m&&m.o===s&&m.c===cell)return k}return null}
/* เมืองเก็บพาหนะได้หลายตัว กองนอกเมืองมีพาหนะได้ 1 ตัว */
function mountsAt(S,cell,s){return MK.filter(k=>{const m=S.M[k];return m&&m.o===s&&m.c===cell})}
/* พาหนะต่อกอง: ปกติ 1 จอมทัพ 2 · hm = มีพาหนะ k ไหม (รับทั้งชื่อเดียวหรือรายการ) */
const mLimit=(S,s)=>has(S,s,'warlord')?2:1;
const mList=m=>m==null?[]:Array.isArray(m)?m.filter(Boolean):[m];
const hm=(m,k)=>mList(m).includes(k);
const ownsM=(S,s,k)=>!!(S.M[k]&&S.M[k].o===s);
const meritAmt=(S,s)=>(has(S,s,'holy')?3:2)+(isGod(S,s,'ganesha')&&holyGround(S,s)?1:0)+(ownsM(S,s,'kinnaree')?(isGod(S,s,'saraswati')?2:1):0);
function mountsOf(S,s){return MK.filter(k=>S.M[k]&&S.M[k].o===s)}
function onBoard(S,s){let t=0;for(const c of S.B)if(c.o===s)t+=c.t;if(S.battle&&S.battle.a===s)t+=S.battle.n;if(S.retreat&&S.retreat.loser===s)t+=S.retreat.n;return t}
const reserve=(S,s)=>(isGod(S,s,'reusi')?9:10)+(has(S,s,'novice')?1:0)+(has(S,s,'dharma')?2:0)-onBoard(S,s);
/* carry = พาหนะที่เดินมากับกอง · เอราวัณในกอง จุเพิ่ม 1 */
const cap=(S,s,i,carry)=>{if(i===cityOf(s))return 99;const ms=[...new Set([...mountsAt(S,i,s),...mList(carry)])];
  return (ms.length>=2?4:(has(S,s,'fort')?6:5)-(isGod(S,s,'vayu')?1:0)-(has(S,s,'dharma')?1:0))+(ms.includes('erawan')?1:0)};
function templesHeld(S,s){let n=0;for(let i=1;i<S.B.length;i++)if(ctype(S,i)==='temple'&&S.B[i].o===s&&S.B[i].t>0)n++;return n}
function tempVP(S,s){return templesHeld(S,s)+(S.B[0].o===s&&S.B[0].t>0?2:0)}
const total=(S,s)=>S.P[s].vp+tempVP(S,s);
const hand=(S,s)=>has(S,s,'manual')?[0,1,2,3,4]:[0,1,2,3];
const availCards=(S,s)=>hand(S,s).filter(c=>!S.P[s].uc.includes(c));
function useCard(S,s,c){const p=S.P[s];p.uc.push(c);const left=hand(S,s).filter(x=>!p.uc.includes(x)).length;if(left===0||(left<=1&&has(S,s,'bless')))p.uc=[]}
function log(S,t){S.log.unshift(`ร.${S.round} · ${t}`);if(S.log.length>50)S.log.length=50}
const gname=(S,s)=>GOD[godOf(S,s)].name;

/* เดินทัพได้ 2 ครั้งต่อรอบ: กองทัพฟ้า เดินทัพซ้อน กองทัพเงา */
const moveLim=(S,s)=>(has(S,s,'sky')||has(S,s,'warp')||has(S,s,'shadowarmy'))?2:1;
function actionLimit(S,s){const p=S.P[s];return 3+(has(S,s,'sky')||has(S,s,'shadowarmy')?1:0)+(has(S,s,'miracle')&&!p.f.miracle?1:0)}
function actionOK(S,s,a){
  const p=S.P[s];if(p.used.length>=actionLimit(S,s))return false;
  const cnt=p.used.filter(x=>x===a).length;
  const lim=a==='move'?moveLim(S,s):1;
  if(cnt<lim)return true;
  return has(S,s,'miracle')&&!p.f.miracle;
}
function markAction(S,s,a){
  const p=S.P[s];const cnt=p.used.filter(x=>x===a).length;const lim=a==='move'?moveLim(S,s):1;
  if(cnt>=lim){p.f.miracle=true;log(S,`${gname(S,s)} ใช้ปาฏิหาริย์ ทำ${ACT[a]}ซ้ำ`)}
  p.used.push(a);
}
function hasActions(S,s){return ['recruit','move','merit','buy'].some(a=>actionOK(S,s,a))}

function priceOf(S,s,item){let base=item.mount?MOUNTS[item.mount].cost:COST[PW[item.pw].lv];
  if(item.pw){const lv=PW[item.pw].lv;if(isGod(S,s,'jupiter')&&lv>=2&&holyGround(S,s))base-=1;if(isGod(S,s,'saraswati')&&lv===1)base=1;if(has(S,s,'haggler')&&lv>=2)base-=1}
  if(item.mount&&has(S,s,'blackmarket'))base-=1;
  if(has(S,s,'merchant'))base-=1;
  return Math.max(1,base-(has(S,s,'alms')?1:0))}
/* ยึดวัดหรือเขาพระสุเมรุอยู่ (เงื่อนไขของเทพสายบุญบารมี) */
function holyGround(S,s){return templesHeld(S,s)>0||(S.B[0].o===s&&S.B[0].t>0)}
function powerState(S,s,id){
  const p=PW[id];
  if(p.todo)return 'todo';
  if(p.lv===3&&!S.useL3)return 'off';
  if(!activeLines(S).includes(p.line))return 'off';
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
  if(has(S,s,'reserve')){const src=[cityOf(s)];for(let j=1;j<S.B.length;j++)if(S.B[j].o===s&&S.B[j].t>0&&!src.includes(j))src.push(j);
    for(const i of src)for(const j of adj(S,i)){const c=S.B[j],t=ctype(S,j);if(j===0||t==='temple'||t==='city')continue;if((c.t===0||c.o===s)&&!out.includes(j))out.push(j)}}
  if(isGod(S,s,'brahma')&&S.M.hong&&S.M.hong.o===s&&!out.includes(S.M.hong.c))out.push(S.M.hong.c);
  if(ownsM(S,s,'thakthor')&&S.M.thakthor.c>=0&&!out.includes(S.M.thakthor.c))out.push(S.M.thakthor.c);
  if(has(S,s,'bowl')||isGod(S,s,'brahma'))for(let j=1;j<S.B.length;j++)if(terr(S,j)==='temple'&&S.B[j].o===s&&S.B[j].t>0&&!out.includes(j))out.push(j);
  return out.filter(j=>j===cityOf(s)||S.B[j].t<cap(S,s,j));
}
const recruitAmt=(S,s,cell)=>(isGod(S,s,'brahma')?3:2)+(has(S,s,'levy')?1:0)+(has(S,s,'merc')?1:0)+(cell!=null&&isGod(S,s,'ganesha')&&ownsM(S,s,'thakthor')&&S.M.thakthor.c===cell&&cell!==cityOf(s)?1:0);

/* เกณฑ์ทัพต้องจ่ายบุญ ตัวละ 1 บุญ (ค่ายฝึก/พรหม/ทหารรับจ้าง: ลดราคาลง จ่ายอย่างน้อย 1) บุญไม่พอได้ทหารเท่าที่จ่ายไหว */
const recruitPrice=(S,s,n)=>n<=0?0:Math.max(1,n-(isGod(S,s,'brahma')?1:0)-(has(S,s,'merc')?1:0)-(has(S,s,'drill')?1:0));
function recruitN(S,s,cell){if(cell==null)cell=cityOf(s);const room=cell===cityOf(s)?99:cap(S,s,cell)-(S.B[cell].o===s?S.B[cell].t:0);
  const base=Math.max(0,Math.min(recruitAmt(S,s,cell),reserve(S,s),room));const m=S.P[s].merit;
  let k=base;while(k>0&&recruitPrice(S,s,k)>m)k--;return k}
const canRecruitAny=(S,s)=>reserve(S,s)>0&&recruitTargets(S,s).some(t=>recruitN(S,s,t)>0);
function doRecruitRule(S,s,cell){const n=recruitN(S,s,cell);if(n<=0)return 0;const c=recruitPrice(S,s,n);
  S.P[s].merit-=c;placeTroops(S,s,cell,n);trail(S,{k:'rec',s,t:cell,n});markAction(S,s,'recruit');
  log(S,hidesAll(S,s)?`${gname(S,s)} เกณฑ์ทัพ ลง${cname(S,cell)}`:`${gname(S,s)} เกณฑ์ทัพ ${n} ตัว ลง${cname(S,cell)} (จ่าย ${c} บุญ)`);return n}
/* ธุดงค์: ทำบุญแล้วได้ทหาร 1 ตัวลงเมือง */
function monkBonus(S,s){if(has(S,s,'monk')&&reserve(S,s)>0){placeTroops(S,s,cityOf(s),1);return ' · ธุดงค์ได้ทหาร 1 ตัว'}return ''}
function reachable(S,s,src,carry,maxRange){
  const res=reachCore(S,s,src,carry,maxRange);
  if(maxRange)return res;
  const free=j=>{const c=S.B[j];if(ctype(S,j)==='city'&&citySeat(j)!==s)return false;return c.t===0||(c.o===s&&c.t<cap(S,s,j,carry))};
  /* ป่าลึก: ทางลับในป่า เดินจากป่าลึกไปป่าลึกช่องไหนก็ได้ (ห้ามบุก) */
  if(terr(S,src)==='deep')for(let j=1;j<S.B.length;j++)if(j!==src&&terr(S,j)==='deep'&&free(j)&&!res[j])res[j]='move';
  /* ประตูเงา: ข้ามหัวกองศัตรู 1 ช่อง */
  if(has(S,s,'shadowgate'))for(const e of nbs(S,src,s)){const c=S.B[e];if(c.t>0&&c.o!==s&&ctype(S,e)!=='city')for(const j of nbs(S,e,s))if(j!==src&&free(j)&&!res[j])res[j]='move'}
  /* จู่โจมจากเงา: บุกกองศัตรูที่ห่างไม่เกิน 3 ช่อง */
  if(has(S,s,'shadowstrike')&&!S.P[s].f.strike){const d={[src]:0};let fr=[src];for(let k=0;k<3;k++){const nx=[];for(const c of fr)for(const nb of nbs(S,c,s))if(d[nb]==null){d[nb]=k+1;nx.push(nb)}fr=nx}
    for(const j in d){const c=S.B[j];if(+j!==src&&c.t>0&&c.o!==s&&ctype(S,+j)!=='city'&&!res[j])res[j]='strike'}}
  return res;
}
function reachCore(S,s,src,carry,maxRange){
  const fast=has(S,s,'swift')||has(S,s,'forestway')||hm(carry,'garuda')||hm(carry,'durong')||hm(carry,'rajasi');let range=fast||isGod(S,s,'vayu')?2:1;if(maxRange)range=Math.min(range,maxRange);
  const fly=hm(carry,'garuda')&&isGod(S,s,'narai');const vayuRule=isGod(S,s,'vayu')&&!fast;
  const res={};const seen=new Set([src]);let front=[src];
  for(let d=0;d<range;d++){const nx=[];
    for(const c of front)for(const nb of nbs(S,c,s)){
      if(seen.has(nb))continue;
      if(ctype(S,nb)==='city'&&citySeat(nb)!==s)continue;
      if(vayuRule&&d>=1&&(ctype(S,nb)==='temple'||nb===0))continue;
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
/* เส้นทางที่เดินจริง (ช่องที่ผ่าน) ใช้วาดลูกศรตามทาง ตรรกะเดียวกับ reachable */
function movePath(S,s,src,dst,carry,maxRange){
  const fast=has(S,s,'swift')||has(S,s,'forestway')||hm(carry,'garuda')||hm(carry,'durong')||hm(carry,'rajasi');let range=fast||isGod(S,s,'vayu')?2:1;if(maxRange)range=Math.min(range,maxRange);const vayuRule=isGod(S,s,'vayu')&&!fast;
  
  const fly=hm(carry,'garuda')&&isGod(S,s,'narai');
  const par={[src]:-1};let front=[src];
  for(let d=0;d<range;d++){const nx=[];
    for(const c of front)for(const nb of nbs(S,c,s)){
      if(par[nb]!==undefined)continue;
      if(ctype(S,nb)==='city'&&citySeat(nb)!==s)continue;
      if(vayuRule&&d>=1&&(ctype(S,nb)==='temple'||nb===0))continue;
      const o=S.B[nb];const enemy=o.t>0&&o.o!==s;
      if(enemy){par[nb]=c;if(nb===dst)break;if(fly)nx.push(nb);continue}
      par[nb]=c;nx.push(nb);
    }
    if(par[dst]!==undefined)break;front=nx;
  }
  if(par[dst]===undefined){if(has(S,s,'shadowgate')){const e=nbs(S,src,s).find(e=>S.B[e].t>0&&S.B[e].o!==s&&nbs(S,e,s).includes(dst));if(e!=null)return [src,e,dst]}return [src,dst]}
  const path=[];for(let c=dst;c!==-1;c=par[c])path.unshift(c);return path;
}
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
/* เขตอภัยทาน: ถอยไกล 2 ช่อง */
function retreatOpts2(S,s,cell,n){const one=retreatOpts(S,s,cell,n);const out=new Set();
  for(const k of one)for(const j of retreatOpts(S,s,k,n))if(j!==cell&&!one.includes(j))out.add(j);
  return out.size?[...out]:one}
function placeRetreat(S,s,j,n,m){
  let room=j===cityOf(s)?99:mLimit(S,s)-mountsAt(S,j,s).length;placeTroops(S,s,j,n);
  if(j!==cityOf(s)&&S.B[j].t>4)room=Math.min(room,1-mountsAt(S,j,s).length);
  for(const k of mList(m)){if(room>0){S.M[k].c=j;room--}else S.M[k].c=cityOf(s)}
}
function resolveBattle(S,defCard){
  const b=S.battle;const A=b.a,D=b.d,cell=b.to;
  const notes=[];
  let nA=b.n,nD=S.B[cell].t;const mA=mList([b.mount,b.mount2]),mD=mountsAt(S,cell,D);
  let deaths=0;
  const cA=CARD[b.ac],cD=CARD[defCard];
  const pA=[['ทหาร',nA],['การ์ด',cA.s]],pD=[['ทหาร',nD],['การ์ด',cD.s]];
  const bm=battleMods(S,A,D,nA,nD,mA,mD,cell,b.from);pA.push(...bm.a);pD.push(...bm.d);if(bm.note)notes.push(...bm.note);
  const sA=pA.reduce((t,x)=>t+x[1],0),sD=pD.reduce((t,x)=>t+x[1],0);
  /* เสมอ = ฝ่ายรับชนะ เว้นฝ่ายบุกมีธรรมจักร (และฝ่ายรับไม่มี) */
  const tieA=sA===sD&&has(S,A,'illusion');
  const aWin=sA>sD||tieA;
  if(tieA)notes.push('ภาพลวงตา: เสมอแล้วชนะ');
  // damage each side deals
  const km=killMods(S,A,D,mA,mD,b.n,S.B[cell].t);
  const kA=[['การ์ด',cA.k],...km.a,...(aWin?km.aWin:[])],kD=[['การ์ด',cD.k],...km.d,...(aWin?[]:km.dWin)];
  if(!aWin&&has(S,A,'poison'))kA.push(['ยาพิษ',1]);if(aWin&&has(S,D,'poison'))kD.push(['ยาพิษ',1]);
  const dmgA=Math.max(0,kA.reduce((t,x)=>t+x[1],0)),dmgD=Math.max(0,kD.reduce((t,x)=>t+x[1],0));
  let lossD=Math.min(nD,dmgA),lossA=Math.min(nA,dmgD);
  let survA=nA-lossA,survD=nD-lossD;deaths+=lossA+lossD;
  useCard(S,A,b.ac);useCard(S,D,defCard);
  const W=aWin?A:D,Lz=aWin?D:A;
  /* คืนชีพ: ฝ่ายแพ้ที่ทหารตายหมด เหลือรอด 1 ตัวแล้วต้องถอย */
  let reborn=false;
  if(has(S,Lz,'rebirth')){if(aWin&&nD>0&&survD===0){survD=1;reborn=true}else if(!aWin&&nA>0&&survA===0){survA=1;reborn=true}
    if(reborn){deaths--;if(aWin)lossD--;else lossA--;notes.push(`คืนชีพ ${gname(S,Lz)} เหลือรอด 1`)}}
  /* พิษร้าย: ฝ่ายที่ชนะคนถือการ์ดนี้ เสียเพิ่ม 1 */
  if(aWin&&survA>0&&has(S,D,'venom')){survA--;deaths++;notes.push('พิษร้าย ฝ่ายบุกเสียเพิ่ม 1')}
  if(!aWin&&survD>0&&has(S,A,'venom')){survD--;deaths++;notes.push('พิษร้าย ฝ่ายรับเสียเพิ่ม 1')}
  S.P[A].f.atk=true;
  const survW=aWin?survA:survD,survL=aWin?survD:survA;
  const mW=aWin?mA:mD,mL=aWin?mD:mA;
  const home=(ms,s)=>{for(const k of mList(ms))S.M[k].c=cityOf(s)};
  // clear the cell, then decide who holds it
  S.B[cell].t=0;S.B[cell].o=-1;
  let holder=-1,holdN=0,holdM=[],retreat=null;
  if(b.raid){
    /* จู่โจมจากเงา: ชนะแล้วกลับช่องเดิม ฝ่ายรับที่รอดต้องถอย · แพ้แล้วถอยจากช่องเดิม */
    if(aWin){if(survD>0)retreat={s:D,n:survD,m:mD};else home(mD,D);
      if(survA>0){const fr=b.from;const room=fr===cityOf(A)?99:(S.B[fr].t===0||S.B[fr].o===A?cap(S,A,fr)-S.B[fr].t:0);const k=Math.max(0,Math.min(survA,room));
        if(k>0)placeRetreat(S,A,fr,k,mA);else home(mA,A);if(survA-k>0)placeTroops(S,A,cityOf(A),survA-k)}else home(mA,A)}
    else{if(survD>0){holder=D;holdN=survD;holdM=mD}else home(mD,D);
      if(survA>0)retreat={s:A,n:survA,m:mA,origin:b.from};else home(mA,A)}
  }
  else if(survW>0){holder=W;holdN=survW;holdM=mW;if(survL>0)retreat={s:Lz,n:survL,m:mL};else home(mL,Lz)}
  else if(survL>0&&reborn){retreat={s:Lz,n:survL,m:mL};home(mW,W)}
  else if(survL>0){holder=Lz;holdN=survL;holdM=mL;home(mW,W)}
  else if(!b.raid){home(mA,A);home(mD,D)}
  if(holder>=0){S.B[cell].o=holder;S.B[cell].t=holdN;for(const k of mList(holdM))S.M[k].c=cell}
  const attackerHeld=aWin&&survA>0;
  if(attackerHeld){
    S.P[A].vp+=1;
    let sin=1;if(isGod(S,A,'shiva'))sin=(S.M.nonthi&&S.M.nonthi.o===A)?1:2;
    if(hm(mA,'buffalo'))sin=0;
    if(isGod(S,A,'reusi')&&!S.P[A].f.reusi){sin=0;S.P[A].f.reusi=true;notes.push('ตบะ ไม่ได้บาป')}
    if(isGod(S,A,'vessuwan')&&S.P[D].merit>0){S.P[D].merit--;S.P[A].merit++;notes.push('จอมอสูรขโมยบุญ 1')}
    S.P[A].sin+=sin;
    if(hm(mA,'kaisornnaka')){const g=isGod(S,A,'rahu')?3:2;S.P[A].merit+=g;notes.push(`ไกรสรนาคา +${g} บุญ`)}
    if(has(S,A,'conquest')&&!S.P[A].f.conquest){S.P[A].vp+=1;S.P[A].f.conquest=true;notes.push('ผู้พิชิต +1 ถาวร')}
    if(has(S,D,'karma')){S.P[A].sin+=1;notes.push('กรรมตามสนอง บาป +1')}
  }
  if(aWin&&has(S,A,'arson')&&S.P[D].merit>0){S.P[D].merit--;S.P[A].merit++;notes.push('ลอบวางเพลิง ขโมยบุญ 1')}
  if(aWin&&isGod(S,A,'shiva')){S.P[A].rage=Math.min(3,(S.P[A].rage||0)+1);notes.push(`โทสะ ${S.P[A].rage}`)}
  if(aWin&&has(S,A,'plunder')){S.P[A].merit+=2;notes.push('ปล้นสะดม +2 บุญ')}
  if(!aWin&&survD>0&&has(S,D,'stand')&&!S.P[D].f.stand){S.P[D].vp+=1;S.P[D].f.stand=true;notes.push('ผู้ยืนหยัด +1 ถาวร')}
  const pend=s=>retreat&&retreat.s===s?retreat.n:0;
  /* เทวดาคุ้มครอง: กองโดนฆ่าหมดทั้งกอง ได้ทหารคืนลงเมือง สูงสุด 3 รอบละครั้ง */
  for(const [s,n0,sv] of [[A,nA,survA],[D,nD,survD]]){if(n0>0&&sv===0&&has(S,s,'deva')&&!S.P[s].f.deva){const k=Math.min(3,n0,reserve(S,s)-pend(s));if(k>0){placeTroops(S,s,cityOf(s),k);S.P[s].f.deva=true;notes.push(`เทวดาคุ้มครอง ${gname(S,s)} +${k} ทหาร`)}}}
  for(const s of [A,D]){if(isGod(S,s,'yama')&&deaths>0){const grpM=s===A?mA:mD;const g=deaths*(hm(grpM,'buffalo')?2:1);S.P[s].merit+=g;notes.push(`ยมโลก +${g} บุญ`)}}
  const ob=x=>x.map(([l,v])=>({l,v}));
  if(S.trail&&S.trail[0]&&S.trail[0].k==='atk'&&S.trail[0].t===cell)S.trail[0].w=aWin?1:0;
  S.last={id:Date.now(),cell,A,D,ac:b.ac,dc:defCard,sA,sD,pA:ob(pA),pD:ob(pD),kA:ob(kA),kD:ob(kD),aWin,lossA,lossD,round:S.round,retreat:null};
  log(S,`ศึก${cname(S,cell)}: ${gname(S,A)} ${cA.n} พลัง ${sA} ต่อ ${gname(S,D)} ${cD.n} พลัง ${sD} → ${gname(S,W)} ชนะ · บุกเสีย ${lossA} รับเสีย ${lossD}${notes.length?' ('+notes.join(', ')+')':''}${aWin&&survA===0?' · ฝ่ายบุกไม่เหลือทหาร ไม่ได้คะแนน':''}`);
  S.battle=null;
  checkSin(S,A);
  /* ทิ้งการ์ดรบหลังศึก (ทำหลังถอยทัพ): ริบอาวุธ = ฝ่ายรับเลือกทิ้งของตัวเอง · พิษกระจาย = ฝ่ายแพ้เลือกทิ้งการ์ดของฝ่ายชนะ */
  const dq=[];
  if(aWin&&has(S,A,'disarm')&&availCards(S,D).length>0)dq.push({s:D,by:D});
  if(has(S,Lz,'plague')&&availCards(S,W).length>1)dq.push({s:W,by:Lz});
  const held=attackerHeld&&!b.raid;
  const post={A,chain:held&&has(S,A,'chain')&&!b.bonusUsed?cell:null,vp:!!b.vajraPending&&!b.raid,vfrom:held?cell:null,dq};
  if(retreat){
    const rfrom=retreat.origin!=null?retreat.origin:cell;
    const haven=!aWin&&!b.raid&&ctype(S,cell)==='temple'&&has(S,D,'haven');
    const chase=aWin&&retreat.s===D&&has(S,A,'pursuit');
    const two=haven||chase;
    const opts=two?retreatOpts2(S,retreat.s,rfrom,retreat.n):retreatOpts(S,retreat.s,rfrom,retreat.n);
    if(haven)log(S,`เขตอภัยทาน: ${gname(S,retreat.s)} ต้องถอย 2 ช่อง`);
    if(chase)log(S,`ไล่ล่า: ${gname(S,retreat.s)} ต้องถอย 2 ช่อง`);
    const chooser=has(S,retreat.s,'fallback')?retreat.s:(retreat.s===A?D:A);
    if(opts.length<=1){const j=opts.length?opts[0]:cityOf(retreat.s);doRetreatApply(S,retreat.s,j,retreat.n,retreat.m,rfrom)}
    else{S.retreat={loser:retreat.s,chooser,n:retreat.n,m:mList(retreat.m),from:rfrom,opts,post};return}
  }
  postBattle(S,post);
}
/* โบนัสพลังรบทั้งหมดนอกจากทหารและการ์ด ใช้ทั้งตอนรบจริงและตอนแสดงในหน้าจอ */
function battleMods(S,A,D,nA,nD,mA,mD,cell,from){
  const a=[],d=[],note=[];const A_=(l,v)=>a.push([l,v]),D_=(l,v)=>d.push([l,v]);
  const t=terr(S,cell),temple=ctype(S,cell)==='temple',forest=ctype(S,cell)==='forest',day=S.moon==='wax',night=!day;
  if(has(S,D,'smoke'))mA=[];
  /* พื้นที่: ป่า = ด่านหน้า ตั้งรับ +1 · ทุ่ง = ทุ่งศึก บุกออกจากทุ่ง +1 */
  if(terr(S,cell)==='forest')D_('ป่า (ด่านหน้า)',1);
  if(from!=null&&terr(S,from)==='plain')A_('ทุ่งศึก',1);
  if(terr(S,cell)==='deep'&&has(S,D,'hidden'))D_('ซ่อนกำลัง',2);
  if(isGod(S,A,'shiva')&&S.P[A].rage)A_('โทสะ',S.P[A].rage);
  if(isGod(S,D,'chan')&&!(S.P[D].f.mv||[]).includes(cell))D_('มั่นคง (ไม่ได้ขยับ)',1);
  if(isGod(S,D,'thorani')){const nb=nbs(S,cell,D).filter(j=>S.B[j].o===D&&S.B[j].t>0).length;D_('แผ่นดินค้ำจุน',1+Math.min(2,nb))}
  if(isGod(S,D,'varuna')&&temple)D_('หลั่งฝน (วัด)',1);
  if(has(S,A,'weapon'))A_('ศาสตราวุธ',1);if(has(S,A,'siege')&&(temple||cell===0))A_('ปิดล้อม',1);if(has(S,A,'divine'))A_('อาวุธเทวะ',2);
  if(night){if(temple&&has(S,D,'lamp'))note.push('โคมประทีป: ไม่มีโบนัสกลางคืน');else A_('กลางคืน',1);if(has(S,A,'banner'))A_('ธงรบ',1)}
  if(day&&has(S,A,'horn'))A_('แตรศึก',1);
  if(from!=null&&(from===0||ctype(S,from)==='temple')&&has(S,A,'ambush'))A_('ซุ่มโจมตี',1);
  if(nA<=2&&has(S,A,'blitz'))A_('สายฟ้าแลบ',2);if(nD>nA&&has(S,A,'fury'))A_('เดือดดาล',1);
  if(nD>nA&&has(S,A,'storm'))A_('พายุศึก',2);if(nA>nD&&has(S,D,'storm'))D_('พายุศึก',2);
  if(nD<nA&&has(S,D,'moat'))A_('คูเมือง',-1);if(night&&has(S,D,'watch'))D_('หอยาม',1);if(nD<=2&&has(S,D,'militia'))D_('กองอาสา',2);
  if(temple&&has(S,D,'trap'))A_('กับดัก',-1);if(has(S,D,'aegis'))D_('เกราะเทวะ',1);if((cell===0||isRoyal(S,cell))&&has(S,D,'citadel'))D_('ป้อมเขาพระสุเมรุ',2);
  if(isGod(S,A,'agni'))A_('เผาผลาญ',1);
  if(hm(mA,'garuda'))A_('ครุฑ',1);if(hm(mA,'nonthi'))A_('โคนนทิ',1);if(hm(mA,'rhino'))A_('แรด',2);
  if(hm(mA,'naga')&&temple&&isGod(S,A,'varuna'))A_('นาคในวัด',1);
  if(hm(mA,'naga')&&(t==='water'||(from!=null&&terr(S,from)==='water')))A_('นาคริมน้ำ',2);
  if(hm(mA,'asura'))A_('อสุรปักษา',isGod(S,A,'vessuwan')?2:1);
  if(hm(mA,'hatsadee')){if(night)A_('หัสดีลิงค์ยามค่ำ',2);else if(isGod(S,A,'skanda'))A_('หัสดีลิงค์',1)}
  if(hm(mA,'rajasi')&&isGod(S,A,'surya'))A_('ราชสีห์ของพระอาทิตย์',1);
  if(hm(mA,'khotchasi')&&isGod(S,A,'uma'))A_('คชสีห์ของพระแม่อุมา',1);
  if(has(S,D,'armor'))D_('เกราะเพชร',1);if(temple&&has(S,D,'wall'))D_('กำแพงวัด',1);if(nD>=5&&has(S,D,'unity'))D_('สามัคคี',1);if(has(S,D,'guardian'))D_('ทวารบาล',2);
  if(isGod(S,D,'agni')&&!hm(mD,'rhino'))D_('เผาผลาญ (รับ)',-1);
  if(hm(mD,'erawan'))D_('เอราวัณ',1);if(hm(mD,'nonthi'))D_('โคนนทิ',1);
  if(hm(mD,'naga')&&temple&&isGod(S,D,'varuna'))D_('นาคในวัด',1);
  if(hm(mD,'hera'))D_('เหรา',isGod(S,D,'thorani')?2:1);if(hm(mD,'khotchasi'))D_('คชสีห์',1);
  if(hm(mD,'kraisorn')){if(day)D_('ไกรสรปักษา',2);else if(isGod(S,D,'vayu'))D_('ไกรสรปักษา',1)}
  // เทพ
  if(isGod(S,A,'surya')&&day)A_('สุริยเดช',1);if(isGod(S,D,'surya'))D_(day?'สุริยเดช':'สุริยเดช (กลางคืน)',day?1:-1);
  if(isGod(S,D,'chan')&&night)D_('จันทรคติ',1);if(hm(mD,'durong')&&isGod(S,D,'chan'))D_('ม้าปีกของพระจันทร์',1);
  if(t==='water'){if(isGod(S,A,'ganga'))A_('สายน้ำศักดิ์สิทธิ์',1);if(isGod(S,D,'ganga'))D_('สายน้ำศักดิ์สิทธิ์',1)}
  if(isGod(S,A,'rahu')&&night)A_('อุปราคา',1);
  if(isGod(S,A,'uma')&&mList(mA).length)A_('ศักติ',1);if(isGod(S,D,'uma')&&mList(mD).length)D_('ศักติ',1);
  if(hm(mA,'garuda')&&hm(mD,'naga')){A_('ครุฑข่มนาค',2);note.push('ครุฑข่มนาค')}
  if(hm(mD,'garuda')&&hm(mA,'naga')){D_('ครุฑข่มนาค',2);note.push('ครุฑข่มนาค')}
  for(const k of mList(mA))if(inHome(S,k,cell))A_(MOUNTS[k].name+'ในถิ่น',has(S,A,'beast')?2:1);
  for(const k of mList(mD))if(inHome(S,k,cell))D_(MOUNTS[k].name+'ในถิ่น',has(S,D,'beast')?2:1);
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
  const a=[],d=[],aWin=[],dWin=[];if(has(S,D,'smoke'))mA=[];
  if(isGod(S,A,'skanda')&&nA>nD)a.push(['ขุนพลเทวดา',1]);
  if(has(S,A,'vanguard')&&nA<nD)a.push(['ทัพหน้า',1]);
  if(has(S,A,'raid'))aWin.push(['จู่โจม',1]);if(hm(mA,'rajasi'))aWin.push(['ราชสีห์',1]);
  if(has(S,D,'counter'))dWin.push(['โต้กลับ',1]);
  if(hm(mD,'naga')&&!hm(mA,'garuda'))a.push(['นาคกันไว้',-1]);
  if(has(S,D,'ward'))a.push(['มนต์คุ้มกาย',-1]);if(has(S,D,'aegis'))a.push(['เกราะเทวะ',-1]);
  if(hm(mA,'naga')&&!hm(mD,'garuda'))d.push(['นาคกันไว้',-1]);
  if(has(S,A,'rally'))d.push(['ปลุกใจ',-1]);
  if(hm(mD,'khotchasi'))a.push(['คชสีห์',-1]);
  if(hm(mA,'makara'))d.push(['มกร',-1]);
  if(hm(mD,'makara')&&isGod(S,D,'ganga'))a.push(['มกรของพระแม่คงคา',-1]);
  return {a,d,aWin,dWin};
}
/* พรีวิวศึกที่รออยู่: พลังรบและแต้มฆ่า "ไม่รวมการ์ด" ให้ทุกคนเห็น */
function battlePreview(S){
  const b=S.battle;if(!b)return null;const A=b.a,D=b.d,cell=b.to;const mA=mList([b.mount,b.mount2]),mD=mountsAt(S,cell,D);
  let nD=S.B[cell].t;const pre=[];
  const bm=battleMods(S,A,D,b.n,nD,mA,mD,cell,b.from);
  const pA=[['ทหาร',b.n],...bm.a],pD=[['ทหาร',nD],...bm.d];
  const sum=x=>x.reduce((t,y)=>t+y[1],0);
  return {A,D,mA,mD,nA:b.n,nD,pA,pD,baseA:sum(pA),baseD:sum(pD),km:killMods(S,A,D,mA,mD,b.n,S.B[cell].t),pre,notes:bm.note||[]};
}
function doDisarm(S,c){const d=S.disarm;if(!d||!availCards(S,d.s).includes(c))return false;S.disarm=null;useCard(S,d.s,c);
  log(S,(d.by==null||d.by===d.s)?`ริบอาวุธ: ${gname(S,d.s)} ทิ้งการ์ด${CARD[c].n}`:`พิษกระจาย: ${gname(S,d.by)} ให้${gname(S,d.s)}ทิ้งการ์ด${CARD[c].n}`);postBattle(S,d.post);return true}
const disarmBy=d=>d.by==null?d.s:d.by;
function doRetreatApply(S,s,j,n,m,from){
  placeRetreat(S,s,j,n,m);trail(S,{k:'ret',s,f:from,t:j,n});
  if(S.last)S.last.retreat={s,to:j};
  log(S,`${gname(S,s)} ถอย ${n} ตัว จาก${cname(S,from)} ไป${cname(S,j)}`);
}
function postBattle(S,post){
  if(S.status!=='play')return;
  if(post.disarm!=null){post.dq=[{s:post.disarm,by:post.disarm}];post.disarm=null}
  while(post.dq&&post.dq.length){const q=post.dq.shift();const av=availCards(S,q.s);
    if(q.by===q.s){if(av.length===1){useCard(S,q.s,av[0]);log(S,`ริบอาวุธ: ${gname(S,q.s)} ต้องทิ้ง${CARD[av[0]].n}`);continue}if(!av.length)continue}
    else if(av.length<=1)continue;
    S.disarm={s:q.s,by:q.by,post};return}
  const A=post.A;S.follow=null;
  const vf=post.vfrom??null;const f={seat:A,vajra:post.vp&&isGod(S,A,'indra')&&!S.P[A].f.vajra&&vajraTargets(S,A,vf).length>0,bonusFrom:post.chain,vfrom:vf};
  if(f.bonusFrom!==null&&!(S.B[f.bonusFrom].o===A&&S.B[f.bonusFrom].t>0))f.bonusFrom=null;
  if(f.vajra||f.bonusFrom!==null)S.follow=f;else advance(S);
}
function cname(S,i){const t=terr(S,i);if(t==='city'){const x=S.seats[citySeat(i)];return'เมือง'+(x&&x.god?gname(S,citySeat(i)):(x&&x.name)||'')}return TNAME[t]}

/* วชิราวุธ: ฟาดได้เฉพาะกองศัตรูที่ติดกับ "กองที่เพิ่งเดิน" (from) ถ้าเอราวัณเดินมากับกองนั้น ถึง 2 ช่อง */
function vajraTargets(S,s,from,noEra){
  const out=new Set();if(from==null||!S.B[from]||S.B[from].o!==s||S.B[from].t<=0)return [];
  const ok=b=>{const c=S.B[b];if(c.t>0&&c.o!==s&&ctype(S,b)!=='city')out.add(b)};
  for(const nb of nbs(S,from,s))ok(nb);
  if(!noEra&&S.M.erawan&&S.M.erawan.o===s&&S.M.erawan.c===from){for(const a of nbs(S,from,s))for(const b of nbs(S,a,s))if(b!==from)ok(b)}
  return [...out];
}
/* กองที่ขยับในรอบนี้ (พระจันทร์ใช้นับกองที่ไม่ได้ขยับ) */
function markMv(S,s,cell){const f=S.P[s].f;f.mv=(f.mv||[]).concat([cell])}
/* เคลื่อนย้ายมิติ: รอบละครั้ง (กองทัพเงา 2 ครั้ง) */
const warpMax=(S,s)=>0; /* ยกเลิกการวาร์ป: เปลี่ยนเป็นเดินทัพได้ 2 ครั้ง */
const warpLeft=(S,s)=>Math.max(0,warpMax(S,s)-(S.P[s].f.warp||0));
function warpSrcs(S,s){const out=[];S.B.forEach((c,i)=>{if(c.o===s&&c.t>0&&ctype(S,i)!=='city')out.push(i)});return out}
function warpTargets(S,s,src){const n=S.B[src].t,ms=mountsAt(S,src,s).length,army=has(S,s,'shadowarmy');const out=[];
  for(let j=1;j<S.B.length;j++){if(j===src)continue;const t=ctype(S,j),c=S.B[j];if(t==='city')continue;
    if(t==='temple'&&!(army&&c.t===0))continue;
    if(c.t===0){if(ms>=2&&n>4)continue;out.push(j)}
    else if(c.o===s&&mountsAt(S,j,s).length+ms<=mLimit(S,s)&&c.t+n<=cap(S,s,j,mountsAt(S,src,s)))out.push(j)}
  return out}
function doWarpRule(S,s,src,dst){if(!warpLeft(S,s)||!warpSrcs(S,s).includes(src)||!warpTargets(S,s,src).includes(dst))return false;
  const n=S.B[src].t,ms=mountsAt(S,src,s);for(const k of ms)S.M[k].c=-1;removeTroops(S,src,n);placeTroops(S,s,dst,n);for(const k of ms)S.M[k].c=dst;
  S.P[s].f.warp=(S.P[s].f.warp||0)+1;markMv(S,s,dst);trail(S,{k:'move',s,f:src,t:dst,n,m:ms[0]||null,p:[src,dst]});
  log(S,`${gname(S,s)} เคลื่อนย้ายมิติ จาก${cname(S,src)} ไป${cname(S,dst)}`);return true}
/* สลับตำแหน่งกอง 2 กองของตัวเอง (การ์ดสลับตำแหน่ง หรืออวตารของพระนารายณ์) */
function swapSrcs(S,s){return warpSrcs(S,s)}
function doSwapRule(S,s,a,b,via){if(a===b||!swapSrcs(S,s).includes(a)||!swapSrcs(S,s).includes(b))return false;
  const ta=S.B[a].t,tb=S.B[b].t,ma=mountsAt(S,a,s),mb=mountsAt(S,b,s);S.B[a].t=tb;S.B[b].t=ta;for(const k of ma)S.M[k].c=b;for(const k of mb)S.M[k].c=a;
  markMv(S,s,a);markMv(S,s,b);if(via==='card')S.P[s].f.swap=true;else S.P[s].f.avatar=true;
  log(S,`${gname(S,s)} ${via==='card'?'สลับตำแหน่ง':'อวตาร สลับ'}กองที่${cname(S,a)}กับ${cname(S,b)}`);return true}
/* ข้อมูลที่ซ่อน: จำนวนทหารที่คนอื่นเห็นเป็น "?" (ป่าลึก, เงาพราง, ราหูตอนกลางคืน) เปิดเมื่อกองนั้นอยู่ในศึก */
const hidesAll=(S,s)=>has(S,s,'shade')||(isGod(S,s,'rahu')&&S.moon==='wane');
function countHidden(S,cell,viewers){const c=S.B[cell];if(!c||c.t<=0||c.o<0||viewers.includes(c.o))return false;
  if(S.battle&&(S.battle.to===cell||S.battle.from===cell))return false;
  /* เงาพราง/ราหูกลางคืน ซ่อนทุกกองรวมเมือง (ไม่งั้นบวกลบหาได้) · ป่าลึกซ่อนเฉพาะกองในป่าลึก */
  return terr(S,cell)==='deep'||hidesAll(S,c.o)}
/* ซ่อนจำนวนในคลังด้วย ถ้าผู้เล่นคนนั้นมีกองที่ซ่อนอยู่ (ไม่งั้นคำนวณย้อนได้) */
function reserveHidden(S,s,viewers){if(viewers.includes(s))return false;return hidesAll(S,s)||S.B.some((c,j)=>c.o===s&&c.t>0&&terr(S,j)==='deep')}
const hidesCards=(S,s)=>has(S,s,'rumor')||isGod(S,s,'vessuwan');
function computeFollow(S,s,afterMove,bonusFrom,vfrom){
  const f={seat:s,vajra:false,assn:false,bonusFrom:bonusFrom??null,vfrom:vfrom??null};
  if(afterMove&&isGod(S,s,'indra')&&!S.P[s].f.vajra&&vajraTargets(S,s,vfrom).length)f.vajra=true;
  if(afterMove&&has(S,s,'assassin')&&!S.P[s].f.assn&&vajraTargets(S,s,vfrom,true).length)f.assn=true;
  if(f.bonusFrom!==null&&!(S.B[f.bonusFrom].o===s&&S.B[f.bonusFrom].t>0))f.bonusFrom=null;
  S.follow=(f.vajra||f.assn||f.bonusFrom!==null)?f:null;
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
  /* คะแนนก่อนให้ครองแดน: ผู้ท้าชิงต้องถึงเป้า "ก่อน" ได้แต้มจบรอบ (ทุกคนเห็นตัวเลขเดียวกันบนจอ) */
  const pre=[...Array(S.n).keys()].map(s=>total(S,s));
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
  /* ตัดสินผู้ชนะเฉพาะตอนจบรอบกลางคืน:
     ใครถึงเป้าตอนจบกลางคืน = "ผู้ท้าชิง" ต้องรักษาคะแนนให้ถึงเป้าต่ออีก 1 วัน (กลางวัน+กลางคืน)
     จบกลางคืนถัดไปยังถึงเป้าอยู่ = ชนะ ถ้าหลุดก็เล่นต่อ */
  if(S.moon==='wane'){
    const prevChal=S.chal||[];
    const keep=prevChal.filter(s=>pre[s]>=S.target);
    if(keep.length){
      keep.sort((a,b)=>pre[b]-pre[a]||S.P[b].vp-S.P[a].vp||S.P[a].sin-S.P[b].sin);
      S.snap.kept=keep;S.chal=[];
      S.status='done';S.winner=keep[0];log(S,`${gname(S,keep[0])} รักษาคะแนนได้ครบ 1 วัน ชนะด้วย ${pre[keep[0]]} คะแนน`);return;
    }
    const lost=prevChal.slice();
    S.chal=[...Array(S.n).keys()].filter(s=>scores[s]>=S.target);
    S.chalR=S.chal.length?S.round:null;
    S.snap.chal=S.chal.slice();S.snap.lost=lost;
    if(lost.length)log(S,`${lost.map(s=>gname(S,s)).join(', ')} รักษาคะแนนไม่อยู่ หลุดจากผู้ท้าชิง`);
    if(S.chal.length)log(S,`⚠ ${S.chal.map(s=>gname(S,s)).join(', ')} ถึง ${S.target} คะแนนแล้ว ต้องรักษาไว้จนจบกลางคืนหน้าถึงจะชนะ`);
  }
  /* หนอนบ่อนไส้: ศัตรูในวัดที่ติดกองคุณเสีย 1 */
  for(let s=0;s<S.n;s++)if(has(S,s,'mole'))for(let j=1;j<S.B.length;j++){const c=S.B[j];
    if(ctype(S,j)==='temple'&&c.t>0&&c.o!==s&&c.o>=0&&nbs(S,j,s).some(k=>S.B[k].o===s&&S.B[k].t>0)){log(S,`หนอนบ่อนไส้ของ${gname(S,s)}: ${gname(S,c.o)} เสีย 1 ตัวที่${cname(S,j)}`);removeTroops(S,j,1)}}
  for(let s=0;s<S.n;s++){
    const p=S.P[s];const th=templesHeld(S,s);
    /* ริมน้ำ = แม่น้ำศักดิ์สิทธิ์: มีกองอยู่ริมน้ำ ได้การ์ดรบที่ใช้แล้วคืน 1 ใบ (ใบที่แรงสุด) */
    if(p.uc.length&&S.B.some((c,j)=>c.o===s&&c.t>0&&terr(S,j)==='water')){p.uc.sort((a,b)=>CARD[b].s-CARD[a].s);p.uc.shift()}
    /* พระอาทิตย์: จบรอบกลางวัน กองในวัดที่มีไม่ถึง 3 ได้ +1 */
    if(isGod(S,s,'surya')&&S.moon==='wax')for(let j=1;j<S.B.length;j++){const c=S.B[j];if(c.o===s&&c.t>0&&c.t<3&&ctype(S,j)==='temple'&&reserve(S,s)>0)placeTroops(S,s,j,1)}
    /* พระอิศวร: รอบไหนไม่บุก แต้มโทสะหายหมด */
    if(isGod(S,s,'shiva')&&!p.f.atk)p.rage=0;
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
    if(has(S,s,'garrison'))for(let j=0;j<S.B.length;j++){const c=S.B[j];if(c.o===s&&c.t>0&&c.t<3&&(j===0||ctype(S,j)==='temple')&&reserve(S,s)>0)placeTroops(S,s,j,1)}
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
  S.mapV=5;S.seed=S.seed||Math.floor(Math.random()*1e9);const cells=SECT*S.n+2;S.B=Array.from({length:cells},()=>({o:-1,t:0}));
  for(let s=0;s<S.n;s++){S.B[cityOf(s)]={o:s,t:4}}
  S.map=MAPBY[S.map]?S.map:pickMap(S);
  S.P=[...Array(S.n)].map((_,s)=>({merit:S.seats&&S.seats[s]&&S.seats[s].god==='ganesha'?5:3,sin:0,vp:0,pw:[],uc:[],used:[],f:{}}));
  S.M={};S.round=1;S.moon='wax';S.chal=[];S.chalR=null;
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
 shade:'กองนอกเมืองของคุณ คนอื่นเห็นจำนวนทหารเป็น "?" พอโดนบุกหรือบุกเข้าไป จำนวนจริงจะเปิดให้เห็นในศึก',
 poison:'ศึกที่คุณแพ้ (ทั้งบุกและรับ) แต้มฆ่าของคุณ +1',
 shadowgate:'เดินทัพข้ามกองศัตรูที่ขวางอยู่ 1 ช่อง ไปลงช่องว่างหรือกองของคุณที่อยู่ถัดไป (ข้ามเมืองไม่ได้ ลงช่องศัตรูไม่ได้)',
 smoke:'ตอนคุณตั้งรับ ฝ่ายบุกไม่ได้โบนัสใดๆ จากพาหนะ',
 forestway:'เดินทัพได้ไกลสุด 2 ช่อง เหมือนม้าเร็ว',
 blackmarket:'ซื้อพาหนะถูกลง 1 บุญ (จ่ายอย่างน้อย 1)',
 merc:'เกณฑ์ทัพได้เพิ่ม 1 ตัว โดยจ่ายบุญเท่าเดิม (ปกติ 2 ตัว จ่าย 2 บุญ มีการ์ดนี้ได้ 3 ตัว จ่าย 2 บุญ)',
 arson:'บุกชนะ ขโมยบุญจากฝ่ายรับ 1',
 warp:'แอคชันเดินทัพใช้ได้ 2 ครั้งต่อรอบ (ยังมีแอคชันรวม 3 เท่าเดิม จึงต้องสละแอคชันอื่น 1 อย่าง)',
 venom:'ศึกที่คุณแพ้ ฝ่ายที่ชนะเสียทหารเพิ่ม 1',
 veil:'ก่อนเปิดการ์ด ศัตรูเห็นแค่จำนวนทหารของคุณ โบนัสพลังรบของคุณจะขึ้นเป็น "?"',
 rumor:'คนอื่นไม่เห็นว่าคุณเหลือการ์ดรบใบไหนบ้าง',
 assassin:'รอบละครั้ง หลังเดินทัพแบบไม่บุก กองศัตรูที่ติดกับกองที่เพิ่งเดินเสียทหาร 1 ตัว (เลือกกองได้)',
 haggler:'การ์ดพลังเลเวล 2–3 ถูกลง 1 บุญ',
 mole:'ทุกจบรอบ กองศัตรูที่ยึดวัดซึ่งอยู่ติดกองของคุณ เสียทหาร 1 ตัว',
 hidden:'ตั้งรับในป่าลึก พลังรบ +2',
 shadowstrike:'รอบละครั้ง บุกกองศัตรูที่ห่างไม่เกิน 3 ช่องได้เลยไม่ต้องเดินผ่านทาง ชนะแล้วทหารกลับช่องเดิม (ฝ่ายรับที่รอดต้องถอย) แพ้แล้วต้องถอย 1 ช่องจากช่องเดิมของคุณ',
 illusion:'ตอนบุก ถ้าพลังรบเสมอ คุณชนะ (ปกติเสมอฝ่ายรับชนะ)',
 shadowarmy:'แอคชันเดินทัพใช้ได้ 2 ครั้งต่อรอบ และมีแอคชันรวมเป็น 4 ต่อรอบ (เหมือนกองทัพฟ้าของสายฤทธิ์)',
 plague:'ศึกที่คุณแพ้ คุณเลือกการ์ดรบในมือของอีกฝ่ายให้ทิ้ง 1 ใบ (ถ้าเขาเหลือใบเดียว ไม่มีผล)',
 merchant:'ทุกอย่างในร้าน ทั้งการ์ดพลังและพาหนะ ถูกลง 1 บุญ',
 swap:'รอบละครั้ง ไม่ใช้แอคชัน สลับตำแหน่งกองนอกเมือง 2 กองของคุณ (ทหารและพาหนะสลับไปด้วย)',
 vpM:'ได้ 1 คะแนนถาวรทันทีที่ซื้อ',
 ambush:'ตอนบุก ถ้ากองที่ยกออกไปมาจากวัด วัดหลวง หรือเขาพระสุเมรุ พลังรบ +1',
 horn:'บุกตอนกลางวัน พลังรบ +1 (คู่กับธงรบที่ได้ตอนกลางคืน)',
 disarm:'บุกชนะ ฝ่ายรับต้องเลือกทิ้งการ์ดรบที่ยังเหลือในมือ 1 ใบ (ถ้าเหลือใบเดียว ทิ้งให้อัตโนมัติ)',
 blitz:'บุกด้วยทหาร 1–2 ตัว พลังรบ +2',
 pursuit:'บุกชนะแล้วฝ่ายรับที่เหลือรอดต้องถอยไป 2 ช่อง (ไกลจากช่องเดิม)',
 fury:'บุกกองที่มีทหารมากกว่ากองของคุณ พลังรบ +1',
 storm:'ทุกศึกที่อีกฝ่ายมีทหารมากกว่าคุณ ทั้งตอนบุกและตอนตั้งรับ พลังรบ +2',
 warlord:'กองนอกเมืองพาพาหนะได้ 2 ตัว ได้โบนัสทั้งสองตัว แต่กองที่มีพาหนะ 2 ตัวมีทหารได้สูงสุด 4 ตัวเสมอ (ป้อมค่ายก็ไม่เพิ่ม)',
 moat:'ตอนตั้งรับ ถ้าทหารของคุณน้อยกว่าฝ่ายบุก ฝ่ายบุกพลังรบ −1',
 watch:'ตั้งรับตอนกลางคืน พลังรบ +1',
 militia:'ตั้งรับด้วยทหาร 1–2 ตัว พลังรบ +2',
 trap:'ศัตรูบุกวัดหรือวัดหลวงที่คุณยึดอยู่ ฝ่ายบุกพลังรบ −1',
 fallback:'แพ้ศึกแล้วต้องถอย (ทั้งตอนบุกและตั้งรับ) คุณเป็นคนเลือกช่องถอยเอง (ปกติฝ่ายชนะเลือก)',
 garrison:'ทุกจบรอบ กองของคุณในวัด วัดหลวง หรือเขาพระสุเมรุที่มีทหารไม่ถึง 3 ตัว ได้ทหารจากคลัง +1 ตัว',
 aegis:'ตอนตั้งรับ พลังรบ +1 และความเสียหายที่ได้รับ −1',
 citadel:'ตั้งรับที่เขาพระสุเมรุหรือวัดหลวง พลังรบ +2',
 novice:'ทหารทั้งหมดของคุณเพิ่มจาก 10 เป็น 11 ตัว (ตัวที่เพิ่มอยู่ในคลัง)',
 bowl:'แอคชันเกณฑ์ทัพ ลงทหารที่วัดที่คุณยึดอยู่ได้ (วัดหลวงไม่ได้) จ่ายบุญเหมือนปกติ',
 lamp:'ศัตรูบุกวัดหรือวัดหลวงที่คุณยึดตอนกลางคืน ไม่ได้ +1 กลางคืน',
 bless:'ปกติการ์ดรบได้คืนเมื่อใช้ครบทุกใบ การ์ดนี้ทำให้เหลือในมือ 1 ใบก็ได้คืนทั้งชุด',
 beast:'พาหนะของคุณรบในถิ่นของมัน ได้ +2 แทน +1',
 haven:'ศัตรูบุกวัดหรือวัดหลวงที่คุณยึดแล้วแพ้ ทหารที่เหลือต้องถอยไปไกล 2 ช่อง (ถ้าไม่มีช่องให้ถอย 2 ช่อง ถอย 1 ช่อง)',
 dharma:'ทหารทั้งหมดของคุณเพิ่มจาก 10 เป็น 12 ตัว (ตัวที่เพิ่มอยู่ในคลัง) แต่กองนอกเมืองจุทหารได้ลดลง 1 (ปกติ 5 เหลือ 4 ถ้ามีป้อมค่ายก็ 6 เหลือ 5)',
 deva:'รอบละครั้ง ถ้ากองของคุณในศึกโดนฆ่าหมดทั้งกอง ได้ทหารจากคลังลงเมืองเท่าจำนวนที่ตาย สูงสุด 3 ตัว',
 plunder:'บุกแล้วชนะ ได้บุญ +2 ทันที (ไม่ต้องเหลือทหารก็ได้)',
 siege:'ตอนบุกวัด วัดหลวง หรือเขาพระสุเมรุ พลังรบ +1',
 conquest:'บุกชนะและยังเหลือทหาร ครั้งแรกของแต่ละรอบ ได้ +1 คะแนนถาวรเพิ่ม (รวมเป็น +2)',
 drill:'เกณฑ์ทัพจ่ายบุญน้อยลง 1 บุญ (จ่ายอย่างน้อย 1 บุญเสมอ) ใช้ร่วมกับการ์ดลดราคาอื่นได้',
 eye:'ตอนคุณเป็นฝ่ายรับ เห็นการ์ดที่ฝ่ายบุกคว่ำไว้ก่อนเลือกการ์ดตั้งรับ',
 stand:'ตั้งรับชนะและยังมีทหารเหลือในช่องนั้น ได้ +1 คะแนนถาวร ได้รอบละครั้ง',
 monk:'ทุกครั้งที่ทำแอคชันทำบุญ ได้ทหาร 1 ตัวจากคลังลงเมืองด้วย',
 karma:'ใครบุกชนะคุณแล้วยึดช่องได้ คนนั้นได้บาปเพิ่มอีก 1',
 rebirth:'ทุกศึกที่คุณแพ้ ถ้าทหารในกองตายหมด จะเหลือรอด 1 ตัวเสมอแล้วต้องถอย ฝ่ายชนะเลือกช่องถอย (ถ้ามีถอยทัพ คุณเลือกเอง)',
 weapon:'ทุกครั้งที่คุณเป็นฝ่ายบุก พลังรบ +1',
 swift:'เดินทัพได้ไกลสุด 2 ช่องต่อครั้ง ช่องที่ผ่านต้องว่างหรือเป็นกองของคุณ ถ้าเจอศัตรูระหว่างทางจะหยุดรบที่ช่องนั้น',
 banner:'รอบกลางคืนฝ่ายบุกได้ +1 อยู่แล้ว การ์ดนี้เพิ่มให้อีก +1 รวมเป็น +2',
 rally:'ตอนคุณเป็นฝ่ายบุก ความเสียหายที่ได้รับลดลง 1 (เสียทหารน้อยลง 1 ตัว)',
 raid:'บุกแล้วชนะ แต้มฆ่าของคุณ +1 ฝ่ายรับเสียทหารเพิ่ม',
 vanguard:'ตอนบุก ถ้าทหารของคุณน้อยกว่าฝ่ายรับ แต้มฆ่า +1',
 secret:'วัดทุกแห่งและช่องริมน้ำทุกช่อง เดินเข้าเขาพระสุเมรุได้ตรงๆ และออกจากเขากลับไปช่องเหล่านี้ได้ ไม่ต้องผ่านป่าลึกและทุ่งหน้าเขา',
 chain:'บุกชนะและยังเหลือทหาร เดินต่อจากช่องนั้นได้อีก 1 ช่องในตาเดียวกัน ถ้าเจอศัตรูก็รบต่อได้ (ไม่นับเป็นแอคชัน)',
 manual:'ได้การ์ดรบ "พิชัยยุทธ" (พลัง 4 ฆ่า 2) เพิ่มในมือ เป็นการ์ดรบที่แรงที่สุด',
 divine:'ทุกครั้งที่คุณเป็นฝ่ายบุก พลังรบ +2',
 sky:'แอคชันเดินทัพใช้ได้ 2 ครั้งต่อรอบ และมีแอคชันรวมเป็น 4 ต่อรอบ',
 vpR:'ได้ 1 คะแนนถาวรทันทีที่ซื้อ',
 armor:'ทุกครั้งที่คุณเป็นฝ่ายตั้งรับ พลังรบ +1',
 levy:'แอคชันเกณฑ์ทัพได้ทหารเพิ่ม 1 ตัว (จ่ายบุญเพิ่มตามจำนวนตัว ปกติ 2 ตัว 2 บุญ มีการ์ดนี้ 3 ตัว 3 บุญ)',
 wall:'ตั้งรับในวัด พลังรบ +1',
 ward:'ตอนคุณเป็นฝ่ายตั้งรับ ความเสียหายที่ได้รับลดลง 1',
 reserve:'เกณฑ์ทัพลงช่องที่ติดกับกองใดก็ได้ของคุณ (รวมเมือง) ถ้าช่องนั้นว่างหรือมีกองของคุณ ห้ามลงวัด วัดหลวง หรือเขาพระสุเมรุ',
 unity:'ตั้งรับด้วยทหาร 5 ตัวขึ้นไป พลังรบ +1',
 counter:'ตั้งรับแล้วชนะ แต้มฆ่าของคุณ +1 ฝ่ายบุกเสียทหารเพิ่ม',
 fort:'กองนอกเมืองจุทหารได้เพิ่มจากเดิม 1 ตัว (ปกติ 5 → 6 · ถ้ามีกองทัพศรัทธา 4 → 5 · พระพาย 4 → 5) ใช้ทั้งตอนเดินและตอนบุก',
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
