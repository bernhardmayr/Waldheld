# Waldheld – Spezifikation Lern-Web-App HSU „Wald“ (3. Klasse)

Oct 30, 2026 · @Bernhard Mayr

## 1. Überblick und Arbeitsweise

Waldheld ist eine offline-fähige Lern-Web-App (PWA), die den HSU-Stoff „Wald“ der 3. Klasse als Spielwelt mit Stationen, Eicheln als Punkten, Sammelkarten und einem eigenen Wald aufbereitet. Grundlage sind ausschließlich die Inhalte der fotografierten Arbeitsblätter (Abschnitt 4).

- **Arbeitstitel:** Waldheld. **Begleiter:** das Eichhörnchen „Pinsel“ (benannt nach den Pinselohren), gibt Tipps und feiert Erfolge.
- **Grundidee wie in der Schule:** Stationen mit Pflicht-Symbol (!) und Zusatz-Symbol (★), ein digitaler Stationenzettel mit „erledigt“ und „kontrolliert“.
- **Ablauf je Station:** kurzer, vorlesbarer Infotext mit Bild → 2–4 Mini-Spiele → Belohnung (Sterne, Eicheln, neue Waldbuch-Karten). Dauer etwa 10 Minuten.
- **Geräte:** Tablet im Querformat zuerst, Laptop zweitens, Smartphone nutzbar.
- **Workflow:** öffentliches GitHub-Repo `waldheld`, Entwicklung mit Claude Code, Feature-Branches mit PRs, Deployment per GitHub Actions auf GitHub Pages.

### So nutzt Claude Code dieses Dokument

1. Dieses Doc als Markdown exportieren und als `docs/SPEC.md` ins Repo legen.
2. Die `CLAUDE.md`-Vorlage aus Abschnitt 11 ins Repo-Root legen.
3. Phasenweise umsetzen (Abschnitt 10): je Phase ein Feature-Branch und ein PR.
4. Alle Lerninhalte als Daten in `src/content/` ablegen, nie in Komponenten verstreuen. Abschnitt 4 ist die einzige Faktenquelle.

### Nicht-Ziele

- Kein Backend, keine Accounts, kein Login, keine Cloud-Synchronisierung.
- Kein Tracking, keine Analytics, keine Werbung, keine externen Links im Kinderbereich.
- Keine Laufzeit-Abhängigkeit von externen Servern oder CDNs; die App muss offline laufen.
- Keine KI-Aufrufe zur Laufzeit.

### Urheberrecht und Datenschutz (wichtig, weil das Repo öffentlich ist)

- Die Arbeitsblätter stammen aus Verlagsmaterial (u. a. Lernbiene Verlag) und weiteren fremden Vorlagen. **Keine Scans, Fotos oder wörtlichen Textpassagen** davon ins Repo.
- Die Fakten in Abschnitt 4 sind bereits in eigenen Worten formuliert. Claude Code schreibt Infotexte ebenfalls selbst, kindgerecht und neu.
- Bilder nur als eigene SVG-Illustrationen oder frei lizenzierte Bilder mit Quellennachweis (Abschnitt 7).
- Der Name des Kindes steht nirgends im Code. Er wird beim ersten Start eingegeben und nur lokal im Browser gespeichert.

## 2. Zielgruppe, Lernziele und Didaktik

Zielgruppe ist ein Kind der 3. Klasse in Bayern (HSU, Lernbereich Natur und Umwelt) mit Sitzungen von 10–15 Minuten. Die App trennt Sachwissen und Rechtschreibung bewusst, weil die Arbeitsblätter zeigen, dass das Sachwissen meist sitzt, die Schreibweise aber oft nicht.

### Lernziele: Am Ende kann das Kind …

1. erklären, was ein Wald ist, was zwischen den Bäumen wächst und warum der Wald für Tiere, Menschen und Umwelt wichtig ist.
2. die Teile eines Baumes benennen und zeigen (Wurzeln, Stamm, Rinde, Äste, Zweige, Blätter, Blüten, Früchte, Baumkrone).
3. beschreiben, wie ein Laubbaum in Frühling, Sommer, Herbst und Winter aussieht.
4. erklären, warum Blätter grün sind, warum sie im Herbst bunt werden und warum der Baum sie abwirft.
5. Laub- und Nadelbäume unterscheiden (Blätter/Nadeln, Früchte/Zapfen, sommergrün/immergrün, Sonderfall Lärche).
6. Laubwald, Nadelwald und Mischwald unterscheiden und die häufigsten Bäume darin nennen.
7. die fünf Stockwerke des Waldes von unten nach oben nennen und Tiere dem richtigen Stockwerk zuordnen.
8. Ahorn, Buche, Eiche und Kastanie an Baumform, Blatt, Blüte und Frucht erkennen.
9. Fichte, Kiefer, Lärche und Tanne an Baumform, Nadeln und Zapfen erkennen.
10. Berg-, Feld- und Spitz-Ahorn am Blatt unterscheiden und erzählen, wie Ahornsirup entdeckt wurde.
11. Männchen, Weibchen und Jungtier von Wildschwein und Reh benennen und ihre Merkmale kennen.
12. einen Steckbrief des Eichhörnchens wiedergeben.
13. Nahrungsketten und ein Nahrungsnetz mit „wird gefressen von“ und „Energie geht an“ legen und Lebewesen als Produzent, Pflanzenfresser, Fleischfresser, Allesfresser oder Destruent einordnen.
14. erklären, warum Müll der Natur schadet, wie Wiederverwerten funktioniert und wie man Müll vermeidet.
15. die wichtigsten Waldwörter richtig schreiben.

### Didaktische Leitlinien

- **Inhalt vor Rechtschreibung:** In Sachaufgaben zählt das richtige Wort. Kleine Schreibfehler werden toleriert, die korrekte Schreibweise wird aber immer groß gezeigt und das Wort wandert in die Schreib-Werkstatt.
- **Vorlesen überall:** Jeder Infotext, jede Frage und jede Antwortoption hat einen Lautsprecher-Knopf (Web Speech API, de-DE). Einstellung „Fragen automatisch vorlesen“.
- **Kurze Lesehäppchen:** Infotexte höchstens 5 Sätze mit je höchstens 12 Wörtern, Schlüsselwörter fett, immer mit Bild.
- **Fragewort hervorheben:** Wie viele? Wann? Wo? Wer? werden farbig markiert, damit die Frage genau gelesen wird.
- **Fehler als Chance:** 1. Fehlversuch → Tipp von Pinsel; 2. Versuch → halbe Punkte; danach Lösung mit kurzer Erklärung. Keine roten Kreuze, nie Punktabzug.
- **Wiederholen:** Jede Frage hängt an Fakten, die im Leitner-System (5 Fächer) wiederkehren. Falsch beantwortete Fragen kommen in den nächsten Runden wieder.
- **Bild zuerst:** Bild-zu-Wort und Wort-zu-Bild abwechseln; jede Aufgabe hat nach Möglichkeit ein Bild.
- **Abwechslung:** mehrere Spieltypen pro Station, nie zweimal derselbe Typ hintereinander.
- **Zeitdruck nur optional:** Blitzrunden sind per Einstellung zuschaltbar, standardmäßig aus.
- **Schul-Version gilt:** Wo der Unterricht vereinfacht (z. B. „Nadelbäume haben keine Früchte, sondern Zapfen“), übernimmt die App genau diese Version.

### Beobachtungen aus den Arbeitsblättern und Konsequenzen

| Beobachtung | Beispiel auf den Blättern | Konsequenz für die App |
| --- | --- | --- |
| Dehnungs-h fehlt (häufigstes Muster) | „Narung“ (Nahrung), „Rostoffe“ (Rohstoffe), „entstet“ (entsteht), „stet“ (steht) | Werkstatt-Übung „Dehnungs-h“ mit Nahrung, Nährstoffe, Rohstoffe, Reh, Baumhöhle |
| Doppelkonsonant fehlt | „Stam“ (Stamm), „gelapt“ (gelappt), „lasen“ (lassen), „Nährstofe“, „verbrenung“ (Verbrennung) | Werkstatt-Übung „doppelt oder einfach?“ mit Stamm, Blatt, Tanne, gelappt, Nuss, Nährstoffe |
| i/ie unsicher | „Kastani“ (Kastanie), „transportiren“ (transportieren) | Werkstatt-Übung „i oder ie?“ mit Wortpaaren aus dem Wald (Kiefer/Fichte, Tier/Rinde, Siedler/Sirup); i/ie ist ein bekannter Schwerpunkt |
| s, ss oder ß | „auserdem“ (außerdem) | Werkstatt-Übung „s, ss oder ß?“ mit außerdem, groß, weiß, Nuss, Wasser, Moos |
| Auslaut nicht verlängert | „verbrand“ (verbrannt), „möcklichst“ (möglichst), „Stäte“ (Städte) | Verlängerungsprobe als Spiel: Wald → Wälder, Zweig → Zweige, Kraut → Kräuter, Berg → Berge |
| Buchstaben fehlen | „Buchecke“ (Buchecker), „hiterlässt“ (hinterlässt), „witige“ (wichtige) | Silben-Baukasten: Wort aus Silbenkarten legen, dann schreiben |
| Nomen klein geschrieben | „zapfen“, „holz“, „boden“ | Großschreib-Hinweis bei Nomen-Antworten, Mini-Übung „groß oder klein?“ |
| Frage nicht genau gelesen | Auf „Wie viele Junge?“ steht „im Frühling“ statt 2–5 | Fragewort farbig, Lesedetektiv-Übung zu Fragewörtern |
| Häufig und selten verwechselt | Erst Lärche/Tanne, dann korrigiert zu Kiefer/Fichte als häufige Nadelbäume | Eigene Fragen „häufig oder selten?“ plus Merksatz |
| Zeilennummern-Aufgaben | „In welcher Zeile steht …?“ (Ahorn, Eichhörnchen, Blätter) | Lesedetektiv mit nummerierten Zeilen |

Inhaltlich sind die Antworten im Müll-Aufgabenblatt und im Hefteintrag fast durchweg richtig; die App soll diese Stärke bestätigen und die Schreibung getrennt üben.

## 3. Gamification-System

Motivation entsteht aus vier Kreisläufen: Eicheln sammeln, Sterne pro Station, Sammelkarten im Waldbuch und ein eigener Wald, der mit den Eicheln wächst. Gelerntes schaltet Belohnungen frei, Belohnungen sperren aber nie Lerninhalte.

### Eicheln (Punkte) und Sterne

| Ereignis | Eicheln |
| --- | --- |
| Richtig beim 1. Versuch | 10 |
| Richtig beim 2. Versuch (nach Tipp) | 5 |
| Lösung angezeigt, weitergemacht | 1 |
| 5 richtige Antworten in Folge | +10 Bonus |
| Spiel fehlerfrei | +20 Bonus |
| „Wer bin ich?“ nach 1./2./3. Hinweis gelöst | 30 / 20 / 10 |
| Tägliche Waldaufgabe erledigt | +30 |
| Station von Eltern „kontrolliert“ | +20 |

- **Sterne pro Spiel:** ab 90 % richtig 3 Sterne, ab 70 % 2 Sterne, ab 40 % 1 Stern. Memory: Sterne nach Anzahl der Züge.
- **Sterne pro Station:** gerundeter Durchschnitt der besten Ergebnisse ihrer Spiele. Gespeichert wird immer das beste Ergebnis, Sterne können nur steigen.
- **Kontostand vs. Gesamt:** `eicheln` (ausgebbar in „Mein Wald“) und `eichelnGesamt` (nie sinkend, bestimmt den Rang).

### Ränge (nach Eicheln gesamt)

Bezeichnungen in weiblicher oder männlicher Form, je nach Einstellung beim ersten Start.

| Rang | ab Eicheln | Belohnung (nur kosmetisch) |
| --- | --- | --- |
| Waldentdeckerin | 0 | Lupe für Pinsel |
| Spurenleserin | 200 | Rucksack für Pinsel |
| Baumkennerin | 600 | neue Hintergründe für Mein Wald |
| Waldforscherin | 1200 | Fernglas: Wimmelbilder mit Extra-Zoom |
| Försterin | 2000 | Försterhut für Pinsel |
| Waldheldin | 3000 | goldener Rahmen und Urkunde |

### Abzeichen

| Abzeichen | Bedingung |
| --- | --- |
| Lebensraum-Kennerin | Station „Was ist ein Wald?“ mit 3 Sternen |
| Baum-Anatomin | Station „Teile des Baumes“ mit 3 Sternen |
| Vier Jahreszeiten | Station „Laubbaum im Jahresverlauf“ mit 3 Sternen |
| Blatt-Forscherin | Blatt-Labor komplett gelöst |
| Stockwerk-Profi | Stockwerk-Aufzug ohne Fehler (alle Tiere im richtigen Stockwerk) |
| Blatt-Detektivin | 10 Blätter richtig bestimmt |
| Nadel-Profi | alle 4 Nadelbäume im Waldbuch freigeschaltet |
| Ahorn-Ass | alle 3 Ahornblätter richtig zugeordnet |
| Sirup-Kennerin | Ahornsirup-Geschichte fehlerfrei sortiert |
| Tierfamilien-Kennerin | Station „Waldtierfamilien“ fehlerfrei |
| Kettenreaktion | 5 Nahrungsketten richtig gebaut |
| Netzwerkerin | Nahrungsnetz aus dem Heft mit beiden Pfeilarten fehlerfrei gelegt |
| Adlerauge | ein Wimmelbild komplett ohne Tipp gelöst |
| Recycling-Profi | Recycling-Reihenfolge richtig und 30 Müllteile richtig sortiert |
| Wortschatzsucherin | Suchsel komplett gelöst |
| Rätselkönigin | Kreuzworträtsel ohne Tipp gelöst |
| Schreibprofi | 20 Werkstatt-Wörter richtig geschrieben |
| Dehnungs-h-Detektivin | 10 Wörter mit Dehnungs-h in Folge richtig |
| Vorratsmeisterin | Eichhörnchen-Vorratsspiel mit allen Nüssen gefunden |
| Dranbleiberin | an 5 Tagen gespielt (nicht zwingend in Folge) |
| Waldheldin | Waldprüfung bestanden |

### Waldbuch (Sammelalbum)

- Jede Baumart, jede Ahornart, jedes Tier und wichtige Begriffe (z. B. Kobel, Zapfen, Destruent) sind Karten.
- Eine Karte wird freigeschaltet, wenn das Kind das Motiv 3-mal richtig erkannt hat. Vorher: Silhouette mit Fragezeichen.
- Kartenseite: Bild, Name, 3–4 Fakten aus Abschnitt 4 (vorlesbar), Fortschrittsring nach Leitner-Fach.
- Umschalter „Zeichnung / Foto“, wenn ein lizenziertes Foto vorhanden ist (Transfer in den echten Wald).

### Mein Wald (Aufbau-Modus)

- Eine Lichtung, auf der das Kind mit Eicheln Bäume pflanzt, Tiere ansiedelt und Deko platziert (Drag & Drop, Positionen werden gespeichert).
- Kaufbar ist nur, was im Waldbuch freigeschaltet ist. Preise: Baum 30, Tier 50, Deko 10–20 Eicheln.
- **Lernmoment:** Eine Anzeige zeigt automatisch, ob der eigene Wald ein Laub-, Nadel- oder Mischwald ist. Pinsel fragt gelegentlich vorher: „Was für ein Wald ist das jetzt?“
- **Jahreszeiten-Schalter:** Laubbäume zeigen Blüten, dichtes Laub, bunte Blätter oder sind kahl; die Lärche wird im Herbst gelb und ist im Winter kahl; die anderen Nadelbäume bleiben grün.

### Digitaler Stationenzettel

- Liste aller Stationen mit Symbol (! oder ★), Spalte „erledigt“ (automatisch ab 1 Stern) und „kontrolliert“ (setzt ein Elternteil im Elternbereich, mit Kürzel).

### Tägliche Waldaufgabe

- Täglich 5 fällige Wiederholungsfragen aus dem Leitner-System, gemischt aus allen Modulen.
- Ein Tageszähler zählt gespielte Tage. Eine Pause wird nie bestraft oder kommentiert.

### Rückmeldungen

- Richtig: kurzer heller Ton, eine Eichel fliegt in den Zähler, Pinsel hüpft.
- Falsch: weicher Ton, Pinsel kratzt sich am Kopf und gibt einen Tipp.
- Station geschafft: Blätter-Konfetti, Sterne erscheinen nacheinander, neue Karten werden gezeigt.
- Alle Animationen respektieren `prefers-reduced-motion`; Töne abschaltbar.

## 4. Lerninhalte (Content-Bank)

Die Inhalte sind in 15 Module gegliedert: M1–M6 und M8 folgen den Schulstationen, M13 und M14 den Hefteinträgen, M10 dem Lesetext und dem Hefteintrag zum Nahrungsnetz, M7, M9, M12 und M15 den Lesetexten; M11 bündelt den Wortschatz. Der Text „Streitregeln“ aus den Fotos wird nicht verwendet (kein Waldbezug). Mit „Ergänzung“ markierte Punkte stammen nicht von den Blättern, sondern sind gesichertes Grundwissen als Merkhilfe.

**Regel für Claude Code:** Fragen nur aus den Fakten dieses Abschnitts erzeugen, je Modul mindestens 20 Aufgaben über verschiedene Spieltypen. Keine weiteren Fakten erfinden.

### M1 Teile des Baumes (Station 1)

- Der **Stamm** trägt den Baum. Außen schützt ihn die harte **Rinde**.
- Am Stamm wachsen die dicken **Äste**, an den Ästen die dünnen **Zweige**.
- Im Frühjahr wachsen die **Blätter** und der Baum bekommt **Blüten**.
- Aus den Blüten werden bis zum Herbst **Früchte**.
- Äste, Zweige und Blätter zusammen heißen **Baumkrone**.
- Die **Wurzeln** wachsen unter der Erde, halten den Baum fest und versorgen ihn mit Nährstoffen.
- Beispielaufgaben: Bild beschriften (Wurzeln, Stamm, Äste, Zweige, Blätter, Blüten, Früchte, Baumkrone als Klammer) · Was hält den Baum fest? → Wurzeln · Was schützt den Stamm? → Rinde · Was ist dünner, Ast oder Zweig? → Zweig · Woraus entstehen Früchte? → Blüten · Baum-Puzzle von unten nach oben bauen: Wurzeln → Stamm → Äste → Zweige → Blätter, Blüten, Früchte.

### M2 Laubbaum im Jahresverlauf (Station 2)

| Jahreszeit | So sieht der Laubbaum aus |
| --- | --- |
| Frühling | Aus den Knospen wachsen Blätter. Alle Laubbäume blühen. Das Laub ist hellgrün. |
| Sommer | Die Blätter sind groß und dunkelgrün. Der Baum hat ein dichtes Blätterdach. |
| Herbst | Die meisten Früchte sind reif. Die Blätter werden gelb und rot und fallen ab. |
| Winter | Laubbäume sind kahl. An manchen Zweigen hängen noch Früchte. |

- Im Winter sind nur die Nadelbäume nicht kahl.
- Beispielaufgaben: 8 Satzkarten den 4 Jahreszeiten zuordnen (2 je Jahreszeit, eigene Formulierungen) · 4 Baumbilder in die richtige Reihenfolge bringen · Richtig oder falsch: „Im Winter sind alle Bäume kahl.“ → falsch.

### M3 Laub- und Nadelbäume (Station 3)

- **Laubbäume** haben Blätter, die sich im Herbst oft bunt färben und abfallen. Sie haben Blüten, aus denen bis zum Herbst Früchte wachsen (z. B. Kastanie, Eichel). Sie sind meist **sommergrün**.
- **Nadelbäume** haben Nadeln; das sind umgeformte Blätter. Sie erneuern ihre Nadeln nach und nach über das ganze Jahr und heißen deshalb **immergrün**.
- **Ausnahme Lärche:** Sie verliert ihre Nadeln im Herbst.
- Nadelbäume haben laut Unterricht **keine Früchte, sondern Zapfen**.
- Beispielaufgaben: Karten sortieren (Blatt, Blüte, Kastanie, Eichel → Laubbaum; Nadel, Zapfen → Nadelbaum) · Welcher Nadelbaum verliert im Herbst seine Nadeln? → Lärche · Was bedeutet immergrün?

### M4 Verschiedene Waldarten (Station 4)

| Waldart | Bäume | Häufig | Seltener |
| --- | --- | --- | --- |
| Laubwald | nur Laubbäume | Buche, Eiche | Kastanie, Ahorn, Esche, Birke, Ulme |
| Nadelwald | nur Nadelbäume | Kiefer, Fichte | Lärche, Tanne (im Gebirge häufiger) |
| Mischwald | Laub- und Nadelbäume gemischt | – | – |

- Beispielaufgaben: Baumgruppe (3 Bilder) → Waldart · Nenne zwei häufige Laubbäume (Mehrfachauswahl: Buche, Eiche) · Nenne zwei häufige Nadelbäume (Kiefer, Fichte; Ablenker: Lärche, Tanne) · Häufig oder selten?

### M5 Laubbäume erkennen (Station 7)

| Baum | Baumform | Blatt | Blüte | Frucht |
| --- | --- | --- | --- | --- |
| Ahorn | gerader Stamm, rundliche Krone | gelappt | hängende Blütentraube | Flügelfrüchte (Kinder nennen sie „Nasen“) |
| Buche | schlanker, glatter Stamm, hohe ovale Krone | eiförmig, glatter Rand | kleine kugelige, hängende Blütenköpfchen | Bucheckern in stacheliger Hülle |
| Eiche | dicker, knorriger Stamm, krumme Äste, breite Krone | gebuchtet | unscheinbare Blüten an den Zweigen | Eicheln im Becher |
| Kastanie | breite, gewölbte Krone | gefingert (5–7 „Finger“) | aufrechte weiße „Kerzen“ | glänzende braune Kastanie in stacheliger Schale |

- Blattform-Begriffe: **gelappt, eiförmig, gebuchtet, gefingert**.
- Fruchtnamen schreiben: Ahornfrüchte, Bucheckern, Eicheln, Kastanien.
- Beispielaufgaben: Raster 4 × 4 mit Bildkarten füllen · Memory Blatt ↔ Frucht · Blattbild → Blattform-Begriff.

### M6 Nadelbäume erkennen (Station 8)

| Baum | Baumform | Nadeln | Zapfen | Merkhilfe (Ergänzung) |
| --- | --- | --- | --- | --- |
| Fichte | schmal und spitz, Äste bis unten | kurz, spitz, rundum am Zweig | lang und schmal, hängen nach unten | „Die Fichte sticht.“ |
| Kiefer | hoher, kahler Stamm, Krone oben wie ein Schirm | lang, immer zu zweit | klein, rundlich, holzig | „Kiefernnadeln im Doppelpack“ |
| Lärche | kegelförmig, locker | weich, in Büscheln; im Herbst gelb, dann fallen sie ab | klein, rundlich, Schuppen wie Rosenblätter | „Im Winter ist die Lärche kahl.“ |
| Tanne | gerade, gleichmäßige Etagen | flach und weich, unten zwei helle Streifen | stehen aufrecht auf dem Zweig | „Die Tanne nicht (sticht).“ „Tannenzapfen stehen, Fichtenzapfen hängen.“ |

- Beispielaufgaben: Raster 4 × 3 füllen · Zapfen hängt oder steht? · Bestimmungsschlüssel von der Nadel zum Baum.

### M7 Ahorn (Lesetext)

- Lateinischer Name **Acer**, Familie der Seifenbaumgewächse. Wird bis zu 30 m hoch, ist sommergrün, Früchte mit kleinen Flügeln.
- In Deutschland vor allem **Berg-, Spitz- und Feld-Ahorn**.

| Art | Rinde | Blatt | Blüte |
| --- | --- | --- | --- |
| Berg-Ahorn | bräunlich, schuppig gerissen | 5 Lappen, Rand leicht **gesägt** (spitz wie ein Sägeblatt) | hängende, gelbgrüne Rispe |
| Feld-Ahorn | graubraun, netzartig gerissen | meist 5 Lappen, **glattrandig** (ohne Zacken) | aufrechte, gelbgrüne Rispen |
| Spitz-Ahorn | dunkelbraun, längs gerissen | 5–7 Lappen, **gezähnt** (spitze Zipfel, dazwischen runde Buchten) | ähnlich wie beim Feld-Ahorn |
| Zucker-Ahorn | – | – | – |

- Zucker-Ahorn: stammt aus USA und Kanada, daraus wird Ahornsirup gemacht, wächst inzwischen auch bei uns.
- **Sirup-Geschichte (zum Sortieren):** 1. Ein Ureinwohner Nordamerikas sieht ein Eichhörnchen, das ein Loch in die Ahornrinde beißt und trinkt. 2. Er schneidet einen Ast ab; süßer Saft tritt aus. 3. Die Ureinwohner merken: Den Saft gibt es nur kurze Zeit im Jahr. 4. Später bohren Siedler Löcher in den Baum und stecken einen Zapfhahn hinein. 5. Der Saft tropft in Eimer oder Schläuche. 6. Innerhalb von 24 Stunden wird er mehrmals gekocht und gefiltert. 7. So entsteht dunkler, zähflüssiger Ahornsirup.
- Beispielaufgaben: 3 Blattbilder → Ahornart · Richtig/falsch zum Zucker-Ahorn (z. B. „stammt aus Europa“ → falsch) · Fehlerwörter im Satz finden („Südamerika“ → Nordamerika) · Was bedeutet „gesägt“?

### M8 Waldtierfamilien (Station 10)

| Tier | Männchen (Merkmal) | Weibchen (Merkmal) | Jungtier (Merkmal) |
| --- | --- | --- | --- |
| Wildschwein | Keiler (Hauer = große, gebogene Eckzähne) | Bache (bekommt im Frühjahr 4–8 Frischlinge) | Frischling (4–5 helle Streifen auf dem Rücken) |
| Reh | Rehbock (Gehörn = kleines Geweih) | Ricke (bekommt im Frühjahr 1–2 Kitze) | Rehkitz (weiße Flecken auf dem Rücken) |

- Viele Waldtiere bekommen ihre Jungen im Frühling.
- Beispielaufgaben: Tabelle mit 12 Karten füllen · „Wer bin ich? Ich habe weiße Flecken auf dem Rücken …“ · Familien-Memory (Jungtier ↔ Mutter).

### M9 Das Eichhörnchen (Lesetext)

- Tierklasse **Säugetier**, Tierordnung **Nagetier**.
- Etwa 25 cm groß; Fell hellrot bis braunschwarz, Bauch immer weiß; auffällige **Pinselohren**; buschiger Schwanz bis 20 cm.
- Der Schwanz hilft beim Steuern im Sprung, beim Gleichgewicht, zum Wärmen und zur Verständigung.
- Scharfe Krallen und kräftige Hinterbeine machen es zum guten Kletterer. Männchen und Weibchen sehen fast gleich aus.
- Lebt in allen Waldarten, fast überall in Europa, bei genug Futter auch in Parks und Gärten.
- Frisst Samen, Nüsse, Eicheln, Beeren, Pilze und Blüten, manchmal Vogeleier.
- Einzelgänger (außer zur Paarungszeit), **tagaktiv**; nachts in einer Baumhöhle oder im **Kobel** (Nest aus Zweigen im Baum).
- Kein Winterschlaf, sondern **Winterruhe**: Es versteckt vorher Vorräte und verlässt im Winter immer wieder den Kobel, um sie zu suchen.
- Paarung von Dezember bis in den Sommer, 38 Tage Tragzeit, **2–5 Junge**.
- Feinde: Raubvögel wie der **Habicht**, Katzen und besonders der **Marder**.
- Beispielaufgaben: Steckbrief-Lückentext · Wann aktiv? → am Tag · **Wie viele** Junge? → 2–5 · Freund, Futter oder Feind sortieren · Vorratsspiel.

### M10 Nahrungsketten und Nahrungsnetze (Lesetext)

- **Produzenten:** Pflanzen gewinnen ihre Energie mit Sonnenlicht selbst (Photosynthese, siehe M15). Sie stehen am Anfang jeder Nahrungskette.
- **Pflanzenfresser** (Konsumenten erster Ordnung): Schnecken, Kaninchen, Eichhörnchen, Mäuse; sie fressen Blätter, Nüsse, Pilze und Körner.
- **Fleischfresser:** Eulen jagen Eichhörnchen, Hasen und Mäuse; Füchse fressen Würmer, Schnecken und Mäuse.
- **Allesfresser** fressen Pflanzen und Tiere (Ergänzung: z. B. das Wildschwein).
- **Destruenten:** Pilze und Bakterien zersetzen tote Pflanzen und Tiere und geben die Nährstoffe an den Boden zurück, wo die Pflanzen sie aufnehmen.
- Der Pfeil bedeutet „wird gefressen von“. Beispiele: Nuss → Maus → Eule · Gras → Schnecke → Fuchs. Weitere aus den Fakten: Eichel → Eichhörnchen → Habicht · Nuss → Eichhörnchen → Marder · Körner → Maus → Fuchs.
- **Nahrungsnetz:** Ketten hängen zusammen, weil verschiedene Tiere dieselben Pflanzen oder Tiere fressen.
- **Nahrungsnetz aus dem Heft (Hefteintrag vom 29.10.):** sechs Lebewesen (Blatt, Raupe, Regenwurm, Maus, Eule, Pilz) und **zwei Pfeilarten**:
  - „wird gefressen von“: Blatt → Raupe · Blatt → Regenwurm · Raupe → Maus · Regenwurm → Maus · Maus → Eule.
  - „Energie geht an“ (tote Lebewesen und Pflanzenteile werden zersetzt): Eule → Pilz · Raupe → Pilz · Blatt → Pilz.
  - Damit schließt sich der Kreislauf: Der Pilz gibt Nährstoffe an den Boden zurück, neue Blätter wachsen.
- Beispielaufgaben: Kette in die richtige Reihenfolge legen · Rolle zuordnen · Heft-Netz nachbauen und für jeden Pfeil die richtige Pfeilart wählen · Stern-Frage: „Was passiert, wenn es weniger Mäuse gibt?“ → Eulen finden weniger Futter, Raupen und Regenwürmer werden seltener gefressen.

### M11 Waldwörter (Stationen Suchrätsel, Buchstabensuppe, Kreuzworträtsel)

| Wortliste | Wörter |
| --- | --- |
| A Baum (wie Suchrätsel der Schule) | Ast, Baumkrone, Blatt, Blüte, Frucht, Knospe, Nadel, Rinde, Stamm, Trieb, Wurzel, Zapfen, Zweig |
| B Bäume | Ahorn, Buche, Eiche, Kastanie, Fichte, Kiefer, Lärche, Tanne, Birke, Esche, Ulme, Blutbuche |
| C Tiere | Wildschwein, Keiler, Bache, Frischling, Reh, Rehbock, Ricke, Rehkitz, Eichhörnchen, Marder, Habicht, Eule, Fuchs, Maus, Schnecke, Maulwurf, Regenwurm, Käfer, Ameise, Eidechse, Amsel, Specht, Adler, Fledermaus, Raupe |
| D Begriffe | Laubwald, Nadelwald, Mischwald, immergrün, sommergrün, Kobel, Winterruhe, Nahrungskette, Nahrungsnetz, Lebensraum |
| E Stockwerke und Pflanzen | Wurzelschicht, Moosschicht, Krautschicht, Strauchschicht, Kronenschicht, Moos, Kraut, Strauch, Pilz |
| F Blatt und Umwelt | Sonnenlicht, Wasser, Zucker, Sauerstoff, Nährstoffe, Holz, Erholung, Müll, Abfall, Dünger, Rohstoffe, Verpackung |

| Rechtschreib-Schwerpunkt | Übungswörter |
| --- | --- |
| Dehnungs-h | Nahrung, Nährstoffe, Rohstoffe, ernähren, Reh, Rehkitz, Baumhöhle |
| doppelt oder einfach | Stamm, Blatt, Tanne, gelappt, Nuss, Nährstoffe, Sauerstoff, Sonnenlicht, Wasser · Gegenbeispiele: Ast, Nadel, Zapfen |
| i oder ie | mit ie: Kiefer, Tier, Trieb, Siedler, Kastanie · mit i: Fichte, Rinde, Birke, Frischling, Wildschwein, Sirup, Pinselohren |
| s, ss oder ß | ß: außerdem, groß, weiß · ss: Nuss, fressen, Wasser · s: Moos, Gras |
| Verlängern bei d/t, g/k | Wald → Wälder, Zweig → Zweige, Kraut → Kräuter, Berg → Berge |
| ck und tz | Ricke, Schnecke, Bucheckern, Rehkitz |
| ä und äu | Lärche, Äste, Blätter, Bäume, Sträucher, Kräuter, Nährstoffe |
| Großschreibung | alle Nomen der Listen A–F |

### M12 Wald sauber halten (Lesetext und Aufgabenblatt „Die Erde in der Mülltonne“)

- Müll in der Natur bleibt sehr lange liegen; eine weggeworfene Getränkedose bis zu 500 Jahre.
- Müll wird meist verbrannt oder vergraben. Sichere Plätze dafür werden knapp, und Wissenschaftler sorgen sich wegen gefährlicher Stoffe, die beim Verbrennen in die Luft gelangen.
- Manche Städte bringen ihren Müll mit Schiffen in andere Länder oder kippen ihn ins Meer.
- Menschen auf dem Land in armen Ländern machen kaum Müll: Sie essen selbst angebaute Lebensmittel, kaufen nichts Abgepacktes und nutzen Essensreste als Dünger.
- **Wiederverwerten in drei Schritten:** 1. Alte Flaschen, Dosen und Zeitungen werden gesammelt. 2. Sie werden zurück in die Fabrik gebracht. 3. Daraus entstehen neue Produkte.
- **Zwei Vorteile:** Es entsteht weniger Abfall, und man spart Rohstoffe.
- **Vor dem Kauf fragen:** Brauche ich das überhaupt? Gibt es etwas mit weniger Verpackung?
- Ideen für die Klasse (aus dem Aufgabenblatt): wiederverwendbare Brotdosen, wenig Papier zum Abtrocknen.
- Verbindung zu M13: Den Wald schützen heißt auch, keinen Müll zu hinterlassen.
- Beispielaufgaben: Wie lange liegt eine Dose im Wald? (50 / 500 / 1000 Jahre) · Recycling-Reihenfolge legen · Lücken: „Müll wird meist … oder … .“ · „Brauche ich das?“-Szenarien entscheiden · Waldputz.

### M13 Was ist ein Wald? (Hefteintrag vom 1.10.)

- Ein Wald ist ein großer Lebensraum, in dem viele Bäume wachsen.
- Zwischen den Bäumen wachsen Sträucher, Kräuter, Moose und Pilze.
- Im Wald leben viele Tiere, zum Beispiel Vögel, Insekten, Rehe und Füchse.
- Die Lebewesen hängen voneinander ab: Pflanzen sind Nahrung für Tiere und geben ihnen Schutz.
- Abgestorbene Pflanzenteile werden zersetzt und geben dem Boden wichtige Nährstoffe zurück.

| Der Wald ist wichtig … | weil … |
| --- | --- |
| für Tiere | er Nahrung, Schutz und Lebensraum bietet |
| für Menschen | er Holz liefert und Erholung bietet |
| für die Umwelt | er Wasser speichert, den Boden schützt und die Luft reinigt |

- **Merksatz:** Der Wald ist ein vielfältiger Lebensraum. Wir sollten ihn schützen und uns rücksichtsvoll verhalten.
- Beispielaufgaben: Sortieren „Wofür ist der Wald wichtig?“ (Tiere / Menschen / Umwelt) · Mehrfachauswahl „Was wächst zwischen den Bäumen?“ · Merksatz-Lückentext · Richtig oder falsch: „Abgestorbene Blätter sind für den Wald nutzlos.“ → falsch.

### M14 Die Stockwerke des Waldes (Hefteintrag)

Der Wald ist wie ein Haus mit fünf Stockwerken; in jedem leben andere Tiere. Reihenfolge von unten nach oben:

| Stockwerk | Was dort wächst | Tiere (Zuordnung im Heft) |
| --- | --- | --- |
| 5 Kronenschicht | Kronen der hohen Laub- und Nadelbäume | Eule, Habicht, Specht, Adler, Fledermaus |
| 4 Strauchschicht | Sträucher und junge Bäume | Amsel, Marder, Reh |
| 3 Krautschicht | Kräuter, Farne, Blumen | Maus, Fuchs, Eidechse, Kaninchen |
| 2 Moosschicht | Moose und Pilze direkt am Boden | Käfer, Ameise, Schnecke |
| 1 Wurzelschicht | Wurzeln im Boden | Maulwurf, Regenwurm |

- Das Heft verwendet „Kronenschicht“; die App akzeptiert „Baumschicht“ als gleichwertige Antwort.
- Ergänzung: Das Eichhörnchen (M9) lebt mit seinem Kobel in der Kronenschicht.
- Beispielaufgaben: Stockwerke am Waldquerschnitt beschriften · Stockwerk-Aufzug (Tier → richtiges Stockwerk) · „Welches Stockwerk liegt direkt über der Moosschicht?“ · Wimmelbild Waldquerschnitt.

### M15 Warum sind Blätter grün und im Herbst bunt? (Lesetext)

- In den grünen Blättern stellt der Baum **Zucker** und **Sauerstoff** her. Zucker ist seine Nahrung und hilft beim Wachsen; Sauerstoff brauchen wir Menschen. Für den Baum ist der Zucker wichtiger.
- Dafür braucht er drei Zutaten: **Wasser** (holen die Wurzeln aus dem Boden), **Kohlenstoffdioxid** (ein Gas, das wir ausatmen; die Blätter nehmen es aus der Luft) und **Sonnenlicht**.
- Im Herbst scheint die Sonne jeden Tag kürzer. Der Baum kann weniger Nahrung herstellen.
- Im Winter wären Blätter gefährlich: Über die Blätter verliert der Baum Wasser. Ist der Boden gefroren, kann er kaum Wasser aufnehmen und würde austrocknen. Darum wirft er die Blätter im Herbst ab.
- Das Grün ist wertvoll und schwer herzustellen. Der Baum holt es vorher aus den Blättern zurück in die Zweige und speichert es dort.
- Übrig bleiben gelbe und rote Farben, die vorher vom vielen Grün verdeckt waren. Im Frühling wachsen neue grüne Blätter.
- Manche Bäume haben das ganze Jahr rote Blätter, zum Beispiel die **Blutbuche**: viel Rot, wenig Grün, deshalb stellt sie weniger Nahrung her.
- Verbindungen: M2 (Jahresverlauf) und M10 (Pflanzen als Produzenten).
- Beispielaufgaben: Blatt-Labor (die drei Zutaten ins Blatt ziehen, Zucker und Sauerstoff entstehen) · Ursache-Wirkungs-Kette legen: Tage werden kürzer → weniger Nahrung → Grün wird in die Zweige zurückgeholt → Gelb und Rot werden sichtbar → Blätter fallen ab · „Warum wirft der Baum seine Blätter ab?“ · Lesedetektiv mit Zeilennummern · Richtig oder falsch: „Die Blutbuche hat besonders viel grüne Farbe.“ → falsch.

Erweiterungen ohne Grundlage in den Fotos (z. B. Verhalten im Wald, Tierspuren) nur nach Rücksprache.

## 5. Spieltypen (Game-Engine)

Die Engine besteht aus 24 wiederverwendbaren, datengetriebenen Spieltypen. Jede Station kombiniert 2–4 davon; neue Aufgaben entstehen nur durch neue Content-Daten, nicht durch neuen Code.

| ID | Spiel | Mechanik | Hauptsächlich für |
| --- | --- | --- | --- |
| G01 | Bild-Quiz | 3–4 Antwortkarten als Bild oder Wort, Einfach- oder Mehrfachauswahl, Fragewort farbig; auch als Szenario-Quiz („Brauche ich das?“) | alle Module |
| G02 | Richtig oder falsch? | Aussage-Karte, zwei große Daumen-Knöpfe oder Wischen; optional Blitzrunde mit 60 s | M2, M3, M7, M9, M13, M15 |
| G03 | Beschriften | Wortkarten auf Hotspots eines Bildes ziehen, Einrasten per Magnet; Hotspots in % des Bildes | M1, M8, M14 |
| G04 | Sortieren | Karten in 2–5 Körbe ziehen (Laub/Nadel, Jahreszeiten, Waldarten, Rollen, Freund/Feind, Wofür ist der Wald wichtig?) | M2, M3, M4, M9, M10, M13 |
| G05 | Raster füllen | Tabelle wie auf dem Arbeitsblatt; Kartenstapel in die richtige Zelle legen | M5, M6, M8 |
| G06 | Memory | 6–10 Paare Bild↔Wort oder Bild↔Bild; Sterne nach Zügen | M3, M5, M8 |
| G07 | Wimmelbild | große Szene mit Pan/Zoom; Suchaufträge mit Zähler; Modus „Suchen“ und „Fehlerbild“ (Was passt nicht?); Lupen-Tipp leuchtet einen Bereich kurz auf | M2, M8, M9, M10, M14 |
| G08 | Puzzle | a) Baum-Puzzle: Teile an die richtige Stelle bauen; b) Bilder-Puzzle mit 9–16 Teilen als Belohnung, danach ein Fakt | M1, Belohnung |
| G09 | Reihenfolge | Karten in die richtige Abfolge ziehen (Jahreszeiten, Sirup-Geschichte, Recycling, Ursache-Wirkungs-Kette) | M2, M7, M10, M12, M15 |
| G10 | Nahrungskette und Netz | Kette: Karten in Slots mit Pfeilen; Netz: Linien zwischen Lebewesen ziehen und für jeden Pfeil die Art wählen („wird gefressen von“ oder „Energie geht an“); Richtung und Art werden geprüft | M10 |
| G11 | Wer bin ich? | bis zu 3 Hinweise werden nacheinander aufgedeckt; je früher gelöst, desto mehr Eicheln | M4, M6, M8, M9, M14 |
| G12 | Baum-Detektiv | Bestimmungsschlüssel mit Ja/Nein-Fragen (Nadeln? Zu zweit? Hängt der Zapfen?) bis zum Baum, danach Steckbrief | M5, M6 |
| G13 | Suchsel | Gitter aus Wortliste generiert; Stufe 1: 10 × 10, waagerecht und senkrecht vorwärts; Stufe 2: 12 × 12, auch rückwärts; Stufe 3: auch diagonal; Wortliste mit Bildern | M11 |
| G14 | Buchstabensuppe | Bild + gemischte Buchstaben-Kacheln → Wort legen; Tipp fixiert den Anfangsbuchstaben; Großschreibung am Anfang Pflicht | M11 |
| G15 | Kreuzworträtsel | aus Wort, Bild- und Texthinweis generiert, 8–12 Wörter; Bildschirmtastatur mit Ä, Ö, Ü, ß | M11 |
| G16 | Lückentext | Wörter aus einem Wortspeicher in Lücken ziehen | M2, M9, M12, M13 |
| G17 | Lesedetektiv | eigener kurzer Text mit Zeilennummern; „In welcher Zeile steht …?“, Textstellen antippen und gelb markieren, Fragewort-Training | M7, M9, M15 |
| G18 | Fehlerwörter finden | Satz mit 1–3 falschen Wörtern; falsches Wort antippen, richtiges auswählen | M7, M9, M12 |
| G19 | Schreib-Werkstatt | Bild + Vorlesen → Wort tippen; Übungen: Dehnungs-h, doppelt oder einfach, i oder ie, s/ss/ß, Verlängern, groß oder klein, Silben-Baukasten; Fehlerwörter-Kiste | M11 und alle Freitext-Fehler |
| G20 | Eichhörnchen-Vorrat | Herbst: Pinsel versteckt Nüsse in 6–12 Verstecken; Winter (Schnee): das Kind findet sie wieder; Fakt zur Winterruhe | M9 |
| G21 | Waldputz | Müll im Waldbild einsammeln und in Tonnen sortieren; danach Recycling-Weg einer Dose verfolgen | M12 |
| G22 | Waldprüfung | 20 gemischte Aufgaben aus allen Pflichtmodulen; ab 80 % Urkunde (Druckansicht mit Name, Datum, Rang) | alle |
| G23 | Stockwerk-Aufzug | hoher Waldquerschnitt mit Aufzug; ein Tier erscheint, das Kind fährt per Stockwerk-Knopf (1–5) in die richtige Schicht; nutzt `SortConfig` mit Körben = Stockwerken von unten nach oben | M14 |
| G24 | Blatt-Labor | ein großes Blatt: Wasser, Kohlenstoffdioxid und Sonnenlicht hineinziehen → Zucker und Sauerstoff entstehen; danach Jahreszeiten-Regler: Tage kürzer, Grün zieht in die Zweige, Gelb und Rot erscheinen, Blatt fällt; Abschluss mit Blutbuche | M15 |

### Gemeinsame Anforderungen an alle Spiele

- Jedes Spiel ist eine Komponente mit `config` und `onFinish(result)`; `result` enthält richtig, gesamt, Versuche und die Liste der Fehler (Frage-ID, gegebene Antwort).
- Bedienung per Pointer Events (Touch, Maus, Stift). Zu jedem Ziehen gibt es die Alternative „antippen, dann Ziel antippen“; das ist für Kinder oft leichter und dient als Tastatur-Ersatz.
- Aufgaben innerhalb eines Spiels werden gemischt; Antwortpositionen ebenfalls.
- Jede Aufgabe kennt ihre `factIds`, damit Fehler ins Leitner-System und in die Elternstatistik fließen.
- Antwortprüfung für Freitext: Leerzeichen und Unicode normalisieren; in Sachaufgaben Groß-/Kleinschreibung ignorieren und bis zu 1 Tippfehler (Wörter bis 6 Buchstaben) bzw. 2 Tippfehler (länger) als richtig werten, dann aber Hinweis mit korrekter Schreibweise; in der Schreib-Werkstatt exakt prüfen.
- Generatoren (Suchsel, Kreuzwort) arbeiten deterministisch mit Seed, damit ein Rätsel wiederholt werden kann.

## 6. Stationen, Spielablauf und Freischaltung

Die App bildet die 10 Schulstationen des Stationenzettels nach, ergänzt 3 Pflichtstationen aus den Hefteinträgen und 4 Zusatzstationen aus den Lesetexten; alle Pflichtstationen sind von Anfang an offen. Schul-Nummern stehen nur dort, wo sie auf den Fotos erkennbar sind.

| App-ID | Schul-Nr. | Station | Typ | Modul | Spiele in dieser Reihenfolge |
| --- | --- | --- | --- | --- | --- |
| H1 | Heft | Was ist ein Wald? (Einstieg) | ! Pflicht | M13 | G04 Wofür ist der Wald wichtig? → G01 Quiz → G16 Merksatz-Lückentext |
| S01 | 1 | Teile des Baumes | ! Pflicht | M1 | G03 Beschriften → G08 Baum-Puzzle → G01 Quiz |
| S02 | 2 | Laubbaum im Jahresverlauf | ! Pflicht | M2 | G04 Satzkarten sortieren → G09 Reihenfolge → G07 Fehlerbild Jahreszeiten |
| S03 | 3 | Laub- und Nadelbäume | ! Pflicht | M3 | G04 Sortieren → G02 Richtig/falsch → G06 Memory |
| S04 | 4 | Verschiedene Waldarten | ! Pflicht | M4 | G04 Baumgruppen → G01 Quiz (häufig/selten) → G11 Wer bin ich? |
| H2 | Heft | Stockwerke des Waldes | ! Pflicht | M14 | G03 Stockwerke beschriften → G23 Stockwerk-Aufzug → G07 Wimmelbild Waldquerschnitt |
| S07 | 7 | Laubbäume erkennen | ! Pflicht | M5 | G05 Raster 4 × 4 → G06 Memory Blatt↔Frucht → G12 Baum-Detektiv |
| S08 | 8 | Nadelbäume erkennen | ! Pflicht | M6 | G05 Raster 4 × 3 → G01 Merksätze-Quiz → G12 Baum-Detektiv |
| S10 | 10 | Waldtierfamilien | ! Pflicht | M8 | G05 Raster → G11 Wer bin ich? → G07 Wimmelbild Frühling |
| H3 | Heft | Wer frisst wen? (Nahrungsnetz) | ! Pflicht | M10 | G04 Rollen sortieren → G10 Kette und Heft-Netz → G07 Wimmelbild Sommer (Kette finden) |
| S13 | 13 | Baumwörter-Suchrätsel | ★ Zusatz | M11 | G13 Suchsel (Liste A) |
| SZ2 | – | Baumwörter-Buchstabensuppe | ★ Zusatz | M11 | G14 Buchstabensuppe (Listen A, B) |
| SZ3 | – | Waldwörter-Kreuzworträtsel | ★ Zusatz | M11 | G15 Kreuzworträtsel (Listen A–F) |
| E1 | – | Der Ahorn | ★ Zusatz | M7 | G01 Blatt → Art → G09 Sirup-Geschichte → G18 Fehlerwörter → G17 Lesedetektiv |
| E2 | – | Das Eichhörnchen | ★ Zusatz | M9 | G16 Steckbrief-Lückentext → G17 Lesedetektiv → G20 Vorratsspiel |
| E4 | – | Wald sauber halten | ★ Zusatz | M12 | G01 Quiz → G09 Recycling-Reihenfolge → G21 Waldputz |
| E5 | – | Warum werden Blätter bunt? | ★ Zusatz | M15 | G24 Blatt-Labor → G09 Ursache-Wirkungs-Kette → G17 Lesedetektiv |
| SW | – | Schreib-Werkstatt | dauerhaft | M11 | G19, füllt sich mit Fehlerwörtern |
| WP | – | Waldprüfung | Abschluss | alle | G22 |

### Ablauf einer Station

1. Infotext-Seite: 3–5 kurze Sätze, ein großes Bild, Lautsprecher-Knopf, Schlüsselwörter fett.
2. Knopf „Los geht’s!“ → die Spiele laufen nacheinander, je 5–8 Aufgaben, mit Fortschrittsbalken oben.
3. Abschluss-Seite: Sterne, verdiente Eicheln, neu freigeschaltete Waldbuch-Karten und Abzeichen.
4. Zurück zur Waldkarte. Jedes Spiel kann später einzeln wiederholt werden.

### Freischaltregeln

- Pflichtstationen: sofort offen, Reihenfolge frei (wie in der Schule). Pinsel schlägt H1 „Was ist ein Wald?“ als Einstieg vor.
- Zusatzstationen: offen, sobald 3 Pflichtstationen mindestens 1 Stern haben.
- Waldprüfung: offen, sobald alle 10 Pflichtstationen mindestens 1 Stern haben.
- Wimmelbild-Szenen: Frühling mit S10, Sommer mit H3, Herbst mit S07, Winter mit S08, Waldquerschnitt mit H2; danach frei spielbar im Menü „Wimmelbilder“.
- Im Elternbereich lässt sich alles sofort freischalten.

### Leitner-Wiederholung

- Jede Aufgabe startet in Fach 1. Richtig → ein Fach höher, falsch → zurück in Fach 1.
- Fällig nach: Fach 1 sofort, Fach 2 nach 1 Tag, Fach 3 nach 2 Tagen, Fach 4 nach 4 Tagen, Fach 5 nach 7 Tagen.
- Die Tägliche Waldaufgabe zieht 5 fällige Aufgaben, bevorzugt aus niedrigen Fächern.

### Offene Fragen

- Gibt es die Schulstationen 5, 6, 9, 11 und 12 auch? Fotos davon würden weitere Module ergeben.
- Nahrungsnetz im Heft: Das zweite „wird gefressen von“ vom Blatt ist nicht eindeutig lesbar (angenommen: Blatt → Regenwurm); ein „Energie geht an“-Streifen unten links ist keinem Ziel klar zugeordnet.
- Stockwerke im Heft: Das Kaninchen klebt auf der Grenze zwischen Moos- und Krautschicht (angenommen: Krautschicht).

## 7. Bilder und visuelles Design

Bilder tragen die App: Claude Code zeichnet zunächst alle rund 185 Grafiken als einheitliche SVG-Illustrationen, die später ohne Codeänderung durch bessere Bilder ersetzt werden können. Fachlich entscheidende Merkmale (Blattform, Nadelstellung, Zapfenrichtung, Streifen und Flecken der Jungtiere) müssen in jeder Grafik eindeutig erkennbar sein.

### Stil

- Flache, freundliche Illustration mit natürlichen Farben; nicht übertrieben comichaft, damit Baumarten erkennbar bleiben.
- Palette: Waldgrün `#2F6B3B`, Moosgrün `#7FA650`, Rindenbraun `#6B4A2B`, Herbstorange `#D9822B`, Herbstrot `#B83A2E`, Himmelblau `#CDE7F0`, Papier `#FBF7EE`, Text `#2B2B2B`.
- Schrift: **Andika** (SIL Open Font License, für Leseanfänger mit eindeutigen Buchstabenformen), lokal eingebunden. Grundgröße 20 px, Fragen 24–28 px.
- Pinsel hat 6 Posen: neutral, freut sich, denkt nach, zeigt auf etwas, schläft (Winterruhe), feiert.

### Bildquellen in drei Stufen

1. **Standard:** SVGs von Claude Code, optimiert mit SVGO. Für die Sichtprüfung gibt es eine Entwickler-Seite `#/dev/assets`, die alle Grafiken mit ID und Alt-Text zeigt.
2. **Optional:** eigene KI-generierte Bilder im gleichen Stil als WebP; der passende Prompt steht pro Asset im Manifest.
3. **Optional:** echte Fotos, z. B. von Wikimedia Commons, nur mit Lizenz CC0, CC BY oder CC BY-SA; Autor, Lizenz und Link ins Manifest und in `CREDITS.md`. Fotos erscheinen im Waldbuch über den Umschalter „Zeichnung / Foto“.

- **Asset-Manifest** `src/assets/manifest.json` mit den Feldern `id`, `gruppe`, `alt`, `datei`, `fallbackSvg`, `quelle`, `lizenz`, `autor`, `prompt`. Die App lädt Bilder nur über die ID; fehlt eine Datei, wird das SVG verwendet.
- **Keine Scans** der Arbeitsblätter, auch nicht als Vorlage im Repo.

### Asset-Liste (Mindestumfang)

| Gruppe | Assets | Anzahl |
| --- | --- | --- |
| Baumteile | beschriftbarer Laubbaum mit Wurzeln (Hotspot-Koordinaten); einzeln: Wurzeln, Stamm, Rinde, Ast, Zweig, Knospe, Blatt, Blüte, Frucht | 10 |
| Jahreszeiten | Laubbaum im Frühling, Sommer, Herbst, Winter | 4 |
| Laubbäume | Ahorn, Buche, Eiche, Kastanie je Baumform, Blatt, Blüte, Frucht | 16 |
| Nadelbäume | Fichte, Kiefer, Lärche, Tanne je Baumform, Nadelzweig, Zapfen; Lärche zusätzlich gelb und kahl | 14 |
| Ahorn | Blätter Berg-, Feld-, Spitz-Ahorn; Zucker-Ahorn; Zapfhahn mit Eimer; Sirupflasche; Bilder für 7 Geschichtsschritte | 13 |
| Weitere Laubbäume | Esche, Birke, Ulme (Baumform) | 3 |
| Waldarten | Laubwald, Nadelwald, Mischwald als kleine Szenen | 3 |
| Tiere | Keiler, Bache, Frischling, Rehbock, Ricke, Rehkitz, Eichhörnchen, Kobel, Maus, Eule, Fuchs, Schnecke, Kaninchen, Hase, Habicht, Marder, Katze, Regenwurm, Maulwurf, Käfer, Ameise, Eidechse, Amsel, Specht, Adler, Fledermaus, Raupe | 27 |
| Pflanzen der Stockwerke | Moos, Farn/Kraut, Strauch, Waldboden-Querschnitt | 4 |
| Nahrung und Destruenten | Nuss, Eichel, Gras, Körner, Beeren, Pilz, Vogelei, Bakterien (unter der Lupe), Sonne | 9 |
| Blatt-Labor | großes grünes Blatt, gelbes und rotes Blatt, Blutbuche, Wassertropfen, Kohlenstoffdioxid-Wolke, Zucker, Sauerstoff-Bläschen, gefrorener Boden, Zweig mit „Grün-Speicher“ | 10 |
| Wald ist wichtig | Holz, Erholung (Spaziergang), Wasserspeicher, saubere Luft, geschützter Boden, Lebensraum | 6 |
| Maskottchen | Pinsel in 6 Posen + 4 Ausrüstungsteile (Lupe, Rucksack, Fernglas, Försterhut) | 10 |
| Mein Wald | Lichtung in 4 Jahreszeiten; Deko: Stein, Baumstumpf, Bach, Pilzkreis, Futterkrippe, Hochsitz | 10 |
| Wimmelbilder | 4 Jahreszeiten-Szenen + Waldquerschnitt (siehe unten) mit Objekt-Ebenen | 5 |
| Müll und Recycling | Dose, Glasflasche, Zeitung, Plastiktüte, Apfelrest, alter Pulli; 5 Tonnen; Fabrik, Brotdose, Recycling-Kreislauf | 14 |
| Oberfläche | Eichel, Stern, Rangsymbole, Abzeichen-Medaillen, Waldkarte | ca. 25 |

### Wimmelbilder

Jede Szene ist ein SVG im Format 2400 × 1600 mit Objekten als eigene Gruppen (`id`, Treffer-Polygon, Bezeichnung). Suchaufträge liegen als JSON neben der Szene.

| Szene | Suchaufträge | Fehlerbild (passt nicht) |
| --- | --- | --- |
| Frühlings-Mischwald | 3 Knospen, blühende Kastanie, Bache mit 2 Frischlingen, Ricke mit Kitz, Kobel | Baum mit bunten Herbstblättern |
| Sommerwald | dichtes Blätterdach, Eule, Fuchs, Schnecke, Maus, Raupe, Regenwurm, 3 Pilze; Auftrag „Tippe eine Nahrungskette in der richtigen Reihenfolge“ (z. B. Blatt → Raupe → Maus → Eule) | kahler Laubbaum |
| Herbstwald | Eicheln, Bucheckern, Kastanien, Ahornfrüchte, hängender Fichtenzapfen, gelbe Lärche, Eichhörnchen beim Verstecken, Blutbuche mit roten Blättern | Baum mit Blüten |
| Winterwald | kahle Laubbäume, grüne Fichte, Kiefer und Tanne, kahle Lärche, Eichhörnchen sucht Vorrat, Wildschweine | Laubbaum mit grünen Blättern |
| Waldquerschnitt (Hochformat 1600 × 2400) | Maulwurf und Regenwurm in der Wurzelschicht, Käfer, Ameise, Schnecke in der Moosschicht, Maus, Eidechse, Fuchs in der Krautschicht, Amsel und Reh in der Strauchschicht, Specht, Eule, Fledermaus in der Kronenschicht | Maulwurf in der Baumkrone, Adler in der Moosschicht |

- Treffer-Flächen sind bei Standard-Zoom mindestens 44 × 44 px groß, auch wenn das Objekt kleiner ist.
- Zoom per Pinch und per Knöpfen (+/−), Verschieben per Ziehen; ein Mini-Kompass zeigt, wo man im Bild ist.

## 8. Screens, Navigation und Bedienung

Die Waldkarte ist der zentrale Hub; von dort ist jeder Bereich mit einem Tipp erreichbar, nie tiefer als zwei Ebenen. Pro Bildschirm gibt es genau eine Aufgabe.

### Screens

1. **Erststart:** Name eingeben, Form für Rangbezeichnungen (Mädchen/Junge), Vorlesen an/aus, kurzes Intro von Pinsel (3 Sprechblasen).
2. **Waldkarte:** illustrierte Landschaft, Stationen als Orte (Lichtung, Bach, Hochsitz, Nadelwald am Berg, Eichhörnchen-Baum …), Sterne je Station, Pfad dazwischen. Obere Leiste: Eicheln, Rang, Tagesaufgabe, Waldbuch, Mein Wald, Stationenzettel, Abzeichen, Zahnrad (Elternbereich).
3. **Station:** Infotext → Spiel-Container (Fortschrittsbalken, Pinsel-Ecke mit Tipp-Knopf, Lautsprecher, Abbrechen) → Abschluss-Seite.
4. **Waldbuch:** Kartenraster mit Filter Bäume / Tiere / Begriffe; Kartendetail mit Vorlesen.
5. **Mein Wald:** Lichtung, Shop-Leiste unten, Jahreszeiten-Schalter, Anzeige der Waldart.
6. **Stationenzettel:** Tabelle wie in der Schule mit „erledigt“ und „kontrolliert“.
7. **Abzeichen und Rang:** Medaillen-Wand, Fortschritt bis zum nächsten Rang.
8. **Wimmelbilder:** Auswahl der freigeschalteten Szenen.
9. **Schreib-Werkstatt:** Übungen nach Schwerpunkt, Fehlerwörter-Kiste mit Anzahl.
10. **Elternbereich** (siehe unten).

### Elternbereich

- Zugang über eine Erwachsenen-Rechenaufgabe (z. B. 7 × 8) oder eine 4-stellige PIN.
- Fortschritt je Station (Sterne, letzte Spielzeit), häufigste Fehler je Modul, Fehlerwörter der Werkstatt.
- Stationen als „kontrolliert“ abhaken (mit Kürzel).
- Einstellungen: Vorlesen automatisch, Sprechtempo, Töne, Blitzrunden mit Zeitdruck, Suchsel-Stufe, alles freischalten, Pausen-Hinweis.
- Spielstand als JSON-Datei exportieren und importieren (Gerätewechsel), Spielstand zurücksetzen mit Sicherheitsabfrage.

### Bedienung und Barrierefreiheit

- Touch-Ziele mindestens 56 × 56 px, Abstand mindestens 8 px.
- Querformat 1180 × 820 (iPad) ist Referenz; Hochformat und 1366 × 768 (Laptop) müssen funktionieren; Spiele ohne Scrollen.
- Texteingabe nur in Werkstatt, Kreuzworträtsel und Buchstabensuppe, mit eigener großer Bildschirmtastatur inklusive Ä, Ö, Ü, ß.
- Kontrast mindestens WCAG AA, Alt-Texte für alle Bilder, Farbe nie als einziges Signal (zusätzlich Symbol).
- Keine Zeitlimits ohne entsprechende Einstellung.
- Nach 20 Minuten freundlicher Pausen-Hinweis von Pinsel („Zeit für einen Ausflug in den echten Wald?“), abschaltbar.

## 9. Technische Architektur

Waldheld ist eine rein statische Single-Page-App mit lokalem Spielstand, gebaut mit Vite, React und TypeScript und als PWA auf GitHub Pages ausgeliefert. Nutzt die bestehende Lern-App „Uhrenheld“ bereits einen anderen Stack, übernimmt Claude Code diesen samt Konventionen.

### Stack (Vorschlag)

| Bereich | Wahl | Grund |
| --- | --- | --- |
| Build | Vite + React 18 + TypeScript (strict) | schnell, einfach für GitHub Pages |
| Routing | React Router mit HashRouter | keine 404-Probleme auf GitHub Pages |
| State | Zustand mit `persist` (localStorage) | klein, einfach, versionierbar |
| Drag & Drop | @dnd-kit mit Touch- und Pointer-Sensor | robust auf Tablets |
| Animation | Framer Motion, canvas-confetti | Belohnungseffekte |
| Vorlesen | Web Speech API (`speechSynthesis`, de-DE) als Wrapper | offline, kostenlos |
| Töne | Web Audio, kurze eigene CC0-Sounds | keine Abhängigkeit |
| PWA | vite-plugin-pwa, Precache aller Assets | offline spielbar, installierbar |
| Tests | Vitest, React Testing Library, Playwright | Logik, Komponenten, End-to-End |
| Qualität | ESLint, Prettier, `tsc --noEmit` in CI | sauberer Code |

### Ordnerstruktur

```text
waldheld/
├─ CLAUDE.md
├─ CREDITS.md
├─ docs/SPEC.md
├─ docs/PLAN.md
├─ public/                 # App-Icons, Web-Manifest
├─ src/
│  ├─ app/                 # App.tsx, Routen, Layout
│  ├─ screens/             # Start, Waldkarte, Station, Waldbuch, MeinWald,
│  │                       # Stationenzettel, Abzeichen, Wimmelbilder, Werkstatt, Eltern
│  ├─ games/               # G01 QuizGame … G22 FinalExam, je eigener Ordner
│  ├─ engine/              # scoring.ts, leitner.ts, answerCheck.ts, unlock.ts,
│  │                       # rng.ts, generators/wordsearch.ts, generators/crossword.ts
│  ├─ content/             # types.ts, stations.ts, facts/, questions/, words.ts,
│  │                       # badges.ts, ranks.ts, scenes/ (Wimmelbild-JSON)
│  ├─ assets/              # manifest.json, svg/, img/, audio/, fonts/
│  ├─ components/          # Pinsel, SpeakButton, AcornCounter, StarRating,
│  │                       # OnScreenKeyboard, Card, DropZone, ProgressBar
│  ├─ store/               # progress.ts, settings.ts, migrations.ts
│  └─ lib/                 # tts.ts, sound.ts, normalize.ts, levenshtein.ts
└─ tests/e2e/
```

### Datenmodell (Kern)

```ts
type ModuleId = 'm01' | 'm02' | 'm03' | 'm04' | 'm05' | 'm06'
  | 'm07' | 'm08' | 'm09' | 'm10' | 'm11' | 'm12' | 'm13' | 'm14' | 'm15';
type AssetId = string;
type GameType = 'quiz' | 'truefalse' | 'label' | 'sort' | 'grid' | 'memory'
  | 'hidden' | 'puzzle' | 'sequence' | 'foodchain' | 'riddle' | 'key'
  | 'wordsearch' | 'scramble' | 'crossword' | 'cloze' | 'reading'
  | 'errorwords' | 'spelling' | 'cache' | 'cleanup' | 'exam' | 'lift' | 'leaflab';

interface Fact { id: string; modul: ModuleId; text: string; bild?: AssetId; ergaenzung?: boolean; }

interface Station {
  id: string; schulNr?: number; titel: string;
  typ: 'pflicht' | 'zusatz' | 'dauerhaft' | 'abschluss';
  modul: ModuleId | 'alle';
  info: { saetze: string[]; bild: AssetId; schluesselwoerter: string[] };
  spiele: { type: GameType; configId: string }[];
  karte: { x: number; y: number }; // Position auf der Waldkarte in %
}

type Question =
  | { kind: 'mc'; id: string; factIds: string[]; frage: string; fragewort?: string;
      bild?: AssetId; optionen: { text?: string; bild?: AssetId }[];
      richtig: number[]; erklaerung: string }
  | { kind: 'tf'; id: string; factIds: string[]; aussage: string; wahr: boolean; erklaerung: string }
  | { kind: 'text'; id: string; factIds: string[]; frage: string; bild?: AssetId;
      loesungen: string[]; istNomen: boolean };

interface LabelConfig { bild: AssetId; hotspots: { id: string; x: number; y: number; loesung: string }[] }
interface SortConfig { koerbe: { id: string; titel: string; bild?: AssetId }[];
  karten: { id: string; text?: string; bild?: AssetId; korb: string; factIds: string[] }[] }
interface GridConfig { zeilen: string[]; spalten: string[];
  zellen: { zeile: number; spalte: number; text?: string; bild?: AssetId }[] }
interface HiddenConfig { szene: AssetId; modus: 'suchen' | 'fehler';
  objekte: { id: string; polygon: [number, number][]; label: string }[];
  auftraege: { text: string; objektIds: string[]; anzahl: number }[] }

type Rolle = 'produzent' | 'pflanzenfresser' | 'fleischfresser' | 'allesfresser' | 'destruent';
interface FoodWebConfig { knoten: { id: string; label: string; bild: AssetId; rolle: Rolle }[];
  kanten: { von: string; zu: string; art: 'gefressen' | 'energie' }[]; // 'wird gefressen von' bzw. 'Energie geht an' (zum Destruenten)
  ketten: string[][] }

interface Progress {
  schemaVersion: number;
  spieler: { name: string; form: 'w' | 'm' };
  eicheln: number; eichelnGesamt: number;
  stationen: Record<string, { sterne: 0 | 1 | 2 | 3; bestProSpiel: Record<string, number>;
    kontrolliert?: { kuerzel: string; datum: string } }>;
  leitner: Record<string, { fach: 1 | 2 | 3 | 4 | 5; faelligAm: string }>;
  fehler: Record<string, number>; // Frage-ID → Anzahl
  waldbuch: Record<string, { treffer: number; frei: boolean }>;
  abzeichen: string[];
  meinWald: { assetId: AssetId; x: number; y: number }[];
  spieltage: string[]; // ISO-Datum je Spieltag
  werkstatt: Record<string, { richtig: number; falsch: number }>;
}
```

### Persistenz, Datenschutz, Performance

- localStorage-Schlüssel `waldheld:progress` und `waldheld:settings`; `schemaVersion` mit Migrationsfunktionen, nie stilles Löschen.
- Keine Netzwerkzugriffe außer dem Laden der eigenen statischen Dateien; keine Fremd-Fonts, keine CDNs.
- Assets je Station per Lazy Loading; SVGs mit SVGO optimiert; Ziel: erster Start unter 2 s auf einem mittleren Tablet.

### Tests und CI

- Vitest für `answerCheck` (Toleranzregeln), `scoring`, `leitner`, `unlock` und beide Generatoren (jedes Wort platziert, keine Konflikte, gleicher Seed → gleiches Rätsel).
- Content-Validierung als Test: jede `factId` existiert, jede `AssetId` steht im Manifest, jede Station hat mindestens 2 Spiele.
- Playwright-Smoke-Test im Tablet-Viewport: Station S01 komplett durchspielen, Neuladen, Fortschritt ist noch da.
- GitHub Actions: lint → typecheck → test → build → Deploy auf GitHub Pages (nur `main`); `base` in `vite.config.ts` auf `/waldheld/`.

## 10. Roadmap in Phasen

Die Umsetzung erfolgt in 6 Phasen, jede als eigener Feature-Branch mit PR; nach Phase 1 ist die App bereits mit vier Stationen spielbar. Jede Phase endet erst, wenn alle Akzeptanzkriterien erfüllt sind und CI grün ist.

1. **Phase 0 – Setup** (`feature/setup`)
   - Repo `waldheld`, Vite/React/TS, ESLint, Prettier, Vitest, Playwright, GitHub Actions → Pages, PWA-Grundgerüst, Andika lokal.
   - Akzeptanz: leere App mit Waldkarten-Platzhalter unter der Pages-URL erreichbar, CI grün, als App installierbar.
2. **Phase 1 – Kern und erste Stationen** (`feature/core`)
   - Store mit Persistenz und Migrationen, Eicheln/Sterne/Ränge, Pinsel-Komponente, SpeakButton, Waldkarte, Stations-Ablauf, Elternbereich-Grundgerüst.
   - Spiele G01, G02, G03, G04, G08a, G09, G16; Module M13, M1–M4; Stationen H1, S01–S04; SVG-Assets dafür; Entwicklerseite `#/dev/assets`.
   - Akzeptanz: H1 und S01–S04 komplett spielbar; Fortschritt übersteht Neuladen; jeder Text vorlesbar; Tablet-Querformat ohne Scrollen im Spiel; Content-Validierungstest grün.
3. **Phase 2 – Bäume und Blätter** (`feature/baeume`)
   - Spiele G05, G06, G12, G08b, G24 Blatt-Labor; Module M5, M6, M7, M15; Stationen S07, S08, E1, E5; Waldbuch.
   - Akzeptanz: 8 Baumarten und 3 Ahornarten als Karten; Grafiken bestehen die Merkmals-Checkliste aus Abschnitt 4 (z. B. Kiefernnadeln zu zweit, Tannenzapfen aufrecht, Fichtenzapfen hängend, Kastanienblatt gefingert); Blatt-Labor zeigt die drei Zutaten und den Farbwechsel im Herbst.
4. **Phase 3 – Tiere, Stockwerke, Nahrungsnetz** (`feature/tiere`)
   - Spiele G07 (5 Szenen), G10 mit beiden Pfeilarten, G11, G20, G23 Stockwerk-Aufzug; Module M8, M9, M10, M14; Stationen S10, H2, H3, E2.
   - Akzeptanz: alle Suchobjekte per Finger treffbar (≥ 44 px); Nahrungsnetz prüft Richtung und Pfeilart und enthält das Heft-Netz; Stockwerk-Aufzug ordnet alle 17 Heft-Tiere zu; Vorratsspiel funktioniert mit 6 und 12 Verstecken.
5. **Phase 4 – Wörter und Lesen** (`feature/woerter`)
   - Spiele G13, G14, G15, G17, G18, G19; Modul M11; Stationen S13, SZ2, SZ3, Schreib-Werkstatt; Leitner-System und Tägliche Waldaufgabe.
   - Akzeptanz: Generatoren mit Unit-Tests (alle Wörter platziert, deterministisch per Seed); Werkstatt enthält die Schwerpunkte Dehnungs-h, doppelt/einfach, i/ie, s/ss/ß, Verlängern, ck/tz, ä/äu, Großschreibung; Freitext-Fehler aus anderen Spielen landen in der Fehlerwörter-Kiste.
6. **Phase 5 – Belohnungswelt und Abschluss** (`feature/belohnung`)
   - Mein Wald, alle Abzeichen, Stationenzettel mit Eltern-Kontrolle, vollständiger Elternbereich mit Export/Import, Waldprüfung mit druckbarer Urkunde, Station E4 „Wald sauber halten“ mit G21 Waldputz, Töne und Animationen, Pausen-Hinweis.
   - Akzeptanz: App offline vollständig spielbar; Lighthouse-PWA-Prüfung bestanden; Playwright-Smoke-Test grün; Urkunde druckt auf eine A4-Seite.

Nach jeder Phase: Testrunde mit dem Kind (15 Minuten zuschauen, nicht helfen), Beobachtungen als Issues anlegen, dann erst die nächste Phase.

## 11. Start-Prompt und CLAUDE.md für Claude Code

Mit der folgenden `CLAUDE.md` und dem Start-Prompt kann Claude Code direkt mit Phase 0 beginnen. Die weiteren Prompts steuern Inhaltsprüfung und Bildkontrolle.

### Vorlage `CLAUDE.md`

```markdown
# Waldheld – Hinweise für Claude Code

## Projekt
Lern-Web-App (PWA) zum HSU-Thema Wald für ein Kind der 3. Klasse.
Verbindliche Spezifikation: docs/SPEC.md. Umsetzungsstand: docs/PLAN.md.

## Regeln
- Alle sichtbaren Texte auf Deutsch, kurze Sätze, kindgerecht, korrekte Rechtschreibung (Umlaute, ß).
- Fakten nur aus docs/SPEC.md, Abschnitt 4. Nichts erfinden. Ergänzungen als ergaenzung: true markieren.
- Keine Verlagstexte oder -bilder, keine Scans. Bilder nur über src/assets/manifest.json.
- Keine Netzwerkzugriffe zur Laufzeit, kein Tracking, keine externen Fonts oder CDNs.
- Inhalte gehören nach src/content/, nie in Komponenten.
- Neue Spielart = Komponente in src/games/, Config-Typ in src/content/types.ts, Unit-Tests für die Prüflogik.
- Jede Interaktion per Ziehen UND per Antippen-Antippen bedienbar.
- Touch-Ziele mindestens 56 px, Referenz-Viewport 1180 x 820.

## Workflow
- Ein Feature-Branch pro Phase oder Feature, PR mit Screenshots im Tablet-Querformat.
- CI (lint, typecheck, test, build) muss grün sein.
- docs/PLAN.md nach jedem Arbeitsschritt aktualisieren.

## Befehle
npm run dev | npm test | npm run lint | npm run typecheck | npm run build | npm run e2e
```

### Start-Prompt

```text
Lies docs/SPEC.md vollständig und CLAUDE.md.
1. Erstelle docs/PLAN.md mit einer Checkliste für Phase 0 und Phase 1
   und liste offene Fragen an mich auf.
2. Warte auf meine Antworten.
3. Setze danach Phase 0 auf dem Branch feature/setup um und öffne einen PR.
```

### Weitere nützliche Prompts

- **Inhaltsprüfung:** „Erzeuge aus src/content eine druckbare Faktenübersicht pro Modul (Route #/dev/fakten), damit ich alles gegen die Arbeitsblätter prüfen kann.“
- **Bildkontrolle:** „Zeichne alle SVG-Assets für Station S01 laut Manifest und zeige sie auf #/dev/assets. Prüfe jede Grafik gegen die Merkmals-Checkliste aus Abschnitt 4.“
- **Fragen erweitern:** „Erzeuge für Modul M6 weitere 20 Aufgaben über mindestens 4 Spieltypen, nur aus den Fakten in Abschnitt 4, und ergänze den Content-Validierungstest.“
- **Nach einer Testrunde:** „Hier sind meine Beobachtungen aus der Testrunde: … Lege dafür Issues an und priorisiere sie.“
