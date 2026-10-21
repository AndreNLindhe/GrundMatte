# GrundMatte – landningssida och multiplikation på tid: byggplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Mål:** En landningssida och ett multiplikationsverktyg i tre steg (Inställningar → Omgång → Sammanfattning), byggt för Chromebook och mobil.

**Arkitektur:** Statiska sidor utan byggsteg. `index.html` är landningssidan. `multiplikation.html` har tre vyer (`<section>`) som visas och döljs efter adressens hash (`#installningar`, `#omgang`, `#klart`). Den rena logiken ligger i `js/multiplikation-logik.js`. Den har inga DOM-anrop och testas med Node. Gränssnittet ligger i `js/multiplikation.js`.

**Teknik:** HTML, CSS, vanlig JavaScript (klassiska `<script>`, inte moduler). Tester körs med `node --test` (Node 26, inga paket).

**Spec:** `docs/superpowers/specs/2026-10-21-grundmatte-multiplikation-design.md`

**Ordning:** användarupplevelsen först. Task 1–2 ger ett flöde man kan klicka igenom med påhittade data. Task 3–6 fyller i logiken.

## Globala begränsningar

- Inga ramverk, inga bibliotek, inget byggsteg, inga `npm`-paket.
- Det ska fungera från `file://`: inga `type="module"` och ingen `fetch` av lokala filer.
- Gränssnittet är på svenska med korta texter. Emoji används som ikoner: ✖️ ⏱ 🔢 ⭐ ✓ ✗ 🎉 💪 ➕ ➗ ▶ ↻ ⚙.
- Ljus bakgrund och hög kontrast. Systemets typsnitt (`system-ui`). Färger som CSS-variabler: blå accent `#2f6fdf`, grön `#1f9d55`, röd `#d64545`, text `#1d2633`.
- Rätt och fel visas med både färg och symbol eller överstrykning, aldrig med bara färg.
- Klickytor är minst 44 px höga.
- Förval: tid 120 s, tal 1 till 10. Tidsval: 60, 120, 180 och 300 s.
- Fel svar ger en paus på 1500 ms. Rätt svar ger ett blink på 300 ms utan spärr. Timern blir röd vid ≤ 10 s kvar.
- Talen är heltal ≥ 0 och har ingen övre gräns. Om från > till byter de plats. Ett ogiltigt eller tomt värde ger det förra giltiga.

## Fokus för granskningen

1. **Enorma tal** (till exempel 0 till 99999, svar med 10 siffror): uppgiften och svarsrutan bryts eller krymper utan horisontell scroll vid 360 px bredd. Pinnas i Task 1 (CSS-regel) och kontrolleras i Task 6.
2. **Konstiga tecken i svaret** (`" 28 "`, `"028"`, `"2e1"`, `"-28"`, `"28,0"`): bara siffror räknas. Inledande nollor och mellanslag är okej, allt annat blir fel svar och inte en krasch. Pinnas i Task 3 (`tolkaSvar`).
3. **Chromebooken somnar eller fliken hamnar i bakgrunden:** timern räknas från en sluttid (`Date.now()`) och inte genom att räkna intervall, så att tiden inte drar sig. Pinnas i Task 3 (`tidKvar`) och Task 5.
4. **Enter hålls nere eller trycks under felpausen:** svaret skickas bara en gång och ignoreras under pausen. Pinnas i Task 5.
5. **Bakåtknapp eller omladdning mitt i en omgång eller på `#klart`:** timer och timeouts stoppas. Om man laddar om direkt på `#omgang` eller `#klart` hamnar man på `#installningar` med förvalen. Pinnas i Task 2 och Task 5.

---

### Task 1: Projektgrund, gemensam stil och landningssida

**Filer:**
- Skapa: `index.html`, `css/style.css`, `.gitignore` (med raden `.superpowers/`)
- Git: `git init` på `main`, därefter commit

**Gränssnitt:**
- Skapar CSS-klasser som senare tasks använder: `.sida` (centrerad kolumn, max 640 px, 16 px marginal), `.ruta` (verktygsruta), `.ruta--snart` (grå och inte klickbar), `.knapp`, `.knapp--start` (grön), `.knapp--sekundar` (grå), `.val` och `.val--vald` (tidsknappar), `.dold` (`display:none`), `.rubrik`, `.etikett`.
- Siffror i uppgifter och svar: `font-variant-numeric: tabular-nums; overflow-wrap:anywhere`.

- [ ] **Steg 1:** Skapa `css/style.css` med variablerna och klasserna ovan, och `index.html` med "GrundMatte", en länk `.ruta` till `multiplikation.html` ("✖️ Multiplikation") och två `.ruta--snart` ("➕ Addition · snart", "➗ Division · snart") som inte är länkar.
- [ ] **Steg 2: Kontroll.** Öppna `index.html` i webbläsaren vid 1280 px och 360 px bredd. Förväntat: tre rutor som kan läsas, ingen horisontell scroll, de gråa rutorna går inte att klicka på.
- [ ] **Steg 3: Commit.** `git init -b main`, `git add .`, `git commit -m "Landningssida och gemensam stil"`

### Task 2: Skalet för verktyget med de tre vyerna (klickbart med påhittade data)

**Filer:**
- Skapa: `multiplikation.html`, `js/multiplikation.js`

**Gränssnitt:**
- `multiplikation.html` har `<section id="vy-installningar">`, `<section id="vy-omgang">` och `<section id="vy-klart">` med innehållet från spec och skisser. Element-id som senare tasks använder:
  - Inställningar: `#tillbaka` (länk till `index.html`, "← Tillbaka"), tidsknappar `button.val[data-sekunder="60|120|180|300"]`, `#fran` och `#till` (`<input type="text" inputmode="numeric">`), `#fran-minus`, `#fran-plus`, `#till-minus`, `#till-plus`, `#exempel`, `#start`.
  - Omgång: `#tid`, `#poang`, `#uppgift`, `#svar` (`<input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done">` inne i en `<form id="svarsform">`), `#svara` (submit), `#facit` (raden "6 × 8 = 48", dold i början).
  - Klart: `#antal-ratt`, `#antal-fel`, `#fel-tabell` (`<table>` med `<tbody>`), `#inga-fel` ("Inga fel! 💪"), `#igen`, `#andra`.
- I `js/multiplikation.js`: `visaVy(namn)` där namn är `'installningar' | 'omgang' | 'klart'`. Den lägger till och tar bort `.dold` och körs vid `hashchange` och vid start.
- **Regel för omladdning:** när sidan laddas med `#omgang` eller `#klart` och ingen omgång pågår körs `location.replace('#installningar')`.

- [ ] **Steg 1:** Bygg HTML med alla vyer och lägg in påhittade data (uppgiften "4 × 7 =", tiden "⏱ 2:00", poängen "⭐ 0", två rader i fel-tabellen). Tillfälligt: Start går till `#omgang`, ett klick på `#svara` går till `#klart`, Igen går till `#omgang` och Ändra går till `#installningar`.
- [ ] **Steg 2: Kontroll.** Klicka igenom hela flödet. Bakåtknappen från `#omgang` ska ge inställningarna, och en omladdning på `#klart` ska ge inställningarna. Kontrollera vid 360 px att uppgift, svarsruta och ✓ Svara får plats i den övre halvan av skärmen, alltså den del som syns när tangentbordet är uppe.
- [ ] **Steg 3: Visa André.** Han tittar på det klickbara flödet innan logiken byggs. Justera efter hans synpunkter.
- [ ] **Steg 4: Commit.** `git add . && git commit -m "Klickbart flöde för multiplikation"`

### Task 3: Ren logik med tester

**Filer:**
- Skapa: `js/multiplikation-logik.js`, `tests/multiplikation-logik.test.js`

**Gränssnitt (produceras):** Filen definierar `const MultiLogik = {...}` och avslutas med `if (typeof module !== 'undefined') module.exports = MultiLogik;` så att den fungerar både i webbläsaren och i Node.
- `tolkaTal(text: string, forra: number) -> number`: ett heltal ≥ 0, annars `forra`.
- `normaliseraIntervall(fran: number, till: number) -> {fran, till}`: det minsta talet först.
- `nyUppgift(fran: number, till: number, forra: {a,b}|null, slump = Math.random) -> {a, b}`: a och b dras var för sig, likformigt i [fran, till]. Returnerar aldrig samma `{a,b}` som `forra` om det finns mer än en möjlig uppgift.
- `tolkaSvar(text: string) -> number|null`: `null` om texten är tom efter trim. Ett tal om den bara består av siffror. `NaN` annars (vilket räknas som fel).
- `tidKvar(slutMs: number, nuMs: number) -> number`: hela sekunder kvar, avrundat uppåt, aldrig under 0.
- `formateraTid(sekunder: number) -> string`: `"m:ss"`.

- [ ] **Steg 1: Skriv testerna som ska misslyckas** i `tests/multiplikation-logik.test.js` (`node:test`, `node:assert/strict`, `require('../js/multiplikation-logik.js')`):
  ```js
  test('tolkaTal', () => {
    assert.equal(tolkaTal('345', 1), 345);
    assert.equal(tolkaTal(' 7 ', 1), 7);
    assert.equal(tolkaTal('', 4), 4);
    assert.equal(tolkaTal('-3', 4), 4);
    assert.equal(tolkaTal('2.5', 4), 4);
    assert.equal(tolkaTal('abc', 4), 4);
    assert.equal(tolkaTal('0', 4), 0);
  });
  test('normaliseraIntervall byter plats', () => {
    assert.deepEqual(normaliseraIntervall(345, 11), { fran: 11, till: 345 });
    assert.deepEqual(normaliseraIntervall(2, 5), { fran: 2, till: 5 });
  });
  test('nyUppgift håller sig i intervallet', () => {
    for (let i = 0; i < 1000; i++) {
      const { a, b } = nyUppgift(11, 345, null);
      assert.ok(a >= 11 && a <= 345 && b >= 11 && b <= 345 && Number.isInteger(a) && Number.isInteger(b));
    }
  });
  test('nyUppgift upprepar inte förra', () => {
    for (let i = 0; i < 500; i++) {
      const u = nyUppgift(2, 3, { a: 2, b: 3 });
      assert.notDeepEqual(u, { a: 2, b: 3 });
    }
  });
  test('nyUppgift med ett enda tal', () => {
    assert.deepEqual(nyUppgift(7, 7, { a: 7, b: 7 }), { a: 7, b: 7 });
  });
  test('nyUppgift når båda ändpunkterna', () => {
    assert.deepEqual(nyUppgift(1, 10, null, () => 0), { a: 1, b: 1 });
    assert.deepEqual(nyUppgift(1, 10, null, () => 0.9999), { a: 10, b: 10 });
  });
  test('tolkaSvar', () => {
    assert.equal(tolkaSvar(''), null);
    assert.equal(tolkaSvar('   '), null);
    assert.equal(tolkaSvar(' 28 '), 28);
    assert.equal(tolkaSvar('028'), 28);
    assert.equal(tolkaSvar('119025'), 119025);
    assert.ok(Number.isNaN(tolkaSvar('2e1')));
    assert.ok(Number.isNaN(tolkaSvar('-28')));
    assert.ok(Number.isNaN(tolkaSvar('28,0')));
  });
  test('tidKvar och formateraTid', () => {
    assert.equal(tidKvar(10000, 0), 10);
    assert.equal(tidKvar(10000, 9001), 1);
    assert.equal(tidKvar(10000, 12000), 0);
    assert.equal(formateraTid(120), '2:00');
    assert.equal(formateraTid(83), '1:23');
    assert.equal(formateraTid(5), '0:05');
  });
  ```
- [ ] **Steg 2:** Kör `node --test tests/`. Förväntat: FAIL (`Cannot find module` eller funktioner som saknas).
- [ ] **Steg 3:** Implementera funktionerna i `js/multiplikation-logik.js`. *Lärtillfälle:* `nyUppgift` (5–10 rader) är förberedd som en TODO för André att skriva själv. Testerna ovan visar om den blir rätt.
- [ ] **Steg 4:** Kör `node --test tests/`. Förväntat: alla PASS.
- [ ] **Steg 5: Commit.** `git add . && git commit -m "Logik för multiplikation med tester"`

### Task 4: Koppla in inställningarna

**Filer:**
- Ändra: `multiplikation.html` (lägg till `<script src="js/multiplikation-logik.js">` före `js/multiplikation.js`), `js/multiplikation.js`

**Gränssnitt:**
- Använder: `MultiLogik.tolkaTal`, `MultiLogik.normaliseraIntervall`, `MultiLogik.nyUppgift`.
- Skapar ett tillstånd i `js/multiplikation.js`: `const installningar = { sekunder: 120, fran: 1, till: 10 }`. Det lever så länge sidan är öppen, och inget sparas.

- [ ] **Steg 1:** Tidsknapparna: ett klick sätter `installningar.sekunder` och flyttar `.val--vald`.
- [ ] **Steg 2:** −/+ ändrar talet med ett. − stannar vid 0. Att skriva i rutan uppdaterar tillståndet via `tolkaTal(text, förra)` vid `change`. En ogiltig text ersätts med det förra värdet i rutan.
- [ ] **Steg 3:** `#exempel` visar "Exempel: a × b" från `nyUppgift` med det normaliserade intervallet och uppdateras vid varje ändring.
- [ ] **Steg 4:** När `#start` klickas normaliseras talen. Om de bytte plats skrivs de tillbaka i rutorna i rätt ordning. Sedan startas omgången (Task 5) och `location.hash = 'omgang'` sätts.
- [ ] **Steg 5: Kontroll.** Pröva 345 till 11 (rutorna ska visa 11 och 345 efter Start), en tom ruta (det förra värdet kommer tillbaka) och − vid 0 (det stannar). Ändra-knappen från sammanfattningen ska visa de förra valen.
- [ ] **Steg 6: Commit.** `git add . && git commit -m "Inställningar för multiplikation"`

### Task 5: Omgången

**Filer:**
- Ändra: `js/multiplikation.js`, `css/style.css` (klasserna `.svar--ratt`, `.svar--fel`, `.tid--varning`)

**Gränssnitt:**
- Använder: `MultiLogik.nyUppgift`, `tolkaSvar`, `tidKvar`, `formateraTid`.
- Skapar: `startaOmgang()`, `stoppaOmgang()` (rensar interval och alla timeouts, idempotent) och ett omgångstillstånd `{ slutMs, uppgift, ratt, fel: [{a, b, svar}], pausar: boolean }`. `fel[].svar` är elevens text som den skrevs.

- [ ] **Steg 1:** `startaOmgang()`: `slutMs = Date.now() + sekunder*1000`. Nollställ poäng och fel, visa första uppgiften och fokusera `#svar`. Ett `setInterval` på 250 ms uppdaterar `#tid` med `formateraTid(tidKvar(...))` och lägger på `.tid--varning` vid ≤ 10. Vid 0 avslutas omgången, men om en felpaus pågår avslutas den när pausen är slut.
- [ ] **Steg 2:** `submit` på `#svarsform` (med `preventDefault`): ignoreras om `pausar` är sant eller om `tolkaSvar` ger `null`.
  - Rätt: poängen ökar, `.svar--ratt` visas i 300 ms, nästa uppgift kommer direkt, rutan töms och behåller fokus.
  - Fel (inklusive `NaN`): uppgiften läggs i `fel`, `.svar--fel` visas (röd och överstruken), `#facit` visar "a × b = svar", `pausar = true` och efter 1500 ms kommer nästa uppgift.
- [ ] **Steg 3:** När omgången är slut körs `stoppaOmgang()`, sammanfattningen fylls (Task 6) och `location.hash = 'klart'` sätts. Om eleven lämnar `#omgang` (`hashchange` till något annat) körs `stoppaOmgang()`.
- [ ] **Steg 4: Kontroll.** Kör en omgång på 1 min:
  - Rätt svar blinkar grönt och det går att svara direkt igen.
  - Ett fel visar facit i cirka 1,5 s, och Enter under tiden gör ingenting.
  - Om Enter hålls nere skickas svaret bara en gång.
  - Timern blir röd vid 0:10.
  - Om man byter flik i 20 s har tiden ändå gått.
  - Bakåtknappen mitt i omgången leder till inställningarna, och inget händer senare (ingen hopp till `#klart`).
  - På mobil, eller i emuleringsläget vid 360 px, öppnas sifferknappsatsen, och Gå/Enter svarar.
- [ ] **Steg 5: Commit.** `git add . && git commit -m "Omgång med timer och återkoppling"`

### Task 6: Sammanfattning och slutkontroll

**Filer:**
- Ändra: `js/multiplikation.js`, `css/style.css` (tabellen på smal skärm)

**Gränssnitt:**
- Använder: omgångstillståndet från Task 5 och `startaOmgang()`.

- [ ] **Steg 1:** Fyll `#antal-ratt` ("✓ n") och `#antal-fel` ("✗ n"). Fel-tabellen får en rad per fel i ordning: *Uppgift* "a × b", *Ditt svar* (överstruket, rött) och *Rätt* (grönt). Använd `textContent` och inte `innerHTML`, eftersom elevens text visas. Vid 0 fel döljs tabellen och `#inga-fel` visas.
- [ ] **Steg 2:** `#igen` kör `startaOmgang()` med samma inställningar och sätter `#omgang`. `#andra` sätter `#installningar`.
- [ ] **Steg 3: Slutkontroll mot spec.** Gå igenom varje punkt under "Skärmar" och "Enheter" i specen vid 1280 px och 360 px. Kontrollera också Fokus för granskningen 1: intervallet 0 till 99999 får inte ge horisontell scroll i omgången eller i tabellen. Kör `node --test tests/`. Förväntat: alla PASS.
- [ ] **Steg 4: Commit.** `git add . && git commit -m "Sammanfattning med fel-tabell"`
