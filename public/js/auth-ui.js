// Shared auth UI: injects an auth modal + a profile dropdown across all pages,
// swaps the v2-auth Log In/Sign Up buttons with the profile chip when logged in.
(function () {
  const MODAL_ID = 'global-auth-modal';
  let currentUser = null;
  let mode = 'signup';

  // ── Modal HTML (injected once) ─────────────────────────────────────────
  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;
    const div = document.createElement('div');
    div.id = MODAL_ID;
    div.className = 'auth-modal hidden';
    div.innerHTML = `
      <div class="auth-modal-card">
        <button class="auth-x" type="button" aria-label="Close">&times;</button>
        <h3 class="auth-title">Sign Up</h3>
        <p class="auth-sub">Create a free account for higher daily limits and 2 GB cloud storage.</p>
        <form class="auth-form" autocomplete="on">
          <label class="auth-row" data-field="name">
            <span>Name</span>
            <input name="name" type="text" autocomplete="name">
          </label>
          <label class="auth-row">
            <span>Email</span>
            <input name="email" type="email" autocomplete="email" required>
          </label>
          <label class="auth-row">
            <span>Password</span>
            <input name="password" type="password" autocomplete="new-password" required minlength="6">
          </label>
          <div class="auth-err hidden"></div>
          <button class="auth-submit" type="submit">Create Account</button>
        </form>
        <p class="auth-toggle-line">
          <span class="auth-toggle-text">Already have an account?</span>
          <button class="auth-toggle" type="button">Log in</button>
        </p>
      </div>`;
    document.body.appendChild(div);

    div.addEventListener('click', e => { if (e.target === div) close(); });
    div.querySelector('.auth-x').addEventListener('click', close);
    div.querySelector('.auth-toggle').addEventListener('click', () => open(mode === 'signup' ? 'login' : 'signup'));
    div.querySelector('.auth-form').addEventListener('submit', submit);
  }

  function open(m) {
    injectModal();
    mode = m || 'signup';
    const card = document.getElementById(MODAL_ID);
    card.classList.remove('hidden');
    card.querySelector('.auth-title').textContent = mode === 'signup' ? 'Sign Up' : 'Log In';
    card.querySelector('.auth-sub').textContent = mode === 'signup'
      ? 'Create a free account for higher daily limits and 2 GB cloud storage.'
      : 'Welcome back. Sign in to your ILovePDF account.';
    card.querySelector('.auth-submit').textContent = mode === 'signup' ? 'Create Account' : 'Log In';
    card.querySelector('.auth-toggle-text').textContent = mode === 'signup' ? 'Already have an account?' : 'Need an account?';
    card.querySelector('.auth-toggle').textContent = mode === 'signup' ? 'Log in' : 'Sign up';
    card.querySelector('[data-field="name"]').classList.toggle('hidden', mode !== 'signup');
    card.querySelector('.auth-err').classList.add('hidden');
  }
  function close() { document.getElementById(MODAL_ID)?.classList.add('hidden'); }

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      email: fd.get('email')?.trim(),
      password: fd.get('password'),
    };
    if (mode === 'signup') body.name = fd.get('name')?.trim() || body.email.split('@')[0];
    const errBox = e.target.querySelector('.auth-err');
    errBox.classList.add('hidden');
    const url = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Something went wrong');
      currentUser = j.user;
      close();
      renderProfile();
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove('hidden');
    }
  }

  // ── Profile chip / dropdown ────────────────────────────────────────────
  function renderProfile() {
    const auth = document.querySelector('.v2-auth');
    if (!auth) return;
    if (!currentUser) {
      auth.innerHTML = `
        <button class="btn-login" type="button">Log In</button>
        <button class="btn-signup" type="button">Sign Up</button>`;
      auth.querySelector('.btn-login').addEventListener('click', () => open('login'));
      auth.querySelector('.btn-signup').addEventListener('click', () => open('signup'));
      return;
    }
    const u = currentUser;
    const seed = encodeURIComponent(u.name || u.email);
    const initials = (u.name || u.email).split(/\s+/).map(s => s[0]).slice(0,2).join('').toUpperCase();
    auth.innerHTML = `
      <div class="profile-chip">
        <button class="profile-btn" type="button" aria-haspopup="true" aria-expanded="false">
          <span class="profile-avatar" style="background-image:url('https://api.dicebear.com/7.x/initials/svg?seed=${seed}')">${initials}</span>
          <span class="profile-name">${u.name || u.email.split('@')[0]}</span>
          <svg class="profile-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="profile-menu hidden" role="menu">
          <div class="pm-head">
            <div class="pm-name">${u.name || ''}</div>
            <div class="pm-email">${u.email}
              <span class="pm-verify ${u.email_verified ? 'is-ok' : 'is-pending'}">
                ${u.email_verified ? '✓ Verified' : '⚠ Unverified'}
              </span>
            </div>
          </div>
          <a class="pm-item" href="/n2w.html#profile" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </a>
          <a class="pm-item" href="#" data-act="resend" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ${u.email_verified ? 'Email verified' : 'Verify email'}
          </a>
          <a class="pm-item pm-danger" href="#" data-act="logout" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </a>
        </div>
      </div>`;
    const wrap  = auth.querySelector('.profile-chip');
    const btn   = wrap.querySelector('.profile-btn');
    const menu  = wrap.querySelector('.profile-menu');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click', () => menu.classList.add('hidden'));
    menu.addEventListener('click', async e => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      e.preventDefault();
      if (a.dataset.act === 'logout') {
        await fetch('/api/auth/logout', { method:'POST', credentials:'include' });
        currentUser = null;
        renderProfile();
      } else if (a.dataset.act === 'resend') {
        alert(currentUser?.email_verified
          ? 'Your email is already verified.'
          : 'Verification email sent — please check your inbox.');
      }
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  async function init() {
    injectModal();
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) currentUser = (await res.json()).user;
    } catch {}
    renderProfile();
    // Auto-open if URL hash asks for it
    const m = /auth=(login|signup)/.exec(location.hash);
    if (m && !currentUser) open(m[1]);
  }
  // Wait until mega-menu has injected the v2-auth container
  function waitAndInit() {
    if (document.querySelector('.v2-auth')) init();
    else setTimeout(waitAndInit, 50);
  }
  document.addEventListener('DOMContentLoaded', waitAndInit);

  // Public API
  window.AuthUI = { open, close, current: () => currentUser };
})();
