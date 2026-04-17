# PDF Tools Pro

A full-stack SaaS PDF + Image processing platform with 33 professional tools.

## Architecture

```
/
├── server.js                    — Express 5 entry point (port 5000)
├── utils/cleanup.js             — File cleanup + shared response helpers
├── controllers/
│   ├── pdfController.js         — PDF controller (merge handler + pattern for future tools)
│   └── imageController.js       — Image tool handler stubs (4 tools)
├── routes/
│   ├── organize.js              — Merge, Split, Rotate, Crop, Organize
│   ├── edit.js                  — Compress, Edit, Watermark, Sign, Page Numbers, Redact
│   ├── convert.js               — JPG↔PDF, Scan to PDF + conversion placeholders
│   ├── security.js              — Protect / Unlock (placeholders)
│   ├── advanced.js              — Repair, OCR, Compare, AI, Translate, Workflow (placeholders)
│   └── image.js                 — Background Remover, Crop, Resize, Filters (placeholders)
├── public/
│   ├── index.html               — Dashboard with all 33 tool cards + Coming Soon modal
│   ├── tool.html                — Shared tool page (URL param: ?id=toolId)
│   ├── css/styles.css           — Full design system (dark sidebar, indigo accents, modal)
│   └── js/
│       ├── tools-config.js      — All 33 tool definitions with group/badge metadata
│       ├── sidebar.js           — Sidebar with filter nav (All/PDF/Image/Coming Soon)
│       ├── dashboard.js         — Card rendering, filter support, coming-soon modal
│       └── tool-page.js         — Tool page rendering + file upload + API calls + modal
└── uploads/                     — Temp file storage (auto-created, auto-cleaned)
```

## Tech Stack

- **Backend**: Node.js + Express 5 (ES Modules)
- **File uploads**: multer
- **PDF processing**: pdf-lib
- **Frontend**: Pure HTML/CSS/JS (no frameworks), Lucide icons, Inter font

## Tool Groups & Badges

| Badge | Tools |
|-------|-------|
| PDF | All standard PDF tools |
| Image | Background Remover, Crop, Resize, Filters |
| AI | OCR, AI Summarizer, Translate, Background Remover |
| Utility | Repair, Compare, Workflow Builder |

## Sidebar Filters

- **All Tools** — shows all 33 tools
- **PDF Tools** — shows only PDF category tools
- **Image Tools** — shows only the 4 image tools
- **Coming Soon** — shows all non-working tools

## Tools Status

### Fully Implemented (pdf-lib)
1. Merge PDF, 2. Split PDF, 3. Rotate PDF, 4. Crop PDF, 5. Organize PDF
6. Compress PDF, 7. Edit PDF, 8. Watermark PDF, 9. Sign PDF, 10. Add Page Numbers
11. Redact PDF, 12. JPG/PNG to PDF, 13. Scan to PDF

### Coming Soon (placeholder routes returning 501)
14–29: PDF conversions, Protect/Unlock, Repair, OCR, Compare, AI Summarizer, Translate, Workflow Builder
30–33: Background Remover, Crop Image, Image Resize, Image Filters

## Running

```bash
node server.js
```

Server runs on port 5000.
