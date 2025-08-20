'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST /api/professionisti/set-status
// Body: { id: string, is_active?: boolean, is_verified?: boolean }
export async function POST(req: Request) {
  try {
    const { id, is_active, is_verified } = await req.json();
    if (!id || (typeof is_active !== 'boolean' && typeof is_verified !== 'boolean')) {
      return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione Supabase mancante' }, { status: 500 });
    }

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
      const role = (user.app_metadata as Record<string, unknown> | undefined)?.role;
      isAdmin = role === 'admin';
      if (!isAdmin) return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const updates: Record<string, unknown> = {};
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (typeof is_verified === 'boolean') updates.is_verified = is_verified;

    const { error: updErr } = await adminClient
      .from('professionisti')
      .update(updates)
      .eq('id', id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


