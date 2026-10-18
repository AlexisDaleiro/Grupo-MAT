import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { handleContact } from '@/lib/contact-handler';
import { securityHeaders } from '@/lib/security-headers';

export const prerender = false;

export const POST: APIRoute = ({ request }) => handleContact(request, {
  development: import.meta.env.DEV,
  getSecrets: () => ({
    apiKey: getSecret('RESEND_API_KEY'),
    to: getSecret('CONTACT_TO_EMAIL'),
    from: getSecret('CONTACT_FROM_EMAIL'),
  }),
});

export const ALL: APIRoute = () => new Response(JSON.stringify({ ok: false }), {
  status: 405, headers: { ...securityHeaders, Allow: 'POST', 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
