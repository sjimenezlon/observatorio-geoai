import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Observatorio GeoAI | Valle de Aburrá & Rionegro",
  description:
    "Análisis de cobertura del suelo con IA geoespacial para redes de infraestructura EPM. Clasificación por segmento y evolución temporal 2017-2024.",
  openGraph: {
    title: "Observatorio GeoAI EPM",
    description: "Inteligencia geoespacial aplicada a infraestructura - Valle de Aburrá",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
