"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { redesEPM, getStats, type SegmentProperties } from "@/data/redesEPM";
import { capasDisponibles, esriLandCoverLegend } from "@/data/capas";
import {
  municipiosTemporal,
  type MunicipioTemporal,
} from "@/data/temporalData";
import StatsPanel from "./StatsPanel";
import TemporalPanel from "./TemporalPanel";

const COBERTURA_LABELS: Record<string, string> = {
  zona_verde: "Zona Verde",
  via_pavimentada: "Vía Pavimentada",
  via_destapada: "Vía Destapada",
  bajo_construccion: "Bajo Construcciones",
};

const COBERTURA_ICONS: Record<string, string> = {
  zona_verde: "🌿",
  via_pavimentada: "🛣️",
  via_destapada: "🏜️",
  bajo_construccion: "🏗️",
};

type Tab = "cobertura" | "temporal" | "capas";

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Record<string, L.TileLayer>>({});
  const segmentsLayerRef = useRef<L.GeoJSON | null>(null);
  const municipiosLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("cobertura");
  const [filters, setFilters] = useState({
    zona_verde: true,
    via_pavimentada: true,
    via_destapada: true,
    bajo_construccion: true,
  });
  const [minConfianza, setMinConfianza] = useState(0);
  const [tipoRed, setTipoRed] = useState("todos");
  const [searchId, setSearchId] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<SegmentProperties | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    "carto-dark": true,
  });
  const [selectedYear, setSelectedYear] = useState(2024);
  const [showMunicipios, setShowMunicipios] = useState(false);
  const [showLandCover, setShowLandCover] = useState(false);
  const [hoveredMunicipio, setHoveredMunicipio] = useState<MunicipioTemporal | null>(null);

  // Filtered features
  const filteredFeatures = useMemo(() => {
    return redesEPM.features.filter((f) => {
      const p = f.properties;
      if (!filters[p.cobertura]) return false;
      if (p.confianza < minConfianza / 100) return false;
      if (tipoRed !== "todos" && p.tipo_red !== tipoRed) return false;
      if (searchId && !p.id.toLowerCase().includes(searchId.toLowerCase())) return false;
      return true;
    });
  }, [filters, minConfianza, tipoRed, searchId]);

  const stats = useMemo(() => getStats(filteredFeatures), [filteredFeatures]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [6.25, -75.56],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Add default base layer
    const defaultLayer = capasDisponibles.find((c) => c.id === "carto-dark")!;
    const tileLayer = L.tileLayer(defaultLayer.url, {
      attribution: defaultLayer.attribution,
      maxZoom: defaultLayer.maxZoom,
    }).addTo(map);
    layersRef.current["carto-dark"] = tileLayer;

    // Scale control
    L.control.scale({ position: "bottomright", imperial: false }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update segments layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (segmentsLayerRef.current) {
      map.removeLayer(segmentsLayerRef.current);
    }

    const geojsonData = {
      type: "FeatureCollection" as const,
      features: filteredFeatures,
    };

    const layer = L.geoJSON(geojsonData, {
      style: (feature) => {
        const p = feature?.properties as SegmentProperties;
        return {
          color: p.color,
          weight: 4,
          opacity: 0.85,
          lineJoin: "round" as const,
          lineCap: "round" as const,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties as SegmentProperties;
        layer.on("click", () => {
          setSelectedSegment(p);
        });
        layer.on("mouseover", (e) => {
          const l = e.target;
          l.setStyle({ weight: 7, opacity: 1 });
          l.bringToFront();
        });
        layer.on("mouseout", (e) => {
          const l = e.target;
          l.setStyle({ weight: 4, opacity: 0.85 });
        });

        layer.bindTooltip(
          `<strong>${p.id}</strong><br/>${COBERTURA_ICONS[p.cobertura]} ${COBERTURA_LABELS[p.cobertura]}<br/>Confianza: ${Math.round(p.confianza * 100)}%`,
          { sticky: true, className: "custom-tooltip" }
        );
      },
    }).addTo(map);

    segmentsLayerRef.current = layer;
  }, [filteredFeatures]);

  // Handle layer toggling
  const toggleLayer = useCallback(
    (layerId: string) => {
      const map = mapRef.current;
      if (!map) return;
      const capaInfo = capasDisponibles.find((c) => c.id === layerId);
      if (!capaInfo) return;

      if (activeLayers[layerId]) {
        // Remove
        if (layersRef.current[layerId]) {
          map.removeLayer(layersRef.current[layerId]);
          delete layersRef.current[layerId];
        }
        setActiveLayers((prev) => ({ ...prev, [layerId]: false }));
      } else {
        // If base layer, remove other bases first
        if (capaInfo.category === "base" || capaInfo.category === "satellite") {
          capasDisponibles
            .filter((c) => c.category === "base" || c.category === "satellite")
            .forEach((c) => {
              if (layersRef.current[c.id]) {
                map.removeLayer(layersRef.current[c.id]);
                delete layersRef.current[c.id];
              }
            });
          setActiveLayers((prev) => {
            const next = { ...prev };
            capasDisponibles
              .filter((c) => c.category === "base" || c.category === "satellite")
              .forEach((c) => {
                next[c.id] = false;
              });
            return next;
          });
        }
        const tl = L.tileLayer(capaInfo.url, {
          attribution: capaInfo.attribution,
          maxZoom: capaInfo.maxZoom,
          opacity: capaInfo.opacity,
        });
        if (capaInfo.category === "base" || capaInfo.category === "satellite") {
          tl.addTo(map);
          tl.bringToBack();
        } else {
          tl.addTo(map);
        }
        layersRef.current[layerId] = tl;
        setActiveLayers((prev) => ({ ...prev, [layerId]: true }));
      }
    },
    [activeLayers]
  );

  // Municipios circles for temporal
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (municipiosLayerRef.current) {
      map.removeLayer(municipiosLayerRef.current);
      municipiosLayerRef.current = null;
    }

    if (!showMunicipios) return;

    const group = L.layerGroup();
    municipiosTemporal.forEach((m) => {
      const lossIntensity = Math.abs(m.cambio_verde_pct) / 25;
      const radius = Math.max(800, m.area_km2 * 8);
      const color = `rgb(${Math.round(220 * lossIntensity + 35)}, ${Math.round(80 * (1 - lossIntensity))}, ${Math.round(50 * (1 - lossIntensity))})`;

      const circle = L.circle([m.lat, m.lng], {
        radius,
        fillColor: color,
        fillOpacity: 0.5,
        color: color,
        weight: 2,
        opacity: 0.8,
      });

      circle.bindTooltip(
        `<strong>${m.municipio}</strong><br/>
         Verde: ${m.verde_2017}% → ${m.verde_2024}% (${m.cambio_verde_pct > 0 ? "+" : ""}${m.cambio_verde_pct}%)<br/>
         Construido: ${m.construido_2017}% → ${m.construido_2024}% (+${m.cambio_construido_pct}%)<br/>
         Población: ${m.poblacion_2024.toLocaleString()}`,
        { sticky: true, className: "custom-tooltip" }
      );

      circle.on("click", () => setHoveredMunicipio(m));
      group.addLayer(circle);

      // Label
      const label = L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: "municipio-label",
          html: `<span>${m.municipio}<br/><small>${m.cambio_verde_pct}%</small></span>`,
          iconSize: [100, 30],
          iconAnchor: [50, -15],
        }),
      });
      group.addLayer(label);
    });

    group.addTo(map);
    municipiosLayerRef.current = group;
  }, [showMunicipios]);

  // ESRI Land Cover toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const lcId = "esri-landcover-2024";
    if (showLandCover) {
      if (!layersRef.current[lcId]) {
        const lcLayer = capasDisponibles.find((c) => c.id === lcId)!;
        const tl = L.tileLayer(lcLayer.url, {
          attribution: lcLayer.attribution,
          maxZoom: lcLayer.maxZoom,
          opacity: lcLayer.opacity,
        }).addTo(map);
        layersRef.current[lcId] = tl;
      }
    } else {
      if (layersRef.current[lcId]) {
        map.removeLayer(layersRef.current[lcId]);
        delete layersRef.current[lcId];
      }
    }
  }, [showLandCover]);

  // Search by ID - fly to segment
  const flyToSegment = useCallback(
    (id: string) => {
      const feature = redesEPM.features.find((f) => f.properties.id === id);
      if (feature && mapRef.current) {
        const coords = feature.geometry.coordinates[0];
        mapRef.current.flyTo([coords[1], coords[0]], 16, { duration: 1.2 });
        setSelectedSegment(feature.properties);
      }
    },
    []
  );

  return (
    <div className="flex h-screen w-full bg-[#06080f]">
      {/* === SIDEBAR === */}
      <div className="w-[420px] min-w-[420px] h-full flex flex-col border-r border-gray-800 bg-[#0a0e1a]">
        {/* Header */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-lg">
              🌍
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Observatorio GeoAI
              </h1>
              <p className="text-xs text-gray-500">
                Valle de Aburrá & Rionegro &middot; EPM
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {(["cobertura", "temporal", "capas"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              {tab === "cobertura"
                ? "Cobertura"
                : tab === "temporal"
                ? "Temporal"
                : "Capas"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "cobertura" && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Buscar segmento
                </label>
                <input
                  type="text"
                  placeholder="Ej: MDE-AC-001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchId) flyToSegment(searchId);
                  }}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Filter: Cobertura */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">
                  Tipo de cobertura
                </label>
                <div className="space-y-1.5">
                  {(Object.keys(filters) as (keyof typeof filters)[]).map(
                    (key) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={filters[key]}
                          onChange={() =>
                            setFilters((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500/20"
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              key === "zona_verde"
                                ? "#22c55e"
                                : key === "via_pavimentada"
                                ? "#6b7280"
                                : key === "via_destapada"
                                ? "#d97706"
                                : "#ef4444",
                          }}
                        />
                        <span className="text-sm text-gray-300">
                          {COBERTURA_LABELS[key]}
                        </span>
                        <span className="ml-auto text-xs text-gray-600 font-mono">
                          {
                            redesEPM.features.filter(
                              (f) => f.properties.cobertura === key
                            ).length
                          }
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Filter: Confianza */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Confianza mínima: {minConfianza}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={minConfianza}
                  onChange={(e) => setMinConfianza(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Filter: Tipo red */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Tipo de red
                </label>
                <select
                  value={tipoRed}
                  onChange={(e) => setTipoRed(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="todos">Todas las redes</option>
                  <option value="acueducto">Acueducto</option>
                  <option value="alcantarillado">Alcantarillado</option>
                  <option value="gas">Gas</option>
                </select>
              </div>

              {/* Stats Panel */}
              <StatsPanel stats={stats} />

              {/* Selected segment detail */}
              {selectedSegment && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {selectedSegment.id}
                    </h3>
                    <button
                      onClick={() => setSelectedSegment(null)}
                      className="text-gray-500 hover:text-white text-xs"
                    >
                      Cerrar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">Cobertura</div>
                      <div className="font-semibold" style={{ color: selectedSegment.color }}>
                        {COBERTURA_ICONS[selectedSegment.cobertura]}{" "}
                        {COBERTURA_LABELS[selectedSegment.cobertura]}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">Confianza</div>
                      <div className="font-semibold text-cyan-400">
                        {Math.round(selectedSegment.confianza * 100)}%
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">NDVI</div>
                      <div className="font-mono text-green-400">
                        {selectedSegment.ndvi}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">NDBI</div>
                      <div className="font-mono text-blue-400">
                        {selectedSegment.ndbi}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">BSI</div>
                      <div className="font-mono text-amber-400">
                        {selectedSegment.bsi}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">Fuente</div>
                      <div className="font-mono text-purple-400 text-[10px]">
                        {selectedSegment.fuente}
                      </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">Municipio</div>
                      <div className="text-white">{selectedSegment.municipio}</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2">
                      <div className="text-gray-500">Tipo Red</div>
                      <div className="text-white capitalize">{selectedSegment.tipo_red}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "temporal" && (
            <TemporalPanel
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              showMunicipios={showMunicipios}
              setShowMunicipios={setShowMunicipios}
              showLandCover={showLandCover}
              setShowLandCover={setShowLandCover}
              hoveredMunicipio={hoveredMunicipio}
            />
          )}

          {activeTab === "capas" && (
            <div className="p-4 space-y-4">
              {(["base", "satellite", "overlay", "landcover"] as const).map(
                (cat) => {
                  const layers = capasDisponibles.filter(
                    (c) => c.category === cat
                  );
                  if (layers.length === 0) return null;
                  return (
                    <div key={cat}>
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">
                        {cat === "base"
                          ? "Mapas Base"
                          : cat === "satellite"
                          ? "Satélite"
                          : cat === "overlay"
                          ? "Overlays"
                          : "Cobertura del Suelo"}
                      </label>
                      <div className="space-y-1">
                        {layers.map((l) => (
                          <button
                            key={l.id}
                            onClick={() => toggleLayer(l.id)}
                            className={`w-full text-left flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${
                              activeLayers[l.id]
                                ? "bg-cyan-500/10 border border-cyan-500/30"
                                : "bg-gray-800/30 border border-transparent hover:bg-gray-800/50"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                activeLayers[l.id]
                                  ? "bg-cyan-400"
                                  : "bg-gray-600"
                              }`}
                            />
                            <div>
                              <div className="text-sm text-gray-300">
                                {l.name}
                              </div>
                              <div className="text-[10px] text-gray-600">
                                {l.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}

              {/* ESRI Legend */}
              {activeLayers["esri-landcover-2024"] && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">
                    Leyenda ESRI Land Cover
                  </label>
                  <div className="space-y-1">
                    {esriLandCoverLegend
                      .filter((l) => l.clase > 1)
                      .map((l) => (
                        <div
                          key={l.clase}
                          className="flex items-center gap-2 text-xs text-gray-400"
                        >
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: l.color }}
                          />
                          {l.nombre}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer stats bar */}
        <div className="p-3 border-t border-gray-800 bg-gray-900/40">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {filteredFeatures.length} / {redesEPM.features.length} segmentos
            </span>
            <span>Confianza media: {stats.avgConfianza}%</span>
          </div>
        </div>
      </div>

      {/* === MAP === */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend */}
        <div className="absolute bottom-6 left-4 bg-[#0a0e1a]/90 backdrop-blur-sm border border-gray-800 rounded-xl p-3 z-[1000]">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">
            Cobertura del Suelo
          </div>
          <div className="space-y-1">
            {Object.entries(COBERTURA_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-6 h-1 rounded-full"
                  style={{
                    backgroundColor:
                      key === "zona_verde"
                        ? "#22c55e"
                        : key === "via_pavimentada"
                        ? "#6b7280"
                        : key === "via_destapada"
                        ? "#d97706"
                        : "#ef4444",
                  }}
                />
                <span className="text-[11px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top-right info badge */}
        <div className="absolute top-4 left-4 bg-[#0a0e1a]/90 backdrop-blur-sm border border-gray-800 rounded-xl px-4 py-2 z-[1000]">
          <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
            Valle de Aburrá & Rionegro
          </div>
          <div className="text-xs text-gray-500">
            {filteredFeatures.length} segmentos &middot; 11 municipios &middot;
            Sentinel-2 10m
          </div>
        </div>
      </div>
    </div>
  );
}
