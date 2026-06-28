const state = {
  profile: null,
  home: null,
  encyclopedia: [],
  care: null,
  growth: null,
  previousView: "home"
};

const fields = {
  birthDate: document.querySelector("#birthDate"),
  sex: document.querySelector("#sex"),
  city: document.querySelector("#city"),
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
  ageLine: document.querySelector("#ageLine"),
  stageBadge: document.querySelector("#stageBadge"),
  profileStatus: document.querySelector("#profileStatus"),
  insightList: document.querySelector("#insightList"),
  commonEntrances: document.querySelector("#commonEntrances"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  searchResults: document.querySelector("#searchResults"),
  categoryGrid: document.querySelector("#categoryGrid"),
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

async function request(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`);
  }
  return response.json();
}

function queryFromForms() {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, field]) => {
    params.set(key, field.value);
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
    button.classList.toggle("is-active", button.dataset.nav === view);
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
  fields.birthDate.value = profile.birthDate;
  fields.sex.value = profile.sex;
  fields.city.value = profile.city;
  fields.feedingType.value = profile.feedingType;
  fields.birthWeightKg.value = profile.birthWeightKg;
  fields.birthLengthCm.value = profile.birthLengthCm;
  fields.currentWeightKg.value = profile.currentWeightKg;
  fields.currentHeightCm.value = profile.currentHeightCm;
  el.childAvatar.textContent = profile.nickname.slice(0, 1);
}

function renderHome() {
  const data = state.home;
  el.ageLine.textContent = `${data.age.label} · ${data.child.sex} · ${data.child.city} · ${data.child.feedingType}`;
  el.stageBadge.textContent = data.stage;
  el.profileStatus.textContent = "建议已更新";

  const insightItems = [
    ...data.growth.advice.map((text) => ({ title: "身高体重", text })),
    ...data.feedingTips.map((text) => ({ title: "喂养方式", text })),
    ...data.focus.slice(0, 3).map((text) => ({ title: "阶段重点", text }))
  ];

  el.insightList.innerHTML = insightItems.map((item) => `
    <article class="insight-card">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");

  el.commonEntrances.innerHTML = data.commonEntrances.map((item) => `
    <button type="button" data-entry-type="${item.type}" data-entry-target="${item.target}">
      <span>${item.title}</span>
    </button>
  `).join("");
}

function renderEncyclopedia() {
  el.categoryGrid.innerHTML = state.encyclopedia.map((section) => `
    <button class="category-card" type="button" data-section-id="${section.id}">
      <span>${section.icon}</span>
      <strong>${section.title}</strong>
      <small>${section.subtitle}</small>
    </button>
  `).join("");
}

function renderSection(sectionId) {
  const section = state.encyclopedia.find((item) => item.id === sectionId);
  if (!section) return;

  el.sectionDetail.hidden = false;
  el.sectionTitle.textContent = section.title;
  el.sectionSubtitle.textContent = section.subtitle;
  el.sectionTags.innerHTML = section.items.map((item) => `<span>${item}</span>`).join("");

  const articleCards = section.articles.map((article) => `
    <article class="row-card">
      <h3>${article.title}</h3>
      <p>${article.topic} · ${article.ageRange}</p>
      <button class="action-btn" type="button" data-article-id="${article.id}">查看</button>
    </article>
  `);
  const productCards = section.products.map((product) => `
    <article class="row-card">
      <h3>${product.title}</h3>
      <p>${product.category} · ${product.necessity}</p>
      <button class="action-btn" type="button" data-product-id="${product.id}">查看</button>
    </article>
  `);

  el.sectionItems.innerHTML = [...articleCards, ...productCards].join("") || `<div class="empty">这个分类的内容还在补充。</div>`;
  showView("encyclopedia");
}

function renderCare() {
  el.careTimeline.innerHTML = state.care.items.map((item) => `
    <li class="${item.status}">
      <span>${item.label}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p>${state.care.city} · 以当地社区卫生服务中心确认为准</p>
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
  el.detailTitle.textContent = article.title;
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
    <section class="risk-box">
      <h3>需要警惕</h3>
      <p>${article.risks.join("、")} 时建议咨询医生。</p>
    </section>
    <article class="detail-card">
      <h3>延伸学习</h3>
      ${article.resources.length ? article.resources.map((link) => `<a class="resource-link" href="${link.url}" target="_blank" rel="noreferrer">${link.title}</a>`).join("") : "<p>暂无外部链接，待专家审核后补充。</p>"}
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
      <h3>要不要用</h3>
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
