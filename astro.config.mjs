// @ts-check
import { defineConfig } from 'astro/config';

// Se publica en GitHub Pages: https://sofiacabezaacevedo-web.github.io/portafolio/
// Con dominio propio: cambiar `site` y quitar `base`.
export default defineConfig({
  site: 'https://sofiacabezaacevedo-web.github.io',
  base: '/portafolio',
});
