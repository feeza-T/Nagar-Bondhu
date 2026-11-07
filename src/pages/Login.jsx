import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/constants';
import PasswordInput from '../components/auth/PasswordInput';
import loginArt from '../assets/login.png';

/* form column slides in from the left, image column from the right */
const leftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const rightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const inputCls =
  'input !rounded-xl !border-slate-200 !bg-white transition focus:!border-brand focus:!ring-2 focus:!ring-brand/20';
const labelCls = 'label mb-1.5 block !text-white/90';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z" />
      <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}

export default function Login() {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const updateField = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const goNext = (user) =>
    navigate(location.state?.from || dashboardPath(user.role) || '/', {
      replace: true,
    });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const { data, error: err } = await login(form);

      if (err) {
        setError(err.message);
      } else if (data) {
        goNext(data);
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    setError('');

    const { error: err } = await loginWithGoogle();

    if (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const blobMotion = (duration, delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { rotate: [0, 12, -8, 0], scale: [1, 1.08, 0.96, 1] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        };

  return (
    <section className="grid bg-white lg:min-h-[44rem] lg:grid-cols-[1.1fr_1fr]">
      {/* ---------- Left: form ---------- */}
      <motion.div
        variants={leftVariants}
        initial="hidden"
        animate="visible"
        className="relative flex w-full items-center overflow-hidden bg-gradient-to-br from-[#0C2619] via-[#1F3D2A] to-[#2F6B4A] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
      >
        {/* soft colour glows */}
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#DFFF80]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#E9A34B]/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-7">
            <h1 className="text-3xl font-black tracking-tight text-white">
              {t('auth.loginTitle')}
            </h1>
            <p className="mt-2 text-white/70">{t('auth.loginSub')}</p>
          </motion.div>

          <form onSubmit={submit} className="space-y-4">
            <motion.div variants={itemVariants}>
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className={labelCls} htmlFor="password">
                {t('auth.password')}
              </label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={form.password}
                onChange={updateField('password')}
              />
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
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div variants={itemVariants} className="space-y-4 pt-1">
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
                    {t('auth.loginBtn')}
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

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="my-5 flex items-center gap-3 text-xs text-white/50"
          >
            <span className="h-px flex-1 bg-white/15" />
            {t('auth.or')}
            <span className="h-px flex-1 bg-white/15" />
          </motion.div>

          {/* Google */}
          <motion.button
            variants={itemVariants}
            whileHover={!busy ? { y: -2 } : {}}
            whileTap={!busy ? { scale: 0.98 } : {}}
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-white px-5 py-3.5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          {/* Signup link */}
          <motion.div
            variants={itemVariants}
            className="mt-6 rounded-2xl bg-white/10 px-4 py-4 text-center backdrop-blur-sm"
          >
            <p className="text-sm text-white/80">
              {t('auth.noAccount')}{' '}
              <Link
                to="/signup"
                className="font-extrabold text-[#DFFF80] underline decoration-[#DFFF80]/40 underline-offset-4 transition hover:text-white"
              >
                {t('nav.signup')}
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

      {/* ---------- Right: image + texts ---------- */}
      <motion.aside
        variants={rightVariants}
        initial="hidden"
        animate="visible"
        className="relative order-first flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF6D6] via-[#F3FBD6] to-[#FFE3BD] px-6 py-12 text-center sm:py-14 lg:order-last lg:px-12"
      >
        {/* flat colour shapes */}
        <motion.div
          aria-hidden
          {...blobMotion(14)}
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 bg-[#DFFF80]/70"
          style={{ borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%' }}
        />
        <motion.div
          aria-hidden
          {...blobMotion(16, 1)}
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 bg-[#FFB45E]/50"
          style={{ borderRadius: '58% 42% 45% 55% / 52% 58% 42% 48%' }}
        />
        <motion.div
          aria-hidden
          {...blobMotion(12, 2)}
          className="pointer-events-none absolute left-10 top-10 h-20 w-20 bg-[#FFE066]/80"
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
                src={loginArt}
                alt=""
                draggable={false}
                whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: -3 }}
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
            Your city is waiting for you
          </div>

          <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Welcome back.
            <br />
            <span className="text-brand">Let&apos;s keep it clean.</span>
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Log in to report issues, track clean-ups and stay connected with your neighbourhood.
          </p>
        </motion.div>
      </motion.aside>
    </section>
  );
}