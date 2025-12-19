import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurazione pulita per produzione
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Next.js supporta wildcard solo in formato "*.domain.tld" (non "**.domain.tld")
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        // dominio specifico del tuo progetto Supabase (fallback esplicito)
        hostname: 'aasrhmscsawuhsbjplpg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
