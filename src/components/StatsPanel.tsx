"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Stats {
  total: number;
  byCobertura: Record<string, number>;
  byMunicipio: Record<string, number>;
  avgConfianza: number;
}

const COLORS: Record<string, string> = {
  zona_verde: "#22c55e",
  via_pavimentada: "#6b7280",
  via_destapada: "#d97706",
  bajo_construccion: "#ef4444",
};

const LABELS: Record<string, string> = {
  zona_verde: "Verde",
  via_pavimentada: "Pavimentada",
  via_destapada: "Destapada",
  bajo_construccion: "Construcción",
};

export default function StatsPanel({ stats }: { stats: Stats }) {
  const pieData = Object.entries(stats.byCobertura).map(([key, value]) => ({
    name: LABELS[key],
    value,
    color: COLORS[key],
    pct: stats.total > 0 ? Math.round((value / stats.total) * 100) : 0,
  }));

  const barData = Object.entries(stats.byMunicipio)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name: name.slice(0, 10), value }));

  return (
    <div className="space-y-4">
      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {stats.total}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Segmentos
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400 font-mono">
            {stats.avgConfianza}%
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Confianza
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">
          Distribución por cobertura
        </label>
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {pieData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-gray-400"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate">{d.name}</span>
                <span className="ml-auto text-gray-600 font-mono">
                  {d.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart - By Municipio */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block">
          Segmentos por municipio
        </label>
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={75}
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
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
