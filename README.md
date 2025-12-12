# Matome Mbowene Portfolio

Personal portfolio website for Matome Mbowene — Software Engineer, AI/ML Specialist, and Dell Young Leader.

**Live Site:** https://matomemb.github.io

---

## Overview

A premium, modern portfolio website featuring **iOS 26-inspired glassmorphism design** with improved spacing and professional colors. Built with **Tailwind CSS**, **Font Awesome 6**, and **AOS animations** for a high-end feel.

### Recent Improvements
✨ **Section Spacing & Layout**
- Alternating section backgrounds (#0f172a dark, #1e293b light) for visual separation
- Increased padding (py-20 for all sections) prevents cramped feeling
- Wider layouts with max-w-7xl for better use of space
- 2rem top/bottom margins between sections for breathing room

🎨 **Professional Color Scheme**
- Hero gradient updated to tech-focused blue: linear-gradient(135deg, #1e40af 0%, #312e81 100%)
- Professional navy/blue instead of vibrant purple
- Maintains glassmorphism with refined aesthetics
- Dark backgrounds (#0f172a, #1e293b) provide excellent contrast

✨ **Glassmorphism Design (iOS 26 Inspired)**
- Liquid Glass cards with backdrop blur effects and translucent backgrounds
- Frosted-glass aesthetic with subtle reflections and depth
- Smooth hover transforms (scale + shadow for "liquid" flow)
- Modern rounded corners and minimalist layout
- Premium feel without generic vibes

🎯 **Sections**
- **Hero:** Profile photo, name, title, summary, social links, resume download
- **About:** Education (UCT BSc Dec 2025), Dell Young Leader recognition, career passion
- **Production Projects:** 3 featured projects with NDA badges (confidential projects marked professionally)
- **Academic Projects:** 6 capstone/academic achievements with quantified metrics
- **Skills:** 15+ interactive technical skill badges
- **Contact:** Formspree form + direct contact links
- **Navigation:** Sticky glass navbar with smooth scrolling

🚀 **Performance & UX**
- AOS fade-up animations on scroll
- Dynamic card hover effects with scale transforms
- Fast CDN-based assets (Tailwind, Font Awesome, Google Fonts)
- Smooth scrolling between sections
- SEO-optimized meta tags
- Mobile-first, responsive design

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

## Design Highlights

### Glassmorphism (iOS 26 Inspired)
- **Glass Cards:** `backdrop-filter: blur(20px)` with `rgba(255,255,255,0.05)` for frosted effect
- **Border Treatment:** Subtle white borders at low opacity for definition
- **Hover States:** Cards scale (1.02x) and lift (-5px) on hover with enhanced shadows
- **NDA Badges:** Glassmorphic red badges with lock icon for confidential projects

### Color Palette
- **Dark Background:** `#0f172a` (dark navy)
- **Light Text:** `#e2e8f0` (soft white)
- **Primary Gradient:** Indigo (#667eea) → Purple (#764ba2)
- **Accent Colors:** Cyan, Orange, Green for project icons

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

## NDA Projects

The portfolio includes three production projects marked as "Confidential Project (NDA)":
- **PDF Autofill MVP** — 100% field-mapping accuracy on government forms
- **Beetroot AI Networker** — RAG-powered African entrepreneur networking
- **RoadMind AI Smart Helmet** — Real-time hazard detection with sensor fusion

These projects respect NDAs by omitting repository links while showcasing impact and technical achievements.

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
