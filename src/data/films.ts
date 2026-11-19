// Fotos a sangre que abren cada proyecto. `imagen` es un archivo de src/assets/img.
export interface Film {
  cs: string;
  id?: string;
  imagen: string;
  fondo: string; // color mientras carga la foto
  posicion?: string;
  etiquetaNegrita?: boolean;
  etiqueta: [string, string];
  cita: string;
  temporada: string;
  indice: string;
}

export const films: Record<string, Film> = {
  apollo: {
    cs: 'apollo-22',
    imagen: 'apolo-22.jpg',
    fondo: '#000',
    etiqueta: ['APOLLO 22', '· PROYECTO COLABORATIVO'],
    cita: '"Built for movement"',
    temporada: 'OTOÑO / INVIERNO 2022',
    indice: '01 / 03',
  },
  littleDreams: {
    cs: 'little-dreams',
    id: 'tecnico',
    imagen: 'little-dreams-cover-v2.jpeg',
    fondo: '#efe9df',
    etiquetaNegrita: true,
    etiqueta: ['LITTLE DREAMS', '· CÁPSULA INFANTIL'],
    cita: '"La memoria del color"',
    temporada: 'PRIMAVERA / VERANO 2023',
    indice: '02 / 03',
  },
  lostOfDelicacy: {
    cs: 'lost-of-delicacy',
    imagen: 'lod-film.png',
    fondo: '#12212f',
    posicion: 'center 45%',
    etiquetaNegrita: true,
    etiqueta: ['LOST OF DELICACY', '· ALTA COSTURA'],
    cita: '"Alta costura para un thriller oscuro"',
    temporada: 'OTOÑO / INVIERNO 24 — 25',
    indice: '03 / 03',
  },
};
