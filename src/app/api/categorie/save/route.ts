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
      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') isAdmin = true; else return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
    } else {
      const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
      const { data: { user } } = await supabase.auth.getUser();
      const role = (user?.app_metadata as Record<string, unknown> | undefined)?.role;
      isAdmin = !!user && role === 'admin';
      if (!isAdmin) return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Semplice approccio: upsert in blocco (id come PK)
    interface CategoriaSave {
      id: string;
      nome: string;
      icona: string;
      descrizione?: string;
      ord?: number;
      show_in_home?: boolean;
      home_order?: number | null;
    }

    const sanitized = (items as CategoriaSave[]).map((it, idx: number) => {
      const rawHomeOrder = (it as unknown as { home_order?: unknown }).home_order;
      const parsedHomeOrder =
        typeof rawHomeOrder === 'number'
          ? rawHomeOrder
          : typeof rawHomeOrder === 'string'
            ? Number(rawHomeOrder)
            : NaN;

      const home_order = Number.isFinite(parsedHomeOrder) ? Math.trunc(parsedHomeOrder) : null;

      return {
      id: String(it.id),
      nome: String(it.nome || ''),
      icona: String(it.icona || '🔧'),
      descrizione: String(it.descrizione || ''),
      ord: typeof it.ord === 'number' ? it.ord : idx,
      show_in_home: Boolean(it.show_in_home),
      home_order: Boolean(it.show_in_home) ? home_order : null,
      };
    });

    // Rende il DB coerente con la lista inviata (upsert + delete dei mancanti)
    const { error: upsertErr } = await admin.from('categorie').upsert(sanitized, { onConflict: 'id' });
    if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

    const { data: existing, error: listErr } = await admin.from('categorie').select('id');
    if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

    const incoming = new Set(sanitized.map((c) => String(c.id)));
    const toDelete = (existing as Array<{ id: unknown }> | null || [])
      .map((r) => String(r.id))
      .filter((id) => !incoming.has(id));

    if (toDelete.length > 0) {
      const { error: delErr } = await admin.from('categorie').delete().in('id', toDelete);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


