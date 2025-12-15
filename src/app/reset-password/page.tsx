'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const processRecoveryLink = async () => {
      try {
        const hash = window.location.hash;
        
        // Se c'è un hash con token, processalo
        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.replace(/^#/, ''));
          
          // Controlla errori nell'URL
          const err = params.get('error');
          const errDesc = params.get('error_description');
          if (err) {
            setError(errDesc ? decodeURIComponent(errDesc.replace(/\+/g, ' ')) : 'Link non valido o scaduto.');
            setChecking(false);
            return;
          }

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const type = params.get('type');

          // Verifica che sia un link di recovery
          if (type && type !== 'recovery') {
            setError('Link non valido: questo non è un link di recupero password.');
            setChecking(false);
            return;
          }

          if (access_token && refresh_token) {
            console.log('[Reset Password] Impostazione sessione di recovery...');
            const { error: sessErr } = await supabase.auth.setSession({ 
              access_token, 
              refresh_token 
            });
            
            if (sessErr) {
              console.error('[Reset Password] Errore setSession:', sessErr);
              setError('Link non valido o scaduto. Richiedi un nuovo link di reset password.');
              setChecking(false);
              return;
            }

            // Pulisci l'hash dall'URL
            window.history.replaceState(null, '', window.location.pathname);
            console.log('[Reset Password] Sessione di recovery impostata con successo');
          }
        }

        // Verifica se abbiamo una sessione valida
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserEmail(session.user.email || null);
          setHasValidSession(true);
          console.log('[Reset Password] Sessione valida per:', session.user.email);
        } else {
          console.log('[Reset Password] Nessuna sessione valida');
          setHasValidSession(false);
        }
      } catch (e) {
        console.error('[Reset Password] Errore:', e);
        setError('Errore imprevisto. Riprova più tardi.');
      } finally {
        setChecking(false);
      }
    };

    processRecoveryLink();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validazione
    if (!password || password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.');
      return;
    }
    if (password !== confirm) {
      setError('Le password non coincidono.');
      return;
    }

    setSaving(true);
    try {
      // Verifica che la sessione sia ancora valida
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('La sessione è scaduta. Richiedi un nuovo link di reset password.');
        setHasValidSession(false);
        setSaving(false);
        return;
      }

      console.log('[Reset Password] Aggiornamento password...');
      const { error: updErr } = await supabase.auth.updateUser({ password });

      if (updErr) {
        console.error('[Reset Password] Errore updateUser:', updErr.message, updErr.status);
        
        // Gestisci errori specifici
        const errMsg = updErr.message?.toLowerCase() || '';
        if (updErr.status === 422 || errMsg.includes('same') || errMsg.includes('different')) {
          throw new Error('La nuova password deve essere diversa da quella attuale.');
        }
        if (errMsg.includes('weak') || errMsg.includes('strength')) {
          throw new Error('La password è troppo debole. Usa almeno 8 caratteri con lettere e numeri.');
        }
        if (errMsg.includes('expired') || errMsg.includes('invalid') || errMsg.includes('missing')) {
          setHasValidSession(false);
          throw new Error('Sessione scaduta. Richiedi un nuovo link di reset password.');
        }
        throw new Error(updErr.message || 'Errore durante l\'aggiornamento della password.');
      }

      console.log('[Reset Password] Password aggiornata con successo!');
      setSuccess('Password aggiornata con successo! Verrai reindirizzato al login...');
      setPassword('');
      setConfirm('');

      // Logout e redirect
      setTimeout(async () => {
        try { 
          await supabase.auth.signOut(); 
        } catch (e) {
          console.error('Logout error:', e);
        }
        router.push('/?login=1');
      }, 2000);
      
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Errore durante l\'aggiornamento della password.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image
          src="/logo_servizi-locali.png"
          alt="Servizi Locali"
          width={120}
          height={120}
          className="h-24 w-auto"
        />
      </Link>

      <div className="w-full max-w-md bg-white border rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Reimposta password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Inserisci una nuova password per il tuo account.
        </p>

        {checking ? (
          <div className="mt-6 flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Verifica in corso...</span>
          </div>
        ) : !hasValidSession ? (
          <div className="mt-6 space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            {!error && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-md">
                Link non valido o scaduto. Apri questa pagina dal link ricevuto via email.
              </div>
            )}
            <Link
              href="/?login=1"
              className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Torna al login
            </Link>
          </div>
        ) : (
          <>
            {userEmail && (
              <p className="text-sm text-blue-600 mt-3 bg-blue-50 px-3 py-2 rounded-md">
                Account: <strong>{userEmail}</strong>
              </p>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm" role="status">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nuova password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  autoComplete="new-password"
                  placeholder="Minimo 8 caratteri"
                  required
                  disabled={saving || !!success}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Conferma password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  autoComplete="new-password"
                  placeholder="Ripeti la password"
                  required
                  disabled={saving || !!success}
                />
              </div>

              <button
                type="submit"
                disabled={saving || !!success}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Salvataggio...' : 'Salva nuova password'}
              </button>

              <Link
                href="/?login=1"
                className="block w-full text-center border border-gray-300 bg-white text-gray-900 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Annulla
              </Link>
            </form>
          </>
        )}
      </div>

      {/* Footer mini */}
      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Servizi Locali
      </p>
    </div>
  );
}
