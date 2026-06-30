let categories = [];
let entries = {};
let plans = {};
let symptomMap = { activeCategoryId: "symptom", hubTitle: "症状急查", items: [] };
let dailyTasks = [];
let healthNodes = {};
let child = null;
let profile = null;
const PROFILE_STORAGE_KEY = "parenting-profile";
const defaultProfile = {
  nickname: "昕昕",
  birthDate: "2025-10-16",
  sex: "男孩",
  city: "上海",
  feedingType: "混合喂养",
  allergies: "暂无",
  currentConcerns: "辅食添加、夜醒、疫苗接种",
  vaccineCount: 4,
  checkupCount: 3,
  nextHealthNode: "9月龄儿保",
  nextHealthDate: "2026-07-05",
  nextHealthId: "checkup-9m",
  ageLabel: "8个月16天"
};
let savedProfile = getSavedProfile();
let activeKnowledgeCategoryId = "symptom";
let previousScreen = "home";
let toastTimer = 0;
const completedTaskIds = new Set();

const screens = Array.from(document.querySelectorAll(".screen"));
const navButtons = Array.from(document.querySelectorAll(".bottom-nav [data-go]"));
const categoryList = document.querySelector("#categoryList");
const entryList = document.querySelector("#entryList");
const planList = document.querySelector("#planList");
const taskList = document.querySelector("#taskList");
const detailTitle = document.querySelector("#detailTitle");
const detailBody = document.querySelector("#detailBody");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const toast = document.querySelector("#toast");
const answerCard = document.querySelector(".answer-card");
const answerTitle = document.querySelector("#answerTitle");
const answerSummary = document.querySelector(".answer-section.good p");
const answerRiskTags = document.querySelector(".answer-section.risk .risk-tags");
const answerDetailButton = document.querySelector("[data-detail]");
const answerPlanButton = document.querySelector(".related-plan [data-plan]");
const homeAgeMark = document.querySelector("#homeAgeMark");
const homeBabyLabel = document.querySelector("#homeBabyLabel");
const homeNextNodeTitle = document.querySelector("#homeNextNodeTitle");
const homeNodeLine = document.querySelector("#homeNodeLine");
const homeCheckupTitle = document.querySelector("#homeCheckupTitle");
const homeCheckupDesc = document.querySelector("#homeCheckupDesc");
const profileSummary = document.querySelector("#profileSummary");
const profileVaccineCount = document.querySelector("#profileVaccineCount");
const profileCheckupCount = document.querySelector("#profileCheckupCount");
const profileForm = document.querySelector("#profileForm");
const profileAction = document.querySelector(".profile-action");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function cleanText(value, fallback = "") {
  const text = Array.isArray(value) ? value.join("、") : String(value ?? "").trim();
  return text || fallback;
}

function asCount(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : fallback;
}

function getSavedProfile() {
  try {
    const raw = localStorage.getItem("parenting-profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.warn("读取宝宝档案失败", error);
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem("parenting-profile", JSON.stringify(profile));
  return profile;
}

function profileToQueryString(nextProfile) {
  if (!nextProfile) return "";
  const params = new URLSearchParams();
  [
    "nickname",
    "birthDate",
    "sex",
    "city",
    "feedingType",
    "allergies",
    "currentConcerns",
    "vaccineCount",
    "checkupCount",
    "nextHealthNode"
  ].forEach((key) => {
    const value = nextProfile[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeProfile(source = {}) {
  const nextNode = source.nextNode || {};
  return {
    nickname: cleanText(source.nickname, defaultProfile.nickname),
    birthDate: cleanText(source.birthDate, defaultProfile.birthDate),
    sex: cleanText(source.sex, defaultProfile.sex),
    city: cleanText(source.city, defaultProfile.city),
    feedingType: cleanText(source.feedingType, defaultProfile.feedingType),
    allergies: cleanText(source.allergies, defaultProfile.allergies),
    currentConcerns: cleanText(source.currentConcerns, defaultProfile.currentConcerns),
    vaccineCount: asCount(source.vaccineCount ?? source.vaccineDone, defaultProfile.vaccineCount),
    checkupCount: asCount(source.checkupCount ?? source.checkupDone, defaultProfile.checkupCount),
    nextHealthNode: cleanText(source.nextHealthNode || nextNode.title, defaultProfile.nextHealthNode),
    nextHealthDate: cleanText(source.nextHealthDate || nextNode.date, defaultProfile.nextHealthDate),
    nextHealthId: cleanText(source.nextHealthId || nextNode.id, defaultProfile.nextHealthId),
    ageLabel: cleanText(source.ageLabel, defaultProfile.ageLabel)
  };
}

function getAgeMark(ageLabel) {
  const monthMatch = String(ageLabel || "").match(/(\d+)个月/);
  if (monthMatch) return `${monthMatch[1]}月`;
  return ageLabel || "宝宝";
}

function buildProfileFromForm() {
  const formData = new FormData(profileForm);
  return normalizeProfile({
    ...profile,
    nickname: formData.get("nickname"),
    birthDate: formData.get("birthDate"),
    sex: formData.get("sex"),
    city: formData.get("city"),
    feedingType: formData.get("feedingType"),
    allergies: formData.get("allergies"),
    currentConcerns: formData.get("currentConcerns"),
    vaccineCount: formData.get("vaccineCount"),
    checkupCount: formData.get("checkupCount"),
    nextHealthNode: formData.get("nextHealthNode")
  });
}

function setFormValue(name, value) {
  const field = profileForm?.elements?.[name];
  if (field) field.value = value ?? "";
}

function renderProfile() {
  if (!profile) return;
  const healthTitle = profile.nextHealthNode;
  const healthDate = profile.nextHealthDate;

  if (homeAgeMark) homeAgeMark.textContent = getAgeMark(profile.ageLabel);
  if (homeBabyLabel) homeBabyLabel.textContent = `${profile.nickname} · ${profile.ageLabel}`;
  if (homeNextNodeTitle) homeNextNodeTitle.textContent = `下一个健康节点：${healthTitle}`;
  if (homeNodeLine) homeNodeLine.textContent = `城市：${profile.city} · 已打疫苗 ${profile.vaccineCount} 次`;
  if (homeCheckupTitle) homeCheckupTitle.textContent = `下次儿保 · ${healthTitle}`;
  if (homeCheckupDesc) homeCheckupDesc.textContent = healthDate ? `预约时间：${healthDate}` : `已完成儿保 ${profile.checkupCount} 次`;

  if (profileSummary) {
    const rows = [
      ["宝宝", `${profile.nickname} · ${profile.ageLabel}`],
      ["基础", `${profile.sex} · ${profile.city} · ${profile.feedingType}`],
      ["过敏", profile.allergies],
      ["关注", profile.currentConcerns],
      ["下个节点", healthDate ? `${healthTitle} · ${healthDate}` : healthTitle]
    ];
    profileSummary.innerHTML = rows.map(([label, value]) => `
      <div class="profile-row">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `).join("");
  }

  if (profileVaccineCount) profileVaccineCount.textContent = profile.vaccineCount;
  if (profileCheckupCount) profileCheckupCount.textContent = profile.checkupCount;
  if (profileAction && profile.nextHealthId) profileAction.dataset.health = profile.nextHealthId;

  setFormValue("nickname", profile.nickname);
  setFormValue("birthDate", profile.birthDate);
  setFormValue("sex", profile.sex);
  setFormValue("city", profile.city);
  setFormValue("feedingType", profile.feedingType);
  setFormValue("allergies", profile.allergies);
  setFormValue("currentConcerns", profile.currentConcerns);
  setFormValue("vaccineCount", profile.vaccineCount);
  setFormValue("checkupCount", profile.checkupCount);
  setFormValue("nextHealthNode", profile.nextHealthNode);
}

function showScreen(name) {
  const active = document.querySelector(".screen.is-active")?.dataset.screen || "home";
  if (name !== "detail") previousScreen = active;
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === name));
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.go === name));
  document.querySelector(`.screen[data-screen="${name}"]`)?.scrollTo({ top: 0 });
}

function listItems(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function mapArticle(article) {
  return {
    id: article.id,
    sectionId: article.sectionId,
    icon: article.icon || article.title.slice(0, 1),
    title: article.title,
    meta: `${article.topic || "知识百科"} · ${article.ageRange || "0-7岁"}`,
    subtitle: article.subtitle || article.summary,
    summary: article.summary,
    conclusion: article.conclusion || [],
    firstSteps: article.firstSteps || [],
    dontDo: article.dontDo || [],
    risk: article.risk || [],
    source: article.source || "来自后端 Markdown 知识库。",
    planId: article.planId,
    body: article.body,
    sourceFile: article.sourceFile
  };
}

function installAppData(payload) {
  categories = payload.categories || [];
  entries = Object.fromEntries((payload.articles || []).map((article) => [article.id, mapArticle(article)]));
  plans = Object.fromEntries((payload.plans || []).map((plan) => [plan.id, plan]));
  symptomMap = payload.symptomMap || symptomMap;
  activeKnowledgeCategoryId = symptomMap.activeCategoryId || categories[0]?.id || "symptom";
  dailyTasks = payload.dailyTasks || [];
  healthNodes = payload.healthNodes || {};
  child = payload.child || null;
  profile = normalizeProfile({
    ...defaultProfile,
    ...child,
    ...savedProfile,
    ageLabel: child?.ageLabel || savedProfile?.ageLabel || defaultProfile.ageLabel,
    nextNode: child?.nextNode
  });
}

async function loadAppData() {
  const response = await fetch(`/api/app-data${profileToQueryString(savedProfile)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API ${response.status}`);
  installAppData(await response.json());
}

function findEntryByQuery(query) {
  const q = query.trim();
  if (!q) return Object.keys(entries)[0];
  const values = Object.values(entries);
  const direct = values.find((entry) => [entry.title, entry.subtitle, entry.summary, entry.meta].join(" ").includes(q));
  if (direct) return direct.id;
  if (q.includes("发烧") || q.includes("发热")) return "fever";
  if (q.includes("咳")) return "cough";
  if (q.includes("腹泻") || q.includes("拉肚")) return "diarrhea";
  if (q.includes("呕") || q.includes("吐")) return "vomit";
  if (q.includes("疹") || q.includes("过敏")) return "rash";
  if (q.includes("辅食")) return "food";
  return symptomMap.items?.[0]?.id || values[0]?.id;
}

function openEntry(id) {
  const entry = entries[id] || Object.values(entries)[0];
  if (!entry) return;
  const relatedPlan = plans[entry.planId] || Object.values(plans)[0];
  detailTitle.textContent = "百科详情";
  detailBody.innerHTML = `
    <article class="detail-block highlight-block">
      <span class="meta">${escapeHtml(entry.meta)}</span>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.summary)}</p>
    </article>
    <article class="detail-block">
      <h3>先看结论</h3>
      <ul>${listItems(entry.conclusion)}</ul>
    </article>
    <article class="detail-block">
      <h3>先做什么</h3>
      <ol>${listItems(entry.firstSteps)}</ol>
    </article>
    <article class="detail-block caution-block">
      <h3>不要做什么</h3>
      <ul>${listItems(entry.dontDo)}</ul>
    </article>
    <article class="detail-block">
      <h3>风险信号</h3>
      <div class="risk-tags">${entry.risk.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    </article>
    <article class="detail-block related-detail">
      <div>
        <h3>相关计划</h3>
        <p>${escapeHtml(relatedPlan?.goal || "根据当前问题生成行动步骤。")}</p>
      </div>
      ${relatedPlan ? `<button class="detail-action" type="button" data-plan="${escapeHtml(relatedPlan.id)}">查看计划</button>` : ""}
    </article>
    <article class="detail-block source-block">
      <h3>来源说明</h3>
      <p>${escapeHtml(entry.source)}</p>
      <p class="source-path">${escapeHtml(entry.sourceFile || "backend")}</p>
    </article>
  `;
  showScreen("detail");
}

function openPlan(id) {
  const plan = plans[id] || Object.values(plans)[0];
  if (!plan) return;
  detailTitle.textContent = "行动计划";
  detailBody.innerHTML = `
    <article class="detail-block highlight-block">
      <span class="meta">${escapeHtml(plan.meta)} · ${escapeHtml(plan.day)}</span>
      <h3>${escapeHtml(plan.title)}</h3>
      <p>${escapeHtml(plan.goal)}</p>
      <div class="progress-track"><span style="width:${Number(plan.progress || 0)}%"></span></div>
    </article>
    <article class="detail-block">
      <h3>今天做一件事</h3>
      <ol>${listItems(plan.today)}</ol>
      <button class="detail-action" type="button" data-go="plans">回到今日辅助</button>
    </article>
    <article class="detail-block">
      <h3>准备材料</h3>
      <div class="material-list">${(plan.materials || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    </article>
    <article class="detail-block">
      <h3>阶段提醒</h3>
      <p>${escapeHtml(plan.review)}</p>
    </article>
    <article class="detail-block caution-block">
      <h3>如果没做到</h3>
      <p>${escapeHtml(plan.fallback)}</p>
    </article>
  `;
  showScreen("detail");
}

function openHealth(id) {
  const node = healthNodes[id] || Object.values(healthNodes)[0];
  if (!node) return;
  detailTitle.textContent = "健康节点";
  detailBody.innerHTML = `
    <article class="detail-block highlight-block">
      <span class="meta">${escapeHtml(node.meta)}</span>
      <h3>${escapeHtml(node.title)}</h3>
      <p>${escapeHtml(node.summary)}</p>
    </article>
    <article class="detail-block">
      <h3>要确认的事</h3>
      <ol>${listItems(node.checklist)}</ol>
    </article>
    <article class="detail-block related-detail">
      <div>
        <h3>关联内容</h3>
        <p>${escapeHtml(node.related)}</p>
      </div>
      <button class="detail-action" type="button" data-plan="solid-food">辅食计划</button>
    </article>
  `;
  showScreen("detail");
}

function renderHomeAnswer() {
  const featured = entries.fever || Object.values(entries)[0];
  if (!featured || !answerCard) return;
  answerTitle.textContent = featured.title.includes("发") ? `${featured.title}怎么判断？` : featured.title;
  answerSummary.textContent = featured.conclusion?.[0] || featured.summary;
  answerRiskTags.innerHTML = featured.risk.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  answerDetailButton.dataset.detail = featured.id;
  if (featured.planId) answerPlanButton.dataset.plan = featured.planId;
}

function renderKnowledgeMap() {
  categoryList.innerHTML = categories.map((item) => `
    <button class="map-category ${item.id === activeKnowledgeCategoryId ? "is-active" : ""}" type="button" data-category="${escapeHtml(item.id)}">
      <span>${escapeHtml(item.icon || item.title.slice(0, 1))}</span>
      <strong>${escapeHtml(item.title)}</strong>
    </button>
  `).join("");

  const activeCategory = categories.find((item) => item.id === activeKnowledgeCategoryId) || categories[0];
  const hub = document.querySelector("#mapHub");
  if (hub && activeCategory) {
    hub.innerHTML = `<span>${escapeHtml(activeCategory.icon || "诊")}</span><strong>${escapeHtml(activeCategory.title)}</strong>`;
  }

  const symptomIds = activeKnowledgeCategoryId === symptomMap.activeCategoryId
    ? (symptomMap.items || []).map((item) => item.id)
    : Object.values(entries).filter((entry) => entry.sectionId === activeKnowledgeCategoryId).map((entry) => entry.id);
  const cards = symptomIds.map((id) => entries[id]).filter(Boolean);

  entryList.innerHTML = cards.map((item) => `
    <button class="symptom-card" type="button" data-entry="${escapeHtml(item.id)}">
      <span>${escapeHtml(item.icon || item.title.slice(0, 1))}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.subtitle)}</p>
      </div>
      <b>›</b>
    </button>
  `).join("") || `<p class="empty-copy">这个分类的知识文件还没创建。</p>`;
}

const planDomainOrder = {
  early_education: 10,
  vaccine: 20,
  sleep: 30,
  safety_first_aid: 40,
  feeding_nutrition: 50,
  disease_symptom: 60
};

function getPlanDomainId(plan) {
  if (plan.domainId) return plan.domainId;
  if (plan.id === "solid-food") return "feeding_nutrition";
  if (String(plan.id || "").includes("care")) return "disease_symptom";
  return "other";
}

function sortedPlanItems() {
  return Object.values(plans).sort((a, b) => {
    const domainDelta = (planDomainOrder[getPlanDomainId(a)] || 99) - (planDomainOrder[getPlanDomainId(b)] || 99);
    if (domainDelta !== 0) return domainDelta;
    return Number(a.sortOrder || 99) - Number(b.sortOrder || 99);
  });
}

function renderPlanList() {
  const domainLabels = {
    early_education: "\u65e9\u671f\u542f\u8499",
    vaccine: "\u75ab\u82d7",
    sleep: "\u7761\u7720",
    safety_first_aid: "\u5b89\u5168\u4e0e\u6025\u6551",
    feeding_nutrition: "\u5582\u517b\u8425\u517b",
    disease_symptom: "\u75be\u75c5\u4e0e\u75c7\u72b6"
  };
  let activeDomain = "";
  planList.innerHTML = sortedPlanItems().map((item) => {
    const domainId = getPlanDomainId(item);
    const domainLabel = item.domainName || domainLabels[domainId] || "\u5176\u4ed6\u8ba1\u5212";
    const heading = domainId !== activeDomain ? `<h3 class="plan-group-title">${escapeHtml(domainLabel)}</h3>` : "";
    activeDomain = domainId;
    return `${heading}
      <button class="plan-card" type="button" data-plan="${escapeHtml(item.id)}">
        <span class="meta">${escapeHtml(item.meta)} ? ${escapeHtml(item.day)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.goal)}</p>
        <span class="progress-track"><span style="width:${Number(item.progress || 0)}%"></span></span>
      </button>`;
  }).join("");
}

function renderTasks() {
  taskList.innerHTML = dailyTasks.map((task) => {
    const done = completedTaskIds.has(task.id);
    const targetAttr = task.planId ? `data-plan="${escapeHtml(task.planId)}"` : `data-health="${escapeHtml(task.healthId)}"`;
    return `
      <article class="task-card ${done ? "is-done" : ""}">
        <button class="task-check" type="button" data-task="${escapeHtml(task.id)}" aria-pressed="${done}">${done ? "✓" : ""}</button>
        <div>
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(task.desc)}</p>
        </div>
        <button class="task-link" type="button" ${targetAttr}>详情</button>
      </article>
    `;
  }).join("");
}

function render() {
  renderHomeAnswer();
  renderKnowledgeMap();

  renderPlanList();

  renderTasks();
  renderProfile();
}

document.addEventListener("click", (event) => {
  const task = event.target.closest("[data-task]");
  const resetTasks = event.target.closest("[data-reset-tasks]");
  const detail = event.target.closest("[data-detail]");
  const category = event.target.closest("[data-category]");
  const showAll = event.target.closest("[data-show-all]");
  const go = event.target.closest("[data-go]");
  const entry = event.target.closest("[data-entry]");
  const plan = event.target.closest("[data-plan]");
  const health = event.target.closest("[data-health]");
  const query = event.target.closest("[data-query]");
  const back = event.target.closest("[data-back]");

  if (task) {
    const id = task.dataset.task;
    if (completedTaskIds.has(id)) completedTaskIds.delete(id);
    else completedTaskIds.add(id);
    renderTasks();
    showToast(completedTaskIds.has(id) ? "已标记完成" : "已取消完成");
    return;
  }

  if (resetTasks) {
    completedTaskIds.clear();
    renderTasks();
    showToast("今日任务已重置");
    return;
  }

  if (query) {
    searchInput.value = query.dataset.query;
    openEntry(findEntryByQuery(query.dataset.query));
    return;
  }

  if (category) {
    activeKnowledgeCategoryId = category.dataset.category;
    renderKnowledgeMap();
  }

  if (showAll) {
    activeKnowledgeCategoryId = symptomMap.activeCategoryId || activeKnowledgeCategoryId;
    renderKnowledgeMap();
    showToast("已展开当前知识地图");
  }

  if (detail) openEntry(detail.dataset.detail);
  if (go) showScreen(go.dataset.go);
  if (entry) openEntry(entry.dataset.entry);
  if (plan) openPlan(plan.dataset.plan);
  if (health) openHealth(health.dataset.health);
  if (back) showScreen(previousScreen === "detail" ? "home" : previousScreen);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = findEntryByQuery(searchInput.value);
  if (id) openEntry(id);
});

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nextProfile = buildProfileFromForm();
  savedProfile = saveProfile(nextProfile);
  profile = nextProfile;
  renderProfile();

  try {
    await loadAppData();
    render();
    showToast("宝宝档案已保存");
  } catch (error) {
    console.error(error);
    renderProfile();
    showToast("已本地保存，稍后刷新月龄");
  }
});

try {
  await loadAppData();
  render();
} catch (error) {
  console.error(error);
  profile = normalizeProfile(savedProfile || defaultProfile);
  renderProfile();
  detailBody.innerHTML = `<article class="detail-block caution-block"><h3>知识库加载失败</h3><p>请确认后端 /api/app-data 可访问。</p></article>`;
  showToast("知识库加载失败");
}