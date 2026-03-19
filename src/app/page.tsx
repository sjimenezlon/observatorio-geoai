"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full bg-[#06080f]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-1">
          Observatorio GeoAI
        </h2>
        <p className="text-sm text-gray-500">
          Cargando mapa del Valle de Aburrá...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <MapView />;
}
