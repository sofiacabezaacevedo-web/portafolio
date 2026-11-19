// @ts-check
import { defineConfig } from 'astro/config';

// Por defecto el sitio vive en la raíz del dominio (Vercel + dominio propio).
// GitHub Pages lo sirve en /portafolio/, así que su workflow define BASE_PATH.
// SITE_URL solo se usa para la URL absoluta de la imagen al compartir el enlace;
// en Vercel se toma sola del dominio de producción.
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site:
    process.env.SITE_URL ??
    (vercelDomain ? `https://${vercelDomain}` : 'https://sofiacabezaacevedo-web.github.io'),
  base: process.env.BASE_PATH ?? '/',
});
