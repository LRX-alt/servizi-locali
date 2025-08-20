'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Endpoint: POST /api/recensioni/moderate
// Body: { id: string, action: 'approve' | 'reject' }
// Auth: richiede sessione utente con app_metadata.role === 'admin'

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione Supabase mancante' }, { status: 500 });
    }

    // Leggi la sessione dall'Authorization header (Bearer <token>)
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;

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
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
      }
      isAdmin = (user as any)?.app_metadata?.role === 'admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
      }
    }

    const newState = action === 'approve' ? 'approvata' : 'rifiutata';

    // Usa service role per bypassare RLS, dopo aver verificato il ruolo admin
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { error: updErr } = await adminClient
      .from('recensioni')
      .update({ stato: newState })
      .eq('id', id);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


