import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { professionistiHelpers, recensioniHelpers, serviziHelpers } from '@/lib/supabase-helpers';
import type { Professionista, Recensione, Servizio, SupabaseProfessionista } from '@/types';

import ProfessionistaPublicClient from './professionista-public-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const categoriaMapping: Record<string, string> = {
  Idraulico: 'idraulico',
  Elettricista: 'elettricista',
  Giardiniere: 'giardiniere',
  Imbianchino: 'imbianchino',
  Meccanico: 'meccanico',
  Informatico: 'informatico',
  Pulizie: 'pulizie',
  Traslochi: 'traslochi',
  Ristrutturazioni: 'ristrutturazioni',
  Altro: 'altro',
};

function convertSupabaseProfessionista(supabaseProf: SupabaseProfessionista): Professionista {
  const categoriaNormalizzata =
    categoriaMapping[supabaseProf.categoria_servizio] || supabaseProf.categoria_servizio.toLowerCase();

  return {
    id: supabaseProf.id,
    nome: supabaseProf.nome,
    cognome: supabaseProf.cognome,
    telefono: supabaseProf.telefono,
    email: supabaseProf.email,
    categoriaServizio: categoriaNormalizzata,
    specializzazioni: supabaseProf.specializzazioni,
    zonaServizio: supabaseProf.zona_servizio,
    orariDisponibili: supabaseProf.orari_disponibili,
    rating: supabaseProf.rating,
    numeroRecensioni: supabaseProf.numero_recensioni,
    fotoProfilo: supabaseProf.foto_profilo,
    descrizione: supabaseProf.descrizione,
    servizi: [],
    recensioni: [],
    isVerified: supabaseProf.is_verified,
    isActive: supabaseProf.is_active,
    dataRegistrazione: new Date(supabaseProf.data_registrazione),
    ultimoAccesso: supabaseProf.ultimo_accesso ? new Date(supabaseProf.ultimo_accesso) : undefined,
    partitaIva: supabaseProf.partita_iva,
    codiceFiscale: supabaseProf.codice_fiscale,
  };
}

function buildDescription(prof: Professionista) {
  const parts: string[] = [];
  if (prof.categoriaServizio) parts.push(`Categoria: ${prof.categoriaServizio}.`);
  if (prof.zonaServizio) parts.push(`Zona: ${prof.zonaServizio}.`);
  if (prof.specializzazioni?.length) parts.push(`Specializzazioni: ${prof.specializzazioni.slice(0, 4).join(', ')}.`);
  if (prof.rating) parts.push(`Rating: ${prof.rating.toFixed(1)}/5.`);
  const descr = parts.join(' ');
  return descr || 'Profilo professionista su Servizi Locali.';
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const prof = await professionistiHelpers.getProfessionistaById(params.id);
    if (!prof) {
      return {
        title: 'Profilo non trovato | Servizi Locali',
        robots: { index: false, follow: false },
      };
    }

    const p = convertSupabaseProfessionista(prof as unknown as SupabaseProfessionista);
    const fullName = `${p.nome} ${p.cognome}`.trim();
    const title = fullName ? `${fullName} | Servizi Locali` : 'Professionista | Servizi Locali';
    const description = buildDescription(p);
    const canonical = `/professionisti/${params.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      robots: p.isActive ? { index: true, follow: true } : { index: false, follow: false },
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${SITE_URL}${canonical}`,
        images: [
          {
            url: '/logo_servizi-locali.png',
            width: 1200,
            height: 630,
            alt: 'Servizi Locali',
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Professionista | Servizi Locali',
      robots: { index: false, follow: false },
    };
  }
}

async function getPageData(id: string): Promise<{
  professionista: Professionista;
  servizi: Servizio[];
  recensioni: Recensione[];
}> {
  const prof = await professionistiHelpers.getProfessionistaById(id);
  if (!prof) notFound();

  const p = convertSupabaseProfessionista(prof as unknown as SupabaseProfessionista);
  if (!p.isActive) notFound();

  const [serviziData, recensioniData] = await Promise.all([
    serviziHelpers.getServiziForProfessionista(id),
    recensioniHelpers.getRecensioniForProfessionista(id),
  ]);

  const servizi: Servizio[] = serviziData.map((s) => ({
    id: s.id,
    nome: s.nome,
    prezzoIndicativo: s.prezzo_indicativo,
    descrizione: s.descrizione,
  }));

  const recensioni: Recensione[] = recensioniData.map((r) => ({
    id: r.id,
    professionistaId: r.professionista_id,
    utenteId: r.utente_id,
    utenteNome: r.utente_nome,
    rating: r.rating,
    commento: r.commento,
    data: new Date(r.data),
    stato: r.stato,
    servizioRecensito: r.servizio_recensito,
  }));

  return { professionista: p, servizi, recensioni };
}

// ISR: Rigenera la pagina ogni ora (dati cambiano raramente)
export const revalidate = 3600; // 1 ora in secondi

export default async function ProfessionistaPublicPage({ params }: { params: { id: string } }) {
  const { professionista, servizi, recensioni } = await getPageData(params.id);
  return (
    <ProfessionistaPublicClient professionista={professionista} servizi={servizi} recensioni={recensioni} />
  );
}


