import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const media = gsap.matchMedia();

function focusTarget(target: HTMLElement) {
  const hadTabIndex = target.hasAttribute('tabindex');
  if (!hadTabIndex) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
}

try {
  media.add('(prefers-reduced-motion: no-preference)', (context) => {
    let anchorTarget: HTMLElement | undefined;
    // Lenis 1.3.27 ya descuenta scroll-margin-top: el offset adicional es cero.
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0, onComplete: () => {
      if (anchorTarget) focusTarget(anchorTarget);
      anchorTarget = undefined;
    } } });
    const tick = (time: number) => { lenis.raf(time * 1000); };
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onMenu = (event: CustomEvent<boolean>) => { if (event.detail) lenis.stop(); else lenis.start(); };
    window.addEventListener('menu:toggle', onMenu);
    if (root.hasAttribute('data-menu-open')) lenis.stop();

    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      try {
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        anchorTarget = target;
        if (location.hash !== url.hash) history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        // El listener de Lenis en window ejecuta el scroll después de este listener.
      } catch { /* Los hashes malformados conservan el comportamiento nativo. */ }
    };
    document.addEventListener('click', onAnchor);

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));
    // Si ya venció el failsafe, no volvemos a ocultar contenido que el usuario vio.
    if (!root.classList.contains('motion-ok')) elements.forEach((element) => element.setAttribute('data-revealed', ''));
    else ScrollTrigger.batch(elements, {
      start: 'top 85%',
      once: true,
      onEnter: (batch: Element[]) => {
        const targets = batch.filter((element): element is HTMLElement => element instanceof HTMLElement);
        if (!targets.length) return;
        gsap.set(targets, { willChange: 'transform,opacity,filter' });
        gsap.to(targets, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', stagger: 0.08,
          onComplete: () => {
            targets.forEach((target) => target.setAttribute('data-revealed', ''));
            gsap.set(targets, { clearProps: 'opacity,transform,filter,willChange' });
          },
        });
      },
    });

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const heroContent = hero?.querySelector<HTMLElement>('[data-hero-content]');
    const startHeroMotion = () => {
      if (!hero || !heroContent || scrollY <= 0) return;
      window.removeEventListener('scroll', startHeroMotion);
      // Registra también el tween creado más tarde para revertirlo con reduced motion.
      context.add(() => gsap.to(heroContent, {
        // El mínimo de 0.9 conserva AA en el texto pequeño mientras sigue visible.
        opacity: 0.9, y: -40, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      }));
    };
    if (hero && heroContent) {
      startHeroMotion();
      if (scrollY <= 0) window.addEventListener('scroll', startHeroMotion, { passive: true });
    }

    const projectVisual = document.querySelector<HTMLElement>('[data-project-visual]');
    const projectImage = projectVisual?.querySelector<HTMLElement>('[data-project-image]');
    if (projectVisual && projectImage) gsap.fromTo(projectImage, { scale: 1.06 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: projectVisual, start: 'top bottom', end: 'bottom center', scrub: true },
    });

    const desktopMotion = gsap.matchMedia();
    desktopMotion.add('(min-width: 1024px)', () => {
      const process = document.querySelector<HTMLElement>('[data-process]');
      const steps = process?.querySelector<HTMLOListElement>('.process-steps');
      const progress = process?.querySelector<HTMLElement>('[data-process-progress]');
      if (!process || !steps || !progress) return;
      gsap.fromTo(progress, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: steps, start: 'top center', end: 'bottom center', scrub: true },
      });
      steps.querySelectorAll<HTMLElement>('[data-process-step]').forEach((step) => gsap.fromTo(step,
        { opacity: 0.9 },
        { opacity: 1, ease: 'none', scrollTrigger: { trigger: step, start: 'top 80%', end: 'top center', scrub: true } },
      ));
    });

    return () => {
      desktopMotion.revert();
      window.removeEventListener('scroll', startHeroMotion);
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('menu:toggle', onMenu);
      gsap.ticker.remove(tick);
      lenis.destroy();
      root.classList.remove('motion-ok');
      elements.forEach((element) => element.setAttribute('data-revealed', ''));
      if (elements.length) {
        gsap.killTweensOf(elements);
        gsap.set(elements, { clearProps: 'opacity,transform,filter,willChange' });
      }
    };
  });
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('pageshow', (event) => { if (event.persisted) ScrollTrigger.refresh(); });
  window.addEventListener('pagehide', (event) => { if (!event.persisted) media.revert(); });
  window.__motionReady = true;
} catch {
  media.revert();
  root.classList.remove('motion-ok');
  console.error('No se pudo iniciar el movimiento. El contenido sigue visible.');
}
