# Deployment & CI/CD Pipeline

This document describes the deployment workflows, custom domains, and automated resume PDF compilation setups.

---

## 1. Local Build-to-Root Cycle

Before committing new updates to production, you compile the static website outputs to the repository root directory.

### Build Workflow:
1. Navigate to the React source folder:
   ```bash
   cd src-app
   ```
2. Compile and overwrite the root assets:
   ```bash
   npm run build
   ```
   *This triggers `clean-root-assets.js` which safely wipes the old `assets/` folder in the root, and compiles fresh hashed CSS/JS bundles via Vite.*
3. Verify changes locally:
   ```bash
   python3 -m http.server 8000
   ```
   *Visit `http://localhost:8000` to review the compiled site.*

---

## 2. GitHub Pages Continuous Delivery

When changes are pushed to the `main` branch, GitHub Pages serves the updated root static files immediately.

```bash
# From the repository root directory:
git add .
git commit -m "feat: compile and deploy upgraded dashboard"
git push origin main
```
The update propagates across edge nodes of your custom domain `www.matomembowene.co.za` within 60–120 seconds.

---

## 3. Automated Resume PDF Builder

We use an automated **GitHub Actions Workflow** to keep the downloadable `resume.pdf` perfectly in sync with `resume.html`.

### Workflow File: `.github/workflows/generate-resume-pdf.yml`
- **Triggers**: On push to `main` branch when `resume.html` is modified.
- **Process**:
  1. Spins up an Ubuntu runner.
  2. Installs `puppeteer`.
  3. Launches a headless Chromium browser.
  4. Loads `resume.html` locally via `file://`.
  5. Compiles a pixel-perfect, A4 formatted print sheet.
  6. Saves it to `resume.pdf`.
  7. Commits and pushes the compiled PDF back to your repository automatically.

---

## 4. Custom Domain DNS Setup

The custom domain is configured using standard DNS mappings:

- **CNAME File**: Contains `www.matomembowene.co.za` to route GitHub Page servers.
- **Enforced HTTPS**: SSL certifications are managed and automatically renewed via Let's Encrypt directly on GitHub Pages settings.
