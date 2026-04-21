let currentTool = null;
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const toolId = params.get('id');

  currentTool = TOOLS.find(t => t.id === toolId);
  if (!currentTool) { window.location.href = '/'; return; }

  buildSidebar(currentTool.id);
  renderToolPage(currentTool);
});

// ── RENDER TOOL PAGE ───────────────────────────────────────────────────────

function renderToolPage(tool) {
  const catMeta = CATEGORIES.find(c => c.name === tool.category);
  const color = catMeta ? catMeta.color : '#6366f1';

  document.title = `${tool.name} Online Free — fukpdf.com`;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
  metaDesc.content = `Free online ${tool.name} tool. ${tool.description}. No signup required — fast, secure, and free on fukpdf.com.`;
  let metaKw = document.querySelector('meta[name="keywords"]');
  if (!metaKw) { metaKw = document.createElement('meta'); metaKw.name = 'keywords'; document.head.appendChild(metaKw); }
  metaKw.content = `${tool.name.toLowerCase()}, ${tool.name.toLowerCase()} online, ${tool.name.toLowerCase()} free, fukpdf, pdf tools online`;
  const topbarTitle = document.getElementById('topbar-title');
  if (topbarTitle) topbarTitle.textContent = tool.name;

  const container = document.getElementById('tool-content');
  if (!container) return;

  const bgAlpha = hexToRgba(color, 0.12);
  const statusHtml = tool.working
    ? `<span class="tool-status status-live"><span class="status-dot"></span>Live & Ready</span>`
    : `<span class="tool-status status-soon"><span class="status-dot"></span>Coming Soon</span>`;

  let optionsHtml = '';
  if (tool.options && tool.options.length > 0) {
    const fields = tool.options.map(opt => {
      if (opt.type === 'select') {
        const opts = opt.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
        return `
          <div class="form-group">
            <label class="form-label">${opt.label}</label>
            <select class="form-select" name="${opt.id}" id="opt-${opt.id}">${opts}</select>
          </div>`;
      }
      return `
        <div class="form-group">
          <label class="form-label">${opt.label}</label>
          <input class="form-input" type="${opt.type}" name="${opt.id}" id="opt-${opt.id}"
            placeholder="${opt.placeholder || ''}" ${opt.required ? 'required' : ''}>
        </div>`;
    }).join('');

    optionsHtml = `
      <div class="options-section">
        <div class="options-title"><i data-lucide="sliders-horizontal"></i> Options</div>
        <div class="options-grid">${fields}</div>
      </div>`;
  }

  const fileLabel = tool.multipleFiles ? 'Upload Files' : 'Upload File';
  const multiAttr = tool.multipleFiles ? 'multiple' : '';

  container.innerHTML = `
    <div class="tool-page">
      <div class="tool-header">
        <a href="/" class="back-link"><i data-lucide="arrow-left"></i> All Tools</a>
        <div class="tool-header-top">
          <div class="tool-header-icon" style="background:${bgAlpha}; color:${color}">
            <i data-lucide="${tool.icon}"></i>
          </div>
          <div class="tool-header-info">
            <div class="tool-header-name">${tool.name}</div>
            <div class="tool-header-desc">${tool.description}</div>
            ${statusHtml}
          </div>
        </div>
      </div>

      <div class="upload-section">
        <span class="upload-label"><i data-lucide="upload-cloud" style="display:inline-block;width:13px;height:13px;vertical-align:middle;margin-right:5px;"></i>${fileLabel}</span>
        <div class="upload-area" id="upload-area">
          <input type="file" id="file-input" accept="${tool.acceptedFiles}" ${multiAttr}>
          <div class="upload-icon"><i data-lucide="upload-cloud"></i></div>
          <div class="upload-text">Drag & drop or click to browse</div>
          <div class="upload-hint">Accepted: ${tool.acceptedFiles} ${tool.multipleFiles ? '· Multiple files allowed' : ''}</div>
        </div>
        <div class="upload-files-list" id="files-list"></div>
      </div>

      ${optionsHtml}

      <div class="process-btn-wrap">
        <button class="btn btn-primary btn-lg" id="process-btn" onclick="processFile()">
          <i data-lucide="zap"></i> Process File
        </button>
        <button class="btn btn-outline" id="clear-btn" onclick="clearAll()" style="display:none">
          <i data-lucide="x"></i> Clear
        </button>
      </div>

      <div id="result-area"></div>

      <div class="ad-slot ad-rectangle" aria-label="Advertisement" style="margin-top:24px;">
        <span class="ad-label">Advertisement</span>
      </div>

      ${renderSeoContent(tool)}
    </div>
  `;

  lucide.createIcons();
  setupFileInput();
}

// ── FILE INPUT ─────────────────────────────────────────────────────────────

function setupFileInput() {
  const input = document.getElementById('file-input');
  const area  = document.getElementById('upload-area');
  if (!input || !area) return;

  //area.addEvenetListener('click', () => input.click());
  input.addEventListener('change', () => handleFiles(input.files));
  area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault(); area.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
}

function handleFiles(fileList) {
  if (!fileList || fileList.length === 0) return;
  if (currentTool.multipleFiles) {
    selectedFiles = [...selectedFiles, ...Array.from(fileList)];
  } else {
    selectedFiles = [fileList[0]];
  }
  renderFileList();
}

function renderFileList() {
  const list     = document.getElementById('files-list');
  const clearBtn = document.getElementById('clear-btn');
  if (!list) return;

  if (selectedFiles.length === 0) {
    list.innerHTML = '';
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }
  if (clearBtn) clearBtn.style.display = 'inline-flex';

  list.innerHTML = selectedFiles.map((f, i) => `
    <div class="upload-file-item">
      <i data-lucide="file"></i>
      <span class="upload-file-name">${f.name}</span>
      <span class="upload-file-size">${formatBytes(f.size)}</span>
      <button class="upload-file-remove" onclick="removeFile(${i})" title="Remove">
        <i data-lucide="x"></i>
      </button>
    </div>
  `).join('');
  lucide.createIcons();
}

function removeFile(index) { selectedFiles.splice(index, 1); renderFileList(); }

function clearAll() {
  selectedFiles = [];
  renderFileList();
  document.getElementById('result-area').innerHTML = '';
  const input = document.getElementById('file-input');
  if (input) input.value = '';
}

// ── PROCESS FILE ───────────────────────────────────────────────────────────

async function processFile() {
  if (!currentTool) return;
  if (selectedFiles.length === 0) {
    showStatus('error', 'No file selected', 'Please upload a file before processing.');
    return;
  }
  if (!currentTool.working) {
    showComingSoon(currentTool.name);
    return;
  }

  const formData = new FormData();

  if (currentTool.multipleFiles) {
    const isImgInput = currentTool.group === 'image' ||
                       currentTool.id === 'scan-to-pdf' ||
                       currentTool.id === 'jpg-to-pdf';
    const field = isImgInput ? 'images' : 'pdfs';
    selectedFiles.forEach(f => formData.append(field, f));
  } else {
    const field = currentTool.group === 'image' ? 'image' : 'pdf';
    formData.append(field, selectedFiles[0]);
  }

  currentTool.options.forEach(opt => {
    const el = document.getElementById(`opt-${opt.id}`);
    if (el && el.value.trim() !== '') formData.append(opt.id, el.value.trim());
  });

  showStatus('loading', 'Processing…', 'Please wait while your file is being processed.');
  const processBtn = document.getElementById('process-btn');
  if (processBtn) processBtn.disabled = true;

  try {
    const response = await fetch(currentTool.apiEndpoint, { method: 'POST', body: formData });
    const ct = (response.headers.get('content-type') || '').toLowerCase();

    if (response.status === 501) { showComingSoon(currentTool.name); return; }

    if (!response.ok) {
      const json = await response.json().catch(() => ({ error: 'Unknown error occurred.' }));
      showStatus('error', 'Processing failed', json.error || 'An unexpected error occurred.');
      return;
    }

    // Downloadable binary responses
    const downloadMimes = [
      'application/pdf',
      'application/vnd.',
      'image/jpeg', 'image/png', 'image/webp',
      'application/zip',
    ];
    if (downloadMimes.some(m => ct.includes(m))) {
      const blob = await response.blob();
      const ext  = mimeToExt(ct);
      const filename = `fukpdf-${currentTool.id}${ext}`;
      triggerDownload(blob, filename);
      showStatus('success', 'File ready!',
        `Your ${ext.replace('.', '').toUpperCase()} file is downloading now.`,
        URL.createObjectURL(blob), filename);
      return;
    }

    // JSON response
    const json = await response.json().catch(() => ({}));

    if (json.text)    { showTextResult(json.text, 'Extracted Text');    return; }
    if (json.summary) { showTextResult(json.summary, 'Summary');        return; }
    if (json.report)  { showReport(json.report);                        return; }

    showStatus('success', 'Done!', json.message || 'Processing complete.');
  } catch (err) {
    showStatus('error', 'Connection error', 'Could not connect to the server. Please try again.');
  } finally {
    if (processBtn) processBtn.disabled = false;
  }
}

// ── HELPERS ────────────────────────────────────────────────────────────────

function mimeToExt(ct) {
  if (ct.includes('application/pdf')) return '.pdf';
  if (ct.includes('wordprocessingml') || ct.includes('msword')) return '.docx';
  if (ct.includes('spreadsheetml') || ct.includes('ms-excel')) return '.xlsx';
  if (ct.includes('presentationml') || ct.includes('ms-powerpoint')) return '.pptx';
  if (ct.includes('image/jpeg')) return '.jpg';
  if (ct.includes('image/png'))  return '.png';
  if (ct.includes('image/webp')) return '.webp';
  if (ct.includes('application/zip')) return '.zip';
  return '.bin';
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// ── RESULT DISPLAY ─────────────────────────────────────────────────────────

function showStatus(type, title, message, downloadUrl, filename) {
  const area = document.getElementById('result-area');
  if (!area) return;

  const icons   = { loading: `<div class="spinner"></div>`, success: `<i data-lucide="check-circle-2"></i>`, error: `<i data-lucide="alert-circle"></i>` };
  const classes = { loading: 'status-loading', success: 'status-success', error: 'status-error' };

  const downloadBtn = (downloadUrl && filename)
    ? `<div class="download-btn-wrap"><a href="${downloadUrl}" download="${filename}" class="btn btn-primary"><i data-lucide="download"></i> Download Again</a></div>`
    : '';

  area.innerHTML = `
    <div class="status-card ${classes[type]}">
      ${icons[type]}
      <div>
        <div class="status-card-title">${title}</div>
        <div class="status-card-msg">${message}</div>
        ${downloadBtn}
      </div>
    </div>`;
  lucide.createIcons();
}

function showTextResult(text, label = 'Result') {
  const area = document.getElementById('result-area');
  if (!area) return;

  area.innerHTML = `
    <div class="text-result-card">
      <div class="text-result-header">
        <span class="text-result-label"><i data-lucide="file-text"></i> ${label}</span>
        <button class="btn btn-outline btn-sm" onclick="copyTextResult(this)">
          <i data-lucide="copy"></i> Copy
        </button>
      </div>
      <textarea class="text-result-area" readonly>${escapeHtml(text)}</textarea>
    </div>`;
  lucide.createIcons();
}

function showReport(report) {
  const area = document.getElementById('result-area');
  if (!area) return;

  const rows = Object.entries(report).map(([k, v]) => `
    <div class="report-row">
      <span class="report-key">${k}</span>
      <span class="report-val">${v}</span>
    </div>`).join('');

  area.innerHTML = `
    <div class="text-result-card">
      <div class="text-result-header">
        <span class="text-result-label"><i data-lucide="bar-chart-2"></i> Comparison Report</span>
      </div>
      <div class="report-table">${rows}</div>
    </div>`;
  lucide.createIcons();
}

function copyTextResult(btn) {
  const ta = btn.closest('.text-result-card')?.querySelector('textarea');
  if (!ta) return;
  navigator.clipboard.writeText(ta.value).then(() => {
    btn.innerHTML = '<i data-lucide="check"></i> Copied!';
    lucide.createIcons();
    setTimeout(() => { btn.innerHTML = '<i data-lucide="copy"></i> Copy'; lucide.createIcons(); }, 2000);
  });
}

// ── MODAL ──────────────────────────────────────────────────────────────────

function showComingSoon(toolName) {
  const modal = document.getElementById('coming-soon-modal');
  const label = document.getElementById('modal-tool-name');
  if (!modal) return;
  if (label) label.textContent = toolName || 'This feature';
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeComingSoonModal() {
  const modal = document.getElementById('coming-soon-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ── UTILITIES ──────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function renderSeoContent(tool) {
  const catDesc = {
    'Organize PDFs':       'organize, rearrange, and manage PDF documents',
    'Compress & Optimize': 'compress and reduce PDF file size without losing quality',
    'Convert from PDF':    'convert PDF files to other popular formats',
    'Convert to PDF':      'convert documents and images into PDF format',
    'Edit & Annotate':     'edit, annotate, and modify your PDF files',
    'Security':            'protect and secure your PDF documents',
    'Advanced Tools':      'perform advanced AI-powered PDF operations',
    'Image Tools':         'edit, transform, and enhance images',
  };
  const kw = catDesc[tool.category] || 'work with PDF and document files';
  const isImage = tool.group === 'image';
  const fileType = isImage ? 'image' : 'PDF';

  return `
    <div class="seo-content">
      <h2>${tool.name} Online — Free, Fast &amp; Secure</h2>
      <p>
        <strong>fukpdf.com's ${tool.name}</strong> lets you ${tool.description.charAt(0).toLowerCase() + tool.description.slice(1)} — entirely for free, directly in your browser.
        There is no software to download, no account to create, and no hidden fees. Just upload your ${fileType} file, configure the settings if needed, and click Process File.
        Your result will be ready within seconds and will download automatically.
      </p>
      <p>
        We designed this tool to be as easy as possible: drag and drop your file onto the upload area, or click to browse.
        Files up to 10 MB are supported. Once processing is complete, the file is deleted from our servers automatically — usually within 8 seconds.
        We never store, read, share, or sell your files or their contents.
      </p>
      <h3>How to Use ${tool.name} on fukpdf.com</h3>
      <ol class="seo-steps">
        <li><strong>Upload your file</strong> — drag &amp; drop or click the upload area to select your ${fileType}.</li>
        <li><strong>Set options</strong> — configure any tool-specific settings shown on this page.</li>
        <li><strong>Process</strong> — click the "Process File" button and wait a few seconds.</li>
        <li><strong>Download</strong> — your result file (named <code>fukpdf-${tool.id}.${isImage ? 'png' : 'pdf'}</code>) downloads automatically.</li>
      </ol>
      <h3>Why Choose fukpdf.com?</h3>
      <p>
        fukpdf.com was built for people who need to ${kw} without installing software or paying for a subscription.
        With ${TOOLS.length} tools covering everything from merging PDFs and compressing files to AI-powered summarization and background removal,
        it's the only PDF toolkit you'll ever need. All tools are browser-based, work on any device (Windows, Mac, Linux, iOS, Android),
        and are completely free to use — no limits on the number of files you process.
      </p>
      <p>
        Popular searches that bring users to this tool: <em>${tool.name.toLowerCase()} online free</em>,
        <em>${tool.name.toLowerCase()} without software</em>, <em>free ${tool.name.toLowerCase()} tool</em>,
        and <em>best ${tool.name.toLowerCase()} 2024</em>.
        Powered by <strong>fukpdf.com</strong>.
      </p>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
document.addEventListener('DOMContentLoded' , () => { const btn = document.querySelector('.navbar-toggler') || document.querySelector('.menu-icon') || document.querySelector('header button'); const sb = document.querySelector('.sidebar'); if(btn && sb) {btn.oneclick = (e) => { e.preventDefault(); sb.classlist.toggle('active'); }; } });
function toggleSidebar(){document.querySelector(".sidebar").classList.toggle("active")}
