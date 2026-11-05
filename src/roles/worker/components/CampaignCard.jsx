import { useTranslation } from 'react-i18next';
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from 'lucide-react';
import { fmtDate } from '../../../utils/format';
import StatusBadge from '../../../components/common/StatusBadge';

// One campaign as seen by a worker: join / leave / mark my part done
export default function CampaignCard({ c, workerId, onJoin, onLeave, onDone }) {
  const { t, i18n } = useTranslation();
  const joined = c.volunteers.includes(workerId);
  const done = c.done.includes(workerId);
  const full = c.volunteers.length >= c.needed;

  return (
    <article className="panel flex flex-col">
      <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{c.title}</h3><StatusBadge status={c.status} /></div>
      <ul className="mt-2 space-y-1 text-sm text-ink/70">
        <li className="flex items-center gap-2"><CalendarDays size={15} />{fmtDate(c.date, i18n.language)}</li>
        <li className="flex items-center gap-2"><Clock size={15} />{c.time}</li>
        <li className="flex items-center gap-2"><MapPin size={15} />{c.meetingPoint}</li>
        <li className="flex items-center gap-2"><Users size={15} />{t('worker.spots', { joined: c.volunteers.length, needed: c.needed })}</li>
      </ul>
      {c.note && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs">{c.note}</p>}
      <div className="mt-auto pt-4">
        {c.status === 'completed' ? (
          <p className="flex items-center gap-2 text-sm font-bold text-teal"><CheckCircle2 size={18} />{joined ? t('worker.thanks') : t('worker.campaignClosed')}</p>
        ) : !joined ? (
          <button className="btn btn-primary w-full" disabled={full} onClick={() => onJoin(c.id)}>{full ? t('worker.full') : t('worker.join')}</button>
        ) : done ? (
          <p className="flex items-center gap-2 text-sm font-bold text-teal"><CheckCircle2 size={18} />{t('worker.myPartDone')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-lime" onClick={() => onDone(c.id)}>{t('worker.markDone')}</button>
            <button className="btn btn-outline" onClick={() => onLeave(c.id)}>{t('worker.leave')}</button>
          </div>
        )}
      </div>
    </article>
  );
}
