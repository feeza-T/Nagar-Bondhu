import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, User, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/constants';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';

export default function Login() {
  const { t } = useTranslation();
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // After login: go back where the user came from, otherwise to their dashboard / home
  const goNext = (user) => navigate(location.state?.from || dashboardPath(user.role) || '/', { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { data, error: err } = await login(form);
    setBusy(false);
    if (err) setError(err.message); else goNext(data);
  };
  const demo = async (role) => { const { data } = await loginAsDemo(role); goNext(data); };

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSub')}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="email">{t('auth.email')}</label><input id="email" type="email" className="input" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="password">{t('auth.password')}</label><PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        {error && <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">{t(error)}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? t('common.wait') : t('auth.loginBtn')}</button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink/50"><span className="h-px flex-1 bg-ink/15" />{t('auth.or')}<span className="h-px flex-1 bg-ink/15" /></div>
      <div className="grid grid-cols-2 gap-3">
        {['Google', 'Facebook'].map((n) => <button key={n} type="button" className="btn btn-outline" onClick={() => alert(t('auth.socialSoon'))}>{n}</button>)}
      </div>

      {/* Demo role picker: lets you test all three roles without a backend */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-brand/50 bg-white p-4">
        <p className="text-sm font-bold text-clay">{t('auth.demoTitle')}</p>
        <p className="mb-3 text-xs text-ink/60">{t('auth.demoHint')}</p>
        <div className="grid grid-cols-3 gap-2">
          {[['citizen', User], ['worker', Wrench], ['admin', Shield]].map(([r, Icon]) => (
            <button key={r} type="button" onClick={() => demo(r)} className="btn btn-dark btn-sm flex-col gap-1 py-3"><Icon size={18} />{t(`roles.${r}`)}</button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm">{t('auth.noAccount')} <Link to="/signup" className="font-bold text-olive underline">{t('nav.signup')}</Link></p>
      <p className="mt-3 text-center text-xs text-ink/50">{t('auth.terms')}</p>
    </AuthShell>
  );
}
