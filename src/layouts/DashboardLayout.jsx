import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, ClipboardList, Home, LayoutDashboard, LogOut, Menu, Megaphone, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import LangSwitch from '../components/common/LangSwitch';

// Shared shell for Admin and Worker dashboards: sidebar + content area
const MENUS = {
  admin: [
    { to: '/admin', end: true, key: 'dash.overview', Icon: LayoutDashboard },
    { to: '/admin/reports', key: 'dash.reports', Icon: ClipboardList },
    { to: '/admin/campaigns', key: 'dash.campaigns', Icon: Megaphone },
  ],
  worker: [
    { to: '/worker', end: true, key: 'dash.overview', Icon: BarChart3 },
    { to: '/worker/campaigns', key: 'dash.campaigns', Icon: Megaphone },
  ],
};

export default function DashboardLayout({ role }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const link = ({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand text-white' : 'text-white/80 hover:bg-white/10'}`;

  return (
    <div className="flex min-h-screen bg-mint2">
      {/* Sidebar (slides in on mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-forest to-ink p-4 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between"><Logo light /><button className="text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
        <p className="mb-2 px-4 text-xs font-bold text-lime">{t(`dash.${role}Title`)}</p>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {MENUS[role].map(({ to, end, key, Icon }) => (
            <NavLink key={to} to={to} end={end} className={link} onClick={() => setOpen(false)}><Icon size={18} />{t(key)}</NavLink>
          ))}
        </nav>
        <Link to="/" className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"><Home size={18} />{t('dash.backToSite')}</Link>
        <button type="button" onClick={async () => { await logout(); navigate('/'); }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"><LogOut size={18} />{t('nav.logout')}</button>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-8">
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label={t('nav.menu')}><Menu /></button>
          <p className="hidden text-sm text-ink/70 sm:block">{t('dash.welcome', { name: user.name })}</p>
          <div className="ml-auto flex items-center gap-3"><LangSwitch /><span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-bold text-lime">{user.name[0]}</span></div>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
