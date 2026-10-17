import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const text = z.string().trim().min(1);
const webUrl = z.string().url().refine((value) => /^https?:\/\//iu.test(value), 'Usá una URL http o https.');

const proyectos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/proyectos' }),
  schema: ({ image }) => z.object({
    title: text, client: text, industry: text, summary: text,
    services: z.array(text).min(1), stack: z.array(text).min(1), integrations: z.array(text),
    status: z.enum(['en-desarrollo', 'lanzado']), launchEstimate: text.optional(),
    cover: image().optional(), gallery: z.array(image()).optional(), logo: image().optional(),
    liveUrl: webUrl.optional(), repoUrl: webUrl.optional(),
    isOwnProject: z.boolean().default(false),
    featured: z.boolean(), order: z.number().int().nonnegative(),
    seoTitle: text, seoDescription: text,
  }).refine((project) => !project.repoUrl || project.isOwnProject, {
    message: 'repoUrl solo se permite en proyectos propios (isOwnProject: true).', path: ['repoUrl'],
  }),
});

const servicios = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: text, navTitle: text, headline: text, lead: text, audience: text,
    problems: z.array(text).min(1), includes: z.array(text).min(1), timeline: text,
    icon: z.string().regex(/^lucide:[a-z0-9-]+$/u), order: z.number().int().nonnegative(),
    relatedProject: reference('proyectos').optional(), seoTitle: text, seoDescription: text,
  }),
});

export const collections = { servicios, proyectos };
