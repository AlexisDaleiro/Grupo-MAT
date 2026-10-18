export function track(event: 'generate_lead' | 'click_whatsapp' | 'click_calendly') {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', event, {});
  } catch { /* La medición no debe interrumpir la navegación ni el formulario. */ }
}
