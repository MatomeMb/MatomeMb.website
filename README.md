# Matome Mbowene – Portfolio

> A fast, modern portfolio showcasing software engineering expertise. Built with HTML/CSS/JS, deployed on GitHub Pages, featuring a privacy-first local chatbot.

**[Visit Portfolio](https://www.matomembowene.co.za)** | **[Get in Touch](mailto:matomepontso@gmail.com)**

---

## Overview

This is a **production-grade, single-page portfolio** optimized for:

- **Recruiter focus**: Clear positioning, quantified impact, proof links, fast scannable layout
- **Performance**: Minimal dependencies, < 1s first paint, zero external API calls
- **Privacy**: No analytics tracking, no data collection, no third-party services
- **Maintainability**: Static HTML/CSS/JS (no build step), easy to customize and deploy

### Key Features

- **Dark theme** with professional color palette
- **Responsive design** (desktop, tablet, mobile)
- **Local chatbot** grounded in knowledge base (no APIs)
- **Progressive Web App** (offline support, installable)
- **Case studies** with technical depth
- **SEO optimized** (sitemap, meta tags, Open Graph)
- **Resume page** (HTML + downloadable PDF)
- **100% privacy-respecting** (no tracking, no logging)

---

## Quick Start

### Clone & Preview

```bash
# Clone the repository
git clone https://github.com/MatomeMb/matomembowene.github.io.git
cd matomembowene.github.io

# Option 1: Open directly
open index.html

# Option 2: Run local server (recommended)
python -m http.server 8000
# Visit: http://localhost:8000
```

### Customize for Your Portfolio

1. **Replace with your content:**
   - `index.html` – Hero, experience, skills, projects
   - `resume.html` – Resume/CV page
   - `profile.jpg` – Your profile photo (400x400px recommended)
   - `resume.pdf` – Downloadable resume (optional)

2. **Update chatbot knowledge:**
   - `chatbot/chatbot_knowledge.json` – Chatbot responses and keywords

3. **Update social links:**
   - `index.html` → Footer/Contact section

4. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "Customize portfolio"
   git push origin main
   ```

---

## Project Structure

```
matomembowene.github.io/
├── 📄 index.html                  # Main portfolio page
├── 📄 resume.html                 # Resume page
├── 📄 privacy.html                # Privacy policy
│
├── 📁 chatbot/                    # Local chatbot (no APIs)
│   ├── chatbot.js
│   ├── chatbot.css
│   └── chatbot_knowledge.json     # Knowledge base (edit this)
│
├── 📁 case-studies/               # Detailed project pages
│   ├── ocr-document-automation.html
│   └── rag-assistant.html
│
├── 📁 js/                         # Utilities & helpers
├── 📁 styles/                     # Global CSS
├── 📁 icons/                      # Icon assets
├── 📁 images/                     # Image assets
│
├── 📄 service-worker.js           # PWA service worker
├── 📄 site.webmanifest            # PWA manifest
├── 📄 sitemap.xml                 # SEO sitemap
├── 📄 robots.txt                  # Search engine directives
│
├── 📁 docs/                       # Development documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── CHATBOT.md
│
└── 📄 README.md                   # This file
```

---

## Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Hosting** | GitHub Pages (static) |
| **PWA** | Service Worker, Web Manifest |
| **Chatbot** | Local knowledge base (no AI APIs) |

**No external dependencies** → instant load, zero downtime, maximum privacy.

---

## Features Explained

### Local Chatbot (Privacy-First)

The chatbot runs entirely **in your browser** with:
- **No external API calls** – all processing happens locally
- **No message logging** – conversations aren't stored
- **No tracking** – complete privacy
- **Knowledge-base grounded** – limited to predefined responses

Edit responses in `chatbot/chatbot_knowledge.json`:

```json
{
  "id": "introduction",
  "keywords": ["hello", "hi", "who are you"],
  "response": "Hi! I'm Matome's portfolio assistant..."
}
```

### Progressive Web App (PWA)

- Install on home screen (iOS/Android/desktop)
- Works offline (service worker caching)
- Native app-like experience

### SEO Optimized

- Sitemap: `sitemap.xml`
- Meta tags: Open Graph, Twitter Card
- Robot directives: `robots.txt`
- Semantic HTML structure

### Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Lighthouse Mobile Score | > 90 |
| Total Bundle Size | < 500KB |
| External Requests | 0 |

---

## Deployment

### GitHub Pages (Built-in)

Automatic deployment when you push to `main`:

```bash
# Make your changes
git add .
git commit -m "Update portfolio"
git push origin main

# Site updates in 1-2 minutes at:
# https://github.com/MatomeMb/matomembowene.github.io
```

### Custom Domain

1. Update DNS records (A records + CNAME)
2. Add domain in GitHub Settings → Pages
3. Enable "Enforce HTTPS"

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** – Tech stack, directory structure, design decisions
- **[Deployment](docs/DEPLOYMENT.md)** – GitHub Pages setup, custom domain, troubleshooting
- **[Development](docs/DEVELOPMENT.md)** – Adding content, git workflow, maintenance
- **[Chatbot](docs/CHATBOT.md)** – How the chatbot works, updating knowledge base

---

## Customization Guide

### Change Hero Text
**File:** `index.html` → Hero section
```html
<h1>Your Name</h1>
<p>Your Title & Tagline</p>
```

### Update Social Links
**File:** `index.html` → Footer
```html
<a href="https://linkedin.com/in/yourprofile">LinkedIn</a>
<a href="https://github.com/yourprofile">GitHub</a>
```

### Add New Project Case Study
1. Create `case-studies/my-project.html`
2. Add link in `index.html` Projects section
3. Update chatbot knowledge in `chatbot/chatbot_knowledge.json`
4. Commit and push

### Modify Chatbot Responses
**File:** `chatbot/chatbot_knowledge.json`

```json
{
  "topics": [
    {
      "id": "skills",
      "keywords": ["skills", "technologies", "what can you do"],
      "response": "I specialize in..."
    }
  ]
}
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance & Security

### Performance Highlights
- **Zero build step** – single HTML file with inline CSS/JS
- **Service Worker** – offline support and caching
- **No npm dependencies** – no node_modules bloat
- **GitHub Pages CDN** – global edge distribution

### Security & Privacy
- **HTTPS only** – enforced by GitHub Pages
- **No tracking** – no Google Analytics or pixels
- **No data collection** – chatbot stores no messages
- **No external APIs** – no third-party risk

---

## Local Development

### Running Tests Locally
```bash
python -m http.server 8000
# Visit http://localhost:8000
# Open DevTools (F12) → Lighthouse tab
# Run audit and check scores
```

### Service Worker Testing
Service Worker only works on HTTPS or localhost. Deploy to GitHub Pages to test fully.

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Site not updating | Clear cache (Ctrl+Shift+Delete) and wait 2 min |
| Chatbot not responding | Check `chatbot_knowledge.json` syntax |
| Images not loading | Verify path in `index.html` |
| Links broken | Update relative paths after migration |

---

## Contributing & Future Enhancements

### Ideas for Enhancement
- Image optimization (WebP/AVIF with fallbacks)
- Advanced filtering (projects by technology)
- Blog integration (static markdown)
- Analytics (privacy-respecting alternative)
- Dark/light mode toggle
- Internationalization (i18n)

### Found an Issue?
1. Open an issue on GitHub
2. Or email: [matomepontso@gmail.com](mailto:matomepontso@gmail.com)

---

## License

[MIT License](LICENSE) – feel free to fork, modify, and use as a template for your own portfolio.

---

## Quick Links

- **Portfolio:** https://www.matomembowene.co.za
- **Email:** matomepontso@gmail.com
- **LinkedIn:** https://linkedin.com/in/matomembowene
- **GitHub:** https://github.com/MatomeMb
- **Credly:** https://credly.com/users/matomembowene

---

**Built with ❤️ by Matome Mbowene**  
Last updated: January 2025
