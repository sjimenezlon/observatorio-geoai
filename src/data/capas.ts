// Definición de capas de mapa disponibles (tile layers reales y públicas)

export interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  category: "base" | "satellite" | "overlay" | "landcover";
  opacity: number;
  maxZoom: number;
  visible: boolean;
  description: string;
}

export const capasDisponibles: MapLayer[] = [
  // === MAPAS BASE ===
  {
    id: "carto-dark",
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    category: "base",
    opacity: 1,
    maxZoom: 20,
    visible: true,
    description: "Mapa base oscuro ideal para visualización de datos",
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    category: "base",
    opacity: 1,
    maxZoom: 19,
    visible: false,
    description: "Mapa colaborativo con vías, edificios y puntos de interés",
  },
  {
    id: "carto-voyager",
    name: "CartoDB Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    category: "base",
    opacity: 1,
    maxZoom: 20,
    visible: false,
    description: "Mapa claro con estilo moderno",
  },

  // === SATELITALES ===
  {
    id: "esri-satellite",
    name: "ESRI Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar",
    category: "satellite",
    opacity: 1,
    maxZoom: 19,
    visible: false,
    description: "Imágenes satelitales de alta resolución (ESRI/Maxar)",
  },
  {
    id: "google-satellite",
    name: "Google Satellite",
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    category: "satellite",
    opacity: 1,
    maxZoom: 20,
    visible: false,
    description: "Imágenes satelitales Google Earth",
  },

  // === OVERLAYS ===
  {
    id: "carto-labels",
    name: "Etiquetas",
    url: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO",
    category: "overlay",
    opacity: 0.8,
    maxZoom: 20,
    visible: false,
    description: "Nombres de calles y lugares (overlay sobre satélite)",
  },
  {
    id: "stamen-toner-lines",
    name: "Stamen Líneas",
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a>',
    category: "overlay",
    opacity: 0.4,
    maxZoom: 20,
    visible: false,
    description: "Líneas de vías y ríos como overlay",
  },

  // === LAND COVER (ESRI 10m) ===
  {
    id: "esri-landcover-2024",
    name: "ESRI Land Cover 2024",
    url: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri - Sentinel-2 10m Land Use/Land Cover",
    category: "landcover",
    opacity: 0.65,
    maxZoom: 15,
    visible: false,
    description: "Cobertura del suelo 2024 (10m, 10 clases) derivada de Sentinel-2",
  },
];

// Colores de la leyenda ESRI Land Cover
export const esriLandCoverLegend = [
  { clase: 1, nombre: "Sin datos", color: "#ffffff" },
  { clase: 2, nombre: "Árboles", color: "#1a9641" },
  { clase: 4, nombre: "Veg. inundada", color: "#7bc87c" },
  { clase: 5, nombre: "Cultivos", color: "#e9ffbe" },
  { clase: 7, nombre: "Construido", color: "#ed1c24" },
  { clase: 8, nombre: "Suelo desnudo", color: "#b09a71" },
  { clase: 9, nombre: "Nieve/Hielo", color: "#f2faff" },
  { clase: 10, nombre: "Nubes", color: "#b4b4b4" },
  { clase: 11, nombre: "Pastizales", color: "#d2e680" },
];
