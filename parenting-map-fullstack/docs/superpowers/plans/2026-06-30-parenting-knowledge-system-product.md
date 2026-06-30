# Parenting Knowledge System Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 12-domain parenting knowledge system into product taxonomy, backend APIs, and mobile UI.

**Architecture:** Markdown remains the current content store, but its structure should mirror future database tables: domains, subdomains, articles, plans, profile, health nodes, and recommendation rules. The frontend must consume API payloads only and must not hard-code knowledge categories.

**Tech Stack:** Node.js ESM server, Markdown + JSON frontmatter, vanilla HTML/CSS/JS mobile prototype, Playwright QA with local Chrome.

---

## File Structure

- Create: `parenting-map-fullstack/data/knowledge/domains/*.md` - 12 first-level domains and subdomains.
- Modify: `parenting-map-fullstack/server.js` - load domains, articles, plans from Markdown and expose APIs.
- Modify: `parenting-map-fullstack/public/index.html` - remove home quick entry and add editable baby profile fields.
- Modify: `parenting-map-fullstack/public/app.js` - render taxonomy, profile, and plan categories from APIs.
- Modify: `parenting-map-fullstack/public/styles.css` - profile form, taxonomy map, and plan category styling.
- Modify: `parenting-map-fullstack/design-qa.md` - final visual and API QA evidence.

## Task 1: Create 12 Domain Files

**Files:**
- Create: `parenting-map-fullstack/data/knowledge/domains/growth-development.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/feeding-nutrition.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/daily-care.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/sleep.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/disease-symptom.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/medication-safety.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/vaccine.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/early-education.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/mental-health.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/safety-first-aid.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/maternal-health.md`
- Create: `parenting-map-fullstack/data/knowledge/domains/special-needs.md`

- [ ] **Step 1: Add domain frontmatter**

Each file uses this shape:

```md
---
{
  "id": "growth_development",
  "name": "生长发育",
  "description": "身高体重、大运动、精细动作、语言发展、认知发展、社交情感",
  "priority": "P0",
  "sortOrder": 10,
  "subdomains": [
    { "id": "growth_height_weight", "name": "身高体重", "aliases": ["生长曲线", "体重", "身高"] }
  ]
}
---
# 生长发育
```

- [ ] **Step 2: Verify all 12 domains exist**

Run:

```powershell
Get-ChildItem data\knowledge\domains -Filter *.md | Measure-Object
```

Expected: `Count : 12`.

## Task 2: Backend Domain API

**Files:**
- Modify: `parenting-map-fullstack/server.js`

- [ ] **Step 1: Load domain Markdown files**

Extend `loadMarkdownKnowledge()` to read `data/knowledge/domains` and return `domains` sorted by `sortOrder`.

- [ ] **Step 2: Add `/api/domains`**

```js
if (url.pathname === "/api/domains") {
  sendJson(response, 200, markdownKnowledge.domains);
  return true;
}
```

- [ ] **Step 3: Verify API**

Run:

```powershell
Invoke-WebRequest -UseBasicParsing 'http://localhost:4173/api/domains'
```

Expected: 200 response with 12 domains.

## Task 3: Editable Baby Profile

**Files:**
- Modify: `parenting-map-fullstack/public/index.html`
- Modify: `parenting-map-fullstack/public/app.js`
- Modify: `parenting-map-fullstack/public/styles.css`

- [ ] **Step 1: Add fields**

Add editable fields for nickname, birth date, sex, city, feeding type, allergies, current concerns, vaccine count, checkup count, and next health node.

- [ ] **Step 2: Persist locally**

Use `localStorage.setItem("parenting-profile", JSON.stringify(profile))` on save. On load, read it and send as query parameters to `/api/app-data`.

- [ ] **Step 3: Verify**

Change birth date and nickname, save, reload. Expected: home and profile use the saved values.

## Task 4: Home IA Cleanup

**Files:**
- Modify: `parenting-map-fullstack/public/index.html`
- Modify: `parenting-map-fullstack/public/app.js`

- [ ] **Step 1: Remove home quick-entry block**

Remove the fixed “常见问题 · 快速入口” block from home.

- [ ] **Step 2: Keep home focused**

Home should show search, child summary, selected recommendation, current plan, and next health node.

- [ ] **Step 3: Verify screenshot**

Capture 390 x 844. Expected: no quick-entry grid on home.

## Task 5: Plan System Expansion

**Files:**
- Create: `parenting-map-fullstack/data/knowledge/plans/early-language-14d.md`
- Create: `parenting-map-fullstack/data/knowledge/plans/vaccine-before-after.md`
- Create: `parenting-map-fullstack/data/knowledge/plans/sleep-routine-7d.md`
- Create: `parenting-map-fullstack/data/knowledge/plans/home-safety-check.md`
- Modify: `parenting-map-fullstack/public/app.js`

- [ ] **Step 1: Add early education plan**

Add a 14-day language or parent-child interaction plan under `early_education`.

- [ ] **Step 2: Add vaccine plan**

Add a before/after vaccine plan under `vaccine`.

- [ ] **Step 3: Group plans by domain**

Render early education and vaccine plans before symptom care plans.

## Task 6: Verification

**Files:**
- Modify: `parenting-map-fullstack/design-qa.md`

- [ ] **Step 1: Syntax checks**

```powershell
& 'D:\tool\node\node.exe' --check server.js
& 'D:\tool\node\node.exe' --check public/app.js
```

Expected: exit code 0.

- [ ] **Step 2: API checks**

```powershell
Invoke-WebRequest -UseBasicParsing 'http://localhost:4173/api/app-data'
Invoke-WebRequest -UseBasicParsing 'http://localhost:4173/api/domains'
```

Expected: 200 responses.

- [ ] **Step 3: Visual QA**

Capture home, knowledge map, profile edit, plans, and plan detail at 390 x 844. Update `design-qa.md` with `final result: passed` only when no P0/P1/P2 findings remain.