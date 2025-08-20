'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeSession = async () => {
      try {
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
          const keepDevAdmin = process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' && useAppStore.getState().isAdmin;
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
          const keepDevAdmin = process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' && useAppStore.getState().isAdmin;
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
      if (event === 'SIGNED_OUT' || !session) {
        const keepDevAdmin = process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true' && useAppStore.getState().isAdmin;
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