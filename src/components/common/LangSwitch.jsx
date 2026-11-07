import { useTranslation } from 'react-i18next';

// EN | বাং toggle. The choice is saved in localStorage by i18n.js
export default function LangSwitch({ dark = false }) {
  const { i18n } = useTranslation();
  const btn = (lng, label) => (
    <button type="button" onClick={async () => {
  await i18n.changeLanguage(lng);

  console.log({
    currentLanguage: i18n.language,
    resolvedLanguage: i18n.resolvedLanguage,
    loginTranslation: i18n.t('auth.loginTitle'),
    banglaDictionary: i18n.getResourceBundle('bn', 'translation')?.auth?.loginTitle,
  });
}} aria-pressed={i18n.language === lng}
      className={`rounded-full px-3 py-1 text-xs font-bold transition ${i18n.language === lng ? 'bg-brand text-white' : dark ? 'text-white/80 hover:text-white' : 'text-ink/70 hover:text-ink'}`}>
      {label}
    </button>
  );
  return <div className={`flex items-center rounded-full border p-0.5 ${dark ? 'border-white/30' : 'border-ink/15'}`}>{btn('en', 'EN')}{btn('bn', 'বাং')}</div>;
}
