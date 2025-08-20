'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST /api/professionisti/update
// Body: { id: string, telefono?: string, descrizione?: string, zona_servizio?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 });

    const allowed: Record<string, unknown> = {};
    if (typeof body.telefono === 'string') allowed.telefono = body.telefono;
    if (typeof body.descrizione === 'string') allowed.descrizione = body.descrizione;
    if (typeof body.zona_servizio === 'string') allowed.zona_servizio = body.zona_servizio;
    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'Nessun campo valido da aggiornare' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione Supabase mancante' }, { status: 500 });
    }

    // Verifica ruolo admin
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null;

    let isAdmin = false;
    if (!token) {
      if (process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') {
        isAdmin = true;
      } else {
        return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
      }
    } else {
      const supabase = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
      isAdmin = (user as any)?.app_metadata?.role === 'admin';
      if (!isAdmin) return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { error: updErr } = await adminClient
      .from('professionisti')
      .update(allowed)
      .eq('id', id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


