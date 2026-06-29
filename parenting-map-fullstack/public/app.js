const categories = [
  { id: "fever", badge: "热", title: "发烧", desc: "先看月龄、精神、饮水和尿量" },
  { id: "food", badge: "辅", title: "辅食喂养", desc: "添加顺序、过敏观察、拒食处理" },
  { id: "sleep", badge: "眠", title: "夜醒/睡眠", desc: "先排查不适，再调整作息" },
  { id: "vaccine", badge: "苗", title: "疫苗接种", desc: "接种前后注意事项和节点提醒" },
  { id: "cough", badge: "咳", title: "咳嗽流鼻涕", desc: "看呼吸、精神和持续时间" },
  { id: "more", badge: "全", title: "更多问题", desc: "护理、行为、入园和日常安全" }
];

const entries = {
  fever: {
    title: "发烧怎么判断？",
    meta: "症状急查 · 0-7岁",
    summary: "腋下体温 ≥ 37.5℃ 为发热。体温只是一个指标，精神状态、呼吸、饮水、尿量和皮疹同样重要。",
    conclusion: ["3个月以下宝宝发热建议尽快咨询医生。", "精神状态好、能喝水、尿量正常时，多数可以先观察和护理。", "≥38.5℃ 或明显不适时，按医生建议或药品说明处理。"],
    risk: ["抽搐", "呼吸急促/费力", "明显嗜睡", "皮疹不褪色", "持续高热超过3天"],
    planId: "fever-care"
  },
  food: {
    title: "辅食添加顺序怎么安排？",
    meta: "喂养问题 · 6-12月龄",
    summary: "辅食不是越复杂越好。先从富铁、软烂、单一食材开始，重点是练习吞咽和观察过敏。",
    conclusion: ["每次只新增一种食材，连续观察 2-3 天。", "6月龄以泥糊为主，7-9月龄逐步增加颗粒和手指食物。", "奶仍然是重要营养来源，不要因为辅食焦虑而强迫进食。"],
    risk: ["明显过敏", "反复呕吐", "吞咽困难", "体重增长明显放缓"],
    planId: "solid-food"
  },
  sleep: {
    title: "夜醒频繁先排查什么？",
    meta: "睡眠问题 · 0-5岁",
    summary: "先排查发热、鼻塞、湿疹、出牙、饥饿和白天作息，再谈睡眠调整。",
    conclusion: ["记录连续 3 天入睡时间、夜醒次数和白天小睡。", "夜间回应保持低刺激，避免每次都升级成开灯玩耍。", "如果伴随呼吸异常、持续打鼾或白天明显嗜睡，优先咨询医生。"],
    risk: ["呼吸异常", "持续打鼾", "白天精神差", "体重增长异常"],
    planId: "sleep-routine"
  },
  vaccine: {
    title: "疫苗接种前后注意什么？",
    meta: "疫苗体检 · 健康节点",
    summary: "疫苗和儿保都属于健康节点管理。记录完成次数，按本地门诊安排确认下一次。",
    conclusion: ["接种前确认近期是否发热、过敏史和用药情况。", "接种后观察精神、呼吸、皮疹、发热持续时间和局部反应。", "最终以当地接种门诊和社区卫生服务中心为准。"],
    risk: ["呼吸困难", "严重过敏表现", "持续高热", "精神反应差"],
    planId: "vaccine-care"
  },
  cough: {
    title: "咳嗽流鼻涕要不要就医？",
    meta: "症状急查 · 呼吸道",
    summary: "咳嗽本身不是唯一判断标准，要看呼吸是否费力、精神和饮水情况。",
    conclusion: ["精神好、能吃能睡时，多数可以先护理和观察。", "保持空气湿润，少量多次补水。", "不要自行给小月龄宝宝使用成人止咳药。"],
    risk: ["喘憋", "口唇发紫", "呼吸明显费力", "小月龄发热", "精神差"],
    planId: "cold-care"
  },
  more: {
    title: "更多育儿问题怎么查？",
    meta: "知识百科 · 全部分类",
    summary: "按问题场景进入，比按大栏目找文章更快。每个问题都优先提供结论、风险和行动建议。",
    conclusion: ["从搜索进入具体问题。", "收藏高频问题，方便下次直接查看。", "能执行的内容会推荐对应行动计划。"],
    risk: ["信息来源不明", "只看经验贴", "忽略就医信号"],
    planId: "starter"
  }
};

const plans = {
  "solid-food": {
    title: "辅食计划 · 8-9月龄",
    meta: "14天 · 每天一件事",
    goal: "帮助宝宝从泥糊过渡到软烂颗粒，练习咀嚼和自主进食。",
    today: ["准备一种软烂碎菜", "白天精神好时尝试 2-3 小勺", "观察皮疹、呕吐、腹泻等反应"],
    fallback: "如果宝宝拒绝，不追喂。隔 2 天换形态再试。"
  },
  "fever-care": {
    title: "发热护理计划",
    meta: "3天观察 · 按风险升级",
    goal: "帮助家长记录关键观察点，知道何时继续护理、何时就医。",
    today: ["记录体温和时间", "观察精神、呼吸、饮水和尿量", "出现风险信号及时就医"],
    fallback: "如果判断不清，优先咨询儿科医生。"
  },
  "sleep-routine": {
    title: "睡前流程计划",
    meta: "7天 · 稳定作息",
    goal: "建立固定、短、可重复的睡前流程，减少夜间拉扯。",
    today: ["固定开始时间", "洗澡、读书、关灯保持同一顺序", "夜醒时低刺激回应"],
    fallback: "如果有打鼾、呼吸暂停样表现，先咨询医生。"
  },
  "vaccine-care": {
    title: "疫苗接种准备计划",
    meta: "接种前后 2 天",
    goal: "帮助家长准备材料、确认禁忌、观察接种后反应。",
    today: ["确认接种本和预约时间", "记录近期发热和用药情况", "接种后观察 30 分钟再离开"],
    fallback: "如有严重过敏史或正在发热，先和门诊确认。"
  },
  "cold-care": {
    title: "呼吸道护理计划",
    meta: "5天观察 · 轻护理",
    goal: "在安全边界内护理咳嗽流涕，同时识别需要就医的信号。",
    today: ["观察呼吸频率和精神", "少量多次补水", "保持室内舒适湿度"],
    fallback: "出现喘憋、口唇发紫或精神差时及时就医。"
  },
  starter: {
    title: "新手使用计划",
    meta: "3天 · 建立查问题习惯",
    goal: "从常见问题开始，熟悉百科到行动计划的使用路径。",
    today: ["收藏 3 个常见问题", "设置宝宝月龄和健康节点", "开启一个适合当前月龄的计划"],
    fallback: "先从辅食、睡眠或疫苗体检中选择一个最常遇到的问题。"
  }
};

let previousScreen = "home";

const screens = Array.from(document.querySelectorAll(".screen"));
const navButtons = Array.from(document.querySelectorAll(".bottom-nav [data-go]"));
const quickGrid = document.querySelector("#quickGrid");
const categoryList = document.querySelector("#categoryList");
const entryList = document.querySelector("#entryList");
const planList = document.querySelector("#planList");
const detailTitle = document.querySelector("#detailTitle");
const detailBody = document.querySelector("#detailBody");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

function showScreen(name) {
  const active = document.querySelector(".screen.is-active")?.dataset.screen || "home";
  if (name !== "detail") previousScreen = active;
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === name));
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.go === name));
  document.querySelector(`.screen[data-screen="${name}"]`)?.scrollTo({ top: 0 });
}

function openEntry(id) {
  const entry = entries[id] || entries.more;
  detailTitle.textContent = "百科详情";
  detailBody.innerHTML = `
    <article class="detail-block">
      <span class="meta">${entry.meta}</span>
      <h3>${entry.title}</h3>
      <p>${entry.summary}</p>
    </article>
    <article class="detail-block">
      <h3>先看结论</h3>
      <ul>${entry.conclusion.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-block">
      <h3>风险信号</h3>
      <ul>${entry.risk.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="detail-block">
      <h3>相关计划</h3>
      <p>${plans[entry.planId].goal}</p>
      <button class="detail-action" type="button" data-plan="${entry.planId}">查看计划</button>
    </article>
  `;
  showScreen("detail");
}

function openPlan(id) {
  const plan = plans[id] || plans.starter;
  detailTitle.textContent = "行动计划";
  detailBody.innerHTML = `
    <article class="detail-block">
      <span class="meta">${plan.meta}</span>
      <h3>${plan.title}</h3>
      <p>${plan.goal}</p>
    </article>
    <article class="detail-block">
      <h3>今天做一件事</h3>
      <ol>${plan.today.map((item) => `<li>${item}</li>`).join("")}</ol>
    </article>
    <article class="detail-block">
      <h3>如果没做到</h3>
      <p>${plan.fallback}</p>
    </article>
  `;
  showScreen("detail");
}

function render() {
  quickGrid.innerHTML = categories.map((item) => `
    <button class="quick-item" type="button" data-entry="${item.id}">
      <span class="quick-badge">${item.badge}</span>
      <strong>${item.title}</strong>
    </button>
  `).join("");

  categoryList.innerHTML = categories.map((item) => `
    <button class="category-card" type="button" data-entry="${item.id}">
      <strong>${item.title}</strong>
      <p>${item.desc}</p>
    </button>
  `).join("");

  entryList.innerHTML = Object.entries(entries).slice(0, 5).map(([id, item]) => `
    <button class="entry-card" type="button" data-entry="${id}">
      <span class="meta">${item.meta}</span>
      <strong>${item.title}</strong>
      <p>${item.summary}</p>
    </button>
  `).join("");

  planList.innerHTML = Object.entries(plans).filter(([id]) => id !== "starter").map(([id, item]) => `
    <button class="plan-card" type="button" data-plan="${id}">
      <span class="meta">${item.meta}</span>
      <strong>${item.title}</strong>
      <p>${item.goal}</p>
    </button>
  `).join("");
}

document.addEventListener("click", (event) => {
  const go = event.target.closest("[data-go]");
  const entry = event.target.closest("[data-entry]");
  const plan = event.target.closest("[data-plan]");
  const query = event.target.closest("[data-query]");
  const back = event.target.closest("[data-back]");

  if (query) {
    searchInput.value = query.dataset.query;
    openEntry(query.dataset.query.includes("辅食") ? "food" : query.dataset.query.includes("夜醒") ? "sleep" : "fever");
  }

  if (go) showScreen(go.dataset.go);
  if (entry) openEntry(entry.dataset.entry);
  if (plan) openPlan(plan.dataset.plan);
  if (back) showScreen(previousScreen === "detail" ? "home" : previousScreen);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  if (q.includes("辅食")) openEntry("food");
  else if (q.includes("夜醒") || q.includes("睡")) openEntry("sleep");
  else if (q.includes("疫苗") || q.includes("儿保")) openEntry("vaccine");
  else if (q.includes("咳")) openEntry("cough");
  else openEntry("fever");
});

render();
