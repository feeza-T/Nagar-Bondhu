import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { createCampaign } from '../../../services/campaignService';

// Admin turns a confirmed report into a campaign: date, time, meeting point, how many volunteers
export default function CampaignModal({ report, onClose, onCreated }) {
  const { t } = useTranslation();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [f, setF] = useState({ title: report.title, date: tomorrow, time: '08:00', meetingPoint: report.location, needed: 5, note: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await createCampaign({ ...f, reportId: report.id });
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={t('admin.createCampaign')}>
      <motion.form initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={submit} className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-3xl bg-white p-6">
        <div className="flex items-start justify-between"><h2 className="font-display text-3xl uppercase text-olive">{t('admin.createCampaign')}</h2><button type="button" onClick={onClose} aria-label={t('common.close')}><X /></button></div>
        <div><label className="label" htmlFor="ct">{t('admin.cTitle')}</label><input id="ct" className="input" required value={f.title} onChange={set('title')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="cd">{t('admin.cDate')}</label><input id="cd" type="date" min={tomorrow} className="input" required value={f.date} onChange={set('date')} /></div>
          <div><label className="label" htmlFor="ctm">{t('admin.cTime')}</label><input id="ctm" type="time" className="input" required value={f.time} onChange={set('time')} /></div>
        </div>
        <div><label className="label" htmlFor="cm">{t('admin.cMeeting')}</label><input id="cm" className="input" required value={f.meetingPoint} onChange={set('meetingPoint')} /></div>
        <div><label className="label" htmlFor="cn">{t('admin.cNeeded')}</label><input id="cn" type="number" min="1" max="100" className="input" required value={f.needed} onChange={set('needed')} /></div>
        <div><label className="label" htmlFor="cnote">{t('admin.cNote')}</label><textarea id="cnote" rows={2} className="input" value={f.note} onChange={set('note')} placeholder={t('admin.cNotePh')} /></div>
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? t('common.wait') : t('admin.publishCampaign')}</button>
      </motion.form>
    </div>
  );
}
