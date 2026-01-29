# Quick Reference - Common Tasks

## Deploy Changes

```bash
git add .
git commit -m "Update: [describe changes]"
git push origin main
```

Site updates in 1-2 minutes at: https://www.matomembowene.co.za

---

## Update Chatbot

**File:** `chatbot/chatbot_knowledge.json`

Add new response:
```json
{
  "id": "unique-id",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "response": "Your response text here"
}
```

---

## Add New Project

1. Create `case-studies/project-name.html`
2. Update `index.html` → Projects section (add link)
3. Update chatbot knowledge with project keywords
4. Deploy

```bash
git add .
git commit -m "Add project: [name]"
git push
```

---

## 🔧 Update Hero Section

**File:** `index.html`

Find and edit:
```html
<section id="hero">
  <h1>Your Name</h1>
  <p>Your Title</p>
  <!-- Edit here -->
</section>
```

---

## 📄 Update Resume Page

**File:** `resume.html`

Edit content and re-export PDF as `resume.pdf`

---

## 🖼️ Change Profile Photo

Replace: `profile.jpg`
- Size: 400x400px recommended
- Format: JPG or PNG
- Max size: ~200KB

---

## 📱 Test Locally

```bash
python -m http.server 8000
# Visit: http://localhost:8000
# F12 → DevTools to test
```

---

## Performance Check

1. Local server running (see above)
2. Open http://localhost:8000
3. F12 → Lighthouse tab
4. Click "Analyze page load"
5. Aim for scores > 90

---

## Update Social Links

**File:** `index.html` → Footer section

```html
<a href="https://linkedin.com/in/yourname">LinkedIn</a>
<a href="https://github.com/yourname">GitHub</a>
<a href="mailto:your@email.com">Email</a>
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Site not updating | Clear cache (Ctrl+Shift+Del) + wait 2 min |
| Service worker not working | Deploy to GitHub (HTTPS required) |
| Chatbot no response | Check JSON syntax in `chatbot_knowledge.json` |
| Images broken | Verify file paths start with `/` or `./` |
| Links not working | Use relative paths like `./case-studies/project.html` |

---

## Full Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Development](docs/DEVELOPMENT.md)
- [Chatbot](docs/CHATBOT.md)

---

## Tips

- **Save locally first** - Edit, test, then commit
- **Small commits** - Easier to revert if needed
- **Descriptive messages** - "Update skills" not "fix"
- **Test mobile** - F12 → Device Mode (Ctrl+Shift+M)
- **Check links** - Before pushing to GitHub

---

Last updated: January 29, 2025
