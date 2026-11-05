// Mock auth. Replace each function with supabase.auth.* later; keep the return shape { data, error }.
import { delay, fail, ok, readDb, uid, writeDb } from './mockDb';

const SESSION_KEY = 'nb_session';
const strip = ({ password, ...user }) => user; // never expose the password

export async function getSession() {
  await delay(100);
  const id = localStorage.getItem(SESSION_KEY);
  const user = readDb().users.find((u) => u.id === id);
  return ok(user ? strip(user) : null);
}

export async function login({ email, password }) {
  await delay();
  const user = readDb().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) return fail('auth.invalid');
  localStorage.setItem(SESSION_KEY, user.id);
  return ok(strip(user));
}

// One-click demo login for each role
export async function loginAsDemo(role) {
  await delay(150);
  const user = readDb().users.find((u) => u.role === role);
  localStorage.setItem(SESSION_KEY, user.id);
  return ok(strip(user));
}

export async function register({ name, email, phone, password, role }) {
  await delay();
  const db = readDb();
  if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return fail('auth.emailTaken');
  const user = { id: uid('u'), name: name.trim(), email: email.trim(), phone, password, role };
  db.users.push(user);
  writeDb(db);
  localStorage.setItem(SESSION_KEY, user.id);
  return ok(strip(user));
}

export async function logout() {
  await delay(80);
  localStorage.removeItem(SESSION_KEY);
  return ok(true);
}
