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
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Proviamo a caricare profilo utente, altrimenti professionista
          try {
            await useAppStore.getState().loadUserProfile(user.id);
            useAppStore.setState({ isAuthenticated: true, userType: 'utente', isAdmin: false });
          } catch {
            // Ignora e tenta come professionista
          }

          if (!useAppStore.getState().utente) {
            try {
              await useAppStore.getState().loadProfessionistaProfile(user.id);
              useAppStore.setState({ isAuthenticated: true, userType: 'professionista', isAdmin: false });
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
          useAppStore.setState({
            utente: null,
            professionistaLoggato: null,
            userType: null,
            isAuthenticated: false,
            isAdmin: false,
          });
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
        useAppStore.setState({
          utente: null,
          professionistaLoggato: null,
          userType: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        return;
      }

      if (session?.user) {
        // Carica profilo aggiornato
        try {
          await useAppStore.getState().loadUserProfile(session.user.id);
          useAppStore.setState({ isAuthenticated: true, userType: 'utente', isAdmin: false });
        } catch {
          // Ignora e tenta come professionista
        }

        if (!useAppStore.getState().utente) {
          try {
            await useAppStore.getState().loadProfessionistaProfile(session.user.id);
            useAppStore.setState({ isAuthenticated: true, userType: 'professionista', isAdmin: false });
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