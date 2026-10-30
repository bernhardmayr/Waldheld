export interface Abzeichen {
  id: string;
  w: string;
  m: string;
  bedingung: string;
  symbol: string;
}

/** Bedingungen werden in store/badges.ts geprüft. */
export const abzeichen: Abzeichen[] = [
  {
    id: 'lebensraum',
    w: 'Lebensraum-Kennerin',
    m: 'Lebensraum-Kenner',
    bedingung: 'Station „Was ist ein Wald?“ mit 3 Sternen',
    symbol: '🌳',
  },
  {
    id: 'anatomie',
    w: 'Baum-Anatomin',
    m: 'Baum-Anatom',
    bedingung: 'Station „Teile des Baumes“ mit 3 Sternen',
    symbol: '🪵',
  },
  {
    id: 'jahreszeiten',
    w: 'Vier Jahreszeiten',
    m: 'Vier Jahreszeiten',
    bedingung: 'Station „Laubbaum im Jahresverlauf“ mit 3 Sternen',
    symbol: '🍂',
  },
  {
    id: 'blattlabor',
    w: 'Blatt-Forscherin',
    m: 'Blatt-Forscher',
    bedingung: 'Blatt-Labor komplett gelöst',
    symbol: '🔬',
  },
  {
    id: 'stockwerk',
    w: 'Stockwerk-Profi',
    m: 'Stockwerk-Profi',
    bedingung: 'Stockwerk-Aufzug ohne Fehler',
    symbol: '🛗',
  },
  {
    id: 'blattdetektiv',
    w: 'Blatt-Detektivin',
    m: 'Blatt-Detektiv',
    bedingung: '10 Blätter richtig bestimmt',
    symbol: '🍁',
  },
  {
    id: 'nadelprofi',
    w: 'Nadel-Profi',
    m: 'Nadel-Profi',
    bedingung: 'alle 4 Nadelbäume im Waldbuch freigeschaltet',
    symbol: '🌲',
  },
  {
    id: 'ahornass',
    w: 'Ahorn-Ass',
    m: 'Ahorn-Ass',
    bedingung: 'alle 3 Ahornblätter richtig zugeordnet',
    symbol: '🍁',
  },
  {
    id: 'sirup',
    w: 'Sirup-Kennerin',
    m: 'Sirup-Kenner',
    bedingung: 'Ahornsirup-Geschichte fehlerfrei sortiert',
    symbol: '🍯',
  },
  {
    id: 'tierfamilien',
    w: 'Tierfamilien-Kennerin',
    m: 'Tierfamilien-Kenner',
    bedingung: 'Station „Waldtierfamilien“ fehlerfrei',
    symbol: '🐗',
  },
  {
    id: 'kette',
    w: 'Kettenreaktion',
    m: 'Kettenreaktion',
    bedingung: '5 Nahrungsketten richtig gebaut',
    symbol: '🔗',
  },
  {
    id: 'netz',
    w: 'Netzwerkerin',
    m: 'Netzwerker',
    bedingung: 'Nahrungsnetz aus dem Heft fehlerfrei gelegt',
    symbol: '🕸️',
  },
  {
    id: 'adlerauge',
    w: 'Adlerauge',
    m: 'Adlerauge',
    bedingung: 'ein Wimmelbild komplett ohne Tipp gelöst',
    symbol: '🦅',
  },
  {
    id: 'recycling',
    w: 'Recycling-Profi',
    m: 'Recycling-Profi',
    bedingung: 'Recycling-Reihenfolge richtig und 30 Müllteile richtig sortiert',
    symbol: '♻️',
  },
  {
    id: 'suchsel',
    w: 'Wortschatzsucherin',
    m: 'Wortschatzsucher',
    bedingung: 'Suchsel komplett gelöst',
    symbol: '🔎',
  },
  {
    id: 'raetsel',
    w: 'Rätselkönigin',
    m: 'Rätselkönig',
    bedingung: 'Kreuzworträtsel ohne Tipp gelöst',
    symbol: '👑',
  },
  {
    id: 'schreibprofi',
    w: 'Schreibprofi',
    m: 'Schreibprofi',
    bedingung: '20 Werkstatt-Wörter richtig geschrieben',
    symbol: '✏️',
  },
  {
    id: 'dehnungsh',
    w: 'Dehnungs-h-Detektivin',
    m: 'Dehnungs-h-Detektiv',
    bedingung: '10 Wörter mit Dehnungs-h in Folge richtig',
    symbol: '🕵️',
  },
  {
    id: 'vorrat',
    w: 'Vorratsmeisterin',
    m: 'Vorratsmeister',
    bedingung: 'Vorratsspiel mit allen Nüssen gefunden',
    symbol: '🌰',
  },
  { id: 'dranbleiben', w: 'Dranbleiberin', m: 'Dranbleiber', bedingung: 'an 5 Tagen gespielt', symbol: '📅' },
  { id: 'waldheld', w: 'Waldheldin', m: 'Waldheld', bedingung: 'Waldprüfung bestanden', symbol: '🏅' },
];
