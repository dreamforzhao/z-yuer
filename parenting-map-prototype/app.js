const screens = Array.from(document.querySelectorAll(".screen"));
const navButtons = Array.from(document.querySelectorAll("[data-route]"));
const bottomButtons = Array.from(document.querySelectorAll(".bottom-nav [data-route]"));
const searchInput = document.querySelector("#searchInput");
const searchResult = document.querySelector("#searchResult");
const depthButtons = Array.from(document.querySelectorAll(".depth-btn"));
const depthPanels = Array.from(document.querySelectorAll("[data-depth-panel]"));
const birthDateInput = document.querySelector("#birthDate");
const citySelect = document.querySelector("#citySelect");
const ageLine = document.querySelector("#ageLine");
const dailyList = document.querySelector("#dailyList");
const stageCards = document.querySelector("#stageCards");
const sleepAdviceTitle = document.querySelector("#sleepAdviceTitle");
const sleepAdviceList = document.querySelector("#sleepAdviceList");
const vaccineTimeline = document.querySelector("#vaccineTimeline");
const cityBadge = document.querySelector("#cityBadge");

const today = new Date("2026-06-28T00:00:00+08:00");

const stageContent = [
  {
    maxMonth: 6,
    name: "0-6个月",
    tasks: [
      ["喂养", "优先稳定母乳/配方奶节奏，观察尿量、体重和精神状态。"],
      ["睡眠", "安全睡眠优先：仰卧、硬床面、床上不放松软物。"],
      ["用品", "提篮或反向安全座椅提前安装，按说明书固定。"]
    ],
    cards: [
      ["母乳和奶量判断", "尿量、体重、含乳姿势"],
      ["新生儿护理清单", "脐带、黄疸、红屁屁"],
      ["提篮怎么用", "反向安装和安全带高度"]
    ],
    sleep: [
      "白天小睡和夜间睡眠都先保证安全睡眠环境。",
      "睡前流程保持短而稳定，不追求立刻睡整觉。",
      "哭闹先排查饥饿、尿布、胀气、冷热和不适。"
    ]
  },
  {
    maxMonth: 12,
    name: "7-12个月",
    tasks: [
      ["辅食", "练习手指食物，观察吞咽能力和过敏反应。"],
      ["发育", "鼓励爬行、坐稳和精细动作，不强迫站立。"],
      ["安全", "检查餐椅、安全插座、床边高度和小物件误吞风险。"]
    ],
    cards: [
      ["辅食从泥糊到手指食物", "30秒结论 + 图解步骤"],
      ["8个月体检和疫苗提醒", "国家免疫规划 + 本地门诊"],
      ["尿不湿尺码和红屁屁", "按体重、腰围、皮肤状态筛选"]
    ],
    sleep: [
      "先固定入睡时间和睡前流程，再处理夜醒。",
      "夜醒时降低互动强度，避免开强光和长时间逗玩。",
      "分离焦虑期可以增加白天陪伴和睡前安抚物替代。"
    ]
  },
  {
    maxMonth: 24,
    name: "1-2岁",
    tasks: [
      ["吃饭", "建立餐椅进食规则，减少追喂和边玩边吃。"],
      ["语言", "多用短句回应孩子意图，少用考试式提问。"],
      ["出行", "继续使用后向或适龄安全座椅，确认肩带高度。"]
    ],
    cards: [
      ["挑食和自主进食", "餐桌规则和食物暴露"],
      ["走路后的家居安全", "防夹、防撞、防误食"],
      ["尿不湿到拉拉裤", "活动量、腰围、夜用需求"]
    ],
    sleep: [
      "保留午睡，但避免午睡太晚影响夜间入睡。",
      "睡前规则保持一致，减少临睡前剧烈活动。",
      "夜醒反复时复盘白天小睡、晚餐、出牙和分离焦虑。"
    ]
  },
  {
    maxMonth: 36,
    name: "2-3岁",
    tasks: [
      ["行为", "发脾气时先命名情绪，再给两个可选方案。"],
      ["如厕", "观察准备信号，不把如厕训练变成惩罚。"],
      ["教育", "每天 10-15 分钟亲子阅读，重在互动而不是认字。"]
    ],
    cards: [
      ["两岁总说不", "对话模板"],
      ["如厕训练", "准备信号和失败处理"],
      ["绘本和表达", "共读方式比买很多更重要"]
    ],
    sleep: [
      "警惕拖延入睡，睡前边界要少而清楚。",
      "噩梦或怕黑时先共情，再用固定流程回到床上。",
      "不要用恐吓、关门惩罚作为入睡手段。"
    ]
  },
  {
    maxMonth: 72,
    name: "3-5岁",
    tasks: [
      ["入园", "练习表达需求、独立如厕、午睡和分离告别。"],
      ["规则", "用家庭规则卡替代反复说教。"],
      ["安全", "强化过马路、乘车、陌生人和家中电器安全。"]
    ],
    cards: [
      ["入园准备清单", "作息、表达、自理"],
      ["情绪和规则", "少吼叫的回应脚本"],
      ["儿童座椅升级", "身高体重和固定方式"]
    ],
    sleep: [
      "睡前避免长视频和高兴奋游戏。",
      "固定阅读和关灯时间，规则比哄得久更重要。",
      "持续打鼾、憋醒或白天嗜睡需要咨询医生。"
    ]
  }
];

const vaccineNodes = [
  ["出生", "乙肝疫苗第1剂、卡介苗", "建立儿童保健册，记录出生信息。"],
  ["1月龄", "乙肝疫苗第2剂", "同步关注黄疸、体重增长和喂养。"],
  ["2-4月龄", "脊灰、百白破等节点", "以当地接种门诊预约安排为准。"],
  ["6月龄", "乙肝疫苗第3剂、A群流脑等节点", "可同步评估辅食准备和贫血风险。"],
  ["8月龄", "麻腮风/麻疹类、乙脑等节点", "部分地区安排略有差异，接种前确认。"],
  ["12月龄", "1岁儿保评估", "身高体重、牙齿、语言理解、站立行走准备。"],
  ["18月龄", "加强免疫与儿保评估", "关注语言、行为、营养和安全。"],
  ["3岁", "入园前健康管理", "视力、口腔、行为、作息和疫苗查验。"]
];

function showScreen(route) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === route);
  });

  bottomButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });

  const activeScreen = document.querySelector(`.screen[data-screen="${route}"]`);
  if (activeScreen) activeScreen.scrollTop = 0;
}

function calculateAge(birthValue) {
  const birth = new Date(`${birthValue}T00:00:00+08:00`);
  if (Number.isNaN(birth.getTime()) || birth > today) {
    return { months: 0, days: 0, label: "请填写有效出生日期" };
  }

  let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;

  const monthBase = new Date(birth);
  monthBase.setMonth(birth.getMonth() + months);
  const days = Math.max(0, Math.floor((today - monthBase) / 86400000));
  return { months, days, label: `${months}个月${days}天` };
}

function getCurrentStage(months) {
  return stageContent.find((stage) => months <= stage.maxMonth) || stageContent[stageContent.length - 1];
}

function renderDaily(stage) {
  dailyList.innerHTML = stage.tasks.map(([title, body]) => `
    <article class="daily-item">
      <strong>${title}</strong>
      <span>${body}</span>
    </article>
  `).join("");
}

function renderCards(stage) {
  stageCards.innerHTML = stage.cards.map(([title, body], index) => `
    <article class="mini-card" data-route="${index === 1 ? "vaccine" : index === 2 ? "gear" : "detail"}" tabindex="0">
      <img src="${index === 2 ? "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=720&q=80" : "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=720&q=80"}" alt="">
      <h4>${title}</h4>
      <p>${body}</p>
    </article>
  `).join("");

  document.querySelectorAll(".mini-card[data-route]").forEach((card) => {
    card.addEventListener("click", () => showScreen(card.dataset.route));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showScreen(card.dataset.route);
      }
    });
  });
}

function renderSleep(stage, ageLabel) {
  sleepAdviceTitle.textContent = `${ageLabel}哄睡重点`;
  sleepAdviceList.innerHTML = stage.sleep.map((item) => `<li>${item}</li>`).join("");
}

function renderVaccine(months) {
  vaccineTimeline.innerHTML = vaccineNodes.map(([age, title, body]) => {
    const nodeMonth = age === "出生" ? 0 : Number.parseInt(age, 10);
    const stateClass = months > nodeMonth ? "done" : Math.abs(months - nodeMonth) <= 1 ? "current" : "";
    return `
      <li class="${stateClass}">
        <span>${age}</span>
        <div>
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
      </li>
    `;
  }).join("");
}

function updatePersonalizedContent() {
  const age = calculateAge(birthDateInput.value);
  const sex = document.querySelector("input[name='sex']:checked").value;
  const city = citySelect.value;
  const stage = getCurrentStage(age.months);

  ageLine.textContent = `${age.label} · ${sex} · ${city}`;
  cityBadge.textContent = city;
  renderDaily(stage);
  renderCards(stage);
  renderSleep(stage, age.label);
  renderVaccine(age.months);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.route));
});

depthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.depth;
    depthButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    depthPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.depthPanel === target));
  });
});

const suggestions = [
  { keywords: ["座椅", "提篮", "安全座椅", "车"], route: "gear", text: "建议路径：用品与安全 > 儿童安全座椅/提篮。重点看反向安装、固定方式和肩带高度。" },
  { keywords: ["尿不湿", "纸尿裤", "红屁屁", "拉拉裤"], route: "gear", text: "建议路径：用品与安全 > 尿不湿。先按体重、皮肤状态、夜用需求筛选，再看品牌。" },
  { keywords: ["睡", "哄睡", "夜醒", "抱睡"], route: "sleep", text: "建议路径：睡眠与哄睡。按月龄给睡前流程、夜醒处理和转床技巧。" },
  { keywords: ["辅食", "不吃", "吃饭", "过敏"], route: "detail", text: "建议路径：百科 > 喂养营养 > 辅食不爱吃。先看 30 秒结论，再看步骤图解。" },
  { keywords: ["发烧", "发热", "体温", "咳嗽"], route: "encyclopedia", text: "健康问题会先进入风险分级：精神状态、呼吸、脱水、年龄和体温一起判断。" },
  { keywords: ["疫苗", "接种", "儿保", "体检"], route: "vaccine", text: "建议路径：儿保 > 本地城市 > 国家免疫规划 + 社区门诊确认。" }
];

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  if (!value) {
    searchResult.textContent = "";
    return;
  }

  const matched = suggestions.find((item) => item.keywords.some((keyword) => value.includes(keyword)));
  searchResult.innerHTML = matched
    ? `${matched.text} <button type="button" data-route="${matched.route}">打开</button>`
    : "会展示相近主题、权威依据、视频链接和可收藏的记忆卡。";

  const action = searchResult.querySelector("button[data-route]");
  if (action) action.addEventListener("click", () => showScreen(action.dataset.route));
});

[birthDateInput, citySelect, ...document.querySelectorAll("input[name='sex']")].forEach((input) => {
  input.addEventListener("change", updatePersonalizedContent);
});

updatePersonalizedContent();
