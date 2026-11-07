import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Lock,
  MapPin,
  Megaphone,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createReport } from '../services/wasteReportService';
import { AREAS, CATEGORIES } from '../utils/constants';
import { compressImage } from '../utils/format';
 
const EMPTY = { title: '', category: 'overflow', area: 'Dhaka', location: '', description: '', image: null };
 
/* ---------- UI tokens (look only) ---------- */
const labelCls = 'mb-2 block text-sm font-semibold text-[#1F3D2A]';
const inputCls =
  'w-full rounded-xl bg-[#EEF5F0] px-4 py-3 text-[15px] text-[#1F3D2A] placeholder:text-[#1F3D2A]/45 ' +
  'transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B4A] ' +
  'disabled:cursor-not-allowed disabled:opacity-60';
const btnSolid =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F3D2A] px-6 py-3.5 text-sm font-semibold text-white ' +
  'shadow-md shadow-[#1F3D2A]/20 transition hover:bg-[#2F6B4A] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B4A] focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1F3D2A]';
const btnSoft =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#EEF5F0] px-6 py-3.5 text-sm font-semibold text-[#1F3D2A] ' +
  'transition hover:bg-[#DDEBE1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B4A]';
 
// Anyone can SEE this page. Only logged-in users can SUBMIT (inputs + button are disabled otherwise).
export default function ReportProblem() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const locked = !user;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
 
  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('report.badImage');
    setError('');
    setF({ ...f, image: await compressImage(file) });
  };
 
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error: err } = await createReport(f, user);
    setBusy(false);
    if (err) setError(err.message); else { setDone(true); setF(EMPTY); }
  };
 
  /* ---------- Thank-you screen ---------- */
  if (done) {
    return (
      <section className="bg-gradient-to-br from-mint1 via-mint2 to-cream px-4 py-20 text-center sm:py-24">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#1F3D2A]/10">
          <div className="h-2 bg-gradient-to-r from-[#1F3D2A] via-[#2F6B4A] to-[#DFFF80]" />
          <div className="p-8 sm:p-10">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F5EA] text-[#2F6B4A]">
              <CheckCircle2 size={44} strokeWidth={2} />
            </span>
            <h1 className="mt-6 font-display text-4xl uppercase text-[#1F3D2A]">{t('report.thanks')}</h1>
            <p className="mt-3 text-[#1F3D2A]/70">{t('report.thanksDesc')}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/profile" className={btnSolid}>{t('report.track')}</Link>
              <button type="button" className={btnSoft} onClick={() => setDone(false)}>
                {t('report.another')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
 
  /* ---------- Form ---------- */
  return (
    <section className="bg-gradient-to-br from-mint1 via-mint2 to-cream px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#1F3D2A]/10">
        {/* Coloured header band */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#1F3D2A] via-[#25503A] to-[#2F6B4A] px-6 py-10 text-white sm:px-10 sm:py-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#DFFF80]/15" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-[#E9A34B]/20" />
          <div className="relative flex items-start gap-4 sm:gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DFFF80] text-[#1F3D2A]">
              <Megaphone size={24} strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{t('report.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{t('report.desc')}</p>
            </div>
          </div>
        </header>
 
        <div className="space-y-6 p-6 sm:p-10">
          {/* Login notice */}
          {locked && (
            <div
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#FFF3DC] p-4 text-[#6B4300] sm:p-5"
              role="alert"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9A34B] text-white">
                <Lock size={18} strokeWidth={2.5} />
              </span>
              <p className="min-w-[10rem] flex-1 text-sm font-medium leading-snug">{t('report.loginRequired')}</p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  state={{ from: '/report' }}
                  className="rounded-lg bg-[#1F3D2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2F6B4A]"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6B4300] transition hover:bg-[#E9A34B]/20"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          )}
 
          <form onSubmit={submit} className="space-y-6">
            <fieldset disabled={locked || busy} className="min-w-0 space-y-6">
              {/* Title */}
              <div>
                <label className={labelCls} htmlFor="title">{t('report.fTitle')}</label>
                <input
                  id="title"
                  className={inputCls}
                  required
                  value={f.title}
                  onChange={set('title')}
                  placeholder={t('report.fTitlePh')}
                />
              </div>
 
              {/* Category */}
              <div>
                <span className={labelCls} id="cat-label">{t('report.fCategory')}</span>
                <div role="group" aria-labelledby="cat-label" className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const on = f.category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setF({ ...f, category: c })}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          on
                            ? 'bg-[#1F3D2A] text-white shadow-md shadow-[#1F3D2A]/20'
                            : 'bg-[#EEF5F0] text-[#1F3D2A] hover:bg-[#DDEBE1]'
                        }`}
                      >
                        {t(`report.cat.${c}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
 
              {/* Area + location */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="area">{t('report.fArea')}</label>
                  <div className="relative">
                    <select
                      id="area"
                      className={`${inputCls} appearance-none pr-10`}
                      value={f.area}
                      onChange={set('area')}
                    >
                      {AREAS.map((a) => <option key={a} value={a}>{t(`areas.${a}`)}</option>)}
                    </select>
                    <ChevronDown
                      aria-hidden
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F6B4A]"
                    />
                  </div>
                </div>
 
                <div>
                  <label className={labelCls} htmlFor="loc">{t('report.fLocation')}</label>
                  <div className="relative">
                    <MapPin
                      aria-hidden
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E9A34B]"
                    />
                    <input
                      id="loc"
                      className={`${inputCls} pl-11`}
                      required
                      value={f.location}
                      onChange={set('location')}
                      placeholder={t('report.fLocationPh')}
                    />
                  </div>
                </div>
              </div>
 
              {/* Description + photo side by side on wider screens */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="desc">{t('report.fDesc')}</label>
                  <textarea
                    id="desc"
                    rows={7}
                    className={`${inputCls} resize-y`}
                    required
                    value={f.description}
                    onChange={set('description')}
                    placeholder={t('report.fDescPh')}
                  />
                </div>
 
                <div className="flex flex-col">
                  <span className={labelCls}>{t('report.fPhoto')}</span>
                  {f.image ? (
                    <div className="relative inline-block self-start">
                      <img
                        src={f.image}
                        alt={t('report.photoAlt')}
                        className="h-44 rounded-xl object-cover shadow-md shadow-[#1F3D2A]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setF({ ...f, image: null })}
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1F3D2A] shadow-md transition hover:bg-[#E9A34B] hover:text-white"
                        aria-label={t('report.removePhoto')}
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-[#EEF5F0] px-4 py-8 text-center text-sm font-semibold text-[#1F3D2A] transition ${
                        locked
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:bg-[#DDEBE1]'
                      }`}
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#2F6B4A] shadow-sm">
                        <ImagePlus size={26} strokeWidth={2} />
                      </span>
                      {t('report.upload')}
                      <input type="file" accept="image/*" className="sr-only" onChange={pickImage} />
                    </label>
                  )}
                </div>
              </div>
            </fieldset>
 
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {t(error)}
              </p>
            )}
 
            <button className={`${btnSolid} w-full text-base`} disabled={locked || busy}>
              {busy ? t('common.wait') : t('report.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
 