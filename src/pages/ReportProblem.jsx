import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ImagePlus, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createReport } from '../services/wasteReportService';
import { AREAS, CATEGORIES } from '../utils/constants';
import { compressImage } from '../utils/format';

const EMPTY = { title: '', category: 'overflow', area: 'Dhaka', location: '', description: '', image: null };

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

  if (done) {
    return (
      <section className="bg-mint2 px-4 py-24 text-center">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 shadow-xl">
          <CheckCircle2 className="mx-auto text-teal" size={60} />
          <h1 className="mt-4 font-display text-4xl uppercase text-forest">{t('report.thanks')}</h1>
          <p className="mt-2 text-ink/70">{t('report.thanksDesc')}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/profile" className="btn btn-primary">{t('report.track')}</Link>
            <button className="btn btn-outline" onClick={() => setDone(false)}>{t('report.another')}</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-mint1 via-mint2 to-cream px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="section-title">{t('report.title')}</h1>
        <p className="mt-3 text-ink/70">{t('report.desc')}</p>

        {locked && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-forest p-4 text-white" role="alert">
            <Lock className="text-lime" size={20} />
            <p className="flex-1 text-sm">{t('report.loginRequired')}</p>
            <Link to="/login" state={{ from: '/report' }} className="btn btn-lime btn-sm">{t('nav.login')}</Link>
            <Link to="/signup" className="btn btn-sm border border-white/40 text-white">{t('nav.signup')}</Link>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <fieldset disabled={locked || busy} className="space-y-5">
            <div><label className="label" htmlFor="title">{t('report.fTitle')}</label><input id="title" className="input" required value={f.title} onChange={set('title')} placeholder={t('report.fTitlePh')} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="cat">{t('report.fCategory')}</label>
                <select id="cat" className="input" value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t(`report.cat.${c}`)}</option>)}</select></div>
              <div><label className="label" htmlFor="area">{t('report.fArea')}</label>
                <select id="area" className="input" value={f.area} onChange={set('area')}>{AREAS.map((a) => <option key={a} value={a}>{t(`areas.${a}`)}</option>)}</select></div>
            </div>
            <div><label className="label" htmlFor="loc">{t('report.fLocation')}</label><input id="loc" className="input" required value={f.location} onChange={set('location')} placeholder={t('report.fLocationPh')} /></div>
            <div><label className="label" htmlFor="desc">{t('report.fDesc')}</label><textarea id="desc" rows={4} className="input" required value={f.description} onChange={set('description')} placeholder={t('report.fDescPh')} /></div>

            <div>
              <span className="label">{t('report.fPhoto')}</span>
              {f.image ? (
                <div className="relative inline-block">
                  <img src={f.image} alt={t('report.photoAlt')} className="h-40 rounded-2xl object-cover" />
                  <button type="button" onClick={() => setF({ ...f, image: null })} className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white" aria-label={t('report.removePhoto')}><X size={16} /></button>
                </div>
              ) : (
                <label className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand/50 bg-cream px-4 py-8 text-sm font-semibold text-clay ${locked ? 'opacity-50' : 'hover:bg-brand/5'}`}>
                  <ImagePlus size={28} />{t('report.upload')}
                  <input type="file" accept="image/*" className="sr-only" onChange={pickImage} />
                </label>
              )}
            </div>
          </fieldset>
          {error && <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">{t(error)}</p>}
          <button className="btn btn-primary w-full" disabled={locked || busy}>{busy ? t('common.wait') : t('report.submit')}</button>
        </form>
      </div>
    </section>
  );
}
