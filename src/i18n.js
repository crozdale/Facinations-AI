import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import it from "./locales/it.json";

const supported = ["en", "fr", "es", "de", "it"];

const detectLanguage = () => {
  const saved = localStorage.getItem("lang");
  if (saved && supported.includes(saved)) return saved;

  const browser = navigator.language?.split("-")[0];
  return supported.includes(browser) ? browser : "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      it: { translation: it }
    },
    lng: detectLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export const setLanguage = (lang) => {
  if (supported.includes(lang)) {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }
};

export const t = i18n.t.bind(i18n);

export default i18n;
