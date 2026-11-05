import { delay, ok, fail, readDb, uid, writeDb } from './mockDb';

// filters: { status, userId }
export async function listReports(filters = {}) {
  await delay();
  let list = readDb().reports;
  if (filters.status) list = list.filter((r) => r.status === filters.status);
  if (filters.userId) list = list.filter((r) => r.userId === filters.userId);
  return ok([...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function createReport(payload, user) {
  await delay(500);
  if (!user) return fail('report.loginRequired'); // server-side style guard
  const db = readDb();
  const report = {
    id: uid('r'), ...payload, status: 'pending', userId: user.id, userName: user.name,
    createdAt: new Date().toISOString(), campaignId: null,
  };
  db.reports.push(report);
  writeDb(db);
  return ok(report);
}

// pending -> confirmed | rejected   (campaign / cleaned are set by campaignService)
export async function updateReportStatus(id, status) {
  await delay();
  const db = readDb();
  db.reports = db.reports.map((r) => (r.id === id ? { ...r, status } : r));
  writeDb(db);
  return ok(db.reports.find((r) => r.id === id));
}

export async function getReportStats() {
  await delay(100);
  const { reports, campaigns } = readDb();
  const count = (s) => reports.filter((r) => r.status === s).length;
  return ok({
    total: reports.length, pending: count('pending'), confirmed: count('confirmed'),
    campaign: count('campaign'), cleaned: count('cleaned'),
    activeCampaigns: campaigns.filter((c) => c.status === 'open').length,
  });
}
