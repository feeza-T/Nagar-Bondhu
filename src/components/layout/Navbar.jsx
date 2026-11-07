
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  User,
  X,
  ArrowUpRight,
  ClipboardList,
  Globe,
  ChevronDown,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const LINKS = ['home', 'impact', 'features', 'how', 'services', 'projects'];

const hrefFor = (key) => (key === 'home' ? '/' : `/#${key}`);

const DASHBOARD_ROUTES = {
  admin: '/admin',
  worker: '/worker',
  volunteer: '/worker',
  citizen: '/my-reports',
  user: '/my-reports',
  resident: '/my-reports',
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);

  const profileRef = useRef(null);

  const dash = user
    ? DASHBOARD_ROUTES[user.role?.toLowerCase()]
    : null;

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  const isBangla = currentLanguage?.toLowerCase().startsWith('bn');

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

  const closeMenus = () => {
    setMenu(false);
    setDrop(false);
  };

  const changeLanguage = async (language) => {
    if (currentLanguage?.toLowerCase().startsWith(language)) return;

    await i18n.changeLanguage(language);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
    navigate('/');
  };

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setDrop(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setMenu(false);
    setDrop(false);
  }, [location.pathname, location.hash]);

  // Prevent background scrolling while mobile drawer is open
  useEffect(() => {
    if (!menu) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menu]);

  // Desktop navigation: gradient active text, no active background
  const desktopLinkCls = (active) =>
    `relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[12px] font-extrabold transition-all duration-200 2xl:px-3 2xl:text-[13px] ${
      active
        ? 'bg-gradient-to-r from-[#DFFF80] via-[#C9E875] to-[#FFAA55] bg-clip-text text-transparent'
        : 'text-[#D8E6D7] hover:text-[#DFFF80]'
    }`;

  // Mobile drawer navigation
  const mobileLinkCls = (active) =>
    `flex min-h-[52px] w-full items-center rounded-xl px-4 py-3 text-[15px] transition-all duration-200 ${
      active
        ? 'bg-[#24452D] font-extrabold text-white shadow-md shadow-[#24452D]/15'
        : 'font-semibold text-[#294832] hover:bg-[#DCEBC7]'
    }`;

  // Profile dropdown links
  const profileItemCls =
    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#E0EADF] transition hover:bg-[#DFFF80]/10 hover:text-[#DFFF80]';

  // English / Bangla language switcher
  const languageSwitcher = (mobile = false) => (
    <div
      className={
        mobile
          ? 'rounded-xl border border-[#A9C18A]/50 bg-white/60 p-3'
          : 'border-t border-white/10 px-2 pt-3'
      }
    >
      <div
        className={`mb-2 flex items-center gap-2 ${
          mobile ? 'text-[#718B55]' : 'text-[#B8CDAF]'
        }`}
      >
        <Globe size={15} />

        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
          {isBangla ? 'ভাষা নির্বাচন' : 'Language'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { code: 'en', label: 'English' },
          { code: 'bn', label: 'বাংলা' },
        ].map((language) => {
          const active = currentLanguage
            ?.toLowerCase()
            .startsWith(language.code);

          return (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
              aria-pressed={active}
              className={`rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${
                mobile
                  ? active
                    ? 'bg-[#24452D] text-white'
                    : 'bg-[#E5EED8] text-[#294832] hover:bg-[#D7E6C4]'
                  : active
                    ? 'bg-[#DFFF80] text-[#173A25]'
                    : 'bg-white/[0.07] text-[#D8E6D7] hover:bg-white/[0.13]'
              }`}
            >
              {language.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Report a Problem button
  const reportButton = (
    <Link
      to="/report"
      onClick={closeMenus}
      className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#DFFF80] to-[#A8E65B] px-3 py-2.5 text-xs font-extrabold text-[#173A25] shadow-md shadow-black/10 transition hover:-translate-y-0.5 hover:brightness-105 2xl:px-4 2xl:text-sm"
    >
      <Megaphone size={16} />
      {t('nav.report')}
      <ArrowUpRight size={14} />
    </Link>
  );

  // Reusable profile image
  const profileAvatar = (size = 'h-8 w-8') => (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#DFFF80] to-[#A8E65B] text-sm font-extrabold text-[#173A25]`}
    >
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        user?.name?.[0]?.toUpperCase() || 'U'
      )}
    </span>
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`sticky top-0 z-[100] w-full border-b border-[#A8E65B]/20 transition-all duration-300 ${
          scrolled
            ? 'bg-[#102C20]/95 shadow-[0_8px_30px_rgba(5,20,12,0.4)] backdrop-blur-xl'
            : 'bg-[#143626] shadow-[0_4px_18px_rgba(5,20,12,0.22)]'
        }`}
      >
        <nav
          className="mx-auto grid w-full max-w-[1600px] grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(180px,1fr)_auto_minmax(220px,1fr)] lg:gap-4 lg:px-8 2xl:px-10"
          aria-label="Main navigation"
        >
          {/* LEFT: BRAND NAME ONLY */}
          <Link
            to="/"
            aria-label={brandName}
            onClick={closeMenus}
            className="group flex min-w-0 flex-col leading-none lg:col-start-1"
          >
            <span
              className={`w-fit bg-gradient-to-r from-[#DFFF80] via-[#C8E875] to-[#FFAA55] bg-clip-text font-black tracking-tight text-transparent transition-opacity group-hover:opacity-80 ${
                isBangla
                  ? 'text-[20px] sm:text-[23px]'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {brandName}
            </span>

            <span className="mt-1.5 truncate text-[8px] font-semibold tracking-[0.07em] text-[#C0D7BB] sm:text-[9px]">
              {tagline}
            </span>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION */}
          <ul className="hidden items-center justify-center gap-0.5 lg:col-start-2 lg:flex 2xl:gap-1.5">
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

          {/* RIGHT: DESKTOP CONTROLS */}
          <div className="flex shrink-0 items-center justify-end gap-2 lg:col-start-3 lg:gap-3">
            {/* Report button */}
            <div className="hidden lg:block">
              {reportButton}
            </div>

            {/* Login / Signup for guests */}
            {!user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-bold text-[#E0EADF] transition hover:bg-white/[0.07] hover:text-[#DFFF80] 2xl:text-sm"
                >
                  {t('nav.login')}
                </Link>

                <Link
                  to="/signup"
                  className="whitespace-nowrap rounded-xl border border-[#DFFF80]/30 bg-[#DFFF80]/10 px-3 py-2.5 text-xs font-extrabold text-[#E5F6C8] transition hover:border-[#DFFF80]/70 hover:bg-[#DFFF80]/20 2xl:px-4 2xl:text-sm"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            ) : (
              /* DESKTOP PROFILE */
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setDrop((value) => !value)}
                  aria-label={isBangla ? 'প্রোফাইল মেনু' : 'Open profile menu'}
                  aria-expanded={drop}
                  aria-haspopup="menu"
                  className={`flex min-h-10 items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition 2xl:pr-3 ${
                    drop
                      ? 'border-[#DFFF80]/60 bg-[#DFFF80]/10'
                      : 'border-white/15 bg-white/[0.05] hover:border-[#DFFF80]/40 hover:bg-white/[0.09]'
                  }`}
                >
                  {profileAvatar()}

                  <span className="hidden max-w-[85px] truncate text-xs font-bold text-[#F0F5EC] 2xl:block">
                    {user.name}
                  </span>

                  <ChevronDown size={14} className="text-[#C0D7BB]" />
                </button>

                <AnimatePresence>
                  {drop && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 mt-3 w-[min(17rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#B6CF98]/30 bg-[#173B2A] p-2 shadow-2xl shadow-black/35"
                    >
                      {/* User details */}
                      <div className="border-b border-white/10 px-3 py-3">
                        <p className="truncate text-sm font-bold text-white">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs capitalize text-[#C4DDAF]">
                          {t(`roles.${user.role}`)}
                        </p>
                      </div>

                      {/* Profile links */}
                      <div className="space-y-1 py-2">
                        <Link
                          role="menuitem"
                          to="/profile"
                          onClick={closeMenus}
                          className={profileItemCls}
                        >
                          <User size={17} />
                          {t('nav.profile')}
                        </Link>

                        <Link
                          role="menuitem"
                          to="/my-reports"
                          onClick={closeMenus}
                          className={profileItemCls}
                        >
                          <ClipboardList size={17} />
                          {isBangla
                            ? 'আমার অভিযোগ ট্র্যাক করুন'
                            : 'Track My Problem'}
                        </Link>

                        {dash && (
                          <Link
                            role="menuitem"
                            to={dash}
                            onClick={closeMenus}
                            className={profileItemCls}
                          >
                            <LayoutDashboard size={17} />
                            {t(`nav.${user.role}Dashboard`)}
                          </Link>
                        )}
                      </div>

                      {/* Language selector under profile options */}
                      {languageSwitcher(false)}

                      {/* Logout */}
                      <div className="border-t border-white/10 pt-2">
                        <button
                          role="menuitem"
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#FFC2A8] transition hover:bg-[#F58A62]/10 hover:text-[#FFD6C4]"
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

            {/* MOBILE PROFILE ICON */}
            {user && (
              <Link
                to="/profile"
                onClick={closeMenus}
                aria-label={t('nav.profile')}
                className="flex h-10 w-10 shrink-0 items-center justify-center lg:hidden"
              >
                {profileAvatar()}
              </Link>
            )}

            {/* MOBILE MENU BUTTON: ONLY BELOW LG */}
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#EAF3E5] transition hover:bg-white/10 hover:text-[#DFFF80] lg:hidden"
              onClick={() => setMenu((value) => !value)}
              aria-label={menu ? 'Close menu' : t('nav.menu')}
              aria-expanded={menu}
              aria-controls="mobile-navigation-drawer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menu ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {menu ? <X size={24} /> : <Menu size={25} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {menu && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenus}
              className="fixed inset-0 z-[110] cursor-default bg-[#07130D]/55 backdrop-blur-[2px] lg:hidden"
            />

            {/* Full-height, 75%-width drawer */}
            <motion.aside
              id="mobile-navigation-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
              }}
              className="fixed right-0 top-0 z-[120] flex h-[100dvh] w-[75vw] max-w-[390px] flex-col overflow-hidden border-l border-[#C8DDA5] bg-gradient-to-br from-[#F5F8EB] via-[#EDF3DD] to-[#E3EDCE] shadow-2xl shadow-black/30 lg:hidden"
            >
              {/* Drawer header */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-[#789653]/20 px-5 py-5">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-[#24452D]">
                    {brandName}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold tracking-wide text-[#71845E]">
                    {tagline}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenus}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCE9C8] text-[#294832] transition hover:bg-[#24452D] hover:text-white"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Drawer scrollable content */}
              <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-6">
                <p className="mb-4 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#718B55]">
                  {isBangla ? 'নেভিগেশন' : 'Navigation'}
                </p>

                {/* Navigation links */}
                <nav className="flex flex-col gap-2">
                  {LINKS.map((key, index) => {
                    const active = isActive(key);

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.04,
                          duration: 0.2,
                        }}
                      >
                        <Link
                          to={hrefFor(key)}
                          onClick={closeMenus}
                          aria-current={active ? 'page' : undefined}
                          className={mobileLinkCls(active)}
                        >
                          <span
                            className={`mr-3 w-6 text-[10px] font-extrabold ${
                              active ? 'text-[#DFFF80]' : 'text-[#82966A]'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <span>{t(`nav.${key}`)}</span>

                          {active && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-[#DFFF80]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Report CTA */}
                <div className="mt-7 border-t border-[#789653]/20 pt-6">
                  <Link
                    to="/report"
                    onClick={closeMenus}
                    className="flex min-h-12 w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#315C36] to-[#527B3D] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#315C36]/15 transition hover:brightness-105"
                  >
                    <span className="flex items-center gap-2.5">
                      <Megaphone size={17} />
                      {t('nav.report')}
                    </span>

                    <ArrowUpRight size={17} />
                  </Link>
                </div>

                {/* Account section */}
                <div className="mt-7 border-t border-[#789653]/20 pt-6">
                  {user ? (
                    <>
                      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/60 p-3">
                        {profileAvatar('h-11 w-11')}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-[#24452D]">
                            {user.name}
                          </p>

                          <p className="mt-0.5 text-xs capitalize text-[#66804C]">
                            {t(`roles.${user.role}`)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          to="/profile"
                          onClick={closeMenus}
                          className={mobileLinkCls(false)}
                        >
                          <User size={17} className="mr-3" />
                          {t('nav.profile')}
                        </Link>

                        <Link
                          to="/my-reports"
                          onClick={closeMenus}
                          className={mobileLinkCls(false)}
                        >
                          <ClipboardList size={17} className="mr-3" />
                          {isBangla
                            ? 'আমার অভিযোগ ট্র্যাক করুন'
                            : 'Track My Problem'}
                        </Link>

                        {dash && (
                          <Link
                            to={dash}
                            onClick={closeMenus}
                            className={mobileLinkCls(false)}
                          >
                            <LayoutDashboard size={17} className="mr-3" />
                            {t(`nav.${user.role}Dashboard`)}
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-[52px] w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold text-[#B65D3D] transition hover:bg-[#F7DFCF]"
                        >
                          <LogOut size={17} className="mr-3" />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="mb-3 px-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#718B55]">
                        {isBangla ? 'আপনার অ্যাকাউন্ট' : 'Your Account'}
                      </p>

                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="flex min-h-12 w-full items-center justify-center rounded-xl border border-[#A9C18A] bg-white/60 px-4 py-3 text-sm font-bold text-[#294832] transition hover:bg-white"
                      >
                        {t('nav.login')}
                      </Link>

                      <Link
                        to="/signup"
                        onClick={closeMenus}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#24452D] px-4 py-3 text-sm font-extrabold text-[#E7F5C9] shadow-md transition hover:bg-[#315C36]"
                      >
                        {t('nav.signup')}
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  )}

                  {/* Mobile language switcher */}
                  <div className="mt-5">
                    {languageSwitcher(true)}
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="shrink-0 border-t border-[#789653]/20 px-5 py-4">
                <p className="text-center text-[10px] font-semibold tracking-wide text-[#71845E]">
                  {isBangla
                    ? 'পরিচ্ছন্ন শহর গড়ি একসাথে'
                    : 'A cleaner city starts with us.'}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
