/* Home page bootstrap — header, mega/dropdowns, tools grid, calculators */

const TOOL_GROUPS = [
  {
    key:'organize', title:'Organize',
    items:[
      { id:'merge-pdf',    name:'Merge PDF',    icon:'layers',       desc:'Combine multiple PDFs into one' },
      { id:'split-pdf',    name:'Split PDF',    icon:'scissors',     desc:'Extract pages or ranges' },
      { id:'rotate-pdf',   name:'Rotate PDF',   icon:'rotate-cw',    desc:'Fix page orientation' },
      { id:'crop-pdf',     name:'Crop PDF',     icon:'crop',         desc:'Trim margins from pages' },
      { id:'organize-pdf', name:'Organize PDF', icon:'list-ordered', desc:'Reorder, delete, duplicate pages' },
    ]
  },
  {
    key:'compress', title:'Compress',
    items:[
      { id:'compress-pdf', name:'Compress PDF', icon:'archive', desc:'Reduce PDF file size' },
    ]
  },
  {
    key:'convert', title:'Convert',
    items:[
      { id:'pdf-to-word',       name:'PDF to Word',       icon:'file-text',    desc:'Convert PDF to editable .docx' },
      { id:'pdf-to-excel',      name:'PDF to Excel',      icon:'sheet',        desc:'Extract tables to .xlsx' },
      { id:'pdf-to-powerpoint', name:'PDF to PowerPoint', icon:'presentation', desc:'Convert PDF to .pptx slides' },
      { id:'pdf-to-jpg',        name:'PDF to JPG',        icon:'image',        desc:'Export pages as images' },
      { id:'word-to-pdf',       name:'Word to PDF',       icon:'file-text',    desc:'Convert .docx into PDF' },
      { id:'excel-to-pdf',      name:'Excel to PDF',      icon:'sheet',        desc:'Convert .xlsx into PDF' },
      { id:'powerpoint-to-pdf', name:'PowerPoint to PDF', icon:'presentation', desc:'Convert .pptx into PDF' },
      { id:'jpg-to-pdf',        name:'JPG to PDF',        icon:'image',        desc:'Combine images into PDF' },
      { id:'html-to-pdf',       name:'HTML to PDF',       icon:'code',         desc:'Render HTML pages as PDF' },
    ]
  },
  {
    key:'edit', title:'Edit',
    items:[
      { id:'edit-pdf',         name:'Edit PDF',         icon:'edit-3',  desc:'Add text, shapes, and notes' },
      { id:'watermark-pdf',    name:'Watermark PDF',    icon:'droplet', desc:'Stamp custom watermarks' },
      { id:'sign-pdf',         name:'Sign PDF',         icon:'pen-tool',desc:'Add e-signatures' },
      { id:'add-page-numbers', name:'Add Page Numbers', icon:'hash',    desc:'Insert page numbers' },
      { id:'redact-pdf',       name:'Redact PDF',       icon:'eye-off', desc:'Hide sensitive content' },
    ]
  },
  {
    key:'security', title:'Security',
    items:[
      { id:'protect-pdf', name:'Protect PDF', icon:'lock',   desc:'Add password protection' },
      { id:'unlock-pdf',  name:'Unlock PDF',  icon:'unlock', desc:'Remove PDF password' },
    ]
  },
  {
    key:'advanced', title:'Advanced',
    items:[
      { id:'repair-pdf',       name:'Repair PDF',       icon:'wrench',      desc:'Fix corrupted PDF files' },
      { id:'scan-pdf',         name:'Scan PDF',         icon:'scan-line',   desc:'Create searchable scans' },
      { id:'ocr-pdf',          name:'OCR PDF',          icon:'type',        desc:'Recognize text in scans' },
      { id:'compare-pdf',      name:'Compare PDF',      icon:'git-compare', desc:'Diff two PDF documents' },
      { id:'ai-summarizer',    name:'AI Summarizer',    icon:'sparkles',    desc:'Generate AI summaries' },
      { id:'translate-pdf',    name:'Translate PDF',    icon:'languages',   desc:'Translate PDFs to any language' },
      { id:'workflow-builder', name:'Workflow Builder', icon:'workflow',    desc:'Chain multiple PDF tools' },
    ]
  },
  {
    key:'image', title:'Image',
    items:[
      { id:'background-remover', name:'Background Remover', icon:'image-off', desc:'Erase image backgrounds' },
      { id:'crop-image',         name:'Crop Image',         icon:'crop',      desc:'Trim images precisely' },
      { id:'resize-image',       name:'Resize Image',       icon:'maximize',  desc:'Change image dimensions' },
      { id:'image-filters',      name:'Image Filters',      icon:'sliders',   desc:'Apply photo filters' },
    ]
  },
];

const groupBy = key => TOOL_GROUPS.find(g => g.key === key);
const toolUrl = id => `/${id}`;

/* ----------------------- header (direct links + dropdowns + mega) ----------------------- */
function renderHeader(){
  const nav = document.getElementById('nav');
  if (!nav) return;

  const drop = (key) => {
    const g = groupBy(key);
    if (!g) return '';
    return `
      <div class="nav-item has-dd">
        <button class="nav-btn">${g.title} <i data-lucide="chevron-down"></i></button>
        <div class="dd">
          ${g.items.map(t => `
            <a class="dd-link" href="${toolUrl(t.id)}">
              <span class="mi"><i data-lucide="${t.icon}"></i></span>
              <span>${t.name}</span>
            </a>
          `).join('')}
        </div>
      </div>`;
  };

  const megaCols = ['organize','convert','edit','security','advanced','image']
    .map(k => {
      const g = groupBy(k); if (!g) return '';
      return `
        <div class="mega-col">
          <h5>${g.title}</h5>
          ${g.items.map(t => `
            <a class="mega-link" href="${toolUrl(t.id)}" title="${t.desc||''}">
              <span class="mi"><i data-lucide="${t.icon}"></i></span>
              <span>${t.name}</span>
            </a>`).join('')}
        </div>`;
    }).join('');

  nav.innerHTML = `
    <a class="nav-direct" href="/merge-pdf">Merge PDF</a>
    <a class="nav-direct" href="/split-pdf">Split PDF</a>
    ${drop('organize')}
    ${drop('convert')}
    ${drop('edit')}
    ${drop('security')}
    <div class="nav-item has-dd has-mega">
      <button class="nav-btn all-tools">All Tools <i data-lucide="chevron-down"></i></button>
      <div class="mega"><div class="mega-grid">${megaCols}</div></div>
    </div>
  `;
}

/* ----------------------- render tools grid ----------------------- */
function renderTools(){
  const root = document.getElementById('tools-root');
  if (!root) return;
  root.innerHTML = TOOL_GROUPS.map(g => `
    <section class="cat-block" id="cat-${g.key}">
      <div class="cat-title">${g.title}</div>
      <div class="tools-grid">
        ${g.items.map(t => `
          <a class="tool" data-cat="${g.key}" href="${toolUrl(t.id)}">
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
    if (open) {
      Array.from(sticky.children).forEach(c => slot.appendChild(c));
    } else {
      Array.from(slot.children).forEach(c => sticky.appendChild(c));
    }
  });
}

/* ----------------------- mobile drawer ----------------------- */
function wireDrawer(){
  const drawer = document.getElementById('drawer');
  const open  = document.getElementById('hamburger');
  const close = document.getElementById('drawer-close');
  if (!drawer || !open || !close) return;
  const back  = drawer.querySelector('.drawer-back');
  const set = v => drawer.classList.toggle('open', v);
  open.addEventListener('click', () => set(true));
  close.addEventListener('click', () => set(false));
  back.addEventListener('click', () => set(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
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

let FX_RATES = null; // map: currency -> rate vs USD
let FX_BASE  = 'USD';

async function loadRates(){
  // Free, no-key, CORS-enabled API
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const fallback = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';
  try {
    const r = await fetch(url, { cache:'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    return data.usd; // { eur:0.92, gbp:0.78, ... }
  } catch (e) {
    try {
      const r = await fetch(fallback, { cache:'no-cache' });
      const data = await r.json();
      return data.usd;
    } catch (e2) {
      return null;
    }
  }
}

function fxConvert(amount, from, to){
  if (!FX_RATES) return null;
  const fromR = from === 'USD' ? 1 : FX_RATES[from.toLowerCase()];
  const toR   = to   === 'USD' ? 1 : FX_RATES[to.toLowerCase()];
  if (!fromR || !toR) return null;
  // amount in USD = amount / fromR; result = (amount / fromR) * toR
  return (amount / fromR) * toR;
}

function fmtMoney(v, code){
  try {
    return new Intl.NumberFormat(undefined, { style:'currency', currency:code, maximumFractionDigits:4 }).format(v);
  } catch {
    return v.toFixed(4) + ' ' + code;
  }
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

/* ----------------------- boot ----------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderTools();
  wireDrawer();
  wireCalc();
  wireCalcToggle();
  wireFx();
  const tryIcons = () => window.lucide && window.lucide.createIcons && window.lucide.createIcons();
  tryIcons();
  setTimeout(tryIcons, 150);
  setTimeout(tryIcons, 700);
});
