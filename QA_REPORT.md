# QA de Grupo MAT — Fase 7

## Selector de idioma ES/EN

El cliente reemplazó el cambio de tema por un selector de español e inglés. La paleta actual se conserva con base clara y bandas ciruela. Español es el idioma inicial; la elección se guarda y se sincroniza entre pestañas. Se tradujeron las nueve rutas, navegación, FAQ, contenido de DISTRICO, etiquetas accesibles, metadatos de la vista, WhatsApp y estados del formulario.

Verificación del build con SHA-256 `08c85cff7569aa4064c3adc54cfc95374394dceca682cf26901ea0e7d2bd880a`:

- `npx astro check`: 62 archivos, 0 errores, 0 warnings y 0 hints. `npm run build`: correcto; continúan únicamente los avisos ya conocidos de comentarios de Zod.
- 144 vistas ES/EN aprobadas: nueve rutas a 360, 768, 1024 y 1440px en Chrome; las nueve rutas a 360 y 1440px en Firefox y WebKit. Se verificaron traducciones, ausencia de overflow, metadatos, teclado del menú, restauración de foco y ausencia de pedidos de red al elegir idioma.
- 12 vistas adicionales sin JavaScript aprobadas: Home y contacto a 360 y 1440px en los tres motores. Se conserva el contenido español y la navegación alternativa; el selector queda oculto.
- Axe-core 4.14.0: 50 estados en ES/EN, ninguna violación detectada. Se corrigieron los nombres accesibles de los botones para incluir sus códigos visibles ES y EN. La limitación de axe frente a gradientes y la validación pendiente de Safari real siguen aplicando.
- Cinco casos de estado y persistencia aprobados: formulario a 360 y 1440px con valores y selección conservados, validación de cliente, error 400, error 500 y éxito mediante respuestas simuladas; persistencia al navegar y recargar, sincronización entre pestañas y funcionamiento con almacenamiento bloqueado. Los valores enviados a la API conservan sus identificadores españoles. No se enviaron emails reales.
- JS inicial de desktop: 57.399 bytes gzip sin islas hidratadas ni GA, dentro del límite de 60.000. SEO base, JSON-LD, sitemap, robots, headers y recursos de marca vuelven a validar localmente.

Se midieron además 40 cambios de idioma en Chrome sobre la Home, con CPU 4×, sin otros tests de navegador en paralelo. El tiempo máximo desde el click hasta dos `requestAnimationFrame` fue de 154,5ms a 360px y 141,9ms a 1440px. No hubo pedidos de red. La medición incluye la actualización de idioma y el recálculo de posiciones del movimiento; es una prueba local de respuesta, no INP de campo.

Las traducciones estáticas se incluyen en el HTML y se seleccionan con CSS. Las islas se sincronizan mediante `useSyncExternalStore`; la verificación detectó y corrigió una actualización diferida del formulario en WebKit. Se conservan la URL, nodos de los controles y estado del formulario. El español sigue siendo la base del HTML estático y los datos estructurados; este selector no crea rutas `/en/` indexables por separado. `WebSite.inLanguage` declara ES y EN.

Evidencia fuera del repo: `language-qa-*.json`, `language-axe.json`, `language-state.json`, `language-speed.json`, `language-seo.json` y capturas `language-*.png`. Los apartados de paleta y rendimiento que siguen documentan builds anteriores; Lighthouse y los traces de scroll no se repitieron para este ajuste, y los pendientes de LCP no se dan por cerrados.

## Cambio de paleta posterior al QA

El cliente pidió Discreet Palette: `#800000`, `#BB8376`, `#FFF4EE` y `#582B39`. Se actualizaron ambos temas, los efectos decorativos, controles, colores del navegador y recursos de marca. Los puntajes de Lighthouse y traces que siguen corresponden al build anterior a este ajuste; permanecen como evidencia histórica.

Verificación de la nueva paleta:

- `npx astro check`: 55 archivos, 0 errores, 0 warnings y 0 hints. `npm run build`: correcto; persisten los avisos conocidos de comentarios de Zod.
- Axe-core 4.14.0: 50 estados, ninguna violación detectada. Incluye las nueve rutas, ambos temas, menú abierto y estados de validación, error y éxito del formulario.
- 46 comprobaciones de contraste aprobadas: texto principal/secundario, enlaces, errores, botones y hover, bordes de inputs, foco, navegación de cristal y composición de opacidad durante el scroll. El menor ratio entre las muestras de texto normal fue 4,71:1; el extremo del degradado de texto grande supera 3,69:1 aun con una composición conservadora de glow y grid.
- 15 escenarios de regresión aprobados en Chrome 155, Firefox 155 y WebKit 26.5, a 360 y 1440px en ambos temas, más el flujo del formulario con reduced motion. Se revisaron visualmente capturas del hero y de las tarjetas en claro y oscuro. Safari real sigue pendiente, como se detalla más abajo.
- Sin JavaScript: fondo crema, bandas ciruela y ausencia de overflow comprobados a 360 y 1440px. El cambio de tema actualiza `theme-color` con los nuevos colores.
- SEO, JSON-LD, sitemap, robots, PNG y headers: verificación local aprobada. JS inicial de desktop: 56.863 bytes gzip, sin islas hidratadas y sin GA.

Los botones sobre oscuro combinan `#BB8376` con tinta derivada `#2C131B`; los de zonas claras usan rojo `#800000` y texto crema. Los textos secundarios y el degradado del titular usan tonos más claros derivados de la paleta para conservar AA. El borde de los campos usa `field-border` separado del borde decorativo de las tarjetas.

La evidencia nueva se conserva fuera del repo como `palette-axe.json`, `palette-contrast.json`, `palette-seo.json`, `palette-browsers-*-smoke.json` y capturas `palette-*.png`. El hash SHA-256 de `dist/index.html` verificado es `f00b38c63227c6d2f870282235e7f3f91a8a0953b2788b1db3db97a381c811b4`. No se repitió Lighthouse ni se dan por cerrados los pendientes de LCP del QA anterior.

Fecha: 18/10/2026. Build de producción servido con Wrangler Pages local en Windows, sin GA configurado. Se mantuvieron las versiones de Astro 5 y adaptador 12 acordadas para Pages. No se publicaron cambios ni se enviaron emails reales.

## Lighthouse

Lighthouse 13.5.0 y Chrome 155. Configuración estándar mobile/desktop, caché fría y categorías completas solicitadas. Mobile usa la mediana de tres ejecuciones del mismo build; desktop, una ejecución. Las mediciones se hicieron sin otros tests de navegador en paralelo.

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP (s) | CLS | TBT (ms) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | mobile | 98 | 100 | 100 | 100 | 2,1413 | 0,00068 | 0 |
| E-commerce B2B | mobile | 99 | 100 | 100 | 100 | 2,0050 | 0,00068 | 0 |
| Contacto | mobile | 99 | 100 | 100 | 100 | 1,8573 | 0,00068 | 0 |
| Home | desktop | 100 | 100 | 100 | 100 | 0,3408 | 0,00510 | 0 |
| E-commerce B2B | desktop | 100 | 100 | 100 | 100 | 0,3462 | 0,00000 | 0 |
| Contacto | desktop | 100 | 100 | 100 | 100 | 0,3059 | 0,00000 | 0 |

Todos los puntajes cumplen el mínimo de 95. Rangos de LCP mobile de las tres muestras:

- Home: 2,0016–2,3377 s; mediana 2,1413 s (fuera del objetivo estricto de < 2 s).
- E-commerce B2B: 1,9964–2,2023 s; mediana 2,0050 s (fuera del objetivo estricto de < 2 s).
- Contacto: 1,8444–1,8699 s; mediana 1,8573 s (dentro del objetivo).

Los JSON y HTML completos conservan cada ejecución; se reporta la mediana y el rango, sin seleccionar solo la mejor muestra. Son datos de laboratorio sobre HTTP/1.1 local; los Core Web Vitals de usuarios reales requieren medición después de publicar.

## Scroll e interacciones

Trace CDP de Chrome y PerformanceObserver sobre la Home completa, con scroll de ida y vuelta e hidratación del formulario al llegar a él. Las interacciones incluyen tema, FAQ, validación por teclado y menú mobile. Se aplica CPU 4× en las interacciones mobile; el trace de scroll usa la CPU sin ralentización.

| Perfil | Frame P95 (ms) | Frame máximo (ms) | Tareas > 50 ms, trace | Tareas > 50 ms, observer | CLS observado | Interacción máxima registrada (ms) | CPU interacción |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| desktop | 5,60 | 88,80 | 0 | 0 | 0,00004 | 32 | 1× |
| mobile | 5,60 | 22,20 | 0 | 0 | 0,00082 | 120 | 4× |

El P95 de los intervalos entre frames es inferior a 16,7 ms, pero hubo pausas aisladas de hasta 88,8 ms en desktop y 22,2 ms en mobile. No se observaron tareas mayores a 50 ms en el hilo principal; estos datos no garantizan 60 fps constantes en todos los equipos.

La duración de interacción proviene de Event Timing y agrupa por interactionId. Es una muestra local, no el INP de campo del percentil 75. Las entradas menores a 16 ms quedan fuera del umbral del observer. Se conservaron los traces completos para inspección.

JS inicial de desktop, antes de hidratar islas y sin GA: **56.861 bytes gzip**, incluidos scripts inline. Cumple el límite de 60.000 bytes. React se descarga al hidratar una isla.

## Accesibilidad

Axe-core 4.14.0: **50 estados**, **0 violaciones detectadas**, con reglas WCAG 2 A/AA, 2.1 A/AA, 2.2 AA y buenas prácticas. Cubre nueve rutas en claro y oscuro a 360 y 1440px, menú abierto y formulario con errores de cliente, error de servidor y éxito.

Los gradientes, pseudo-elementos y fondos superpuestos generan comprobaciones de contraste incompletas en axe. Se revisaron los tokens y se calcularon además las composiciones de opacidad persistentes durante el scroll y del nav sobre una banda oscura:

| Elemento | Ancho | Tema | Contraste calculado | Resultado |
| --- | ---: | --- | ---: | --- |
| hero | 360 | banda oscura | 5,63:1 | PASS |
| hero | 1440 | banda oscura | 5,66:1 | PASS |
| process | 1440 | light | 5,72:1 | PASS |
| glass-navigation | 1440 | light | 7,55:1 | PASS |
| process | 1440 | dark | 5,95:1 | PASS |
| glass-navigation | 1440 | dark | 17,06:1 | PASS |

Se corrigieron tres casos reales: texto del hero con 2,69–2,81:1 al desvanecerse, pasos del proceso con 2,08–2,38:1 y links del nav de cristal con 3,91:1 sobre una banda oscura en tema claro. Hero y pasos conservan opacidad mínima 0,9; el nav usa fg cuando está en cristal. Esta adaptación prioriza AA sobre las opacidades 0,3 y 0,4 de la referencia. El cálculo del hero contempla también el fondo más claro de su grid.

Se verificaron teclado, foco visible, trap y Escape del menú, restauración de foco, foco en errores y éxito del formulario, anuncios aria-live, controles de al menos 44px, FAQ nativa, reduced motion y navegación alternativa sin JavaScript. Axe complementa estas pruebas; no sustituye una certificación manual de WCAG.

Los dos escenarios de arranque con el módulo de movimiento bloqueado o demorado también pasaron: el contenido se mantiene visible y una carga tardía no vuelve a ocultarlo.

## Navegadores y diseño responsive

| Navegador o motor | Versión | Escenarios | Resultado |
| --- | --- | ---: | --- |
| chrome | 155.0.8059.80 | 48 | PASS |
| firefox | 155.0 | 48 | PASS |
| webkit | 26.5 | 48 | PASS |

Los 144 escenarios cubren Home, servicio y contacto: 360, 768, 1024 y 1440px, ambos temas y movimiento normal; reduced motion y sin JavaScript se repiten a 360 y 1440px. Se verificaron overflow, encabezados, visibilidad, áreas táctiles, tema, menú, FAQ y estados del formulario. Después de los ajustes finales se ejecutaron además 15 escenarios de regresión en los tres motores y se guardaron capturas de viewport. Sin JavaScript, el tema base es claro y las bandas de marca mantienen su estilo oscuro.

**Safari real queda pendiente:** WebKit 26.5 es el motor de prueba de Playwright ejecutado en Windows, no una sesión de Safari en macOS o iOS.

La revisión visual encontró pesos tipográficos más finos en WebKit de Windows, aunque el CSS declara los pesos correctos de Geist. Esto coincide con el [problema de fuentes variables reportado en Playwright](https://github.com/microsoft/playwright/issues/43004). Se registra como límite de este motor de QA; la fidelidad tipográfica de Safari queda pendiente de una prueba en Apple.

## Cambios derivados del QA

- CSS de cada página inline en el HTML para reducir pedidos bloqueantes. A cambio, ese CSS viaja con cada página y no usa un archivo compartido en caché entre vistas.
- Prioridad alta para la única fuente precargada: Geist latin.
- H1 y lead de PageHeader visibles desde el HTML; contenido secundario del hero conserva sus entradas CSS.
- Carga del módulo global de movimiento después de load y dos rAF; se mantiene el failsafe de contenido visible.
- Efecto del hero creado al iniciar el scroll y registrado en el contexto de GSAP para limpiarse al activar reduced motion.
- Glow radial sin el filtro de blur de 40px; opacidades y nav ajustados por contraste.
- README y este reporte excluidos de la detección de Tailwind: la documentación no agrega utilidades al CSS entregado.

No se agregaron dependencias al proyecto ni se modificó el contenido comercial. Lighthouse y axe están instalados fuera del repo, junto con los scripts y reportes de QA.

## Verificación de entrega y pendientes

`npx astro check`: 55 archivos, 0 errores, 0 warnings y 0 hints. `npm run build`: correcto, nueve páginas estáticas y API por solicitud. Persisten los avisos de Rollup por comentarios de Zod ya documentados. La validación local de SEO, sitemap, robots y headers volvió a pasar.

- LCP Home mobile: 2,1413 s de mediana; el objetivo estricto es < 2 s. El valor sin redondear es 2141,3360 ms. No se marca este presupuesto como cumplido; las muestras no ofrecen margen estable.
- LCP E-commerce B2B mobile: 2,0050 s de mediana; el objetivo estricto es < 2 s. El valor sin redondear es 2004,9759 ms. No se marca este presupuesto como cumplido; las muestras no ofrecen margen estable.
- Validar Safari real en un equipo Apple.
- Confirmar CWV de campo, entrega real de Resend y recepción en GA4 al configurar y publicar. La regla de rate limiting de Cloudflare y los datos pendientes del cliente siguen documentados en README.
- Se conserva la limitación de dependencias de Astro 5/Pages descrita en README; los puntajes de Best Practices no equivalen a una auditoría de seguridad de dependencias.

MEGA_PROMPT.md y .token-optimizer/ permanecen ignorados y no se incorporan a los commits. La Fase 7 queda pendiente de revisión del cliente.

## Evidencia

Los artefactos están fuera del repo: phase-7-lighthouse*.json, phase-7-lh-*.html/json, phase-7-axe.json, phase-7-browsers-*.json, phase-7-contrast.json, phase-7-performance.json, phase-7-startup.json, phase-7-scroll-*.json y capturas phase-7-*.png. phase-7-summary.json reúne los resultados. Los artefactos previos de diagnóstico se distinguen con baseline; las tres muestras finales comparten el mismo hash de build.

Referencias: [Lighthouse](https://github.com/GoogleChrome/lighthouse), [variabilidad de Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md), [axe-core](https://github.com/dequelabs/axe-core), [WebKit de Playwright](https://playwright.dev/docs/browsers#webkit), [INP](https://web.dev/articles/inp) y [contextos de GSAP](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/).
