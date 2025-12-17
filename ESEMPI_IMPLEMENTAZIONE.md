# 💻 Esempi di Implementazione - Scalabilità Nazionale

Questo documento contiene esempi di codice pratici per implementare le ottimizzazioni descritte nel piano di scalabilità.

---

## 🔒 Security Headers

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 anno
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Cache Headers per API Routes
  async rewrites() {
    return [];
  },
};

export default nextConfig;
```

---

## 📊 Database Indici SQL

### Script da eseguire in Supabase SQL Editor

```sql
-- ============================================
-- INDICI PER PROFESSIONISTI
-- ============================================

-- Indice per ricerca per categoria
CREATE INDEX IF NOT EXISTS idx_professionisti_categoria 
ON professionisti(categoria_servizio);

-- Indice per zona servizio (GIN per array)
CREATE INDEX IF NOT EXISTS idx_professionisti_zona 
ON professionisti USING GIN(zona_servizio);

-- Indice per rating (ordinamento)
CREATE INDEX IF NOT EXISTS idx_professionisti_rating 
ON professionisti(rating DESC NULLS LAST);

-- Indice per professionisti attivi
CREATE INDEX IF NOT EXISTS idx_professionisti_active 
ON professionisti(is_active) 
WHERE is_active = true;

-- Indice composito per ricerca comune + categoria
CREATE INDEX IF NOT EXISTS idx_professionisti_comune_categoria 
ON professionisti(comune, categoria_servizio) 
WHERE is_active = true;

-- ============================================
-- INDICI PER RECENSIONI
-- ============================================

-- Indice per professionista
CREATE INDEX IF NOT EXISTS idx_recensioni_professionista 
ON recensioni(professionista_id);

-- Indice per utente
CREATE INDEX IF NOT EXISTS idx_recensioni_utente 
ON recensioni(utente_id);

-- Indice per data creazione (ordinamento)
CREATE INDEX IF NOT EXISTS idx_recensioni_created 
ON recensioni(created_at DESC);

-- Indice composito per professionista + data
CREATE INDEX IF NOT EXISTS idx_recensioni_prof_data 
ON recensioni(professionista_id, created_at DESC);

-- ============================================
-- INDICI PER SERVIZI PUBBLICI
-- ============================================

-- Indice per comune
CREATE INDEX IF NOT EXISTS idx_servizi_comune 
ON servizi_pubblici(comune);

-- Indice per tipo servizio
CREATE INDEX IF NOT EXISTS idx_servizi_tipo 
ON servizi_pubblici(tipo_servizio);

-- Indice composito comune + tipo
CREATE INDEX IF NOT EXISTS idx_servizi_comune_tipo 
ON servizi_pubblici(comune, tipo_servizio);

-- ============================================
-- INDICI PER UTENTI
-- ============================================

-- Indice per email (già presente se unique)
CREATE INDEX IF NOT EXISTS idx_utenti_email 
ON utenti(email);

-- Indice per comune (per statistiche)
CREATE INDEX IF NOT EXISTS idx_utenti_comune 
ON utenti(comune);

-- ============================================
-- ANALISI PERFORMANCE
-- ============================================

-- Query per verificare indici utilizzati
EXPLAIN ANALYZE 
SELECT * FROM professionisti 
WHERE categoria_servizio = 'idraulico' 
AND is_active = true 
ORDER BY rating DESC 
LIMIT 20;

-- Query per verificare query lente
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## ⚡ Rate Limiting

### lib/rate-limit.ts

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter per API generali
export const apiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 richieste al minuto
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});

// Rate limiter per autenticazione (più restrittivo)
export const authRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 tentativi ogni 10 minuti
  analytics: true,
  prefix: "@upstash/ratelimit/auth",
});

// Rate limiter per creazione recensioni
export const reviewRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 recensioni all'ora
  analytics: true,
  prefix: "@upstash/ratelimit/review",
});
```

### Esempio uso in API Route

```typescript
// app/api/professionisti/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Rate limiting
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, remaining } = await apiRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Troppe richieste. Riprova più tardi.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'Retry-After': '60',
        }
      }
    );
  }

  // Logica API...
  const professionisti = await getProfessionisti();

  return NextResponse.json(professionisti, {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
    }
  });
}
```

---

## 🗄️ Caching Strategy

### ISR (Incremental Static Regeneration)

```typescript
// app/professionisti/[id]/page.tsx
export const revalidate = 3600; // Rigenera ogni ora

export default async function ProfessionistaPage({ params }: { params: { id: string } }) {
  const professionista = await getProfessionista(params.id);
  
  return (
    <div>
      {/* Contenuto */}
    </div>
  );
}
```

### Cache Headers per API Routes

```typescript
// app/api/professionisti/list/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const professionisti = await getProfessionisti();

  return NextResponse.json(professionisti, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      // Cache per 5 minuti, serve stale per altri 10 minuti
    }
  });
}
```

### React Query per Client-Side Caching

```typescript
// hooks/useProfessionisti.ts
import { useQuery } from '@tanstack/react-query';

export function useProfessionisti(filters?: Filters) {
  return useQuery({
    queryKey: ['professionisti', filters],
    queryFn: () => fetchProfessionisti(filters),
    staleTime: 5 * 60 * 1000, // 5 minuti
    cacheTime: 10 * 60 * 1000, // 10 minuti
  });
}
```

---

## 🖼️ Image Optimization

### Componente Immagine Ottimizzato

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}
```

---

## 📊 Monitoring con Sentry

### sentry.client.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% delle transazioni
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  beforeSend(event, hint) {
    // Filtra errori non importanti
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error && error.message.includes('ResizeObserver')) {
        return null; // Ignora errori ResizeObserver
      }
    }
    return event;
  },
});
```

### sentry.server.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});
```

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client';

import * as Sentry from "@sentry/nextjs";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Qualcosa è andato storto</h1>
            <p className="text-gray-600 mb-4">
              Ci scusiamo per l'inconveniente. Il problema è stato segnalato.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Ricarica pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🍪 Cookie Consent

### components/CookieBanner.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetta"
      declineButtonText="Rifiuta"
      enableDeclineButton
      cookieName="cookieConsent"
      style={{ background: '#2B373B' }}
      buttonStyle={{ 
        color: '#fff', 
        fontSize: '13px', 
        background: '#3B82F6',
        borderRadius: '4px',
        padding: '10px 20px'
      }}
      expires={365}
      onAccept={() => {
        // Abilita Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'granted'
          });
        }
      }}
      onDecline={() => {
        // Disabilita Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'denied'
          });
        }
      }}
    >
      Questo sito utilizza cookie per migliorare l'esperienza utente. 
      Continuando a navigare, accetti l'utilizzo dei cookie.{' '}
      <a href="/privacy" style={{ color: '#3B82F6' }}>
        Maggiori informazioni
      </a>
    </CookieConsent>
  );
}
```

---

## 📈 SEO - Schema.org Markup

### components/ProfessionistaSchema.tsx

```typescript
import { Professionista } from '@/types';

interface Props {
  professionista: Professionista;
}

export function ProfessionistaSchema({ professionista }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${professionista.nome} ${professionista.cognome}`,
    "description": professionista.descrizione,
    "image": professionista.fotoProfilo,
    "telephone": professionista.telefono,
    "email": professionista.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": professionista.zonaServizio?.[0],
      "addressCountry": "IT"
    },
    "aggregateRating": professionista.rating ? {
      "@type": "AggregateRating",
      "ratingValue": professionista.rating,
      "reviewCount": professionista.numeroRecensioni
    } : undefined,
    "priceRange": "$$",
    "areaServed": professionista.zonaServizio?.map(zona => ({
      "@type": "City",
      "name": zona
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Uso nella pagina

```typescript
// app/professionisti/[id]/page.tsx
import { ProfessionistaSchema } from '@/components/ProfessionistaSchema';

export default function ProfessionistaPage({ professionista }: Props) {
  return (
    <>
      <ProfessionistaSchema professionista={professionista} />
      {/* Resto del contenuto */}
    </>
  );
}
```

---

## 🔄 Data Export (GDPR)

### app/api/account/export/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Verifica autenticazione
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get('authorization')?.replace('Bearer ', '') || ''
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Raccogli tutti i dati dell'utente
    const [utente, recensioni, preferiti] = await Promise.all([
      supabase.from('utenti').select('*').eq('id', user.id).single(),
      supabase.from('recensioni').select('*').eq('utente_id', user.id),
      supabase.from('preferiti').select('*').eq('utente_id', user.id),
    ]);

    const exportData = {
      utente: utente.data,
      recensioni: recensioni.data,
      preferiti: preferiti.data,
      exportDate: new Date().toISOString(),
    };

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="dati-utente-${user.id}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'export' },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Performance Monitoring

### lib/performance.ts

```typescript
export function reportWebVitals(metric: any) {
  // Invia a Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Invia a Sentry
  if (metric.name === 'CLS' && metric.value > 0.1) {
    // Log CLS alto
    console.warn('High CLS detected:', metric.value);
  }
}
```

### app/layout.tsx

```typescript
import { reportWebVitals } from '@/lib/performance';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    ${reportWebVitals.toString()}(entry);
                  }
                }).observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
```

---

## 📝 Environment Variables

### .env.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET=profili

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Upstash Redis (per rate limiting)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://servizilocali.it
```

---

## ✅ Testing Checklist

### Performance Test

```bash
# Build e analisi bundle
npm run build

# Analisi bundle size
ANALYZE=true npm run build

# Test locale produzione
npm run start
```

### Security Test

```bash
# Test SSL
curl -I https://servizilocali.it

# Test headers
curl -I https://servizilocali.it | grep -i "strict-transport-security"
```

---

*Questi esempi sono template di partenza. Adattali alle tue esigenze specifiche.*


