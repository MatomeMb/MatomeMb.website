# Development & Maintenance Guide

## Adding New Content

### New Project/Case Study

1. **Create case study HTML**
   ```bash
   # Add to case-studies/ folder
   case-studies/new-project.html
   ```

2. **Update index.html**
   - Add project card in "Projects" section
   - Link to new case study
   - Update tags and description

3. **Update chatbot knowledge**
   - Add keywords about new project to `chatbot/chatbot_knowledge.json`

4. **Deploy**
   ```bash
   git add .
   git commit -m "Add new project case study"
   git push
   ```

### Updating Skills

1. Edit `index.html` → Skills section
2. Organize by category (Frontend, Backend, AI/ML, etc.)
3. Update chatbot knowledge with new skills

### New Blog Post / Article

Not currently supported (static site). To add:
1. Create new `.html` file in root or new folder
2. Link from navigation or footer
3. Update sitemap.xml

## Maintaining Code Quality

### SEO Checklist
- [ ] All images have descriptive `alt` text
- [ ] Links have descriptive anchor text (not "click here")
- [ ] Headings follow H1 → H2 → H3 hierarchy
- [ ] Meta descriptions updated in each page
- [ ] Open Graph tags present (og:title, og:description, og:image)

### Performance Checklist
- [ ] Images are compressed (< 500KB)
- [ ] CSS is minified (if possible)
- [ ] No unused CSS/JavaScript
- [ ] Lighthouse score > 90 on mobile
- [ ] First Contentful Paint < 2s

### Accessibility Checklist
- [ ] All interactive elements keyboard-accessible
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Form inputs have labels
- [ ] Videos have captions (if applicable)
- [ ] No auto-playing media

## Common Edits

### Change Hero Text
File: `index.html` → Hero section
```html
<h1>Your Name</h1>
<p>Your title</p>
```

### Update Social Links
File: `index.html` → Footer or contact section
```html
<a href="https://linkedin.com/in/yourprofile">LinkedIn</a>
```

### Modify Chatbot Knowledge
File: `chatbot/chatbot_knowledge.json`

Add new topic:
```json
{
  "id": "new-topic",
  "keywords": ["keyword1", "keyword2"],
  "response": "Your response here"
}
```

### Update Favicon
Replace: `favicon.svg`
- Size: 192x192px or scalable SVG
- Format: SVG recommended (or PNG)

## Testing Before Deployment

### Local Testing
```bash
# Start local server
python -m http.server 8000

# Open browser
open http://localhost:8000

# Test all sections:
# - Navigation links
# - Chatbot functionality
# - Case study links
# - Mobile responsiveness (F12 → Device mode)
```

### Performance Testing
```bash
# In Chrome DevTools (F12)
# 1. Go to Lighthouse tab
# 2. Click "Analyze page load"
# 3. Check scores (aim for 90+)
```

### Mobile Testing
- Desktop Chrome: F12 → Toggle Device Mode (Ctrl+Shift+M)
- Test on actual phone if possible
- Check touchscreen interactions

## Git Workflow

### Making Changes
```bash
# 1. Create feature branch (optional but recommended)
git checkout -b feature/update-portfolio

# 2. Make edits to files

# 3. Stage changes
git add .

# 4. Commit with message
git commit -m "Description of changes"

# 5. Push to GitHub
git push origin feature/update-portfolio

# 6. Create Pull Request (optional, for review)
# Then merge to main
```

### Commit Message Format
```
[Type] Brief description

Types: feature, bugfix, docs, style, chore
Examples:
- "feature: Add new project case study"
- "bugfix: Fix chatbot response latency"
- "docs: Update deployment guide"
- "style: Improve mobile menu accessibility"
```

## Version Control Tips

### See File History
```bash
git log --oneline filename.html
```

### Compare Changes
```bash
git diff filename.html
```

### Undo Last Commit
```bash
git reset HEAD~1
```

## Backup & Recovery

### Create Backup Branch
```bash
git branch backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

### Restore from Backup
```bash
git checkout backup-20250129
git push origin backup-20250129:main
```

## Regular Maintenance

- **Monthly**: Review and update skill tags
- **Quarterly**: Refresh project descriptions and links
- **Annually**: Update chatbot knowledge base with new projects/skills
- **As needed**: Fix broken links, update contact info
