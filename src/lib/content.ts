import type { CollectionEntry } from 'astro:content';

export function byOrder(a: CollectionEntry<'proyectos' | 'servicios'>, b: CollectionEntry<'proyectos' | 'servicios'>) {
  return a.data.order - b.data.order || a.id.localeCompare(b.id, 'es');
}

export function projectStatus(status: CollectionEntry<'proyectos'>['data']['status']) {
  return status === 'en-desarrollo' ? 'En desarrollo' : 'Lanzado';
}
