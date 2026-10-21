// Gränssnittet för multiplikationsverktyget. Logiken ligger i multiplikation-logik.js.

const FEL_PAUS_MS = 1500;
const RATT_BLINK_MS = 300;
const VARNING_SEKUNDER = 10;

const $ = (id) => document.getElementById(id);

// Lever så länge sidan är öppen – inget sparas.
const installningar = { sekunder: 120, fran: 1, till: 10 };

let omgang = null;          // pågående omgång, annars null
let resultat = null;        // senaste avslutade omgång
let intervall = null;
let timeouts = [];

// ---------- Vyer ----------

const VYER = ['installningar', 'omgang', 'klart'];

function visaVy(namn) {
  VYER.forEach((v) => $('vy-' + v).classList.toggle('dold', v !== namn));
  if (namn === 'omgang') $('svar').focus();
}

// Byter vy direkt (så att fokus fungerar på mobil). Från inställningarna läggs vyn
// till i historiken; omgång och sammanfattning ersätter varandra, så att bakåt
// alltid leder till inställningarna.
function gaTill(namn) {
  visaVy(namn);
  if (location.hash === '#' + namn) return;
  if (location.hash === '#installningar') location.hash = namn;
  else location.replace('#' + namn);
}

function vyFranAdress() {
  const namn = location.hash.slice(1);
  if (namn !== 'omgang' && omgang) stoppaOmgang();
  const giltig = (namn === 'omgang' && omgang) || (namn === 'klart' && resultat) || namn === 'installningar';
  if (!giltig) {
    location.replace('#installningar');
    visaVy('installningar');
    return;
  }
  visaVy(namn);
}

window.addEventListener('hashchange', vyFranAdress);

// ---------- Inställningar ----------

function visaExempel() {
  const fran = MultiLogik.tolkaTal($('fran').value, installningar.fran);
  const till = MultiLogik.tolkaTal($('till').value, installningar.till);
  const iv = MultiLogik.normaliseraIntervall(fran, till);
  const { a, b } = MultiLogik.nyUppgift(iv.fran, iv.till, null);
  $('exempel').textContent = 'Exempel: ' + a + ' × ' + b;
}

function skrivTal() {
  $('fran').value = installningar.fran;
  $('till').value = installningar.till;
  visaExempel();
}

document.querySelectorAll('.val[data-sekunder]').forEach((knapp) => {
  knapp.addEventListener('click', () => {
    installningar.sekunder = Number(knapp.dataset.sekunder);
    document.querySelectorAll('.val[data-sekunder]').forEach((k) => k.classList.toggle('val--vald', k === knapp));
  });
});

['fran', 'till'].forEach((falt) => {
  $(falt + '-minus').addEventListener('click', () => {
    installningar[falt] = Math.max(0, MultiLogik.tolkaTal($(falt).value, installningar[falt]) - 1);
    skrivTal();
  });
  $(falt + '-plus').addEventListener('click', () => {
    installningar[falt] = MultiLogik.tolkaTal($(falt).value, installningar[falt]) + 1;
    skrivTal();
  });
  $(falt).addEventListener('input', visaExempel);
  $(falt).addEventListener('change', () => {
    installningar[falt] = MultiLogik.tolkaTal($(falt).value, installningar[falt]);
    skrivTal();
  });
});

$('start').addEventListener('click', () => {
  installningar.fran = MultiLogik.tolkaTal($('fran').value, installningar.fran);
  installningar.till = MultiLogik.tolkaTal($('till').value, installningar.till);
  Object.assign(installningar, MultiLogik.normaliseraIntervall(installningar.fran, installningar.till));
  skrivTal();
  startaOmgang();
});

// ---------- Omgång ----------

function efter(ms, fn) {
  timeouts.push(setTimeout(fn, ms));
}

function visaUppgift() {
  omgang.uppgift = MultiLogik.nyUppgift(installningar.fran, installningar.till, omgang.uppgift);
  $('uppgift').textContent = omgang.uppgift.a + ' × ' + omgang.uppgift.b + ' =';
  $('svar').value = '';
}

function uppdateraTid() {
  const kvar = MultiLogik.tidKvar(omgang.slutMs, Date.now());
  $('tid').textContent = '⏱ ' + MultiLogik.formateraTid(kvar);
  $('tid').classList.toggle('tid--varning', kvar <= VARNING_SEKUNDER);
  if (kvar === 0) {
    omgang.tidSlut = true;
    if (!omgang.pausar) avslutaOmgang();
  }
}

function startaOmgang() {
  stoppaOmgang();
  omgang = {
    slutMs: Date.now() + installningar.sekunder * 1000,
    uppgift: null,
    ratt: 0,
    fel: [],
    pausar: false,
    tidSlut: false
  };
  $('poang').textContent = '⭐ 0';
  $('svar').classList.remove('svar--ratt', 'svar--fel');
  $('facit').classList.add('osynlig');
  visaUppgift();
  uppdateraTid();
  intervall = setInterval(uppdateraTid, 250);
  gaTill('omgang');
}

function stoppaOmgang() {
  clearInterval(intervall);
  timeouts.forEach(clearTimeout);
  timeouts = [];
  omgang = null;
}

function avslutaOmgang() {
  resultat = { ratt: omgang.ratt, fel: omgang.fel };
  stoppaOmgang();
  fyllSammanfattning();
  gaTill('klart');
}

// Håller kvar fokus (och mobilens tangentbord) i svarsrutan när man trycker på knappen.
$('svara').addEventListener('pointerdown', (e) => e.preventDefault());

$('svarsform').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!omgang || omgang.pausar) return;
  const text = $('svar').value;
  const svar = MultiLogik.tolkaSvar(text);
  if (svar === null) return;

  const { a, b } = omgang.uppgift;
  const svarRuta = $('svar');
  svarRuta.focus();

  if (svar === a * b) {
    omgang.ratt++;
    $('poang').textContent = '⭐ ' + omgang.ratt;
    svarRuta.classList.add('svar--ratt');
    efter(RATT_BLINK_MS, () => svarRuta.classList.remove('svar--ratt'));
    visaUppgift();
    return;
  }

  omgang.fel.push({ a, b, svar: text.trim() });
  omgang.pausar = true;
  svarRuta.classList.remove('svar--ratt');
  svarRuta.classList.add('svar--fel');
  const facit = $('facit');
  facit.textContent = a + ' × ' + b + ' = ';
  const ratt = document.createElement('span');
  ratt.className = 'facit__ratt';
  ratt.textContent = a * b;
  facit.appendChild(ratt);
  facit.classList.remove('osynlig');

  efter(FEL_PAUS_MS, () => {
    svarRuta.classList.remove('svar--fel');
    facit.classList.add('osynlig');
    omgang.pausar = false;
    if (omgang.tidSlut) {
      avslutaOmgang();
    } else {
      visaUppgift();
    }
  });
});

// ---------- Sammanfattning ----------

function cell(text, klass) {
  const td = document.createElement('td');
  td.textContent = text;
  if (klass) td.className = klass;
  return td;
}

function fyllSammanfattning() {
  $('antal-ratt').textContent = '✓ ' + resultat.ratt;
  $('antal-fel').textContent = '✗ ' + resultat.fel.length;

  const tbody = $('fel-tabell').querySelector('tbody');
  tbody.replaceChildren();
  resultat.fel.forEach(({ a, b, svar }) => {
    const tr = document.createElement('tr');
    tr.append(cell(a + ' × ' + b), cell(svar, 'ditt'), cell(a * b, 'ratt'));
    tbody.appendChild(tr);
  });

  const ingaFel = resultat.fel.length === 0;
  $('fel-tabell').classList.toggle('dold', ingaFel);
  $('inga-fel').classList.toggle('dold', !ingaFel);
}

$('igen').addEventListener('click', startaOmgang);
$('andra').addEventListener('click', () => gaTill('installningar'));

// ---------- Start ----------

skrivTal();
vyFranAdress();
