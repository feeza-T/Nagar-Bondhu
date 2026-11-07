import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  CalendarCheck,
  MapPin,
  Users,
  Languages,
  Sparkles,
  Recycle,
  Leaf,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../common/Reveal';
import reportImage from '../../assets/images/featureGrid.jpg';

const supportingFeatures = [
  {
    key: 'verify',
    icon: ShieldCheck,
    accent: '#8FCB5A',
    tilt: 'sm:-rotate-1',
    bg: 'from-[#F1F8E4] to-[#DCEAC6]',
    iconBg: 'bg-[#D5E5C4]',
    iconColor: 'text-[#55743D]',
    titleColor: 'text-[#36532C]',
    descColor: 'text-[#687D58]',
  },
  {
    key: 'campaign',
    icon: CalendarCheck,
    accent: '#F0A04B',
    tilt: 'sm:rotate-1',
    bg: 'from-[#FFF4E6] to-[#F8E1C6]',
    iconBg: 'bg-[#F5D9BB]',
    iconColor: 'text-[#B96F35]',
    titleColor: 'text-[#80502E]',
    descColor: 'text-[#99714F]',
  },
  {
    key: 'map',
    icon: MapPin,
    accent: '#4DB6A0',
    tilt: 'sm:rotate-1',
    bg: 'from-[#E8F6F0] to-[#CFE8DC]',
    iconBg: 'bg-[#C9E1D5]',
    iconColor: 'text-[#36715D]',
    titleColor: 'text-[#285746]',
    descColor: 'text-[#608273]',
  },
  {
    key: 'team',
    icon: Users,
    accent: '#D9B65C',
    tilt: 'sm:-rotate-1',
    bg: 'from-[#FAF5E4] to-[#EDE3C8]',
    iconBg: 'bg-[#E4DAC0]',
    iconColor: 'text-[#8B713F]',
    titleColor: 'text-[#68562F]',
    descColor: 'text-[#887951]',
  },
  {
    key: 'bangla',
    icon: Languages,
    accent: '#9B8FE0',
    tilt: 'sm:rotate-0',
    bg: 'from-[#F1F0FC] to-[#DEDCF4]',
    iconBg: 'bg-[#D9D8EF]',
    iconColor: 'text-[#64649B]',
    titleColor: 'text-[#4F4D83]',
    descColor: 'text-[#77759D]',
    wide: true,
  },
];

/* ---------- Motion ---------- */

const imageCardVariants = {
  hidden: { opacity: 0, x: '-60vw', rotate: -6, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 65, damping: 14 },
  },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.85, rotate: 4 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 13,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

const riseVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 170, damping: 16 },
  },
};

/* ---------- Section ---------- */

const Features = () => {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#C6D7B8] via-[#D5DFC5] to-[#E8DCC5] py-16 sm:py-20 lg:py-24"
    >
      {/* Section Background Shading */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-0 h-96 w-96 rounded-full bg-[#789B65]/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-0 h-96 w-96 rounded-full bg-[#E5A66C]/30 blur-[110px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DFFF80]/20 blur-[100px]" />

      {/* Dot pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(31,61,42,0.18) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating playful icons */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -16, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[4%] top-24 hidden text-[#1F3D2A]/25 sm:block"
      >
        <Recycle size={42} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, 14, 0], rotate: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[5%] top-32 hidden text-[#E9A34B]/60 sm:block"
      >
        <Sparkles size={36} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -12, 0], rotate: [0, 16, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-16 left-[5%] hidden text-[#4DB6A0]/50 md:block"
      >
        <Leaf size={40} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A] sm:text-sm">
              <Sparkles size={14} />
              {t('features.eyebrow', {
                defaultValue: 'What We Offer',
              })}
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#173D2A] sm:text-4xl lg:text-5xl">
              {t('features.title')}
            </h2>

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

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#536B54] sm:text-base">
              {t('features.subtitle', {
                defaultValue:
                  'Everything you need to build a cleaner, greener and more connected community.',
              })}
            </p>
          </div>
        </Reveal>

        {/* Main Features Layout */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10"
        >
          {/* Main Image Feature */}
          <motion.div variants={imageCardVariants} className="h-full">
            <motion.div
              className="relative flex h-full min-h-[480px] flex-col overflow-hidden rounded-[32px] border-[3px] border-[#1F3D2A] bg-gradient-to-br from-[#F0F7E6] via-[#E4EFDC] to-[#D3E6C6] p-4 sm:min-h-[540px] sm:p-6 lg:p-7"
              style={{ boxShadow: '10px 10px 0 0 #E9A34B' }}
            >
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#DFFF80]/60 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#8FCB5A]/40 blur-2xl" />

              {/* Photo frame */}
              <div className="relative z-10 flex-1">
                <img
                  src={reportImage}
                  alt="Community reporting a local waste issue"
                  className="h-full min-h-[260px] w-full rounded-[22px] border-[3px] border-[#1F3D2A] object-cover sm:min-h-[320px]"
                />

                {/* Sticker on photo */}
                <motion.div
                  animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -right-2 -top-3 flex items-center gap-1.5 rounded-full border-2 border-[#1F3D2A] bg-[#DFFF80] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#1F3D2A] shadow-[3px_3px_0_0_#1F3D2A]"
                >
                  <Sparkles size={12} />
                  Real impact
                </motion.div>
              </div>

              {/* Tape */}
              <div
                aria-hidden
                className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-b-md bg-white/80 shadow-sm"
              />

              {/* Main Feature Text */}
              <div className="relative z-10 px-1 pb-1 pt-6 sm:pt-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-[#1F3D2A]/70 bg-[#D5E5CB] px-3 py-1.5 text-xs font-bold text-[#45663A]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#E89B48]" />
                  {t('features.eyebrow', {
                    defaultValue: 'COMMUNITY ACTION',
                  })}
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-[#214B32] sm:text-3xl">
                  {t('features.report.title')}
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-7 text-[#60775C] sm:text-base">
                  {t('features.report.desc')}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Supporting Features */}
          <motion.div
            variants={gridVariants}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7"
          >
            {supportingFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.key}
                  variants={tileVariants}
                  className={feature.wide ? 'sm:col-span-2' : ''}
                >
                  <motion.div
                    className={`
                      group relative flex h-full min-h-[175px] flex-col justify-between
                      overflow-hidden rounded-[26px] border-[3px] border-[#1F3D2A]
                      bg-gradient-to-br ${feature.bg}
                      p-5 sm:min-h-[205px] sm:p-6 ${feature.tilt}
                      ${
                        feature.wide
                          ? 'sm:min-h-[145px] sm:flex-row sm:items-center sm:gap-6'
                          : ''
                      }
                    `}
                    style={{ boxShadow: `6px 6px 0 0 ${feature.accent}` }}
                  >
                    {/* Decorative blobs */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
                      style={{ backgroundColor: feature.accent }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 opacity-30"
                      style={{
                        background: feature.accent,
                        borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%',
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      variants={riseVariants}
                      className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1F3D2A]/70 ${feature.iconBg} sm:h-14 sm:w-14`}
                    >
                      <Icon
                        size={25}
                        strokeWidth={2.2}
                        className={feature.iconColor}
                      />
                    </motion.div>

                    {/* Text */}
                    <div
                      className={`relative mt-5 ${
                        feature.wide ? 'sm:mt-0 sm:flex-1' : 'sm:mt-6'
                      }`}
                    >
                      <motion.h3
                        variants={riseVariants}
                        className={`text-lg font-extrabold ${feature.titleColor} sm:text-xl`}
                      >
                        {t(`features.${feature.key}.title`)}
                      </motion.h3>

                      <motion.p
                        variants={riseVariants}
                        className={`mt-2 text-sm leading-6 ${feature.descColor}`}
                      >
                        {t(`features.${feature.key}.desc`)}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;