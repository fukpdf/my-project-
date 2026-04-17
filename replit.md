# PDF Tools Pro

A full-stack SaaS PDF processing platform with 29 professional tools.

## Architecture

```
/
├── server.js              — Express entry point (port 5000)
├── utils/cleanup.js       — File cleanup + shared response helpers
├── routes/
│   ├── organize.js        — Merge, Split, Rotate, Crop, Organize
│   ├── edit.js            — Compress, Edit, Watermark, Sign, Page Numbers, Redact
│   ├── convert.js         — JPG↔PDF, Scan to PDF, all conversion placeholders
│   ├── security.js        — Protect / Unlock (placeholders)
│   └── advanced.js        — Repair, OCR, Compare, AI, Translate, Workflow (placeholders)
├── public/
│   ├── index.html         — Dashboard with all 29 tool cards
│   ├── tool.html          — Shared tool page (URL param: ?id=toolId)
│   ├── css/styles.css     — Full design system (dark sidebar, indigo accents)
│   └── js/
│       ├── tools-config.js  — All 29 tool definitions (single source of truth)
│       ├── sidebar.js       — Sidebar component generator
│       ├── dashboard.js     — Homepage card rendering + search
│       └── tool-page.js     — Tool page rendering + file upload + API calls
└── uploads/               — Temp file storage (auto-created, auto-cleaned)
```

## Tech Stack

- **Backend**: Node.js + Express 5 (ES Modules)
- **File uploads**: multer
- **PDF processing**: pdf-lib
- **Frontend**: Pure HTML/CSS/JS (no frameworks), Lucide icons, Inter font

## Tools Status

### Fully Implemented (pdf-lib)
1. Merge PDF — combine multiple PDFs
2. Split PDF — extract page ranges
3. Rotate PDF — rotate pages
4. Crop PDF — trim margins
5. Organize PDF — reorder pages
6. Compress PDF — optimize file size
7. Edit PDF — add text overlay
8. Watermark PDF — diagonal/positioned watermark
9. Sign PDF — text signature with underline
10. Add Page Numbers — 6 position options
11. Redact PDF — black rectangle overlay
12. JPG/PNG to PDF — embed images
13. Scan to PDF — same as JPG to PDF

### Placeholder (501 response, ready for implementation)
14–29: PDF to Word/PPT/Excel/JPG, Word/PPT/Excel to PDF, HTML to PDF, Protect, Unlock, Repair, OCR, Compare, AI Summarizer, Translate, Workflow Builder

## Running

```bash
node server.js
```

Server runs on port 5000.
