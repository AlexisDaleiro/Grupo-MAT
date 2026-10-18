import { currentLanguage, languageEvent } from '@/i18n/language';
import type { Language } from '@/i18n/language';

const root = document.documentElement;
const originals = new WeakMap<Element, string>();

function applyLanguage(language: Language, announce = false) {
  root.dataset.language = language;
  root.lang = language === 'en' ? 'en' : 'es-UY';
  document.querySelectorAll<HTMLElement>('[data-language-selector]').forEach((selector) => { selector.hidden = false; });
  document.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.languageChoice === language));
  });
  for (const [selector, attribute, data] of [
    ['[data-label-en]', 'aria-label', 'data-label-en'], ['[data-alt-en]', 'alt', 'data-alt-en'],
    ['[data-content-en]', 'content', 'data-content-en'],
  ] as const) {
    document.querySelectorAll(selector).forEach((element) => {
      if (!originals.has(element)) originals.set(element, element.getAttribute(attribute) ?? '');
      element.setAttribute(attribute, language === 'en' ? element.getAttribute(data) ?? '' : originals.get(element) ?? '');
    });
  }
  const title = document.querySelector<HTMLTitleElement>('title[data-title-en]');
  if (title) {
    if (!originals.has(title)) originals.set(title, title.textContent ?? '');
    title.textContent = language === 'en' ? title.dataset.titleEn ?? '' : originals.get(title) ?? '';
  }
  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('text', language === 'en' ? 'Hi Grupo MAT, I would like to discuss a project.' : 'Hola Grupo MAT, quiero consultar por un proyecto.');
    link.href = url.href;
  });
  if (announce) {
    const status = document.querySelector('[data-language-status]');
    if (status) status.textContent = language === 'en' ? 'Language changed to English.' : 'Idioma cambiado a español.';
  }
  window.dispatchEvent(new CustomEvent(languageEvent));
}

document.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const next = button.dataset.languageChoice === 'en' ? 'en' : 'es';
    if (next === currentLanguage()) return;
    applyLanguage(next, true);
    try { localStorage.setItem('language', next); } catch { /* Funciona también sin almacenamiento. */ }
  });
});
window.addEventListener('storage', (event) => {
  if (event.key === 'language' || event.key === null) applyLanguage(event.newValue === 'en' ? 'en' : 'es');
});
applyLanguage(currentLanguage());
