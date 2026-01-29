# Deployment Guide

## Prerequisites

- Git installed
- GitHub account
- Custom domain (optional)

## Local Development

### Preview Locally
```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended)
python -m http.server 8000
# Visit: http://localhost:8000
```

### Testing Service Worker
Service Worker only activates over HTTPS or localhost.

```bash
# Production test with HTTPS
# Push to GitHub and visit your GitHub Pages URL
```

## Deploying to GitHub Pages

### Initial Setup
```bash
# 1. Clone repository
git clone https://github.com/MatomeMb/matomembowene.github.io.git
cd matomembowene.github.io

# 2. Ensure you're on main branch
git checkout main

# 3. Verify files are ready
git status
```

### Deploy Changes
```bash
# 1. Make your edits (index.html, chatbot knowledge, etc.)

# 2. Stage changes
git add .

# 3. Commit with descriptive message
git commit -m "Update portfolio: add new project"

# 4. Push to GitHub
git push origin main
```

Site will be live in **1-2 minutes** at:
- https://github.com/MatomeMb/matomembowene.github.io
- https://www.matomembowene.co.za (custom domain)

## Custom Domain Setup

### DNS Configuration (example: Namecheap)
1. Add A record pointing to GitHub Pages IP
2. Add CNAME record for `www` subdomain

**GitHub Pages IPs:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### GitHub Settings
1. Go to repo Settings → Pages
2. Set custom domain: `matomembowene.co.za`
3. Enable "Enforce HTTPS"
4. Add CNAME file (GitHub does this automatically)

## Files to Update When Personalizing

- **`index.html`** - Main content, links, CTA
- **`resume.html`** - Resume/CV content
- **`chatbot/chatbot_knowledge.json`** - Chatbot responses
- **`profile.jpg`** - Profile photo (400x400px recommended)
- **`og-image.svg`** - Open Graph preview image
- **`resume.pdf`** - Downloadable resume (optional)

## Performance Optimization

### Before Deployment
- [ ] Image optimization: compress PNG/JPG
- [ ] Check lighthouse scores: `http://localhost:8000`
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Test chatbot locally

### Monitoring
After deployment:
1. Visit https://www.matomembowene.co.za
2. Test all navigation links
3. Test chatbot functionality
4. Verify resume/case study links
5. Check mobile responsiveness

## Rollback

If something breaks:

```bash
# See recent commits
git log --oneline -5

# Revert to previous version
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Push changes
git push origin main
```

## Common Issues

### Site Not Updating
- Clear browser cache (Ctrl+Shift+Delete)
- Check GitHub Actions (Settings → Actions)
- Wait 2-3 minutes for deploy to complete
- Verify push succeeded: `git log`

### HTTPS Not Working
- Ensure "Enforce HTTPS" is enabled in GitHub Settings
- DNS propagation can take 24-48 hours for new domains
- Try again after 30 minutes

### Custom Domain Not Resolving
- Verify DNS records (A records + CNAME)
- Wait for DNS propagation (often 15-30 min)
- Check GitHub Pages settings

## Support

For GitHub Pages issues: https://docs.github.com/en/pages
