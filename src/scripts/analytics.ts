import { track } from '@/lib/analytics';
import { contact } from '@/data/site';

function trackLink(event: MouseEvent) {
  if (event.type === 'auxclick' && event.button !== 1) return;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
  if (!link) return;
  let url: URL;
  try { url = new URL(link.href); } catch { return; }
  if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) track('click_whatsapp');
  else if (url.hostname === 'calendly.com' || url.hostname.endsWith('.calendly.com') || (contact.calendlyUrl && url.href === contact.calendlyUrl)) track('click_calendly');
}

document.addEventListener('click', trackLink);
document.addEventListener('auxclick', trackLink);
