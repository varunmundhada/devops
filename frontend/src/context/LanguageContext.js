import React, { createContext, useState, useEffect } from 'react';
import en from '../languages/en.json';
import hi from '../languages/hi.json';
import te from '../languages/te.json';

const resources = { en, hi, te };

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k
});

export const LanguageProvider = ({ children }) => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const [language, setLanguageState] = useState(saved || 'en');

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  const setLanguage = (lng) => {
    if (resources[lng]) setLanguageState(lng);
  };

  const t = (key) => {
    if (!key) return '';
    const parts = key.split('.');
    const res = resources[language] || resources.en;
    let cur = res;
    for (let p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        cur = null;
        break;
      }
    }
    if (cur === null || cur === undefined) {
      // fallback to english
      const enRes = resources.en;
      let ecur = enRes;
      for (let p of parts) {
        if (ecur && Object.prototype.hasOwnProperty.call(ecur, p)) {
          ecur = ecur[p];
        } else {
          ecur = null;
          break;
        }
      }
      return ecur || key;
    }
    return cur;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
