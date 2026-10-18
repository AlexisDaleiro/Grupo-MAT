import type { ContactService } from '@/lib/contact-schema';

export function track(event: 'generate_lead', params: { servicio: ContactService }): void;
export function track(event: 'click_whatsapp' | 'click_calendly'): void;
export function track(event: 'generate_lead' | 'click_whatsapp' | 'click_calendly', params?: { servicio: ContactService }) {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', event, event === 'generate_lead' && params ? { servicio: params.servicio } : {});
  } catch { /* La medición no debe interrumpir la navegación ni el formulario. */ }
}
