# Grupo MAT

Sitio de Grupo MAT, agencia de software B2B de Uruguay. Astro con generación estática, TypeScript estricto, Tailwind CSS v4 y React reservado para el menú mobile y el formulario.

## Estado

Fase 3: Home. Están implementados el sistema de diseño, layout, navegación, menú móvil, footer, WhatsApp y todas las secciones de la Home, con el copy de la especificación. El formulario es un placeholder estático; las colecciones y páginas internas se incorporan en la Fase 4, y el formulario funcional en la Fase 5, con aprobación entre fases.

## Desarrollo local

Usá una versión de Node.js compatible con `package.json` y npm. El lockfile fija las versiones instaladas.

```sh
npm ci
npm run dev
```

El servidor de desarrollo usa `http://localhost:4321` por defecto. No necesitás credenciales para levantar la Home ni para compilar esta fase.

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
| `SectionHeading` | `id` para el h2, `title`, `eyebrow`, `lead` y `align` (`left` o `center`). `reveal` anima cada texto por separado. |
| `SpotlightCard` | Superficie, borde y sombra del tema. El grupo usa `data-spotlight-group`; la posición reactiva al cursor se incorpora en la Fase 2. |
| `Logo` | Link al inicio; `context="nav"` (18px) o `context="footer"` (22px). |
| `ProjectPlaceholder` | `name` del proyecto; visual oscuro con grid y “Capturas próximamente”. |
| `Avatar` | `name`, `photo` (imagen local importada), `initials` opcionales y `size` (96px por defecto). Sin foto muestra iniciales y, solo en desarrollo, “Foto pendiente”. |

Los componentes están en `src/components/ui/` y el toggle en `src/components/layout/`. Los componentes UI no requieren React. El favicon es un SVG con la letra dibujada como path.

## Layout y movimiento

`BaseLayout` acepta `title`, `description`, `image` y `hasHero`. Cuando la página comienza con una banda oscura, pasá `hasHero` y marcá la banda con `data-hero data-theme="dark"`; así el nav ya tiene el tema correcto antes de cargar los scripts. Sin hero, el contenido deja 64px para el nav fijo.

La navegación usa los links de `src/data/site.ts`. El nav cambia a cristal después de 8px y observa el hero con un offset de 64px. Las bandas mantienen sus tokens oscuros aunque el resto de la página esté en claro. El footer muestra únicamente los canales y redes configurados; Calendly sin URL usa `/contacto` en el CTA del nav.

`MobileMenu` es la única isla de esta fase, con `client:media="(max-width: 1023px)"`. React y Motion se descargan cuando se hidrata en mobile; desktop conserva HTML y scripts vanilla. Usa un diálogo nativo, focus trap, cierre con Escape o enlaces, restauración de foco y bloqueo de scroll hasta finalizar la salida. Sin JavaScript, queda disponible una navegación móvil con `details` nativo. Motion usa `LazyMotion`, `domAnimation`, componentes `m.*` desde `motion/react-m` y `reducedMotion="user"`, con tweens sin rebote.

`src/scripts/motion.ts` se importa una vez desde el layout. Lenis se sincroniza con el ticker de GSAP y ScrollTrigger, con touch nativo. En Lenis 1.3.27, `scrollTo` ya descuenta `scroll-margin-top`; por eso `anchors` usa offset adicional cero y los destinos conservan los 80px del CSS. Los reveals limpian transform, opacity, filter y will-change al terminar. Si vence el failsafe de 3 segundos, la carga tardía del módulo no vuelve a ocultar contenido ya visible. Al activar reduced motion se destruye Lenis y todo queda visible; al desactivarlo se reinicia el scroll sin repetir reveals.

| Marca de HTML | Uso en las próximas secciones |
| --- | --- |
| `data-hero` | Banda inicial que determina el tema del nav y la aparición de WhatsApp. |
| `data-reveal` | Eyebrow, título, lead o tarjeta individual; nunca una sección completa. |
| `data-spotlight-group` | Grupo de `SpotlightCard`; la posición del cursor actualiza todas las tarjetas en un rAF, con lecturas agrupadas antes de las escrituras. |
| `data-final-cta` o `id="contacto"` | Oculta WhatsApp al entrar en la vista, al igual que el footer. |

El botón de WhatsApp aparece al pasar el hero y se oculta con el menú, CTA final o footer visibles. No se renderiza si el número público está vacío. El spotlight se activa solo con mouse fino, hover y sin reduced motion. No hay ClientRouter ni listeners de navegación de View Transitions.

`Seo` contiene los metadatos base y admite una imagen real opcional. Los metadatos por página, JSON-LD, imagen OG y analítica quedan para la Fase 6. Los enlaces a páginas internas se completan al implementar sus rutas en la Fase 4.

Partytown se activa solo cuando existe `PUBLIC_GA_ID`, para evitar registrar un worker de analítica que todavía no se usa. La configuración consulta únicamente variables públicas con el `loadEnv` de Vite que ya incluye Astro, sin agregar dependencias. La inyección de GA4 sigue pendiente de la Fase 6.

### Verificación de la Fase 2

Pruebas locales en Chrome 155 sobre una fixture temporal: 360, 768, 1024 y 1440px en claro y oscuro; nav transparente/cristal y cambio de banda; anchors a 80px; reveals con limpieza; spotlight; visibilidad de WhatsApp; menú con teclado, Escape, foco, scroll propio y cambio a desktop. Se verificaron reduced motion (también durante un reveal), touch, JavaScript desactivado y el failsafe con el módulo global bloqueado.

Sin GA y sin hidratar islas en desktop, el JS inicial medido fue de **55.395 bytes gzip**, incluyendo módulos descargados y scripts inline. React no se descargó en desktop. En un trace de scroll de Chrome a 1440×900, el intervalo P95 entre frames fue de **5,7ms**, sin tareas mayores a 50ms. El reporte y el trace quedan fuera del repo; la fixture se retira de la entrega. Estos valores corresponden al núcleo de movimiento y se vuelven a medir cuando se incorpore la Home y en la Fase 7.

## Home de la Fase 3

Las secciones están en `src/components/sections/`: hero, stack, servicios, diferenciales, DISTRICO, proceso, equipo, FAQ y CTA final. Nav, footer y WhatsApp se reutilizan desde el layout. Stack, tarjetas de servicios, diferenciales, pasos, equipo y FAQ se editan en `src/data/site.ts`. Los integrantes admiten `photo` y `linkedin` opcionales; en producción se muestran iniciales sin el badge de desarrollo. No se inventan fotos, logos ni capturas.

El hero usa entradas CSS con los delays de la especificación, grid y glow de fondo. Su contenido pierde opacidad y sube 40px al scrollear. El visual de DISTRICO reduce su escala de 1.06 a 1 dentro de un recorte. En desktop, el proceso tiene una introducción sticky, una línea con `scaleY` y pasos que ganan opacidad al llegar al centro. En mobile conserva una lista con reveals. Todo el scroll se controla desde el módulo global existente, dentro de `gsap.matchMedia()`; reduced motion revierte las animaciones.

La franja de tecnologías usa dos listas iguales y un ciclo CSS de 40 segundos, con pausa en hover. La copia está oculta para tecnologías asistivas; con reduced motion se muestra una sola lista estática. La FAQ usa `details`/`summary` y mejora progresivamente con `::details-content`; sin soporte abre de forma nativa.

**Pendientes intencionales:** DISTRICO usa por ahora los datos confirmados de `site.ts`; la selección desde Content Collections con `featured: true` se incorpora en la Fase 4. El CTA final muestra una vista estática del formulario, sin campos editables ni envío; ofrece WhatsApp mientras se implementa `ContactForm` en la Fase 5. Calendly y redes se muestran solo si tienen URL. Los links a servicios, proyectos, contacto y privacidad apuntan a las rutas previstas para la Fase 4.

Referencias de implementación: [componentes Astro](https://docs.astro.build/en/basics/astro-components/), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) y [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

### Verificación de la Fase 3

`npx astro check`: 33 archivos, sin errores, warnings ni hints. `npm run build`: correcto. La Home compilada se verificó en Chrome 155 a 360, 768, 1024 y 1440px, en claro y oscuro: secciones y copy, ausencia de overflow horizontal, navegación con teclado, offset y foco de anchors, reveals, menú, FAQ nativa, placeholders y visibilidad de WhatsApp. También se verificaron reduced motion, su activación en vivo y JavaScript desactivado.

Sin GA y sin islas hidratadas, el JS inicial de desktop fue de **55.068 bytes gzip**, incluyendo scripts inline; no se descargó React. El trace de scroll de la Home completa a 1440×900 dio un intervalo P95 de **11,1ms** entre frames y **ninguna tarea mayor a 50ms**, con el checker ya terminado. Son mediciones locales; Lighthouse y QA de otros navegadores siguen para la Fase 7. Las capturas, scripts de verificación, reporte y trace se guardan fuera del repo.

### Compatibilidad con Cloudflare Pages

Para conservar el hosting pedido se usa Astro **5.18.2**, `@astrojs/cloudflare` **12.6.13** y `@astrojs/react` **4.4.2**, con versiones fijadas y lockfile. Es una excepción a usar la última versión mayor, acordada con el cliente: el adaptador actual eliminó el soporte de Pages y requiere Cloudflare Workers. TypeScript usa **6.0.3**, la última versión compatible con los peers de `@astrojs/check` **0.9.10** (TypeScript 5 o 6; todavía no admite TypeScript 7). Las demás dependencias se instalan en su última versión estable; Tailwind se mantiene en v4, como pide la especificación.

El adaptador usa `imageService: 'compile'` para optimizar imágenes durante el build de las páginas estáticas. El comando `preview` usa el Wrangler que incluye el adaptador como dependencia transitiva; no se agrega una dependencia directa fuera de la lista permitida.

Referencias: [adaptador compatible con Astro 5](https://v5.docs.astro.build/en/guides/integrations-guide/cloudflare/), [retiro del soporte de Pages en el adaptador actual](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#removed-cloudflare-pages-support).

**Limitación conocida de esta línea:** la auditoría de npm del 17/10/2026 reporta 8 dependencias afectadas (1 crítica, 4 altas, 2 moderadas y 1 baja). Incluye avisos en Astro, el adaptador y sus herramientas transitivas; npm propone versiones mayores para corregirlos, que requieren migrar a Workers. Las páginas actuales son estáticas y todavía no procesan imágenes, pero la compatibilidad con Pages no equivale a una auditoría limpia. Revisá esta limitación antes de publicar o implementar las funciones afectadas. No se aplica `npm audit fix --force` porque alteraría las versiones y el hosting acordados.

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

- Content Collections y páginas internas (Fase 4), incluida la selección de DISTRICO desde la colección.
- Formulario, API y eventos de analítica (Fase 5).
- SEO, JSON-LD, `robots.txt`, headers, OG y GA4 condicional con Partytown (Fase 6).
- QA de rendimiento, accesibilidad y navegadores (Fase 7).
- Evaluar una CSP después de la v1; queda pendiente por la combinación de Partytown, GA y scripts inline.

El dominio propio, Calendly, GA4, redes sociales, fotos del equipo y capturas de DISTRICO siguen pendientes del cliente. Los presupuestos del formulario son provisorios. La política de privacidad requiere revisión legal antes de publicar.
