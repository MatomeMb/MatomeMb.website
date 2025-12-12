# Matome Mbowene | Portfolio

Personal portfolio website for Matome Mbowene — Software Engineer, AI/ML Specialist, and Dell Young Leader.

**Live Site:** https://matomemb.github.io

---

## Overview

A modern, high-performance portfolio website built with **Tailwind CSS**, **Font Awesome 6**, and **AOS animations**. Designed to showcase production projects, academic achievements, and technical expertise to recruiters and potential collaborators.

### Key Features

✨ **Modern Design**
- Dark theme with gradient accents (#0f172a background, #e2e8f0 text)
- Professional gradients (Indigo → Purple) with smooth animations
- Responsive mobile-first design (mobile, tablet, desktop)

🎯 **Sections**
- **Hero:** Profile photo, name, title, summary, social links, resume download
- **About:** Education (UCT BSc Dec 2025), Dell Young Leader recognition, career passion
- **Production Projects:** 3 featured projects with stats, tech stacks, repo links
- **Academic Projects:** 5+ capstone/academic achievements with quantified metrics
- **Skills:** 15+ technical skills in interactive badge grid
- **Contact:** Formspree form + direct contact links
- **Navigation:** Sticky navbar with smooth scrolling

🚀 **Performance & UX**
- AOS fade-up animations on scroll
- Hover lift effects on project cards
- Fast CDN-based assets (Tailwind, Font Awesome, Google Fonts)
- Smooth scrolling between sections
- Form feedback animations
- SEO-optimized meta tags

---

## Setup Instructions

### 1. **Clone the Repository**
```bash
git clone https://github.com/MatomeMb/matomemb.github.io.git
cd matomemb.github.io
```

### 2. **Local Preview**
Open `index.html` directly in your browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 3. **Customize Files**

Replace these files with your own:
- **`profile.jpg`** — Your profile photo (recommended: 400x400px, .jpg or .png)
- **`Matome_Mbowene_Resume_2025_Dec.pdf`** — Your resume/CV

### 4. **Update Formspree Form ID** (Optional for Email)

In `index.html`, find the form section and update the action URL:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

To get your Form ID:
1. Visit https://formspree.io
2. Create a new form
3. Copy the endpoint ID from your Formspree dashboard
4. Replace `YOUR_FORM_ID` in the form action

### 5. **Deploy to GitHub Pages**

```bash
# Stage all changes
git add .

# Commit
git commit -m "Final polished portfolio"

# Push to GitHub
git push origin main
```

Your site will be live at `https://<your-username>.github.io`

---

## Customization Guide

### Colors
Edit CSS variables in the `<style>` section:
```css
:root {
    --primary: #667eea;      /* Indigo */
    --secondary: #764ba2;    /* Purple */
    --tertiary: #f093fb;     /* Pink */
    --bg-dark: #0f172a;      /* Dark background */
    --text-light: #e2e8f0;   /* Light text */
}
```

### Content
- Update hero section with your name, title, and bio
- Modify project cards with your own projects
- Add/remove skill badges
- Update social links (LinkedIn, GitHub, Email)

### Sections
Each section is wrapped in a `<section>` tag with an `id` for navigation:
- `#about` — About section
- `#projects` — Production projects
- `#academic` — Academic projects
- `#skills` — Technical skills
- `#contact` — Contact form

---

## Technologies Used

- **HTML5** — Semantic markup
- **Tailwind CSS CDN** — Utility-first CSS framework
- **Font Awesome 6** — Icon library (via CDN)
- **AOS (Animate On Scroll)** — Scroll animations (via CDN)
- **Google Fonts** — Inter typeface
- **Formspree** — Form submission backend (email integration)
- **Vanilla JavaScript** — Smooth scrolling, form feedback

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

- **Page Load:** ~2-3 seconds (depends on internet speed)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)
- **Mobile Optimized:** Fully responsive down to 320px width
- **CDN-Hosted Assets:** Fast, globally distributed delivery

---

## License

MIT License — Feel free to fork, modify, and use as a template for your own portfolio.

---

## Support & Contributions

Found a bug or have a suggestion? Open an issue on GitHub or reach out directly:

📧 **Email:** matomepontso@gmail.com  
💼 **LinkedIn:** https://linkedin.com/in/matomembowene  
💻 **GitHub:** https://github.com/MatomeMb  

---

**Built with ❤️ by Matome Mbowene**
