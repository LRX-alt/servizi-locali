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

    // Log per debug (solo in sviluppo)
    if (process.env.NODE_ENV === 'development') {
      console.log('Richiesta ricevuta:', {
        nome_categoria: nome_categoria?.substring(0, 50),
        has_descrizione: !!descrizione,
        richiedente_email: richiedente_email?.substring(0, 30) + '...',
        richiedente_nome: richiedente_nome?.substring(0, 30),
      });
    }

    // Validazione
    if (!nome_categoria || !richiedente_email || !richiedente_nome) {
      const missingFields: string[] = [];
      if (!nome_categoria) missingFields.push('nome_categoria');
      if (!richiedente_email) missingFields.push('richiedente_email');
      if (!richiedente_nome) missingFields.push('richiedente_nome');
      
      console.error('Campi mancanti nella richiesta:', missingFields);
      return NextResponse.json(
        { 
          error: 'Nome categoria, email e nome sono obbligatori',
          details: `Campi mancanti: ${missingFields.join(', ')}`
        },
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
    
    // Verifica configurazione con messaggio specifico
    const missingVars: string[] = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!anonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!serviceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    
    if (missingVars.length > 0) {
      console.error('Variabili d\'ambiente mancanti:', missingVars);
      console.error('Variabili disponibili:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV,
      });
      return NextResponse.json(
        { 
          error: 'Configurazione mancante',
          details: `Variabili d'ambiente mancanti: ${missingVars.join(', ')}. Verifica il file .env.local o le variabili d'ambiente del server. Se hai modificato .env.local, riavvia il server di sviluppo.`
        },
        { status: 500 }
      );
    }

    // Usa anon key per le verifiche (pubbliche)
    // Disabilita refresh automatico del token per evitare errori con sessioni scadute
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    // Usa service role key per l'insert (bypassa RLS per endpoint pubblico)
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

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
      
      // Gestione specifica per errore di duplicate key (race condition)
      if (error.code === '23505' && error.message?.includes('idx_richieste_categorie_unique')) {
        // Verifica se esiste davvero una richiesta pending
        const { data: richiestaVerifica } = await adminClient
          .from('richieste_categorie')
          .select('id, stato')
          .eq('richiedente_email', richiedente_email.trim())
          .ilike('nome_categoria', nomeCategoriaTrimmed)
          .eq('stato', 'pending')
          .maybeSingle();
        
        if (richiestaVerifica) {
          return NextResponse.json(
            { error: 'Hai già una richiesta in attesa per questa categoria. Controlla le tue richieste o attendi la risposta dell\'amministratore.' },
            { status: 400 }
          );
        }
      }
      
      // Messaggio più specifico per errori comuni
      let errorMessage = 'Errore durante la creazione della richiesta';
      if (error.code === '42P01') {
        errorMessage = 'La tabella richieste_categorie non esiste. Esegui lo script SQL in Supabase.';
      } else if (error.code === '42501') {
        errorMessage = 'Permesso negato. Verifica le RLS policies in Supabase.';
      } else if (error.code === '23505') {
        errorMessage = 'Hai già una richiesta in attesa per questa categoria. Controlla le tue richieste o attendi la risposta dell\'amministratore.';
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
        { status: error.code === '23505' ? 400 : 500 }
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

