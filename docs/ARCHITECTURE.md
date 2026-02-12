# Architecture & Technical Design

## Current Stack

**Frontend:**
- HTML5 (single-page, no build step)
- CSS3 (inline + external stylesheets)
- Vanilla JavaScript (no frameworks)
- Service Worker (PWA support)

**Backend:**
- GitHub Pages (static hosting)
- No external APIs or backend servers

**Key Features:**
- Local, knowledge-base grounded chatbot (no external APIs)
- Progressive Web App (offline support)
- SEO optimized (sitemap, robots.txt, Open Graph)

## Directory Structure

```
├── index.html                    # Main portfolio page
├── resume.html                   # Downloadable resume
├── privacy.html                  # Privacy policy
│
├── chatbot/                      # Local chatbot (no APIs)
│   ├── chatbot.js               # Chatbot logic
│   ├── chatbot.css              # Chatbot styles
│   └── chatbot_knowledge.json   # Knowledge base (source of truth)
│
├── case-studies/                # Detailed project case studies
│   ├── ocr-document-automation.html
│   └── rag-assistant.html
│
├── js/                          # JavaScript utilities
├── styles/                      # Global stylesheets
├── icons/                       # Icon assets
├── images/                      # Image assets
│
├── service-worker.js            # PWA service worker
├── site.webmanifest             # PWA manifest
├── sitemap.xml                  # SEO sitemap
├── robots.txt                   # Search engine directives
│
└── docs/                        # Documentation (development only)
```

## Deployment

**Host:** GitHub Pages  
**Domain:** https://www.matomembowene.co.za (custom DNS)  
**Branch:** `main` (automatically deployed on push)

## Performance Notes

- **First Paint:** < 1s (minimal CSS, inlined critical paths)
- **Service Worker:** Caches assets for offline use
- **Chatbot:** Runs entirely in-browser (no network calls needed)
- **Zero external dependencies:** No CDN calls or external libraries

## Privacy & Security

- **No analytics tracking** (no Google Analytics, etc.)
- **No user data collection** (chatbot stores no messages)
- **No external API calls** from portfolio pages
- **HTTPS only** (GitHub Pages enforces TLS)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Image optimization (WebP/AVIF with fallbacks)
- Advanced analytics (privacy-respecting)
- Dynamic case study filtering
- API integration (optional, for future expansion)
