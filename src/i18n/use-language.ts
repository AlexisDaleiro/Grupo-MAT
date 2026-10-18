import { useSyncExternalStore } from 'react';
import { currentLanguage, languageEvent } from './language';
import type { Language } from './language';

function subscribe(sync: () => void) {
  window.addEventListener(languageEvent, sync);
  return () => window.removeEventListener(languageEvent, sync);
}

const serverLanguage = (): Language => 'es';

export function useLanguage(): Language {
  // Conserva el HTML de hidratación y sincroniza las islas con el estado externo.
  return useSyncExternalStore(subscribe, currentLanguage, serverLanguage);
}
