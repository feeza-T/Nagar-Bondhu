
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  User,
  X,
  ArrowUpRight,
  Leaf,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { dashboardPath } from '../../utils/constants';
import LangSwitch from '../common/LangSwitch';

const LINKS = ['home', 'impact', 'features', 'how', 'services', 'projects'];

const hrefFor = (key) => (key === 'home' ? '/' : `/#${key}`);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);

  const dropRef = useRef(null);
  const dash = user && dashboardPath(user.role);

  // Supports common English and Bangla language codes.
  const isBangla = i18n.language?.toLowerCase().startsWith('bn');
  const brandName = isBangla ? 'নগরবন্ধু' : 'NagarBondhu';
  const tagline = isBangla
    ? 'আপনার শহর, আপনার দায়িত্ব'
    : 'YOUR CITY. YOUR RESPONSIBILITY.';

  const isActive = (key) => {
    if (key === 'home') {
      return location.pathname === '/' && !location.hash;
    }

    return location.pathname === '/' && location.hash === `#${key}`;
  };

  const activeText =
    'bg-gradient-to-r from-[#DFFF80] via-[#C8E875] to-[#FFAA55] bg-clip-text text-transparent';

  const desktopLinkCls = (active) =>
    `relative whitespace-nowrap px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
      active
        ? `${activeText} after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[#DFFF80] after:to-[#FF9D45]`
        : 'text-[#D2E3D1] hover:text-[#DFFF80]'
    }`;

  const mobileLinkCls = (active) =>
    `block rounded-xl px-3 py-3 text-sm font-semibold transition ${
      active
        ? `${activeText} border border-lime-300/15 bg-white/[0.03]`
        : 'text-white/80 hover:bg-white/5 hover:text-lime-100'
    }`;

  const itemCls =
    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-lime-300/10 hover:text-lime-200';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDrop(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setMenu(false);
    setDrop(false);
  }, [location.pathname, location.hash]);

  const handleLogout = async () => {
    setDrop(false);
    setMenu(false);
    await logout();
    navigate('/');
  };

  return (
  <header
  className={`sticky top-0 z-[100] isolate w-full border-b border-[#A8E65B]/20 transition-colors duration-300 ${
    scrolled
      ? 'bg-[#102C20] shadow-[0_8px_30px_rgba(5,20,12,0.45)]'
      : 'bg-[#143626] shadow-[0_4px_18px_rgba(5,20,12,0.25)]'
  }`}
>
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 lg:py-4"
        aria-label="Main navigation"
      >
        {/* NagarBondhu brand */}
        <Link
          to="/"
          aria-label={brandName}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E2FF8C] to-[#A4D94D] text-[#173D26] shadow-lg shadow-lime-400/20 transition group-hover:rotate-[-6deg] sm:h-11 sm:w-11">
            <Leaf size={25} strokeWidth={2.5} />
          </span>

          <span className="flex flex-col leading-none">
            <span
              className={`bg-gradient-to-r from-[#DFFF80] via-[#C8E875] to-[#FFAA55] bg-clip-text font-black tracking-tight text-transparent ${
                isBangla
                  ? 'text-[19px] sm:text-[22px]'
                  : 'text-lg sm:text-xl'
              }`}
            >
              {brandName}
            </span>

            <span className="mt-1 text-[9px] font-semibold tracking-[0.12em] text-[#B8D5B5] sm:text-[10px]">
              {tagline}
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 xl:flex">
          {LINKS.map((key) => {
            const active = isActive(key);

            return (
              <li key={key}>
                <Link
                  to={hrefFor(key)}
                  aria-current={active ? 'page' : undefined}
                  className={desktopLinkCls(active)}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right-side controls */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/report"
            className={`hidden items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition-all duration-200 hover:-translate-y-0.5 sm:inline-flex sm:px-4 sm:text-sm ${
              location.pathname === '/report'
                ? 'bg-gradient-to-r from-[#DFFF80] to-[#FFAA55] text-[#173A25] shadow-lg shadow-lime-500/15'
                : 'bg-gradient-to-r from-[#DFFF80] to-[#A8E65B] text-[#173A25] shadow-lg shadow-lime-500/15 hover:shadow-lime-400/30'
            }`}
          >
            <Megaphone size={16} />
            {t('nav.report')}
            <ArrowUpRight size={15} />
          </Link>

          <div className="rounded-xl border border-white/10 bg-white/5 px-1">
            <LangSwitch />
          </div>

          {/* Authentication */}
          {!user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-lime-200"
              >
                {t('nav.login')}
              </Link>

              <Link
                to="/signup"
                className="rounded-xl border border-lime-200/30 bg-lime-300/10 px-4 py-2.5 text-sm font-bold text-lime-100 transition hover:border-lime-200 hover:bg-lime-300/20"
              >
                {t('nav.signup')}
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropRef}>
              <button
                type="button"
                onClick={() => setDrop((value) => !value)}
                aria-expanded={drop}
                aria-haspopup="menu"
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition sm:pr-3 ${
                  drop
                    ? 'border-lime-300/60 bg-lime-300/10'
                    : 'border-white/15 bg-white/5 hover:border-lime-300/40 hover:bg-white/10'
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#DFFF80] to-[#A8E65B] text-sm font-extrabold text-[#173A25]">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </span>

                <span className="hidden max-w-[100px] truncate text-sm font-semibold text-white sm:block">
                  {user.name}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-lime-100/70 transition-transform ${
                    drop ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {drop && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-3 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-lime-200/15 bg-[#173B2A] p-2 shadow-2xl shadow-black/40"
                  >
                    <div className="border-b border-white/10 px-3 py-3">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="mt-1 text-xs capitalize text-lime-100/60">
                        {t(`roles.${user.role}`)}
                      </p>
                    </div>

                    <div className="space-y-1 py-2">
                      <Link
                        role="menuitem"
                        to="/profile"
                        onClick={() => setDrop(false)}
                        className={itemCls}
                      >
                        <User size={17} />
                        {t('nav.profile')}
                      </Link>

                      {dash && (
                        <Link
                          role="menuitem"
                          to={dash}
                          onClick={() => setDrop(false)}
                          className={itemCls}
                        >
                          <LayoutDashboard size={17} />
                          {t(`nav.${user.role}Dashboard`)}
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <button
                        role="menuitem"
                        type="button"
                        onClick={handleLogout}
                        className={`${itemCls} text-red-200 hover:bg-red-400/10 hover:text-red-100`}
                      >
                        <LogOut size={17} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200 xl:hidden"
            onClick={() => setMenu((value) => !value)}
            aria-label={t('nav.menu')}
            aria-expanded={menu}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* Responsive mobile and tablet menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-lime-200/10 bg-gradient-to-b from-[#173B2A] to-[#102C20] xl:hidden"
          >
            <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-100/45">
                {isBangla ? 'নগরবন্ধু অন্বেষণ করুন' : 'Explore NagarBondhu'}
              </p>

              <ul className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3">
                {LINKS.map((key) => {
                  const active = isActive(key);

                  return (
                    <li key={key}>
                      <Link
                        to={hrefFor(key)}
                        onClick={() => setMenu(false)}
                        aria-current={active ? 'page' : undefined}
                        className={mobileLinkCls(active)}
                      >
                        {t(`nav.${key}`)}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/report"
                onClick={() => setMenu(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DFFF80] to-[#A8E65B] px-4 py-3 font-extrabold text-[#173A25] shadow-lg shadow-lime-500/10 transition hover:brightness-105"
              >
                <Megaphone size={17} />
                {t('nav.report')}
                <ArrowUpRight size={16} />
              </Link>

              {!user ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenu(false)}
                    className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
                  >
                    {t('nav.login')}
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMenu(false)}
                    className="rounded-xl border border-lime-200/30 bg-lime-300/10 px-4 py-3 text-center text-sm font-bold text-lime-100 hover:bg-lime-300/20"
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#DFFF80] to-[#A8E65B] font-bold text-[#173A25]">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs capitalize text-lime-100/50">
                        {t(`roles.${user.role}`)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenu(false)}
                      className={itemCls}
                    >
                      <User size={17} />
                      {t('nav.profile')}
                    </Link>

                    {dash && (
                      <Link
                        to={dash}
                        onClick={() => setMenu(false)}
                        className={itemCls}
                      >
                        <LayoutDashboard size={17} />
                        {t(`nav.${user.role}Dashboard`)}
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`${itemCls} text-red-200`}
                    >
                      <LogOut size={17} />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
