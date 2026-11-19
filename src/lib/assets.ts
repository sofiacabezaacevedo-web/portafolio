import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Originales en src/assets/img. Al compilar se sirven en WebP, con un ancho máximo
// que alcanza para pantallas retina y para la lupa de las fichas técnicas.
const MAX_WIDTH = 3000;
const QUALITY_PHOTO = 82; // jpg
const QUALITY_GRAPHIC = 90; // png: dibujos técnicos y transparencias

const files = import.meta.glob<ImageMetadata>('../assets/img/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});
const byName = new Map(Object.entries(files).map(([path, meta]) => [path.split('/').pop()!, meta]));
const cache = new Map<string, Promise<string>>();

/** URL optimizada de una imagen de src/assets/img. Falla el build si no existe. */
export function imageUrl(name: string): Promise<string> {
  let url = cache.get(name);
  if (!url) {
    const meta = byName.get(name);
    if (!meta) throw new Error(`Imagen no encontrada en src/assets/img: ${name}`);
    url = getImage({
      src: meta,
      format: 'webp',
      width: Math.min(meta.width, MAX_WIDTH),
      quality: meta.format === 'png' ? QUALITY_GRAPHIC : QUALITY_PHOTO,
    }).then((img) => img.src);
    cache.set(name, url);
  }
  return url;
}

const ASSET_PATH = /assets\/([^'"\s)?]+\.(?:jpe?g|png))(?:\?v=\d+)?/g;

async function replaceInString(text: string): Promise<string> {
  const names = [...new Set([...text.matchAll(ASSET_PATH)].map((m) => m[1]))];
  if (names.length === 0) return text;
  const urls = new Map(await Promise.all(names.map(async (n) => [n, await imageUrl(n)] as const)));
  return text.replace(ASSET_PATH, (_, name: string) => urls.get(name)!);
}

/** Recorre un objeto de datos y cambia cada 'assets/<archivo>' por su URL optimizada. */
export async function resolveAssets<T>(value: T): Promise<T> {
  if (typeof value === 'string') return (await replaceInString(value)) as T;
  if (Array.isArray(value)) return (await Promise.all(value.map(resolveAssets))) as T;
  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value).map(async ([k, v]) => [k, await resolveAssets(v)] as const),
    );
    return Object.fromEntries(entries) as T;
  }
  return value;
}
