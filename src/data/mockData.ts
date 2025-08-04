import { Professionista, ServizioPubblico, Categoria } from '@/types';

export const categorie: Categoria[] = [
  {
    id: 'idraulico',
    nome: 'Idraulico',
    icona: '🔧',
    descrizione: 'Servizi idraulici e riparazioni',
    sottocategorie: ['Riparazioni', 'Installazioni', 'Manutenzione']
  },
  {
    id: 'elettricista',
    nome: 'Elettricista',
    icona: '⚡',
    descrizione: 'Servizi elettrici e impianti',
    sottocategorie: ['Impianti', 'Riparazioni', 'Installazioni']
  },
  {
    id: 'giardiniere',
    nome: 'Giardiniere',
    icona: '🌿',
    descrizione: 'Cura giardini e spazi verdi',
    sottocategorie: ['Potatura', 'Manutenzione', 'Progettazione']
  },
  {
    id: 'imbianchino',
    nome: 'Imbianchino',
    icona: '🎨',
    descrizione: 'Pittura e decorazioni',
    sottocategorie: ['Interni', 'Esterni', 'Decorazioni']
  },
  {
    id: 'meccanico',
    nome: 'Meccanico',
    icona: '🔧',
    descrizione: 'Riparazioni auto e moto',
    sottocategorie: ['Auto', 'Moto', 'Manutenzione']
  },
  {
    id: 'informatico',
    nome: 'Informatico',
    icona: '💻',
    descrizione: 'Assistenza computer e software',
    sottocategorie: ['Hardware', 'Software', 'Rete']
  }
];

export const professionisti: Professionista[] = [
  {
    id: '1',
    nome: 'Mario',
    cognome: 'Rossi',
    telefono: '+39 333 1234567',
    email: 'mario.rossi@email.com',
    categoriaServizio: 'idraulico',
    specializzazioni: ['Riparazioni', 'Installazioni'],
    zonaServizio: 'Nereto',
    orariDisponibili: 'Lun-Ven 8:00-18:00',
    rating: 4.8,
    numeroRecensioni: 15,
    descrizione: 'Idraulico esperto con 10 anni di esperienza. Specializzato in riparazioni e installazioni.',
    servizi: [
      {
        id: '1-1',
        nome: 'Riparazione perdite',
        prezzoIndicativo: '€50-100',
        descrizione: 'Riparazione perdite d\'acqua e tubature'
      },
      {
        id: '1-2',
        nome: 'Installazione sanitari',
        prezzoIndicativo: '€200-500',
        descrizione: 'Installazione bagni e cucine'
      }
    ],
    recensioni: [
      {
        id: 'rec-1',
        professionistaId: '1',
        utenteId: 'user-1',
        utenteNome: 'Giuseppe Bianchi',
        rating: 5,
        commento: 'Ottimo lavoro! Ha risolto il problema della perdita in fretta e con professionalità. Consigliatissimo!',
        data: new Date('2024-01-15'),
        stato: 'approvata',
        servizioRecensito: 'Riparazione perdite'
      },
      {
        id: 'rec-2',
        professionistaId: '1',
        utenteId: 'user-2',
        utenteNome: 'Maria Rossi',
        rating: 4,
        commento: 'Molto professionale e puntuale. Ha installato il nuovo bagno perfettamente.',
        data: new Date('2024-01-10'),
        stato: 'approvata',
        servizioRecensito: 'Installazione sanitari'
      },
      {
        id: 'rec-3',
        professionistaId: '1',
        utenteId: 'user-3',
        utenteNome: 'Antonio Verdi',
        rating: 5,
        commento: 'Prezzi onesti e lavoro di qualità. Tornerò sicuramente!',
        data: new Date('2024-01-05'),
        stato: 'approvata',
        servizioRecensito: 'Riparazione perdite'
      }
    ]
  },
  {
    id: '2',
    nome: 'Giuseppe',
    cognome: 'Bianchi',
    telefono: '+39 333 2345678',
    email: 'giuseppe.bianchi@email.com',
    categoriaServizio: 'elettricista',
    specializzazioni: ['Impianti', 'Riparazioni'],
    zonaServizio: 'Corropoli',
    orariDisponibili: 'Lun-Sab 7:00-19:00',
    rating: 4.6,
    numeroRecensioni: 12,
    descrizione: 'Elettricista certificato per impianti civili e industriali.',
    servizi: [
      {
        id: '2-1',
        nome: 'Installazione impianto elettrico',
        prezzoIndicativo: '€1000-3000',
        descrizione: 'Impianti elettrici completi'
      },
      {
        id: '2-2',
        nome: 'Riparazione guasti',
        prezzoIndicativo: '€80-150',
        descrizione: 'Riparazione guasti elettrici'
      }
    ],
    recensioni: [
      {
        id: 'rec-4',
        professionistaId: '2',
        utenteId: 'user-4',
        utenteNome: 'Carlo Neri',
        rating: 5,
        commento: 'Elettricista molto competente. Ha risolto un problema complesso in poco tempo.',
        data: new Date('2024-01-12'),
        stato: 'approvata',
        servizioRecensito: 'Riparazione guasti'
      },
      {
        id: 'rec-5',
        professionistaId: '2',
        utenteId: 'user-5',
        utenteNome: 'Lucia Gialli',
        rating: 4,
        commento: 'Lavoro ben fatto, un po\' lento ma molto preciso.',
        data: new Date('2024-01-08'),
        stato: 'approvata',
        servizioRecensito: 'Installazione impianto elettrico'
      }
    ]
  },
  {
    id: '3',
    nome: 'Antonio',
    cognome: 'Verdi',
    telefono: '+39 333 3456789',
    email: 'antonio.verdi@email.com',
    categoriaServizio: 'giardiniere',
    specializzazioni: ['Potatura', 'Manutenzione'],
    zonaServizio: 'Controguerra',
    orariDisponibili: 'Lun-Ven 8:00-17:00',
    rating: 4.9,
    numeroRecensioni: 8,
    descrizione: 'Giardiniere esperto in potatura e manutenzione giardini.',
    servizi: [
      {
        id: '3-1',
        nome: 'Potatura alberi',
        prezzoIndicativo: '€100-300',
        descrizione: 'Potatura alberi e siepi'
      },
      {
        id: '3-2',
        nome: 'Manutenzione giardino',
        prezzoIndicativo: '€50-150',
        descrizione: 'Taglio erba e manutenzione'
      }
    ],
    recensioni: [
      {
        id: 'rec-6',
        professionistaId: '3',
        utenteId: 'user-6',
        utenteNome: 'Roberto Bianchi',
        rating: 5,
        commento: 'Giardiniere eccezionale! Ha trasformato il mio giardino in un paradiso.',
        data: new Date('2024-01-14'),
        stato: 'approvata',
        servizioRecensito: 'Manutenzione giardino'
      },
      {
        id: 'rec-7',
        professionistaId: '3',
        utenteId: 'user-7',
        utenteNome: 'Elena Rossi',
        rating: 5,
        commento: 'Molto professionale e attento ai dettagli. Consigliatissimo!',
        data: new Date('2024-01-09'),
        stato: 'approvata',
        servizioRecensito: 'Potatura alberi'
      }
    ]
  },
  {
    id: '4',
    nome: 'Roberto',
    cognome: 'Neri',
    telefono: '+39 333 4567890',
    email: 'roberto.neri@email.com',
    categoriaServizio: 'imbianchino',
    specializzazioni: ['Interni', 'Esterni'],
    zonaServizio: 'Martinsicuro',
    orariDisponibili: 'Lun-Ven 8:00-18:00',
    rating: 4.7,
    numeroRecensioni: 10,
    descrizione: 'Imbianchino professionale con esperienza in interni ed esterni.',
    servizi: [
      {
        id: '4-1',
        nome: 'Tinteggiatura interni',
        prezzoIndicativo: '€3-8/m²',
        descrizione: 'Tinteggiatura di pareti interne'
      },
      {
        id: '4-2',
        nome: 'Tinteggiatura esterni',
        prezzoIndicativo: '€8-15/m²',
        descrizione: 'Tinteggiatura di facciate esterne'
      }
    ],
    recensioni: [
      {
        id: 'rec-8',
        professionistaId: '4',
        utenteId: 'user-8',
        utenteNome: 'Marco Bianchi',
        rating: 5,
        commento: 'Lavoro impeccabile! Ha dipinto tutta la casa in modo perfetto.',
        data: new Date('2024-01-13'),
        stato: 'approvata',
        servizioRecensito: 'Tinteggiatura interni'
      }
    ]
  },
  {
    id: '5',
    nome: 'Luca',
    cognome: 'Gialli',
    telefono: '+39 333 5678901',
    email: 'luca.gialli@email.com',
    categoriaServizio: 'meccanico',
    specializzazioni: ['Auto', 'Moto'],
    zonaServizio: 'Alba Adriatica',
    orariDisponibili: 'Lun-Sab 8:00-19:00',
    rating: 4.5,
    numeroRecensioni: 18,
    descrizione: 'Meccanico specializzato in auto e moto con officina attrezzata.',
    servizi: [
      {
        id: '5-1',
        nome: 'Revisione auto',
        prezzoIndicativo: '€80-200',
        descrizione: 'Revisione completa veicolo'
      },
      {
        id: '5-2',
        nome: 'Riparazione moto',
        prezzoIndicativo: '€50-150',
        descrizione: 'Riparazioni meccaniche moto'
      }
    ],
    recensioni: [
      {
        id: 'rec-9',
        professionistaId: '5',
        utenteId: 'user-9',
        utenteNome: 'Paolo Rossi',
        rating: 4,
        commento: 'Meccanico onesto e competente. Prezzi giusti.',
        data: new Date('2024-01-11'),
        stato: 'approvata',
        servizioRecensito: 'Revisione auto'
      }
    ]
  }
];

export const serviziPubblici: ServizioPubblico[] = [
  {
    id: '1',
    nome: 'Comune di Nereto',
    tipo: 'comune',
    indirizzo: 'Piazza del Municipio, 1, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 123456',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per pratiche e documenti'
  },
  {
    id: '2',
    nome: 'Ufficio Postale Nereto',
    tipo: 'poste',
    indirizzo: 'Via Roma, 15, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 234567',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni e pagamenti'
  },
  {
    id: '3',
    nome: 'Farmacia Comunale Nereto',
    tipo: 'farmacia',
    indirizzo: 'Corso Garibaldi, 25, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 345678',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia'
  },
  {
    id: '4',
    nome: 'Banca Popolare Nereto',
    tipo: 'banca',
    indirizzo: 'Piazza Vittorio Emanuele, 8, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 456789',
    orari: 'Lun-Ven 8:30-13:30, 14:30-16:30',
    descrizione: 'Filiale bancaria per operazioni e consulenza'
  },
  {
    id: '5',
    nome: 'ASL - Distretto Sanitario Nereto',
    tipo: 'ufficio',
    indirizzo: 'Via San Francesco, 12, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 567890',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite e certificati'
  },
  {
    id: '6',
    nome: 'Comune di Corropoli',
    tipo: 'comune',
    indirizzo: 'Piazza Garibaldi, 1, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 678901',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per pratiche e documenti'
  },
  {
    id: '7',
    nome: 'Farmacia Corropoli',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale, 45, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 789012',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia'
  }
]; 