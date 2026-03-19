// Segmentos de red de infraestructura simulados sobre Valle de Aburrá y Rionegro
// Geometrías reales sobre vías y zonas conocidas de la región
import type { FeatureCollection, Feature, LineString } from "geojson";

export interface SegmentProperties {
  id: string;
  tipo_red: string;
  cobertura: "zona_verde" | "via_pavimentada" | "via_destapada" | "bajo_construccion";
  confianza: number;
  ndvi: number;
  ndbi: number;
  bsi: number;
  fuente: string;
  municipio: string;
  longitud_m: number;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  zona_verde: "#22c55e",
  via_pavimentada: "#6b7280",
  via_destapada: "#d97706",
  bajo_construccion: "#ef4444",
};

// Generador de segmentos realistas por zona
function seg(
  id: string,
  coords: [number, number][],
  tipo_red: string,
  cobertura: SegmentProperties["cobertura"],
  municipio: string,
  confianza: number,
  ndvi: number,
  ndbi: number,
  bsi: number
): Feature<LineString, SegmentProperties> {
  const dx = coords[coords.length - 1][0] - coords[0][0];
  const dy = coords[coords.length - 1][1] - coords[0][1];
  const longitud_m = Math.round(Math.sqrt(dx * dx + dy * dy) * 111320);
  return {
    type: "Feature",
    properties: {
      id,
      tipo_red,
      cobertura,
      confianza,
      ndvi: Math.round(ndvi * 1000) / 1000,
      ndbi: Math.round(ndbi * 1000) / 1000,
      bsi: Math.round(bsi * 1000) / 1000,
      fuente: confianza > 0.85 ? "dynamic_world+osm" : confianza > 0.7 ? "dynamic_world+indices" : "indices",
      municipio,
      longitud_m,
      color: COLOR_MAP[cobertura],
    },
    geometry: {
      type: "LineString",
      coordinates: coords,
    },
  };
}

export const redesEPM: FeatureCollection<LineString, SegmentProperties> = {
  type: "FeatureCollection",
  features: [
    // ===== MEDELLÍN CENTRO =====
    seg("MDE-AC-001", [[-75.5694, 6.2518], [-75.5680, 6.2530], [-75.5665, 6.2538]], "acueducto", "via_pavimentada", "Medellín", 0.92, 0.08, 0.18, 0.05),
    seg("MDE-AC-002", [[-75.5665, 6.2538], [-75.5648, 6.2549], [-75.5635, 6.2555]], "acueducto", "via_pavimentada", "Medellín", 0.89, 0.10, 0.16, 0.07),
    seg("MDE-AC-003", [[-75.5635, 6.2555], [-75.5620, 6.2562], [-75.5605, 6.2570]], "acueducto", "bajo_construccion", "Medellín", 0.87, 0.05, 0.22, 0.04),
    seg("MDE-AL-001", [[-75.5720, 6.2480], [-75.5705, 6.2495], [-75.5690, 6.2510]], "alcantarillado", "via_pavimentada", "Medellín", 0.94, 0.07, 0.20, 0.03),
    seg("MDE-AL-002", [[-75.5690, 6.2510], [-75.5678, 6.2522], [-75.5665, 6.2535]], "alcantarillado", "bajo_construccion", "Medellín", 0.85, 0.04, 0.25, 0.03),
    seg("MDE-GS-001", [[-75.5740, 6.2500], [-75.5728, 6.2515], [-75.5715, 6.2528]], "gas", "via_pavimentada", "Medellín", 0.91, 0.09, 0.17, 0.06),
    seg("MDE-GS-002", [[-75.5715, 6.2528], [-75.5700, 6.2540], [-75.5685, 6.2550]], "gas", "zona_verde", "Medellín", 0.78, 0.42, -0.05, 0.02),

    // ===== MEDELLÍN POBLADO (más verde) =====
    seg("MDE-AC-010", [[-75.5758, 6.2088], [-75.5742, 6.2100], [-75.5725, 6.2112]], "acueducto", "zona_verde", "Medellín", 0.93, 0.58, -0.12, 0.01),
    seg("MDE-AC-011", [[-75.5725, 6.2112], [-75.5710, 6.2125], [-75.5695, 6.2138]], "acueducto", "zona_verde", "Medellín", 0.90, 0.52, -0.08, 0.02),
    seg("MDE-AC-012", [[-75.5695, 6.2138], [-75.5680, 6.2150], [-75.5665, 6.2160]], "acueducto", "via_pavimentada", "Medellín", 0.88, 0.12, 0.15, 0.05),
    seg("MDE-AL-010", [[-75.5770, 6.2070], [-75.5755, 6.2085], [-75.5738, 6.2098]], "alcantarillado", "zona_verde", "Medellín", 0.91, 0.55, -0.10, 0.01),
    seg("MDE-AL-011", [[-75.5738, 6.2098], [-75.5720, 6.2110], [-75.5705, 6.2122]], "alcantarillado", "bajo_construccion", "Medellín", 0.82, 0.06, 0.21, 0.04),

    // ===== ENVIGADO =====
    seg("ENV-AC-001", [[-75.5880, 6.1720], [-75.5865, 6.1735], [-75.5848, 6.1748]], "acueducto", "via_pavimentada", "Envigado", 0.90, 0.11, 0.16, 0.06),
    seg("ENV-AC-002", [[-75.5848, 6.1748], [-75.5832, 6.1762], [-75.5818, 6.1775]], "acueducto", "zona_verde", "Envigado", 0.86, 0.48, -0.06, 0.03),
    seg("ENV-AC-003", [[-75.5818, 6.1775], [-75.5802, 6.1788], [-75.5785, 6.1800]], "acueducto", "bajo_construccion", "Envigado", 0.84, 0.07, 0.19, 0.05),
    seg("ENV-AL-001", [[-75.5900, 6.1700], [-75.5885, 6.1715], [-75.5870, 6.1730]], "alcantarillado", "via_pavimentada", "Envigado", 0.92, 0.09, 0.18, 0.04),
    seg("ENV-GS-001", [[-75.5850, 6.1740], [-75.5835, 6.1755], [-75.5820, 6.1768]], "gas", "zona_verde", "Envigado", 0.80, 0.45, -0.04, 0.02),
    seg("ENV-GS-002", [[-75.5820, 6.1768], [-75.5805, 6.1780], [-75.5790, 6.1792]], "gas", "via_destapada", "Envigado", 0.72, 0.14, 0.04, 0.28),

    // ===== SABANETA =====
    seg("SAB-AC-001", [[-75.6165, 6.1518], [-75.6148, 6.1530], [-75.6132, 6.1542]], "acueducto", "via_pavimentada", "Sabaneta", 0.91, 0.10, 0.17, 0.05),
    seg("SAB-AC-002", [[-75.6132, 6.1542], [-75.6118, 6.1555], [-75.6102, 6.1568]], "acueducto", "bajo_construccion", "Sabaneta", 0.88, 0.06, 0.23, 0.04),
    seg("SAB-AC-003", [[-75.6102, 6.1568], [-75.6088, 6.1580], [-75.6072, 6.1592]], "acueducto", "bajo_construccion", "Sabaneta", 0.85, 0.04, 0.24, 0.03),
    seg("SAB-AL-001", [[-75.6180, 6.1500], [-75.6165, 6.1515], [-75.6148, 6.1528]], "alcantarillado", "via_pavimentada", "Sabaneta", 0.93, 0.08, 0.19, 0.04),
    seg("SAB-AL-002", [[-75.6148, 6.1528], [-75.6132, 6.1540], [-75.6118, 6.1552]], "alcantarillado", "zona_verde", "Sabaneta", 0.77, 0.40, -0.02, 0.03),

    // ===== ITAGÜÍ =====
    seg("ITA-AC-001", [[-75.6055, 6.1845], [-75.6040, 6.1858], [-75.6025, 6.1870]], "acueducto", "via_pavimentada", "Itagüí", 0.93, 0.07, 0.20, 0.04),
    seg("ITA-AC-002", [[-75.6025, 6.1870], [-75.6010, 6.1882], [-75.5995, 6.1895]], "acueducto", "bajo_construccion", "Itagüí", 0.89, 0.05, 0.22, 0.03),
    seg("ITA-AL-001", [[-75.6070, 6.1830], [-75.6055, 6.1842], [-75.6040, 6.1855]], "alcantarillado", "bajo_construccion", "Itagüí", 0.86, 0.04, 0.24, 0.03),
    seg("ITA-GS-001", [[-75.6040, 6.1855], [-75.6025, 6.1868], [-75.6010, 6.1880]], "gas", "via_pavimentada", "Itagüí", 0.90, 0.09, 0.18, 0.05),

    // ===== BELLO =====
    seg("BEL-AC-001", [[-75.5585, 6.3380], [-75.5568, 6.3395], [-75.5552, 6.3408]], "acueducto", "via_pavimentada", "Bello", 0.88, 0.11, 0.15, 0.06),
    seg("BEL-AC-002", [[-75.5552, 6.3408], [-75.5535, 6.3420], [-75.5520, 6.3432]], "acueducto", "zona_verde", "Bello", 0.83, 0.47, -0.05, 0.02),
    seg("BEL-AC-003", [[-75.5520, 6.3432], [-75.5505, 6.3445], [-75.5490, 6.3458]], "acueducto", "via_destapada", "Bello", 0.70, 0.16, 0.03, 0.30),
    seg("BEL-AL-001", [[-75.5600, 6.3365], [-75.5585, 6.3378], [-75.5568, 6.3390]], "alcantarillado", "via_pavimentada", "Bello", 0.91, 0.08, 0.19, 0.04),
    seg("BEL-AL-002", [[-75.5568, 6.3390], [-75.5552, 6.3402], [-75.5535, 6.3415]], "alcantarillado", "zona_verde", "Bello", 0.79, 0.43, -0.03, 0.02),
    seg("BEL-GS-001", [[-75.5540, 6.3400], [-75.5525, 6.3415], [-75.5510, 6.3428]], "gas", "via_destapada", "Bello", 0.68, 0.18, 0.02, 0.32),

    // ===== COPACABANA =====
    seg("COP-AC-001", [[-75.5098, 6.3480], [-75.5082, 6.3495], [-75.5065, 6.3508]], "acueducto", "zona_verde", "Copacabana", 0.87, 0.52, -0.09, 0.01),
    seg("COP-AC-002", [[-75.5065, 6.3508], [-75.5048, 6.3520], [-75.5032, 6.3532]], "acueducto", "via_destapada", "Copacabana", 0.71, 0.15, 0.03, 0.27),
    seg("COP-AL-001", [[-75.5115, 6.3465], [-75.5098, 6.3478], [-75.5082, 6.3490]], "alcantarillado", "via_pavimentada", "Copacabana", 0.89, 0.10, 0.16, 0.05),

    // ===== BARBOSA =====
    seg("BAR-AC-001", [[-75.3438, 6.4388], [-75.3422, 6.4400], [-75.3405, 6.4412]], "acueducto", "zona_verde", "Barbosa", 0.90, 0.60, -0.15, 0.01),
    seg("BAR-AC-002", [[-75.3405, 6.4412], [-75.3388, 6.4425], [-75.3372, 6.4438]], "acueducto", "via_destapada", "Barbosa", 0.73, 0.17, 0.02, 0.29),
    seg("BAR-AL-001", [[-75.3455, 6.4375], [-75.3438, 6.4388], [-75.3422, 6.4400]], "alcantarillado", "zona_verde", "Barbosa", 0.88, 0.57, -0.12, 0.01),

    // ===== RIONEGRO =====
    seg("RIO-AC-001", [[-75.3742, 6.1552], [-75.3725, 6.1565], [-75.3708, 6.1578]], "acueducto", "zona_verde", "Rionegro", 0.91, 0.55, -0.10, 0.01),
    seg("RIO-AC-002", [[-75.3708, 6.1578], [-75.3692, 6.1590], [-75.3675, 6.1602]], "acueducto", "zona_verde", "Rionegro", 0.88, 0.50, -0.07, 0.02),
    seg("RIO-AC-003", [[-75.3675, 6.1602], [-75.3658, 6.1615], [-75.3642, 6.1628]], "acueducto", "via_pavimentada", "Rionegro", 0.86, 0.12, 0.14, 0.06),
    seg("RIO-AC-004", [[-75.3642, 6.1628], [-75.3625, 6.1640], [-75.3608, 6.1652]], "acueducto", "via_destapada", "Rionegro", 0.74, 0.16, 0.03, 0.26),
    seg("RIO-AL-001", [[-75.3760, 6.1540], [-75.3742, 6.1552], [-75.3725, 6.1565]], "alcantarillado", "via_pavimentada", "Rionegro", 0.90, 0.09, 0.17, 0.05),
    seg("RIO-AL-002", [[-75.3725, 6.1565], [-75.3708, 6.1578], [-75.3692, 6.1590]], "alcantarillado", "zona_verde", "Rionegro", 0.85, 0.48, -0.05, 0.02),
    seg("RIO-GS-001", [[-75.3750, 6.1548], [-75.3735, 6.1560], [-75.3718, 6.1572]], "gas", "via_destapada", "Rionegro", 0.69, 0.19, 0.01, 0.31),
    seg("RIO-GS-002", [[-75.3718, 6.1572], [-75.3702, 6.1585], [-75.3685, 6.1598]], "gas", "zona_verde", "Rionegro", 0.82, 0.46, -0.04, 0.02),

    // ===== LA ESTRELLA =====
    seg("EST-AC-001", [[-75.6320, 6.1578], [-75.6305, 6.1590], [-75.6288, 6.1602]], "acueducto", "zona_verde", "La Estrella", 0.89, 0.53, -0.09, 0.01),
    seg("EST-AC-002", [[-75.6288, 6.1602], [-75.6272, 6.1615], [-75.6255, 6.1628]], "acueducto", "via_pavimentada", "La Estrella", 0.87, 0.10, 0.16, 0.05),
    seg("EST-AL-001", [[-75.6338, 6.1565], [-75.6322, 6.1578], [-75.6305, 6.1590]], "alcantarillado", "via_destapada", "La Estrella", 0.72, 0.15, 0.03, 0.27),

    // ===== CALDAS =====
    seg("CAL-AC-001", [[-75.6365, 6.0898], [-75.6348, 6.0910], [-75.6332, 6.0922]], "acueducto", "zona_verde", "Caldas", 0.92, 0.62, -0.16, 0.01),
    seg("CAL-AC-002", [[-75.6332, 6.0922], [-75.6315, 6.0935], [-75.6298, 6.0948]], "acueducto", "via_destapada", "Caldas", 0.75, 0.17, 0.02, 0.28),
    seg("CAL-AL-001", [[-75.6382, 6.0885], [-75.6365, 6.0898], [-75.6348, 6.0910]], "alcantarillado", "zona_verde", "Caldas", 0.90, 0.58, -0.13, 0.01),

    // ===== GIRARDOTA =====
    seg("GIR-AC-001", [[-75.4445, 6.3788], [-75.4428, 6.3800], [-75.4412, 6.3812]], "acueducto", "zona_verde", "Girardota", 0.91, 0.56, -0.11, 0.01),
    seg("GIR-AC-002", [[-75.4412, 6.3812], [-75.4395, 6.3825], [-75.4378, 6.3838]], "acueducto", "via_destapada", "Girardota", 0.70, 0.18, 0.02, 0.30),
    seg("GIR-AL-001", [[-75.4462, 6.3775], [-75.4445, 6.3788], [-75.4428, 6.3800]], "alcantarillado", "via_pavimentada", "Girardota", 0.88, 0.10, 0.16, 0.05),
  ],
};

// Estadísticas pre-calculadas
export function getStats(features: Feature<LineString, SegmentProperties>[]) {
  const total = features.length;
  const byCobertura = {
    zona_verde: features.filter((f) => f.properties.cobertura === "zona_verde").length,
    via_pavimentada: features.filter((f) => f.properties.cobertura === "via_pavimentada").length,
    via_destapada: features.filter((f) => f.properties.cobertura === "via_destapada").length,
    bajo_construccion: features.filter((f) => f.properties.cobertura === "bajo_construccion").length,
  };
  const byMunicipio: Record<string, number> = {};
  features.forEach((f) => {
    byMunicipio[f.properties.municipio] = (byMunicipio[f.properties.municipio] || 0) + 1;
  });
  const avgConfianza = features.reduce((s, f) => s + f.properties.confianza, 0) / total;
  return { total, byCobertura, byMunicipio, avgConfianza: Math.round(avgConfianza * 100) };
}
