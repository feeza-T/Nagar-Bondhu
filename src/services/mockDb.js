// Tiny fake database stored in localStorage. Only services/* may import this file.
// Delete it when Supabase replaces the services.
const KEY = 'nb_db_v1';
const day = 86400000;
const iso = (offset) => new Date(Date.now() + offset * day).toISOString();
const dateOnly = (offset) => iso(offset).slice(0, 10);

const seed = () => ({
  users: [
    { id: 'u1', name: 'Rahim Uddin', email: 'citizen@demo.com', password: 'demo1234', phone: '01711000001', role: 'citizen' },
    { id: 'w1', name: 'Karim Hossain', email: 'worker@demo.com', password: 'demo1234', phone: '01711000002', role: 'worker' },
    { id: 'w2', name: 'Salma Akter', email: 'salma@demo.com', password: 'demo1234', phone: '01711000003', role: 'worker' },
    { id: 'w3', name: 'Jamal Mia', email: 'jamal@demo.com', password: 'demo1234', phone: '01711000004', role: 'worker' },
    { id: 'a1', name: 'Nusrat Jahan', email: 'admin@demo.com', password: 'demo1234', phone: '01711000005', role: 'admin' },
  ],
  reports: [
    { id: 'r1', title: 'Overflowing bins near Karwan Bazar', category: 'overflow', area: 'Dhaka', location: 'Karwan Bazar kitchen market, gate 2', description: 'Bins have not been emptied for four days. Smell is spreading.', image: null, status: 'pending', userId: 'u1', userName: 'Rahim Uddin', createdAt: iso(-1), campaignId: null },
    { id: 'r2', title: 'Drain blocked with plastic', category: 'drain', area: 'Chattogram', location: 'GEC Circle, east side', description: 'Rain water cannot pass. Street floods after 20 minutes of rain.', image: null, status: 'confirmed', userId: 'u1', userName: 'Rahim Uddin', createdAt: iso(-3), campaignId: null },
    { id: 'r3', title: 'Illegal dumping on Rupsha riverbank', category: 'dumping', area: 'Khulna', location: 'Rupsha ferry ghat', description: 'Construction and household waste dumped every night.', image: null, status: 'campaign', userId: 'u1', userName: 'Rahim Uddin', createdAt: iso(-6), campaignId: 'c1' },
    { id: 'r4', title: 'Garbage pile at school gate', category: 'overflow', area: 'Rajshahi', location: 'Shaheb Bazar Govt. School', description: 'A large pile blocks the gate in the morning.', image: null, status: 'cleaned', userId: 'u1', userName: 'Rahim Uddin', createdAt: iso(-14), campaignId: 'c0' },
  ],
  campaigns: [
    { id: 'c1', reportId: 'r3', title: 'Rupsha Riverbank Clean-up Day', area: 'Khulna', location: 'Rupsha ferry ghat', date: dateOnly(3), time: '08:00', meetingPoint: 'Rupsha ferry ghat main gate', note: 'Bring gloves. Masks and bags will be provided.', needed: 6, volunteers: ['w2'], done: [], status: 'open', createdAt: iso(-2) },
    { id: 'c0', reportId: 'r4', title: 'Shaheb Bazar School Clean-up', area: 'Rajshahi', location: 'Shaheb Bazar Govt. School', date: dateOnly(-9), time: '09:00', meetingPoint: 'School front gate', note: '', needed: 4, volunteers: ['w1', 'w2'], done: ['w1', 'w2'], status: 'completed', createdAt: iso(-12) },
  ],
});

export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
export const uid = (p) => p + Math.random().toString(36).slice(2, 9);
export const ok = (data) => ({ data, error: null });
export const fail = (message) => ({ data: null, error: { message } });

export function writeDb(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { console.warn('Could not save demo data', e); }
}
export function readDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through to seed */ }
  const fresh = seed();
  writeDb(fresh);
  return fresh;
}
export function resetDb() { localStorage.removeItem(KEY); localStorage.removeItem('nb_session'); }
