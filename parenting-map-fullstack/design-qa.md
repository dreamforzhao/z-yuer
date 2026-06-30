# Parenting Map Design QA

## Product Design v7 Polish

This iteration keeps the v6 IA (`宝宝档案`, `育儿百科`, `健康守护`) and improves the mobile visual system rather than changing product scope.

## v7 What Changed

- Added a `design-polish-v7` layer so the current design can be distinguished from older v4/v5/v6 experiments.
- Polished the baby archive home surface with softer medical-green panels, clearer hierarchy, and tighter card spacing.
- Fixed the recommendation card grid so summaries sit beside their badges instead of being squeezed into the left column.
- Improved the 390px mobile layout:
  - archive metrics use two columns plus a full-width checkup card
  - search input and submit button stack cleanly on mobile
  - bottom navigation uses compact icon labels
- Added visible focus states and lightweight press feedback for interactive controls.

## v7 Verification

| Check | Result |
|---|---|
| `node --check server.js` | passed |
| `node --check public/app.js` | passed |
| `node --check public/redesign.js` | passed |
| Local HTTP `GET /` | 200 |
| Browser screenshot | `qa/current-home-after-final-wide.png` captured with local Chrome |

## v7.1 Browser Comment Fixes

- Removed the duplicate in-page `育儿百科 / 健康守护` segmented switch. The bottom navigation is now the only primary switch.
- Replaced the knowledge long-list layout with a two-column topic grid.
- Reworked `健康守护` into compact symptom quick chips plus topic grid cards.
- Verified in the Codex in-app browser:
  - `.knowledge-switch-v6` count: `0`
  - encyclopedia grid: two columns
  - health grid: two columns
  - `健康守护` bottom nav updates the page title and visible panel

## v8 Reference-Inspired Polish

- Reworked `宝宝档案` from count fields into maintainable records:
  - vaccine nodes are now individually selectable
  - checkups are recorded by date, month age, weight, and height
  - the old vaccine/checkup count inputs are removed
  - health timeline is reduced to one next-checkup date card
- Reworked knowledge surfaces toward the provided native-app references:
  - encyclopedia uses grouped category buttons
  - health uses compact article rows and quick chips
  - heavy feature cards are avoided on list-heavy pages
- Verified in the Codex in-app browser:
  - vaccine rows: `11`
  - selected vaccine rows: `4`
  - checkup records: `4`
  - count inputs in profile form: `0`
  - knowledge category grid: three columns

## v8.1 Open-Design Content Alignment

- Removed `返回` from bottom-nav primary pages.
- Knowledge pages now render from actual Markdown articles only:
  - `症状急查`: 咳嗽、腹泻、发热、皮疹、呕吐
  - `喂养营养`: 辅食添加顺序
- Removed placeholder/future domain categories from the visible encyclopedia.
- Removed duplicate quick-chip section from `健康守护`.
- Verified in the Codex in-app browser:
  - visible back buttons on knowledge page: `0`
  - encyclopedia groups: `2`
  - health article rows: `5`
  - duplicate health quick chips: `0`

## v8.2 Home Simplification

- Removed the home `今日推荐 / 先看这 3 件事` block.
- Verified in the Codex in-app browser:
  - home recommendation cards: `0`
  - home answer cards: `0`
  - search panel still present: `1`
  - archive summary still present: `1`

## v8.3 Profile Field Simplification

- Removed the `城市` field from profile editing and saved query sync.
- Removed city text from archive/profile summaries.
- Verified in the Codex in-app browser:
  - city inputs: `0`
  - city labels: `0`

## v8.4 Health Guard Deduplication

- Product Design pass: `健康守护` now has one content pattern only, the article list backed by real Markdown symptom entries.
- Added a CSS guard to hide stale duplicate health quick/category/domain blocks if old DOM appears during refresh.
- Verified in the Codex in-app browser:
  - health article rows: `5`
  - health quick blocks: `0`
  - health category groups: `0`
  - health domain panels: `0`

## Product Design v6 Scope

This iteration changes the main IA to three primary entries only: `宝宝档案`, `育儿百科`, and `健康守护`.

`健康守护` groups the health-related domains together: `疾病与症状`, `用药安全`, `疫苗`, `心理健康`, `安全与急救`, and `妈妈健康`. `宝宝档案` becomes the default home surface and now emphasizes the child's real profile: height, weight, checkup records, and vaccinated items.

## What Changed

- Bottom navigation now has three entries only: `宝宝档案`, `育儿百科`, `健康守护`.
- The old `首页 / 知识库 / 计划 / 我的` IA is replaced by a domain-oriented IA.
- Home is redesigned as a baby archive dashboard:
  - baby age and next health node
  - current height and weight
  - checkup count and latest checkup record
  - vaccinated item list
  - three recommended actions for today
- Knowledge screen now has two panels:
  - `育儿百科`: growth, feeding, daily care, sleep, early education, and special needs.
  - `健康守护`: disease/symptom, medication safety, vaccine, mental health, safety/first aid, and maternal health.
- Profile edit screen is also reframed around archive data, with height, weight, checkup, and vaccine summary.

## Data Source

- Domains and articles: `GET /api/app-data`.
- Height, weight, and checkup records: `GET /api/growth-records`.
- Vaccine schedule and completed vaccine nodes: `GET /api/care-schedule`.
- Current clickable article ids: `food`, `fever`, `cough`, `diarrhea`, `rash`, `vomit`.

## Verification

| Check | Result |
|---|---|
| `node --check server.js` | passed |
| `node --check public/app.js` | passed |
| `node --check public/redesign.js` | passed |
| `GET /api/app-data` | 200, 12 domains and 6 articles |
| `GET /api/growth-records` | 200, height `70.5`, weight `8.4`, 4 checkup records |
| `GET /api/care-schedule` | 200, 5 age-eligible vaccine nodes |
| Static assertion | `宝宝档案`, `育儿百科`, `健康守护`, `身长`, `体重`, `已接种` present in `public/redesign.js` |
| Static assertion | health domain ids present: `disease_symptom`, `medication_safety`, `vaccine`, `mental_health`, `safety_first_aid`, `maternal_health` |
| Browser screenshot / DOM dump | skipped: local Chrome escalation was rejected by usage-limit review |

## Findings

- P0/P1/P2: none found from syntax, API, and static IA checks.
- P3: `public/redesign.js` is still an enhancement layer over the original prototype. Once this three-entry IA is accepted, fold it into base HTML/app code and remove old v4/v5 CSS blocks.

## Final Result

Passed with screenshot verification skipped due usage-limit rejection.
