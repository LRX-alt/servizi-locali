import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Servizi Locali",
    short_name: "Servizi Locali",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/logo_servizi-locali.png", sizes: "192x192", type: "image/png" },
      { src: "/logo_servizi-locali.png", sizes: "512x512", type: "image/png" }
    ],
  };
}



