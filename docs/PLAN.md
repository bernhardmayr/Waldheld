# Waldheld – Umsetzungsstand

Stand: 30.10.2026. Alle Phasen 0–5 sind in einer ersten vollständigen Fassung umgesetzt (Branch `feature/waldheld-app`).

## Phase 0 – Setup
- [x] Vite + React 18 + TypeScript (strict), HashRouter, Zustand mit `persist`
- [x] ESLint, Prettier, Vitest, Playwright
- [x] PWA (vite-plugin-pwa, Precache, App-Icons, offline spielbar), Andika lokal (nur Latin-Subset)
- [x] GitHub Actions: lint → typecheck → test → build → e2e → Deploy auf GitHub Pages (`main`/`master`)
- [x] `base` = `/Waldheld/` (Repo-Name mit großem W; Pages-Pfade sind case-sensitiv)
- [x] GitHub Pages aktiviert (Settings → Pages → Source: GitHub Actions); App: https://bernhardmayr.github.io/Waldheld/

## Phase 1 – Kern und erste Stationen
- [x] Store mit Persistenz (`waldheld:progress`, `waldheld:settings`) und Migrationen (`schemaVersion`)
- [x] Eicheln, Sterne (beste Ergebnisse, nur steigend), Ränge (w/m), Serien- und Fehlerfrei-Bonus
- [x] Pinsel (6 Posen + Lupe, Rucksack, Fernglas, Försterhut), SpeakButton (Web Speech API, de-DE)
- [x] Waldkarte, Stations-Ablauf (Info → Spiele → Abschluss), Einzelspiele wiederholbar, „Mehr üben“
- [x] Spiele G01, G02, G03, G04, G08a, G09, G16; Stationen H1, S01–S04
- [x] Entwicklerseiten `#/dev/assets` und `#/dev/fakten`

## Phase 2 – Bäume und Blätter
- [x] G05 Raster, G06 Memory, G12 Baum-Detektiv, G24 Blatt-Labor
- [x] M5, M6, M7, M15; Stationen S07, S08, E1, E5; Waldbuch (Silhouette bis 3 Treffer, Fortschrittsring)
- [x] Merkmale in den Grafiken: Kiefernnadeln zu zweit, Tannenzapfen aufrecht, Fichtenzapfen hängend,
      Kastanienblatt gefingert, Eiche gebuchtet, Buche eiförmig, Ahorn gelappt, Berg-/Feld-/Spitz-Ahorn unterscheidbar
- [ ] G08b Bilder-Puzzle als Belohnung (noch offen)

## Phase 3 – Tiere, Stockwerke, Nahrungsnetz
- [x] G07 Wimmelbild (5 Szenen, Suchen + Fehlerbild, Pan/Pinch-Zoom, Lupen-Tipp, Trefferfläche ≥ 44 px, Mini-Kompass)
- [x] G10 Kette + Heft-Netz mit beiden Pfeilarten (Richtung und Art werden geprüft)
- [x] G11 Wer bin ich? (30/20/10 Eicheln), G20 Vorratsspiel (6 oder 12 Verstecke), G23 Stockwerk-Aufzug (alle 17 Heft-Tiere)
- [x] Stationen S10, H2, H3, E2

## Phase 4 – Wörter und Lesen
- [x] G13 Suchsel (Stufe 1–3, Seed), G14 Buchstabensuppe, G15 Kreuzworträtsel (Seed), G17 Lesedetektiv, G18 Fehlerwörter
- [x] G19 Schreib-Werkstatt: Dehnungs-h, doppelt/einfach, i/ie, s/ss/ß, Verlängern, ck/tz, ä/äu, groß/klein, Silben-Baukasten,
      Fehlerwörter-Kiste (Freitext-Fehler aus anderen Spielen landen dort)
- [x] Leitner-System (5 Fächer) und Tägliche Waldaufgabe

## Phase 5 – Belohnungswelt und Abschluss
- [x] Mein Wald (Shop, Drag & Drop, Waldart-Anzeige, Jahreszeiten-Schalter inkl. Lärche)
- [x] Alle 21 Abzeichen, Stationenzettel mit Eltern-Kontrolle (+20 Eicheln)
- [x] Elternbereich (Rechenaufgabe oder PIN, Statistik, Einstellungen, Export/Import, Zurücksetzen)
- [x] Waldprüfung (20 Aufgaben, ab 80 % Urkunde, Druckansicht A4), Station E4 mit G21 Waldputz
- [x] Töne (Web Audio), Konfetti, `prefers-reduced-motion`, Pausen-Hinweis nach 20 Minuten

## Nach der ersten Testrunde
- [x] Im Spiel wird die Kopfleiste ausgeblendet (mehr Platz, vor allem auf dem Handy); Eicheln stehen klein im Spielkopf
- [x] Pinsels Sprechblase lässt sich per ✕ oder Antippen schließen; Lob verschwindet nach 2,5 s von selbst

## Tests
- `npm test`: answerCheck, scoring, leitner, unlock, beide Generatoren, Content-Validierung
  (factIds, AssetIds, ≥ 2 Spiele je Pflichtstation, ≥ 20 Aufgaben je Modul, Heft-Netz, 17 Lift-Tiere)
- `npm run e2e`: S01 komplett im Tablet-Viewport durchspielen, Neuladen, Fortschritt bleibt; alle Spiele starten fehlerfrei

## Bekannte Grenzen / nächste Schritte
- Einige Tiere und Symbole sind noch System-Emoji-Platzhalter (Maus, Eule, Fuchs, Schnecke, …). Sie können über
  `src/assets/manifest.json` (`datei`) ohne Codeänderung durch eigene Bilder ersetzt werden.
- Spiele liegen je Datei statt je Ordner in `src/games/`.
- Wimmelbild-Szenen sind einfache Kompositionen aus den Einzelgrafiken.
- Lighthouse-PWA-Prüfung und Testrunde mit dem Kind stehen noch aus.

## Offene Fragen (aus SPEC Abschnitt 6)
- Gibt es die Schulstationen 5, 6, 9, 11 und 12?
- Nahrungsnetz: zweites „wird gefressen von“ vom Blatt – angenommen Blatt → Regenwurm.
- Stockwerke: Kaninchen – angenommen Krautschicht.
