
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/constants';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';

export default function Login() {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const goNext = (user) =>
    navigate(
      location.state?.from || dashboardPath(user.role) || '/',
      { replace: true }
    );

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const { data, error: err } = await login(form);

    setBusy(false);

    if (err) {
      setError(err.message);
    } else if (data) {
      goNext(data);
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

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSub')}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            className="input"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            {t('auth.password')}
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? t('common.wait') : t('auth.loginBtn')}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink/50">
        <span className="h-px flex-1 bg-ink/15" />
        {t('auth.or')}
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={handleGoogleLogin}
        disabled={busy}
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="font-bold text-olive underline">
          {t('nav.signup')}
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-ink/50">
        {t('auth.terms')}
      </p>
    </AuthShell>
  );
}
