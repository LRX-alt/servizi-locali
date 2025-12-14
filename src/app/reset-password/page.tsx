'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // In alcuni setup il link di recovery porta i token in hash (#access_token=...&refresh_token=...)
        // e la sessione potrebbe non essere ancora stata "assorbita" dal client. La impostiamo esplicitamente.
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        if (hash) {
          const params = new URLSearchParams(hash.replace(/^#/, ''));
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
          if (type && type !== 'recovery') {
            setError('Link non valido: tipo non supportato.');
            setChecking(false);
            return;
          }
          if (access_token && refresh_token) {
            const { error: sessErr } = await supabase.auth.setSession({ access_token, refresh_token });
            if (sessErr) {
              setError('Link non valido o scaduto. Richiedi di nuovo il reset password.');
              setChecking(false);
              return;
            }
            // pulizia hash per evitare re-trigger
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        setHasSession(Boolean(session));
      } catch (e) {
        console.error('Reset password error:', e);
        setError('Errore imprevisto. Riprova più tardi.');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) throw updErr;
      setSuccess('Password aggiornata con successo. Ora puoi accedere.');
      setPassword('');
      setConfirm('');
      // Best practice: chiudi la sessione di recovery e torna al login
      try { await supabase.auth.signOut(); } catch {}
      router.push('/?login=1');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Errore durante l’aggiornamento della password.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Reimposta password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Inserisci una nuova password per il tuo account.
        </p>

        {checking ? (
          <div className="mt-6 text-sm text-gray-700">Verifico il link…</div>
        ) : !hasSession ? (
          <div className="mt-6 space-y-3">
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-md">
              Link non valido o scaduto. Apri questa pagina dal link ricevuto via email e riprova.
            </div>
            <button
              type="button"
              onClick={() => router.push('/?login=1')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Torna al login
            </button>
          </div>
        ) : (
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Nuova password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Conferma password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Salvataggio…' : 'Salva nuova password'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/?login=1')}
              className="w-full border border-gray-300 bg-white text-gray-900 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Torna al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


