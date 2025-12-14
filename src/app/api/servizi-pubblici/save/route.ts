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

    // Verifica admin (dev-bypass consentito solo in sviluppo)
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : null;
    let isAdmin = false;
    if (!token) {
      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') {
        isAdmin = true;
      } else {
        return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
      }
    } else {
      const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
      const { data: { user } } = await supabase.auth.getUser();
      const role = (user?.app_metadata as Record<string, unknown> | undefined)?.role;
      isAdmin = !!user && role === 'admin';
      if (!isAdmin) return NextResponse.json({ error: 'Permesso negato' }, { status: 403 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    interface ServizioSave {
      id: string; nome: string; tipo: string; indirizzo: string;
      coordinate?: { lat: number | null; lng: number | null } | null;
      telefono?: string | null; orari: string; descrizione?: string | null; ord?: number
    }
    const sanitized = (items as ServizioSave[]).map((it, idx: number) => ({
      id: String(it.id),
      nome: String(it.nome || ''),
      tipo: String(it.tipo || 'altro'),
      indirizzo: String(it.indirizzo || ''),
      lat: it.coordinate?.lat ?? null,
      lng: it.coordinate?.lng ?? null,
      telefono: it.telefono ? String(it.telefono) : null,
      orari: String(it.orari || ''),
      descrizione: it.descrizione ? String(it.descrizione) : null,
      ord: typeof it.ord === 'number' ? it.ord : idx
    }));

    // Rende il DB coerente con la lista inviata:
    // - upsert degli elementi presenti
    // - delete degli elementi che non sono più presenti (es. eliminati da admin)
    const { error: upsertErr } = await admin.from('servizi_pubblici').upsert(sanitized, { onConflict: 'id' });
    if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

    // Calcola quali record eliminare (evita filtri not/in con stringhe e potenziali problemi di casting)
    const { data: existing, error: listErr } = await admin
      .from('servizi_pubblici')
      .select('id');
    if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

    const incoming = new Set(sanitized.map((s) => String(s.id)));
    const toDelete = (existing as Array<{ id: unknown }> | null || [])
      .map((r) => String(r.id))
      .filter((id) => !incoming.has(id));

    if (toDelete.length > 0) {
      const { error: delErr } = await admin.from('servizi_pubblici').delete().in('id', toDelete);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


