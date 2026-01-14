# 🚀 Matome Mbowene - Software Engineer Portfolio

A modern, interactive portfolio website showcasing versatile software engineering expertise across full-stack web development, embedded systems, AI/ML, and systems programming. Built with Firebase Cloud Functions and featuring real-time AI chatbot integration.

## 🌟 Live Demo

**🌐 Website:** [https://matome-portfolio.web.app](https://matome-portfolio.web.app)

**🤖 AI Chat:** Interactive chatbot powered by OpenAI GPT-3.5-turbo  
**📊 Live Demos:** FashionMNIST classifier and Q-Learning agent  
**📱 Responsive:** Optimized for all devices  

## ✨ Key Features

### 🎯 **Portfolio Highlights**
- **8+ Comprehensive Projects** spanning 4 technical domains
- **Technical Breadth Section** showcasing versatility across domains
- **Project Timeline** with chronological development journey
- **Interactive Project Filtering** by technology category
- **Mobile-First Responsive Design** with dark theme

### 🛠️ **Technical Domains**
- **Full-Stack Web Development** (Spring Boot, REST APIs, MySQL)
- **Embedded Systems** (STM32 microcontrollers, hardware protocols)
- **AI/ML & Data Science** (PyTorch, RAG systems, Computer Vision)
- **Systems Programming** (CPU scheduling, networking, algorithms)

### 🤖 **AI-Powered Features**
- **Live AI Chatbot**: OpenAI GPT-3.5-turbo integration with Firebase Functions
- **Context-Aware Responses**: Understands portfolio and project context
- **Real-time Status Indicators**: Visual feedback for connection status
- **Graceful Error Handling**: Fallback responses when AI is unavailable

### ⚡ **Performance Optimizations**
- **Cold Start Mitigation**: `minInstances: 1` for instant AI responses
- **Response Compression**: Gzip compression for faster data transfer
- **Browser Caching**: Optimized cache headers for static assets
- **Lazy Loading**: On-demand resource loading for better performance

## 🏗️ Project Structure

```
matome-portfolio/
├── 📁 functions/              # Firebase Cloud Functions
│   ├── index.js              # Main AI chatbot functions
│   └── package.json          # Backend dependencies
├── 📁 public/                # Frontend assets
│   ├── index.html            # Main portfolio page
│   ├── my_portfolio.md       # Portfolio content source
│   └── images/               # Portfolio images and assets
├── 📁 js/                    # Frontend JavaScript (if applicable)
├── 📁 temp_backup/          # Backup files
├── 📄 firebase.json         # Firebase configuration
├── 📄 package.json          # Root dependencies
└── 📄 deploy-*.bat          # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (locally)
- Firebase CLI
- OpenAI API key (optional, for enhanced AI responses)

### 1. Clone Repository
```bash
git clone https://github.com/MatomeMb/matome-portfolio.git
cd matome-portfolio
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 3. Configure Firebase
```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Set OpenAI API key (optional)
firebase functions:config:set openai.api_key="your_openai_api_key_here"
```

### 4. Deploy Everything
```bash
# Deploy both functions and hosting
./deploy-all.bat

# Or deploy individually
./deploy-functions.bat  # Deploy backend only
./deploy-frontend.bat   # Deploy frontend only
```

## 🎨 Portfolio Sections

### 🏠 **Hero Section**
- Professional introduction with balanced technical expertise
- Contact information and social links
- Rotating background images for visual appeal

### 👨‍💻 **About Me**
- Versatile software engineer positioning
- Dell Young Leaders program emphasis
- Balanced skill showcase across all domains
- Achievement badges and quantified results

### 📊 **Technical Breadth**
- 4 equal quadrants showcasing domain expertise
- Project count distribution across domains
- Visual representation of technical versatility

### 📅 **Project Timeline**
- Chronological journey through 8+ projects
- Color-coded domain indicators
- Detailed project descriptions and technologies
- GitHub repository links for key projects

### 🚀 **Featured Projects**
- Interactive project filtering system
- Detailed project cards with features and technologies
- Live demo links and repository access
- Quantified results and achievements

### 🛠️ **Technical Expertise**
- 4 balanced skill quadrants
- Core Programming, Full-Stack Development, Embedded Systems, AI/ML
- Comprehensive technology stack coverage

### 📞 **Contact Section**
- Multiple contact methods
- Professional availability status
- Social media integration

## 🔧 Development

### Local Development
```bash
# Test functions locally
cd functions
node index.js

# Start Firebase emulators
firebase emulators:start --only functions

# Test hosting locally
firebase serve --only hosting
```

### Adding New Projects
1. Update `public/my_portfolio.md` with project details
2. Add project cards to `public/index.html` in both timeline and projects sections
3. Include relevant technologies, features, and repository links
4. Update project counts in Technical Breadth section

### Modifying AI Responses
1. Edit system prompts in `functions/index.js`
2. Update fallback responses for when OpenAI is unavailable
3. Customize response formatting and context awareness

## 📊 Performance Metrics

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Features
- **Cold Start Mitigation**: 1 warm instance maintained
- **Response Compression**: 20-30% size reduction
- **Browser Caching**: 1-year cache for static assets
- **Mobile-First Design**: Optimized for all screen sizes

## 🤖 AI Chatbot Features

### Capabilities
- **Real-time Responses**: Powered by OpenAI GPT-3.5-turbo
- **Portfolio Context**: Understands projects, skills, and experience
- **Status Indicators**: Visual feedback for connection status
- **Error Handling**: Graceful fallbacks when AI is unavailable

### Status States
- 🟢 **Online**: Ready to respond
- 🟡 **Typing**: Processing user input
- 🔵 **Processing**: Generating AI response
- 🔴 **Error**: Temporary issue (auto-recovery)

## 🎨 Design System

### Visual Elements
- **Dark Theme**: Professional dark color scheme
- **Glass Morphism**: Modern glassmorphic design elements
- **Smooth Animations**: AOS (Animate On Scroll) integration
- **Responsive Grid**: Mobile-first responsive design
- **Color-Coded Domains**: Visual project categorization

### Interactive Elements
- **Hover Effects**: Smooth color transitions
- **Loading States**: Visual feedback during operations
- **Clickable Links**: Direct contact and repository integration
- **Filter System**: Interactive project categorization

## 🔒 Security Features

### Backend Security
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Secure error responses

### Frontend Security
- **Content Security Policy**: XSS protection
- **Input Sanitization**: Safe user input handling
- **Secure Links**: Proper `rel="noopener noreferrer"` attributes

## 📱 Mobile Optimization

### Responsive Features
- **Touch-Friendly**: Optimized for mobile interactions
- **Adaptive Layout**: Flexible grid system
- **Mobile Navigation**: Collapsible menu system
- **Touch Gestures**: Swipe and tap optimizations

### Performance
- **Mobile-First**: Designed for mobile devices first
- **Fast Loading**: Optimized for slow connections
- **Battery Efficient**: Minimal resource usage

## 🚀 Deployment

### Automated Deployment
```bash
# Deploy everything
./deploy-all.bat

# Deploy functions only
./deploy-functions.bat

# Deploy hosting only
./deploy-frontend.bat
```

### Manual Deployment
```bash
# Deploy functions
firebase deploy --only functions

# Deploy hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

## 🔧 Troubleshooting

### Common Issues

**Chatbot not responding:**
- Check Firebase Functions logs
- Verify OpenAI API key configuration
- Ensure functions are deployed

**Styling issues:**
- Clear browser cache
- Check CSS class names
- Verify responsive breakpoints

**Performance issues:**
- Check Core Web Vitals
- Monitor Firebase Functions performance
- Optimize images and assets

## 📞 Contact & Support

### Contact Information
- **Email**: [matomepontso@gmail.com](mailto:matomepontso@gmail.com)
- **Phone**: (available upon request)
- **LinkedIn**: [linkedin.com/in/matomembowene](https://linkedin.com/in/matomembowene)
- **GitHub**: [github.com/MatomeMb](https://github.com/MatomeMb)

### Key Projects
- **Personal Codex Agent**: [github.com/MatomeMb/personal-codex-agent](https://github.com/MatomeMb/personal-codex-agent)
- **Portfolio Repository**: [github.com/MatomeMb/matome-portfolio](https://github.com/MatomeMb/matome-portfolio)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Firebase**: Backend infrastructure and hosting
- **OpenAI**: AI chatbot capabilities
- **Tailwind CSS**: Styling framework
- **AOS**: Animation library
- **Font Awesome**: Icon library
- **Dell Young Leaders Program**: Academic and leadership development

---

**Built with ❤️ by Matome Mbowene**

*"Versatile software engineer building the future across multiple domains."*

## 🏆 Key Achievements

- **8+ Comprehensive Projects** across 4 technical domains
- **89.33% Accuracy** on neural network classification (Top 15% of class)
- **Dell Young Leader** (2020-2025) - 5-year scholarship program
- **Team Leadership** experience with zero critical bugs delivered
- **Production-Ready** applications with live demonstrations