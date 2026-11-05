import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Recycle, Trash2 } from 'lucide-react';
import LangSwitch from '../common/LangSwitch';
import Logo from '../common/Logo';

// Split layout: orange brand panel (desktop only) + form column
export default function AuthShell({ title, subtitle, children }) {
  const { t } = useTranslation();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <Logo light />
        <div className="relative">
          <Trash2 className="absolute -right-4 -top-24 h-64 w-64 text-white/15" strokeWidth={1} />
          <h2 className="relative font-display text-7xl uppercase leading-none">{t('auth.panelTitle')}</h2>
          <p className="relative mt-4 max-w-sm text-white/90">{t('auth.panelDesc')}</p>
        </div>
        <div className="flex items-center gap-3 text-lime"><Recycle /><span className="text-sm font-semibold">{t('hero.chip')}</span></div>
      </div>
      <div className="flex flex-col bg-cream px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-forest"><ArrowLeft size={18} />{t('auth.back')}</Link>
          <LangSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <h1 className="font-display text-5xl uppercase text-forest">{title}</h1>
          <p className="mb-6 mt-2 text-ink/70">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
