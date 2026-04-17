function buildSidebar(activeToolId) {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const grouped = {};
  TOOLS.forEach(tool => {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  });

  const catOrder = CATEGORIES.map(c => c.name);

  let html = `
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
          <line x1="9" y1="11" x2="15" y2="11"/>
        </svg>
      </div>
      <div class="sidebar-logo-text">
        PDF Tools Pro
        <span>29 Professional Tools</span>
      </div>
    </div>
    <nav class="sidebar-nav">
  `;

  catOrder.forEach(catName => {
    const tools = grouped[catName] || [];
    const catMeta = CATEGORIES.find(c => c.name === catName);
    html += `<div class="sidebar-category">${catName}</div>`;
    tools.forEach(tool => {
      const isActive = tool.id === activeToolId ? ' active' : '';
      const badge = tool.working ? '' : `<span class="sidebar-item-badge badge-soon">Soon</span>`;
      const href = tool.id === '__home' ? '/' : `tool.html?id=${tool.id}`;
      html += `
        <a href="${href}" class="sidebar-item${isActive}" data-tool-id="${tool.id}">
          <i data-lucide="${tool.icon}"></i>
          <span>${tool.name}</span>
          ${badge}
        </a>
      `;
    });
  });

  html += `</nav>`;
  container.innerHTML = html;

  if (window.lucide) lucide.createIcons();

  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar-container');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('hidden');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.add('hidden');
    });
  }
}
