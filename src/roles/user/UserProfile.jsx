import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import { listReports } from '../../services/wasteReportService';
import { listCampaigns } from '../../services/campaignService';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import ReportProgress from './components/ReportProgress';

// Citizen page: profile card + "My reports" with live progress (this is where they see the clean-up succeed)
export default function UserProfile() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: reports, loading } = useFetch(() => listReports({ userId: user.id }), [user.id]);
  const { data: campaigns } = useFetch(listCampaigns);
  const campaignOf = (id) => campaigns?.find((c) => c.id === id);

  return (
    <section className="min-h-[70vh] bg-mint2 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-forest p-6 text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime font-display text-3xl text-ink">{user.name[0]}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <p className="text-sm text-white/75">{user.email} · {user.phone}</p>
            <span className="mt-1 inline-block rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold">{t(`roles.${user.role}`)}</span>
          </div>
          <Link to="/report" className="btn btn-primary">{t('nav.report')}</Link>
        </div>

        <h2 className="mb-4 mt-10 font-display text-3xl uppercase text-olive">{t('user.myReports')}</h2>
        {loading ? <Spinner /> : !reports.length ? (
          <div className="panel text-center"><p className="text-ink/70">{t('user.empty')}</p><Link to="/report" className="btn btn-primary mt-4">{t('nav.report')}</Link></div>
        ) : (
          <ul className="space-y-4">
            {reports.map((r) => {
              const c = campaignOf(r.campaignId);
              return (
                <li key={r.id} className="panel">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex gap-4">
                      {r.image && <img src={r.image} alt="" className="h-20 w-20 rounded-xl object-cover" />}
                      <div>
                        <h3 className="font-bold">{r.title}</h3>
                        <p className="flex items-center gap-1 text-sm text-ink/60"><MapPin size={14} />{r.location}, {t(`areas.${r.area}`)}</p>
                        <p className="text-xs text-ink/50">{fmtDate(r.createdAt, i18n.language)}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-5"><ReportProgress status={r.status} /></div>
                  {c && r.status === 'campaign' && <p className="mt-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-clay">{t('user.campaignInfo', { date: fmtDate(c.date, i18n.language), time: c.time })}</p>}
                  {r.status === 'cleaned' && <p className="mt-4 rounded-lg bg-teal/10 px-3 py-2 text-sm font-semibold text-teal">{t('user.cleanedInfo', { n: c?.done.length ?? 0 })}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
