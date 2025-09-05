import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "Servizi Locali";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 80,
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 50%, #111827 100%)",
          color: "white",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 12 }}>
          {typeof site === "string" && site.startsWith("http") ? new URL(site).host : site}
        </div>
        <div>Trova professionisti nella tua zona</div>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 500, opacity: 0.95 }}>
          Idraulici, elettricisti, giardinieri e servizi pubblici
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}



