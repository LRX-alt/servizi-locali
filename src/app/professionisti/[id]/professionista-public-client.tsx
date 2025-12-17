'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Copy, Mail, MapPin, MessageCircle, Phone, Share2, ShieldAlert, ShieldCheck, Star } from 'lucide-react';

import { useAppStore } from '@/store';
import type { Professionista, Recensione, Servizio } from '@/types';

import Avatar from '@/components/Avatar';
import RecensioniList from '@/components/RecensioniList';
import AuthHeroCard from '@/components/AuthHeroCard';

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
      }`}
      aria-hidden="true"
    />
  ));
}

function useShareUrl() {
  return useMemo(() => (typeof window !== 'undefined' ? window.location.href : ''), []);
}

function ShareProfileButton({ title }: { title: string }) {
  const url = useShareUrl();
  const [status, setStatus] = useState<string>('');

  const copyToClipboard = async () => {
    try {
      if (!url) return;
      await navigator.clipboard.writeText(url);
      setStatus('Link copiato');
      window.setTimeout(() => setStatus(''), 1500);
    } catch {
      setStatus('Impossibile copiare il link');
      window.setTimeout(() => setStatus(''), 2000);
    }
  };

  const nativeShare = async () => {
    try {
      if (!url) return;
      if (navigator.share) {
        await navigator.share({ title, url });
        setStatus('');
        return;
      }
      await copyToClipboard();
    } catch {
      // Se l'utente annulla la share, non mostriamo errori.
    }
  };

  const canShare = typeof window !== 'undefined' && typeof navigator !== 'undefined' && Boolean((navigator as { share?: unknown }).share);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        aria-label={canShare ? 'Condividi profilo' : 'Copia link profilo'}
      >
        {canShare ? <Share2 className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
        {canShare ? 'Condividi' : 'Copia link'}
      </button>
      <span className="text-xs text-gray-500" aria-live="polite">
        {status}
      </span>
    </div>
  );
}

export default function ProfessionistaPublicClient({
  professionista,
  servizi,
  recensioni,
}: {
  professionista: Professionista;
  servizi: Servizio[];
  recensioni: Recensione[];
}) {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  const handleCall = () => {
    if (!professionista?.telefono) return;
    window.open(`tel:${professionista.telefono}`, '_self');
  };

  const handleWhatsApp = () => {
    if (!professionista?.telefono) return;
    const message = `Ciao ${professionista.nome}, sono interessato ai tuoi servizi. Potresti fornirmi maggiori informazioni?`;
    const encodedMessage = encodeURIComponent(message);
    const cleanedPhone = professionista.telefono.replace(/\s/g, '');
    window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const fullName = `${professionista.nome} ${professionista.cognome}`.trim() || 'Professionista';

  return (
    <main className="space-y-6 md:space-y-8" role="main" aria-label="Profilo professionista">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 w-fit"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Indietro
          </button>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 underline w-fit">
            Vai alla home
          </Link>
        </div>

        <ShareProfileButton title={`${fullName} | Servizi Locali`} />
      </div>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-labelledby="prof-header">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={professionista.fotoProfilo || null} alt={fullName} size="lg" />
            <div className="space-y-1">
              <h1 id="prof-header" className="text-2xl font-bold text-gray-900">
                {fullName}
              </h1>
              <p className="text-sm text-gray-600 capitalize">{professionista.categoriaServizio}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" aria-label={`Rating ${professionista.rating.toFixed(1)} su 5`}>
                  {renderStars(professionista.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {professionista.rating?.toFixed(1) || '0.0'} ({professionista.numeroRecensioni || 0})
                </span>
              </div>
            </div>
          </div>

          <div className="sm:ml-auto">
            {professionista.isVerified ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Verificato
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 text-sm">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                In attesa di verifica
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span>{professionista.zonaServizio || 'Zona non specificata'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span>{professionista.orariDisponibili || 'Orari non specificati'}</span>
            </div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span>{professionista.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span>{professionista.email}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Accedi per vedere i contatti diretti (telefono/email) e contattare il professionista.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-900">Specializzazioni</h2>
            <div className="flex flex-wrap gap-1">
              {professionista.specializzazioni?.length ? (
                professionista.specializzazioni.map((spec, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {spec}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Nessuna specializzazione indicata</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Descrizione</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{professionista.descrizione || 'Nessuna descrizione.'}</p>
        </div>

        <div className="mt-6">
          {isAuthenticated ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCall}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Chiama
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                WhatsApp
              </button>
            </div>
          ) : (
            <AuthHeroCard />
          )}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-labelledby="servizi-heading">
        <div className="flex items-center justify-between">
          <h2 id="servizi-heading" className="text-lg font-semibold text-gray-900">
            Servizi
          </h2>
          <span className="text-sm text-gray-600">{servizi.length} voci</span>
        </div>

        {servizi.length === 0 ? (
          <p className="text-gray-600 text-sm mt-3">Nessun servizio pubblicato.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {servizi.map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.nome}</h3>
                    <p className="text-sm text-gray-600">{s.prezzoIndicativo}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{s.descrizione}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-label="Recensioni professionista">
        <RecensioniList recensioni={recensioni} showAll />
      </section>
    </main>
  );
}



