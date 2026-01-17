# Matome Mbowene Portfolio

Single-page, GitHub Pages-friendly portfolio for Matome Mbowene, **Software & AI Engineer**.

**Live Site:** `https://www.matomembowene.co.za`

Single-page, fast-loading portfolio built as a static `index.html` (no build step) with a **local, knowledge-base grounded chatbot** (no external APIs).

---

## Overview

This repo is a lightweight GitHub Pages portfolio optimized for:

- **Recruiter clarity**: strong positioning, quantified impact, scannable experience
- **Performance**: minimal dependencies, fast first paint
- **Maintainability**: simple structure, easy to edit

### Site Sections (recruiter-first)
- **Hero**: positioning, proof links (GitHub/LinkedIn/Credly), low-friction CTAs, impact stats
- **Experience**: sanitized, NDA-safe summaries
- **Skills**: grouped strengths
- **Technical breadth**: scannable domain coverage (AI/ML, backend/web, embedded, systems)
- **Projects**: filterable project cards + a high-level timeline (Outcome, Approach, Reliability, Stack)
- **Certifications**: public proof links (Credly) + programs
- **About**: neutral, public-safe bio + approved education wording
- **Contact**: email/LinkedIn + a form that opens a prefilled email (GitHub Pages-friendly)
- **Offline assistant**: keyword-based helper that runs locally in-browser (no API calls)
- **Chatbot**: site-native assistant grounded in a local knowledge base (no external APIs)

---

## Files
- `index.html`: website (HTML + inline CSS/JS)
- `profile.jpg`: profile photo
- `favicon.svg`: vector favicon
- `chatbot/chatbot_knowledge.json`: public-safe knowledge base (source of truth for chatbot answers)
- `chatbot/chatbot.js`: chatbot widget logic (local, no logging)
- `chatbot/chatbot.css`: chatbot widget styles
- `vendor/portfolio-website/`: imported reference repo (not deployed by GitHub Pages)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/MatomeMb/matomemb.github.io.git
cd matomemb.github.io
```

### 2. Local Preview
```bash
# Option A (simple): open the file directly
xdg-open index.html

# Option B (recommended): run a local server
python -m http.server 8000
```

Then visit `http://localhost:8000`.

### 3. Customize Files
Replace these files with your own:
- **`profile.jpg`**: Your profile photo (recommended: 400x400px, .jpg or .png)
You can optionally add a resume link on the site, but avoid committing private documents containing sensitive personal/academic details.

### 4. Contact Form
By default, the contact form opens a prefilled email (works on GitHub Pages without a backend).

If you want true form submissions, wire it to a provider like Formspree and remove the `mailto:` behavior in `index.html`.

### 5. Deploy to GitHub Pages

```bash
git add .
git commit -m "Final polished portfolio"
git push
```

Your site will be live at `https://<your-username>.github.io`

---

## Technologies Used
- HTML5
- CSS (inline)
- Vanilla JavaScript (inline)

## Chatbot Notes (privacy + safety)
- **Grounded**: answers only from `chatbot/chatbot_knowledge.json`
- **No logging by default**: no analytics/telemetry and no storage of messages
- **Safety boundaries**: refuses sensitive academic/legal/medical topics and NDA-probing

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## License

MIT License. Feel free to fork, modify, and use as a template for your own portfolio.

---

## Support & Contributions

Found a bug or have a suggestion? Open an issue on GitHub or reach out directly:

**Email:** `matomepontso@gmail.com`  
**LinkedIn:** `https://linkedin.com/in/matomembowene`  
**GitHub:** `https://github.com/MatomeMb`  

---

Built by Matome Mbowene
