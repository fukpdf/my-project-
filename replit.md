# fukpdf.com — Free Online PDF & Image Tools

A production-ready SaaS PDF + Image processing platform with 33 tools, branded as fukpdf.com.

## Architecture

```
/
├── server.js                    — Express entry (port 5000, rate limiting, security headers)
├── utils/cleanup.js             — File cleanup + shared response helpers
├── controllers/
│   ├── pdfController.js         — PDF controller
│   └── imageController.js       — Image tool handlers (fukpdf-* filenames)
├── routes/
│   ├── organize.js              — Merge, Split, Rotate, Crop, Organize (10MB limit)
│   ├── edit.js                  — Compress, Edit, Watermark, Sign, Page Numbers, Redact
│   ├── convert.js               — JPG↔PDF, Scan, PDF↔Word/PPT/Excel/HTML
│   ├── security.js              — Protect / Unlock PDF
│   ├── advanced.js              — Repair, OCR, Compare, AI Summarizer, Translate, Workflow
│   └── image.js                 — Background Remover, Crop, Resize, Filters
├── public/
│   ├── index.html               — Dashboard: fukpdf.com branding, SEO, schema, cookie consent, ads, footer
│   ├── tool.html                — Tool page: per-tool meta, SEO content, ads, footer, cookie consent
│   ├── blog.html                — Blog index (3 articles)
│   ├── privacy.html             — Privacy Policy
│   ├── terms.html               — Terms & Conditions
│   ├── disclaimer.html          — Disclaimer
│   ├── robots.txt               — SEO: allow all, disallow /uploads/ and /api/
│   ├── sitemap.xml              — All 33 tool URLs + legal + blog pages
│   ├── blog/
│   │   ├── merge-pdf-guide.html       — 1200+ word guide: How to Merge PDF Online
│   │   ├── compress-pdf-guide.html    — 1200+ word guide: Compress PDF Without Quality Loss
│   │   └── best-pdf-tools.html        — 1400+ word review: Best Free PDF Tools 2024
│   ├── css/styles.css           — Full design system + footer, cookie, ad, SEO, blog, legal styles
│   └── js/
│       ├── tools-config.js      — All 33 tool definitions
│       ├── sidebar.js           — Sidebar: fukpdf.com logo, filter nav
│       ├── dashboard.js         — Card rendering, filter support, coming-soon modal
│       └── tool-page.js         — Tool page: per-tool meta injection, renderSeoContent(), fukpdf- downloads
└── uploads/                     — Temp file storage (auto-created, auto-cleaned)
```

## Tech Stack

- **Backend**: Node.js + Express 5 (ES Modules)
- **File uploads**: multer (10 MB limit on all routes)
- **Rate limiting**: express-rate-limit (80 req / 15 min per IP on /api)
- **Security headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **PDF processing**: pdf-lib, mammoth, pptx, xlsx, JSZip
- **Image processing**: sharp
- **Frontend**: Pure HTML/CSS/JS (no frameworks), Lucide icons, Inter font

## Branding

- Brand name: **fukpdf.com**
- All download filenames: `fukpdf-[tool-id].[ext]` (e.g., fukpdf-merge.pdf, fukpdf-compress.pdf)
- Sidebar logo: "fukpdf.com / 33 Free PDF & Image Tools"

## SEO Features

- Per-tool dynamic meta (title, description, keywords) via tool-page.js
- 500–700 word SEO content block on every tool page
- Schema.org JSON-LD: WebSite + SoftwareApplication on homepage
- Schema.org Article on all blog posts
- sitemap.xml covering all 33 tool pages + legal + blog
- robots.txt with sitemap reference

## Legal Pages

- `/privacy.html` — Full Privacy Policy (10 sections)
- `/terms.html` — Full Terms & Conditions (12 sections)
- `/disclaimer.html` — Full Disclaimer (8 sections)

## Blog

- `/blog.html` — Index with 3 article cards
- `/blog/merge-pdf-guide.html` — How to Merge PDF Files Online (1200+ words)
- `/blog/compress-pdf-guide.html` — How to Compress PDF Without Losing Quality (1300+ words)
- `/blog/best-pdf-tools.html` — Best Free Online PDF Tools in 2024 (1500+ words)

## Cookie Consent

- Banner on every page using `localStorage.fukpdf_cookies` flag
- Dismiss persists across sessions
- Links to Privacy Policy

## AdSense Placeholders

- Leaderboard slot: below topbar on index.html and tool.html
- Rectangle slot: above SEO content on tool pages

## Running

```bash
node server.js
```

Server runs on port 5000.
