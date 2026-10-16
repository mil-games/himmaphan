// ที่เก็บข้อมูลห้องเล่น: ใช้ Firebase ถ้าตั้งค่าแล้ว ไม่งั้นใช้หน่วยความจำในเครื่อง
import { firebaseConfig } from './firebase-config.js';

const V = '10.12.2';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
const uidsOf = S => [...new Set([S.host, ...(S.seats || []).map(x => x.uid)].filter(u => u && u !== 'bot'))];
const clone = o => JSON.parse(JSON.stringify(o));

function localStore() {
  const games = {}; const chats = {};
  const subs = new Map(); let sid = 0;
  const fire = () => subs.forEach(f => f());
  let me = null;
  try { me = localStorage.getItem('hmp-local-uid'); } catch (e) {}
  if (!me) { me = 'local-' + Math.random().toString(36).slice(2, 10); try { localStorage.setItem('hmp-local-uid', me); } catch (e) {} }
  return {
    online: false, me,
    async create(data) { let id; do { id = newCode(); } while (games[id]); data.uids = uidsOf(data); games[id] = clone(data); fire(); return id; },
    async get(id) { return games[id] ? clone(games[id]) : null; },
    async mutate(id, fn) {
      if (!games[id]) return { ok: false, why: 'missing' };
      const S = clone(games[id]); if (fn(S) === false) return { ok: false };
      S.upd = Date.now(); S.uids = uidsOf(S); if (window.checkSavable) window.checkSavable(S); games[id] = S; fire(); return { ok: true };
    },
    watchGame(id, cb) { const k = ++sid; const f = () => cb(games[id] ? clone(games[id]) : null); subs.set(k, f); f(); return () => subs.delete(k); },
    watchMine(cb) { const k = ++sid; const f = () => cb(Object.entries(games).map(([id, d]) => ({ id, d: clone(d) }))); subs.set(k, f); f(); return () => subs.delete(k); },
    async del(id) { delete games[id]; delete chats[id]; fire(); },
    watchChat(id, cb) { const k = ++sid; const f = () => cb(clone(chats[id] || [])); subs.set(k, f); f(); return () => subs.delete(k); },
    async sendChat(id, m) { (chats[id] = chats[id] || []).push(Object.assign({ id: 'm' + (++sid), at: Date.now(), uid: me }, m)); if (chats[id].length > 60) chats[id].shift(); fire(); return true; }
  };
}

async function firebaseStore() {
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, linkWithPopup, signInWithPopup, signInWithCredential } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const F = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = F.getFirestore(app);
  const me = await new Promise((resolve, reject) => {
    const stop = onAuthStateChanged(auth, u => { if (u) { stop(); resolve(u.uid); } });
    signInAnonymously(auth).catch(reject);
  });
  const ref = id => F.doc(db, 'games', id);
  const user = () => auth.currentUser;
  return {
    online: true, me,
    get google() { const u = user(); const g = u && u.providerData.find(p => p.providerId === 'google.com'); return g ? (g.email || g.displayName || 'Google') : null; },
    /* ผูกตัวตนนี้กับบัญชี Google เพื่อใช้ตัวตนเดิมจากเครื่องอื่น
       ถ้าบัญชี Google นี้เคยผูกไว้แล้วจากอีกเครื่อง จะสลับไปใช้ตัวตนเดิมนั้น (คืนค่า 'switched' ให้รีโหลดหน้า) */
    async linkGoogle() {
      const p = new GoogleAuthProvider();
      try { await linkWithPopup(user(), p); return 'linked'; }
      catch (e) {
        if (e && (e.code === 'auth/credential-already-in-use' || e.code === 'auth/email-already-in-use')) {
          const cred = GoogleAuthProvider.credentialFromError(e);
          if (cred) { await signInWithCredential(auth, cred); return 'switched'; }
          await signInWithPopup(auth, p); return 'switched';
        }
        if (e && e.code === 'auth/provider-already-linked') return 'linked';
        throw e;
      }
    },
    async create(data) {
      data.uids = uidsOf(data);
      for (let i = 0; i < 6; i++) {
        const id = newCode();
        const made = await F.runTransaction(db, async t => {
          const snap = await t.get(ref(id));
          if (snap.exists()) return false;
          t.set(ref(id), data); return true;
        });
        if (made) return id;
      }
      throw new Error('สร้างรหัสห้องไม่สำเร็จ');
    },
    async get(id) { const s = await F.getDoc(ref(id)); return s.exists() ? s.data() : null; },
    async mutate(id, fn) {
      try {
        const ok = await F.runTransaction(db, async t => {
          const snap = await t.get(ref(id));
          if (!snap.exists()) return 'missing';
          const S = clone(snap.data());
          if (fn(S) === false) return false;
          S.upd = Date.now(); S.uids = uidsOf(S);
          if (window.checkSavable) window.checkSavable(S);
          t.set(ref(id), S); return true;
        });
        return ok === true ? { ok: true } : { ok: false, why: ok === 'missing' ? 'missing' : undefined };
      } catch (e) {
        console.error('บันทึกไม่สำเร็จ', e);
        const code = e && e.code;
        if (code === 'permission-denied') return { ok: false, why: 'denied' };
        if (code === 'unavailable' || (typeof navigator !== 'undefined' && navigator.onLine === false)) return { ok: false, why: 'offline' };
        return { ok: false, why: 'error', detail: String(code || (e && e.message) || e).slice(0, 80) };
      }
    },
    watchGame(id, cb) { return F.onSnapshot(ref(id), s => cb(s.exists() ? s.data() : null), () => cb(undefined)); },
    watchMine(cb) {
      const q = F.query(F.collection(db, 'games'), F.where('uids', 'array-contains', me), F.limit(30));
      return F.onSnapshot(q, qs => cb(qs.docs.map(d => ({ id: d.id, d: d.data() }))), () => cb([]));
    },
    async del(id) {
      // ลบข้อความแชทของห้องก่อน แล้วค่อยลบห้อง
      try { const qs = await F.getDocs(F.collection(db, 'games', id, 'chat')); await Promise.all(qs.docs.map(d => F.deleteDoc(d.ref))); } catch (e) {}
      await F.deleteDoc(ref(id));
    },
    /* แชทในห้อง: เก็บแยกเป็น games/{รหัส}/chat ไม่ไปแตะสถานะเกม */
    watchChat(id, cb) {
      const q = F.query(F.collection(db, 'games', id, 'chat'), F.orderBy('at', 'desc'), F.limit(60));
      return F.onSnapshot(q, qs => cb(qs.docs.map(d => Object.assign({ id: d.id }, d.data())).reverse()), e => cb(null, e && e.code));
    },
    async sendChat(id, m) {
      try { await F.addDoc(F.collection(db, 'games', id, 'chat'), Object.assign({ uid: me, at: Date.now() }, m)); return true; }
      catch (e) { console.error('ส่งแชทไม่สำเร็จ', e); return e && e.code === 'permission-denied' ? 'denied' : false; }
    }
  };
}

const configured = firebaseConfig && firebaseConfig.apiKey && !/ใส่/.test(firebaseConfig.apiKey);
let store, error = null;
try { store = configured ? await firebaseStore() : localStore(); }
catch (e) { error = e; store = localStore(); }
store.configured = configured; store.error = error ? String(error.message || error) : null;
window.HMP_STORE = store;
window.dispatchEvent(new Event('hmp-store-ready'));
