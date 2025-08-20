'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    if (!supabaseUrl || !anonKey) return NextResponse.json({ error: 'Config mancante' }, { status: 500 });

    const supabase = createClient(supabaseUrl, anonKey);
    const { data, error } = await supabase
      .from('servizi_pubblici')
      .select('id, nome, tipo, indirizzo, lat, lng, telefono, orari, descrizione, ord')
      .order('ord', { ascending: true })
      .order('nome', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    type Row = { id: string; nome: string; tipo: string; indirizzo: string; lat: number | null; lng: number | null; telefono: string | null; orari: string; descrizione: string | null };
    const items = (data as Row[] | null || []).map((r) => ({
      id: String(r.id),
      nome: r.nome,
      tipo: r.tipo,
      indirizzo: r.indirizzo,
      coordinate: { lat: r.lat ?? null, lng: r.lng ?? null },
      telefono: r.telefono ?? '',
      orari: r.orari,
      descrizione: r.descrizione ?? ''
    }));
    return NextResponse.json({ items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


