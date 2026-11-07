import { useTranslation } from 'react-i18next';
import {
  Camera,
  ShieldCheck,
  CalendarCheck,
  HandHeart,
  PartyPopper,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Reveal from '../common/Reveal';

import reportCharacter from '../../assets/workingflow/1 .png';
import confirmCharacter from '../../assets/workingflow/2 .png';
import campaignCharacter from '../../assets/workingflow/3 .png';
import volunteerCharacter from '../../assets/workingflow/4 .png';
import cleanCharacter from '../../assets/workingflow/5 .png';

const STEPS = [
  {
    key: 'report',
    Icon: Camera,
    image: reportCharacter,
    number: '01',
    label: 'SPOT THE PROBLEM',
    accent: '#D98B3E',
    iconBg: '#F4D9B7',
    iconColor: '#A96627',
    titleColor: '#294B32',
    descColor: '#63745C',
  },
  {
    key: 'confirm',
    Icon: ShieldCheck,
    image: confirmCharacter,
    number: '02',
    label: 'GET IT VERIFIED',
    accent: '#8DAF58',
    iconBg: '#DCE9C4',
    iconColor: '#55743D',
    titleColor: '#294B32',
    descColor: '#63745C',
  },
  {
    key: 'campaign',
    Icon: CalendarCheck,
    image: campaignCharacter,
    number: '03',
    label: 'PLAN THE ACTION',
    accent: '#D98B58',
    iconBg: '#F6DCC8',
    iconColor: '#B96F35',
    titleColor: '#60432F',
    descColor: '#806C59',
  },
  {
    key: 'join',
    Icon: HandHeart,
    image: volunteerCharacter,
    number: '04',
    label: 'JOIN THE TEAM',
    accent: '#659B7C',
    iconBg: '#D0E5D5',
    iconColor: '#36715D',
    titleColor: '#294B3B',
    descColor: '#60796C',
  },
  {
    key: 'clean',
    Icon: PartyPopper,
    image: cleanCharacter,
    number: '05',
    label: 'ENJOY THE CHANGE',
    accent: '#A59A54',
    iconBg: '#E9E1C1',
    iconColor: '#81703E',
    titleColor: '#4C502F',
    descColor: '#72734F',
  },
];

// Each step changes the background of the ENTIRE section.
const STEP_BACKGROUNDS = [
  'radial-gradient(ellipse at 15% 20%, rgba(222,238,192,0.95), transparent 48%), radial-gradient(ellipse at 85% 75%, rgba(247,211,174,0.65), transparent 45%), linear-gradient(125deg, #F4EEDC 0%, #E6EED9 50%, #DCEACF 100%)',

  'radial-gradient(ellipse at 80% 15%, rgba(197,221,155,0.85), transparent 48%), radial-gradient(ellipse at 15% 80%, rgba(226,239,205,0.9), transparent 48%), linear-gradient(135deg, #E9F0D9 0%, #DCEACB 48%, #D5E8D2 100%)',

  'radial-gradient(ellipse at 15% 15%, rgba(246,213,181,0.9), transparent 48%), radial-gradient(ellipse at 90% 80%, rgba(224,235,188,0.8), transparent 48%), linear-gradient(125deg, #F8E9DB 0%, #F1E9D2 50%, #E8EBD2 100%)',

  'radial-gradient(ellipse at 85% 20%, rgba(184,219,188,0.9), transparent 48%), radial-gradient(ellipse at 10% 80%, rgba(222,238,183,0.85), transparent 48%), linear-gradient(135deg, #DFEEE2 0%, #D3E9D9 48%, #E5EECF 100%)',

  'radial-gradient(ellipse at 15% 20%, rgba(219,235,164,0.9), transparent 48%), radial-gradient(ellipse at 90% 85%, rgba(244,217,174,0.75), transparent 48%), linear-gradient(125deg, #EFF0D5 0%, #E1EAC7 50%, #F0E5CB 100%)',
];

function WorkflowStep({ step, index, t, setActiveStep }) {
  const reverse = index % 2 !== 0;
  const Icon = step.Icon;

  const imageVariants = {
    hidden: {
      opacity: 0,
      x: reverse ? 85 : -85,
      y: 35,
      scale: 0.82,
      rotate: reverse ? 7 : -7,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 65,
        damping: 16,
        mass: 0.9,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: reverse ? -65 : 65,
      y: 25,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 75,
        damping: 18,
        delay: 0.12,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: false,
        amount: 0.3,
        margin: '-50px 0px -50px 0px',
      }}
      onViewportEnter={() => setActiveStep(index)}
      className="relative"
    >
      {/* Timeline Number */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 250,
              damping: 16,
            },
          },
        }}
        className="absolute left-0 top-8 z-20 flex h-10 w-10 items-center justify-center rounded-full border-[4px] border-[#F2EEDC] text-xs font-black text-[#294B32] shadow-md md:left-1/2 md:-translate-x-1/2"
        style={{ backgroundColor: step.accent }}
      >
        {index + 1}
      </motion.div>

      <div className="grid min-h-[300px] grid-cols-1 items-center gap-1 pl-14 sm:gap-5 md:grid-cols-2 md:gap-12 md:pl-0">

        {/* Character Illustration */}
        <motion.div
          variants={imageVariants}
          className={`relative flex min-h-[220px] items-center justify-center sm:min-h-[270px] md:min-h-[350px] ${
            reverse ? 'md:order-2' : 'md:order-1'
          }`}
        >
          {/* Decorative background shapes */}
          <div
            className="pointer-events-none absolute h-44 w-44 rounded-full opacity-60 blur-3xl sm:h-64 sm:w-64"
            style={{ backgroundColor: `${step.accent}35` }}
          />

          <motion.img
            src={step.image}
            alt={`${t(`how.${step.key}.title`)} illustration`}
            className="relative z-10 h-[220px] w-full max-w-[280px] object-contain sm:h-[280px] sm:max-w-[350px] md:h-[340px] md:max-w-[400px]"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="absolute bottom-1 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/60 px-4 py-2 text-[10px] font-extrabold tracking-[0.16em] shadow-sm sm:bottom-3"
            style={{
              backgroundColor: step.iconBg,
              color: step.iconColor,
            }}
          >
            {step.label}
          </motion.div>
        </motion.div>

        {/* Text — sticker card */}
        <motion.div
          variants={textVariants}
          className={`relative ${reverse ? 'md:order-1' : 'md:order-2'}`}
        >
          <div
            className={`group relative overflow-hidden rounded-[32px] border-[3px] border-[#1F3D2A] p-6 transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 sm:p-8 ${
              reverse ? 'md:-rotate-1' : 'md:rotate-1'
            }`}
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.92), ${step.iconBg}CC)`,
              boxShadow: `8px 8px 0 0 ${step.accent}`,
            }}
          >
            {/* Tape piece */}
            <div
              aria-hidden
              className="absolute -top-3 left-8 h-6 w-20 -rotate-3 rounded-sm bg-white/80 shadow-sm"
            />

            {/* Decorative accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
              style={{ backgroundColor: step.accent }}
            />

            {/* Giant faded number */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 right-4 select-none text-[8rem] font-black leading-none tracking-tighter opacity-[0.09]"
              style={{ color: step.titleColor }}
            >
              {step.number}
            </span>

          <div className="relative">
            {/* Step label */}
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                style={{ backgroundColor: step.iconBg }}
              >
                <Icon
                  size={25}
                  strokeWidth={2}
                  style={{ color: step.iconColor }}
                />
              </div>

              <span className="rounded-full border border-[#54734A]/15 bg-white/35 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#52713D]">
                Step {step.number}
              </span>
            </div>

            {/* Title */}
            <h3
              className="max-w-md text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[42px]"
              style={{ color: step.titleColor }}
            >
              {t(`how.${step.key}.title`)}
            </h3>

            {/* Description */}
            <p
              className="mt-5 max-w-md text-sm leading-8 sm:text-base"
              style={{ color: step.descColor }}
            >
              {t(`how.${step.key}.desc`)}
            </p>

            {/* Decorative accent */}
            <div className="mt-7 flex items-center gap-2">
              <span
                className="h-1.5 w-12 rounded-full"
                style={{ backgroundColor: step.accent }}
              />
              <span
                className="h-1.5 w-3 rounded-full opacity-50"
                style={{ backgroundColor: step.accent }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full opacity-30"
                style={{ backgroundColor: step.accent }}
              />
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how"
      className="relative isolate overflow-hidden py-20 text-[#294B32] transition-colors duration-700 sm:py-24 lg:py-28"
    >
      {/* Dynamic full-section background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#E9EEDB]" />

      <AnimatePresence initial={false}>
        <motion.div
          key={activeStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: STEP_BACKGROUNDS[activeStep],
          }}
        />
      </AnimatePresence>

      {/* Subtle decorative shapes */}
      <div className="pointer-events-none absolute -left-32 top-[15%] -z-0 h-72 w-72 rounded-full bg-white/20 blur-[90px]" />
      <div className="pointer-events-none absolute -right-32 bottom-[10%] -z-0 h-80 w-80 rounded-full bg-[#DFFF80]/20 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#54734A]/15 bg-white/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#52713D] shadow-sm">
              <Sparkles size={14} />
              The NagarBondhu Journey
            </span>

            <h2 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-wide text-[#214B32] sm:text-5xl lg:text-6xl">
              {t('how.title')}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64745E] sm:text-base">
              A small action can make a big difference. See how our community
              turns local waste problems into cleaner neighborhoods.
            </p>

            <div className="mx-auto mt-7 flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-[#71865B]">
              <span>SCROLL TO EXPLORE</span>
              <ArrowDown size={15} className="animate-bounce" />
            </div>
          </div>
        </Reveal>

        {/* Workflow Timeline */}
        <div className="relative">

          {/* Timeline Track */}
          <div className="absolute bottom-8 left-5 top-8 w-[3px] -translate-x-1/2 rounded-full bg-[#52734A]/20 md:left-1/2" />

          {/* Animated progress line */}
          <div className="absolute bottom-8 left-5 top-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D98B3E] via-[#9DBD68] to-[#659B7C] opacity-70 md:left-1/2" />

          <div className="space-y-10 sm:space-y-14 md:space-y-12">
            {STEPS.map((step, index) => (
              <WorkflowStep
                key={step.key}
                step={step}
                index={index}
                t={t}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* Ending Message */}
        <Reveal>
          <div className="mt-20 text-center sm:mt-24">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/40 text-[#57763F] shadow-sm">
              <Sparkles size={26} />
            </div>

            <p className="text-xl font-extrabold text-[#294B32] sm:text-2xl">
              A cleaner city starts with us.
            </p>

            <p className="mt-2 text-sm text-[#71816A]">
              One report. One team. One cleaner neighborhood.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}