import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import footerArt from '../../assets/footer.png';
 
const EXPLORE = [
  ['nav.impact', '/#impact'],
  ['nav.features', '/#features'],
  ['nav.how', '/#how'],
  ['nav.projects', '/#projects'],
];
 
const INVOLVED = [
  ['nav.report', '/report'],
  ['nav.signup', '/signup'],
  ['nav.login', '/login'],
];
 
const pill =
  'inline-block rounded-full border-2 border-[#DFFF80] bg-[#DFFF80] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1F3D2A]';
 
function LinkList({ links, t }) {
  return (
    <ul className="mt-5 flex flex-col items-center gap-2.5">
      {links.map(([k, to]) => (
        <li key={k}>
          <Link
            to={to}
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#FBF6E9]/85 transition-colors hover:text-[#DFFF80]"
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-[#E9A34B] transition-transform group-hover:scale-150"
            />
            {t(k)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
 
export default function Footer() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
 
  return (
    <footer className="relative bg-[#1F3D2A] text-[#FBF6E9]">
      {/* Wavy top edge: overlaps the footer by 2px so no seam line shows */}
      <svg
        aria-hidden
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[calc(100%-2px)] block h-5 w-full text-[#1F3D2A] sm:h-6"
      >
        <path
          fill="currentColor"
          d="M0 25 V12 Q 50 0, 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12 V25 Z"
        />
      </svg>
 
      {/* Background glows and dots (clipped so nothing overflows the page) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#DFFF80]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#E9A34B]/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.95) 1.4px, transparent 1.4px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>
 
      <div className="relative mx-auto grid max-w-5xl gap-10 px-4 pb-12 pt-14 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 md:pt-20">
        {/* Middle: cartoon image (first on mobile, centre on desktop) */}
        <div className="order-first flex justify-center md:order-none">
          <div className="relative -mt-4 md:-mt-12">
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-2 top-10 rounded-full bg-[#DFFF80]/25 blur-2xl"
            />
            <motion.img
              src={footerArt}
              alt=""
              draggable={false}
              className="relative w-44 select-none object-contain drop-shadow-[0_8px_0_rgba(0,0,0,0.18)] sm:w-56 md:w-64 lg:w-72"
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
 
        {/* Left side */}
        <div className="text-center md:order-first">
          <h2
            className="text-4xl font-black leading-none tracking-tight text-[#DFFF80] sm:text-5xl"
            style={{ textShadow: '3px 3px 0 #0C2619' }}
          >
            {t('footer.brand', { defaultValue: 'NagarBondhu' })}
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-[#FBF6E9]/70">
            {t('footer.about')}
          </p>
          <div className="mt-7">
            <span className={pill}>{t('footer.explore')}</span>
            <LinkList links={EXPLORE} t={t} />
          </div>
        </div>
 
        {/* Right side */}
        <div className="text-center">
          <span className={pill}>{t('footer.getInvolved')}</span>
          <LinkList links={INVOLVED} t={t} />
        </div>
      </div>
 
      <p className="relative border-t border-white/15 bg-[#0C2619] py-5 text-center text-xs text-[#FBF6E9]/60">
        {t('footer.rights')}
      </p>
    </footer>
  );
}
 