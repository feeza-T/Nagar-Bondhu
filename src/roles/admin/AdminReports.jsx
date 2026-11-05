import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, MapPin, Megaphone, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { listReports, updateReportStatus } from '../../services/wasteReportService';
import { REPORT_STATUSES } from '../../utils/constants';
import { fmtDate } from '../../utils/format';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import CampaignModal from './components/CampaignModal';

// STEP 2 + 3 of the demo flow: admin reviews reports, confirms them, then creates a campaign
export default function AdminReports() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const { data, loading, reload } = useFetch(listReports);

  const act = async (id, status) => { await updateReportStatus(id, status); reload(); };
  const list = (data || []).filter((r) => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl uppercase text-olive">{t('admin.reportsTitle')}</h1><p className="text-ink/65">{t('admin.reportsSub')}</p></div>
      <div className="flex flex-wrap gap-2">
        {['all', ...REPORT_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s} className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline'}`}>{s === 'all' ? t('common.all') : t(`status.${s}`)}</button>
        ))}
      </div>

      {loading ? <Spinner /> : !list.length ? <p className="panel text-center text-ink/60">{t('admin.noReports')}</p> : (
        <ul className="space-y-4">
          {list.map((r) => (
            <li key={r.id} className="panel">
              <div className="flex flex-wrap gap-4">
                {r.image ? <img src={r.image} alt={t('report.photoAlt')} className="h-28 w-28 rounded-xl object-cover" /> : <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-surface text-xs text-ink/40">{t('admin.noPhoto')}</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{r.title}</h2><StatusBadge status={r.status} /></div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ink/60"><MapPin size={14} />{r.location}, {t(`areas.${r.area}`)}</p>
                  <p className="mt-2 text-sm">{r.description}</p>
                  <p className="mt-2 text-xs text-ink/50">{t('admin.by', { name: r.userName })} · {t(`report.cat.${r.category}`)} · {fmtDate(r.createdAt, i18n.language)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                {r.status === 'pending' && (<>
                  <button className="btn btn-primary btn-sm" onClick={() => act(r.id, 'confirmed')}><Check size={15} />{t('admin.confirm')}</button>
                  <button className="btn btn-outline btn-sm" onClick={() => act(r.id, 'rejected')}><X size={15} />{t('admin.reject')}</button>
                </>)}
                {r.status === 'confirmed' && <button className="btn btn-lime btn-sm" onClick={() => setModal(r)}><Megaphone size={15} />{t('admin.createCampaign')}</button>}
                {r.status === 'campaign' && <Link to="/admin/campaigns" className="btn btn-outline btn-sm">{t('admin.viewCampaign')}</Link>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {modal && <CampaignModal report={modal} onClose={() => setModal(null)} onCreated={() => { setModal(null); reload(); }} />}
    </div>
  );
}
