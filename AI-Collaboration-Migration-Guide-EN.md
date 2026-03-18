# AI Collaboration Migration Guide

> Gradually migrate existing projects to AI collaboration documentation system

## Quick Decision

| Your Situation | Read This |
|----------------|-----------|
| New project, from scratch | 👉 [Setup Guide](AI协作文档建系指南.md) |
| Existing project, need migration | ✅ This guide |
| Just want technical specs | 👉 [Documentation Standard v2](项目文档规范标准v2.md) |

---

# 1. Core Objective

Migration goal is not documentation beautification, but **AI collaboration enablement**:

- Enable AI to understand existing projects more stably
- Reduce AI's reliance on global guessing when modifying
- Transform project knowledge from "only senior devs know" to "documented and indexed"
- Reduce AI's structural damage to legacy projects

---

# 2. Migration Process Overview

```
Stage 1: Project Assessment
  ├─ AI scans project structure
  └─ Identify migration priorities ✓

Stage 2: Build Minimum Skeleton
  ├─ Add root SKILL.md
  ├─ Add directory-level SKILL.md
  └─ Add 2-5 key modules ✓

Stage 3: Generate Index & Use
  ├─ Generate SKILL.index.json
  └─ AI works by system ✓

Stage 4: Develop & Expand
  └─ Continuously update docs ✓
```

**Minimum migration**: Root SKILL.md + src/SKILL.md + docs/SKILL.md + 2-5 key modules + index

---

# 3. Core Principles

## Principle 1: Don't try to complete entire project at once
Most dangerous approach:
- Add `SKILL.md` to all directories at once
- Let AI mass-generate module docs
- Try to rewrite all docs

**Result**: Many half-finished docs, system messier than before, AI lost in docs instead of code.

**Correct approach**: Staged, cover only highest-value context nodes.

## Principle 2: Serve AI collaboration first, completeness second
Priority coverage:
- Core modules
- High-change modules
- Complex-dependency modules
- Modules AI easily mismodifies

## Principle 3: Describe current state first, optimize gradually
Don't write "hoped future state" as "current state".

Docs should describe reality first, mark future plans when necessary.

## Principle 4: AI drafts & scans, human confirms boundaries
- **AI handles**: Discovery, drafting, organizing
- **Human handles**: Judgment, trimming, boundary definition

---

# 4. Key Checklists

## Stage 1 Checklist: Project Assessment

- [ ] Core directories and source core identified
- [ ] Most complex modules identified
- [ ] AI-prone misjudgment areas identified
- [ ] Migration priorities divided (high/medium/low)
- [ ] **Assessment complete** ✓

## Stage 2 Checklist: Build Minimum Skeleton

- [ ] Root SKILL.md completed
- [ ] src/SKILL.md completed
- [ ] docs/SKILL.md completed
- [ ] 2-5 key module docs completed
- [ ] **Minimum skeleton ready** ✓

## Stage 3 Checklist: Generate Index & Use

- [ ] SKILL.index.json generated
- [ ] AI starts locating code by index
- [ ] **Index system available** ✓

## Stage 4 Checklist: Develop & Expand

- [ ] Docs updated after each development
- [ ] Index regenerated regularly
- [ ] **Continuous maintenance** ✓

---

# 5. Detailed Stages

## Stage 1: Project Assessment

### Step 1: AI scans project structure

Let AI answer:
- What are core directories in root?
- Which directories are source core?
- Which modules most complex?
- Where does AI easily misjudge?

**Goal**: Identify high-value context nodes.

### Step 2: Identify migration priorities

#### Highest priority
- Core business modules
- High-frequency change modules
- Complex-dependency modules
- Easy-to-mismodify modules

#### Medium priority
- Important directory navigation
- docs classification navigation
- Public infrastructure modules

#### Lower priority
- Edge directories
- Rarely-touched legacy code
- Temporary tool directories

---

## Stage 2: Build Minimum Skeleton

### Step 3: Add root SKILL.md

At minimum explain:
- Project goals
- Tech stack
- Core directories
- Main modules
- Current project boundaries

### Step 4: Add directory-level SKILL.md

Priority:
- `src/SKILL.md`
- `docs/SKILL.md`
- If needed: `tests/`, `config/`, `scripts/`, etc.

**Goal**: Build "second-layer navigation", not detailed encyclopedia.

### Step 5: Add 2-5 key modules

Pick most critical modules (e.g., auth, user, payment), each with minimum docs:
- Responsibility
- Location
- Dependencies
- Main APIs/capabilities

**Key**: Once this core layer is built, AI performance improves significantly.

---

## Stage 3: Generate Index & Use

### Step 6: Generate index

```bash
node build-index-auto.js
```

This moment marks transition from "docs exist" to "AI can actually use".

### Step 7: AI works by system

From this stage, AI should prioritize:
1. Read index first
2. Locate module
3. Read related docs
4. Read code last

---

## Stage 4: Develop & Expand

### Step 8: Continuous updates

Each time developing/fixing/refactoring:
- Update relevant docs
- Update module responsibilities
- Update API descriptions
- Regenerate index

**Key**: System grows naturally, not by one-time cleanup.

---

# 6. Common 5 Pitfalls

## Pitfall 1: Spread docs everywhere at once
End up with many half-finished docs, no one maintains.

## Pitfall 2: Write ideal architecture as current state
Docs don't match code, AI continues mismodifying.

## Pitfall 3: Only write project overview, not module docs
AI still gets lost at core module level.

## Pitfall 4: Migrate once, never update
First migration serious, then project changes, docs obsolete again.

## Pitfall 5: Keep old docs, add new docs
End up with duplicate conflicting explanations, AI confused either way.

---

# 7. Summary

Migration key is not "write more docs", but:

- Identify most critical context nodes
- Build minimum viable system first
- Serve AI collaboration stability first
- Let docs faithfully describe current state
- Continuously expand and update during development

**Minimum migration**: Root SKILL.md + src/SKILL.md + docs/SKILL.md + 2-5 key modules + index

This is more realistic and more likely to succeed than "spread across entire project at once".
