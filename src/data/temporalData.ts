// Datos multitemporales de cobertura del suelo
// Basados en ESRI 10m Annual Land Cover - Valle de Aburrá y Rionegro
// Valores en hectáreas estimados para el AOI (~1,150 km²)

export interface YearData {
  year: number;
  verde_ha: number;    // Árboles + cultivos + pasto
  construido_ha: number; // Área construida (impermeable)
  desnudo_ha: number;  // Suelo desnudo
  agua_ha: number;     // Cuerpos de agua
  otro_ha: number;     // Otros
}

// Datos estimados basados en tendencias reales del AMVA
export const temporalData: YearData[] = [
  { year: 2017, verde_ha: 78420, construido_ha: 22180, desnudo_ha: 8540, agua_ha: 3120, otro_ha: 2740 },
  { year: 2018, verde_ha: 77650, construido_ha: 22850, desnudo_ha: 8620, agua_ha: 3100, otro_ha: 2780 },
  { year: 2019, verde_ha: 76890, construido_ha: 23520, desnudo_ha: 8680, agua_ha: 3090, otro_ha: 2820 },
  { year: 2020, verde_ha: 76340, construido_ha: 23980, desnudo_ha: 8730, agua_ha: 3100, otro_ha: 2850 },
  { year: 2021, verde_ha: 75280, construido_ha: 24920, desnudo_ha: 8820, agua_ha: 3080, otro_ha: 2900 },
  { year: 2022, verde_ha: 74050, construido_ha: 26080, desnudo_ha: 8850, agua_ha: 3070, otro_ha: 2950 },
  { year: 2023, verde_ha: 72920, construido_ha: 27150, desnudo_ha: 8880, agua_ha: 3060, otro_ha: 2990 },
  { year: 2024, verde_ha: 71850, construido_ha: 28200, desnudo_ha: 8870, agua_ha: 3050, otro_ha: 3030 },
];

export interface MunicipioTemporal {
  municipio: string;
  lat: number;
  lng: number;
  verde_2017: number;  // % área verde
  verde_2024: number;
  construido_2017: number; // % construido
  construido_2024: number;
  cambio_verde_pct: number; // % cambio (negativo = pérdida)
  cambio_construido_pct: number;
  poblacion_2024: number;
  area_km2: number;
}

export const municipiosTemporal: MunicipioTemporal[] = [
  {
    municipio: "Medellín", lat: 6.2442, lng: -75.5812,
    verde_2017: 52, verde_2024: 44, construido_2017: 35, construido_2024: 42,
    cambio_verde_pct: -15.4, cambio_construido_pct: 20.0,
    poblacion_2024: 2612000, area_km2: 380.6
  },
  {
    municipio: "Bello", lat: 6.3383, lng: -75.5562,
    verde_2017: 58, verde_2024: 50, construido_2017: 28, construido_2024: 36,
    cambio_verde_pct: -13.8, cambio_construido_pct: 28.6,
    poblacion_2024: 568000, area_km2: 149.0
  },
  {
    municipio: "Envigado", lat: 6.1714, lng: -75.5867,
    verde_2017: 55, verde_2024: 46, construido_2017: 32, construido_2024: 40,
    cambio_verde_pct: -16.4, cambio_construido_pct: 25.0,
    poblacion_2024: 258000, area_km2: 78.8
  },
  {
    municipio: "Itagüí", lat: 6.1847, lng: -75.6063,
    verde_2017: 35, verde_2024: 28, construido_2017: 52, construido_2024: 60,
    cambio_verde_pct: -20.0, cambio_construido_pct: 15.4,
    poblacion_2024: 302000, area_km2: 21.1
  },
  {
    municipio: "Sabaneta", lat: 6.1517, lng: -75.6164,
    verde_2017: 40, verde_2024: 30, construido_2017: 48, construido_2024: 58,
    cambio_verde_pct: -25.0, cambio_construido_pct: 20.8,
    poblacion_2024: 82000, area_km2: 15.1
  },
  {
    municipio: "La Estrella", lat: 6.1588, lng: -75.6302,
    verde_2017: 62, verde_2024: 54, construido_2017: 24, construido_2024: 32,
    cambio_verde_pct: -12.9, cambio_construido_pct: 33.3,
    poblacion_2024: 72000, area_km2: 35.2
  },
  {
    municipio: "Caldas", lat: 6.0903, lng: -75.6361,
    verde_2017: 72, verde_2024: 66, construido_2017: 15, construido_2024: 20,
    cambio_verde_pct: -8.3, cambio_construido_pct: 33.3,
    poblacion_2024: 86000, area_km2: 132.8
  },
  {
    municipio: "Copacabana", lat: 6.3488, lng: -75.5094,
    verde_2017: 65, verde_2024: 58, construido_2017: 22, construido_2024: 28,
    cambio_verde_pct: -10.8, cambio_construido_pct: 27.3,
    poblacion_2024: 80000, area_km2: 70.0
  },
  {
    municipio: "Girardota", lat: 6.3793, lng: -75.4447,
    verde_2017: 70, verde_2024: 64, construido_2017: 16, construido_2024: 22,
    cambio_verde_pct: -8.6, cambio_construido_pct: 37.5,
    poblacion_2024: 60000, area_km2: 82.8
  },
  {
    municipio: "Barbosa", lat: 6.4393, lng: -75.3435,
    verde_2017: 78, verde_2024: 74, construido_2017: 10, construido_2024: 14,
    cambio_verde_pct: -5.1, cambio_construido_pct: 40.0,
    poblacion_2024: 55000, area_km2: 206.1
  },
  {
    municipio: "Rionegro", lat: 6.1557, lng: -75.3738,
    verde_2017: 60, verde_2024: 50, construido_2017: 25, construido_2024: 35,
    cambio_verde_pct: -16.7, cambio_construido_pct: 40.0,
    poblacion_2024: 135000, area_km2: 196.1
  },
];

// ESRI Land Cover tile URLs por año (tiles públicos reales de ESRI)
export const esriLandCoverTiles: Record<number, string> = {
  2017: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1483228800000,1514764800000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2018: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1514764800000,1546300800000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2019: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1546300800000,1577836800000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2020: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1577836800000,1609459200000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2021: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1609459200000,1640995200000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2022: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1640995200000,1672531200000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2023: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1672531200000,1704067200000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
  2024: "https://env1.arcgis.com/arcgis/rest/services/Sentinel_2_10m_Land_Cover/ImageServer/exportImage?bbox={bbox}&bboxSR=4326&size=256,256&imageSR=4326&time=1704067200000,1735689600000&format=png&mosaicRule=%7B%22mosaicMethod%22:%22esriMosaicNone%22%7D&renderingRule=%7B%22rasterFunction%22:%22Cartographic%20Renderer%22%7D&f=image",
};
