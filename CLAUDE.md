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
