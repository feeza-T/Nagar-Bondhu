import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PasswordInput({ id, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} className="input pr-12" value={value} onChange={onChange} autoComplete={autoComplete} required minLength={6} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink" aria-label={show ? t('auth.hide') : t('auth.show')}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
