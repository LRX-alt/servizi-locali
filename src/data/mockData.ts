import { Professionista, ServizioPubblico, Categoria } from '@/types';

// ... (mantieni le categorie e i professionisti come sono)

export const serviziPubblici: ServizioPubblico[] = [
  {
    id: '1',
    nome: 'Comune di Nereto',
    tipo: 'comune',
    indirizzo: 'Piazza del Municipio, 1, 64015 Nereto TE',

    telefono: '+39 0736 123456',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per pratiche e documenti'
  },
  {
    id: '2',
    nome: 'Ufficio Postale Nereto',
    tipo: 'poste',
    indirizzo: 'Via Roma, 15, 64015 Nereto TE',

    telefono: '+39 0736 234567',
    orari: 'Lun-Ven 8:20-19:05, Sab 8:20-12:35',
    descrizione: 'Ufficio postale per spedizioni e pagamenti'
  },
  {
    id: '3',
    nome: 'Farmacia Comunale Nereto',
    tipo: 'farmacia',
    indirizzo: 'Corso Garibaldi, 25, 64015 Nereto TE',

    telefono: '+39 0736 345678',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia'
  },
  {
    id: '4',
    nome: 'Banca Popolare Nereto',
    tipo: 'banca',
    indirizzo: 'Piazza Vittorio Emanuele, 8, 64015 Nereto TE',

    telefono: '+39 0736 456789',
    orari: 'Lun-Ven 8:30-13:30, 14:30-16:30',
    descrizione: 'Filiale bancaria per operazioni e consulenza'
  },
  {
    id: '5',
    nome: 'ASL - Distretto Sanitario Nereto',
    tipo: 'ospedale',
    indirizzo: 'Via San Francesco, 12, 64015 Nereto TE',

    telefono: '+39 0736 567890',
    orari: 'Lun-Ven 8:00-14:00',
    descrizione: 'Distretto sanitario per visite e certificati'
  },
  {
    id: '6',
    nome: 'Comune di Corropoli',
    tipo: 'comune',
    indirizzo: 'Piazza Garibaldi, 1, 64013 Corropoli TE',

    telefono: '+39 0736 678901',
    orari: 'Lun-Ven 8:30-12:30, Mar-Gio 15:00-17:00',
    descrizione: 'Ufficio comunale per pratiche e documenti'
  },
  {
    id: '7',
    nome: 'Farmacia Corropoli',
    tipo: 'farmacia',
    indirizzo: 'Via Nazionale, 45, 64013 Corropoli TE',

    telefono: '+39 0736 789012',
    orari: 'Lun-Sab 8:30-19:30, Dom 9:00-12:00',
    descrizione: 'Farmacia con servizio di guardia'
  }
];