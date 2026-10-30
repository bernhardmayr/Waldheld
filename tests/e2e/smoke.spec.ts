import { expect, test, type Page } from '@playwright/test';

/** Legt Karten per Antippen-Antippen ab: Nach zwei Fehlversuchen legt das Spiel die Karte selbst richtig hin. */
async function legeAlle(page: Page, karten: string, ziele: string) {
  for (let runde = 0; runde < 60; runde++) {
    const n = await page.locator(karten).count();
    if (!n) return;
    const ziel = runde % Math.max(1, await page.locator(ziele).count());
    await page.locator(karten).first().click();
    await page.locator(ziele).nth(ziel).click();
  }
}

async function start(page: Page) {
  await page.goto('#/start');
  await page.fill('input', 'Testkind');
  await page.click('button[type=submit]');
  for (let i = 0; i < 3; i++) await page.click('.knopf.gross');
  await page.evaluate(() => {
    localStorage.setItem(
      'waldheld:settings',
      JSON.stringify({ state: { toene: false, pausenHinweis: false }, version: 1 }),
    );
  });
  await page.reload();
}

test('Station S01 komplett durchspielen, Fortschritt übersteht Neuladen', async ({ page }) => {
  const fehler: string[] = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await start(page);
  await expect(page.getByText('Teile des Baumes')).toBeVisible();

  await page.getByRole('link', { name: /Teile des Baumes/ }).click();
  await page.getByRole('button', { name: 'Los geht’s!' }).click();

  // G03 Beschriften
  await expect(page.getByText('Beschrifte das Bild.')).toBeVisible();
  await legeAlle(page, '.label-stapel .zieh-karte', '.label-box:not(.gefuellt)');

  // G08 Baum-Puzzle
  await expect(page.getByText('Baue den Baum von unten nach oben.')).toBeVisible();
  for (let i = 0; i < 20 && (await page.locator('.puzzle-game .zieh-karte').count()); i++) {
    await page.locator('.puzzle-game .zieh-karte').first().click();
    await page
      .locator('.puzzle-game .zieh-karte')
      .first()
      .click()
      .catch(() => undefined);
  }

  // G01 Quiz
  await expect(page.locator('.frage-view')).toBeVisible();
  for (let i = 0; i < 40; i++) {
    if (await page.getByText('Geschafft!').isVisible()) break;
    const weiter = page.locator('.knopf.weiter');
    if (await weiter.isVisible()) {
      await weiter.click();
      continue;
    }
    if (await page.locator('.tastatur').isVisible()) {
      await page.locator('.taste', { hasText: /^[Ss]$/ }).click();
      await page.getByRole('button', { name: 'Fertig ✔' }).click();
      continue;
    }
    const pruefen = page.getByRole('button', { name: 'Prüfen' });
    const option = page.locator('.frage-view .option:not([disabled])').first();
    if (await option.isVisible()) await option.click();
    if (await pruefen.isVisible()) await pruefen.click();
  }

  await expect(page.getByText('Geschafft!')).toBeVisible();
  await page.locator('.abschluss').getByRole('link', { name: 'Zur Waldkarte' }).click();

  const vorher = await page.locator('#eichel-zaehler').innerText();
  expect(Number(vorher)).toBeGreaterThan(0);
  const sterne = () => page.locator('.ort', { hasText: 'Teile des Baumes' }).locator('.sterne .an').count();
  const sterneVorher = await sterne();
  await page.reload();
  await expect(page.locator('#eichel-zaehler')).toHaveText(vorher);
  expect(await sterne()).toBe(sterneVorher);
  const gespeichert = await page.evaluate(
    () => JSON.parse(localStorage.getItem('waldheld:progress')!).state.stationen.S01,
  );
  expect(Object.keys(gespeichert.bestProSpiel)).toEqual(['0', '1', '2']);
  expect(fehler).toEqual([]);
});

test('alle Spiele starten ohne Fehler', async ({ page }) => {
  const fehler: string[] = [];
  page.on('pageerror', (e) => fehler.push(e.message));
  await start(page);
  await page.evaluate(() => {
    localStorage.setItem(
      'waldheld:settings',
      JSON.stringify({ state: { toene: false, pausenHinweis: false, allesFrei: true }, version: 1 }),
    );
  });
  await page.reload();
  const stationen: Record<string, number> = {
    H1: 3,
    S01: 3,
    S02: 3,
    S03: 3,
    S04: 3,
    H2: 3,
    S07: 3,
    S08: 3,
    S10: 3,
    H3: 3,
    S13: 1,
    SZ2: 1,
    SZ3: 1,
    E1: 4,
    E2: 3,
    E4: 3,
    E5: 3,
    WP: 1,
  };
  for (const [id, n] of Object.entries(stationen)) {
    for (let i = 0; i < n; i++) {
      await page.goto(`#/station/${id}/spiel/${i}`);
      await expect(page.locator('.spiel-flaeche')).toBeVisible();
    }
  }
  for (const r of [
    'waldbuch',
    'meinwald',
    'zettel',
    'abzeichen',
    'wimmelbilder',
    'werkstatt',
    'tagesaufgabe',
  ]) {
    await page.goto(`#/${r}`);
    await expect(page.locator('.inhalt')).toBeVisible();
  }
  expect(fehler).toEqual([]);
});
