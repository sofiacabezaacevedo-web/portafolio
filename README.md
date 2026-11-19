# Portafolio · Sofia Cabeza Acevedo

Sitio estático hecho con [Astro](https://astro.build). Se publica en Vercel, conectado a este
repositorio: cada push a `main` despliega el dominio propio. También queda una copia en GitHub Pages
(https://sofiacabezaacevedo-web.github.io/portafolio/).

## Comandos

Requiere Node 22.23 o superior y pnpm.

| Comando        | Qué hace                                            |
| -------------- | --------------------------------------------------- |
| `pnpm install` | Instala las dependencias                            |
| `pnpm dev`     | Servidor local en http://localhost:4321/            |
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

## Publicación y rutas

El sitio se compila para la raíz del dominio. GitHub Pages lo sirve en `/portafolio/`, así que su
workflow (`.github/workflows/deploy.yml`) compila con `BASE_PATH=/portafolio`. Si se deja de usar
GitHub Pages, se puede borrar ese workflow y apagar Pages en Settings → Pages.
