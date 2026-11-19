# Portafolio · Sofia Cabeza Acevedo

Sitio estático hecho con [Astro](https://astro.build). Se publica en GitHub Pages en
https://sofiacabezaacevedo-web.github.io/portafolio/ cada vez que se sube un cambio a `main`.

## Comandos

Requiere Node 22.23 o superior y pnpm.

| Comando        | Qué hace                                            |
| -------------- | --------------------------------------------------- |
| `pnpm install` | Instala las dependencias                            |
| `pnpm dev`     | Servidor local en http://localhost:4321/portafolio/ |
| `pnpm build`   | Genera el sitio final en `dist/`                    |
| `pnpm preview` | Sirve `dist/` para revisarlo antes de publicar      |
| `pnpm check`   | Revisa tipos y errores en los componentes           |

## Dónde se edita cada cosa

| Qué                                    | Archivo                                         |
| -------------------------------------- | ----------------------------------------------- |
| Experiencia profesional                | `src/data/experiencia.ts`                       |
| Fotos a sangre de cada proyecto        | `src/data/films.ts`                             |
| Casos de estudio (láminas, textos)     | `src/data/projects.js`                          |
| Traducción al inglés                   | `src/i18n/en.json`                              |
| Hero, acerca de mí y contacto          | `src/components/*.astro`                        |
| Estilos                                | `src/styles/`                                   |
| Hojas de vida (PDF), GIF y video       | `public/assets/`                                |
| Fotos e ilustraciones                  | `src/assets/img/`                               |

Las fotos se guardan en su resolución original en `src/assets/img/`. Al compilar, Astro las
convierte a WebP con un ancho máximo de 3000 px, así que no hace falta comprimirlas a mano.
En los datos se citan como `'assets/<archivo>'`; si un archivo no existe, el build falla y dice cuál.

La traducción funciona por texto exacto: si se cambia un texto en español, hay que cambiar
también su llave en `src/i18n/en.json` o esa frase se queda en español en la versión en inglés.

## Primera publicación

En el repositorio de GitHub, ir a Settings → Pages y en "Source" elegir **GitHub Actions**.
Desde ahí cada push a `main` publica solo (workflow en `.github/workflows/deploy.yml`).

Para usar un dominio propio, cambiar `site` en `astro.config.mjs` y quitar `base`.
