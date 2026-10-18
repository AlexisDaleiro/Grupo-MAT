import { z } from 'zod';
import { contactOptions } from '@/data/site';

export const contactFields = ['nombre', 'empresa', 'email', 'plazo'] as const;
export type ContactField = typeof contactFields[number];
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactFormValues = Record<ContactField | 'website', string>;

export const contactSchema = z.object({
  nombre: z.string({ error: 'Ingresá tu nombre.' }).trim().min(2, 'Usá entre 2 y 80 caracteres.').max(80, 'Usá entre 2 y 80 caracteres.'),
  empresa: z.string({ error: 'Ingresá el nombre de tu empresa.' }).trim().min(2, 'Usá entre 2 y 120 caracteres.').max(120, 'Usá entre 2 y 120 caracteres.'),
  email: z.string({ error: 'Ingresá un email válido.' }).trim().max(160, 'Usá hasta 160 caracteres.').pipe(z.email({ error: 'Ingresá un email válido.' })),
  plazo: z.enum(contactOptions.plazo, { error: 'Elegí una opción de plazo.' }).or(z.literal('')).optional().default(''),
  // No se recorta: hasta los espacios cuentan como valor en el honeypot.
  website: z.string().optional().default(''),
});

export type ContactData = z.output<typeof contactSchema>;

export function contactErrors(issues: readonly { path: readonly PropertyKey[]; message: string }[]): ContactErrors {
  const errors: ContactErrors = {};
  for (const issue of issues) {
    const field = contactFields.find((name) => name === issue.path[0]);
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
