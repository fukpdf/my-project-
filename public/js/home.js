/* Homepage-only logic — tools grid, calculators, mobile toggle.
   Header + drawer + auth modal live in chrome.js (loaded on every page). */

const homeToolUrl = id => `/${id}`;

/* ----------------------- render tools grid ----------------------- */
function renderTools(){
  const root = document.getElementById('tools-root');
  if (!root || !window.TOOL_GROUPS) return;
  root.innerHTML = window.TOOL_GROUPS.map(g => `
    <section class="cat-block" id="cat-${g.key}">
      <div class="cat-title">${g.title}</div>
      <div class="tools-grid">
        ${g.items.map(t => `
          <a class="tool" data-cat="${g.key}" href="${homeToolUrl(t.id)}">
            <span class="tool-ico"><i data-lucide="${t.icon}"></i></span>
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
          </a>
        `).join('')}
      </div>
    </section>
  `).join('');
}

/* ----------------------- mobile calculator toggle ----------------------- */
function wireCalcToggle(){
  const btn  = document.getElementById('calc-toggle');
  const slot = document.getElementById('calc-mobile-slot');
  const sticky = document.querySelector('.rail-sticky');
  if (!btn || !slot || !sticky) return;
  btn.addEventListener('click', () => {
    const open = !btn.classList.contains('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) Array.from(sticky.children).forEach(c => slot.appendChild(c));
    else      Array.from(slot.children).forEach(c => sticky.appendChild(c));
  });
}

/* ----------------------- numbers-to-words calculator ----------------------- */
function wireCalc(){
  const input    = document.getElementById('calc-input');
  const btn      = document.getElementById('calc-go');
  const out      = document.getElementById('calc-out');
  const currency = document.getElementById('calc-currency');
  const modes    = document.querySelectorAll('.calc-mode');
  if (!input || !btn) return;

  let mode = 'words';
  modes.forEach(m => {
    m.addEventListener('click', () => {
      modes.forEach(x => x.classList.remove('active'));
      m.classList.add('active');
      mode = m.dataset.mode;
      currency.classList.toggle('show', mode === 'currency');
    });
  });

  const run = () => {
    const val = (input.value || '').trim();
    out.classList.remove('show','err');
    if (!val) { out.textContent = 'Please enter a number.'; out.classList.add('show','err'); return; }
    if (typeof window.convertNumberToWords !== 'function') {
      out.textContent = 'Converter is loading…'; out.classList.add('show','err'); return;
    }
    const res = window.convertNumberToWords(val, {
      mode, currency: currency.value, letterCase: 'Sentence Case',
    });
    if (res.error) { out.textContent = res.error; out.classList.add('show','err'); return; }
    out.textContent = res.text;
    out.classList.add('show');
  };
  btn.addEventListener('click', run);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
}

/* ----------------------- live currency converter ----------------------- */
const FX_LIST = [
  ['USD','US Dollar'],['EUR','Euro'],['GBP','British Pound'],['JPY','Japanese Yen'],
  ['CNY','Chinese Yuan'],['INR','Indian Rupee'],['PKR','Pakistani Rupee'],
  ['AED','UAE Dirham'],['SAR','Saudi Riyal'],['CAD','Canadian Dollar'],
  ['AUD','Australian Dollar'],['CHF','Swiss Franc'],['TRY','Turkish Lira'],
  ['RUB','Russian Ruble'],['SGD','Singapore Dollar'],['MYR','Malaysian Ringgit'],
  ['THB','Thai Baht'],['IDR','Indonesian Rupiah'],['HKD','Hong Kong Dollar'],
  ['KRW','South Korean Won'],['NZD','New Zealand Dollar'],['ZAR','South African Rand'],
  ['BRL','Brazilian Real'],['MXN','Mexican Peso'],['SEK','Swedish Krona'],
  ['NOK','Norwegian Krone'],['DKK','Danish Krone'],['PLN','Polish Zloty'],
  ['EGP','Egyptian Pound'],['NGN','Nigerian Naira'],['BDT','Bangladeshi Taka'],
  ['VND','Vietnamese Dong'],['PHP','Philippine Peso'],['ILS','Israeli Shekel'],
  ['QAR','Qatari Riyal'],['KWD','Kuwaiti Dinar'],['BHD','Bahraini Dinar'],
];

let FX_RATES = null;

async function loadRates(){
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const fallback = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';
  try {
    const r = await fetch(url, { cache:'no-cache' });
    if (!r.ok) throw new Error(r.status);
    return (await r.json()).usd;
  } catch (e) {
    try {
      const r = await fetch(fallback, { cache:'no-cache' });
      return (await r.json()).usd;
    } catch (e2) { return null; }
  }
}

function fxConvert(amount, from, to){
  if (!FX_RATES) return null;
  const fromR = from === 'USD' ? 1 : FX_RATES[from.toLowerCase()];
  const toR   = to   === 'USD' ? 1 : FX_RATES[to.toLowerCase()];
  if (!fromR || !toR) return null;
  return (amount / fromR) * toR;
}
function fmtMoney(v, code){
  try { return new Intl.NumberFormat(undefined, { style:'currency', currency:code, maximumFractionDigits:4 }).format(v); }
  catch { return v.toFixed(4) + ' ' + code; }
}

async function wireFx(){
  const amount = document.getElementById('fx-amount');
  const from   = document.getElementById('fx-from');
  const to     = document.getElementById('fx-to');
  const swap   = document.getElementById('fx-swap');
  const result = document.getElementById('fx-result');
  const rate   = document.getElementById('fx-rate');
  if (!amount || !from || !to) return;

  const opts = FX_LIST.map(([c,n]) => `<option value="${c}">${c} — ${n}</option>`).join('');
  from.innerHTML = opts; to.innerHTML = opts;
  from.value = 'USD'; to.value = 'EUR';

  const update = () => {
    const a = parseFloat(amount.value);
    if (!isFinite(a) || a < 0) { result.textContent = '—'; rate.textContent = 'Enter a valid amount.'; return; }
    if (!FX_RATES) { result.textContent = '—'; rate.textContent = 'Loading rates…'; return; }
    const v = fxConvert(a, from.value, to.value);
    if (v === null) { result.textContent = '—'; rate.textContent = 'Rate unavailable.'; return; }
    result.textContent = fmtMoney(v, to.value);
    const one = fxConvert(1, from.value, to.value);
    rate.textContent = `1 ${from.value} = ${one.toFixed(4)} ${to.value}`;
  };

  [amount, from, to].forEach(el => el.addEventListener('input', update));
  swap.addEventListener('click', () => { const t = from.value; from.value = to.value; to.value = t; update(); });

  rate.textContent = 'Loading rates…';
  FX_RATES = await loadRates();
  if (!FX_RATES) { rate.textContent = 'Rates unavailable. Try again later.'; return; }
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  wireCalc();
  wireCalcToggle();
  wireFx();
  const tryIcons = () => window.lucide && window.lucide.createIcons && window.lucide.createIcons();
  tryIcons();
  setTimeout(tryIcons, 150);
  setTimeout(tryIcons, 700);
});
