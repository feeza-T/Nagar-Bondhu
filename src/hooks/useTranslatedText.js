
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../utils/translateText';

export default function useTranslatedText(originalText) {
  const { i18n } = useTranslation();

  const targetLanguage = (
    i18n.resolvedLanguage || i18n.language || 'en'
  ).split('-')[0];

  const [translatedText, setTranslatedText] = useState(
    originalText ?? ''
  );

  useEffect(() => {
    let cancelled = false;

    if (!originalText) {
      setTranslatedText('');
      return;
    }

    // Show original text while the translation is loading.
    setTranslatedText(originalText);

    async function loadTranslation() {
      const result = await translateText(
        originalText,
        targetLanguage
      );

      if (!cancelled) {
        setTranslatedText(result);
      }
    }

    loadTranslation();

    return () => {
      cancelled = true;
    };
  }, [originalText, targetLanguage]);

  return translatedText;
}
