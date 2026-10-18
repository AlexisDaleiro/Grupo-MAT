import {
  PUBLIC_WHATSAPP,
  PUBLIC_CALENDLY_URL,
  PUBLIC_INSTAGRAM_URL,
  PUBLIC_LINKEDIN_URL,
} from 'astro:env/client';
import type { ImageMetadata } from 'astro';

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

export const contactOptions = {
  plazo: ['Lo antes posible', 'En 1 a 3 meses', 'En 3 a 6 meses', 'Sin fecha definida'],
} as const;

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

export const stack = [
  { label: 'TypeScript', icon: 'simple-icons:typescript' },
  { label: 'React', icon: 'simple-icons:react' },
  { label: 'Next.js', icon: 'simple-icons:nextdotjs' },
  { label: 'NestJS', icon: 'simple-icons:nestjs' },
  { label: 'Node.js', icon: 'simple-icons:nodedotjs' },
  { label: 'Astro', icon: 'simple-icons:astro' },
  { label: 'Tailwind CSS', icon: 'simple-icons:tailwindcss' },
  { label: 'SAP', icon: 'simple-icons:sap' },
] as const;

export const homeServices = [
  {
    title: 'E-commerce B2B', icon: 'lucide:shopping-cart', href: '/servicios/ecommerce-b2b',
    description: 'Tu catálogo mayorista online, con precios por cliente y conectado a tu sistema de gestión.',
    bullets: ['Precios y condiciones por cliente', 'Pedidos online las 24 horas', 'Integración con ERP (SAP y otros)', 'Panel para tu equipo comercial'],
    timeline: 'De 1 a 6 meses', link: 'Ver e-commerce B2B',
  },
  {
    title: 'Landing pages', icon: 'lucide:panels-top-left', href: '/servicios/landing-pages',
    description: 'Páginas rápidas, pensadas para convertir visitas en consultas.',
    bullets: ['Diseño a medida, sin plantillas', 'Optimizadas para velocidad y SEO', 'Formularios conectados a tu email o CRM'],
    timeline: '2 semanas', link: 'Ver landing pages',
  },
  {
    title: 'Automatizaciones', icon: 'lucide:workflow', href: '/servicios/automatizaciones',
    description: 'Conectamos tus sistemas para que tu equipo deje de hacer tareas repetitivas.',
    bullets: ['Integración entre sistemas y planillas', 'Sincronización de stock y precios', 'Notificaciones y bots de WhatsApp', 'Reportes automáticos y procesos con IA'],
    timeline: 'Según alcance', link: 'Ver automatizaciones',
  },
] as const;

export const differentiators = [
  { title: 'Velocidad', icon: 'lucide:zap', text: 'Landing pages en 2 semanas y avances visibles cada semana en proyectos grandes.' },
  { title: 'Especialización B2B', icon: 'lucide:boxes', text: 'Entendemos cómo vende una distribuidora: listas de precios, clientes con condiciones propias y pedidos recurrentes.' },
  { title: 'Precio justo', icon: 'lucide:badge-dollar-sign', text: 'Presupuestos a medida. Pagás por lo que tu negocio necesita, no por funciones que no vas a usar.' },
  { title: 'Soporte continuo', icon: 'lucide:life-buoy', text: 'No desaparecemos después del lanzamiento: seguimos con vos todos los meses con el plan de mantenimiento.' },
  { title: 'Foco en resultados', icon: 'lucide:chart-no-axes-combined', text: 'Medimos lo que importa para tu negocio: pedidos, consultas y horas ahorradas.' },
] as const;

export const processSteps = [
  { number: '01', title: 'Diagnóstico', text: 'Una llamada sin costo para entender tu negocio, tus sistemas y tus objetivos.' },
  { number: '02', title: 'Diseño', text: 'Definimos alcance, plazos y presupuesto. Diseñamos la experiencia antes de escribir código.' },
  { number: '03', title: 'Desarrollo', text: 'Construimos en ciclos cortos, con avances que podés ver y probar cada semana.' },
  { number: '04', title: 'Lanzamiento y soporte', text: 'Publicamos, medimos y seguimos con vos todos los meses con el plan de mantenimiento.' },
] as const;

interface TeamMember { name: string; role: string; text: string; photo?: ImageMetadata; linkedin?: string }
export const team: readonly TeamMember[] = [
  { name: 'Mara', role: 'Backend', text: 'APIs, bases de datos e integraciones con tus sistemas.' },
  { name: 'Alexis', role: 'Frontend y diseño', text: 'Interfaces rápidas, claras y pensadas para vender.' },
  { name: 'Thiago', role: 'Project lead', text: 'Tu contacto directo: alcance, plazos y seguimiento del proyecto.' },
];

export const faq = [
  { question: '¿Cuánto cuesta un proyecto?', answer: 'Cada proyecto es a medida. Después de la llamada de diagnóstico te enviamos un presupuesto detallado con alcance y plazos.' },
  { question: '¿Cuánto tardan?', answer: 'Una landing page lleva unas 2 semanas. Un e-commerce B2B, de 1 a 6 meses según el catálogo y las integraciones. Las automatizaciones dependen del alcance.' },
  { question: '¿Qué pasa después del lanzamiento?', answer: 'Seguimos con vos todos los meses con un plan de mantenimiento: soporte, mejoras y monitoreo.' },
  { question: '¿Pueden integrar el sistema que ya uso?', answer: 'Sí. Integramos ERP, sistemas de stock y planillas; por ejemplo, SAP. Lo evaluamos juntos en la llamada de diagnóstico.' },
  { question: '¿Usan plantillas?', answer: 'No. Diseñamos y programamos cada proyecto con código propio.' },
  { question: '¿Trabajan con empresas fuera de Uruguay?', answer: 'Hoy trabajamos principalmente con empresas de Uruguay, y podemos trabajar de forma remota con empresas de otros países.' },
] as const;
