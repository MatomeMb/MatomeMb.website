# Contributing Guidelines

Thank you for contributing to the Matome Mbowene Personal Portfolio Platform. This guide outlines the development standards and repository workflows.

---

## 1. Development Principles

We maintain a production-grade software standard. All contributions must follow:
- **KISS (Keep It Simple, Stupid)**: Prefer direct, plain solutions over complex, over-engineered implementations.
- **SOLID & Functional React**: Write reusable components with single responsibilities. Use custom hooks for complex states.
- **Strict TypeScript**: Never use `any` types. Ensure all parameters, states, and return types are strictly typed.
- **Strict Linting & Formatting**: Follow ESLint and Prettier rules. Run format checks before committing.

---

## 2. Setting Up the Development Workspace

1. Clone the repository and navigate to the React source folder:
   ```bash
   git clone https://github.com/MatomeMb/MatomeMb.website.git
   cd MatomeMb.website/src-app
   ```
2. Install cached dependencies offline:
   ```bash
   npm install --prefer-offline
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The server initializes at `http://localhost:5173`.*

---

## 3. Directory Layout

The codebase strictly adheres to the requested feature-first, modular directory layout:

```
src-app/
├── public/                 # Static media icons & global assets
├── src/
│   ├── app/                # Main router & React initialization
│   ├── assets/             # Brand logos & visuals
│   ├── components/         # Reusable elements (SocialIcons, Buttons)
│   ├── config/             # System constants & API configs
│   ├── content/            # Writing & Markdown databases
│   ├── features/           # Advanced logic segments
│   ├── hooks/              # Custom React state hooks
│   ├── layouts/            # Global navigation frame and footer
│   ├── lib/                # Third-party integrations (Query client)
│   ├── pages/              # Core screen templates (Home, Resume, Projects)
│   ├── services/           # Data services (GitHub API)
│   ├── styles/             # Stylesheets (index.css)
│   ├── types/              # TypeScript interface schemas
│   └── utils/              # Helper calculations (formatters)
```

---

## 4. Quality Gates

Before pushing code to branches, execute the quality validation commands:

### Type Check
Ensure there are zero TypeScript compiler warnings:
```bash
npm run typecheck
```

### Build Test
Compile the final production assets to verify there are zero build errors:
```bash
npm run build
```
