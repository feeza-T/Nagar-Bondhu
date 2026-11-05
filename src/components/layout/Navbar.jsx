import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Megaphone, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardPath } from '../../utils/constants';
import Logo from '../common/Logo';
import LangSwitch from '../common/LangSwitch';

const LINKS = ['home', 'impact', 'features', 'how', 'services', 'projects'];
const hrefFor = (k) => (k === 'home' ? '/' : `/#${k}`);

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef(null);

  // Shrink the bar after scrolling
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const on = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false); };
    document.addEventListener('mousedown', on);
    return () => document.removeEventListener('mousedown', on);
  }, []);

  const dash = user && dashboardPath(user.role);
  const itemCls = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-mint2';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur' : 'bg-transparent'}`}>
      <nav className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 ${scrolled ? 'py-2' : 'py-4'}`} aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map((k) => (
            <li key={k}><Link to={hrefFor(k)} className="text-sm font-semibold text-ink/80 transition hover:text-clay">{t(`nav.${k}`)}</Link></li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/report" className="btn btn-primary btn-sm hidden sm:inline-flex"><Megaphone size={15} />{t('nav.report')}</Link>
          <LangSwitch />
          {!user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn btn-outline btn-sm">{t('nav.login')}</Link>
              <Link to="/signup" className="btn btn-dark btn-sm">{t('nav.signup')}</Link>
            </div>
          ) : (
            <div className="relative" ref={dropRef}>
              <button type="button" onClick={() => setDrop((v) => !v)} aria-expanded={drop} aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-ink/15 bg-white py-1 pl-1 pr-3 transition hover:border-brand">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-bold text-lime">{user.name[0]}</span>
                <span className="hidden max-w-[110px] truncate text-sm font-semibold sm:block">{user.name}</span>
                <ChevronDown size={14} className={`transition ${drop ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {drop && (
                  <motion.div role="menu" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl">
                    <div className="border-b border-ink/10 px-3 pb-2 pt-1">
                      <p className="truncate text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-ink/60">{t(`roles.${user.role}`)}</p>
                    </div>
                    <Link role="menuitem" to="/profile" onClick={() => setDrop(false)} className={itemCls}><User size={16} />{t('nav.profile')}</Link>
                    {dash && <Link role="menuitem" to={dash} onClick={() => setDrop(false)} className={itemCls}><LayoutDashboard size={16} />{t(`nav.${user.role}Dashboard`)}</Link>}
                    <button role="menuitem" type="button" className={`${itemCls} text-clay`} onClick={async () => { setDrop(false); await logout(); navigate('/'); }}><LogOut size={16} />{t('nav.logout')}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button type="button" className="rounded-lg p-2 lg:hidden" onClick={() => setMenu((v) => !v)} aria-label={t('nav.menu')} aria-expanded={menu}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menu && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-ink/10 bg-white lg:hidden">
            <ul className="flex flex-col gap-1 p-4">
              {LINKS.map((k) => <li key={k}><Link to={hrefFor(k)} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 font-semibold hover:bg-mint2">{t(`nav.${k}`)}</Link></li>)}
              <li><Link to="/report" onClick={() => setMenu(false)} className="btn btn-primary mt-2 w-full"><Megaphone size={16} />{t('nav.report')}</Link></li>
              {!user && (
                <li className="mt-2 grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMenu(false)} className="btn btn-outline">{t('nav.login')}</Link>
                  <Link to="/signup" onClick={() => setMenu(false)} className="btn btn-dark">{t('nav.signup')}</Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
