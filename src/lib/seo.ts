import { contact, socialLinks } from '@/data/site';

export interface SeoImage { src: string; width: number; height: number; alt: string }
export interface BreadcrumbItem { name: string; path: string }
export interface ServiceMetadata { name: string; serviceType: string; description: string }
type JsonValue = string | number | boolean | null | JsonObject | readonly JsonValue[];
interface JsonObject { readonly [key: string]: JsonValue | undefined }

export const defaultSeoImage: SeoImage = {
  src: '/og-default.png', width: 1200, height: 630,
  alt: 'Grupo MAT · Software a medida para empresas que venden a empresas.',
};

// Las páginas estáticas de Pages usan slash final; se excluyen query y fragmento.
export function canonicalUrl(path: string, site: URL): URL {
  const url = new URL(path, site);
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/') && !/\.[^/]+$/u.test(url.pathname)) url.pathname += '/';
  return url;
}

export function structuredData(site: URL, canonical: URL, breadcrumbs: readonly BreadcrumbItem[], service?: ServiceMetadata): JsonObject {
  const home = new URL('/', site).href;
  const organization: JsonObject = {
    '@type': 'Organization', '@id': `${home}#organization`, name: 'Grupo MAT', url: home,
    logo: { '@type': 'ImageObject', url: new URL('/logo.png', site).href, width: 600, height: 180 },
    telephone: contact.whatsappNumber
      ? contact.whatsappNumber === '59895673109' ? '+598 95 673 109' : `+${contact.whatsappNumber}`
      : undefined,
    areaServed: 'UY',
    ...(socialLinks.length ? { sameAs: socialLinks.map((link) => link.href) } : {}),
  };
  const graph: JsonObject[] = [];
  if (canonical.href === home) {
    graph.push(organization, {
      '@type': 'WebSite', '@id': `${home}#website`, name: 'Grupo MAT', url: home,
      inLanguage: ['es-UY', 'en'], publisher: { '@id': organization['@id'] },
    });
  }
  if (breadcrumbs.length) graph.push({
    '@type': 'BreadcrumbList', '@id': `${canonical.href}#breadcrumbs`,
    itemListElement: [{ name: 'Inicio', path: '/' }, ...breadcrumbs].map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: canonicalUrl(item.path, site).href,
    })),
  });
  if (service) graph.push({
    '@type': 'Service', '@id': `${canonical.href}#service`, url: canonical.href,
    name: service.name, serviceType: service.serviceType, description: service.description,
    provider: organization, areaServed: 'UY',
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}

// Evita cerrar el script si un texto de contenido contiene HTML o separadores JS.
export function serializeJsonLd(value: JsonObject): string {
  return JSON.stringify(value).replace(/</gu, '\\u003c').replace(/\u2028/gu, '\\u2028').replace(/\u2029/gu, '\\u2029');
}
