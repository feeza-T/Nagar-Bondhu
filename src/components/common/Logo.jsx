import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#F26B21" />
      <path d="M32 12c10 8 14 16 14 24a14 14 0 0 1-28 0c0-8 4-16 14-24z" fill="#DDF545" />
      <path d="M32 26v22M32 36l8-6M32 42l-8-6" stroke="#24402B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Logo({ light = false, to = '/' }) {
  const { t } = useTranslation();
  return (
    <Link to={to} className="flex items-center gap-2" aria-label={t('brand.name')}>
      <LogoMark />
      <span className={`font-display text-2xl tracking-wide ${light ? 'text-white' : 'text-forest'}`}>{t('brand.name')}</span>
    </Link>
  );
}
