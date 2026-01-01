import en from "./en.json";
import fr from "./fr.json";

const languages = { en, fr };

let currentLang = "en";

export function t(key) {
  return key.split(".").reduce((o, i) => o?.[i], languages[currentLang]) || key;
}

export function setLanguage(lang) {
  if (languages[lang]) currentLang = lang;
}
