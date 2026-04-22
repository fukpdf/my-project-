// Mega-menu: builds the horizontal category dropdown nav in the topbar.
function buildMegaMenu() {
  const nav = document.getElementById('mega-nav');
  if (!nav || typeof CATEGORIES === 'undefined') return;

  const grouped = {};
  TOOLS.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  let html = '';
  CATEGORIES.forEach(cat => {
    const tools = grouped[cat.name] || [];
    if (!tools.length) return;
    const items = tools.map(t => `
      <a href="/tool.html?id=${t.id}">
        <i data-lucide="${t.icon}"></i>
        <span>${t.name}</span>
      </a>`).join('');
    html += `
      <div class="mega-nav-item">
        <button class="mega-nav-btn" type="button" aria-haspopup="true">
          <i data-lucide="${cat.icon}" style="color:${cat.color}"></i>
          <span>${cat.name}</span>
          <i data-lucide="chevron-down" class="chev"></i>
        </button>
        <div class="mega-nav-panel">${items}</div>
      </div>`;
  });
  nav.innerHTML = html;
  if (window.lucide) lucide.createIcons();

  // Click-to-toggle for touch / keyboard users
  nav.querySelectorAll('.mega-nav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const panel = btn.nextElementSibling;
      const wasOpen = panel.classList.contains('open');
      nav.querySelectorAll('.mega-nav-panel').forEach(p => p.classList.remove('open'));
      if (!wasOpen) panel.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    nav.querySelectorAll('.mega-nav-panel').forEach(p => p.classList.remove('open'));
  });
}

document.addEventListener('DOMContentLoaded', buildMegaMenu);
