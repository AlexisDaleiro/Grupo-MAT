/// <reference types="astro/client" />

interface Window {
  __motionReady?: boolean;
  gtag?: (...args: unknown[]) => void;
}

interface WindowEventMap {
  'menu:toggle': CustomEvent<boolean>;
}
