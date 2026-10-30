# Waldheld 🌳🐿️

Offline-fähige Lern-Web-App (PWA) zum HSU-Thema „Wald“ für die 3. Klasse: 18 Stationen, 24 Spieltypen,
Eicheln, Sterne, Waldbuch-Sammelkarten, ein eigener Wald und Begleiter Pinsel, das Eichhörnchen.

- Spezifikation: [docs/SPEC.md](docs/SPEC.md)
- Umsetzungsstand: [docs/PLAN.md](docs/PLAN.md)

## Entwicklung

```bash
npm install
npm run dev        # Entwicklungsserver
npm test           # Unit- und Content-Tests
npm run lint
npm run typecheck
npm run build
npm run e2e        # Playwright-Smoke-Test (Tablet-Querformat)
```

Kein Backend, keine Accounts, kein Tracking. Der Spielstand liegt nur im Browser (`localStorage`)
und lässt sich im Elternbereich als Datei exportieren und importieren.
