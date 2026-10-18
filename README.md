# Grupo MAT

Sitio de Grupo MAT, agencia de software B2B de Uruguay. Astro con generación estática, TypeScript estricto, Tailwind CSS v4 y React reservado para el menú mobile y el formulario.

## Estado

Fase 7: QA local de rendimiento, accesibilidad y navegadores. Por pedido posterior del cliente, el selector de tema se reemplazó por ES/EN con cambio instantáneo y preferencia guardada. El diseño usa base crema y bandas ciruela. La Home y las páginas internas comparten el formulario funcional. Las páginas siguen siendo estáticas; solo `/api/contact` se ejecuta por solicitud. Los resultados y límites del QA se documentan en `QA_REPORT.md`.

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

### Paleta actual

El cliente reemplazó la paleta azul de la especificación por Discreet Palette. `MEGA_PROMPT.md` se conserva intacto; esta elección posterior define los colores de la implementación.

| Color base | Uso |
| --- | --- |
| `#800000` | Marca, botones y enlaces sobre fondos claros; favicon. |
| `#BB8376` | Botones sobre oscuro, detalles y glows en rosa tierra. |
| `#FFF4EE` | Fondo claro y texto principal sobre oscuro. |
| `#582B39` | Fondo oscuro, bandas de marca y texto principal sobre claro. |

Las superficies, hovers y colores secundarios usan tonos derivados de estos cuatro colores para conservar contraste. Los botones oscuros combinan rosa tierra con tinta `#2C131B`; el texto secundario usa `#F2D6CC`. Los inputs tienen un token `field-border` propio para mantener un borde distinguible. Hero, grids, spotlight, placeholders, menú, theme-color y recursos de marca comparten esta paleta.

Geist y Geist Mono se sirven desde sus archivos variables latin de Fontsource con `font-display: swap`. Solo se precarga el woff2 de Geist, con prioridad alta. El tema global queda fijo en claro; `data-theme="dark"` conserva las bandas de marca. La preferencia de tema anterior y la del sistema ya no cambian la página. `theme-color` usa el crema de la paleta.

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

Los componentes están en `src/components/ui/` y `LanguageToggle` en `src/components/layout/`. Los componentes UI no requieren React. El favicon es un SVG con la letra dibujada como path.

## Idiomas ES/EN

`LanguageToggle` muestra dos botones con áreas de 44px, estado `aria-pressed` y nombres accesibles que incluyen ES/EN. Español es el idioma inicial. El `<head>` aplica la preferencia `language` de `localStorage` antes de pintar; si el almacenamiento está bloqueado, el selector sigue funcionando en la página actual. La elección se sincroniza entre pestañas.

`Text.astro` resuelve las traducciones de `src/i18n/english.ts` durante el build. Ambos textos quedan incluidos en el HTML, y CSS muestra el idioma elegido. El cambio no descarga traducciones ni reemplaza secciones. `scripts/language.ts` actualiza `html[lang]`, etiquetas accesibles, metadatos y mensajes prellenados de WhatsApp. Anuncia la elección en una región de estado y avisa al módulo de movimiento para recalcular las posiciones después de cambiar la altura del contenido.

En los enlaces y el CTA del navbar, `<Text reserveSpace text={texto} />` reserva el espacio de ambas traducciones en una misma celda de grid. La variante inactiva conserva su medida con `visibility: hidden` y queda fuera del nombre accesible. Así los enlaces, el selector ES/EN y el botón de llamada mantienen su posición al cambiar de idioma, sin medir textos con JavaScript ni fijar anchos en píxeles.

Las islas usan `useLanguage`, basado en [useSyncExternalStore de React](https://react.dev/reference/react/useSyncExternalStore), para sincronizar el idioma sin diferirlo respecto al resto de la página. Sus diccionarios pequeños cubren menú, opciones, validación y estados del formulario. Cambiar el idioma conserva valores, opciones seleccionadas y estado del envío. Las opciones de plazo se presentan traducidas y mantienen su valor original en español en la API. La analítica no recibe datos del formulario.

Las URLs y canonical se conservan. El HTML estático y los datos estructurados mantienen su base en español; `WebSite.inLanguage` declara los dos idiomas disponibles. Al elegir inglés se traducen también el título y los metadatos de la vista. Este selector ofrece inglés en la misma URL; no crea rutas `/en/` indexables por separado. Sin JavaScript se ofrece la versión completa en español y se oculta el selector.

Para editar copy, conservá el texto español y su traducción en `src/i18n/english.ts`; usá `<Text text={texto} />` para nuevos textos estáticos. `form-copy.ts` y `menu-copy.ts` contienen el copy de las islas. Para el cuerpo de un proyecto, agregá `src/content/translations/proyectos/<slug>.md`: se descubre por el mismo slug, sin editar rutas. Si falta ese archivo en un proyecto nuevo, su cuerpo se conserva en español con `lang="es-UY"`; completá la traducción antes de presentarlo como contenido en inglés. La importación de Markdown sigue la [documentación de Astro 5](https://v5.docs.astro.build/en/guides/markdown-content/#the-content--component).

## Layout y movimiento

`BaseLayout` acepta `title`, `description`, `image` (`src`, dimensiones y `alt`), `canonical`, `breadcrumbs`, `service`, `noindex` y `hasHero`. Cuando la página comienza con una banda oscura, pasá `hasHero` y marcá la banda con `data-hero data-theme="dark"`; así el nav ya tiene el tema correcto antes de cargar los scripts. Sin hero, el contenido deja 64px para el nav fijo.

La navegación usa los links de `src/data/site.ts`. El nav cambia a cristal después de 8px y observa el hero con un offset de 64px. Con cristal, los links desktop usan `fg` para conservar contraste sobre bandas oscuras en tema claro. Las bandas mantienen sus tokens oscuros aunque el resto de la página esté en claro. El footer muestra únicamente los canales y redes configurados; Calendly sin URL usa `/contacto` en el CTA del nav.

`MobileMenu` usa `client:media="(max-width: 1023px)"`; `ContactForm` usa `client:visible`. En desktop, React y Motion no se descargan hasta que el formulario entra en pantalla. El menú usa un diálogo nativo, focus trap, cierre con Escape o enlaces, restauración de foco y bloqueo de scroll hasta finalizar la salida. Sin JavaScript, queda disponible una navegación móvil con `details` nativo. Ambas islas usan `LazyMotion`, `domAnimation`, componentes `m.*` desde `motion/react-m` y `reducedMotion="user"`, con tweens sin rebote.

`src/scripts/motion.ts` se importa una vez desde el layout después de `load` y dos `requestAnimationFrame`, para priorizar los recursos iniciales y su pintado antes de iniciar GSAP. Lenis se sincroniza con el ticker de GSAP y ScrollTrigger, con touch nativo. En Lenis 1.3.27, `scrollTo` ya descuenta `scroll-margin-top`; por eso `anchors` usa offset adicional cero y los destinos conservan los 80px del CSS. Los reveals limpian transform, opacity, filter y will-change al terminar. Si falla la importación o vence el failsafe de 3 segundos, el contenido queda visible; una carga tardía del módulo no vuelve a ocultarlo. Al activar reduced motion se destruye Lenis y todo queda visible; al desactivarlo se reinicia el scroll sin repetir reveals.

| Marca de HTML | Uso en las próximas secciones |
| --- | --- |
| `data-hero` | Banda inicial que determina el tema del nav y la aparición de WhatsApp. |
| `data-reveal` | Eyebrow, título, lead o tarjeta individual; nunca una sección completa. |
| `data-spotlight-group` | Grupo de `SpotlightCard`; la posición del cursor actualiza todas las tarjetas en un rAF, con lecturas agrupadas antes de las escrituras. |
| `data-final-cta` o `id="contacto"` | Oculta WhatsApp al entrar en la vista, al igual que el footer. |

El botón de WhatsApp aparece al pasar el hero y se oculta con el menú, CTA final o footer visibles. No se renderiza si el número público está vacío. El spotlight se activa solo con mouse fino, hover y sin reduced motion. No hay ClientRouter ni listeners de navegación de View Transitions.

`Seo` genera los metadatos, canonical, Open Graph, Twitter Card y JSON-LD. Las rutas internas reciben los títulos y descripciones de su contenido. La imagen de marca es el fallback cuando no existe una portada de proyecto apta para compartir.

Partytown y los scripts de GA4 se incluyen solo cuando existe `PUBLIC_GA_ID` después de quitar espacios. La configuración consulta únicamente variables públicas con el `loadEnv` de Vite que ya incluye Astro, sin agregar dependencias. Usa `forward: ['dataLayer.push', 'gtag']`; `Analytics.astro` inicializa GA4 con scripts `text/partytown`.

### Verificación de la Fase 2

Pruebas locales en Chrome 155 sobre una fixture temporal: 360, 768, 1024 y 1440px en claro y oscuro; nav transparente/cristal y cambio de banda; anchors a 80px; reveals con limpieza; spotlight; visibilidad de WhatsApp; menú con teclado, Escape, foco, scroll propio y cambio a desktop. Se verificaron reduced motion (también durante un reveal), touch, JavaScript desactivado y el failsafe con el módulo global bloqueado.

Sin GA y sin hidratar islas en desktop, el JS inicial medido fue de **55.395 bytes gzip**, incluyendo módulos descargados y scripts inline. React no se descargó en desktop. En un trace de scroll de Chrome a 1440×900, el intervalo P95 entre frames fue de **5,7ms**, sin tareas mayores a 50ms. El reporte y el trace quedan fuera del repo; la fixture se retira de la entrega. Estos valores corresponden al núcleo de movimiento y se vuelven a medir cuando se incorpore la Home y en la Fase 7.

## Home de la Fase 3

Las secciones están en `src/components/sections/`: hero, stack, servicios, diferenciales, DISTRICO, proceso, equipo, FAQ y CTA final. Nav, footer y WhatsApp se reutilizan desde el layout. Stack, tarjetas de servicios, diferenciales, pasos, equipo y FAQ se editan en `src/data/site.ts`. Los integrantes admiten `photo` y `linkedin` opcionales; en producción se muestran iniciales sin el badge de desarrollo. No se inventan fotos, logos ni capturas.

El hero conserva las entradas CSS de su contenido secundario, el grid y un glow radial. Los h1 y el lead de `PageHeader` están visibles desde el HTML para proteger el LCP. El efecto del hero se inicia con el primer scroll, sube hasta 40px y conserva opacidad mínima de 0.9. El visual de DISTRICO reduce su escala de 1.06 a 1 dentro de un recorte. En desktop, el proceso tiene una introducción sticky, una línea con `scaleY` y pasos que pasan de opacidad 0.9 a 1 al llegar al centro. Estos mínimos reemplazan 0.3 y 0.4 tras detectar contraste insuficiente con el texto todavía visible. En mobile conserva una lista con reveals. Todo el scroll se controla desde el módulo global, dentro de `gsap.matchMedia()`; los tweens creados después se agregan al mismo contexto para que reduced motion también los revierta.

La franja de tecnologías usa dos listas iguales y un ciclo CSS de 40 segundos, con pausa en hover. La copia está oculta para tecnologías asistivas; con reduced motion se muestra una sola lista estática. La FAQ usa `details`/`summary` y mejora progresivamente con `::details-content`; sin soporte abre de forma nativa.

Desde la Fase 4, DISTRICO se selecciona desde Content Collections con `featured: true`. El CTA final comparte `ContactForm` con la página de contacto. Calendly y redes se muestran solo si tienen URL. Los links a servicios, proyectos, contacto y privacidad ya tienen sus páginas.

Referencias de implementación: [componentes Astro](https://docs.astro.build/en/basics/astro-components/), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) y [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

### Verificación de la Fase 3

`npx astro check`: 33 archivos, sin errores, warnings ni hints. `npm run build`: correcto. La Home compilada se verificó en Chrome 155 a 360, 768, 1024 y 1440px, en claro y oscuro: secciones y copy, ausencia de overflow horizontal, navegación con teclado, offset y foco de anchors, reveals, menú, FAQ nativa, placeholders y visibilidad de WhatsApp. También se verificaron reduced motion, su activación en vivo y JavaScript desactivado.

Sin GA y sin islas hidratadas, el JS inicial de desktop fue de **55.068 bytes gzip**, incluyendo scripts inline; no se descargó React. El trace de scroll de la Home completa a 1440×900 dio un intervalo P95 de **11,1ms** entre frames y **ninguna tarea mayor a 50ms**, con el checker ya terminado. Son mediciones locales; Lighthouse y QA de otros navegadores siguen para la Fase 7. Las capturas, scripts de verificación, reporte y trace se guardan fuera del repo.

## Contenido y páginas de la Fase 4

`src/content.config.ts` usa el loader `glob` de Astro 5 y schemas tipados. `src/content/servicios/*.md` genera las tres páginas con `getStaticPaths`; `relatedProject` es una referencia a la colección `proyectos`. `src/content/proyectos/*.md` genera las páginas de detalle, alimenta el listado y selecciona el destacado de la Home. El orden es ascendente por `order`, con el ID como desempate. Si hay varios destacados, la Home muestra el primero según ese orden.

`PageHeader` es la banda oscura compartida. Los servicios incluyen audiencia, problemas, alcance, plazo, proceso compacto y proyecto relacionado cuando existe. Los proyectos renderizan Markdown con `render()` y estilos propios en `src/styles/prose.css`, sin plugin de tipografía. El listado agrega la tarjeta de contacto solo mientras haya menos de tres proyectos.

Cover y galería locales usan `image()` y `Picture`, con AVIF/WebP, dimensiones explícitas y carga diferida. El logo es opcional. Sin imágenes se usa `ProjectPlaceholder`. Los botones externos se muestran solo si existe la URL; `repoUrl` requiere además `isOwnProject: true`, validado por el schema para evitar publicar repositorios de clientes.

Contacto ofrece únicamente los canales configurados y un anchor a `#formulario`, cuyo destino recibe foco también con navegación nativa y sin JavaScript. El placeholder de la Fase 4 fue reemplazado por el formulario en la Fase 5. Privacidad incluye la nota HTML de revisión legal; su fecha corresponde a esta versión del texto, no cambia con cada build. `404.astro` genera `404.html` para las rutas inexistentes de Pages. La URL directa `/404` se sirve como archivo estático; el estado HTTP 404 se verifica solicitando una ruta inexistente, según el comportamiento de [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

Referencias: [Content Collections de Astro 5](https://v5.docs.astro.build/en/guides/content-collections/), [API de contenido](https://v5.docs.astro.build/en/reference/modules/astro-content/) e [imágenes](https://v5.docs.astro.build/en/guides/images/).

### Verificación de la Fase 4

`npx astro check`: 46 archivos, sin errores, warnings ni hints. `npm run build`: correcto, con las nueve páginas previstas. Se agregó un `.md` temporal con datos ya confirmados de DISTRICO y una imagen técnica de prueba: el build generó su ruta sin cambiar código, cover y galería en AVIF/WebP, logo y dimensiones explícitas. La fixture se retiró y el build final se regeneró sin esa página ni sus imágenes.

Chrome 155: 72 escenarios (nueve rutas × cuatro anchos de 360, 768, 1024 y 1440px × claro/oscuro), sin overflow horizontal ni errores de consola. Se verificaron títulos, contenido, bandas oscuras, referencias, enlaces internos, anchors, ausencia de URLs e imágenes no configuradas, nota de privacidad y respuesta 404 para rutas inexistentes. También se probaron navegación y formulario estático sin JavaScript, reduced motion y reveals con movimiento normal. Capturas, scripts y reportes quedan fuera del repo. La revisión de otros navegadores, Lighthouse y axe sigue para la Fase 7.

## Formulario y API

Por pedido posterior del cliente, el formulario conserva solo nombre, empresa, email de trabajo y plazo, en ES/EN. Los tres primeros son obligatorios; el plazo sigue siendo opcional. En mobile se muestran en una columna; desde 768px, en dos filas de dos campos. El honeypot permanece oculto. La API y el correo incluyen únicamente esos cuatro datos; el asunto es `Nuevo lead: {empresa}`. Cargo, servicio, presupuesto y mensaje se retiraron del formulario y del schema; si llegan como claves adicionales, se descartan.

`src/lib/contact-schema.ts` define el schema Zod 4 compartido por la isla y el servidor. Valida al salir de cada campo y al enviar, recorta los textos y limita largos y opciones. Las opciones de plazo están en `src/data/site.ts`. Los errores tienen espacio reservado, `aria-describedby` y `aria-invalid`; el foco va al primer campo inválido o al mensaje general. El mensaje general reserva su altura real con `visibility: hidden` y `aria-hidden` mientras no hay error, en lugar de un bloque vacío fijo de 128px. Los estados se anuncian con una región `aria-live` estable. La altura del panel se conserva durante las transiciones de `AnimatePresence mode="wait"`, incluida la confirmación de éxito, sin animar dimensiones.

`ContactFormBlock.astro` sirve HTML y CSS desde el servidor y monta la isla con `client:visible`. Los controles quedan deshabilitados hasta hidratar para impedir un POST nativo que exponga datos en una navegación sin JavaScript. El bloque `noscript` ofrece WhatsApp. El formulario completo no recibe un reveal con blur; se animan sus cambios de estado con fade y blur de 4px, desactivado con reduced motion. El envío bloquea intentos simultáneos, permite reintentar tras fallas y conserva los valores. Los tipos de React actuales usan `SubmitEvent`.

`src/pages/api/contact.ts` es la única ruta con `prerender = false`. Lee secretos mediante `getSecret()` y delega en `src/lib/contact-handler.ts`. La API acepta JSON, compara el Origin presente con el origen de la solicitud y lee el body como stream, con un límite de **10.240 bytes** incluso sin Content-Length. Devuelve `400` con errores por campo, `403` por origen ajeno, `405` por método, `413` por tamaño y `415` por tipo de contenido. Astro conserva su protección CSRF nativa: un POST de tipo formulario sin Origin propio puede recibir `403` antes del handler.

Tras validar, un honeypot con cualquier valor responde éxito sin leer secretos, enviar ni registrar el payload. En desarrollo sin key, se registra el payload validado y se responde éxito. En producción sin key, o con key pero sin destinatario válido, se devuelve `500`. El envío usa `fetch` a Resend, con `reply_to`, HTML escapado y texto plano; acepta únicamente una respuesta exitosa con ID. Las fallas de proveedor o red responden `502`. Los errores de producción no registran datos personales, credenciales ni cuerpos de respuesta del proveedor. El timeout es de 10 segundos al proveedor y 20 segundos en el navegador; las respuestas llevan `Cache-Control: no-store`.

**Adaptación de Astro 5:** su módulo `astro:env/server` valida anticipadamente los secretos declarados como obligatorios, incluso usando `getSecret()`. Por eso key, destinatario y remitente admiten ausencia en el schema, y la API exige los valores necesarios al momento de enviar. Así funcionan el desarrollo sin credenciales, la validación y el honeypot sin producir errores de carga del módulo. El destinatario sigue siendo obligatorio para un envío real.

`track()` es seguro si `gtag` no existe o falla. El módulo global delega clicks de WhatsApp y Calendly, incluidos links de islas. Solo el éxito del formulario emite `generate_lead`, sin parámetros del formulario; el honeypot no lo emite. El servicio dejó de recolectarse y no se inventa una categoría para analítica. Los eventos propios no incluyen nombres, empresas, emails, plazos ni URLs. GA4 recibe estos eventos solo cuando está configurado.

Referencias: [endpoints de Astro 5](https://v5.docs.astro.build/en/guides/endpoints/), [getSecret](https://v5.docs.astro.build/en/reference/modules/astro-env/), [Zod](https://zod.dev/api), [AnimatePresence](https://motion.dev/docs/react-animate-presence) y [API REST de Resend](https://resend.com/docs/api-reference/emails/send-email).

### Verificación de la Fase 5

`npx astro check`: 52 archivos, sin errores, warnings ni hints. `npm run build`: correcto, con nueve páginas estáticas y `/api/contact` como única ruta por solicitud. Rollup avisa que descarta anotaciones de dos comentarios de Zod 4.6.7; son avisos de la dependencia y no impiden compilar.

Pasaron 44 casos de API con el proveedor simulado y 10 casos de analítica: límites, validación, Origin, honeypot, secretos ausentes, escape HTML, fallas y respuestas del proveedor, clicks y ausencia de `gtag`. El endpoint compilado se verificó en Pages local; el servidor de desarrollo confirmó el log y la respuesta de éxito sin key. No se enviaron emails reales.

Chrome 155: Home en 360, 768, 1024 y 1440px con ambos temas, más el formulario de contacto sobre fondo claro en esos cuatro anchos. Se verificaron hidratación diferida, validación, foco, anuncios, bloqueo de envíos duplicados, reintentos, conservación de valores, estados y alternativa sin JavaScript. Los cambios a error y éxito dieron **CLS 0** en mobile y desktop. El JS inicial de desktop, sin GA y antes de hidratar islas, fue de **55.949 bytes gzip**, incluidos los scripts inline. Capturas, scripts y reportes quedan fuera del repo. La entrega real por Resend y la regla de Cloudflare requieren configurar el entorno de producción; Lighthouse, axe y otros navegadores siguen para la Fase 7.

## SEO, analítica y entrega de la Fase 6

`src/lib/seo.ts` centraliza las URLs canónicas y el JSON-LD, sin dependencias nuevas. Las URLs de páginas terminan en `/` y no incluyen query ni fragmento. `Seo.astro` genera una única descripción, canonical, Open Graph con `es_UY` y Twitter Card con imagen grande, dimensiones y texto alternativo. Los títulos y descripciones de servicios y proyectos vienen de sus colecciones. La 404 tiene `noindex, follow` y canonical fijo a `/404/`, incluso cuando Pages la sirve para una ruta desconocida.

La Home incluye `Organization` y `WebSite`; los servicios agregan `Service` y todas las páginas internas, `BreadcrumbList`. Los servicios tienen dos niveles (Inicio → servicio), porque no existe una página de índice de servicios; el detalle de proyecto agrega el nivel Proyectos. Solo se publican datos confirmados: Uruguay como área, teléfono si WhatsApp está configurado y redes si existen sus URLs. El JSON-LD escapa `<` y separadores Unicode antes de incorporarse al HTML.

`public/og-default.png` mide **1200 × 630** y `public/logo.png`, **600 × 180**. Ambos usan la marca tipográfica, Geist y colores del sitio. Los SVG editables están en `src/assets/brand/`; los PNG se exportaron con las fuentes locales de Fontsource. Para volver a exportarlos, cargá Geist Variable y Geist Mono Variable, respetá las dimensiones del SVG y exportá a PNG con escala 1. Las redes reciben los PNG, sin depender del soporte de SVG. Una portada raster de proyecto se recorta con `getImage()` a proporción 1200:630 sin ampliar, con dimensiones OG acordes al archivo; una portada SVG usa la imagen de marca para compartir.

Sitemap genera `sitemap-index.xml` y sus archivos de páginas. `robots.txt` y el link del head apuntan al índice; la 404 queda excluida. Al confirmar el dominio, actualizá **tanto `site` en `astro.config.mjs` como la URL del sitemap en `public/robots.txt`**, y volvé a compilar.

`Analytics.astro` configura GA4 en Partytown únicamente si hay ID. Desactiva Google Signals y personalización publicitaria, y envía la URL inicial y el referrer sin query ni fragmento. Los tres eventos propios conservan los parámetros de la Fase 5. Al crear la propiedad, revisá sus opciones de medición mejorada antes de activarla. La verificación local usa un tag simulado; la recepción en la propiedad real se confirma después de configurar el ID y publicar.

`public/_headers` aplica los cuatro headers de seguridad solicitados y caché de un año con `immutable` a `/_astro/*`. Cloudflare no aplica ese archivo a respuestas de Functions: `security-headers.ts` agrega los mismos valores a todas las respuestas propias de la API, además de `no-store`. La protección CSRF previa de Astro conserva su comportamiento. No hay CSP en esta versión, como indica la especificación.

Referencias: [Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/), [Partytown en Astro 5](https://v5.docs.astro.build/en/guides/integrations-guide/partytown/), [GA4 en Partytown](https://partytown.qwik.dev/google-tag-manager/), [configuración de GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Service](https://schema.org/Service) y [headers de Pages](https://developers.cloudflare.com/pages/configuration/headers/).

### Verificación de la Fase 6

`npx astro check`: 55 archivos, sin errores, warnings ni hints de código. `npm run build`: correcto, con nueve páginas estáticas y la API por solicitud. Persisten los avisos de comentarios de Zod descritos en la Fase 5.

Chrome 155 sobre Pages local: las nueve páginas tienen un único título, descripción y canonical, tags OG/Twitter coherentes, un h1 y JSON-LD parseable con los tipos y campos previstos. Se comprobaron el sitemap XML con ocho URLs (sin 404 ni API), robots, estado 404 para rutas desconocidas, PNG y sus dimensiones, headers estáticos, caché de assets y headers de la API. Sin ID no hay scripts ni archivos de Partytown; el JS inicial de desktop sigue en **55.949 bytes gzip** sin islas hidratadas.

Con un ID sintético y un tag simulado, Partytown ejecutó el script en un worker y recibió `gtag` y `dataLayer.push`. Los tres eventos llegaron una vez y `generate_lead` incluyó solo `servicio`, sin datos del formulario. Se verificó la portada raster temporal con las dimensiones declaradas; la fixture se retiró y el build final volvió a los placeholders. Los 44 casos de API también pasaron tras agregar headers. No hubo tráfico real a Google ni emails reales. La validación de datos estructurados fue local; los validadores públicos y la propiedad real se revisan con la URL publicada. Reportes y scripts quedan fuera del repo.

### Compatibilidad con Cloudflare Pages

Para conservar el hosting pedido se usa Astro **5.18.2**, `@astrojs/cloudflare` **12.6.13** y `@astrojs/react` **4.4.2**, con versiones fijadas y lockfile. Es una excepción a usar la última versión mayor, acordada con el cliente: el adaptador actual eliminó el soporte de Pages y requiere Cloudflare Workers. TypeScript usa **6.0.3**, la última versión compatible con los peers de `@astrojs/check` **0.9.10** (TypeScript 5 o 6; todavía no admite TypeScript 7). Las demás dependencias se instalan en su última versión estable; Tailwind se mantiene en v4, como pide la especificación.

El adaptador usa `imageService: 'compile'` para optimizar imágenes durante el build de las páginas estáticas. El comando `preview` usa el Wrangler que incluye el adaptador como dependencia transitiva; no se agrega una dependencia directa fuera de la lista permitida.

Referencias: [adaptador compatible con Astro 5](https://v5.docs.astro.build/en/guides/integrations-guide/cloudflare/), [retiro del soporte de Pages en el adaptador actual](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#removed-cloudflare-pages-support).

**Limitación conocida de esta línea:** la auditoría de npm del 17/10/2026 reporta 8 dependencias afectadas (1 crítica, 4 altas, 2 moderadas y 1 baja). Incluye avisos en Astro, el adaptador y sus herramientas transitivas; npm propone versiones mayores para corregirlos, que requieren migrar a Workers. Las páginas de contenido son estáticas, las imágenes se procesan durante el build y el endpoint de contacto se ejecuta por solicitud. La compatibilidad con Pages no equivale a una auditoría limpia. Revisá esta limitación antes de publicar o implementar las funciones afectadas. No se aplica `npm audit fix --force` porque alteraría las versiones y el hosting acordados.

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

En desarrollo sin clave de Resend, la API registra el payload validado en la consola y responde con éxito. En producción sin clave, responde con error. Para un envío real, configurá la key y el destinatario; el remitente es opcional y usa el valor de prueba previsto en la especificación si falta.

### Resend sin dominio verificado

El dominio de prueba de Resend permite enviar únicamente al email del dueño de la cuenta. Para recibir consultas en otros destinatarios, verificá un dominio propio y configurá un remitente de ese dominio mediante `CONTACT_FROM_EMAIL`. Guardá la clave y las direcciones únicamente como secretos del entorno.

Referencia: [restricciones del dominio de prueba de Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Deploy en Cloudflare Pages

1. Conectá el repositorio a un proyecto de **Cloudflare Pages**. No hace falta publicar nada para desarrollar esta fase.
2. Usá la raíz del repositorio como directorio del proyecto, `npm run build` como comando de build y `dist` como directorio de salida.
3. Seleccioná Node.js 22.22 o posterior compatible con `package.json` en el entorno de build (por ejemplo, mediante la variable `NODE_VERSION`). Instalá las dependencias con el lockfile (`npm ci`).
4. En **Settings → Variables and Secrets**, cargá `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y, si corresponde, `CONTACT_FROM_EMAIL` como secretos del runtime de Pages Functions. Configuralos para producción y para los previews que necesiten enviar emails. Las variables `PUBLIC_*` que uses deben estar disponibles al compilar; sus cambios requieren un nuevo build.
5. `/api/contact` lleva `prerender = false`; las demás páginas son estáticas. Habilitá `nodejs_compat` para Pages Functions y elegí una fecha de compatibilidad vigente en la configuración del proyecto, tanto en producción como en previews.
6. Conservá `https://grupo-mat.pages.dev` como `site` provisional. Cuando haya un dominio propio confirmado, cambialo en `astro.config.mjs` y en `public/robots.txt`, y volvé a compilar.

Los valores de los secretos no se escriben en `astro.config.mjs`, el README ni otros archivos versionados. El endpoint de contacto está implementado; esta fase no configura ni publica un proyecto de Cloudflare.

Referencia: [desplegar Astro en Cloudflare Pages con Astro 5](https://v5.docs.astro.build/en/guides/deploy/cloudflare/).

## Cómo agregar proyectos

Las colecciones y rutas están disponibles. No hace falta editar los archivos de páginas:

1. Creá `src/content/proyectos/<slug>.md`. El nombre del archivo define el slug de la página.
2. Agregá el frontmatter con `title`, `client`, `industry`, `summary`, `services`, `stack`, `integrations`, `status`, `featured`, `order`, `seoTitle` y `seoDescription`.
3. Usá `status: en-desarrollo` o `status: lanzado`. Agregá `launchEstimate` solo si hay una estimación confirmada.
4. Guardá las imágenes en `src/assets/proyectos/<slug>/`. Referencialas con rutas relativas desde el Markdown mediante `cover`, `gallery` y `logo`, todos opcionales. Sin imágenes se mostrará `ProjectPlaceholder`.
5. Escribí el cuerpo en Markdown. Agregá `liveUrl` solo si existe un sitio público. Para un proyecto propio con repositorio público, indicá `isOwnProject: true` y `repoUrl`; en proyectos de clientes, omití esos campos.
6. Corré `npm run check` y `npm run build`. La colección generará `/proyectos/<slug>` sin agregar rutas a mano.

Para destacar un proyecto en la Home, usá `featured: true` (normalmente solo uno). Dejá los campos opcionales ausentes si no tenés los datos; las URLs vacías no son válidas. Por ejemplo, desde `src/content/proyectos/districo.md`, una imagen en `src/assets/proyectos/districo/cover.png` se referencia como `cover: ../../assets/proyectos/districo/cover.png`; `gallery` es una lista de rutas con el mismo criterio. No coloques imágenes de contenido en `public/`, porque no pasarían por el pipeline local. Publicá únicamente datos confirmados; mientras falten capturas o fotos se usan los placeholders de la especificación.

Para agregar o editar un servicio, usá `src/content/servicios/<slug>.md` con los campos de los ejemplos existentes; `relatedProject: districo` es opcional y debe apuntar a un proyecto existente. Los archivos `.md` van directamente en la carpeta de su colección.

## Rate limit de contacto en Cloudflare

El límite de la API se configura en Cloudflare, sin código de rate limiting en la aplicación:

1. Seleccioná la zona del dominio del sitio en Cloudflare.
2. Abrí **Security → WAF → Rate limiting rules** (o **Security rules → Rate limiting rules**, según la interfaz del panel) y creá una regla.
3. Filtrá por ruta exacta y método con `(http.request.uri.path eq "/api/contact" and http.request.method eq "POST")`.
4. Usá la IP de origen como característica de conteo y un umbral de **5 solicitudes por 60 segundos por IP**.
5. Elegí la acción **Block** y una duración de mitigación compatible con el plan. Guardá y activá la regla antes de habilitar el formulario en producción.

Los períodos disponibles dependen del plan de Cloudflare. Si el panel no ofrece 60 segundos, el plan debe habilitar ese período para cumplir el límite solicitado. La regla de una zona requiere un dominio bajo esa zona; verificá su aplicación al dominio de producción y no supongas que protege el subdominio compartido de hosting.

Referencia: [crear una regla de rate limiting en Cloudflare](https://developers.cloudflare.com/waf/rate-limiting-rules/create-zone-dashboard/).

## Archivos locales

`MEGA_PROMPT.md` y `.token-optimizer/` son locales y están ignorados a propósito. No los modifiques ni los agregues a commits. `.env`, sus variantes, los archivos locales de secretos de Cloudflare, `node_modules/`, `.astro/`, `.wrangler/` y `dist/` también están ignorados; `.env.example` sí se versiona.

## QA final de la Fase 7

Los resultados de rendimiento de esta sección corresponden al build anterior a los cambios de paleta e idioma. Sus verificaciones específicas están al inicio de `QA_REPORT.md`; no se reutilizan estos puntajes como una nueva medición.

El reporte completo está en [QA_REPORT.md](QA_REPORT.md): Lighthouse mobile/desktop sobre Home, e-commerce B2B y contacto; 144 escenarios funcionales en Chrome, Firefox y WebKit; 15 escenarios de regresión final; axe en 50 estados, sin violaciones detectadas; y traces de scroll e interacciones. Los reportes detallados, scripts y capturas quedan fuera del repo. Tailwind excluye README y el reporte de sus fuentes para que editar documentación no agregue utilidades al CSS del sitio.

Se corrigieron los contrastes persistentes del hero, pasos y nav. La revisión visual de WebKit en Windows encontró una limitación de pesos de fuentes variables que debe verificarse en Safari real. El JS inicial de desktop quedó en **56.861 bytes gzip** sin islas hidratadas. No se registraron tareas de más de 50ms en los traces de scroll; la interacción máxima local fue de 120ms en mobile con CPU 4×. También se comprobó el contenido visible con el módulo de movimiento bloqueado o tardío.

`npx astro check` y `npm run build` pasan. Los puntajes medianos mobile (Performance/Accessibility/Best Practices/SEO) son **98/100/100/100** en Home y **99/100/100/100** en servicio y contacto; desktop da **100/100/100/100** en las tres páginas. El LCP mediano mobile es **2,1413s** en Home y **2,0050s** en e-commerce B2B: ambos quedan fuera del objetivo estricto `< 2s`. Contacto da **1,8573s**. Los rangos de las tres muestras y los demás valores figuran en el reporte; no se marcan todos los presupuestos como cumplidos.

## Pendientes de validación y publicación

- Validar Safari real y reducir el LCP mobile de Home y e-commerce B2B por debajo de 2s con margen estable.
- Confirmar Core Web Vitals de campo, entrega real de Resend y recepción de eventos en GA4 al configurar y publicar.
- Evaluar una CSP después de la v1; queda pendiente por la combinación de Partytown, GA y scripts inline.

El dominio propio, Calendly, GA4, redes sociales, fotos del equipo y capturas de DISTRICO siguen pendientes del cliente. La política de privacidad requiere revisión legal antes de publicar.
