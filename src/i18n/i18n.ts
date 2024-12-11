// src/i18n/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import koTranslation from './locales/ko.json';

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ko: {
        translation: koTranslation,
      },
    },
    lng: 'ko', // Default language
    fallbackLng: 'ko', // Fallback language
    interpolation: {
      escapeValue: false, // React handles escaping
    },
  });

export default i18n;
