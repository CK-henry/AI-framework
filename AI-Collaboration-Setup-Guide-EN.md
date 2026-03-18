# AI Collaboration Documentation Setup Guide

> Build AI-ready project documentation from scratch

## Quick Decision

| Your Situation | Read This |
|----------------|-----------|
| New project, minimal code | ✅ This guide |
| Existing project needs docs | 👉 [Migration Guide](AI协作旧项目迁移指南.md) |
| Just want technical specs | 👉 [Documentation Standard v2](项目文档规范标准v2.md) |

---

# 1. Core Objective

Building a documentation system is not about writing more docs.

It's about:
- Enabling AI to stably participate in large projects
- Reducing context confusion
- Reducing token consumption
- Improving AI code modification accuracy
- Making AI output understandable and maintainable

**Essence**: Transform project knowledge from chat history and mental models into structured, searchable, maintainable engineering memory.

---

# 2. Process Overview

```
Stage 1: Product & Tech Definition
  ├─ Discuss product goals
  ├─ Define tech stack
  └─ Freeze project boundaries ✓

Stage 2: Build Documentation Skeleton
  ├─ Deliver AI development guide
  ├─ AI generates skeleton draft
  └─ Human confirms skeleton ✓

Stage 3: Expand Key Documents
  ├─ Expand core module docs
  └─ Generate index ✓

Stage 4: Enter Development
  ├─ Check execution threshold
  ├─ Develop by plan
  └─ Continuously update docs ✓
```

---

# 3. Detailed Process

## Stage 1: Product & Tech Definition

### Step 1: Discuss product goals with AI

Clarify:
- What problem does the project solve
- Final objectives
- Target users
- Core features

### Step 2: Discuss technical approach with AI

Clarify:
- Programming language
- Framework
- Database
- Deployment method
- Key infrastructure

### Step 3: Freeze project definition

Form current version of:
- Product scope
- Tech stack
- Initial module division
- What to defer

**Key**: This is boundary confirmation before entering setup phase, avoiding requirement changes mid-documentation.

---

## Stage 2: Build Documentation Skeleton

### Step 4: Deliver AI development guide

Provide [AI Development Guide v2](AI开发指南v2.md) and project planning docs to AI.

### Step 5: AI generates skeleton draft

Generate skeleton first, don't fill everything:
- Root `SKILL.md`
- Core directory-level `SKILL.md`
- Core module list
- docs classification structure
- Initial development plan framework

### Step 6: Human confirms skeleton

Focus on:
- Is directory hierarchy reasonable
- Is module division reasonable
- Any obvious responsibility confusion
- Which modules to write first, which later

**Key**: Confirm structure before AI expansion to avoid massive rework.

---

## Stage 3: Expand Key Documents

### Step 7: Expand core documents

Priority expansion:
- Root `SKILL.md`
- `src/SKILL.md`
- Key modules (e.g., auth, user, payment)
- Planning docs
- Core design docs

**Note**: Don't fill all directories at once.

### Step 8: Generate index

```bash
node build-index-auto.js
```

Generate `SKILL.index.json`, system becomes truly "AI-usable".

---

## Stage 4: Enter Development

### Step 9: Check execution threshold

At minimum confirm:
- Core modules have documentation
- Boundaries clear
- Tech stack frozen
- Development plan can be broken into tasks
- Index available

### Step 10: Develop by plan

Now AI is not running blind, but working under structure, planning, and documentation constraints.

### Step 11: Continuously update docs

**Key principle**: System doesn't stop after setup, must evolve with project.

---

# 4. Key Checklists

## Stage 1 Checklist: Product & Tech Definition

- [ ] Product goals clarified (problem, target users)
- [ ] Core feature scope determined
- [ ] Tech stack selected (language, framework, database)
- [ ] Initial module division completed
- [ ] Deferred content listed
- [ ] **Project definition frozen** ✓

## Stage 2 Checklist: Build Documentation Skeleton

- [ ] AI development guide delivered to AI
- [ ] Root SKILL.md draft generated
- [ ] Core directory SKILL.md drafts generated
- [ ] Core module list confirmed
- [ ] Directory hierarchy reasonable, no obvious confusion
- [ ] **Skeleton human-confirmed** ✓

## Stage 3 Checklist: Expand Key Documents

- [ ] Root SKILL.md expansion completed
- [ ] src/SKILL.md completed
- [ ] 2-5 key module docs completed
- [ ] Planning docs completed
- [ ] SKILL.index.json generated
- [ ] **Index available** ✓

## Stage 4 Checklist: Enter Development

- [ ] Core module docs ready
- [ ] Module boundaries clear
- [ ] Development plan breakable into tasks
- [ ] Index system working
- [ ] **Execution threshold met** ✓

---

# 5. Core Principles

## Principle 1: Always build minimum viable system first
Don't add `SKILL.md` to every directory from the start.

Cover first:
- Project root
- Core source directory
- Core business modules
- Modules AI easily mismodifies

## Principle 2: Always confirm module boundaries before AI expansion
Don't let AI mass-generate module docs when boundaries unclear.

## Principle 3: Planning docs must evolve with documentation system
Don't let planning docs and `SKILL.md` diverge.

## Principle 4: Development requires "core docs ready"
Starting large-scale development before docs stabilize leads to rework.

---

# 6. Summary

The setup process is:

**Define → Setup → Expand → Index → Execute → Continuously Update**

This guide formalizes this into a solid workflow.
