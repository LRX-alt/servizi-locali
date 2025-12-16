'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { richiesta_id, nome, icona, descrizione } = body;

    if (!richiesta_id || !nome || !icona) {
      return NextResponse.json(
        { error: 'ID richiesta, nome e icona sono obbligatori' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione mancante' }, { status: 500 });
    }

    // Verifica autenticazione admin
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;

    let isAdmin = false;
    if (!token) {
      if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true') {
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

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Recupera la richiesta
    const { data: richiesta, error: richiestaError } = await adminClient
      .from('richieste_categorie')
      .select('*')
      .eq('id', richiesta_id)
      .single();

    if (richiestaError || !richiesta) {
      return NextResponse.json({ error: 'Richiesta non trovata' }, { status: 404 });
    }

    if (richiesta.stato !== 'pending') {
      return NextResponse.json(
        { error: 'Questa richiesta è già stata processata' },
        { status: 400 }
      );
    }

    // Crea la categoria
    const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const categoriaId = slugify(nome) || 'categoria';

    // Verifica se l'ID esiste già
    const { data: categorieEsistenti } = await adminClient
      .from('categorie')
      .select('id');

    const existingIds = new Set((categorieEsistenti || []).map((c: { id: string }) => c.id));
    let finalId = categoriaId;
    let i = 2;
    while (existingIds.has(finalId)) {
      finalId = `${categoriaId}-${i++}`;
    }

    const { data: nuovaCategoria, error: categoriaError } = await adminClient
      .from('categorie')
      .insert({
        id: finalId,
        nome: nome.trim(),
        icona: icona.trim(),
        descrizione: descrizione?.trim() || '',
        ord: 999, // Aggiungi alla fine, admin può riordinare
      })
      .select()
      .single();

    if (categoriaError) {
      console.error('Errore creazione categoria:', categoriaError);
      return NextResponse.json(
        { error: 'Errore durante la creazione della categoria' },
        { status: 500 }
      );
    }

    // Aggiorna la richiesta
    const { error: updateError } = await adminClient
      .from('richieste_categorie')
      .update({
        stato: 'approvata',
        data_risposta: new Date().toISOString(),
        categoria_creata_id: finalId,
      })
      .eq('id', richiesta_id);

    if (updateError) {
      console.error('Errore aggiornamento richiesta:', updateError);
      // Non fallire, la categoria è già stata creata
    }

    // Invia email di notifica (async, non blocca la risposta)
    sendApprovalEmail(richiesta.richiedente_email, richiesta.richiedente_nome, nome).catch(
      (err) => console.error('Errore invio email:', err)
    );

    return NextResponse.json({ success: true, categoria: nuovaCategoria });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function sendApprovalEmail(email: string, nome: string, categoriaNome: string) {
  // Usa Resend o altro servizio email
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurato, email non inviata');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Servizi Locali <noreply@servizilocali.it>',
        to: email,
        subject: `✅ La tua richiesta categoria "${categoriaNome}" è stata approvata`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">Richiesta Approvata!</h2>
            <p>Ciao ${nome},</p>
            <p>La tua richiesta per la categoria <strong>"${categoriaNome}"</strong> è stata approvata dall'amministratore.</p>
            <p>Ora puoi accedere al tuo profilo e aggiornare la tua categoria da "Altro" alla nuova categoria creata.</p>
            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profilo" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Vai al Profilo
              </a>
            </p>
            <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
              Cordiali saluti,<br>
              Il team di Servizi Locali
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(`Email API error: ${res.status}`);
    }
  } catch (error) {
    console.error('Errore invio email approvazione:', error);
    throw error;
  }
}

