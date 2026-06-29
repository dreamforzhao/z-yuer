import {
  articles as offlineArticles,
  careSchedule as offlineCareSchedule,
  checkupRecords as offlineCheckupRecords,
  childProfile as offlineChildProfile,
  encyclopediaSections as offlineEncyclopediaSections,
  products as offlineProducts,
  stageRules as offlineStageRules
} from "./offline-data.js";
const state = {
  profile: null,
  home: null,
  encyclopedia: [],
  care: null,
  growth: null,
  knowledge: null,
  previousView: "home"
};

const fields = {
  nickname: document.querySelector("#nickname"),
  birthDate: document.querySelector("#birthDate"),
  sex: document.querySelector("#sex"),
  feedingType: document.querySelector("#feedingType"),
  birthWeightKg: document.querySelector("#birthWeightKg"),
  birthLengthCm: document.querySelector("#birthLengthCm"),
  currentWeightKg: document.querySelector("#currentWeightKg"),
  currentHeightCm: document.querySelector("#currentHeightCm")
};

const el = {
  views: Array.from(document.querySelectorAll(".view")),
  bottomButtons: Array.from(document.querySelectorAll(".bottom-nav [data-nav]")),
  childAvatar: document.querySelector("#childAvatar"),
  homeTitle: document.querySelector("#homeTitle"),
  ageLine: document.querySelector("#ageLine"),
  stageBadge: document.querySelector("#stageBadge"),
  profileStatus: document.querySelector("#profileStatus"),
  insightList: document.querySelector("#insightList"),
  commonEntrances: document.querySelector("#commonEntrances"),
  knowledgeRoadmap: document.querySelector("#knowledgeRoadmap"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  searchResults: document.querySelector("#searchResults"),
  trackList: document.querySelector("#trackList"),
  categoryGrid: document.querySelector("#categoryGrid"),
  categoryTabs: Array.from(document.querySelectorAll(".category-tabs [data-section-id]")),
  sectionDetail: document.querySelector("#sectionDetail"),
  sectionTitle: document.querySelector("#sectionTitle"),
  sectionSubtitle: document.querySelector("#sectionSubtitle"),
  sectionTags: document.querySelector("#sectionTags"),
  sectionItems: document.querySelector("#sectionItems"),
  closeSection: document.querySelector("#closeSection"),
  careTimeline: document.querySelector("#careTimeline"),
  growthAge: document.querySelector("#growthAge"),
  metricGrid: document.querySelector("#metricGrid"),
  growthAdvice: document.querySelector("#growthAdvice"),
  recordList: document.querySelector("#recordList"),
  detailTitle: document.querySelector("#detailTitle"),
  detailPanel: document.querySelector("#detailPanel"),
  detailBack: document.querySelector("#detailBack")
};


const iconPaths = {
  feeding: '<path d="M6 5c5 1 8 5 8 10a5 5 0 0 1-8 4c-3-2-3-7 0-14z"/><path d="M14 8c2-2 4-3 6-3 0 4-2 7-6 8"/>',
  health: '<path d="M12 5v14"/><path d="M5 12h14"/><path d="M7.5 4.5h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z"/>',
  sleep: '<path d="M18 15.5A7 7 0 0 1 8.5 6 8 8 0 1 0 18 15.5z"/><path d="M16.5 5.5h3l-3 4h3"/>',
  growth: '<path d="M5 19h14"/><path d="M7 16l4-4 3 3 5-7"/><path d="M15 8h4v4"/>',
  behavior: '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M5 19c1.5-3 4.5-4.5 7-4.5S17.5 16 19 19"/>',
  gear: '<path d="M7 8h10l1.5 11h-13z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M9 13h6"/>',
  school: '<path d="M4 9l8-4 8 4-8 4z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/>',
  parents: '<path d="M12 20s-7-4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6-7 10-7 10z"/>',
  article: '<path d="M7 4.5h7l3 3V19.5H7z"/><path d="M14 4.5V8h3"/><path d="M9 12h6"/><path d="M9 15h5"/>'
};

const entryIcons = {
  feeding: 'feeding',
  growth: 'growth',
  care: 'health',
  sleep: 'sleep',
  gear: 'gear',
  'fever-home': 'health',
  'food-8m': 'feeding',
  'feeding-month-guide': 'feeding',
  'vaccine-checkup': 'health',
  'sleep-routine': 'sleep',
  'sleep-night-waking': 'sleep',
  'car-seat': 'gear',
  behavior: 'behavior'
};

function svgIcon(name) {
  const path = iconPaths[name] || iconPaths.article;
  return `<span class="ui-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${path}</svg></span>`;
}
const offlineToday = new Date("2026-06-28T00:00:00+08:00");

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateAge(birthDate) {
  const birth = new Date(`${birthDate}T00:00:00+08:00`);
  if (Number.isNaN(birth.getTime()) || birth > offlineToday) {
    return { months: 0, days: 0, label: "出生日期无效" };
  }

  let months = (offlineToday.getFullYear() - birth.getFullYear()) * 12 + offlineToday.getMonth() - birth.getMonth();
  if (offlineToday.getDate() < birth.getDate()) months -= 1;

  const monthBase = new Date(birth);
  monthBase.setMonth(birth.getMonth() + months);
  const days = Math.max(0, Math.floor((offlineToday - monthBase) / 86400000));
  return { months, days, label: `${months}个月${days}天` };
}

function getStage(ageMonths) {
  return offlineStageRules.find((stage) => ageMonths <= stage.maxMonth) || offlineStageRules.at(-1);
}

function getCareStatus(ageMonths, nodeAge) {
  if (ageMonths > nodeAge) return "done";
  if (Math.abs(ageMonths - nodeAge) <= 1) return "current";
  return "upcoming";
}

function profileFromSearchParams(searchParams) {
  return {
    ...offlineChildProfile,
    nickname: searchParams.get("nickname") || offlineChildProfile.nickname,
    birthDate: searchParams.get("birthDate") || offlineChildProfile.birthDate,
    sex: searchParams.get("sex") || offlineChildProfile.sex,
    city: searchParams.get("city") || offlineChildProfile.city,
    feedingType: searchParams.get("feedingType") || offlineChildProfile.feedingType,
    birthWeightKg: asNumber(searchParams.get("birthWeightKg"), offlineChildProfile.birthWeightKg),
    birthLengthCm: asNumber(searchParams.get("birthLengthCm"), offlineChildProfile.birthLengthCm),
    currentWeightKg: asNumber(searchParams.get("currentWeightKg"), offlineChildProfile.currentWeightKg),
    currentHeightCm: asNumber(searchParams.get("currentHeightCm"), offlineChildProfile.currentHeightCm),
    latestCheckupDate: searchParams.get("latestCheckupDate") || offlineChildProfile.latestCheckupDate
  };
}

function hydrateArticle(article) {
  if (!article) return article;
  return {
    ...article,
    learning: offlineArticleLearningMeta[article.id] || null
  };
}

function buildKnowledgePayload() {
  return {
    tracks: offlineKnowledgeTracks,
    decisionTools: offlineDecisionTools,
    sourceNote: "健康内容优先采用权威机构资料整理，产品内展示来源和审核状态。"
  };
}

function getRecommendedLessons(age) {
  const health = offlineKnowledgeTracks.find((track) => track.id === "health-foundation");
  const feeding = offlineKnowledgeTracks.find((track) => track.id === "feeding-foundation");
  const sleep = offlineKnowledgeTracks.find((track) => track.id === "sleep-behavior-foundation");
  if (age.months < 12) return [feeding.modules[0], health.modules[0], health.modules[1]];
  if (age.months < 36) return [feeding.modules[2], sleep.modules[2], health.modules[1]];
  return [sleep.modules[2], health.modules[1], sleep.modules[1]];
}
function buildGrowthAdvice(profile, age) {
  const weightGain = Math.max(0, profile.currentWeightKg - profile.birthWeightKg);
  const heightGain = Math.max(0, profile.currentHeightCm - profile.birthLengthCm);
  const monthlyWeightGain = age.months > 0 ? weightGain / age.months : weightGain;
  const monthlyHeightGain = age.months > 0 ? heightGain / age.months : heightGain;

  const advice = [
    `出生 ${profile.birthWeightKg}kg / ${profile.birthLengthCm}cm，当前 ${profile.currentWeightKg}kg / ${profile.currentHeightCm}cm。`,
    `累计增长约 ${weightGain.toFixed(1)}kg、${heightGain.toFixed(1)}cm，平均每月约 ${monthlyWeightGain.toFixed(2)}kg、${monthlyHeightGain.toFixed(1)}cm。`
  ];

  if (profile.currentWeightKg <= profile.birthWeightKg && age.months > 1) {
    advice.push("当前体重没有超过出生体重，请尽快结合儿保或儿科医生评估。");
  } else if (monthlyWeightGain < 0.25 && age.months <= 12) {
    advice.push("近似月均体重增长偏慢，建议复核喂养量、辅食摄入和儿保曲线。");
  } else {
    advice.push("单次数据只看趋势，不做诊断；建议每次儿保都记录同一套身高体重数据。");
  }

  return {
    weightGainKg: Number(weightGain.toFixed(2)),
    heightGainCm: Number(heightGain.toFixed(1)),
    monthlyWeightGainKg: Number(monthlyWeightGain.toFixed(2)),
    monthlyHeightGainCm: Number(monthlyHeightGain.toFixed(1)),
    advice
  };
}

function buildHome(profile) {
  const age = calculateAge(profile.birthDate);
  const stage = getStage(age.months);
  const growth = buildGrowthAdvice(profile, age);
  const feedingTips = stage.feeding[profile.feedingType] || stage.feeding["混合喂养"];
  const carePreview = offlineCareSchedule
    .map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
    .filter((item) => item.status !== "done")
    .slice(0, 3);

  return {
    child: profile,
    age,
    stage: stage.stage,
    focus: stage.focus,
    feedingTips,
    growth,
    carePreview,
    commonEntrances: [
      { title: "月龄辅食", target: "feeding-month-guide", type: "article" },
      { title: "辅食开吃", target: "feeding-6m-start", type: "article" },
      { title: "发热判断", target: "fever-home", type: "article" },
      { title: "疫苗儿保", target: "vaccine-checkup", type: "article" },
      { title: "哄睡夜醒", target: "sleep-night-waking", type: "article" },
      { title: "用品评测", target: "gear", type: "section" },
      { title: "情绪行为", target: "behavior", type: "section" },
      { title: "安全座椅", target: "car-seat", type: "product" }
    ]
  };
}

function buildEncyclopedia() {
  return offlineEncyclopediaSections.map((section) => ({
    ...section,
    articles: offlineArticles.filter((article) => article.sectionId === section.id).map(hydrateArticle),
    products: offlineProducts.filter((product) => product.sectionId === section.id)
  }));
}

function searchOffline(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches = [];

  if (q === "体重" || q === "身高" || q === "身长" || q.includes("身高体重")) {
    return [{ type: "view", id: "growth", title: "身高体重记录", subtitle: "记录出生和每次儿保数据" }];
  }

  for (const section of offlineEncyclopediaSections) {
    const haystack = [section.title, section.subtitle, ...section.items].join(" ").toLowerCase();
    if (haystack.includes(q)) matches.push({ type: "section", id: section.id, title: section.title, subtitle: section.subtitle });
  }

  for (const article of offlineArticles) {
    const learning = offlineArticleLearningMeta[article.id];
    const deepText = learning ? [learning.keyQuestion, learning.principle, ...learning.learningGoals, ...learning.commonMistakes].join(" ") : "";
    const haystack = [article.title, article.topic, article.ageRange, ...article.summary, deepText].join(" ").toLowerCase();
    const intentMatch =
      ((q.includes("月龄") || q.includes("怎么做")) && article.id === "feeding-month-guide") ||
      (q.includes("辅食") && article.id === "food-8m") ||
      ((q.includes("发烧") || q.includes("发热")) && article.id === "fever-home") ||
      ((q.includes("哄睡") || q.includes("睡前")) && article.id === "sleep-routine") ||
      ((q.includes("夜醒") || q.includes("睡眠倒退")) && article.id === "sleep-night-waking") ||
      ((q.includes("发脾气") || q.includes("不听话") || q.includes("打人")) && article.id === "tantrum-2y");
    if (haystack.includes(q) || intentMatch) matches.push({ type: "article", id: article.id, title: article.title, subtitle: article.topic });
  }

  for (const product of offlineProducts) {
    const haystack = [product.title, product.category, product.necessity, ...product.selectionCriteria].join(" ").toLowerCase();
    const intentMatch =
      ((q.includes("座椅") || q.includes("提篮")) && product.id === "car-seat") ||
      ((q.includes("尿不湿") || q.includes("纸尿裤") || q.includes("拉拉裤") || q.includes("红屁屁")) && product.id === "diaper") ||
      ((q.includes("餐椅") || q.includes("餐具") || q.includes("围兜")) && product.id === "high-chair");
    if (haystack.includes(q) || intentMatch) matches.push({ type: "product", id: product.id, title: product.title, subtitle: product.category });
  }

  if (q.includes("疫苗") || q.includes("儿保") || q.includes("体检")) {
    matches.unshift({ type: "article", id: "vaccine-checkup", title: "疫苗和儿保日程", subtitle: "健康 · 本地门诊确认" });
  }

  const seen = new Set();
  return matches.filter((item) => {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

function offlineRequest(path) {
  const url = new URL(path, window.location.origin === "null" ? "http://offline.local" : window.location.origin);
  const profile = profileFromSearchParams(url.searchParams);
  const age = calculateAge(profile.birthDate);

  if (url.pathname === "/api/children/demo") return offlineChildProfile;
  if (url.pathname === "/api/home" || url.pathname === "/api/today") return buildHome(profile);
  if (url.pathname === "/api/encyclopedia") return buildEncyclopedia();
  if (url.pathname === "/api/knowledge") return buildKnowledgePayload();
  if (url.pathname.startsWith("/api/articles/")) return hydrateArticle(offlineArticles.find((item) => item.id === decodeURIComponent(url.pathname.split("/").at(-1))));
  if (url.pathname.startsWith("/api/products/")) return offlineProducts.find((item) => item.id === decodeURIComponent(url.pathname.split("/").at(-1)));
  if (url.pathname === "/api/care-schedule") {
    return {
      city: profile.city,
      age,
      records: offlineCheckupRecords,
      items: offlineCareSchedule.map((item) => ({ ...item, status: getCareStatus(age.months, item.ageMonth) }))
    };
  }
  if (url.pathname === "/api/growth-records") return { profile, age, growth: buildGrowthAdvice(profile, age), records: offlineCheckupRecords };
  if (url.pathname === "/api/search") {
    const query = url.searchParams.get("q") || "";
    return { query, results: searchOffline(query) };
  }

  throw new Error("离线模式暂不支持这个接口");
}

async function request(path) {
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch(path, { headers: { Accept: "application/json" } });
      if (response.ok) return response.json();
    } catch {
      // Fall through to embedded data for APK/file usage.
    }
  }
  return offlineRequest(path);
}

function queryFromForms() {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, field]) => {
    if (field) params.set(key, field.value);
  });
  return params.toString();
}

function showView(view) {
  const current = document.querySelector(".view.is-active")?.dataset.view || "home";
  if (view !== "detail") state.previousView = current;

  el.views.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === view);
  });

  el.bottomButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === view && !button.dataset.sectionId);
  });

  document.querySelector(`.view[data-view="${view}"]`)?.scrollTo({ top: 0 });
}

function setHtml(container, html) {
  container.innerHTML = html;
}

function renderLoading(container, text = "正在加载") {
  setHtml(container, `<div class="empty">${text}</div>`);
}

function fillProfile(profile) {
  fields.nickname.value = profile.nickname || "";
  fields.birthDate.value = profile.birthDate;
  fields.sex.value = profile.sex;
  fields.feedingType.value = profile.feedingType;
  fields.birthWeightKg.value = profile.birthWeightKg;
  fields.birthLengthCm.value = profile.birthLengthCm;
  fields.currentWeightKg.value = profile.currentWeightKg;
  fields.currentHeightCm.value = profile.currentHeightCm;
  el.childAvatar.textContent = (profile.nickname || "宝").slice(0, 1);
}

function findArticleTitle(articleId) {
  const article = offlineArticles.find((item) => item.id === articleId);
  return article?.title || articleId;
}

function renderTrackCards(tracks) {
  return tracks.map((track) => `
    <article class="track-card">
      <div>
        <p class="eyebrow">${track.level} · ${track.lessonCount} 节</p>
        <h3>${track.title}</h3>
        <p>${track.subtitle}</p>
      </div>
      <div class="progress-line" aria-label="学习进度"><span style="width:${Math.round(track.progress * 100)}%"></span></div>
      <ul>${track.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
      <button class="action-btn" type="button" data-section-id="${track.sectionId}">进入课程</button>
    </article>
  `).join("");
}
function renderHome() {
  const data = state.home;
  const childName = data.child.nickname || "宝宝";
  el.homeTitle.textContent = `${childName}的知识地图`;
  el.childAvatar.textContent = childName.slice(0, 1);
  el.ageLine.textContent = `${data.age.label} · ${data.child.sex} · ${data.child.feedingType}`;
  el.stageBadge.textContent = data.stage;
  el.profileStatus.textContent = "已按月龄更新";

  const lessonCards = data.recommendedLessons.map((lesson) => `
    <article class="lesson-card">
      <p class="eyebrow">${lesson.minutes} 分钟 · 今日学习</p>
      <h3>${lesson.title}</h3>
      <p>${findArticleTitle(lesson.articleId)}</p>
      <button class="action-btn" type="button" data-article-id="${lesson.articleId}">开始学习</button>
    </article>
  `).join("");

  el.knowledgeRoadmap.innerHTML = `
    <div class="lesson-strip">${lessonCards}</div>
    <div class="track-mini-grid">
      ${data.knowledgeTracks.slice(0, 2).map((track) => `
        <button type="button" data-section-id="${track.sectionId}">
          <strong>${track.title}</strong>
          <span>${track.outcomes.join(" / ")}</span>
        </button>
      `).join("")}
    </div>
  `;

  const insightItems = [
    { title: "本月能力", text: data.focus[0] },
    { title: "喂养重点", text: data.feedingTips[0] }
  ].filter((item) => item.text);

  el.insightList.innerHTML = insightItems.map((item) => `
    <article class="insight-card compact">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");

  const decisionEntries = data.decisionTools.map((tool) => ({
    title: tool.title,
    target: tool.articleId,
    type: "article"
  }));
  const entries = [...decisionEntries, ...data.commonEntrances].slice(0, 8);
  el.commonEntrances.innerHTML = entries.map((item) => `
    <button type="button" data-entry-type="${item.type}" data-entry-target="${item.target}">
      ${svgIcon(entryIcons[item.target] || item.target)}
      <span>${item.title}</span>
    </button>
  `).join("");
}
function renderEncyclopedia() {
  const tracks = state.knowledge?.tracks || state.home?.knowledgeTracks || [];
  el.trackList.innerHTML = renderTrackCards(tracks);
  el.categoryGrid.innerHTML = state.encyclopedia.map((section) => `
    <button class="category-card" type="button" data-section-id="${section.id}">
      ${svgIcon(section.id)}
      <strong>${section.title}</strong>
      <small>${section.subtitle}</small>
    </button>
  `).join("");
}
function renderSection(sectionId) {
  const section = state.encyclopedia.find((item) => item.id === sectionId);
  if (!section) return;

  el.sectionDetail.hidden = false;
  el.categoryTabs.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.sectionId === sectionId);
  });
  el.bottomButtons.forEach((button) => {
    const isColumn = button.dataset.sectionId === sectionId;
    const isHome = button.dataset.nav === "home" && sectionId === "home";
    button.classList.toggle("is-active", isColumn || isHome);
  });

  el.sectionTitle.textContent = section.title;
  el.sectionSubtitle.textContent = section.subtitle;
  el.sectionTags.innerHTML = section.items.map((item) => `<span>${item}</span>`).join("");

  const articleCards = section.articles.map((article) => `
    <article class="row-card content-card">
      <p class="eyebrow">${article.ageRange}</p>
      <h3>${article.title}</h3>
      <p>${article.summary[0]}</p>
      <button class="action-btn" type="button" data-article-id="${article.id}">看步骤</button>
    </article>
  `);
  const productCards = section.products.map((product) => `
    <article class="row-card content-card">
      <p class="eyebrow">${product.category} · ${product.necessity}</p>
      <h3>${product.title}</h3>
      <p>${product.verdict || product.selectionCriteria[0]}</p>
      <button class="action-btn" type="button" data-product-id="${product.id}">看评测</button>
    </article>
  `);

  el.sectionItems.innerHTML = [...articleCards, ...productCards].join("") || `<div class="empty">这个分类的内容还在补充。</div>`;
  showView("encyclopedia");
  window.setTimeout(() => el.sectionDetail.scrollIntoView({ block: "start", behavior: "smooth" }), 0);
}

function renderCare() {
  el.careTimeline.innerHTML = state.care.items.map((item) => `
    <li class="${item.status}">
      <span>${item.label}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p>以当地社区卫生服务中心确认为准</p>
      </div>
    </li>
  `).join("");
}

function renderGrowth() {
  const data = state.growth;
  el.growthAge.textContent = data.age.label;
  el.metricGrid.innerHTML = `
    <article><strong>${data.profile.birthWeightKg}kg</strong><span>出生体重</span></article>
    <article><strong>${data.profile.birthLengthCm}cm</strong><span>出生体长</span></article>
    <article><strong>${data.profile.currentWeightKg}kg</strong><span>本次体重</span></article>
    <article><strong>${data.profile.currentHeightCm}cm</strong><span>本次身长</span></article>
  `;
  el.growthAdvice.innerHTML = data.growth.advice.map((text) => `
    <article class="insight-card">
      <strong>趋势建议</strong>
      <p>${text}</p>
    </article>
  `).join("");
  el.recordList.innerHTML = data.records.map((record) => `
    <article class="record-card">
      <strong>${record.ageMonth}月龄</strong>
      <div>
        <p>${record.date} · ${record.weightKg}kg / ${record.heightCm}cm</p>
        <p>${record.note}</p>
      </div>
    </article>
  `).join("");
}

async function loadPersonalized() {
  el.profileStatus.textContent = "更新中";
  const query = queryFromForms();
  const [home, care, growth] = await Promise.all([
    request(`/api/home?${query}`),
    request(`/api/care-schedule?${query}`),
    request(`/api/growth-records?${query}`)
  ]);
  state.home = home;
  state.care = care;
  state.growth = growth;
  renderHome();
  renderCare();
  renderGrowth();
}

async function openArticle(id) {
  const article = await request(`/api/articles/${encodeURIComponent(id)}`);
  const learning = article.learning;
  el.detailTitle.textContent = article.title;
  if (!learning) {
    el.detailPanel.innerHTML = `
      <article class="detail-card">
        <p class="eyebrow">${article.topic} · ${article.ageRange}</p>
        <h3>先看结论</h3>
        <ul>${article.summary.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="detail-card">
        <h3>怎么做</h3>
        <ol>${article.steps.map((item) => `<li>${item}</li>`).join("")}</ol>
      </article>
      <section class="risk-box"><h3>需要警惕</h3><p>${article.risks.join("、")} 时建议咨询医生。</p></section>
    `;
    showView("detail");
    return;
  }

  el.detailPanel.innerHTML = `
    <article class="study-hero detail-card">
      <p class="eyebrow">${learning.depth} · ${learning.readingMinutes} 分钟 · ${learning.sourceLevel}</p>
      <h3>${learning.keyQuestion}</h3>
      <p>${learning.principle}</p>
      <div class="goal-list">${learning.learningGoals.map((item) => `<span>${item}</span>`).join("")}</div>
    </article>
    <article class="detail-card">
      <h3>先看结论</h3>
      <ul>${article.summary.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-card framework-card">
      <h3>${learning.decisionFramework.title}</h3>
      <ol>${learning.decisionFramework.points.map((item) => `<li>${item}</li>`).join("")}</ol>
    </article>
    <article class="detail-card">
      <h3>怎么做</h3>
      <ol>${article.steps.map((item) => `<li>${item}</li>`).join("")}</ol>
    </article>
    <section class="risk-box">
      <h3>需要警惕</h3>
      <p>${article.risks.join("、")} 时建议咨询医生。</p>
    </section>
    <article class="detail-card">
      <h3>常见误区</h3>
      <ul>${learning.commonMistakes.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-card">
      <h3>场景案例</h3>
      <ul>${learning.cases.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-card">
      <h3>学完能做到</h3>
      <div class="check-list">${learning.checkpoints.map((item) => `<span>${item}</span>`).join("")}</div>
    </article>
    <article class="detail-card">
      <h3>来源与延伸</h3>
      ${learning.citations.map((link) => `<a class="resource-link" href="${link.url}" target="_blank" rel="noreferrer">${link.title}</a>`).join("")}
      ${article.resources.length ? article.resources.map((link) => `<a class="resource-link secondary" href="${link.url}" target="_blank" rel="noreferrer">${link.title}</a>`).join("") : ""}
    </article>
  `;
  showView("detail");
}
async function openProduct(id) {
  const product = await request(`/api/products/${encodeURIComponent(id)}`);
  el.detailTitle.textContent = product.title;
  el.detailPanel.innerHTML = `
    <article class="detail-card">
      <p class="eyebrow">${product.category} · ${product.necessity}</p>
      <h3>先看总结</h3>
      <p>${product.verdict || "先按适用年龄、使用场景和安全风险判断，不只看品牌。"}</p>
      <p>适用年龄：${product.ageRange}</p>
    </article>
    <article class="detail-card">
      <h3>怎么选</h3>
      <ul>${product.selectionCriteria.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-card">
      <h3>怎么用</h3>
      <ol>${product.usageSteps.map((item) => `<li>${item}</li>`).join("")}</ol>
    </article>
    <section class="risk-box">
      <h3>常见错误</h3>
      <p>${product.commonMistakes.join("、")}</p>
    </section>
    <article class="detail-card">
      <h3>视频链接</h3>
      ${product.videoLinks.map((link) => `<a class="resource-link" href="${link.url}" target="_blank" rel="noreferrer">${link.title}</a>`).join("")}
    </article>
  `;
  showView("detail");
}

async function runSearch(query) {
  if (!query.trim()) {
    el.searchResults.innerHTML = "";
    return;
  }

  renderLoading(el.searchResults, "正在查找相关内容");
  const data = await request(`/api/search?q=${encodeURIComponent(query)}`);
  if (!data.results.length) {
    el.searchResults.innerHTML = `<div class="empty">没有找到完全匹配内容，会建议后台补充这个问题。</div>`;
    return;
  }
  el.searchResults.innerHTML = data.results.map((item) => `
    <article class="result-card">
      <h3>${item.title}</h3>
      <p>${item.subtitle}</p>
      <button class="action-btn" type="button" data-result-type="${item.type}" data-result-id="${item.id}">打开</button>
    </article>
  `).join("");
}

async function bootstrap() {
  state.profile = await request("/api/children/demo");
  state.knowledge = await request("/api/knowledge");
  state.encyclopedia = await request("/api/encyclopedia");
  fillProfile(state.profile);
  renderEncyclopedia();
  await loadPersonalized();
}

let updateTimer;

function schedulePersonalizedUpdate() {
  window.clearTimeout(updateTimer);
  el.profileStatus.textContent = "更新中";
  updateTimer = window.setTimeout(() => {
    loadPersonalized().catch(() => {
      el.profileStatus.textContent = "更新失败";
    });
  }, 250);
}

document.addEventListener("click", async (event) => {
  const quickSearch = event.target.closest("[data-query]");
  if (quickSearch) {
    el.searchInput.value = quickSearch.dataset.query;
  }
  const navButton = event.target.closest("[data-nav]");
  const entryButton = event.target.closest("[data-entry-type]");
  const sectionButton = event.target.closest("[data-section-id]");
  const articleButton = event.target.closest("[data-article-id]");
  const productButton = event.target.closest("[data-product-id]");
  const resultButton = event.target.closest("[data-result-type]");

  if (navButton) showView(navButton.dataset.nav);

  if (entryButton) {
    const type = entryButton.dataset.entryType;
    const target = entryButton.dataset.entryTarget;
    if (type === "view") showView(target);
    if (type === "section") renderSection(target);
    if (type === "article") await openArticle(target);
  }

  if (sectionButton) renderSection(sectionButton.dataset.sectionId);
  if (articleButton) await openArticle(articleButton.dataset.articleId);
  if (productButton) await openProduct(productButton.dataset.productId);

  if (resultButton) {
    const type = resultButton.dataset.resultType;
    const id = resultButton.dataset.resultId;
    if (type === "view") showView(id);
    if (type === "section") renderSection(id);
    if (type === "article") await openArticle(id);
    if (type === "product") await openProduct(id);
  }
});

document.querySelector("#profileForm").addEventListener("input", schedulePersonalizedUpdate);
document.querySelector("#profileForm").addEventListener("change", schedulePersonalizedUpdate);
document.querySelector("#growthForm").addEventListener("input", schedulePersonalizedUpdate);
document.querySelector("#growthForm").addEventListener("change", schedulePersonalizedUpdate);

el.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await runSearch(el.searchInput.value);
  } catch (error) {
    el.searchResults.innerHTML = `<div class="error">${error.message}</div>`;
  }
});

el.closeSection.addEventListener("click", () => {
  el.sectionDetail.hidden = true;
});

el.detailBack.addEventListener("click", () => {
  showView(state.previousView === "detail" ? "home" : state.previousView);
});

bootstrap().catch((error) => {
  el.insightList.innerHTML = `<div class="error">${error.message}</div>`;
});
