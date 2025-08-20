'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Endpoint: GET /api/recensioni/list?status=pending|approvata|rifiutata|all
// Auth: richiede sessione con app_metadata.role === 'admin'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'pending';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione Supabase mancante' }, { status: 500 });
    }

    // Verifica token e ruolo admin
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    let isAdmin = false;
    if (!token) {
      // Dev bypass: consenti in sviluppo quando esplicitamente abilitato
      if (process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') {
        isAdmin = true;
      } else {
        return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
      }
    } else {
      const supabase = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
      }
      const role = (user.app_metadata as Record<string, unknown> | undefined)?.role;
      isAdmin = role === 'admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
      }
    }

    // Query con service role per bypassare RLS
    const adminClient = createClient(supabaseUrl, serviceKey);
    let query = adminClient
      .from('recensioni')
      .select('id, professionista_id, utente_id, utente_nome, rating, commento, data, stato, servizio_recensito')
      .order('data', { ascending: false }, { nullsFirst: false });

    if (status && status !== 'all') {
      query = query.eq('stato', status as 'approvata' | 'pending' | 'rifiutata');
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


