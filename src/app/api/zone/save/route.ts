'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body || {};
    if (!Array.isArray(items)) return NextResponse.json({ error: 'Payload non valido' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) return NextResponse.json({ error: 'Config mancante' }, { status: 500 });

    // Verifica admin (dev-bypass se abilitato)
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null;
    let isAdmin = false;
    if (!token) {
      if (process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') isAdmin = true; else return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
    } else {
      const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
      const { data: { user } } = await supabase.auth.getUser();
      isAdmin = !!user && (user as any)?.app_metadata?.role === 'admin';
      if (!isAdmin) return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const sanitized = items.map((it: any, idx: number) => ({
      id: String(it.id),
      nome: String(it.nome || ''),
      ord: typeof it.ord === 'number' ? it.ord : idx
    }));

    const { error } = await admin.from('zone').upsert(sanitized, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


