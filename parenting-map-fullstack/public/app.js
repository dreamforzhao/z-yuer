const state = {
  profile: null,
  today: null,
  articles: [],
  products: [],
  care: null,
  learning: [],
  previousView: "today"
};

const elements = {
  views: Array.from(document.querySelectorAll(".view")),
  navButtons: Array.from(document.querySelectorAll("[data-nav]")),
  bottomButtons: Array.from(document.querySelectorAll(".bottom-nav [data-nav]")),
  avatar: document.querySelector("#childAvatar"),
  form: document.querySelector("#profileForm"),
  birthDate: document.querySelector("#birthDate"),
  sex: document.querySelector("#sex"),
  city: document.querySelector("#city"),
  profileStatus: document.querySelector("#profileStatus"),
  ageLine: document.querySelector("#ageLine"),
  stageBadge: document.querySelector("#stageBadge"),
  dailyList: document.querySelector("#dailyList"),
  stageCards: document.querySelector("#stageCards"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  searchResults: document.querySelector("#searchResults"),
  articleList: document.querySelector("#articleList"),
  productList: document.querySelector("#productList"),
  careTimeline: document.querySelector("#careTimeline"),
  learningList: document.querySelector("#learningList"),
  sleepStage: document.querySelector("#sleepStage"),
  sleepList: document.querySelector("#sleepList"),
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

function profileQuery() {
  const params = new URLSearchParams({
    birthDate: elements.birthDate.value,
    sex: elements.sex.value,
    city: elements.city.value
  });
  return params.toString();
}

function showView(view) {
  state.previousView = document.querySelector(".view.is-active")?.dataset.view || "today";
  elements.views.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === view);
  });
  elements.bottomButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === view);
  });
  document.querySelector(`.view[data-view="${view}"]`)?.scrollTo({ top: 0 });
}

function setContainer(container, html) {
  container.innerHTML = html;
}

function renderLoading(container, text = "正在加载") {
  setContainer(container, `<div class="empty">${text}</div>`);
}

function renderError(container, message) {
  setContainer(container, `<div class="error">${message}</div>`);
}

function renderProfile() {
  const profile = state.profile;
  elements.birthDate.value = profile.birthDate;
  elements.sex.value = profile.sex;
  elements.city.value = profile.city;
  elements.avatar.textContent = profile.nickname.slice(0, 1);
}

function renderToday() {
  const data = state.today;
  elements.ageLine.textContent = `${data.age.label} · ${data.child.sex} · ${data.child.city}`;
  elements.stageBadge.textContent = data.stage;
  elements.profileStatus.textContent = "推荐已更新";

  elements.dailyList.innerHTML = data.today.map((item) => `
    <article class="daily-item">
      <strong>${item.topic}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");

  elements.stageCards.innerHTML = data.cards.map((title, index) => {
    const target = index === 1 ? "care" : index === 2 ? "products" : "articles";
    return `
      <article class="mini-card">
        <h3>${title}</h3>
        <p>${index === 0 ? "先看结论，再看图文步骤。" : index === 1 ? "结合国家规则和本地门诊提醒。" : "从要不要用、怎么选、怎么用开始。"}
        </p>
        <button class="action-btn" type="button" data-nav="${target}">查看</button>
      </article>
    `;
  }).join("");

  elements.sleepStage.textContent = `${data.age.label} · ${data.stage}`;
  elements.sleepList.innerHTML = data.sleep.map((item) => `<li>${item}</li>`).join("");
}

function renderArticles() {
  elements.articleList.innerHTML = state.articles.map((article) => `
    <article class="row-card">
      <h3>${article.title}</h3>
      <p>${article.topic} · ${article.ageRange}</p>
      <p>${article.summary[0]}</p>
      <button class="action-btn" type="button" data-article-id="${article.id}">阅读</button>
    </article>
  `).join("");
}

function renderProducts() {
  elements.productList.innerHTML = state.products.map((product) => `
    <article class="row-card">
      <h3>${product.title}</h3>
      <p>${product.category} · ${product.necessity} · ${product.ageRange}</p>
      <p>${product.selectionCriteria.slice(0, 2).join("；")}</p>
      <button class="action-btn" type="button" data-product-id="${product.id}">查看用法</button>
    </article>
  `).join("");
}

function renderCare() {
  const items = state.care.items;
  elements.careTimeline.innerHTML = items.map((item) => `
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

function renderLearning() {
  elements.learningList.innerHTML = state.learning.map((path) => `
    <article class="row-card">
      <h3>${path.title}</h3>
      <p>${path.ageRange}</p>
      <p>${path.lessons.join("、")}</p>
    </article>
  `).join("");
}

async function loadToday() {
  elements.profileStatus.textContent = "更新中";
  state.today = await request(`/api/today?${profileQuery()}`);
  renderToday();
}

async function loadCare() {
  renderLoading(elements.careTimeline, "正在加载儿保时间轴");
  state.care = await request(`/api/care-schedule?${profileQuery()}`);
  renderCare();
}

async function openArticle(id) {
  const article = await request(`/api/articles/${encodeURIComponent(id)}`);
  elements.detailTitle.textContent = article.title;
  elements.detailPanel.innerHTML = `
    <article class="detail-card">
      <p class="eyebrow">${article.topic} · ${article.ageRange}</p>
      <h3>先记住这 3 句</h3>
      <ul>${article.summary.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-card">
      <h3>家庭步骤</h3>
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
  elements.detailTitle.textContent = product.title;
  elements.detailPanel.innerHTML = `
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
    elements.searchResults.innerHTML = "";
    return;
  }
  renderLoading(elements.searchResults, "正在查找相关内容");
  const data = await request(`/api/search?q=${encodeURIComponent(query)}`);
  if (!data.results.length) {
    elements.searchResults.innerHTML = `<div class="empty">没有找到完全匹配内容，会建议运营后台补充这个问题。</div>`;
    return;
  }
  elements.searchResults.innerHTML = data.results.map((item) => `
    <article class="result-card">
      <h3>${item.title}</h3>
      <p>${item.subtitle}</p>
      <button class="action-btn" type="button" data-result-type="${item.type}" data-result-id="${item.id}">打开</button>
    </article>
  `).join("");
}

async function bootstrap() {
  try {
    state.profile = await request("/api/children/demo");
    renderProfile();
    renderLoading(elements.dailyList);
    renderLoading(elements.stageCards);
    await Promise.all([
      loadToday(),
      request("/api/articles").then((data) => { state.articles = data; renderArticles(); }),
      request("/api/products").then((data) => { state.products = data; renderProducts(); }),
      loadCare(),
      request("/api/learning-paths").then((data) => { state.learning = data; renderLearning(); })
    ]);
  } catch (error) {
    renderError(elements.dailyList, error.message);
  }
}

elements.navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.nav));
});

elements.form.addEventListener("change", async () => {
  try {
    await Promise.all([loadToday(), loadCare()]);
  } catch (error) {
    elements.profileStatus.textContent = "更新失败";
  }
});

elements.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await runSearch(elements.searchInput.value);
  } catch (error) {
    renderError(elements.searchResults, error.message);
  }
});

document.addEventListener("click", async (event) => {
  const navButton = event.target.closest("[data-nav]");
  const articleButton = event.target.closest("[data-article-id]");
  const productButton = event.target.closest("[data-product-id]");
  const resultButton = event.target.closest("[data-result-type]");

  if (navButton && !elements.navButtons.includes(navButton)) {
    showView(navButton.dataset.nav);
  }

  if (articleButton) {
    await openArticle(articleButton.dataset.articleId);
  }

  if (productButton) {
    await openProduct(productButton.dataset.productId);
  }

  if (resultButton) {
    const type = resultButton.dataset.resultType;
    const id = resultButton.dataset.resultId;
    if (type === "article") await openArticle(id);
    if (type === "product") await openProduct(id);
    if (type === "care") showView("care");
    if (type === "learning") showView("learning");
  }
});

elements.detailBack.addEventListener("click", () => {
  showView(state.previousView === "detail" ? "today" : state.previousView);
});

bootstrap();
