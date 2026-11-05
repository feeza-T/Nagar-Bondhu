import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ClipboardList, Clock, Megaphone } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { getReportStats, listReports } from '../../services/wasteReportService';
import { listWorkers } from '../../services/userService';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { data: stats, loading } = useFetch(getReportStats);
  const { data: reports } = useFetch(listReports);
  const { data: workers } = useFetch(listWorkers);
  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-4xl uppercase text-olive">{t('admin.title')}</h1><p className="text-ink/65">{t('admin.sub')}</p></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('admin.sTotal')} value={stats.total} Icon={ClipboardList} tone="bg-forest text-lime" />
        <StatCard label={t('admin.sPending')} value={stats.pending} Icon={Clock} />
        <StatCard label={t('admin.sCampaigns')} value={stats.activeCampaigns} Icon={Megaphone} tone="bg-lime text-ink" />
        <StatCard label={t('admin.sCleaned')} value={stats.cleaned} Icon={CheckCircle2} tone="bg-teal text-white" />
      </div>

      {stats.pending > 0 && (
        <Link to="/admin/reports" className="flex items-center justify-between rounded-2xl bg-brand p-4 font-bold text-white hover:bg-clay">
          <span>{t('admin.needsReview', { n: stats.pending })}</span><span className="btn btn-lime btn-sm">{t('admin.reviewNow')}</span>
        </Link>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel overflow-x-auto xl:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{t('admin.recent')}</h2><Link to="/admin/reports" className="text-sm font-bold text-olive underline">{t('admin.viewAll')}</Link></div>
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-xs text-ink/55"><tr><th className="pb-2">{t('admin.colReport')}</th><th>{t('admin.colArea')}</th><th>{t('admin.colDate')}</th><th>{t('admin.colStatus')}</th></tr></thead>
            <tbody>
              {reports?.slice(0, 6).map((r) => (
                <tr key={r.id} className="border-t border-ink/10"><td className="py-2.5 pr-2 font-semibold">{r.title}</td><td>{t(`areas.${r.area}`)}</td><td>{fmtDate(r.createdAt, i18n.language)}</td><td><StatusBadge status={r.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="mb-3 font-bold">{t('admin.workers')}</h2>
          <ul className="space-y-3">
            {workers?.map((w) => (
              <li key={w.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-bold text-lime">{w.name[0]}</span>
                <div className="flex-1"><p className="text-sm font-semibold">{w.name}</p><p className="text-xs text-ink/60">{t('admin.workerStats', { joined: w.joined, done: w.completed })}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
