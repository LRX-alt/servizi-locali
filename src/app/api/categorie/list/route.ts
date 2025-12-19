'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    if (!supabaseUrl || !anonKey) return NextResponse.json({ error: 'Config mancante' }, { status: 500 });

    const supabase = createClient(supabaseUrl, anonKey);
    const { searchParams } = new URL(req.url);
    const scope = (searchParams.get('scope') || '').toLowerCase();
    const onlyHome = scope === 'home';

    let query = supabase
      .from('categorie')
      .select('id, nome, icona, descrizione, ord, show_in_home, home_order');

    if (onlyHome) {
      query = query.eq('show_in_home', true);
      // Ordina per home_order prima, poi ord/nome come fallback
      query = query.order('home_order', { ascending: true, nullsFirst: false });
    }

    query = query
      .order('ord', { ascending: true })
      .order('nome', { ascending: true });

    const { data, error } = await query;
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
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}




