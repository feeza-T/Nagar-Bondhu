import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import bn from './locales/bn.json';

const saved = localStorage.getItem('nb_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, bn: { translation: bn } },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Keep <html> in sync (font switching) and remember the choice
const apply = (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.classList.toggle('bn', lng === 'bn');
  localStorage.setItem('nb_lang', lng);
};
apply(saved);
i18n.on('languageChanged', apply);

export default i18n;
