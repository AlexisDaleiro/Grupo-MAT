# Grupo MAT

Sitio de Grupo MAT, agencia de software B2B de Uruguay. Astro con generación estática, TypeScript estricto, Tailwind CSS v4 y React reservado para el menú mobile y el formulario.

## Estado

Fase 1: sistema de diseño. Están implementados los tokens, las fuentes autoalojadas, el tema y los componentes base. La ruta `/` conserva el `BaseLayout` vacío; la navegación y el contenido se incorporan a partir de las fases siguientes, con aprobación entre fases.

## Desarrollo local

Usá una versión de Node.js compatible con `package.json` y npm. El lockfile fija las versiones instaladas.

```sh
npm ci
npm run dev
```

El servidor de desarrollo usa `http://localhost:4321` por defecto. No necesitás credenciales para levantar el layout vacío ni para compilar esta fase.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Iniciar el servidor de desarrollo. |
| `npm run check` | Revisar tipos y diagnósticos de Astro (`astro check`). |
| `npm run build` | Generar el sitio para producción. |
| `npm run preview` | Probar el último build con `wrangler pages dev ./dist`. |

Antes de cerrar cada fase, ejecutá `npx astro check` y `npm run build`.

## Sistema de diseño

`src/styles/global.css` define los tokens y la variante `dark:` de Tailwind v4. Los componentes usan `canvas`, `surface`, `surface-2`, `line`, `fg`, `fg-muted` y los tokens de marca. El texto pequeño en acento usa `brand-text`; `brand` queda para texto grande, bordes e íconos. El contenido de una banda oscura se envuelve con `data-theme="dark"` y las clases `bg-canvas text-fg`.

Geist y Geist Mono se sirven desde sus archivos variables latin de Fontsource con `font-display: swap`. Solo se precarga el woff2 de Geist. El tema se resuelve en el `<head>` antes de pintar: primero la elección guardada y después la preferencia del sistema. `ThemeToggle` guarda la selección, sincroniza sus instancias y actualiza `theme-color`, `aria-label` y `aria-pressed`. Sin acceso a almacenamiento sigue funcionando; sin JavaScript el botón queda oculto.

| Componente | Uso |
| --- | --- |
| `Button` | Variantes `primary`, `secondary` y `ghost`; `href` genera un enlace y su ausencia, un botón. `arrow` agrega la flecha. Acepta atributos del elemento nativo. |
| `Badge` | Variantes `neutral` y `status`. La segunda incluye un punto con pulso de opacidad, desactivado con reduced motion. |
| `Container` | Ancho máximo de 72rem y padding lateral adaptable; `as` permite `div`, `section` o `article`. |
| `SectionHeading` | `id` para el h2, `title`, `eyebrow`, `lead` y `align` (`left` o `center`). |
| `SpotlightCard` | Superficie, borde y sombra del tema. El grupo usa `data-spotlight-group`; la posición reactiva al cursor se incorpora en la Fase 2. |
| `Logo` | Link al inicio; `context="nav"` (18px) o `context="footer"` (22px). |
| `ProjectPlaceholder` | `name` del proyecto; visual oscuro con grid y “Capturas próximamente”. |
| `Avatar` | `name`, `photo` (imagen local importada), `initials` opcionales y `size` (96px por defecto). Sin foto muestra iniciales y, solo en desarrollo, “Foto pendiente”. |

Los componentes están en `src/components/ui/` y el toggle en `src/components/layout/`. No se cargan React, Motion, Lenis ni GSAP para esta fase. El favicon es un SVG con la letra dibujada como path.

### Compatibilidad con Cloudflare Pages

Para conservar el hosting pedido se usa Astro **5.18.2**, `@astrojs/cloudflare` **12.6.13** y `@astrojs/react` **4.4.2**, con versiones fijadas y lockfile. Es una excepción a usar la última versión mayor, acordada con el cliente: el adaptador actual eliminó el soporte de Pages y requiere Cloudflare Workers. TypeScript usa **6.0.3**, la última versión compatible con los peers de `@astrojs/check` **0.9.10** (TypeScript 5 o 6; todavía no admite TypeScript 7). Las demás dependencias se instalan en su última versión estable; Tailwind se mantiene en v4, como pide la especificación.

El adaptador usa `imageService: 'compile'` para optimizar imágenes durante el build de las páginas estáticas. El comando `preview` usa el Wrangler que incluye el adaptador como dependencia transitiva; no se agrega una dependencia directa fuera de la lista permitida.

Referencias: [adaptador compatible con Astro 5](https://v5.docs.astro.build/en/guides/integrations-guide/cloudflare/), [retiro del soporte de Pages en el adaptador actual](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#removed-cloudflare-pages-support).

**Limitación conocida de esta línea:** la auditoría de npm del 17/10/2026 reporta 8 dependencias afectadas (1 crítica, 4 altas, 2 moderadas y 1 baja). Incluye avisos en Astro, el adaptador y sus herramientas transitivas; npm propone versiones mayores para corregirlos, que requieren migrar a Workers. El layout vacío no usa las funciones de servidor ni procesa imágenes, pero la compatibilidad con Pages no equivale a una auditoría limpia. Revisá esta limitación antes de publicar o implementar las funciones afectadas. No se aplica `npm audit fix --force` porque alteraría las versiones y el hosting acordados.

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores solo en tu entorno. En PowerShell:

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
```

El schema tipado se define con `envField` en `astro.config.mjs`. Los secretos son exclusivamente del servidor y se validan cuando se usan, sin exigir credenciales durante la compilación. Nunca agregues credenciales ni direcciones de email reales al código o al control de versiones.

| Variable | Alcance | Uso |
| --- | --- | --- |
| `RESEND_API_KEY` | Servidor, secreta | Requerida en producción para enviar consultas. Opcional en desarrollo. |
| `CONTACT_TO_EMAIL` | Servidor, secreta | Destinatario requerido para enviar consultas. |
| `CONTACT_FROM_EMAIL` | Servidor, secreta | Remitente opcional. Si falta, la API usará el remitente de pruebas de Resend indicado en la especificación. |
| `PUBLIC_WHATSAPP` | Cliente, pública | Si no se define, usa `59895673109`. Dejalo sin separadores ni signo `+`. |
| `PUBLIC_CALENDLY_URL` | Cliente, pública | Opcional. Sin URL, “Agendar una llamada” apunta a `/contacto` y no se muestra la tarjeta de Calendly. |
| `PUBLIC_GA_ID` | Cliente, pública | Opcional. Sin ID, Google Analytics no se carga. |
| `PUBLIC_INSTAGRAM_URL` | Cliente, pública | Opcional. Sin URL, no se muestra el enlace. |
| `PUBLIC_LINKEDIN_URL` | Cliente, pública | Opcional. Sin URL, no se muestra el enlace. |

Los valores públicos quedan disponibles en el navegador: nunca los uses para secretos. Para activar el número predeterminado de WhatsApp, eliminá su asignación vacía de `.env` o completala con el valor documentado.

La API se implementa en la Fase 5. En desarrollo sin clave de Resend, deberá registrar el payload en la consola y responder con éxito. En producción sin clave, deberá responder con error. No se envían consultas en la Fase 0.

### Resend sin dominio verificado

El dominio de prueba de Resend permite enviar únicamente al email del dueño de la cuenta. Para recibir consultas en otros destinatarios, verificá un dominio propio y configurá un remitente de ese dominio mediante `CONTACT_FROM_EMAIL`. Guardá la clave y las direcciones únicamente como secretos del entorno.

Referencia: [restricciones del dominio de prueba de Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Deploy en Cloudflare Pages

1. Conectá el repositorio a un proyecto de **Cloudflare Pages**. No hace falta publicar nada para desarrollar esta fase.
2. Usá la raíz del repositorio como directorio del proyecto, `npm run build` como comando de build y `dist` como directorio de salida.
3. Seleccioná Node.js 22.22 o posterior compatible con `package.json` en el entorno de build (por ejemplo, mediante la variable `NODE_VERSION`). Instalá las dependencias con el lockfile (`npm ci`).
4. En **Settings → Variables and Secrets**, cargá `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y, si corresponde, `CONTACT_FROM_EMAIL` como secretos del runtime de Pages Functions. Configuralos para producción y para los previews que necesiten enviar emails. Las variables `PUBLIC_*` que uses deben estar disponibles al compilar; sus cambios requieren un nuevo build.
5. Cuando se incorpore `/api/contact` en la Fase 5, esa ruta llevará `prerender = false`; las demás páginas seguirán siendo estáticas. Habilitá `nodejs_compat` para Pages Functions y elegí una fecha de compatibilidad vigente en la configuración del proyecto, tanto en producción como en previews.
6. Conservá `https://grupo-mat.pages.dev` como `site` provisional. Cambialo en `astro.config.mjs` cuando haya un dominio propio confirmado.

Los secretos no se escriben en `astro.config.mjs`, el README ni otros archivos versionados. El build de esta fase no implementa todavía el endpoint de contacto. No se configura ni se publica ningún proyecto de Cloudflare desde este repositorio durante la Fase 0.

Referencia: [desplegar Astro en Cloudflare Pages con Astro 5](https://v5.docs.astro.build/en/guides/deploy/cloudflare/).

## Cómo agregar proyectos

Las colecciones y las rutas de proyectos se implementan en la Fase 4. Una vez disponible esa fase:

1. Creá `src/content/proyectos/<slug>.md`. El nombre del archivo define el slug de la página.
2. Agregá el frontmatter con `title`, `client`, `industry`, `summary`, `services`, `stack`, `integrations`, `status`, `featured`, `order`, `seoTitle` y `seoDescription`.
3. Usá `status: en-desarrollo` o `status: lanzado`. Agregá `launchEstimate` solo si hay una estimación confirmada.
4. Guardá las imágenes en `src/assets/proyectos/<slug>/`. Referencialas con rutas relativas desde el Markdown mediante `cover`, `gallery` y `logo`, todos opcionales. Sin imágenes se mostrará `ProjectPlaceholder`.
5. Escribí el cuerpo en Markdown. Agregá `liveUrl` solo si existe un sitio público y `repoUrl` únicamente para proyectos propios con repositorio público.
6. Corré `npm run check` y `npm run build`. La colección generará `/proyectos/<slug>` sin agregar rutas a mano.

Para destacar un proyecto en la Home, usá `featured: true`. Publicá únicamente datos confirmados; mientras falten capturas o fotos se usan los placeholders de la especificación.

## Rate limit de contacto en Cloudflare

La API de contacto se implementa en la Fase 5. El límite se configura en Cloudflare, sin código de rate limiting en la aplicación:

1. Seleccioná la zona del dominio del sitio en Cloudflare.
2. Abrí **Security → WAF → Rate limiting rules** (o **Security rules → Rate limiting rules**, según la interfaz del panel) y creá una regla.
3. Filtrá por ruta exacta y método con `(http.request.uri.path eq "/api/contact" and http.request.method eq "POST")`.
4. Usá la IP de origen como característica de conteo y un umbral de **5 solicitudes por 60 segundos por IP**.
5. Elegí la acción **Block** y una duración de mitigación compatible con el plan. Guardá y activá la regla antes de habilitar el formulario en producción.

Los períodos disponibles dependen del plan de Cloudflare. Si el panel no ofrece 60 segundos, el plan debe habilitar ese período para cumplir el límite solicitado. La regla de una zona requiere un dominio bajo esa zona; verificá su aplicación al dominio de producción y no supongas que protege el subdominio compartido de hosting.

Referencia: [crear una regla de rate limiting en Cloudflare](https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/).

## Archivos locales

`MEGA_PROMPT.md` y `.token-optimizer/` son locales y están ignorados a propósito. No los modifiques ni los agregues a commits. `.env`, sus variantes, los archivos locales de secretos de Cloudflare, `node_modules/`, `.astro/`, `.wrangler/` y `dist/` también están ignorados; `.env.example` sí se versiona.

## Pendientes de fases siguientes

- Navegación, menú y movimiento (Fase 2).
- Home (Fase 3) y contenido con páginas internas (Fase 4).
- Formulario, API y eventos de analítica (Fase 5).
- SEO, JSON-LD, `robots.txt`, headers, OG y GA4 condicional con Partytown (Fase 6).
- QA de rendimiento, accesibilidad y navegadores (Fase 7).
- Evaluar una CSP después de la v1; queda pendiente por la combinación de Partytown, GA y scripts inline.

El dominio propio, Calendly, GA4, redes sociales, fotos del equipo y capturas de DISTRICO siguen pendientes del cliente. Los presupuestos del formulario son provisorios. La política de privacidad requiere revisión legal antes de publicar.
