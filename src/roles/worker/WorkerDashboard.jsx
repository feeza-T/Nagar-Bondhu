import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ClipboardList, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import useCampaignActions from '../../hooks/useCampaignActions';
import { listCampaigns } from '../../services/campaignService';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import CampaignCard from './components/CampaignCard';

export default function WorkerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data, loading, reload } = useFetch(listCampaigns);
  const actions = useCampaignActions(user.id, reload);
  if (loading) return <Spinner />;

  const mine = data.filter((c) => c.volunteers.includes(user.id));
  const pending = mine.filter((c) => c.status === 'open' && !c.done.includes(user.id));
  const completed = mine.filter((c) => c.done.includes(user.id));
  // "Calls": open campaigns this worker has not joined yet (admin asked all volunteers)
  const calls = data.filter((c) => c.status === 'open' && !c.volunteers.includes(user.id));

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-4xl uppercase text-olive">{t('worker.title')}</h1><p className="text-ink/65">{t('worker.sub')}</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t('worker.sCalls')} value={calls.length} Icon={Megaphone} />
        <StatCard label={t('worker.sPending')} value={pending.length} Icon={ClipboardList} tone="bg-lime text-ink" />
        <StatCard label={t('worker.sDone')} value={completed.length} Icon={CheckCircle2} tone="bg-teal text-white" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-extrabold">{t('worker.callsTitle')}</h2><Link to="/worker/campaigns" className="text-sm font-bold text-olive underline">{t('admin.viewAll')}</Link></div>
        {!calls.length ? <p className="panel text-center text-ink/60">{t('worker.noCalls')}</p> : (
          <div className="grid gap-5 lg:grid-cols-2">{calls.map((c) => <CampaignCard key={c.id} c={c} workerId={user.id} {...actions} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-extrabold">{t('worker.activity')}</h2>
        {!mine.length ? <p className="panel text-center text-ink/60">{t('worker.noActivity')}</p> : (
          <ul className="panel divide-y divide-ink/10 !p-0">
            {mine.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div><p className="text-sm font-semibold">{c.title}</p><p className="text-xs text-ink/55">{fmtDate(c.date, i18n.language)}</p></div>
                <StatusBadge status={c.done.includes(user.id) ? 'completed' : c.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
