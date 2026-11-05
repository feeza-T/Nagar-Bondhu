import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

// Shows where a report is in its journey: submitted -> confirmed -> campaign -> cleaned
const STEPS = ['pending', 'confirmed', 'campaign', 'cleaned'];

export default function ReportProgress({ status }) {
  const { t } = useTranslation();
  if (status === 'rejected') return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{t('user.rejectedNote')}</p>;
  const current = STEPS.indexOf(status);
  return (
    <ol className="flex items-start">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col items-center text-center">
          <div className="flex w-full items-center">
            <span className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : i <= current ? 'bg-teal' : 'bg-ink/15'}`} />
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= current ? 'bg-teal text-white' : 'bg-ink/10 text-ink/50'}`}>{i <= current ? <Check size={14} /> : i + 1}</span>
            <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? 'opacity-0' : i < current ? 'bg-teal' : 'bg-ink/15'}`} />
          </div>
          <span className={`mt-1 text-[11px] font-semibold ${i <= current ? 'text-teal' : 'text-ink/50'}`}>{t(`user.step.${s}`)}</span>
        </li>
      ))}
    </ol>
  );
}
