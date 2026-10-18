export type Language = 'es' | 'en';
export const languageEvent = 'site:language';
export function currentLanguage(): Language {
  return typeof document !== 'undefined' && document.documentElement.dataset.language === 'en' ? 'en' : 'es';
}
