/* Home page bootstrap — renders tools grid, mega-menu, calculator, drawer */

const TOOL_GROUPS = [
  {
    key:'organize', title:'Organize PDFs',
    items:[
      { id:'merge',    name:'Merge PDF',    icon:'layers',     desc:'Combine multiple PDFs into one' },
      { id:'split',    name:'Split PDF',    icon:'scissors',   desc:'Extract pages or ranges' },
      { id:'rotate',   name:'Rotate PDF',   icon:'rotate-cw',  desc:'Fix page orientation' },
      { id:'crop',     name:'Crop PDF',     icon:'crop',       desc:'Trim margins from pages' },
      { id:'organize', name:'Organize PDF', icon:'list-ordered', desc:'Reorder, delete, duplicate pages' },
    ]
  },
  {
    key:'compress', title:'Compress',
    items:[
      { id:'compress', name:'Compress PDF', icon:'archive', desc:'Reduce PDF file size' },
    ]
  },
  {
    key:'convert-from', title:'Convert From PDF',
    items:[
      { id:'pdf-to-word',       name:'PDF to Word',       icon:'file-text',         desc:'Convert PDF to editable .docx' },
      { id:'pdf-to-powerpoint', name:'PDF to PowerPoint', icon:'presentation',      desc:'Convert PDF to .pptx slides' },
      { id:'pdf-to-excel',      name:'PDF to Excel',      icon:'sheet',             desc:'Extract tables to .xlsx' },
      { id:'pdf-to-jpg',        name:'PDF to JPG',        icon:'image',             desc:'Export pages as images' },
    ]
  },
  {
    key:'convert-to', title:'Convert To PDF',
    items:[
      { id:'word-to-pdf',       name:'Word to PDF',       icon:'file-text',     desc:'Convert .docx into PDF' },
      { id:'powerpoint-to-pdf', name:'PowerPoint to PDF', icon:'presentation',  desc:'Convert .pptx into PDF' },
      { id:'excel-to-pdf',      name:'Excel to PDF',      icon:'sheet',         desc:'Convert .xlsx into PDF' },
      { id:'jpg-to-pdf',        name:'JPG to PDF',        icon:'image',         desc:'Combine images into PDF' },
      { id:'html-to-pdf',       name:'HTML to PDF',       icon:'code',          desc:'Render HTML pages as PDF' },
    ]
  },
  {
    key:'edit', title:'Edit & Annotate',
    items:[
      { id:'edit',         name:'Edit PDF',         icon:'edit-3',  desc:'Add text, shapes, and notes' },
      { id:'watermark',    name:'Watermark PDF',    icon:'droplet', desc:'Stamp custom watermarks' },
      { id:'sign',         name:'Sign PDF',         icon:'pen-tool',desc:'Add e-signatures' },
      { id:'page-numbers', name:'Add Page Numbers', icon:'hash',    desc:'Insert page numbers' },
      { id:'redact',       name:'Redact PDF',       icon:'eye-off', desc:'Hide sensitive content' },
    ]
  },
  {
    key:'security', title:'Security',
    items:[
      { id:'protect', name:'Protect PDF', icon:'lock',    desc:'Add password protection' },
      { id:'unlock',  name:'Unlock PDF',  icon:'unlock',  desc:'Remove PDF password' },
    ]
  },
  {
    key:'advanced', title:'Advanced',
    items:[
      { id:'repair',           name:'Repair PDF',       icon:'wrench',      desc:'Fix corrupted PDF files' },
      { id:'scan',             name:'Scan PDF',         icon:'scan-line',   desc:'Create searchable scans' },
      { id:'ocr',              name:'OCR PDF',          icon:'type',        desc:'Recognize text in scans' },
      { id:'compare',          name:'Compare PDF',      icon:'git-compare', desc:'Diff two PDF documents' },
      { id:'ai-summarizer',    name:'AI Summarizer',    icon:'sparkles',    desc:'Generate AI summaries' },
      { id:'translate',        name:'Translate PDF',    icon:'languages',   desc:'Translate PDFs to any language' },
      { id:'workflow',         name:'Workflow Builder', icon:'workflow',    desc:'Chain multiple PDF tools' },
      { id:'numbers-to-words', name:'Numbers to Words', icon:'calculator',  desc:'Convert numbers into words' },
    ]
  },
  {
    key:'image', title:'Image Tools',
    items:[
      { id:'background-remover', name:'Background Remover', icon:'image-off', desc:'Erase image backgrounds' },
      { id:'crop-image',         name:'Crop Image',         icon:'crop',      desc:'Trim images precisely' },
      { id:'resize-image',       name:'Resize Image',       icon:'maximize',  desc:'Change image dimensions' },
      { id:'image-filters',      name:'Image Filters',      icon:'sliders',   desc:'Apply photo filters' },
    ]
  },
];

const toolUrl = id => `/tool.html?id=${encodeURIComponent(id)}`;

/* ----------------------- render tools grid ----------------------- */
function renderTools(){
  const root = document.getElementById('tools-root');
  if (!root) return;
  root.innerHTML = TOOL_GROUPS.map(g => `
    <section class="cat-block">
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

/* ----------------------- mega menu ----------------------- */
function renderMega(){
  const mega = document.getElementById('mega');
  if (!mega) return;
  // Pick 4 columns: combine compress into Organize for layout balance
  const cols = [
    { title:'Organize',  items:[...TOOL_GROUPS[0].items, ...TOOL_GROUPS[1].items] },
    { title:'Convert',   items:[...TOOL_GROUPS[2].items, ...TOOL_GROUPS[3].items] },
    { title:'Edit & Secure', items:[...TOOL_GROUPS[4].items, ...TOOL_GROUPS[5].items] },
    { title:'Advanced & Image', items:[...TOOL_GROUPS[6].items, ...TOOL_GROUPS[7].items] },
  ];
  mega.innerHTML = `<div class="mega-grid">${cols.map(c => `
    <div class="mega-col">
      <h5>${c.title}</h5>
      ${c.items.map(t => `
        <a class="mega-link" href="${toolUrl(t.id)}" title="${t.desc||''}">
          <span class="mi"><i data-lucide="${t.icon}"></i></span>
          <span>${t.name}</span>
        </a>
      `).join('')}
    </div>
  `).join('')}</div>`;
}

/* ----------------------- mega open/close ----------------------- */
function wireMega(){
  const trigger = document.getElementById('all-tools-trigger');
  const mega    = document.getElementById('mega');
  const wrap    = document.getElementById('all-tools-wrap');
  if (!trigger || !mega) return;
  let open = false;
  const setOpen = v => {
    open = v;
    mega.classList.toggle('open', v);
  };
  trigger.addEventListener('click', e => { e.stopPropagation(); setOpen(!open); });
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* ----------------------- mobile calculator toggle ----------------------- */
function wireCalcToggle(){
  const btn  = document.getElementById('calc-toggle');
  const slot = document.getElementById('calc-mobile-slot');
  const card = document.querySelector('.rail-sticky .calc-card');
  if (!btn || !slot || !card) return;
  btn.addEventListener('click', () => {
    const open = card.classList.toggle('mobile-open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) slot.appendChild(card);
    else card.parentNode === slot && document.querySelector('.rail-sticky').appendChild(card);
  });
}

/* ----------------------- mobile drawer ----------------------- */
function wireDrawer(){
  const drawer = document.getElementById('drawer');
  const open  = document.getElementById('hamburger');
  const close = document.getElementById('drawer-close');
  const back  = drawer.querySelector('.drawer-back');
  const set = v => drawer.classList.toggle('open', v);
  open.addEventListener('click', () => set(true));
  close.addEventListener('click', () => set(false));
  back.addEventListener('click', () => set(false));
}

/* ----------------------- calculator ----------------------- */
function wireCalc(){
  const input    = document.getElementById('calc-input');
  const btn      = document.getElementById('calc-go');
  const out      = document.getElementById('calc-out');
  const currency = document.getElementById('calc-currency');
  const modes    = document.querySelectorAll('.calc-mode');

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
      mode,
      currency: currency.value,
      letterCase: 'Sentence Case',
    });
    if (res.error) { out.textContent = res.error; out.classList.add('show','err'); return; }
    out.textContent = res.text;
    out.classList.add('show');
  };
  btn.addEventListener('click', run);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
}

/* ----------------------- boot ----------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  renderMega();
  wireMega();
  wireDrawer();
  wireCalc();
  wireCalcToggle();
  if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  // re-run after icons load (script may load async)
  const tryIcons = () => window.lucide && window.lucide.createIcons && window.lucide.createIcons();
  setTimeout(tryIcons, 100);
  setTimeout(tryIcons, 600);
});
