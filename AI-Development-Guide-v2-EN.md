# AI Development Guide v2.0

> Version: 2.0.0
> Updated: 2026-01-29
> Target: AI-assisted development tools (Claude Code, GitHub Copilot, Cursor, etc.)

---

## Overview

This guide is specifically written for AI-assisted development tools, combined with **semantic indexing system** for efficient and precise code location and development.

### v2.0 Core Improvements

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Doc Search | Hierarchy traversal | **Semantic index + tag matching** |
| Location Method | Manual search | **Auto-index + precise location** |
| Maintenance Cost | Manual line numbers | **Auto-extract, zero maintenance** |
| Token Consumption | ~9,500 chars | **~2,000 chars (80% savings)** |
| Language Support | Specific language | **Language-agnostic** |

### Two Working Modes

```
┌─────────────────────────────────────────────────────┐
│  User Question                                       │
└─────────────────────────────────────────────────────┘
                         ↓
              ┌─────────────────────┐
              │  Determine Type      │
              └─────────────────────┘
                    ↓           ↓
         ┌─────────────┐  ┌─────────────────┐
         │ Query Type   │  │ Development Type │
         └─────────────┘  └─────────────────┘
              ↓                    ↓
    ┌──────────────────┐  ┌──────────────────────────┐
    │ Semantic Index    │  │ Read Full SKILL.md       │
    │ Quick Location    │  │ Understand Standards     │
    │ 2 steps, ~2000    │  │ Then Develop             │
    └──────────────────┘  └──────────────────────────┘
```

---

## Core Principles

### 1. Index First, Then Search

```
❌ Wrong: Direct Glob/Grep global search
✅ Correct:
   1. Read SKILL.index.json semantic index
   2. Match tags to locate target module/section
   3. Directly read target content
```

### 2. Distinguish Query vs Development

```
Query scenario (e.g., "How to refresh token?"):
   → Use semantic index for quick API doc location
   → 2 steps, minimal consumption

Development scenario (e.g., "Help me add password reset"):
   → First read module SKILL.md for full context
   → Understand standards, architecture, dependencies, then develop
```

### 3. Synchronize Documentation

```
❌ Wrong: Only modify code, don't update docs
✅ Correct:
   1. Update SKILL.md immediately after code changes
   2. Run build-index-auto.js to regenerate index
   3. Ensure example code runs
```

---

## Semantic Index Query Flow

### Query-Type Questions (Recommended)

**Use Case**: Find API usage, understand feature implementation

**Flow**:

```
User asks: How to refresh token?

Step 1: Read SKILL.index.json
        → tagIndex["refreshtoken"] → auth#sub:refreshtoken
        → Get file: auth/SKILL.md, section: sub:refreshtoken

Step 2: Read target content
        → Read auth/SKILL.md (163-189 lines)
        → Directly get refreshToken API docs

✅ Done (2 steps, ~2,000 chars, 80% savings)
```

**Code Example**:

```javascript
// Step 1: Read index
const index = JSON.parse(fs.readFileSync('SKILL.index.json'));

// Step 2: Match via tags
const matches = index.tagIndex['refreshtoken'];
// → ["auth#sub:refreshtoken"]

// Step 3: Parse result
const [module, section] = matches[0].split('#');
const moduleInfo = index.modules[module];
const sectionInfo = moduleInfo.sections[section];

// Step 4: Read target content
// Read: moduleInfo.file, offset: sectionInfo.start, limit: sectionInfo.end - sectionInfo.start
```

### Development-Type Questions

**Use Case**: Add features, modify features, refactor code

**Flow**:

```
User says: Help me add password reset feature

Step 1: Read index, locate related module
        → tagIndex["password"] → auth
        → Determine development in auth module

Step 2: Read complete SKILL.md
        → Read auth/SKILL.md (full file)
        → Understand: architecture, patterns, standards, dependencies

Step 3: Reference existing APIs
        → Check login, register implementation patterns
        → Keep code style consistent

Step 4: Develop new feature
        → Write code following standards
        → Update SKILL.md API section

Step 5: Update index
        → Run node build-index-auto.js
```

---

## Index System Usage Guide

### Index File Structure

```json
{
  "version": "3.0.0",
  "mode": "auto-extract",
  "modules": {
    "auth": {
      "file": "src/modules/auth/SKILL.md",
      "title": "Authentication Module",
      "tags": ["login", "auth", "Token", "JWT"],
      "sections": {
        "sub:login": {
          "level": 4,
          "title": "login(dto: LoginDto): Promise<TokenPair>",
          "start": 79,
          "end": 120,
          "tags": ["login", "dto", "promise"]
        }
      }
    }
  },
  "tagIndex": {
    "login": ["auth", "auth#sub:login"],
    "Token": ["auth", "auth#sub:refreshtoken"]
  }
}
```

### Query Algorithm

```javascript
function queryByTags(index, queryTags) {
  const results = [];

  for (const [moduleName, module] of Object.entries(index.modules)) {
    let score = 0;

    // Module-level tags match: +10 points/tag
    for (const tag of module.tags) {
      if (queryTags.some(q => tag.toLowerCase().includes(q.toLowerCase()))) {
        score += 10;
      }
    }

    // Section-level tags match: +5 points/tag
    const matchedSections = [];
    for (const [sectionKey, section] of Object.entries(module.sections)) {
      for (const tag of section.tags || []) {
        if (queryTags.some(q => tag.toLowerCase().includes(q.toLowerCase()))) {
          score += 5;
          matchedSections.push({ key: sectionKey, ...section });
        }
      }
    }

    if (score > 0) {
      results.push({ module: moduleName, score, matchedSections });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
```

### Generate Index

```bash
# Auto-scan all SKILL.md, generate semantic index
node build-index-auto.js [project-directory]

# Output example:
# 📦 Module: auth (Authentication Module)
#    Auto-extracted 21 sections
#    ├─ sub:login: "login(dto: LoginDto)" (79-120 lines)
#    │  └─ auto-tags: login, dto, promise
# ✅ Index generated: SKILL.index.json
```

---

## SKILL.md Writing Standards

### Minimum Requirements (v3.0 Simplified)

Only **YAML header** needed, tool auto-extracts sections from headings:

```markdown
---
name: user
tags: [user, CRUD, query, update]
---

# User Module

## Module Overview
...

## API Documentation

### getById
Get user by ID...

### update
Update user info...
```

Tool automatically:
- Extracts sections from `##` `###` `####`
- Extracts tags from heading text (Chinese + English words)
- Generates complete index

### Complete Format (Recommended)

```markdown
---
name: auth
title: Authentication Module
tags: [login, auth, Token, JWT, user-verification]
---

# Auth Authentication Module

> Layer: Layer 3 (Sub-module documentation)
> Parent: [src/SKILL.md](../SKILL.md)

## Module Overview

- **Responsibility**: Handle all user authentication functionality
- **Location**: src/modules/auth/
- **Dependencies**: core/database, core/logger

## Module Architecture

```
auth/
├── SKILL.md
├── controllers/
├── services/
└── types/
```

## API Documentation

### AuthService

#### login(dto: LoginDto): Promise<TokenPair>

**Description**: User login, validate credentials and return tokens

**Parameters**:
- `dto` (LoginDto): Login data
  - `email` (string): User email
  - `password` (string): User password

**Returns**:
- (Promise<TokenPair>): Token object

**Usage Example**:

```typescript
const tokens = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});
```

## Module Development Standards

### Error Handling

```typescript
// ✅ Correct: Use unified ErrorHandler
import { ErrorHandler } from '@/core/error';

try {
  const user = await this.validateCredentials(email, password);
} catch (error) {
  ErrorHandler.handle(error, { context: 'AuthService.login' });
  throw error;
}
```

### Logging

```typescript
// ✅ Correct: Use unified Logger
import { Logger } from '@/core/logger';

Logger.info('User logged in', { userId: user.id });
```

## Dependencies

### External Dependencies
- `jsonwebtoken`: JWT generation and verification
- `bcrypt`: Password encryption

### Internal Dependencies
- `@/core/database`: Database operations
- `@/modules/user`: User info queries
```

---

## Development Workflow

### Query API Usage

```
1. Read SKILL.index.json
2. Match tags to find target
3. Read target section content
4. Return result to user
```

### Add New Feature

```
1. Read index, locate related module
2. Read module SKILL.md (complete)
3. Understand architecture, standards, dependencies
4. Reference existing API implementation patterns
5. Write new feature code
6. Update SKILL.md API section
7. Run build-index-auto.js to update index
8. Write tests
```

### Modify Feature

```
1. Read index, locate target API
2. Read related section to understand current implementation
3. Read module SKILL.md to understand standards
4. Modify code
5. Update SKILL.md
6. Update index
7. Update tests
```

### Bug Fix

```
1. Read index, locate related code
2. Understand bug cause
3. Fix bug
4. If API behavior changed, update SKILL.md
5. Add test to prevent regression
```

---

## Code Standards

### Naming Conventions

```javascript
// ✅ Correct naming
const userName = 'John';              // Variable: camelCase
function getUserById(id) {}           // Function: camelCase
class UserService {}                  // Class: PascalCase
const MAX_RETRY_COUNT = 3;           // Constant: UPPER_SNAKE_CASE
```

### Error Handling

```javascript
// ✅ Correct: Use project's ErrorHandler
import { ErrorHandler } from '@/core/error-handler';

try {
  const user = await getUser(id);
} catch (error) {
  ErrorHandler.handle(error, { context: 'getUserById', userId: id });
  throw error;
}

// ❌ Wrong: Direct console.error
try {
  const user = await getUser(id);
} catch (error) {
  console.error('Error:', error);
}
```

### Logging

```javascript
// ✅ Correct: Use unified Logger
import { Logger } from '@/core/logger';

Logger.info('Operation started', { userId, action });
Logger.error('Operation failed', { error, context });

// ❌ Wrong: Use console.log
console.log('Operation started');
```

---

## Checklist

### Query Tasks

- [ ] Read SKILL.index.json
- [ ] Found target via tag matching
- [ ] Directly read target content
- [ ] Did not use global Glob/Grep

### Development Tasks

- [ ] Read related module's SKILL.md
- [ ] Understood existing code architecture
- [ ] Code style consistent with project
- [ ] Used project's existing tools and libraries
- [ ] Updated SKILL.md
- [ ] Ran build-index-auto.js
- [ ] Wrote tests

### Documentation Updates

- [ ] API documentation updated
- [ ] Usage examples runnable
- [ ] Index regenerated

---

## Efficiency Comparison

| Approach | Steps | Char Consumption | Savings |
|----------|-------|------------------|---------|
| Global search | 5+ | 15,938 | - |
| Hierarchy traversal | 3 | 9,536 | 40% |
| **Semantic index** | **2** | **~2,000** | **87%** |

---

## Version History

### v2.0.0 (2026-01-29)
- Added semantic index system
- Added auto-extract sections feature
- Added tag matching query algorithm
- Distinguish query and development modes
- Language-agnostic universal solution
- 80%+ token consumption reduction

### v1.0.0 (2025-12-17)
- Initial version
- Defined AI development core principles
- Provided detailed code standards and examples
