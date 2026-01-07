import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import thTranslations from '../locales/th.json';

const resources = {
  en: {
    translation: enTranslations
  },
  th: {
    translation: thTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'th', // 👈 บังคับให้เริ่มต้นด้วยภาษาไทยเสมอ
    fallbackLng: 'th', // 👈 ถ้าหาภาษาไม่เจอ ให้ใช้ 'th'
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;