// Experiencia profesional, de la más reciente a la primera.
// `cs` es la clave del caso de estudio en projects.js; `nombreIt` va en cursiva.
export interface Experiencia {
  cs: string;
  nombre: string;
  nombreIt?: string;
  rol: string;
  descripcion: string;
  periodo: string;
}

export const experiencia: Experiencia[] = [
  {
    cs: 'isaac-morris',
    nombre: 'Isaac',
    nombreIt: 'Morris',
    rol: 'Coordinadora de fichas técnicas · Freelance remoto',
    descripcion:
      'Fichas técnicas, color callouts y artes de estampación para niños y toddlers, con gestión de artes licenciados. Cuentas de retail en EE. UU.: Walmart, TJX y Burlington.',
    periodo: '2026 → Actualidad',
  },
  {
    cs: 'baobab',
    nombre: 'Baobab',
    rol: 'Analista de fichas técnicas · Lujo sostenible',
    descripcion:
      'Fichas técnicas de resort y vestidos de gala para Holiday (Cápsula 25), Mil Colores (SS26) y Sicilia (HS26). Seguimiento de muestras y atributos de producto con marketing.',
    periodo: '2025 → 2026',
  },
  {
    cs: 'arturo-calle-corporativo',
    nombre: 'Arturo Calle',
    nombreIt: 'Negocios Corporativos',
    rol: 'Auxiliar de diseño · Dotación',
    descripcion:
      'Desarrollo de producto, fichas técnicas y seguimiento de muestras y producción en planta. Gestión de proveedores y calidad para Policía de Chile, Porvenir y Hotel Estelar, entre otros.',
    periodo: '2024 → 2025',
  },
  {
    cs: 'signatura',
    nombre: 'Arturo Calle',
    nombreIt: 'Signatura',
    rol: 'Practicante de diseño y marca · Made-to-measure',
    descripcion:
      'Desarrollo y comunicación de producto a la medida en sastrería, camisería y calzado. Identidad de marca, ilustración digital, tendencias del sector lujo y atención al cliente bilingüe.',
    periodo: '2023 → 2024',
  },
];
