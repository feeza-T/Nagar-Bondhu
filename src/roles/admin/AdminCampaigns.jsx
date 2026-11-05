import { useTranslation } from 'react-i18next';
import { CalendarDays, CheckCircle2, Clock, MapPin } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { completeCampaign, listCampaigns } from '../../services/campaignService';
import { listWorkers } from '../../services/userService';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

// STEP 5 of the demo flow: admin watches volunteers join / finish, then closes the campaign
export default function AdminCampaigns() {
  const { t, i18n } = useTranslation();
  const { data, loading, reload } = useFetch(listCampaigns);
  const { data: workers } = useFetch(listWorkers);
  const name = (id) => workers?.find((w) => w.id === id)?.name || id;

  const close = async (id) => { await completeCampaign(id); reload(); };

  if (loading) return <Spinner />;
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl uppercase text-olive">{t('admin.campaignsTitle')}</h1><p className="text-ink/65">{t('admin.campaignsSub')}</p></div>
      {!data.length && <p className="panel text-center text-ink/60">{t('admin.noCampaigns')}</p>}
      <div className="grid gap-5 lg:grid-cols-2">
        {data.map((c) => {
          const pct = Math.min(100, Math.round((c.volunteers.length / c.needed) * 100));
          return (
            <article key={c.id} className="panel flex flex-col">
              <div className="flex items-start justify-between gap-2"><h2 className="font-bold">{c.title}</h2><StatusBadge status={c.status} /></div>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                <li className="flex items-center gap-2"><CalendarDays size={15} />{fmtDate(c.date, i18n.language)}</li>
                <li className="flex items-center gap-2"><Clock size={15} />{c.time}</li>
                <li className="flex items-center gap-2"><MapPin size={15} />{c.meetingPoint}</li>
              </ul>
              {c.note && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs">{c.note}</p>}

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs font-semibold"><span>{t('admin.volunteers')}</span><span>{c.volunteers.length}/{c.needed}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} /></div>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.volunteers.length === 0 && <li className="text-xs text-ink/50">{t('admin.noVolunteers')}</li>}
                {c.volunteers.map((v) => (
                  <li key={v} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${c.done.includes(v) ? 'bg-teal/15 text-teal' : 'bg-surface'}`}>
                    {c.done.includes(v) && <CheckCircle2 size={13} />}{name(v)}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                {c.status === 'open' ? (
                  <button className="btn btn-primary w-full" disabled={c.done.length === 0} onClick={() => close(c.id)}>{t('admin.completeCampaign')}</button>
                ) : <p className="flex items-center gap-2 text-sm font-bold text-teal"><CheckCircle2 size={18} />{t('admin.campaignDone', { n: c.done.length })}</p>}
                {c.status === 'open' && c.done.length === 0 && <p className="mt-2 text-center text-xs text-ink/50">{t('admin.waitDone')}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
