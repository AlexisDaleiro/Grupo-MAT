import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { SubmitEvent, FocusEvent, ChangeEvent } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { contactOptions } from '@/data/site';
import { contactSchema, contactErrors, contactFields } from '@/lib/contact-schema';
import type { ContactErrors, ContactField, ContactFormValues } from '@/lib/contact-schema';
import { track } from '@/lib/analytics';

interface Props { whatsappUrl?: string }
type Status = 'idle' | 'sending' | 'success' | 'error';
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const initialValues: ContactFormValues = { nombre: '', empresa: '', email: '', cargo: '', servicio: '', presupuesto: '', plazo: '', mensaje: '', website: '' };
const labels: Record<ContactField, string> = { nombre: 'Nombre', empresa: 'Empresa', email: 'Email de trabajo', cargo: 'Cargo', servicio: '¿Qué necesitás?', presupuesto: 'Presupuesto estimado', plazo: '¿Para cuándo?', mensaje: 'Contanos sobre tu proyecto' };
const limits: Partial<Record<ContactField, number>> = { nombre: 80, empresa: 120, email: 160, cargo: 80, mensaje: 2000 };
const requiredFields: readonly ContactField[] = ['nombre', 'empresa', 'email', 'servicio', 'mensaje'];
const errorMessage = 'No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function responseErrors(value: unknown): ContactErrors {
  const errors: ContactErrors = {};
  if (!isRecord(value) || !isRecord(value.errors)) return errors;
  for (const field of contactFields) if (typeof value.errors[field] === 'string') errors[field] = value.errors[field];
  return errors;
}

export default function ContactForm({ whatsappUrl }: Props) {
  const id = useId();
  const reduce = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [announcement, setAnnouncement] = useState('');
  const [panelHeight, setPanelHeight] = useState(0);
  const controls = useRef<Partial<Record<ContactField, Control>>>({});
  const pending = useRef(false);
  const mounted = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const pendingFocus = useRef<ContactField | 'success' | 'error' | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => {
    mounted.current = true;
    setHydrated(true);
    return () => { mounted.current = false; abort.current?.abort(); observer.current?.disconnect(); };
  }, []);

  const measurePanel = useCallback((element: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!element || element.dataset.state === 'success') return;
    observer.current = new ResizeObserver(([entry]) => {
      if (entry) setPanelHeight(Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height));
    });
    observer.current.observe(element);
  }, []);

  function focusPending() {
    const target = pendingFocus.current;
    if (!target) return;
    const element = target === 'success' ? successRef.current : target === 'error' ? errorRef.current : controls.current[target];
    if (element) { element.focus(); pendingFocus.current = null; }
  }

  function validateField(field: ContactField, value: string) {
    const parsed = contactSchema.shape[field].safeParse(value);
    setErrors((previous) => {
      const next = { ...previous };
      if (parsed.success) delete next[field];
      else next[field] = parsed.error.issues[0]?.message ?? 'Revisá este campo.';
      return next;
    });
  }

  function change(field: ContactField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) validateField(field, value);
  }

  function fail(nextErrors: ContactErrors = {}) {
    setErrors(nextErrors);
    pendingFocus.current = contactFields.find((field) => nextErrors[field]) ?? 'error';
    setAnnouncement(errorMessage);
    setStatus('error');
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || pending.current) return;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors = contactErrors(parsed.error.issues);
      setErrors(nextErrors);
      setAnnouncement('Revisá los campos marcados antes de enviar.');
      const first = contactFields.find((field) => nextErrors[field]);
      requestAnimationFrame(() => { if (first) controls.current[first]?.focus(); });
      return;
    }
    pending.current = true;
    setErrors({});
    setStatus('sending');
    setAnnouncement('Enviando…');
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data), signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!mounted.current) return;
      if (!response.ok || !isRecord(result) || result.ok !== true) {
        fail(response.status === 400 ? responseErrors(result) : {});
        return;
      }
      if (!parsed.data.website) track('generate_lead', { servicio: parsed.data.servicio });
      pendingFocus.current = 'success';
      setAnnouncement('¡Gracias! Recibimos tu consulta. Te respondemos pronto por email.');
      setStatus('success');
    } catch { if (mounted.current) fail(); }
    finally { window.clearTimeout(timeout); pending.current = false; abort.current = null; }
  }

  function field(fieldName: ContactField) {
    const fieldId = `contact-${id}-${fieldName}`;
    const required = requiredFields.includes(fieldName);
    const attributes = {
      id: fieldId, name: fieldName, required, value: values[fieldName],
      'aria-invalid': errors[fieldName] ? true : undefined,
      'aria-describedby': `${fieldId}-error`,
      onBlur: (event: FocusEvent<Control>) => validateField(fieldName, event.currentTarget.value),
      onChange: (event: ChangeEvent<Control>) => change(fieldName, event.currentTarget.value),
      ref: (element: Control | null) => { if (element) controls.current[fieldName] = element; else delete controls.current[fieldName]; },
    };
    const options = fieldName === 'servicio' || fieldName === 'presupuesto' || fieldName === 'plazo' ? contactOptions[fieldName] : undefined;
    return (
      <div className={`contact-field${fieldName === 'mensaje' || fieldName === 'plazo' ? ' contact-field--wide' : ''}`} key={fieldName}>
        <label htmlFor={fieldId}>{labels[fieldName]}{required && <span aria-hidden="true"> *</span>}</label>
        {options ? (
          <select {...attributes}><option value="">{required ? 'Elegí una opción' : 'Opcional'}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
        ) : fieldName === 'mensaje' ? (
          <textarea {...attributes} rows={5} minLength={20} maxLength={2000} placeholder="Contanos qué vende tu empresa, cómo toman pedidos hoy y qué te gustaría resolver." />
        ) : (
          <input {...attributes} type={fieldName === 'email' ? 'email' : 'text'} maxLength={limits[fieldName]}
            minLength={fieldName === 'nombre' || fieldName === 'empresa' ? 2 : undefined}
            autoComplete={fieldName === 'nombre' ? 'name' : fieldName === 'empresa' ? 'organization' : fieldName === 'cargo' ? 'organization-title' : 'email'} />
        )}
        <div id={`${fieldId}-error`} className="contact-field-error">
          <AnimatePresence initial={false}>{errors[fieldName] && <m.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{errors[fieldName]}</m.span>}</AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'tween', duration: reduce ? 0 : 0.25, ease }}>
      <LazyMotion features={domAnimation} strict>
        <div className="contact-form-shell" data-contact-form data-status={status}>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
          <div className="contact-panel-host" style={{ minHeight: panelHeight || undefined }} inert={status === 'sending' ? true : undefined}>
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={status} ref={measurePanel} data-state={status}
                variants={{ hidden: { opacity: 0, filter: reduce ? 'none' : 'blur(4px)' }, visible: { opacity: 1, filter: 'blur(0px)' } }}
                initial="hidden" animate="visible" exit="hidden"
                onAnimationComplete={(definition) => { if (definition === 'visible') focusPending(); }}>
                {status === 'success' ? (
                  <div className="contact-success">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m7 12 3 3 7-7" /></svg>
                    <h3 ref={successRef} tabIndex={-1}>¡Gracias! Recibimos tu consulta.</h3>
                    <p>Te respondemos pronto por email.</p>
                  </div>
                ) : (
                  <form action="/api/contact" method="post" noValidate aria-label="Formulario de contacto" aria-busy={status === 'sending'} onSubmit={submit}>
                    <p className="contact-form-note">Los campos con * son obligatorios.</p>
                    <fieldset disabled={!hydrated || status === 'sending'}>
                      <legend className="sr-only">Datos de tu consulta</legend>
                      <div className="contact-fields">{contactFields.map(field)}</div>
                      <div className="contact-honeypot" aria-hidden="true"><label htmlFor={`website-${id}`}>Sitio web</label><input id={`website-${id}`} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues((previous) => ({ ...previous, website: event.target.value }))} /></div>
                      <button className="contact-submit" type="submit" disabled={!hydrated || status === 'sending'}>
                        {status === 'sending' ? <><svg className="contact-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" opacity=".25" /><path d="M12 3a9 9 0 0 1 9 9" /></svg>Enviando…</> : <>Enviar consulta<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></>}
                      </button>
                    </fieldset>
                    <p className="contact-privacy">Usamos tus datos solo para responder tu consulta. Ver <a href="/privacidad">Política de privacidad</a>.</p>
                    <div className="contact-feedback">
                      {status === 'error' && <p ref={errorRef} tabIndex={-1}>No pudimos enviar tu consulta. Probá de nuevo o {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener">escribinos por WhatsApp.</a> : 'escribinos por WhatsApp.'}</p>}
                    </div>
                  </form>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
