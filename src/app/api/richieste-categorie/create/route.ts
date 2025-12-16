import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Errore parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Formato richiesta non valido' },
        { status: 400 }
      );
    }

    const { nome_categoria, descrizione, richiedente_email, richiedente_nome } = body;

    // Validazione
    if (!nome_categoria || !richiedente_email || !richiedente_nome) {
      return NextResponse.json(
        { error: 'Nome categoria, email e nome sono obbligatori' },
        { status: 400 }
      );
    }

    const nomeCategoriaTrimmed = nome_categoria.trim();
    if (nomeCategoriaTrimmed.length < 3 || nomeCategoriaTrimmed.length > 50) {
      return NextResponse.json(
        { error: 'Il nome categoria deve essere tra 3 e 50 caratteri' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configurazione mancante' }, { status: 500 });
    }

    // Usa anon key per le verifiche (pubbliche)
    const supabase = createClient(supabaseUrl, anonKey);
    // Usa service role key per l'insert (bypassa RLS per endpoint pubblico)
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Verifica se la categoria esiste già
    const { data: categoriaEsistente, error: categoriaError } = await supabase
      .from('categorie')
      .select('id, nome')
      .ilike('nome', nomeCategoriaTrimmed)
      .maybeSingle();

    if (categoriaError) {
      console.error('Errore verifica categoria esistente:', categoriaError);
      return NextResponse.json(
        { error: 'Errore durante la verifica della categoria' },
        { status: 500 }
      );
    }

    if (categoriaEsistente) {
      return NextResponse.json(
        { error: 'Questa categoria esiste già' },
        { status: 400 }
      );
    }

    // Verifica se esiste già una richiesta pending per questa categoria da questo utente
    const { data: richiestaEsistente, error: richiestaError } = await supabase
      .from('richieste_categorie')
      .select('id')
      .eq('richiedente_email', richiedente_email)
      .ilike('nome_categoria', nomeCategoriaTrimmed)
      .eq('stato', 'pending')
      .maybeSingle();

    if (richiestaError) {
      console.error('Errore verifica richiesta esistente:', richiestaError);
      return NextResponse.json(
        { error: 'Errore durante la verifica della richiesta' },
        { status: 500 }
      );
    }

    if (richiestaEsistente) {
      return NextResponse.json(
        { error: 'Hai già una richiesta pending per questa categoria' },
        { status: 400 }
      );
    }

    // Crea la richiesta usando service role key per bypassare RLS
    // (questo endpoint è pubblico e non richiede autenticazione)
    const { data, error } = await adminClient
      .from('richieste_categorie')
      .insert({
        nome_categoria: nomeCategoriaTrimmed,
        descrizione: descrizione?.trim() || null,
        richiedente_email: richiedente_email.trim(),
        richiedente_nome: richiedente_nome.trim(),
        stato: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Errore creazione richiesta:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error, null, 2),
      });
      
      // Messaggio più specifico per errori comuni
      let errorMessage = 'Errore durante la creazione della richiesta';
      if (error.code === '42P01') {
        errorMessage = 'La tabella richieste_categorie non esiste. Esegui lo script SQL in Supabase.';
      } else if (error.code === '42501') {
        errorMessage = 'Permesso negato. Verifica le RLS policies in Supabase.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? {
            code: error.code,
            hint: error.hint,
            details: error.details,
          } : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e: unknown) {
    console.error('Errore inatteso in create route:', e);
    const msg = e instanceof Error ? e.message : 'Errore sconosciuto';
    const stack = e instanceof Error ? e.stack : undefined;
    return NextResponse.json(
      { 
        error: msg,
        details: process.env.NODE_ENV === 'development' ? stack : undefined
      },
      { status: 500 }
    );
  }
}

