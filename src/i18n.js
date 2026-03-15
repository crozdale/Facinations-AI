import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("facinations_lang") || "en",
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr", "it", "de", "ko", "zh-CN", "pt-BR", "ja"],
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
