# Parenting Map Design QA

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
