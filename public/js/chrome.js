/* Shared chrome — header, mobile drawer, auth modal.
   Loaded on every page (homepage + tool pages). */

window.TOOL_GROUPS = [
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

const groupBy = key => window.TOOL_GROUPS.find(g => g.key === key);
const toolUrl = id => `/${id}`;

function renderHeader(){
  const nav = document.getElementById('nav');
  if (!nav) return;

  const drop = (key) => {
    const g = groupBy(key); if (!g) return '';
    return `
      <div class="nav-item has-dd">
        <button class="nav-btn" type="button">${g.title} <i data-lucide="chevron-down"></i></button>
        <div class="dd">
          ${g.items.map(t => `
            <a class="dd-link" href="${toolUrl(t.id)}">
              <span class="mi"><i data-lucide="${t.icon}"></i></span>
              <span>${t.name}</span>
            </a>`).join('')}
        </div>
      </div>`;
  };

  const megaCols = ['organize','convert','edit','security','advanced','image'].map(k => {
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
      <button class="nav-btn all-tools" type="button">All Tools <i data-lucide="chevron-down"></i></button>
      <div class="mega"><div class="mega-grid">${megaCols}</div></div>
    </div>
  `;
}

function renderDrawer(){
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  const panel = drawer.querySelector('.drawer-panel');
  if (!panel) return;
  // Build drawer body (skip header close button)
  panel.innerHTML = `
    <button class="drawer-close" id="drawer-close" aria-label="Close menu"><i data-lucide="x"></i></button>
    <a href="/merge-pdf">Merge PDF</a>
    <a href="/split-pdf">Split PDF</a>
    <a href="/#cat-organize">Organize</a>
    <a href="/#cat-convert">Convert</a>
    <a href="/#cat-edit">Edit</a>
    <a href="/#cat-security">Security</a>
    <a href="/#tools-root">All Tools</a>
    <a href="#" class="btn btn-ghost" data-auth="login">Login</a>
    <a href="#" class="btn btn-ghost" data-auth="signin">Sign In</a>
    <a href="#" class="btn btn-primary" data-auth="signup">Sign Up</a>
  `;
}

function wireDrawer(){
  const drawer = document.getElementById('drawer');
  const open  = document.getElementById('hamburger');
  if (!drawer || !open) return;
  const close = document.getElementById('drawer-close');
  const back  = drawer.querySelector('.drawer-back');
  const set = v => drawer.classList.toggle('open', v);
  open.addEventListener('click', () => set(true));
  close && close.addEventListener('click', () => set(false));
  back && back.addEventListener('click', () => set(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
}

/* Auth modal */
function ensureAuthModal(){
  if (document.getElementById('auth-modal')) return;
  const wrap = document.createElement('div');
  wrap.id = 'auth-modal';
  wrap.className = 'auth-modal';
  wrap.innerHTML = `
    <div class="auth-back"></div>
    <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button class="auth-close" type="button" aria-label="Close"><i data-lucide="x"></i></button>
      <div class="auth-tabs">
        <button class="auth-tab" data-tab="login">Login</button>
        <button class="auth-tab" data-tab="signin">Sign In</button>
        <button class="auth-tab" data-tab="signup">Sign Up</button>
      </div>
      <h3 id="auth-title">Welcome back</h3>
      <p class="auth-sub" id="auth-sub">Login to access your saved documents.</p>
      <form class="auth-form" id="auth-form" novalidate>
        <label class="auth-field auth-name" data-only="signup">
          <span>Full name</span>
          <input type="text" name="name" placeholder="Your name" autocomplete="name">
        </label>
        <label class="auth-field">
          <span>Email</span>
          <input type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
        </label>
        <label class="auth-field">
          <span>Password</span>
          <input type="password" name="password" placeholder="••••••••" autocomplete="current-password" required minlength="6">
        </label>
        <button class="auth-submit" type="submit" id="auth-submit">Login</button>
        <div class="auth-msg" id="auth-msg"></div>
      </form>
    </div>`;
  document.body.appendChild(wrap);

  const back  = wrap.querySelector('.auth-back');
  const close = wrap.querySelector('.auth-close');
  back.addEventListener('click', () => closeAuth());
  close.addEventListener('click', () => closeAuth());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuth(); });

  wrap.querySelectorAll('.auth-tab').forEach(t => {
    t.addEventListener('click', () => setAuthTab(t.dataset.tab));
  });

  wrap.querySelector('#auth-form').addEventListener('submit', e => {
    e.preventDefault();
    const tab = wrap.dataset.tab || 'login';
    const msg = wrap.querySelector('#auth-msg');
    msg.className = 'auth-msg success';
    const labels = { login:'Logged in', signin:'Signed in', signup:'Account created' };
    msg.textContent = `${labels[tab]} successfully (demo). Backend integration coming soon.`;
  });
}

function setAuthTab(tab){
  const wrap = document.getElementById('auth-modal');
  wrap.dataset.tab = tab;
  wrap.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const titles = {
    login:  ['Welcome back', 'Login to access your saved documents.', 'Login'],
    signin: ['Sign in to ILovePDF', 'Continue where you left off.', 'Sign In'],
    signup: ['Create your account', 'Get unlimited file size and history.', 'Create account'],
  };
  const [h, s, btn] = titles[tab] || titles.login;
  wrap.querySelector('#auth-title').textContent = h;
  wrap.querySelector('#auth-sub').textContent = s;
  wrap.querySelector('#auth-submit').textContent = btn;
  wrap.querySelector('.auth-name').style.display = (tab === 'signup') ? 'block' : 'none';
  wrap.querySelector('#auth-msg').textContent = '';
  wrap.querySelector('#auth-msg').className = 'auth-msg';
}

function openAuth(tab){
  ensureAuthModal();
  setAuthTab(tab || 'login');
  const wrap = document.getElementById('auth-modal');
  wrap.classList.add('open');
  if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
}
function closeAuth(){
  const wrap = document.getElementById('auth-modal');
  if (wrap) wrap.classList.remove('open');
}

function wireAuth(){
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-auth]');
    if (!t) return;
    e.preventDefault();
    openAuth(t.dataset.auth);
  });
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderDrawer();
  wireDrawer();
  wireAuth();
  const tryIcons = () => window.lucide && window.lucide.createIcons && window.lucide.createIcons();
  tryIcons();
  setTimeout(tryIcons, 150);
  setTimeout(tryIcons, 700);
});
