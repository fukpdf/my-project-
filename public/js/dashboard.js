document.addEventListener('DOMContentLoaded', () => {
  buildSidebar(null);
  renderDashboard(TOOLS);

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const filtered = q ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      ) : TOOLS;
      renderDashboard(filtered, q);
    });
  }
});

function renderDashboard(tools, query) {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  if (tools.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <i data-lucide="search-x"></i>
        <div class="empty-state-title">No tools found</div>
        <p>Try a different search term</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const grouped = {};
  tools.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  const catOrder = CATEGORIES.map(c => c.name).filter(n => grouped[n]);
  let html = '';

  catOrder.forEach(catName => {
    const catTools = grouped[catName];
    const catMeta = CATEGORIES.find(c => c.name === catName);
    const color = catMeta ? catMeta.color : '#6366f1';

    html += `
      <div class="section-header">
        <div class="section-dot" style="background:${color}"></div>
        <span class="section-title">${catName}</span>
        <span class="section-count">${catTools.length} tool${catTools.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="tools-grid">
    `;

    catTools.forEach(tool => {
      const bgAlpha = hexToRgba(color, 0.12);
      const statusBadge = tool.working
        ? `<span class="card-badge badge-live">Live</span>`
        : `<span class="card-badge badge-soon-card">Coming Soon</span>`;
      html += `
        <a href="tool.html?id=${tool.id}" class="tool-card" title="${tool.description}">
          <div class="tool-card-icon" style="background:${bgAlpha}; color:${color}">
            <i data-lucide="${tool.icon}"></i>
          </div>
          <div>
            <div class="tool-card-name">${tool.name}</div>
            <div class="tool-card-desc">${tool.description}</div>
          </div>
          <div class="tool-card-footer">
            ${statusBadge}
            <span class="tool-card-arrow"><i data-lucide="arrow-right"></i></span>
          </div>
        </a>
      `;
    });

    html += `</div>`;
  });

  content.innerHTML = html;
  lucide.createIcons();
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
