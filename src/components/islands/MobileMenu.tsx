import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { MouseEvent } from 'react';
import type { NavItem } from '@/data/site';

interface Props {
  navigation: readonly NavItem[];
  currentPath: string;
  appointmentUrl: string;
  externalAppointment: boolean;
}

export default function MobileMenu({ navigation, currentPath, appointmentUrl, externalAppointment }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pendingAnchor = useRef<URL | null>(null);
  const reduce = useReducedMotion();
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    root.style.overflow = 'hidden';
    root.setAttribute('data-menu-open', '');
    window.dispatchEvent(new CustomEvent('menu:toggle', { detail: true }));
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'))
        .filter((element) => element.getClientRects().length > 0);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', trapFocus);
    const desktop = matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) { setOpen(false); setActive(false); }
    };
    desktop.addEventListener('change', closeOnDesktop);

    return () => {
      dialog.removeEventListener('keydown', trapFocus);
      desktop.removeEventListener('change', closeOnDesktop);
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      root.removeAttribute('data-menu-open');
      window.dispatchEvent(new CustomEvent('menu:toggle', { detail: false }));
      const anchor = pendingAnchor.current;
      pendingAnchor.current = null;
      if (anchor) {
        const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
        if (target) {
          window.location.hash = anchor.hash;
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.tabIndex = -1;
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
          return;
        }
      }
      const trigger = triggerRef.current;
      if (trigger?.getClientRects().length) trigger.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>('[data-site-header] a')?.focus({ preventScroll: true });
    };
  }, [active]);

  function followLink(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(event.currentTarget.href);
    if (target.origin === location.origin && target.pathname === location.pathname && target.hash) {
      try {
        if (document.getElementById(decodeURIComponent(target.hash.slice(1)))) {
          event.preventDefault();
          pendingAnchor.current = target;
        }
      } catch { /* Un hash malformado conserva la navegación nativa. */ }
    }
    setOpen(false);
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'tween', duration: reduce ? 0 : 0.45, ease }}>
      <LazyMotion features={domAnimation} strict>
        <button ref={triggerRef} type="button" className="mobile-menu-trigger" hidden={!hydrated}
          aria-label="Abrir menú" aria-expanded={open} aria-controls="mobile-menu-panel"
          onClick={() => { setActive(true); setOpen(true); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <dialog id="mobile-menu-panel" ref={dialogRef} className="mobile-menu-panel" aria-label="Menú principal" aria-modal="true" data-lenis-prevent
          onCancel={(event) => { event.preventDefault(); setOpen(false); }}>
        <AnimatePresence onExitComplete={() => setActive(false)}>
          {open && (
            <m.div key="menu" className="mobile-menu-surface" data-lenis-prevent
              initial={{ opacity: 0, y: reduce ? 0 : -8, filter: reduce ? 'none' : 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: reduce ? 'none' : 'blur(0px)' }}
              exit={{ opacity: 0, y: reduce ? 0 : -8, filter: reduce ? 'none' : 'blur(6px)' }}>
              <div className="mobile-menu-top">
                <a href="/" className="mobile-menu-brand" aria-label="Grupo MAT, inicio" onClick={followLink}>Grupo <strong>MAT</strong></a>
                <button ref={closeRef} type="button" className="mobile-menu-trigger" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
              </div>
              <nav aria-label="Navegación principal móvil">
                <ul className="mobile-menu-links">
                  {navigation.map((item, index) => (
                    <m.li key={item.href} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'tween', duration: reduce ? 0 : 0.35, delay: reduce ? 0 : index * 0.05, ease }}>
                      <a href={item.href} aria-current={currentPath === item.href ? 'page' : undefined} onClick={followLink}>{item.label}</a>
                    </m.li>
                  ))}
                </ul>
                <a className="mobile-menu-appointment" href={appointmentUrl} target={externalAppointment ? '_blank' : undefined}
                  rel={externalAppointment ? 'noopener' : undefined} onClick={followLink}>Agendar una llamada</a>
              </nav>
            </m.div>
          )}
        </AnimatePresence>
        </dialog>
      </LazyMotion>
    </MotionConfig>
  );
}
