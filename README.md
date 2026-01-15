# Matome Mbowene Portfolio

Single-page, GitHub Pages-friendly portfolio for Matome Mbowene - **Software & AI Engineer**.

**Live Site:** `https://matomemb.github.io`

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

---

## Firebase Hosting (deploy this site to your own domain)

This repo is ready to deploy to Firebase Hosting using the root `firebase.json`.

### 1. Install Firebase CLI
```bash
npm i -g firebase-tools
```

### 2. Login and select the project
```bash
firebase login
firebase use matome-portfolio
```

### 3. Deploy
```bash
firebase deploy --only hosting
```

### GitHub Actions auto-deploy (recommended)
This repo also includes a GitHub Action that can deploy to Firebase Hosting on every push.

1) In Google Cloud Console, create a **service account key** for Firebase Hosting deploys (JSON).
2) In GitHub repo settings → Secrets and variables → Actions → New repository secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT_MATOME_PORTFOLIO`
   - Value: paste the full JSON key contents
3) Push to `main` (or to `cursor/website-long-dashes-3500`) to deploy.

### Notes
- If `resume.pdf` is missing, the Resume page will still load, but the PDF download link won’t work until `resume.pdf` exists in the repo root.
- On Blaze (pay-as-you-go), set a Billing budget + alerts to avoid unexpected charges.

### 3. Customize Files
Replace these files with your own:
- **`profile.jpg`** - Your profile photo (recommended: 400x400px, .jpg or .png)
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

MIT License - Feel free to fork, modify, and use as a template for your own portfolio.

---

## Support & Contributions

Found a bug or have a suggestion? Open an issue on GitHub or reach out directly:

**Email:** `matomepontso@gmail.com`  
**LinkedIn:** `https://linkedin.com/in/matomembowene`  
**GitHub:** `https://github.com/MatomeMb`  

---

Built by Matome Mbowene
