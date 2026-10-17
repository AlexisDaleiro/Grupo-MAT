import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';

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

  integrations: [react(), sitemap(), partytown(), icon()],

  vite: {
    plugins: [tailwindcss()],
  },
});
