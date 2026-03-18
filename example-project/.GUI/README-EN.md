# SKILL GUI - Documentation Visualization

> Web-based visualization interface for SKILL documentation system

## Quick Start

### Windows
```bash
# Default port 5173
start-gui.bat

# Custom port
start-gui.bat 3000
```

### Mac/Linux
```bash
# Default port 5173
chmod +x start-gui.sh
./start-gui.sh

# Custom port
./start-gui.sh 3000
```

---

## What is SKILL GUI

A universal documentation visualization framework based on SKILL.md specification.

**Core Features**:
- Project overview with statistics
- Module tree navigation
- API documentation browser
- Semantic tag search
- Real-time index updates

**Tech Stack**:
- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- React Router 6

---

## Running Modes

### Development Mode
```bash
cd .GUI
npm install
npm run dev
```
Hot reload enabled, port 5173 by default.

### Static Mode
```bash
cd .GUI
npm run build
# Open dist/index.html directly
```
No server needed, works offline.

### Preview Mode
```bash
npm run preview
```
Preview build results before deployment.

---

## Features

### 1. Project Overview (/)
- Total modules, sections, tags statistics
- Module list with quick access
- Popular tags cloud

### 2. Project Home (/project)
- Root SKILL.md content
- Architecture diagrams
- Tech stack
- Quick start guide

### 3. Module Browser (/modules)
- Left: Tree navigation
- Right: Module details, API list, code examples

### 4. API Documentation (/api)
- API categorization
- Parameter descriptions
- Return value specs
- Syntax-highlighted examples

### 5. Smart Search (/search)
- Tag-based search
- Fuzzy matching
- Search history
- Result highlighting

### 6. Admin Panel (/admin)
- Index status check
- Cache management
- Configuration export

---

## Configuration

### Port Configuration
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5173,  // Change port here
    host: true,
  }
})
```

### Theme Configuration
Supports 3 theme modes:
- `light` - Light theme
- `dark` - Dark theme
- `system` - Follow system

---

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl/Cmd + K` | Focus search |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `ESC` | Cancel search focus |

---

## Troubleshooting

### Index file not found?
```bash
# Generate index first
cd ..
node build-index-auto.js
```

### Port occupied?
```bash
# Use different port
start-gui.bat 3001
# or
./start-gui.sh 3001
```

### Static mode can't load data?
Ensure `npm run build` completed. Build process auto-copies data to `dist/data/`.

### Module not showing?
Check if SKILL.md has YAML frontmatter:
```markdown
---
name: module-name
tags: [tag1, tag2]
---
```

---

## Dependencies

### Production
- `react` / `react-dom` - UI framework
- `react-router-dom` - Routing
- `zustand` - State management
- `lucide-react` - Icons
- `react-markdown` / `remark-gfm` - Markdown rendering
- `@radix-ui/*` - Accessible UI components

### Development
- `vite` - Build tool
- `typescript` - Type system
- `tailwindcss` - CSS framework
- `eslint` - Code linting

---

## Version History

### v1.0.0 (2026-02-05)
- Initial release
- Project overview, module browser, API docs, search
- Development and static modes
- Cross-platform launch scripts
- Custom port support
