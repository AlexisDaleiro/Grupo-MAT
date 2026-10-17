/// <reference types="astro/client" />

interface Window {
  __motionReady?: boolean;
}

interface WindowEventMap {
  'menu:toggle': CustomEvent<boolean>;
}
