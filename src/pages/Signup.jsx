import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/constants';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';

export default function Signup() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return setError('auth.mismatch');
    setBusy(true); setError('');
    const { data, error: err } = await register(f);
    setBusy(false);
    if (err) setError(err.message); else navigate(dashboardPath(data.role) || '/', { replace: true });
  };

  return (
    <AuthShell title={t('auth.signupTitle')} subtitle={t('auth.signupSub')}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="name">{t('auth.name')}</label><input id="name" className="input" required value={f.name} onChange={set('name')} autoComplete="name" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="email">{t('auth.email')}</label><input id="email" type="email" className="input" required value={f.email} onChange={set('email')} autoComplete="email" /></div>
          <div><label className="label" htmlFor="phone">{t('auth.phone')}</label><input id="phone" type="tel" className="input" required value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="password">{t('auth.password')}</label><PasswordInput id="password" autoComplete="new-password" value={f.password} onChange={set('password')} /></div>
          <div><label className="label" htmlFor="confirm">{t('auth.confirm')}</label><PasswordInput id="confirm" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></div>
        </div>
        <fieldset>
          <legend className="label">{t('auth.iAm')}</legend>
          <div className="grid grid-cols-2 gap-3">
            {['citizen', 'worker'].map((r) => (
              <label key={r} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-sm font-bold transition ${f.role === r ? 'border-brand bg-brand/10 text-clay' : 'border-ink/15 bg-white'}`}>
                <input type="radio" name="role" value={r} checked={f.role === r} onChange={set('role')} className="sr-only" />{t(`roles.${r}`)}
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">{t(error)}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? t('common.wait') : t('auth.signupBtn')}</button>
      </form>
      <p className="mt-6 text-center text-sm">{t('auth.haveAccount')} <Link to="/login" className="font-bold text-olive underline">{t('nav.login')}</Link></p>
      <p className="mt-3 text-center text-xs text-ink/50">{t('auth.terms')}</p>
    </AuthShell>
  );
}
