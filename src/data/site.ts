import {
  PUBLIC_WHATSAPP,
  PUBLIC_CALENDLY_URL,
  PUBLIC_INSTAGRAM_URL,
  PUBLIC_LINKEDIN_URL,
} from 'astro:env/client';

export interface NavItem { label: string; href: string }

export const navigation: readonly NavItem[] = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export const serviceLinks: readonly NavItem[] = [
  { label: 'E-commerce B2B', href: '/servicios/ecommerce-b2b' },
  { label: 'Landing pages', href: '/servicios/landing-pages' },
  { label: 'Automatizaciones', href: '/servicios/automatizaciones' },
];

export const companyLinks = navigation.filter((item) => item.label !== 'Servicios');

function externalUrl(value: string): string | undefined {
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const whatsappNumber = PUBLIC_WHATSAPP.trim().replace(/\D/gu, '');
const calendlyUrl = externalUrl(PUBLIC_CALENDLY_URL);

export const contact = {
  whatsappNumber,
  whatsappLabel: whatsappNumber === '59895673109' ? '095 673 109' : whatsappNumber,
  whatsappUrl: whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Grupo MAT, quiero consultar por un proyecto.')}`
    : undefined,
  calendlyUrl,
  appointmentUrl: calendlyUrl ?? '/contacto',
};

export const socialLinks = [
  { label: 'Instagram', icon: 'lucide:instagram', href: externalUrl(PUBLIC_INSTAGRAM_URL) },
  { label: 'LinkedIn', icon: 'lucide:linkedin', href: externalUrl(PUBLIC_LINKEDIN_URL) },
].filter((item): item is typeof item & { href: string } => Boolean(item.href));
