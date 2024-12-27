import translations from '../../assets/translations';

export function getTranslation(lang: string, key: string): string {
  try {
    return translations[lang][key];
  } catch {
    return translations.en[key];
  }
}
