import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XDeals — GTA VI Pré-venda",
    short_name: "XDeals GTA VI",
    description:
      "Pré-venda exclusiva do GTA VI na XDeals. Reserve por R$ 199,90 via PIX.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0a1a",
    theme_color: "#0d0a1a",
    orientation: "portrait-primary",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["games", "shopping"],
  };
}
