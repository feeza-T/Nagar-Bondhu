// A campaign = a scheduled clean-up day created by an admin from a confirmed report.
// Lifecycle: open (volunteers join) -> completed (admin closes it, report becomes "cleaned")
import { delay, fail, ok, readDb, uid, writeDb } from './mockDb';

export async function listCampaigns() {
  await delay();
  return ok([...readDb().campaigns].sort((a, b) => a.date.localeCompare(b.date)));
}

export async function createCampaign(form) {
  await delay(400);
  const db = readDb();
  const report = db.reports.find((r) => r.id === form.reportId);
  if (!report) return fail('campaign.noReport');
  const campaign = {
    id: uid('c'), ...form, area: report.area, location: report.location,
    needed: Number(form.needed), volunteers: [], done: [], status: 'open', createdAt: new Date().toISOString(),
  };
  db.campaigns.push(campaign);
  report.status = 'campaign';
  report.campaignId = campaign.id;
  writeDb(db);
  return ok(campaign);
}

const mutate = (id, fn) => {
  const db = readDb();
  const c = db.campaigns.find((x) => x.id === id);
  if (!c) return fail('campaign.noReport');
  fn(c, db);
  writeDb(db);
  return ok(c);
};

export async function joinCampaign(id, workerId) {
  await delay(200);
  return mutate(id, (c) => { if (!c.volunteers.includes(workerId) && c.volunteers.length < c.needed) c.volunteers.push(workerId); });
}
export async function leaveCampaign(id, workerId) {
  await delay(200);
  return mutate(id, (c) => { c.volunteers = c.volunteers.filter((v) => v !== workerId); c.done = c.done.filter((v) => v !== workerId); });
}
// A volunteer confirms that they did their part on the day
export async function markDone(id, workerId) {
  await delay(200);
  return mutate(id, (c) => { if (c.volunteers.includes(workerId) && !c.done.includes(workerId)) c.done.push(workerId); });
}
// Admin closes the campaign -> the linked report is shown as cleaned to the citizen
export async function completeCampaign(id) {
  await delay(300);
  return mutate(id, (c, db) => {
    c.status = 'completed';
    const r = db.reports.find((x) => x.id === c.reportId);
    if (r) r.status = 'cleaned';
  });
}
