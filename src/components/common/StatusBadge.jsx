import { useTranslation } from 'react-i18next';

const STYLES = {
  pending: 'bg-amber-100 text-amber-900',
  confirmed: 'bg-sky-100 text-sky-900',
  campaign: 'bg-brand/15 text-clay',
  cleaned: 'bg-teal/15 text-teal',
  rejected: 'bg-red-100 text-red-800',
  open: 'bg-brand/15 text-clay',
  completed: 'bg-teal/15 text-teal',
};

// Works for both report statuses and campaign statuses
export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${STYLES[status]}`}>{t(`status.${status}`)}</span>;
}
