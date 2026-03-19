"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { temporalData, municipiosTemporal, type MunicipioTemporal } from "@/data/temporalData";

interface Props {
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  showMunicipios: boolean;
  setShowMunicipios: (v: boolean) => void;
  showLandCover: boolean;
  setShowLandCover: (v: boolean) => void;
  hoveredMunicipio: MunicipioTemporal | null;
}

export default function TemporalPanel({
  selectedYear,
  setSelectedYear,
  showMunicipios,
  setShowMunicipios,
  showLandCover,
  setShowLandCover,
  hoveredMunicipio,
}: Props) {
  const currentData = temporalData.find((d) => d.year === selectedYear);
  const baseData = temporalData[0];
  const verdeLoss = currentData
    ? Math.round(((currentData.verde_ha - baseData.verde_ha) / baseData.verde_ha) * 100 * 10) / 10
    : 0;
  const construidoGain = currentData
    ? Math.round(
        ((currentData.construido_ha - baseData.construido_ha) / baseData.construido_ha) * 100 * 10
      ) / 10
    : 0;

  // Municipio ranking by verde loss
  const rankedMunicipios = [...municipiosTemporal].sort(
    (a, b) => a.cambio_verde_pct - b.cambio_verde_pct
  );

  return (
    <div className="p-4 space-y-4">
      {/* Year Slider */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
          Año de análisis: <span className="text-cyan-400 text-base font-bold">{selectedYear}</span>
        </label>
        <input
          type="range"
          min={2017}
          max={2024}
          step={1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
          <span>2017</span>
          <span>2018</span>
          <span>2019</span>
          <span>2020</span>
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Pérdida verde (vs 2017)
          </div>
          <div className="text-xl font-bold font-mono text-red-400">
            {verdeLoss > 0 ? "+" : ""}
            {verdeLoss}%
          </div>
          <div className="text-[10px] text-gray-600">
            {currentData ? currentData.verde_ha.toLocaleString() : "—"} ha
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Crecimiento construido
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            +{construidoGain}%
          </div>
          <div className="text-[10px] text-gray-600">
            {currentData ? currentData.construido_ha.toLocaleString() : "—"} ha
          </div>
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="space-y-1.5">
        <button
          onClick={() => setShowMunicipios(!showMunicipios)}
          className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
            showMunicipios
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-gray-800/30 border border-gray-700 text-gray-400 hover:bg-gray-800/50"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${showMunicipios ? "bg-red-400" : "bg-gray-600"}`} />
          Municipios - Pérdida de verde
        </button>
        <button
          onClick={() => setShowLandCover(!showLandCover)}
          className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
            showLandCover
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-gray-800/30 border border-gray-700 text-gray-400 hover:bg-gray-800/50"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${showLandCover ? "bg-green-400" : "bg-gray-600"}`} />
          ESRI Land Cover 10m (capa raster)
        </button>
      </div>

      {/* Area Chart: Verde vs Construido */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">
          Evolución de coberturas (ha)
        </label>
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temporalData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(v) => String(v).slice(2)}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [String(Number(value).toLocaleString()) + " ha"]}
                />
                <Area
                  type="monotone"
                  dataKey="verde_ha"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  name="Área verde"
                />
                <Area
                  type="monotone"
                  dataKey="construido_ha"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Construido"
                />
                <Area
                  type="monotone"
                  dataKey="desnudo_ha"
                  stackId="3"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.2}
                  name="Suelo desnudo"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line chart: Ratio */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">
          Ratio impermeable / verde
        </label>
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3">
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temporalData.map((d) => ({
                  year: d.year,
                  ratio: Math.round((d.construido_ha / d.verde_ha) * 1000) / 1000,
                }))}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(v) => String(v).slice(2)}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 3 }}
                  name="Ratio"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ranking Municipios */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">
          Ranking pérdida de área verde (2017-2024)
        </label>
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankedMunicipios}
                layout="vertical"
                margin={{ left: 0, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[-30, 0]}
                />
                <YAxis
                  type="category"
                  dataKey="municipio"
                  width={80}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`${value}%`, "Cambio verde"]}
                />
                <Bar dataKey="cambio_verde_pct" radius={[4, 0, 0, 4]}>
                  {rankedMunicipios.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        Math.abs(entry.cambio_verde_pct) > 20
                          ? "#ef4444"
                          : Math.abs(entry.cambio_verde_pct) > 12
                          ? "#f59e0b"
                          : "#22c55e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Selected municipio detail */}
      {hoveredMunicipio && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-2">
            {hoveredMunicipio.municipio}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Verde 2017</div>
              <div className="text-green-400 font-bold">{hoveredMunicipio.verde_2017}%</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Verde 2024</div>
              <div className="text-red-400 font-bold">{hoveredMunicipio.verde_2024}%</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Construido 2017</div>
              <div className="text-gray-400 font-bold">{hoveredMunicipio.construido_2017}%</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Construido 2024</div>
              <div className="text-amber-400 font-bold">{hoveredMunicipio.construido_2024}%</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Población</div>
              <div className="text-white font-bold">{hoveredMunicipio.poblacion_2024.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-500">Área</div>
              <div className="text-white font-bold">{hoveredMunicipio.area_km2} km²</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
