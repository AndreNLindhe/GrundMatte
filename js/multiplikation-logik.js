// Ren logik för multiplikationsverktyget – inga DOM-anrop, så att den kan testas med Node.

const MultiLogik = {
  // Heltal ≥ 0 från en textruta, annars det förra giltiga värdet.
  tolkaTal(text, forra) {
    const t = String(text).trim();
    return /^\d+$/.test(t) ? Number(t) : forra;
  },

  // Minsta talet först, så att "345 till 11" blir samma som "11 till 345".
  normaliseraIntervall(fran, till) {
    return { fran: Math.min(fran, till), till: Math.max(fran, till) };
  },

  // Båda talen dras var för sig ur [fran, till]. Samma uppgift kommer aldrig två
  // gånger i rad, utom när intervallet bara har ett tal.
  nyUppgift(fran, till, forra, slump = Math.random) {
    const dra = () => fran + Math.floor(slump() * (till - fran + 1));
    if (fran === till) return { a: fran, b: fran };
    let a, b;
    do {
      a = dra();
      b = dra();
    } while (forra && a === forra.a && b === forra.b);
    return { a, b };
  },

  // null = tomt (ignoreras), ett tal = svar, NaN = något annat än siffror (räknas som fel).
  tolkaSvar(text) {
    const t = String(text).trim();
    if (t === '') return null;
    return /^\d+$/.test(t) ? Number(t) : NaN;
  },

  // Räknas från sluttiden så att tiden stämmer även om fliken legat i bakgrunden.
  tidKvar(slutMs, nuMs) {
    return Math.max(0, Math.ceil((slutMs - nuMs) / 1000));
  },

  formateraTid(sekunder) {
    const m = Math.floor(sekunder / 60);
    const s = sekunder % 60;
    return m + ':' + String(s).padStart(2, '0');
  }
};

if (typeof module !== 'undefined') module.exports = MultiLogik;
