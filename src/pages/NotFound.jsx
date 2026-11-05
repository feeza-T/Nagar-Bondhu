import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mint2 px-4 text-center">
      <p className="font-display text-9xl text-brand">404</p>
      <p className="mt-2 text-lg">{t('notFound.text')}</p>
      <Link to="/" className="btn btn-primary mt-6">{t('notFound.back')}</Link>
    </div>
  );
}
