import { delay, ok, readDb, writeDb } from './mockDb';

export async function listWorkers() {
  await delay();
  const db = readDb();
  const workers = db.users.filter((u) => u.role === 'worker').map(({ password, ...w }) => ({
    ...w,
    joined: db.campaigns.filter((c) => c.volunteers.includes(w.id)).length,
    completed: db.campaigns.filter((c) => c.done.includes(w.id)).length,
  }));
  return ok(workers);
}

export async function updateUser(id, patch) {
  await delay();
  const db = readDb();
  db.users = db.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  writeDb(db);
  const { password, ...user } = db.users.find((u) => u.id === id);
  return ok(user);
}
