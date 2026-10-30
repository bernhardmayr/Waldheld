import type { Fact, ModuleId } from './types';

/** Alle Fakten aus docs/SPEC.md Abschnitt 4, in eigenen Worten. */
const roh: [ModuleId, string, string, boolean?][] = [
  // M1 Teile des Baumes
  ['m01', 'stamm', 'Der Stamm trägt den Baum.'],
  ['m01', 'rinde', 'Die harte Rinde schützt den Stamm.'],
  ['m01', 'aeste', 'Am Stamm wachsen die dicken Äste.'],
  ['m01', 'zweige', 'An den Ästen wachsen die dünnen Zweige.'],
  ['m01', 'blaetter', 'Im Frühjahr wachsen die Blätter.'],
  ['m01', 'blueten', 'Im Frühjahr bekommt der Baum Blüten.'],
  ['m01', 'fruechte', 'Aus den Blüten werden bis zum Herbst Früchte.'],
  ['m01', 'krone', 'Äste, Zweige und Blätter zusammen heißen Baumkrone.'],
  ['m01', 'wurzeln', 'Die Wurzeln halten den Baum fest und versorgen ihn mit Nährstoffen.'],
  // M2 Jahresverlauf
  [
    'm02',
    'fruehling',
    'Im Frühling wachsen aus den Knospen Blätter, alle Laubbäume blühen, das Laub ist hellgrün.',
  ],
  ['m02', 'sommer', 'Im Sommer sind die Blätter groß und dunkelgrün. Der Baum hat ein dichtes Blätterdach.'],
  [
    'm02',
    'herbst',
    'Im Herbst sind die meisten Früchte reif. Die Blätter werden gelb und rot und fallen ab.',
  ],
  ['m02', 'winter', 'Im Winter sind Laubbäume kahl. An manchen Zweigen hängen noch Früchte.'],
  ['m02', 'nadelwinter', 'Im Winter sind nur die Nadelbäume nicht kahl.'],
  // M3 Laub- und Nadelbäume
  ['m03', 'laub', 'Laubbäume haben Blätter, die sich im Herbst oft bunt färben und abfallen.'],
  [
    'm03',
    'laubfrucht',
    'Laubbäume haben Blüten, aus denen bis zum Herbst Früchte wachsen, z. B. Kastanie und Eichel.',
  ],
  ['m03', 'sommergruen', 'Laubbäume sind meist sommergrün.'],
  ['m03', 'nadeln', 'Nadelbäume haben Nadeln. Nadeln sind umgeformte Blätter.'],
  ['m03', 'immergruen', 'Nadelbäume erneuern ihre Nadeln nach und nach. Darum heißen sie immergrün.'],
  ['m03', 'laerche', 'Die Lärche ist eine Ausnahme: Sie verliert ihre Nadeln im Herbst.'],
  ['m03', 'zapfen', 'Nadelbäume haben keine Früchte, sondern Zapfen.'],
  // M4 Waldarten
  ['m04', 'laubwald', 'Im Laubwald wachsen nur Laubbäume.'],
  ['m04', 'laubhaeufig', 'Im Laubwald sind Buche und Eiche häufig.'],
  ['m04', 'laubselten', 'Kastanie, Ahorn, Esche, Birke und Ulme sind im Laubwald seltener.'],
  ['m04', 'nadelwald', 'Im Nadelwald wachsen nur Nadelbäume.'],
  ['m04', 'nadelhaeufig', 'Im Nadelwald sind Kiefer und Fichte häufig.'],
  ['m04', 'nadelselten', 'Lärche und Tanne sind seltener. Im Gebirge gibt es sie häufiger.'],
  ['m04', 'mischwald', 'Im Mischwald wachsen Laub- und Nadelbäume gemischt.'],
  // M5 Laubbäume
  [
    'm05',
    'ahorn',
    'Der Ahorn hat einen geraden Stamm, eine rundliche Krone, gelappte Blätter, hängende Blütentrauben und Flügelfrüchte.',
  ],
  [
    'm05',
    'buche',
    'Die Buche hat einen schlanken, glatten Stamm, eiförmige Blätter mit glattem Rand und Bucheckern in stacheliger Hülle.',
  ],
  ['m05', 'eiche', 'Die Eiche hat einen dicken, knorrigen Stamm, gebuchtete Blätter und Eicheln im Becher.'],
  [
    'm05',
    'kastanie',
    'Die Kastanie hat eine breite Krone, gefingerte Blätter, weiße Blüten-Kerzen und Kastanien in stacheliger Schale.',
  ],
  [
    'm05',
    'blattformen',
    'Blattformen: gelappt (Ahorn), eiförmig (Buche), gebuchtet (Eiche), gefingert (Kastanie).',
  ],
  // M6 Nadelbäume
  [
    'm06',
    'fichte',
    'Die Fichte ist schmal und spitz. Ihre kurzen, spitzen Nadeln sitzen rundum. Ihre Zapfen hängen nach unten.',
  ],
  [
    'm06',
    'kiefer',
    'Die Kiefer hat einen hohen, kahlen Stamm und oben eine Krone wie ein Schirm. Ihre langen Nadeln sind immer zu zweit.',
  ],
  ['m06', 'laerche', 'Die Lärche hat weiche Nadeln in Büscheln. Im Herbst werden sie gelb und fallen ab.'],
  [
    'm06',
    'tanne',
    'Die Tanne hat flache, weiche Nadeln mit zwei hellen Streifen unten. Ihre Zapfen stehen aufrecht.',
  ],
  [
    'm06',
    'merk',
    'Merksatz: Die Fichte sticht, die Tanne nicht. Tannenzapfen stehen, Fichtenzapfen hängen.',
    true,
  ],
  // M7 Ahorn
  ['m07', 'acer', 'Der Ahorn heißt lateinisch Acer. Er wird bis zu 30 m hoch und ist sommergrün.'],
  ['m07', 'arten', 'In Deutschland gibt es vor allem Berg-, Spitz- und Feld-Ahorn.'],
  ['m07', 'berg', 'Der Berg-Ahorn hat Blätter mit 5 Lappen und leicht gesägtem Rand.'],
  ['m07', 'feld', 'Der Feld-Ahorn hat meist 5 Lappen und einen glatten Rand ohne Zacken.'],
  ['m07', 'spitz', 'Der Spitz-Ahorn hat 5 bis 7 Lappen mit spitzen Zipfeln und runden Buchten dazwischen.'],
  ['m07', 'zucker', 'Der Zucker-Ahorn stammt aus den USA und Kanada. Aus ihm wird Ahornsirup gemacht.'],
  ['m07', 'sirup', 'Ureinwohner Nordamerikas entdeckten den süßen Ahornsaft durch ein Eichhörnchen.'],
  // M8 Waldtierfamilien
  [
    'm08',
    'keiler',
    'Das Wildschwein-Männchen heißt Keiler. Es hat Hauer, das sind große, gebogene Eckzähne.',
  ],
  ['m08', 'bache', 'Das Wildschwein-Weibchen heißt Bache. Es bekommt im Frühjahr 4 bis 8 Frischlinge.'],
  [
    'm08',
    'frischling',
    'Das Wildschwein-Junge heißt Frischling. Es hat 4 bis 5 helle Streifen auf dem Rücken.',
  ],
  ['m08', 'rehbock', 'Das Reh-Männchen heißt Rehbock. Es hat ein Gehörn, ein kleines Geweih.'],
  ['m08', 'ricke', 'Das Reh-Weibchen heißt Ricke. Es bekommt im Frühjahr 1 bis 2 Kitze.'],
  ['m08', 'kitz', 'Das Reh-Junge heißt Rehkitz. Es hat weiße Flecken auf dem Rücken.'],
  ['m08', 'fruehling', 'Viele Waldtiere bekommen ihre Jungen im Frühling.'],
  // M9 Eichhörnchen
  ['m09', 'klasse', 'Das Eichhörnchen ist ein Säugetier und ein Nagetier.'],
  [
    'm09',
    'aussehen',
    'Es ist etwa 25 cm groß, hat Pinselohren, einen weißen Bauch und einen buschigen Schwanz.',
  ],
  ['m09', 'schwanz', 'Der Schwanz hilft beim Steuern, beim Gleichgewicht, zum Wärmen und zur Verständigung.'],
  ['m09', 'klettern', 'Scharfe Krallen und kräftige Hinterbeine machen es zum guten Kletterer.'],
  ['m09', 'lebensraum', 'Es lebt in allen Waldarten und bei genug Futter auch in Parks und Gärten.'],
  ['m09', 'futter', 'Es frisst Samen, Nüsse, Eicheln, Beeren, Pilze und Blüten, manchmal Vogeleier.'],
  ['m09', 'tagaktiv', 'Das Eichhörnchen ist tagaktiv. Nachts schläft es im Kobel oder in einer Baumhöhle.'],
  ['m09', 'kobel', 'Der Kobel ist ein Nest aus Zweigen im Baum.'],
  [
    'm09',
    'winterruhe',
    'Es hält Winterruhe, keinen Winterschlaf. Es sucht im Winter seine versteckten Vorräte.',
  ],
  ['m09', 'junge', 'Ein Eichhörnchen bekommt 2 bis 5 Junge.'],
  ['m09', 'feinde', 'Feinde sind Habicht, Katze und besonders der Marder.'],
  // M10 Nahrungsketten
  ['m10', 'produzent', 'Pflanzen sind Produzenten. Sie stellen mit Sonnenlicht ihre Nahrung selbst her.'],
  ['m10', 'pflanzenfresser', 'Schnecken, Kaninchen, Eichhörnchen und Mäuse sind Pflanzenfresser.'],
  ['m10', 'fleischfresser', 'Eulen und Füchse sind Fleischfresser.'],
  ['m10', 'allesfresser', 'Allesfresser fressen Pflanzen und Tiere, zum Beispiel das Wildschwein.', true],
  [
    'm10',
    'destruent',
    'Pilze und Bakterien sind Destruenten. Sie zersetzen Totes und geben Nährstoffe an den Boden.',
  ],
  ['m10', 'pfeil', 'Der Pfeil in der Nahrungskette bedeutet „wird gefressen von“.'],
  ['m10', 'netz', 'Ketten hängen zu einem Nahrungsnetz zusammen, weil Tiere dieselben Dinge fressen.'],
  ['m10', 'energie', 'Der Pfeil „Energie geht an“ zeigt zum Pilz: Er zersetzt Totes.'],
  // M11 ist der Wortschatz (words.ts)
  ['m11', 'woerter', 'Waldwörter richtig schreiben.'],
  // M12 Müll
  ['m12', 'dose', 'Eine Getränkedose bleibt bis zu 500 Jahre in der Natur liegen.'],
  ['m12', 'verbrennen', 'Müll wird meist verbrannt oder vergraben.'],
  ['m12', 'sorge', 'Beim Verbrennen können gefährliche Stoffe in die Luft gelangen.'],
  ['m12', 'meer', 'Manche Städte bringen Müll mit Schiffen in andere Länder oder kippen ihn ins Meer.'],
  ['m12', 'arm', 'Menschen auf dem Land in armen Ländern machen kaum Müll.'],
  ['m12', 'recycling', 'Wiederverwerten: sammeln, in die Fabrik bringen, neue Produkte herstellen.'],
  ['m12', 'vorteile', 'Wiederverwerten macht weniger Abfall und spart Rohstoffe.'],
  ['m12', 'kauf', 'Vor dem Kauf fragen: Brauche ich das? Gibt es etwas mit weniger Verpackung?'],
  ['m12', 'klasse', 'Ideen für die Klasse: Brotdosen benutzen und wenig Papier zum Abtrocknen.'],
  ['m12', 'wald', 'Den Wald schützen heißt auch: keinen Müll hinterlassen.'],
  // M13 Was ist ein Wald?
  ['m13', 'lebensraum', 'Ein Wald ist ein großer Lebensraum, in dem viele Bäume wachsen.'],
  ['m13', 'zwischen', 'Zwischen den Bäumen wachsen Sträucher, Kräuter, Moose und Pilze.'],
  ['m13', 'tiere', 'Im Wald leben viele Tiere, zum Beispiel Vögel, Insekten, Rehe und Füchse.'],
  ['m13', 'abhaengig', 'Pflanzen sind Nahrung für Tiere und geben ihnen Schutz.'],
  ['m13', 'zersetzt', 'Abgestorbene Pflanzenteile werden zersetzt und geben dem Boden Nährstoffe zurück.'],
  ['m13', 'fuertiere', 'Für Tiere bietet der Wald Nahrung, Schutz und Lebensraum.'],
  ['m13', 'fuermenschen', 'Für Menschen liefert der Wald Holz und bietet Erholung.'],
  ['m13', 'fuerumwelt', 'Für die Umwelt speichert der Wald Wasser, schützt den Boden und reinigt die Luft.'],
  ['m13', 'merksatz', 'Der Wald ist ein vielfältiger Lebensraum. Wir sollten ihn schützen.'],
  // M14 Stockwerke
  ['m14', 'haus', 'Der Wald ist wie ein Haus mit fünf Stockwerken.'],
  ['m14', 'krone', 'Ganz oben ist die Kronenschicht: Eule, Habicht, Specht, Adler, Fledermaus.'],
  ['m14', 'strauch', 'Die Strauchschicht hat Sträucher und junge Bäume: Amsel, Marder, Reh.'],
  ['m14', 'kraut', 'Die Krautschicht hat Kräuter, Farne und Blumen: Maus, Fuchs, Eidechse, Kaninchen.'],
  ['m14', 'moos', 'Die Moosschicht hat Moose und Pilze am Boden: Käfer, Ameise, Schnecke.'],
  ['m14', 'wurzel', 'Ganz unten ist die Wurzelschicht im Boden: Maulwurf, Regenwurm.'],
  ['m14', 'eichhoernchen', 'Das Eichhörnchen lebt mit seinem Kobel in der Kronenschicht.', true],
  // M15 Blätter
  ['m15', 'zucker', 'In grünen Blättern stellt der Baum Zucker und Sauerstoff her.'],
  ['m15', 'wichtig', 'Zucker ist die Nahrung des Baumes. Sauerstoff brauchen wir Menschen.'],
  ['m15', 'zutaten', 'Dafür braucht der Baum Wasser, Kohlenstoffdioxid und Sonnenlicht.'],
  ['m15', 'kuerzer', 'Im Herbst scheint die Sonne kürzer. Der Baum stellt weniger Nahrung her.'],
  ['m15', 'abwerfen', 'Über Blätter verliert der Baum Wasser. Im gefrorenen Winter würde er austrocknen.'],
  ['m15', 'gruen', 'Der Baum holt das wertvolle Grün zurück in die Zweige.'],
  ['m15', 'gelbrot', 'Dann werden gelbe und rote Farben sichtbar, die vorher verdeckt waren.'],
  ['m15', 'blutbuche', 'Die Blutbuche hat viel Rot und wenig Grün. Sie stellt weniger Nahrung her.'],
];

export const facts: Fact[] = roh.map(([modul, key, text, ergaenzung]) => ({
  id: `${modul}-${key}`,
  modul,
  text,
  ...(ergaenzung ? { ergaenzung } : {}),
}));

export const factById: Record<string, Fact> = Object.fromEntries(facts.map((f) => [f.id, f]));

export const moduleTitel: Record<ModuleId, string> = {
  m01: 'Teile des Baumes',
  m02: 'Laubbaum im Jahresverlauf',
  m03: 'Laub- und Nadelbäume',
  m04: 'Verschiedene Waldarten',
  m05: 'Laubbäume erkennen',
  m06: 'Nadelbäume erkennen',
  m07: 'Der Ahorn',
  m08: 'Waldtierfamilien',
  m09: 'Das Eichhörnchen',
  m10: 'Nahrungsketten und Nahrungsnetze',
  m11: 'Waldwörter',
  m12: 'Wald sauber halten',
  m13: 'Was ist ein Wald?',
  m14: 'Die Stockwerke des Waldes',
  m15: 'Warum werden Blätter bunt?',
};
