import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Check,
  Megaphone,
  Sparkles,
  Star,
  Truck,
  Users,
  Leaf,
  Recycle,
} from 'lucide-react';
import Reveal from '../common/Reveal';

const CARDS = [
  {
    key: 'citizen',
    Icon: Megaphone,
    to: '/report',
    accent: '#E9A34B',
    soft: 'from-[#FFF6E6] to-[#FBE6C6]',
    iconBg: 'bg-[#F4D8AD]',
    iconColor: 'text-[#A96627]',
    tilt: '-rotate-1',
  },
  {
    key: 'community',
    Icon: Users,
    to: '/signup',
    featured: true,
    accent: '#DFFF80',
  },
  {
    key: 'city',
    Icon: Truck,
    to: '/login',
    accent: '#4DB6A0',
    soft: 'from-[#EAF8F2] to-[#CDEBDF]',
    iconBg: 'bg-[#C9E8DB]',
    iconColor: 'text-[#2F6F5A]',
    tilt: 'rotate-1',
  },
];

/* ---------- Motion ---------- */

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 70, scale: 0.92, rotate: -3 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 14,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

const riseVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 170, damping: 16 },
  },
};

const popVariants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

/* ---------- Card ---------- */

function ServiceCard({ card, t }) {
  const { key, Icon, to, featured, accent, soft, iconBg, iconColor, tilt } = card;

  if (featured) {
    return (
      <motion.div variants={cardVariants} className="relative md:scale-105">
        <motion.div
          whileHover={{ y: -10, rotate: -0.6 }}
          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
          className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-[#0F2E20] p-8 text-white md:py-12"
          style={{
            background:
              'linear-gradient(155deg,#1B4A31 0%,#0F2E20 60%,#123B28 100%)',
            boxShadow: '10px 10px 0 0 #DFFF80, 0 30px 60px rgba(15,46,32,0.35)',
          }}
        >
          {/* glow + dots */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#DFFF80]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#4DB6A0]/25 blur-3xl" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(223,255,128,0.9) 1.2px, transparent 1.2px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Most popular badge */}
          <motion.div
            animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border-2 border-[#0F2E20] bg-[#DFFF80] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#1F3D2A] shadow-[3px_3px_0_0_#0F2E20]"
          >
            <Star size={12} fill="currentColor" />
            {t('services.popular', { defaultValue: 'Most popular' })}
          </motion.div>

          <div className="relative">
            <motion.span
              variants={riseVariants}
              whileHover={{ rotate: [0, -12, 12, -8, 0] }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#DFFF80]/60 bg-lime text-ink shadow-[0_0_0_6px_rgba(223,255,128,0.15)]"
            >
              <Icon size={30} strokeWidth={2.2} />
            </motion.span>

            <motion.h3
              variants={riseVariants}
              className="mt-6 font-display text-3xl uppercase leading-tight sm:text-4xl"
            >
              {t(`services.${key}.title`)}
            </motion.h3>

            <motion.p
              variants={riseVariants}
              className="mt-3 text-sm leading-7 text-white/75"
            >
              {t(`services.${key}.desc`)}
            </motion.p>

            <ul className="mt-6 space-y-3 text-sm">
              {[1, 2, 3].map((n) => (
                <motion.li
                  key={n}
                  variants={popVariants}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  <span className="text-white/90">{t(`services.${key}.p${n}`)}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={riseVariants}>
              <Link
                to={to}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#0F2E20] bg-[#DFFF80] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#1F3D2A] shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] active:translate-y-0.5 active:shadow-none"
              >
                {t(`services.${key}.cta`)}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} className="relative">
      <motion.div
        whileHover={{ y: -10, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className={`relative overflow-hidden rounded-[2rem] border-[3px] border-[#0F2E20] bg-gradient-to-br ${soft} p-8 ${tilt}`}
        style={{ boxShadow: `8px 8px 0 0 ${accent}` }}
      >
        {/* Tape */}
        <div
          aria-hidden
          className="absolute -top-0 left-1/2 h-5 w-20 -translate-x-1/2 rounded-b-md bg-white/70 shadow-sm"
        />

        {/* Colour blob behind icon */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
          style={{ backgroundColor: accent }}
        />

        {/* Corner blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 opacity-30"
          style={{
            background: accent,
            borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%',
          }}
        />

        <div className="relative">
          <motion.span
            variants={riseVariants}
            whileHover={{ rotate: [0, -12, 12, -8, 0] }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#0F2E20]/80 ${iconBg} ${iconColor}`}
          >
            <Icon size={26} strokeWidth={2.2} />
          </motion.span>

          <motion.h3
            variants={riseVariants}
            className="mt-5 font-display text-3xl uppercase leading-tight text-[#1F3D2A]"
          >
            {t(`services.${key}.title`)}
          </motion.h3>

          <motion.p
            variants={riseVariants}
            className="mt-3 text-sm leading-7 text-[#4F6150]"
          >
            {t(`services.${key}.desc`)}
          </motion.p>

          <ul className="mt-5 space-y-3 text-sm">
            {[1, 2, 3].map((n) => (
              <motion.li
                key={n}
                variants={popVariants}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#0F2E20]/70 text-[#0F2E20]"
                  style={{ backgroundColor: accent }}
                >
                  <Check size={11} strokeWidth={3.5} />
                </span>
                <span className="text-[#2F4535]">{t(`services.${key}.p${n}`)}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={riseVariants}>
            <Link
              to={to}
              className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#0F2E20] bg-[#1F3D2A] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_0_rgba(15,46,32,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(15,46,32,0.35)] active:translate-y-0.5 active:shadow-none"
            >
              {t(`services.${key}.cta`)}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Section ---------- */

export default function Services() {
  const { t } = useTranslation();

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-mint2 to-cream py-20 sm:py-24"
    >
      {/* Background decor */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#DFFF80]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#4DB6A0]/20 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(31,61,42,0.18) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        aria-hidden
        animate={{ y: [0, -16, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[5%] top-24 hidden text-[#1F3D2A]/25 sm:block"
      >
        <Recycle size={44} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, 14, 0], rotate: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[6%] top-36 hidden text-[#E9A34B]/60 sm:block"
      >
        <Sparkles size={36} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -12, 0], rotate: [0, 16, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-20 left-[7%] hidden text-[#4DB6A0]/50 md:block"
      >
        <Leaf size={42} />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#0F2E20]/80 bg-[#DFFF80] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#1F3D2A] shadow-[3px_3px_0_0_#0F2E20]">
              <Sparkles size={14} />
              {t('services.eyebrow', { defaultValue: 'Who is it for?' })}
            </span>

            <h2 className="section-title">{t('services.title')}</h2>

            {/* Hand-drawn squiggle */}
            <svg
              aria-hidden
              viewBox="0 0 200 14"
              className="mx-auto mt-3 h-3 w-40 text-[#E9A34B]"
              fill="none"
            >
              <motion.path
                d="M2 7 Q 14 0, 26 7 T 50 7 T 74 7 T 98 7 T 122 7 T 146 7 T 170 7 T 198 7"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
              />
            </svg>
          </div>
        </Reveal>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid items-center gap-10 md:grid-cols-3 md:gap-8"
        >
          {CARDS.map((card) => (
            <ServiceCard key={card.key} card={card} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}