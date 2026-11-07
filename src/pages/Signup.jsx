import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  UserRound,
  HardHat,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
 
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/constants';
import PasswordInput from '../components/auth/PasswordInput';
import signupArt from '../assets/signup.png';
 
const leftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.12 },
  },
};
 
const rightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1, delayChildren: 0.15 },
  },
};
 
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};
 
const inputCls =
  'input !rounded-xl !border-slate-200 !bg-white transition focus:!border-brand focus:!ring-2 focus:!ring-brand/20';
const labelCls = 'label mb-1.5 block !text-white/90';
 
function StepTitle({ n, tone, children }) {
  const tones = {
    lime: 'bg-[#DFFF80] text-[#1F3D2A]',
    orange: 'bg-[#FFE0B8] text-[#8A4B00]',
    green: 'bg-[#CFEFD9] text-[#1F5A3A]',
  };
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${tones[tone]}`}>
        {n}
      </span>
      <h3 className="text-sm font-extrabold text-white">{children}</h3>
    </div>
  );
}
 
export default function Signup() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
 
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    role: 'citizen',
  });
 
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
 
  const updateField = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };
 
  const submit = async (event) => {
    event.preventDefault();
    setError(null);
 
    if (form.password !== form.confirm) {
      setError({ key: 'auth.mismatch' });
      return;
    }
 
    setBusy(true);
 
    try {
      const { data, error: registerError } = await register(form);
 
      if (registerError) {
        setError({ message: registerError.message });
        return;
      }
 
      if (data) {
        navigate(dashboardPath(data.role) || '/', {
          replace: true,
        });
      }
    } catch (err) {
      setError({
        message: err?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };
 
  const roles = [
    {
      value: 'citizen',
      icon: UserRound,
      title: t('roles.citizen'),
      description: 'Report problems and help improve your neighbourhood.',
    },
    {
      value: 'worker',
      icon: HardHat,
      title: t('roles.worker'),
      description: 'Join local clean-up activities and make a difference.',
    },
  ];
 
  const blobMotion = (duration, delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { rotate: [0, 12, -8, 0], scale: [1, 1.08, 0.96, 1] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        };
 
  return (
    <section className="grid bg-white lg:min-h-[44rem] lg:grid-cols-[1fr_1.1fr]">
      {/* ---------- Left: image + texts ---------- */}
      <motion.aside
        variants={leftVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF6D6] via-[#F3FBD6] to-[#FFE3BD] px-6 py-12 text-center sm:py-14 lg:px-12"
      >
        {/* flat colour shapes (no dots, no dark green) */}
        <motion.div
          aria-hidden
          {...blobMotion(14)}
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 bg-[#DFFF80]/70"
          style={{ borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%' }}
        />
        <motion.div
          aria-hidden
          {...blobMotion(16, 1)}
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 bg-[#FFB45E]/50"
          style={{ borderRadius: '58% 42% 45% 55% / 52% 58% 42% 48%' }}
        />
        <motion.div
          aria-hidden
          {...blobMotion(12, 2)}
          className="pointer-events-none absolute right-10 top-10 h-20 w-20 bg-[#FFE066]/80"
          style={{ borderRadius: '50% 50% 40% 60% / 55% 45% 55% 45%' }}
        />
 
        {/* image */}
        <motion.div variants={itemVariants} className="relative">
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-2 top-10 rounded-full bg-white/60 blur-2xl"
          />
 
          {[
            { cls: '-left-4 top-8', size: 18, delay: 0, color: 'text-[#E9A34B]' },
            { cls: 'right-0 top-2', size: 22, delay: 0.7, color: 'text-[#9BCB2B]' },
            { cls: '-right-4 bottom-12', size: 16, delay: 1.3, color: 'text-[#E9A34B]' },
          ].map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className={`absolute ${s.cls} ${s.color}`}
              animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.7, 1.2, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
            >
              <Sparkles size={s.size} />
            </motion.span>
          ))}
 
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.25 }}
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.img
                key={form.role}
                src={signupArt}
                alt=""
                draggable={false}
                initial={reduceMotion ? false : { scale: 0.88, rotate: -6 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 260, damping: 10 }}
                className="relative w-56 select-none object-contain drop-shadow-[0_10px_0_rgba(0,0,0,0.10)] sm:w-64 lg:w-80"
              />
            </motion.div>
          </motion.div>
        </motion.div>
 
        {/* texts */}
        <motion.div variants={itemVariants} className="relative mt-8 max-w-md">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
            <Sparkles size={13} className="text-brand" />
            A better city starts with us
          </div>
 
          <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Small actions.
            <br />
            <span className="text-brand">Cleaner neighbourhoods.</span>
          </h3>
 
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Be part of a community that cares about its surroundings.
          </p>
        </motion.div>
      </motion.aside>
 
      {/* ---------- Right: form ---------- */}
      <motion.div
        variants={rightVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full overflow-hidden bg-gradient-to-br from-[#0C2619] via-[#1F3D2A] to-[#2F6B4A] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
      >
        {/* soft colour glows */}
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#DFFF80]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#E9A34B]/20 blur-3xl" />
 
        <div className="relative mx-auto w-full max-w-xl">
          <motion.div variants={itemVariants} className="mb-7">
            <h1 className="text-3xl font-black tracking-tight text-white">
              {t('auth.signupTitle')}
            </h1>
            <p className="mt-2 text-white/70">{t('auth.signupSub')}</p>
          </motion.div>
 
          <form onSubmit={submit} className="space-y-6">
            {/* Personal information */}
            <motion.div variants={itemVariants}>
              <StepTitle n="01" tone="lime">Your information</StepTitle>
 
              <div className="space-y-3">
                <div>
                  <label className={labelCls} htmlFor="name">
                    {t('auth.name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={inputCls}
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="Your full name"
                  />
                </div>
 
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="email">
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={inputCls}
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={updateField('email')}
                      placeholder="you@example.com"
                    />
                  </div>
 
                  <div>
                    <label className={labelCls} htmlFor="phone">
                      {t('auth.phone')}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={inputCls}
                      required
                      autoComplete="tel"
                      value={form.phone}
                      onChange={updateField('phone')}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
 
            {/* Passwords */}
            <motion.div variants={itemVariants}>
              <StepTitle n="02" tone="orange">Secure your account</StepTitle>
 
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="password">
                    {t('auth.password')}
                  </label>
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={updateField('password')}
                  />
                </div>
 
                <div>
                  <label className={labelCls} htmlFor="confirm">
                    {t('auth.confirm')}
                  </label>
                  <PasswordInput
                    id="confirm"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={updateField('confirm')}
                  />
                </div>
              </div>
            </motion.div>
 
            {/* Role selection */}
            <motion.div variants={itemVariants}>
              <StepTitle n="03" tone="green">Choose your role</StepTitle>
 
              <fieldset>
                <legend className="sr-only">{t('auth.iAm')}</legend>
 
                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const selected = form.role === role.value;
 
                    return (
                      <motion.label
                        key={role.value}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors duration-200 ${
                          selected
                            ? 'border-brand bg-[#FFF3DC] shadow-md shadow-brand/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selected}
                          onChange={updateField('role')}
                          className="sr-only"
                        />
 
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            selected
                              ? 'bg-brand text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon size={21} />
                        </span>
 
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold text-slate-900">
                            {role.title}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                            {role.description}
                          </span>
                        </span>
 
                        {selected && (
                          <motion.span
                            layoutId="selected-role"
                            className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-brand/20"
                          />
                        )}
                      </motion.label>
                    );
                  })}
                </div>
              </fieldset>
            </motion.div>
 
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error.key ? t(error.key) : error.message}
                </motion.p>
              )}
            </AnimatePresence>
 
            {/* Submit */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.button
                whileHover={!busy ? { y: -2 } : {}}
                whileTap={!busy ? { scale: 0.98 } : {}}
                type="submit"
                disabled={busy}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t('common.wait')}
                  </>
                ) : (
                  <>
                    {t('auth.signupBtn')}
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
 
              <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                <ShieldCheck size={15} className="text-[#DFFF80]" />
                Your account information is protected.
              </div>
            </motion.div>
          </form>
 
          {/* Login link */}
          <motion.div
            variants={itemVariants}
            className="mt-6 rounded-2xl bg-white/10 px-4 py-4 text-center backdrop-blur-sm"
          >
            <p className="text-sm text-white/80">
              {t('auth.haveAccount')}{' '}
              <Link
                to="/login"
                className="font-extrabold text-[#DFFF80] underline decoration-[#DFFF80]/40 underline-offset-4 transition hover:text-white"
              >
                {t('nav.login')}
              </Link>
            </p>
          </motion.div>
 
          <motion.p
            variants={itemVariants}
            className="mt-4 text-center text-xs leading-relaxed text-white/50"
          >
            {t('auth.terms')}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
 