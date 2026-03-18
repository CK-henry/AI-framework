# Project Documentation Standard v2.0

> Version: 2.0.0
> Updated: 2026-01-29
> Scope: All new projects (language-agnostic)

---

## Overview

This standard defines a **hierarchical, self-describing, semantic-indexable project documentation system**.

### v2.0 Core Improvements

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Doc Format | Pure Markdown | **YAML header + Markdown** |
| Indexing | Manual hierarchy traversal | **Auto semantic indexing** |
| Location Precision | File-level | **Section-level** |
| Maintenance Cost | Manual | **Auto-generated** |
| Language Support | Specific language | **Language-agnostic** |
| Token Consumption | ~10,000 chars | **~2,000 chars** |

### Core Components

```
Documentation System
├── SKILL.md          # Hierarchical navigation and API reference
├── SKILL.index.json  # Auto-generated semantic index
├── build-index-auto.js  # Index generation tool
└── docs/             # Centralized design docs and plans
```

---

## SKILL.md Specification

### Minimum Format (Simplified)

Only **3 lines of YAML header** needed, tool auto-extracts everything else:

```markdown
---
name: module-name
tags: [tag1, tag2, tag3]
---

# Module Name

## Module Overview
...

## API Documentation

### functionName
Description...
```

**Auto-extracted**:
- Sections from `##` `###` `####` headings
- Tags from heading text (Chinese + English words)
- Auto-calculated line number ranges

### Complete Format (Recommended)

```markdown
---
name: auth
title: Authentication Module
tags: [login, auth, Token, JWT, user-verification, password, register]
---

# Auth Authentication Module

> Layer: Level 3 (Sub-module documentation)
> Parent: [src/SKILL.md](../SKILL.md)

## Module Overview

- **Responsibility**: Handle all user authentication functionality
- **Location**: src/modules/auth/
- **Dependencies**: core/database, core/logger, core/error

## Module Architecture

```
auth/
├── SKILL.md              # This document
├── index.ts              # Module entry
├── controllers/
│   └── auth.controller.ts
├── services/
│   └── auth.service.ts
├── models/
│   └── token.model.ts
├── types/
│   ├── login.dto.ts
│   └── register.dto.ts
└── __tests__/
    └── auth.service.test.ts
```

### Design Patterns

- **Service Pattern**: Business logic encapsulated in AuthService
- **DTO Pattern**: Use Data Transfer Objects for validation

### Key Concepts

- **JWT Token**: Use JSON Web Token for authentication
- **Refresh Token**: Support token refresh mechanism
- **Password Hash**: Use bcrypt for password encryption

## API Documentation

### AuthService

#### login(dto: LoginDto): Promise<TokenPair>

**Description**: User login, validate credentials and return tokens

**Parameters**:
- `dto` (LoginDto): Login data transfer object
  - `email` (string): User email
  - `password` (string): User password

**Returns**:
- (Promise<TokenPair>): Token object
  - `accessToken` (string): Access token
  - `refreshToken` (string): Refresh token

**Throws**:
- `ValidationError`: When parameter validation fails
- `UnauthorizedError`: When credentials invalid

**Usage Example**:

```typescript
import { AuthService } from '@/modules/auth';

const authService = new AuthService();

const tokens = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

console.log(tokens.accessToken);
```

**Notes**:
- Account locked for 15 minutes after 5 failed password attempts
- accessToken valid for 15 minutes
- refreshToken valid for 7 days

---

#### register(dto: RegisterDto): Promise<User>

**Description**: User registration, create new user account

...(other APIs follow same format)

## Module Development Standards

### Error Handling

```typescript
// ✅ Correct: Use unified ErrorHandler
import { ErrorHandler } from '@/core/error';
import { Logger } from '@/core/logger';

try {
  const user = await this.validateCredentials(email, password);
} catch (error) {
  Logger.error('Login failed', { email, error: error.message });
  ErrorHandler.handle(error, { context: 'AuthService.login' });
  throw error;
}
```

### Logging

```typescript
// ✅ Correct: Use unified Logger
import { Logger } from '@/core/logger';

Logger.info('User logged in', { userId: user.id });
Logger.warn('Login attempt failed', { email, reason: 'invalid password' });
Logger.error('Authentication error', { error, context });
```

### Data Validation

```typescript
// ✅ Correct: Use Zod for validation
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
```

## Testing Requirements

- Unit test coverage: > 80%
- Test file location: `__tests__/`
- Must test scenarios:
  - Normal login flow
  - Password error handling
  - Token refresh
  - Account lockout mechanism

## Dependencies

### External Dependencies

- `jsonwebtoken`: JWT generation and verification
- `bcrypt`: Password encryption
- `zod`: Data validation

### Internal Dependencies

- `@/core/database`: Database operations
- `@/core/logger`: Logging
- `@/core/error`: Error handling
- `@/modules/user`: User info queries

## Related Documentation

- [Auth Design Doc](../../../docs/design/auth-design.md)
- [API Documentation](../../../docs/api/auth-api.md)

## FAQ

1. **How to handle expired tokens?**
   Use refreshToken method to get new token pair.

2. **How to implement "remember me"?**
   Extend refreshToken validity to 30 days.
```

---

## Semantic Index System

### Index File Structure

```json
{
  "version": "3.0.0",
  "mode": "auto-extract",
  "updated": "2026-01-29T10:00:00.000Z",
  "stats": {
    "totalFiles": 5,
    "totalModules": 2,
    "totalSections": 32,
    "totalTags": 61
  },
  "modules": {
    "auth": {
      "file": "src/modules/auth/SKILL.md",
      "title": "Authentication Module",
      "tags": ["login", "auth", "Token", "JWT"],
      "sections": {
        "Module Overview": {
          "level": 2,
          "title": "Module Overview",
          "start": 38,
          "end": 43,
          "tags": ["module", "overview"]
        },
        "sub:login": {
          "level": 4,
          "title": "login(dto: LoginDto): Promise<TokenPair>",
          "start": 79,
          "end": 120,
          "tags": ["login", "dto", "logindto", "promise", "tokenpair"]
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

### Index Generation Tool

**File**: `build-index-auto.js`

**Usage**:

```bash
# Run in project root
node build-index-auto.js

# Or specify directory
node build-index-auto.js /path/to/project
```

**Output Example**:

```
═══════════════════════════════════════════════════════
  🚀 SKILL Index Generator v3.0 (Auto-extract)
═══════════════════════════════════════════════════════
📁 Project: /path/to/project

📦 Module: auth (Authentication Module)
   File: src/modules/auth/SKILL.md
   Auto-extracted 21 sections:
   ├─ sub:login: "login(dto: LoginDto)" (79-120 lines)
   │  └─ auto-tags: login, dto, promise
   ├─ sub:register: "register(dto: RegisterDto)" (121-162 lines)
   │  └─ auto-tags: register, dto, promise

═══════════════════════════════════════════════════════
  📊 Statistics
═══════════════════════════════════════════════════════
  SKILL files: 5
  Indexed modules: 2
  Auto-extracted sections: 32
  Total tags: 61

✅ Index generated: SKILL.index.json
═══════════════════════════════════════════════════════
```

### Query Flow

**Query-type questions** (2 steps):

```
User asks: How to refresh token?

Step 1: Read SKILL.index.json
        → tagIndex["refreshtoken"] → auth#sub:refreshtoken
        → Get file + start/end line numbers

Step 2: Read target content
        → Read auth/SKILL.md (163-189 lines)

✅ Done (~2,000 characters)
```

**Development-type questions** (needs full context):

```
User says: Help me add password reset feature

Step 1: Read index, locate auth module
Step 2: Read complete auth/SKILL.md
        → Understand architecture, patterns, standards
Step 3: Reference existing API implementations
Step 4: Develop new feature
Step 5: Update SKILL.md
Step 6: Regenerate index
```

---

## Project Structure

### Standard Directory Structure

```
project-root/
├── SKILL.md                    # Layer 1: Project root doc (required)
├── SKILL.index.json            # Semantic index (auto-generated)
├── build-index-auto.js         # Index generator
├── README.md                   # Project intro (for GitHub)
│
├── src/                        # Source code
│   ├── SKILL.md               # Layer 2: Source overview
│   │
│   ├── modules/               # Business modules
│   │   ├── auth/
│   │   │   └── SKILL.md      # Layer 3: Module doc
│   │   └── user/
│   │       └── SKILL.md      # Layer 3: Module doc
│   │
│   └── core/                  # Core modules
│       └── SKILL.md          # Layer 3: Core module doc
│
├── docs/                      # Documentation center
│   ├── SKILL.md              # Docs index
│   ├── design/               # Design docs
│   ├── planning/             # Development plans
│   └── api/                  # Detailed API docs
│
└── tests/                     # Tests
    └── SKILL.md              # Test docs
```

### Hierarchy Strategy

| Layer | Location | Content | Necessity |
|-------|----------|---------|-----------|
| Layer 1 | Root | Project overview, tech stack, directory index | **Required** |
| Layer 2 | src/, docs/ | Module list, architecture | Recommended |
| Layer 3 | Specific modules | API docs, dev standards | As needed |

**Principles**:
- Maximum 3 layers, avoid too deep
- Better sparse than cluttered
- Use "helps understanding" as criterion

---

## Documentation Maintenance

### Automation Workflow

```
Code changes → Update SKILL.md → Run build-index-auto.js → Commit
```

### Git Hook Integration

```bash
# .git/hooks/pre-commit
#!/bin/sh
node build-index-auto.js
git add SKILL.index.json
```

### CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Update Index
on: [push]
jobs:
  update-index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: node build-index-auto.js
      - run: |
          git config user.name "CI Bot"
          git add SKILL.index.json
          git commit -m "chore: update index" || true
          git push
```

---

## Efficiency Comparison

### Query Efficiency

| Approach | Steps | Char Consumption | Savings |
|----------|-------|------------------|---------|
| Global search | 5+ | 15,938 | - |
| Hierarchy traversal (v1.0) | 3 | 9,536 | 40% |
| **Semantic index (v2.0)** | **2** | **~2,000** | **87%** |

### Maintenance Cost

| Approach | Manual Work | Automation |
|----------|-------------|------------|
| v1.0 | Maintain line numbers, @key markers | None |
| **v2.0** | **Only YAML header** | **Auto-extract sections + tags** |

---

## Templates

### Root SKILL.md Template

```markdown
---
name: project-name
title: Project Name
tags: [core-tag1, core-tag2, core-tag3]
---

# Project Name

## Project Overview

- **Goal**: Project objectives and vision
- **Core Features**: Main feature list
- **Target Users**: Target user groups

## Tech Stack

- **Language**: [Programming language]
- **Framework**: [Main framework]
- **Database**: [Database]
- **Other**: [Other tools]

## Project Architecture

[Overall architecture description]

## Directory Structure

### src/
Source code directory
- See: [src/SKILL.md](src/SKILL.md)

### docs/
Project documentation center
- See: [docs/SKILL.md](docs/SKILL.md)

## Quick Start

1. Clone repository
2. Install dependencies
3. Configure environment
4. Start service

## Development Standards

- Code standards: [link]
- Git standards: [link]
- AI development guide: [AI Development Guide v2](AI开发指南v2.md)
```

### Module SKILL.md Template

```markdown
---
name: module-name
title: Module Name
tags: [tag1, tag2, tag3]
---

# Module Name

> Layer: Layer N
> Parent: [Parent doc](../SKILL.md)

## Module Overview

- **Responsibility**: Main module responsibility
- **Location**: Location in project
- **Dependencies**: Other module dependencies

## Module Architecture

[Internal structure description]

## API Documentation

### ClassName

#### methodName(params): ReturnType

**Description**: Function description

**Parameters**:
- `param1` (type): Parameter description

**Returns**:
- (type): Return value description

**Usage Example**:

```language
// Example code
```

## Development Standards

### Error Handling
[Standard description]

### Logging
[Standard description]

## Dependencies

### External Dependencies
- [Library name]: Purpose

### Internal Dependencies
- [Module name]: Purpose
```

---

## Checklist

### New Project Initialization

- [ ] Create root SKILL.md (with YAML header)
- [ ] Copy build-index-auto.js to project
- [ ] Run index generation tool
- [ ] Configure Git Hook (optional)

### New Module Creation

- [ ] Create module SKILL.md (with YAML header)
- [ ] Write module overview and API docs
- [ ] Update parent SKILL.md index
- [ ] Regenerate index

### Feature Completion

- [ ] Update SKILL.md API section
- [ ] Regenerate index
- [ ] Verify example code runs

---

## Version History

### v2.0.0 (2026-01-29)
- Added YAML header format
- Added semantic index system
- Added auto-extract sections feature
- Added build-index-auto.js tool
- Language-agnostic universal solution
- 80%+ token consumption reduction

### v1.0.0 (2025-12-17)
- Initial version
- Defined SKILL.md specification
- Defined docs/ directory specification
- Provided templates and best practices

---

## References

- [Claude Code Skill Mechanism](https://github.com/anthropics/claude-code)
- [Test Report](test-framework/测试报告.md)
- [Index Tool Source](test-framework/build-index-auto.js)
