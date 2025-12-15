'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Funzione helper per verificare se siamo in un flusso di recovery
function isRecoveryFlow(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Controlla pathname
  if (window.location.pathname === '/reset-password') return true;
  
  // Controlla hash per token di recovery
  const hash = window.location.hash;
  if (hash && hash.includes('type=recovery')) return true;
  
  return false;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeSession = async () => {
      try {
        // Non caricare il profilo se siamo in un flusso di recovery
        // La sessione di recovery non deve essere trattata come un login normale
        if (isRecoveryFlow()) {
          console.log('[AuthProvider] Flusso recovery rilevato, skip caricamento profilo');
          // Pulisci lo stato per non mostrare l'utente come loggato
          useAppStore.setState({
            utente: null,
            professionistaLoggato: null,
            userType: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          return;
        }

        // Usa getSession per evitare errori di refresh non gestiti
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          // Se il refresh token non è valido, effettua logout pulito
          if (sessionError.message?.toLowerCase().includes('invalid refresh token')) {
            try { await supabase.auth.signOut(); } catch {}
            try { localStorage.removeItem('supabase.auth.token'); } catch {}
            try { localStorage.removeItem('servizi-locali-storage'); } catch {}
          }
          // Se abbiamo un dev admin attivo nello store, non sovrascriviamo
          const keepDevAdmin =
            process.env.NODE_ENV !== 'production' &&
            process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' &&
            useAppStore.getState().isAdmin;
          if (!keepDevAdmin) {
            useAppStore.setState({
              utente: null,
              professionistaLoggato: null,
              userType: null,
              isAuthenticated: false,
              isAdmin: false,
            });
          }
          return;
        }

        const user = session?.user;
        if (user) {
          const role = (user.app_metadata as Record<string, unknown> | undefined)?.role;
          const isAdminRole = role === 'admin';
          // Proviamo a caricare profilo utente, altrimenti professionista
          try {
            await useAppStore.getState().loadUserProfile(user.id);
            useAppStore.setState({ isAuthenticated: true, userType: 'utente', isAdmin: isAdminRole });
          } catch {
            // Ignora e tenta come professionista
          }

          if (!useAppStore.getState().utente) {
            try {
              await useAppStore.getState().loadProfessionistaProfile(user.id);
              useAppStore.setState({ isAuthenticated: true, userType: 'professionista', isAdmin: isAdminRole });
            } catch {
              // Se non è presente in nessuna tabella, consideriamo non autenticato coerentemente
              if (!useAppStore.getState().professionistaLoggato) {
                useAppStore.setState({
                  utente: null,
                  professionistaLoggato: null,
                  userType: null,
                  isAuthenticated: false,
                  isAdmin: false,
                });
              }
            }
          }
        } else {
          // Nessuna sessione
          const keepDevAdmin =
            process.env.NODE_ENV !== 'production' &&
            process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' &&
            useAppStore.getState().isAdmin;
          if (!keepDevAdmin) {
            useAppStore.setState({
              utente: null,
              professionistaLoggato: null,
              userType: null,
              isAuthenticated: false,
              isAdmin: false,
            });
          }
        }
      } catch {
        // In caso di errore, non bloccare l'app
      }
    };

    // Inizializzazione all'avvio
    initializeSession();

    // Listener dei cambi di sessione
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignora eventi durante il flusso di recovery per non interferire
      if (isRecoveryFlow()) {
        console.log('[AuthProvider] Evento auth durante flusso recovery, ignorato');
        return;
      }

      if (event === 'SIGNED_OUT' || !session) {
        const keepDevAdmin =
          process.env.NODE_ENV !== 'production' &&
          process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' &&
          useAppStore.getState().isAdmin;
        if (!keepDevAdmin) {
          useAppStore.setState({
            utente: null,
            professionistaLoggato: null,
            userType: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
        return;
      }

      if (session?.user) {
        const role = (session.user.app_metadata as Record<string, unknown> | undefined)?.role;
        const isAdminRole = role === 'admin';
        // Carica profilo aggiornato
        try {
          await useAppStore.getState().loadUserProfile(session.user.id);
          useAppStore.setState({ isAuthenticated: true, userType: 'utente', isAdmin: isAdminRole });
        } catch {
          // Ignora e tenta come professionista
        }

        if (!useAppStore.getState().utente) {
          try {
            await useAppStore.getState().loadProfessionistaProfile(session.user.id);
            useAppStore.setState({ isAuthenticated: true, userType: 'professionista', isAdmin: isAdminRole });
          } catch {
            // Fallback: consideriamo non autenticato se non troviamo profilo
            if (!useAppStore.getState().professionistaLoggato) {
              useAppStore.setState({
                utente: null,
                professionistaLoggato: null,
                userType: null,
                isAuthenticated: false,
                isAdmin: false,
              });
            }
          }
        }
      }
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}