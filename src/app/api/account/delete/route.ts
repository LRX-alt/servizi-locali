import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Questo endpoint elimina definitivamente l'utente da Supabase Auth (email compresa).
// Sicurezza:
// - Richiede Authorization: Bearer <access_token> dell'utente corrente
// - Verifica che il token appartenga allo stesso userId inviato nel body
// - Usa la Service Role Key solo lato server per eseguire auth.admin.deleteUser

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione Supabase mancante' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      return NextResponse.json({ error: 'Token mancante' }, { status: 401 });
    }

    const body = await req.json().catch(() => null) as { userId?: string } | null;
    const userId = body?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'userId mancante' }, { status: 400 });
    }

    // Verifica che il token appartenga allo userId indicato
    const client = createClient(supabaseUrl, anonKey);
    const { data: userData, error: userErr } = await client.auth.getUser(token);
    if (userErr || !userData?.user || userData.user.id !== userId) {
      return NextResponse.json({ error: 'Token non valido' }, { status: 401 });
    }

    // Esegue la cancellazione via Service Role (server-side only)
    const admin = createClient(supabaseUrl, serviceKey);
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return NextResponse.json({ error: delErr.message || 'Errore eliminazione utente' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore imprevisto';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


