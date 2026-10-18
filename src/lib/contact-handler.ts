import { z } from 'zod';
import { contactSchema, contactErrors } from '@/lib/contact-schema';
import type { ContactData } from '@/lib/contact-schema';

export interface ContactRuntime {
  development: boolean;
  getSecrets: () => { apiKey?: string; to?: string; from?: string };
  send?: typeof fetch;
  logger?: Pick<Console, 'info' | 'error'>;
}

const maxBytes = 10 * 1024;
const fallbackFrom = 'Grupo MAT <onboarding@resend.dev>';
const labels = {
  nombre: 'Nombre', empresa: 'Empresa', email: 'Email de trabajo', cargo: 'Cargo',
  servicio: 'Servicio', presupuesto: 'Presupuesto estimado', plazo: 'Plazo', mensaje: 'Mensaje',
} as const;

function reply(status: number, body: object, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...headers,
  } });
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/gu, (character) => entities[character] ?? character);
}

function emailContent(data: ContactData) {
  const entries = Object.entries(labels).map(([key, label]) => [label, data[key as keyof typeof labels] || 'Sin especificar']);
  return {
    text: entries.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
    html: `<h1>Nueva consulta</h1><dl>${entries.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd style="white-space:pre-wrap">${escapeHtml(value)}</dd>`).join('')}</dl>`,
  };
}

export async function handleContact(request: Request, runtime: ContactRuntime): Promise<Response> {
  if (request.method !== 'POST') return reply(405, { ok: false }, { Allow: 'POST' });
  if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') return reply(415, { ok: false });
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== new URL(request.url).origin) return reply(403, { ok: false });
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return reply(413, { ok: false });

  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { ok: false, errors: {} });
    const decoder = new TextDecoder('utf-8', { fatal: true });
    let bytes = 0;
    let body = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > maxBytes) { try { await reader.cancel(); } catch { /* El límite ya se superó. */ } return reply(413, { ok: false }); }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
    } finally { reader.releaseLock(); }
    raw = JSON.parse(body) as unknown;
  } catch { return reply(400, { ok: false, errors: {} }); }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return reply(400, { ok: false, errors: contactErrors(parsed.error.issues) });
  const data = parsed.data;
  if (data.website.length > 0) return reply(200, { ok: true });

  const logger = runtime.logger ?? console;
  let secrets: ReturnType<ContactRuntime['getSecrets']>;
  try { secrets = runtime.getSecrets(); }
  catch { logger.error('[contacto] No se pudo leer la configuración del servidor.'); return reply(500, { ok: false }); }
  const apiKey = secrets.apiKey?.trim();
  if (!apiKey) {
    if (runtime.development) {
      logger.info('[contacto:desarrollo] Consulta validada (sin envío):', data);
      return reply(200, { ok: true });
    }
    logger.error('[contacto] Falta RESEND_API_KEY en producción.');
    return reply(500, { ok: false });
  }
  const to = secrets.to?.trim();
  if (!to || !z.email().safeParse(to).success) {
    logger.error('[contacto] Falta un CONTACT_TO_EMAIL válido.');
    return reply(500, { ok: false });
  }

  try {
    const response = await (runtime.send ?? fetch)('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: secrets.from?.trim() || fallbackFrom, to: [to], reply_to: data.email,
        subject: `Nuevo lead: ${data.empresa.replace(/[\r\n]/gu, ' ')} · ${data.servicio}`,
        ...emailContent(data),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      logger.error(`[contacto] Resend rechazó el envío (HTTP ${response.status}).`);
      return reply(502, { ok: false });
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) throw new Error('Respuesta inválida');
    return reply(200, { ok: true });
  } catch {
    logger.error('[contacto] No se pudo completar el envío con Resend.');
    return reply(502, { ok: false });
  }
}
