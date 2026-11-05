import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../common/Logo';

export default function Footer() {
  const { t } = useTranslation();
  const cols = [
    { title: 'footer.explore', links: [['nav.impact', '/#impact'], ['nav.features', '/#features'], ['nav.how', '/#how'], ['nav.projects', '/#projects']] },
    { title: 'footer.getInvolved', links: [['nav.report', '/report'], ['nav.signup', '/signup'], ['nav.login', '/login']] },
  ];
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">{t('footer.about')}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 font-bold text-lime">{t(c.title)}</h3>
            <ul className="space-y-2 text-sm text-white/75">
              {c.links.map(([k, to]) => <li key={k}><Link to={to} className="hover:text-white">{t(k)}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/50">{t('footer.rights')}</p>
    </footer>
  );
}
