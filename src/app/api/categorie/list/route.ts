'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    if (!supabaseUrl || !anonKey) return NextResponse.json({ error: 'Config mancante' }, { status: 500 });

    const supabase = createClient(supabaseUrl, anonKey);
    const { data, error } = await supabase
      .from('categorie')
      .select('id, nome, icona, descrizione, ord')
      .order('ord', { ascending: true })
      .order('nome', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const bypassCache =
      req.headers.get('x-admin-bypass-cache') === '1' ||
      Boolean(req.headers.get('authorization'));

    return NextResponse.json({ items: data || [] }, {
      headers: bypassCache
        ? {
            'Cache-Control': 'private, no-store, max-age=0',
            Vary: 'Authorization, X-Admin-Bypass-Cache',
          }
        : {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
          },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}




