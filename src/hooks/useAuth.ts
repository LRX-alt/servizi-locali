import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';
import type { AuthError } from '@supabase/supabase-js';

export function useAuth() {
  const store = useAppStore();

  useEffect(() => {
    // Listener per i cambiamenti di stato dell'autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        switch (event) {
          case 'SIGNED_IN':
            // L'utente ha effettuato l'accesso
            console.log('User signed in');
            break;
            
          case 'SIGNED_OUT':
            // L'utente ha effettuato il logout o il token è scaduto
            console.log('User signed out');
            store.logout();
            break;
            
          case 'TOKEN_REFRESHED':
            // Il token è stato aggiornato con successo
            console.log('Token refreshed successfully');
            break;
            
          case 'USER_UPDATED':
            // I dati dell'utente sono stati aggiornati
            console.log('User updated');
            break;
            
          default:
            break;
        }
      }
    );

    // Gestione globale degli errori di autenticazione
    const handleAuthError = (error: AuthError) => {
      console.error('Auth error:', error);
      
      // Gestione specifica per refresh token scaduto
      if (error.message?.includes('refresh_token') || 
          error.message?.includes('Refresh Token') ||
          error.message?.includes('Invalid Refresh Token')) {
        
        console.log('Refresh token expired, logging out user');
        
        // Logout automatico
        store.logout();
        
        // Mostra notifica all'utente (senza toast per preferenze utente)
        store.setError('La tua sessione è scaduta. Effettua nuovamente l\'accesso.');
        
        // Pulisce il token dal localStorage
        supabase.auth.signOut().catch(console.error);
      }
    };

    // Interceptor per errori Supabase
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      // Intercetta errori di refresh token dalla console
      if (errorMessage.includes('AuthApiError') && 
          errorMessage.includes('Invalid Refresh Token')) {
        handleAuthError({
          message: 'Invalid Refresh Token: Refresh Token Not Found',
          name: 'AuthApiError'
        } as AuthError);
      }
      
      originalError.apply(console, args);
    };

    // Cleanup
    return () => {
      subscription.unsubscribe();
      console.error = originalError;
    };
  }, [store]);

  return {
    isAuthenticated: store.isAuthenticated,
    user: store.utente,
    professionista: store.professionistaLoggato,
    userType: store.userType,
    isLoading: store.authLoading,
    error: store.error
  };
}