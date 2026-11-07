
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Recycle,
  Trash2,
  Leaf,
  Sparkles,
} from 'lucide-react';

import LangSwitch from '../common/LangSwitch';
import Logo from '../common/Logo';

export default function AuthShell({ title, subtitle, children }) {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8f5] text-slate-900 lg:grid lg:grid-cols-[0.9fr_1.1fr]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />

      {/* Left visual panel */}
      <motion.aside
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
        className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#111827] p-10 text-white lg:flex xl:p-14"
      >
        {/* Background decorations */}
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 top-32 h-56 w-56 rounded-full border border-lime-300/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative z-10">
          <Logo light />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-xs font-bold text-lime-300"
          >
            <Sparkles size={15} />
            A community-powered movement
          </motion.div>

          <h2 className="font-display text-5xl font-black uppercase leading-[1.08] tracking-tight xl:text-7xl">
            {t('auth.panelTitle')}
          </h2>

          <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
            {t('auth.panelDesc')}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Recycle size={19} className="text-lime-300" />
              <span className="text-sm font-semibold text-slate-200">
                Community action
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Leaf size={19} className="text-indigo-300" />
              <span className="text-sm font-semibold text-slate-200">
                Cleaner neighbourhoods
              </span>
            </div>
          </div>
        </div>

        {/* Floating illustration */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-12 flex h-36 w-36 items-center justify-center rounded-[36px] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 xl:right-20 xl:h-44 xl:w-44"
        >
          <div className="absolute inset-3 rounded-[28px] border border-lime-300/10" />
          <Trash2
            size={76}
            strokeWidth={1.2}
            className="text-lime-300"
          />
          <span className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg">
            <Leaf size={22} />
          </span>
        </motion.div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-slate-400">
          <span className="h-2 w-2 rounded-full bg-lime-400" />
          {t('hero.chip')}
        </div>
      </motion.aside>

      {/* Form area */}
      <main className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-10 xl:px-14">
        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            {t('auth.back')}
          </Link>

          <LangSwitch />
        </div>

        {/* Mobile visual */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl bg-[#111827] p-5 text-white lg:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-lime-300">
                <Sparkles size={14} />
                NagarBondhu
              </div>

              <p className="max-w-[230px] text-lg font-black leading-snug">
                {t('auth.panelTitle')}
              </p>
            </div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300"
            >
              <Recycle size={36} />
            </motion.div>
          </div>

          <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-300">
            {t('auth.panelDesc')}
          </p>
        </motion.div>

        {/* Main content */}
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-xs font-bold text-lime-800">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              NagarBondhu Community
            </div>

            <h1 className="font-display text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">
              {title}
            </h1>

            <p className="mb-7 mt-2 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
              {subtitle}
            </p>

            {children}
          </motion.div>
        </div>

        <p className="pb-2 text-center text-xs text-slate-400">
          NagarBondhu · Building cleaner communities together
        </p>
      </main>
    </div>
  );
}
