import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import { loadEnv } from 'vite';

// Astro usa Vite; no agregamos paquetes. Solo cargamos variables públicas aquí.
const publicEnvironment = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_');

export default defineConfig({
  site: 'https://grupo-mat.pages.dev',
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),

  env: {
    validateSecrets: false,
    schema: {
      // La API verificará la clave en producción; en desarrollo puede faltar.
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        // Obligatoria al enviar; la API la valida sin impedir su carga sin credenciales.
        optional: true,
      }),
      CONTACT_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      PUBLIC_WHATSAPP: envField.string({
        context: 'client',
        access: 'public',
        default: '59895673109',
      }),
      PUBLIC_CALENDLY_URL: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_GA_ID: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_INSTAGRAM_URL: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_LINKEDIN_URL: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
    },
  },

  integrations: [
    react(),
    sitemap({ filter: (page) => !/^\/404(?:\/|\.html)?$/u.test(new URL(page).pathname) }),
    ...(publicEnvironment.PUBLIC_GA_ID?.trim()
      ? [partytown({ config: { forward: ['dataLayer.push', 'gtag'] } })]
      : []),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
