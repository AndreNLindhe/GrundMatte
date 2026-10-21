# GrundMatte – landningssida och multiplikation på tid

Datum: 2026-10-21

## Syfte och varför

GrundMatte är en samling små verktyg för mängdträning i grundläggande matematik.
Användarna är gymnasieelever på IM som saknar delar av grundskolans matematik.
Många har begränsad svenska, och skoldatorerna är enkla och långsamma.

Därför ska allt vara tydligt med få ord. Siffrorna ska vara stora, och symboler och
färg ska bära betydelse. Utseendet ska vara lugnt och vuxet, inte barnsligt, eftersom
eleverna är 16–20 år och kan skämmas över att öva på tabellerna.

Det första verktyget är multiplikation på tid. Eleven väljer själv tid och vilka tal
hen vill öva på och löser sedan så många uppgifter som möjligt. Poängen är en kul
återkoppling för eleven själv. Inget sparas och läraren styr ingenting.

## Mål

- En landningssida där eleven väljer verktyg.
- Multiplikationsverktyget i tre steg: Inställningar → Omgång → Sammanfattning.
- Det ska kunna användas helt med tangentbordet under en omgång. Musen behövs inte.
- Det ska gå snabbt på en svag dator.

## Icke-mål

- Ingen inloggning, ingen poänghistorik, inga topplistor och ingen lärarvy.
- Inga andra räknesätt än multiplikation i den här omgången. De visas bara som "snart"
  på landningssidan.
- Ingen översättning till andra språk.

## Det som inte får hända (även om det tekniskt fungerar)

- Långa texter eller instruktioner som måste läsas för att förstå.
- Barnslig grafik som maskotar eller tecknade figurer.
- Tunga animationer, bibliotek eller byggsteg som gör det segt eller krångligt att starta.

## Begränsningar

- Vanlig HTML, CSS och JavaScript. Inga ramverk, inga bibliotek, inget byggsteg.
- Det ska fungera när man dubbelklickar på `index.html` lokalt (`file://`), alltså
  inga ES-moduler (`type="module"`) och ingen `fetch` av lokala filer. Det ska också
  fungera från en vanlig webbserver.
- Gränssnittet är på svenska.

## Skärmar (beslutade tillsammans med André, se skisser)

Skisserna finns i `.superpowers/brainstorm/648-1792590429/content/`
(`flode.html`, `aterkoppling.html`).

### 1. Landningssida
- Rubriken "GrundMatte".
- En stor klickbar ruta per verktyg: "✖️ Multiplikation" är aktiv.
- Kommande verktyg ("➕ Addition", "➗ Division") är gråa och märkta "snart". De går inte att klicka på.

### 2. Inställningar
- Rubriken "✖️ Multiplikation".
- **⏱ Tid:** färdiga knappar 1 min, 2 min, 3 min och 5 min. Man väljer en åt gången.
- **🔢 Tal:** "från" och "till", var och en en ruta man kan skriva i, med knapparna − och + runt.
- **Båda talen i varje uppgift** ligger inom det valda intervallet (från ≤ a, b ≤ till).
  Exempel: 2 till 5 ger bland annat 2 × 5, 4 × 3 och 5 × 5.
- En exempeluppgift visas, till exempel "Exempel: 4 × 7", och följer intervallet.
- Stor grön knapp "▶ Start".

### 3. Omgång
- Överst: "⏱ 1:23" (tid kvar) till vänster och "⭐ 7" (antal rätt) till höger.
- En uppgift åt gången i stor stil, till exempel "4 × 7 =".
- En svarsruta som bara tar siffror, och under den knappen "✓ Svara".
- Enter fungerar som "✓ Svara". Markören står alltid kvar i svarsrutan.
- **Rätt svar:** rutan blinkar grönt med en bock, poängen ökar med ett och nästa uppgift
  kommer direkt.
- **Fel svar:** elevens svar blir rött och överstruket, och rätt svar visas i grönt
  ("6 × 8 = 48") i ungefär 1,5 sekund. Sedan kommer nästa uppgift. Under den tiden går
  det inte att svara.
- Timern går hela tiden, även medan rätt svar visas.
- Om eleven trycker Enter i en tom ruta händer ingenting.
- När tiden är slut går man direkt till sammanfattningen. En uppgift som inte hann
  besvaras räknas inte.

### 4. Sammanfattning
- "Klart! 🎉"
- Antal rätt "✓ 12" i grönt och antal fel "✗ 3" i rött.
- En tabell med alla fel i den ordning de kom, med kolumnerna **Uppgift**, **Ditt svar**
  och **Rätt**. Eleven ska kunna studera den i lugn och ro, så ingenting försvinner av
  sig självt.
- Om eleven inte hade några fel visas en kort rad i stället för tabellen, till exempel
  "Inga fel! 💪".
- Knapparna "↻ Igen" (ny omgång med samma inställningar) och "⚙ Ändra" (tillbaka till
  inställningarna, där de förra valen redan är ifyllda).

## Mina beslut (Claudes, inte Andrés – kan ändras)

- **Talintervall (beslutat av André):** helt öppet. Det ska till exempel gå att öva på
  11 till 345. Förvalt är 1 till 10.
  - *Mina beslut:* "från" och "till" är rutor man kan skriva i, med − och + bredvid för
    små steg. Bara heltal från 0 och uppåt, inga negativa tal och inga decimaler. Om
    "från" är större än "till" används talen ändå som intervall, det vill säga de byter
    plats i tysthet. Om en ruta är tom eller ogiltig när man trycker Start används det
    förra giltiga värdet.
  - Uppgiften och svarsrutan ska rymma stora tal (345 × 345 = 119025) utan att layouten
    går sönder, även på mobil.
- **Förvald tid:** 2 min.
- **Hur uppgifterna slumpas:** a och b dras var för sig ur intervallet. Samma uppgift
  kommer aldrig två gånger i rad, och a × b räknas som en annan uppgift än b × a. Om
  intervallet bara har ett tal (till exempel 7 till 7) blir det alltid 7 × 7, och det är
  okej.
- **Den sista uppgiften när tiden tar slut:** om ett fel svar visas när tiden går ut
  räknas felet, och sammanfattningen kommer när de 1,5 sekunderna är slut.
- **En liten varning för tiden:** de sista 10 sekunderna blir timern röd. Det är
  diskret, utan ljud.
- **Ljud:** inget.
- **Tillbaka:** inställningarna har en liten länk "← Tillbaka" till landningssidan.
  Under en omgång finns ingen avbrytknapp, men webbläsarens bakåtknapp leder till
  inställningarna med valen kvar. Därför har stegen egna adresser (`#installningar`,
  `#omgang`, `#klart`) på samma sida. Timern stoppas när eleven lämnar omgången. Om
  eleven går ända till landningssidan och sedan tillbaka till verktyget, börjar
  inställningarna om från förvalen.
- **Rätt svar spärrar inte:** det gröna blinket är bara en visuell effekt (cirka 300 ms).
  Nästa uppgift går att svara på direkt. Bara fel svar har en väntetid (1,5 s).
- **Utseende:** ljus bakgrund och hög kontrast. Systemets typsnitt, inget webbtypsnitt
  att ladda ner. En blå accentfärg och grönt/rött för rätt/fel. Rätt och fel visas också
  med symbolerna ✓ och ✗ och med överstrykning, så att det inte bara hänger på färgen.
- **Emoji:** eleverna kör nästan bara Chromebooks, alltså modern Chrome med
  färg-emoji. Emoji används därför som ikoner. Inga egna ikonfiler behövs.

## Enheter (beslutat av André)

- **Chromebooks** är huvudmålet. Det är modern Chrome, så modern JavaScript och CSS
  fungerar (`const`, pilfunktioner, CSS-variabler, grid).
- **Mobiltelefoner ska fungera fullt ut**, inte bara inte gå sönder:
  - Svarsrutan öppnar sifferknappsatsen (`inputmode="numeric"`), och knappsatsens
    Enter/Gå svarar.
  - Under en omgång ska uppgiften, svarsrutan och "✓ Svara" synas ovanför
    tangentbordet när det är uppe, utan att man behöver scrolla. Timern och poängen bör
    också synas. Om det blir trångt får de krympa.
  - Knapparna (tid, −/+, Start, Igen, Ändra) är tillräckligt stora för fingrar, minst
    cirka 44 px.
  - Fel-tabellen i sammanfattningen får plats i bredd på en smal skärm.

## Upplägg (överlåts till byggaren, med förslag)

Förslag på filer:

```
index.html              landningssida
multiplikation.html     verktyget; de tre stegen är vyer som visas/döljs
css/style.css           gemensam stil för alla verktyg
js/multiplikation.js    logik för verktyget
```

Den gemensamma stilen ska göra det enkelt att lägga till nästa verktyg i samma form.
Byggaren väljer själv hur logiken delas upp i funktioner.

## Arbetssätt

André vill arbeta med användarupplevelsen först och algoritmen sedan. Bygg därför
skärmarna och flödet så att man kan klicka igenom dem tidigt, och fyll sedan i
logiken.
