import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en/translation.json';
import zhCNTranslations from '../locales/zh-CN/translation.json';
import zhTWTranslations from '../locales/zh-TW/translation.json';

i18n
  .use(LanguageDetector) // Detects user language from browser
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      'zh-CN': {
        translation: zhCNTranslations,
      },
      'zh-TW': {
        translation: zhTWTranslations,
      },
    },
    fallbackLng: 'en', // Default language
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      // Cache user language
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;

