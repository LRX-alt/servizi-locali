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
  // ===== NERETO =====
  {
    id: '1',
    nome: 'Comune di Nereto',
    tipo: 'comune',
    indirizzo: 'Piazza del Municipio, 1, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 123456',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per pratiche amministrative, certificati, anagrafe, stato civile, urbanistica e servizi al cittadino. Sportello unico per le attività produttive.'
  },
  {
    id: '2',
    nome: 'Ufficio Postale Nereto',
    tipo: 'poste',
    indirizzo: 'Via Roma, 15, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 234567',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari, pensioni, bollettini e servizi postali completi. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '3',
    nome: 'Farmacia Comunale Nereto',
    tipo: 'farmacia',
    indirizzo: 'Corso Garibaldi, 25, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 345678',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia, consulenza farmaceutica, parafarmaci, prodotti per l\'igiene e servizi di consegna a domicilio per anziani.'
  },
  {
    id: '4',
    nome: 'Banca Popolare di Ancona - Filiale Nereto',
    tipo: 'banca',
    indirizzo: 'Piazza Vittorio Emanuele, 8, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 456789',
    orari: 'Lun-Ven 8:30-13:30, 14:30-16:30',
    descrizione: 'Filiale bancaria per operazioni, consulenza finanziaria, mutui, prestiti, conti correnti e servizi di investimento. Sportello bancomat interno.'
  },
  {
    id: '5',
    nome: 'ASL - Distretto Sanitario Nereto',
    tipo: 'ufficio',
    indirizzo: 'Via San Francesco, 12, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 567890',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite mediche, certificati, vaccinazioni, servizi di medicina generale e specialistica. Centro prelievi e servizi sociali.'
  },
  {
    id: '6',
    nome: 'Carabinieri - Stazione Nereto',
    tipo: 'altro',
    indirizzo: 'Via Garibaldi, 30, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 678901',
    orari: 'H24 - Presidio permanente',
    descrizione: 'Stazione dei Carabinieri per denunce, certificati penali, servizi di sicurezza pubblica e assistenza ai cittadini. Emergenze: 112.'
  },
  {
    id: '7',
    nome: 'Vigili del Fuoco - Comando Nereto',
    tipo: 'altro',
    indirizzo: 'Via delle Industrie, 15, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 789012',
    orari: 'H24 - Presidio permanente',
    descrizione: 'Comando Vigili del Fuoco per emergenze, interventi di soccorso, verifiche di sicurezza e prevenzione incendi. Emergenze: 115.'
  },
  {
    id: '8',
    nome: 'Biblioteca Comunale Nereto',
    tipo: 'ufficio',
    indirizzo: 'Via Mazzini, 8, 64015 Nereto TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 890123',
    orari: 'Lun-Ven 9:00-13:00, 15:00-19:00, Sab 9:00-12:00',
    descrizione: 'Biblioteca comunale con prestito libri, sala lettura, internet point, attività culturali e laboratori per bambini e ragazzi.'
  },

  // ===== CORROPOLI =====
  {
    id: '9',
    nome: 'Comune di Corropoli',
    tipo: 'comune',
    indirizzo: 'Piazza Garibaldi, 1, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 901234',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile, urbanistica e servizi al cittadino. Sportello unico per imprese.'
  },
  {
    id: '10',
    nome: 'Farmacia Corropoli',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale, 45, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 012345',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia, consulenza farmaceutica, parafarmaci, prodotti per l\'igiene e servizi di consegna a domicilio.'
  },
  {
    id: '11',
    nome: 'Ufficio Postale Corropoli',
    tipo: 'poste',
    indirizzo: 'Via Roma, 22, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 123456',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari, pensioni e servizi postali. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '12',
    nome: 'ASL - Distretto Sanitario Corropoli',
    tipo: 'ufficio',
    indirizzo: 'Via San Giovanni, 18, 64013 Corropoli TE',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '+39 0736 234567',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite mediche, certificati, vaccinazioni e servizi di medicina generale. Centro prelievi e servizi sociali.'
  },

  // ===== MARTINSICURO =====
  {
    id: '13',
    nome: 'Comune di Martinsicuro',
    tipo: 'comune',
    indirizzo: 'Via Roma, 1, 64014 Martinsicuro TE',
    coordinate: { lat: 42.8833, lng: 13.9167 },
    telefono: '+39 0735 345678',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile e urbanistica. Sportello unico per attività produttive.'
  },
  {
    id: '14',
    nome: 'Farmacia Martinsicuro',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale Adriatica, 125, 64014 Martinsicuro TE',
    coordinate: { lat: 42.8833, lng: 13.9167 },
    telefono: '+39 0735 456789',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia, consulenza farmaceutica, parafarmaci e prodotti per l\'igiene personale e domestica.'
  },
  {
    id: '15',
    nome: 'Ufficio Postale Martinsicuro',
    tipo: 'poste',
    indirizzo: 'Via Roma, 45, 64014 Martinsicuro TE',
    coordinate: { lat: 42.8833, lng: 13.9167 },
    telefono: '+39 0735 567890',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari e servizi postali completi. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '16',
    nome: 'Carabinieri - Stazione Martinsicuro',
    tipo: 'altro',
    indirizzo: 'Via Garibaldi, 12, 64014 Martinsicuro TE',
    coordinate: { lat: 42.8833, lng: 13.9167 },
    telefono: '+39 0735 678901',
    orari: 'H24 - Presidio permanente',
    descrizione: 'Stazione dei Carabinieri per denunce, certificati penali e servizi di sicurezza pubblica. Emergenze: 112.'
  },

  // ===== ALBA ADRIATICA =====
  {
    id: '17',
    nome: 'Comune di Alba Adriatica',
    tipo: 'comune',
    indirizzo: 'Via Roma, 1, 64011 Alba Adriatica TE',
    coordinate: { lat: 42.8333, lng: 13.9667 },
    telefono: '+39 0861 789012',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile e urbanistica. Sportello unico per imprese e turismo.'
  },
  {
    id: '18',
    nome: 'Farmacia Alba Adriatica',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale Adriatica, 85, 64011 Alba Adriatica TE',
    coordinate: { lat: 42.8333, lng: 13.9667 },
    telefono: '+39 0861 890123',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia, consulenza farmaceutica, parafarmaci e prodotti per l\'igiene. Servizio estivo esteso.'
  },
  {
    id: '19',
    nome: 'Ufficio Postale Alba Adriatica',
    tipo: 'poste',
    indirizzo: 'Via Roma, 28, 64011 Alba Adriatica TE',
    coordinate: { lat: 42.8333, lng: 13.9667 },
    telefono: '+39 0861 901234',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari e servizi postali. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '20',
    nome: 'ASL - Distretto Sanitario Alba Adriatica',
    tipo: 'ufficio',
    indirizzo: 'Via San Francesco, 8, 64011 Alba Adriatica TE',
    coordinate: { lat: 42.8333, lng: 13.9667 },
    telefono: '+39 0861 012345',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite mediche, certificati, vaccinazioni e servizi di medicina generale. Centro prelievi.'
  },

  // ===== TORTORETO =====
  {
    id: '21',
    nome: 'Comune di Tortoreto',
    tipo: 'comune',
    indirizzo: 'Piazza Garibaldi, 1, 64018 Tortoreto TE',
    coordinate: { lat: 42.8000, lng: 13.9167 },
    telefono: '+39 0861 123456',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile e urbanistica. Sportello unico per attività produttive.'
  },
  {
    id: '22',
    nome: 'Farmacia Tortoreto',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale Adriatica, 95, 64018 Tortoreto TE',
    coordinate: { lat: 42.8000, lng: 13.9167 },
    telefono: '+39 0861 234567',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia, consulenza farmaceutica, parafarmaci e prodotti per l\'igiene personale e domestica.'
  },
  {
    id: '23',
    nome: 'Ufficio Postale Tortoreto',
    tipo: 'poste',
    indirizzo: 'Via Roma, 15, 64018 Tortoreto TE',
    coordinate: { lat: 42.8000, lng: 13.9167 },
    telefono: '+39 0861 345678',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari e servizi postali completi. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '24',
    nome: 'Carabinieri - Stazione Tortoreto',
    tipo: 'altro',
    indirizzo: 'Via Garibaldi, 25, 64018 Tortoreto TE',
    coordinate: { lat: 42.8000, lng: 13.9167 },
    telefono: '+39 0861 456789',
    orari: 'H24 - Presidio permanente',
    descrizione: 'Stazione dei Carabinieri per denunce, certificati penali e servizi di sicurezza pubblica. Emergenze: 112.'
  },

  // ===== GIULIANOVA =====
  {
    id: '25',
    nome: 'Comune di Giulianova',
    tipo: 'comune',
    indirizzo: 'Piazza della Libertà, 1, 64021 Giulianova TE',
    coordinate: { lat: 42.7500, lng: 13.9500 },
    telefono: '+39 085 567890',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile e urbanistica. Sportello unico per imprese e turismo.'
  },
  {
    id: '26',
    nome: 'Farmacia Giulianova Centro',
    tipo: 'farmacia',
    indirizzo: 'Via Roma, 45, 64021 Giulianova TE',
    coordinate: { lat: 42.7500, lng: 13.9500 },
    telefono: '+39 085 678901',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia centrale con servizio di guardia, consulenza farmaceutica, parafarmaci e prodotti per l\'igiene. Servizio estivo esteso.'
  },
  {
    id: '27',
    nome: 'Ufficio Postale Giulianova',
    tipo: 'poste',
    indirizzo: 'Via Nazionale Adriatica, 125, 64021 Giulianova TE',
    coordinate: { lat: 42.7500, lng: 13.9500 },
    telefono: '+39 085 789012',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari e servizi postali completi. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '28',
    nome: 'ASL - Distretto Sanitario Giulianova',
    tipo: 'ufficio',
    indirizzo: 'Via San Francesco, 22, 64021 Giulianova TE',
    coordinate: { lat: 42.7500, lng: 13.9500 },
    telefono: '+39 085 890123',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite mediche, certificati, vaccinazioni e servizi di medicina generale. Centro prelievi e servizi sociali.'
  },
  {
    id: '29',
    nome: 'Ospedale Civile Giulianova',
    tipo: 'ospedale',
    indirizzo: 'Via Nazario Sauro, 15, 64021 Giulianova TE',
    coordinate: { lat: 42.7500, lng: 13.9500 },
    telefono: '+39 085 901234',
    orari: 'H24 - Servizio continuativo',
    descrizione: 'Ospedale civile con pronto soccorso, reparti di medicina, chirurgia, pediatria e servizi diagnostici. Emergenze: 118.'
  },

  // ===== ROSETO DEGLI ABRUZZI =====
  {
    id: '30',
    nome: 'Comune di Roseto degli Abruzzi',
    tipo: 'comune',
    indirizzo: 'Piazza della Repubblica, 1, 64026 Roseto degli Abruzzi TE',
    coordinate: { lat: 42.6833, lng: 14.0167 },
    telefono: '+39 085 012345',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per servizi amministrativi, certificati, anagrafe, stato civile e urbanistica. Sportello unico per imprese e turismo.'
  },
  {
    id: '31',
    nome: 'Farmacia Roseto Centro',
    tipo: 'farmacia',
    indirizzo: 'Via Roma, 65, 64026 Roseto degli Abruzzi TE',
    coordinate: { lat: 42.6833, lng: 14.0167 },
    telefono: '+39 085 123456',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia centrale con servizio di guardia, consulenza farmaceutica, parafarmaci e prodotti per l\'igiene. Servizio estivo esteso.'
  },
  {
    id: '32',
    nome: 'Ufficio Postale Roseto degli Abruzzi',
    tipo: 'poste',
    indirizzo: 'Via Nazionale Adriatica, 185, 64026 Roseto degli Abruzzi TE',
    coordinate: { lat: 42.6833, lng: 14.0167 },
    telefono: '+39 085 234567',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni, pagamenti, servizi bancari e servizi postali completi. Sportello bancomat disponibile 24/7.'
  },
  {
    id: '33',
    nome: 'ASL - Distretto Sanitario Roseto',
    tipo: 'ufficio',
    indirizzo: 'Via San Francesco, 35, 64026 Roseto degli Abruzzi TE',
    coordinate: { lat: 42.6833, lng: 14.0167 },
    telefono: '+39 085 345678',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite mediche, certificati, vaccinazioni e servizi di medicina generale. Centro prelievi e servizi sociali.'
  },
  {
    id: '34',
    nome: 'Ospedale Civile Roseto degli Abruzzi',
    tipo: 'ospedale',
    indirizzo: 'Via Nazario Sauro, 25, 64026 Roseto degli Abruzzi TE',
    coordinate: { lat: 42.6833, lng: 14.0167 },
    telefono: '+39 085 456789',
    orari: 'H24 - Servizio continuativo',
    descrizione: 'Ospedale civile con pronto soccorso, reparti di medicina, chirurgia, pediatria e servizi diagnostici. Emergenze: 118.'
  }
]; 