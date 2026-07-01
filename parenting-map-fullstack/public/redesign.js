const E = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

const domainTone = {
  growth_development: 'green',
  feeding_nutrition: 'amber',
  daily_care: 'mint',
  sleep: 'blue',
  disease_symptom: 'red',
  medication_safety: 'violet',
  vaccine: 'blue',
  early_education: 'yellow',
  mental_health: 'pink',
  safety_first_aid: 'cyan',
  maternal_health: 'rose',
  special_needs: 'gray'
};

const healthDomainIds = new Set([
  'disease_symptom',
  'medication_safety',
  'vaccine',
  'mental_health',
  'safety_first_aid',
  'maternal_health'
]);

const PROFILE_STORAGE_KEY = 'parenting-profile';
const SHOPPING_STORAGE_KEY = 'parenting-shopping-list';
let knowledgeReturnTab = 'encyclopedia';

const vaccineCatalog = [
  { id: 'hep-b-1', month: '出生', title: '乙肝疫苗', dose: '第1剂', date: '2025-10-16', cost: '免费' },
  { id: 'bcg-1', month: '出生', title: '卡介苗', dose: '1剂', date: '2025-10-16', cost: '免费' },
  { id: 'hep-b-2', month: '1月龄', title: '乙肝疫苗', dose: '第2剂', date: '2025-11-16', cost: '免费' },
  { id: 'polio-1', month: '2月龄', title: '脊灰疫苗', dose: '第1剂', date: '2025-12-16', cost: '免费' },
  { id: 'dtap-1', month: '3月龄', title: '百白破疫苗', dose: '第1剂', date: '2026-01-16', cost: '免费' },
  { id: 'polio-2', month: '3月龄', title: '脊灰疫苗', dose: '第2剂', date: '2026-01-16', cost: '免费' },
  { id: 'dtap-2', month: '4月龄', title: '百白破疫苗', dose: '第2剂', date: '2026-02-16', cost: '免费' },
  { id: 'hep-b-3', month: '6月龄', title: '乙肝疫苗', dose: '第3剂', date: '2026-04-16', cost: '免费' },
  { id: 'men-a-1', month: '6月龄', title: 'A群流脑疫苗', dose: '第1剂', date: '2026-04-16', cost: '免费' },
  { id: 'mmr-1', month: '8月龄', title: '麻腮风疫苗', dose: '第1剂', date: '2026-06-16', cost: '免费' },
  { id: 'je-1', month: '8月龄', title: '乙脑疫苗', dose: '第1剂', date: '2026-06-16', cost: '免费' }
];

const defaultSelectedVaccines = ['hep-b-1', 'bcg-1', 'hep-b-2', 'polio-1'];

const domainArticleIds = {
  feeding_nutrition: ['food'],
  disease_symptom: ['fever', 'cough', 'diarrhea', 'rash', 'vomit']
};

const encyclopediaDomainIds = [
  'growth_development',
  'feeding_nutrition',
  'daily_care',
  'sleep'
];

const shoppingCatalog = [
  { id: 'high-chair', title: '餐椅', qty: 1, price: 299, note: '5-6月准备，优先稳定、好清洗、脚踏可调' },
  { id: 'feeding-bowl', title: '辅食碗', qty: 1, price: 39, note: '带吸盘，方便练习自主进食' },
  { id: 'soft-spoon', title: '软勺', qty: 2, price: 16, note: '硅胶小勺，入口温和，备两把轮换' },
  { id: 'bib', title: '围兜/口水巾', qty: 4, price: 12, note: '辅食期和出牙期高频消耗' },
  { id: 'straw-cup', title: '吸管杯', qty: 1, price: 45, note: '6月后练习喝水，选可拆洗结构' },
  { id: 'food-tray', title: '辅食分装盒', qty: 2, price: 28, note: '一次做多份，冷冻分装更省事' },
  { id: 'steamer-basket', title: '蒸篮/小蒸锅', qty: 1, price: 69, note: '蒸南瓜、土豆、胡萝卜比煮更好控水' },
  { id: 'teether', title: '牙胶', qty: 2, price: 25, note: '出牙期缓解咬东西，选一体成型' },
  { id: 'play-mat', title: '爬行垫', qty: 1, price: 159, note: '翻身、坐、爬都要用，厚度和防滑更重要' },
  { id: 'outlet-cover', title: '插座保护盖', qty: 8, price: 3, note: '会爬前先做家里低处安全检查' }
];

const topicDetailCopy = {
  height_weight: {
    summary: '重点看连续趋势，不用因为一次称重或量身高焦虑。',
    bullets: ['每月固定同一时间记录身长、体重。', '看曲线变化，不拿单次数据下结论。', '体重长期不增、身长明显停滞再约儿保评估。']
  },
  gross_motor: {
    summary: '大运动看翻身、坐、爬、站这些阶段动作，核心是给足安全练习机会。',
    bullets: ['每天安排几段清醒趴玩。', '少长时间放躺椅、推车或抱睡。', '动作明显倒退、左右明显不对称时及时咨询。']
  },
  fine_motor: {
    summary: '精细动作主要看抓握、递换手、手眼协调和探索方式。',
    bullets: ['给不同大小和材质的安全玩具。', '观察能不能主动伸手、抓握、换手。', '避免小零件，所有入口物都要防误吞。']
  },
  breastfeeding: {
    summary: '母乳喂养重点看吃奶效率、尿量、体重和妈妈舒适度。',
    bullets: ['尿量和精神状态比单次奶量更有参考价值。', '频繁含乳但吞咽少，要看衔乳和奶阵。', '乳头疼、堵奶反复时尽早调整姿势。']
  },
  formula: {
    summary: '配方奶重点是冲调比例、总奶量和宝宝耐受情况。',
    bullets: ['严格按说明比例冲，不额外加浓。', '换奶粉不要一天内频繁更换。', '持续呕吐、血便或湿疹加重要咨询医生。']
  },
  bathing: {
    summary: '洗澡不是越勤越好，关键是水温、时长和皮肤保湿。',
    bullets: ['水温接近体温，洗澡时间控制在几分钟。', '清水为主，洗护产品少量低频。', '洗后及时擦干褶皱处，再做保湿。']
  },
  umbilical_cord_care: {
    summary: '脐带护理重点是保持干燥、观察渗液和异味。',
    bullets: ['尿布边缘不要反复摩擦脐部。', '少碰少抠，等待自然脱落。', '红肿、流脓、异味或发热要就医。']
  },
  diaper_rash: {
    summary: '红臀多和潮湿、摩擦、清洁刺激有关，先减少刺激源。',
    bullets: ['勤换尿布，便后温水清洁并彻底晾干。', '薄涂隔离霜，不要多种药膏叠加。', '破皮、渗液或反复不好时咨询医生。']
  },
  newborn_sleep: {
    summary: '新生儿睡眠更看安全和昼夜节律，不追求整觉。',
    bullets: ['仰卧睡，床上不放枕头、被子和毛绒物。', '白天有光线和声音，夜间降低刺激。', '吃奶、排气和安抚流程尽量稳定。']
  },
  nap_transition: {
    summary: '并觉通常是阶段变化，不是一天完成的。',
    bullets: ['先观察连续几天小睡时长和入睡难度。', '逐步拉长清醒间隔，不突然砍掉小睡。', '并觉期晚上可适当提前入睡。']
  },
  night_waking: {
    summary: '夜醒先区分饿、热冷、出牙、分离焦虑和作息问题。',
    bullets: ['先看白天小睡是否过多或过少。', '夜间互动保持低刺激，避免越哄越清醒。', '伴随发热、呼吸异常或明显疼痛先排查健康。']
  }
};

const articleSectionLabels = {
  symptom: '症状急查',
  feeding: '喂养营养'
};

function savedProfileQuery() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return '';
    const saved = JSON.parse(raw);
    const params = new URLSearchParams();
    [
      'nickname',
      'birthDate',
      'sex',
      'feedingType',
      'allergies',
      'currentConcerns',
      'currentWeightKg',
      'currentHeightCm',
      'latestCheckupDate',
      'nextNodeDate',
      'nextHealthDate',
      'nextHealthNode'
    ].forEach((key) => {
      const value = saved?.[key];
      if (value !== undefined && value !== null && String(value).trim()) params.set(key, value);
    });
    const query = params.toString();
    return query ? `?${query}` : '';
  } catch {
    return '';
  }
}

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function loadProductData() {
  const query = savedProfileQuery();
  const [appData, growthData, careData] = await Promise.all([
    fetchJson(`/api/app-data${query}`),
    fetchJson(`/api/growth-records${query}`),
    fetchJson(`/api/care-schedule${query}`)
  ]);
  return {
    ...(appData || { domains: [], articles: [] }),
    growth: growthData || null,
    care: careData || null
  };
}

function articleByDomain(articles, domainId) {
  const wanted = domainArticleIds[domainId] || [];
  return wanted.map((id) => articles.find((article) => article.id === id)).filter(Boolean);
}

function articleChip(article, className = 'article-chip-v6') {
  const summary = article.summary || article.subtitle || '先看结论、风险信号和护理要点';
  return `<button class="${className}" type="button" data-entry="${E(article.id)}"><strong>${E(article.title)}</strong><small>${E(summary)}</small></button>`;
}

function getChild(data) {
  return data.child || data.growth?.profile || {};
}

function getGrowthProfile(data) {
  return data.growth?.profile || data.child || {};
}

function getCheckupRecords(data) {
  return data.growth?.records || [];
}

function getVaccineRecords(data) {
  const child = getChild(data);
  const items = data.care?.items || [];
  const done = items.filter((item) => item.type === 'vaccine' && item.ageMonth <= (data.care?.age?.months ?? 0));
  return done.slice(0, Number(child.vaccineDone || child.vaccineCount || done.length || 0));
}

function getSavedProfileObject() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function saveProfilePatch(patch) {
  const next = { ...getSavedProfileObject(), ...patch };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function selectedVaccineIds() {
  const saved = getSavedProfileObject();
  return Array.isArray(saved.selectedVaccineIds) ? saved.selectedVaccineIds : defaultSelectedVaccines;
}

function selectedShoppingIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(SHOPPING_STORAGE_KEY) || 'null');
    return Array.isArray(saved) ? saved : ['high-chair', 'feeding-bowl', 'soft-spoon', 'bib', 'food-tray'];
  } catch {
    return ['high-chair', 'feeding-bowl', 'soft-spoon', 'bib', 'food-tray'];
  }
}

function saveShoppingIds(ids) {
  localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(ids));
}

function shoppingTotal(ids = selectedShoppingIds()) {
  const picked = new Set(ids);
  return shoppingCatalog
    .filter((item) => picked.has(item.id))
    .reduce((total, item) => total + item.qty * item.price, 0);
}

function checkupRows(data) {
  const saved = getSavedProfileObject();
  if (Array.isArray(saved.checkupRecords) && saved.checkupRecords.length) return saved.checkupRecords;
  return (getCheckupRecords(data) || []).map((record) => ({
    ageMonth: record.ageMonth,
    date: record.date,
    weightKg: record.weightKg,
    heightCm: record.heightCm,
    note: record.note || ''
  }));
}

function cleanProductShell() {
  document.body.classList.add('product-ia-v6', 'design-polish-v7', 'no-plan-mode');
  document.querySelector('.domain-system-panel')?.remove();
  document.querySelector('[data-screen="home"] .quick-block')?.remove();
  document.querySelector('[data-screen="home"] .continue-block')?.remove();
  document.querySelector('[data-screen="knowledge"] .plan-bridge')?.remove();
  document.querySelector('[data-screen="plans"]')?.remove();
  document.querySelectorAll('[data-screen="home"] .page-head button, [data-screen="knowledge"] .page-head button, [data-screen="profile"] .page-head button')
    .forEach((button) => button.remove());
}

function rewriteBottomNav() {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  const buttons = Array.from(nav.querySelectorAll('button'));
  const config = [
    { label: '宝宝档案', icon: '档', go: 'home', main: 'archive' },
    { label: '育儿百科', icon: '百', go: 'knowledge', main: 'encyclopedia', tab: 'encyclopedia' },
    { label: '健康守护', icon: '护', go: 'knowledge', main: 'health', tab: 'health' }
  ];

  config.forEach((item, index) => {
    const button = buttons[index];
    if (!button) return;
    button.textContent = item.label;
    button.dataset.navIcon = item.icon;
    button.dataset.go = item.go;
    button.dataset.mainTab = item.main;
    if (item.tab) button.dataset.openKnowledgeTab = item.tab;
    else delete button.dataset.openKnowledgeTab;
  });

  buttons.slice(config.length).forEach((button) => button.remove());
  setMainNavActive('archive');
}

function setMainNavActive(name) {
  document.querySelectorAll('.bottom-nav [data-main-tab]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.mainTab === name);
  });
}

function showScreenSurface(name) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.screen === name);
  });
  document.querySelector(`.screen[data-screen="${name}"]`)?.scrollTo({ top: 0 });
}

function metricCard(label, value, note) {
  return `<article><span>${E(label)}</span><strong>${E(value)}</strong><p>${E(note)}</p></article>`;
}

function replaceHome(data) {
  const home = document.querySelector('[data-screen="home"]');
  if (!home) return;
  const child = getChild(data);
  const growthProfile = getGrowthProfile(data);
  const records = getCheckupRecords(data);
  const latestCheckup = records.at(-1);
  const nextNodeDate = getSavedProfileObject().nextNodeDate || getSavedProfileObject().nextHealthDate || child.nextNode?.date || '2026-07-16';
  const nextNodeTitle = getSavedProfileObject().nextHealthNode || child.nextNode?.title || '10月龄体检';

  const topbar = home.querySelector('.topbar');
  if (topbar) {
    topbar.querySelector('h1').textContent = '宝宝档案';
    topbar.querySelector('p').textContent = '儿保记录 · 接种表 · 查问题';
    const dot = topbar.querySelector('.profile-dot');
    if (dot) {
      dot.textContent = '编';
      dot.setAttribute('aria-label', '编辑宝宝档案');
      dot.dataset.go = 'profile';
    }
    topbar.querySelector('.profile-dot')?.remove();
  }

  const babyStrip = home.querySelector('.baby-strip');
  if (babyStrip) {
    babyStrip.className = 'baby-strip archive-hero-v6';
    babyStrip.innerHTML = `
      <div class="archive-title-v6">
        <span>${E(child.ageLabel || '8个月')}</span>
        <div>
          <p>${E(child.nickname || '宝宝')} · ${E(child.sex || '宝宝')} · ${E(child.feedingType || '')}</p>
          <h2>${E(child.ageLabel || '')}</h2>
        </div>
        <button type="button" data-go="profile">编辑</button>
      </div>
      <div class="archive-metrics-v6">
        ${metricCard('身长', `${growthProfile.currentHeightCm || latestCheckup?.heightCm || 70.5} cm`, latestCheckup ? `最近儿保 ${latestCheckup.date}` : '来自宝宝档案')}
        ${metricCard('体重', `${growthProfile.currentWeightKg || latestCheckup?.weightKg || 8.4} kg`, '看趋势，不看单点')}
        ${metricCard('下次儿保', nextNodeDate, nextNodeTitle)}
      </div>`;
  }

  const answer = home.querySelector('.answer-card');
  if (answer) {
    answer.remove();
  }
}

function domainCard(domain, articles, mode) {
  const related = articleByDomain(articles, domain.id);
  const subdomains = (domain.subdomains || []).slice(0, 3);
  const chips = subdomains.map((sub) => `<span>${E(sub.name)}</span>`).join('');
  const body = related.length
    ? `<div class="domain-article-list-v6">${related.slice(0, 2).map((article) => articleChip(article)).join('')}</div>`
    : `<div class="domain-chip-row-v6">${chips}</div>`;

  return `<article class="domain-panel-v6 domain-tile-v7 tone-${domainTone[domain.id] || 'green'} ${mode === 'health' ? 'is-health' : ''}">
    <header>
      <span>${E(domain.name.slice(0, 1))}</span>
      <div>
        <h3>${E(domain.name)}</h3>
        <p>${E(domain.description || subdomains.map((item) => item.name).join('、'))}</p>
      </div>
    </header>
    ${body}
  </article>`;
}

function healthQuickCards(articles) {
  return ['fever', 'cough', 'diarrhea', 'rash', 'vomit']
    .map((id) => articles.find((article) => article.id === id))
    .filter(Boolean)
    .map((article) => `<button class="health-entry-v6 health-chip-v7" type="button" data-entry="${E(article.id)}"><span>${E(article.title.slice(0, 1))}</span><strong>${E(article.title)}</strong></button>`)
    .join('');
}

function articleGroups(articles) {
  return articles.reduce((groups, article) => {
    const key = article.sectionId || 'other';
    groups[key] ||= [];
    groups[key].push(article);
    return groups;
  }, {});
}

function encyclopediaGroup(sectionId, articles) {
  return `<section class="category-block-v8">
    <h3>${E(articleSectionLabels[sectionId] || '百科条目')}</h3>
    <div>${articles.map((article) => `<button type="button" data-entry="${E(article.id)}">${E(article.title)}</button>`).join('')}</div>
  </section>`;
}

function topicBullets(domainId, topicName, subId) {
  if (topicDetailCopy[subId]?.bullets) return topicDetailCopy[subId].bullets;
  const map = {
    growth_development: ['先按月龄看阶段，不和单个孩子硬比较。', '记录一次身高体重或动作表现，连续看趋势。', '明显倒退、长期停滞或家长不放心时再咨询儿保。'],
    feeding_nutrition: ['先固定一种变量，别同时换奶量、餐具和食材。', '新增食材连续观察 2-3 天，重点看皮疹、呕吐、腹泻。', '吃多少不是唯一目标，吞咽练习和进食体验也很重要。'],
    daily_care: ['先把频率、用品和环境温湿度稳定下来。', '皮肤护理少叠加产品，先做清洁、干燥、隔离。', '出现破溃、渗液、明显疼痛或反复不好时咨询医生。'],
    sleep: ['先看白天小睡、睡前流程和夜醒频率。', '保持固定入睡信号，比临时换方法更重要。', '呼吸异常、持续打鼾或白天精神差要优先排查健康原因。']
  };
  return map[domainId] || [`先了解 ${topicName} 的月龄特点。`, '记录一次真实情况，再决定下一步。', '有风险信号时优先咨询专业人士。'];
}

function topicDetailHtml(domain, sub) {
  const copy = topicDetailCopy[sub.id] || {};
  const bullets = topicBullets(domain.id, sub.name, sub.id);
  const aliases = (sub.aliases || []).slice(0, 3);
  return `
    <article class="detail-block topic-detail-v8">
      <span class="meta">${E(domain.name)} · 知识框架</span>
      <h3>${E(sub.name)}</h3>
      <p>${E(copy.summary || domain.description || `${sub.name} 的月龄重点和日常处理。`)}</p>
    </article>
    <article class="detail-block">
      <h3>先看什么</h3>
      <ul>${bullets.map((item) => `<li>${E(item)}</li>`).join('')}</ul>
    </article>
    <article class="detail-block">
      <h3>常见查法</h3>
      <div class="risk-tags">${aliases.map((item) => `<span>${E(item)}</span>`).join('') || `<span>${E(sub.name)}</span>`}</div>
    </article>`;
}

function encyclopediaFrameworkBlock(domain, articles) {
  const related = articleByDomain(articles, domain.id);
  const maxItems = 3;
  const subdomains = (domain.subdomains || [])
    .filter((sub) => !related.some((article) => String(article.title || '').includes(sub.name)))
    .slice(0, Math.max(0, maxItems - related.length));
  const articleButtons = related
    .map((article) => `<button class="is-live" type="button" data-entry="${E(article.id)}">${E(article.title)}</button>`)
    .join('');
  const frameworkChips = subdomains
    .map((sub) => `<button class="is-topic" type="button" data-topic-detail="${E(`${domain.id}:${sub.id}`)}">${E(sub.name)}</button>`)
    .join('');
  return `<section class="framework-block-v8">
    <h3>${E(domain.name)}</h3>
    <div>${articleButtons}${frameworkChips}</div>
  </section>`;
}

function articleRowsV8(articles) {
  return ['fever', 'cough', 'diarrhea', 'rash', 'vomit', 'food']
    .map((id) => articles.find((article) => article.id === id))
    .filter(Boolean)
    .map((article, index) => `<button class="article-row-v8 tone-${index % 4}" type="button" data-entry="${E(article.id)}">
      <span>${E(article.title.slice(0, 1))}</span>
      <div><strong>${E(article.title)}</strong><p>${E(article.summary || article.subtitle || '先看结论、风险信号和处理建议')}</p></div>
    </button>`)
    .join('');
}

function shoppingListCard() {
  const picked = new Set(selectedShoppingIds());
  return `<section class="shopping-card-v8">
    <div class="shopping-head-v8">
      <div><h3>待买清单</h3><p>辅食期开吃前先算一版预算</p></div>
      <strong>¥${E(shoppingTotal(Array.from(picked)))}</strong>
    </div>
    <div class="shopping-list-v8">
      ${shoppingCatalog.map((item) => `
        <button class="${picked.has(item.id) ? 'is-picked' : ''}" type="button" data-shop-id="${E(item.id)}" aria-pressed="${picked.has(item.id)}">
          <span></span>
          <div><strong>${E(item.title)}</strong><p>${E(item.note)}</p></div>
          <b>${E(item.qty)} × ¥${E(item.price)}</b>
        </button>
      `).join('')}
    </div>
  </section>`;
}

function refreshShoppingCard() {
  const card = document.querySelector('.shopping-card-v8');
  if (!card) return;
  const picked = new Set(selectedShoppingIds());
  card.querySelector('.shopping-head-v8 strong').textContent = `¥${shoppingTotal(Array.from(picked))}`;
  card.querySelectorAll('[data-shop-id]').forEach((button) => {
    const active = picked.has(button.dataset.shopId);
    button.classList.toggle('is-picked', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function openTopicDetail(topicKey, data) {
  const [domainId, subId] = String(topicKey || '').split(':');
  const domain = (data.domains || []).find((item) => item.id === domainId);
  const sub = domain?.subdomains?.find((item) => item.id === subId);
  if (!domain || !sub) return;
  knowledgeReturnTab = 'encyclopedia';
  const title = document.querySelector('#detailTitle');
  const body = document.querySelector('#detailBody');
  if (title) title.textContent = '百科详情';
  if (body) body.innerHTML = topicDetailHtml(domain, sub);
  showScreenSurface('detail');
  setMainNavActive('encyclopedia');
}

function replaceKnowledge(data) {
  const box = document.querySelector('[data-screen="knowledge"] .knowledge-map');
  if (!box) return;
  const articles = data.articles || [];
  const domains = data.domains || [];
  const groups = articleGroups(articles);
  const symptomArticles = groups.symptom || [];
  const frameworkDomains = encyclopediaDomainIds
    .map((id) => domains.find((domain) => domain.id === id))
    .filter(Boolean);

  box.className = 'knowledge-map knowledge-board-v6 knowledge-board-v7';
  box.innerHTML = `
    <section class="knowledge-panel-v6 is-active" data-k-panel="encyclopedia">
      <div class="native-hero-v8">
        <div><h2>分类百科</h2><p>当前知识库共 ${articles.length} 篇，按真实 Markdown 内容展示。</p></div>
      </div>
      <div class="framework-groups-v8">${frameworkDomains.map((domain) => encyclopediaFrameworkBlock(domain, articles)).join('')}</div>
    </section>
    <section class="knowledge-panel-v6" data-k-panel="health">
      <div class="native-hero-v8 is-health">
        <div><h2>健康守护</h2><p>当前健康急查 ${symptomArticles.length} 篇，先看结论和风险信号。</p></div>
      </div>
      <div class="article-list-v8">${articleRowsV8(symptomArticles)}</div>
    </section>`;
  box.querySelector('[data-k-panel="encyclopedia"] .native-hero-v8')?.remove();
  box.querySelector('[data-k-panel="encyclopedia"]')?.insertAdjacentHTML('beforeend', shoppingListCard());
  const encyclopediaHero = box.querySelector('[data-k-panel="encyclopedia"] .native-hero-v8 div');
  if (encyclopediaHero) encyclopediaHero.innerHTML = '<h2>知识框架</h2><p>按育儿主题查，症状急查放在健康守护。</p>';
}

function replaceProfileScreen(data) {
  const profileScreen = document.querySelector('[data-screen="profile"]');
  if (!profileScreen) return;
  profileScreen.querySelector('.page-head h2').textContent = '宝宝档案';
  const panel = profileScreen.querySelector('.profile-panel');
  const child = getChild(data);
  const growthProfile = getGrowthProfile(data);
  const records = checkupRows(data);
  const latest = records.at(-1);
  const picked = selectedVaccineIds();
  const pickedSet = new Set(picked);
  const nextNodeDate = getSavedProfileObject().nextNodeDate || getSavedProfileObject().nextHealthDate || child.nextNode?.date || '2026-07-16';
  const nextNodeTitle = getSavedProfileObject().nextHealthNode || child.nextNode?.title || '10月龄体检';
  const groupedVaccines = vaccineCatalog.reduce((groups, item) => {
    groups[item.month] ||= [];
    groups[item.month].push(item);
    return groups;
  }, {});

  if (panel) {
    panel.className = 'profile-panel profile-panel-v6 archive-profile-v8';
    panel.innerHTML = `
      <div class="profile-overview-v6">
        <div><span>宝宝</span><strong>${E(child.nickname || '宝宝')} · ${E(child.ageLabel || '')}</strong><p>${E(child.sex || '')} · ${E(child.feedingType || '')}</p></div>
        <button class="profile-action" type="button" data-profile-back>返回</button>
      </div>
      <div class="archive-metrics-v6">
        ${metricCard('身长', `${growthProfile.currentHeightCm || latest?.heightCm || 70.5} cm`, latest ? `最近 ${latest.date}` : '最近一次儿保')}
        ${metricCard('体重', `${growthProfile.currentWeightKg || latest?.weightKg || 8.4} kg`, '看趋势，不看单点')}
        ${metricCard('下次儿保', nextNodeDate, nextNodeTitle)}
      </div>
      <section class="checkup-records-v8">
        <div class="profile-section-head-v8">
          <div><span>儿保记录</span><h3>每次儿保记身长体重</h3></div>
        </div>
        <div class="checkup-table-v8">
          ${records.map((record) => `
            <article>
              <span>${E(record.ageMonth)}月龄</span>
              <strong>${E(record.weightKg)}kg · ${E(record.heightCm)}cm</strong>
              <p>${E(record.date)}${record.note ? ` · ${E(record.note)}` : ''}</p>
            </article>
          `).join('')}
        </div>
        <form class="checkup-add-v8" data-checkup-form>
          <label><span>月龄</span><input name="ageMonth" type="number" min="0" inputmode="numeric" value="${E(child.ageLabel || '').match(/\d+/)?.[0] || ''}"></label>
          <label><span>体重 kg</span><input name="weightKg" type="number" step="0.1" inputmode="decimal" value="${E(growthProfile.currentWeightKg || latest?.weightKg || '')}"></label>
          <label><span>身长 cm</span><input name="heightCm" type="number" step="0.1" inputmode="decimal" value="${E(growthProfile.currentHeightCm || latest?.heightCm || '')}"></label>
          <label><span>日期</span><input name="date" type="date" value="${E(latest?.date || '')}"></label>
          <button type="submit">记录本次儿保</button>
        </form>
      </section>
      <section class="vaccine-sheet-v8">
        <div class="profile-section-head-v8">
          <div><span>接种表</span><h3>按疫苗节点自己勾选</h3></div>
          <strong>${picked.length}/${vaccineCatalog.length}</strong>
        </div>
        <div class="vaccine-timeline-v8">
          ${Object.entries(groupedVaccines).map(([month, items]) => `
            <section>
              <h4>${E(month)}</h4>
              <div>
                ${items.map((item) => `
                  <button class="vaccine-row-v8 ${pickedSet.has(item.id) ? 'is-done' : ''}" type="button" data-vaccine-id="${E(item.id)}" aria-pressed="${pickedSet.has(item.id)}">
                    <span></span>
                    <div><strong>${E(item.title)} <small>${E(item.dose)} · ${E(item.cost)}</small></strong><p>建议接种日期：${E(item.date)}</p></div>
                    <b>${pickedSet.has(item.id) ? '已接种' : '未接种'}</b>
                  </button>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>
      </section>`;
  }

  const form = profileScreen.querySelector('#profileForm');
  if (form) {
    form.classList.add('profile-basic-form-v8');
    form.innerHTML = `
      <h3>编辑基础信息</h3>
      <div class="profile-form-grid">
        <label><span>昵称</span><input name="nickname" type="text" autocomplete="off" required value="${E(child.nickname || '')}"></label>
        <label><span>出生日期</span><input name="birthDate" type="date" required value="${E(child.birthDate || '')}"></label>
        <label><span>性别</span><select name="sex">
          ${['男孩', '女孩', '未填写'].map((item) => `<option value="${E(item)}" ${item === child.sex ? 'selected' : ''}>${E(item)}</option>`).join('')}
        </select></label>
        <label><span>喂养方式</span><select name="feedingType">
          ${['母乳', '奶粉', '混合喂养'].map((item) => `<option value="${E(item)}" ${item === child.feedingType ? 'selected' : ''}>${E(item)}</option>`).join('')}
        </select></label>
        <label><span>下次儿保时间</span><input name="nextNodeDate" type="date" value="${E(nextNodeDate)}"></label>
        <label class="is-wide"><span>过敏情况</span><textarea name="allergies" rows="2">${E(Array.isArray(child.allergies) ? child.allergies.join('、') : child.allergies || '暂无')}</textarea></label>
        <label class="is-wide"><span>当前关注</span><textarea name="currentConcerns" rows="2">${E(Array.isArray(child.currentConcerns) ? child.currentConcerns.join('、') : child.currentConcerns || '')}</textarea></label>
      </div>
      <button class="profile-save" type="submit">保存档案</button>`;
  }

  const timeline = profileScreen.querySelector('.timeline-panel');
  if (timeline) {
    timeline.className = 'timeline-panel next-checkup-v8';
    timeline.innerHTML = `
      <h3>下次儿保时间</h3>
      <p>${E(nextNodeTitle)}</p>
      <strong>${E(nextNodeDate)}</strong>`;
  }
}

function setKnowledgeTab(name) {
  const target = name === 'health' || name === 'symptom' ? 'health' : 'encyclopedia';
  knowledgeReturnTab = target;
  const pageTitle = document.querySelector('[data-screen="knowledge"] .page-head h2');
  if (pageTitle) pageTitle.textContent = target === 'health' ? '健康守护' : '知识百科';
  document.querySelectorAll('[data-k-tab]').forEach((tab) => {
    const active = tab.dataset.kTab === target;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-k-panel]').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.kPanel === target);
  });
  setMainNavActive(target);
}

function bindEnhancements() {
  document.addEventListener('click', (event) => {
    const entry = event.target.closest('[data-entry]');
    const entryPanel = entry?.closest('[data-k-panel]');
    if (entryPanel?.dataset.kPanel) knowledgeReturnTab = entryPanel.dataset.kPanel;

    const topic = event.target.closest('[data-topic-detail]');
    if (topic) knowledgeReturnTab = 'encyclopedia';

    const opener = event.target.closest('[data-open-knowledge-tab]');
    if (opener?.dataset.openKnowledgeTab) knowledgeReturnTab = opener.dataset.openKnowledgeTab;

    const back = event.target.closest('[data-back]');
    const detailActive = document.querySelector('[data-screen="detail"]')?.classList.contains('is-active');
    if (back && detailActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showScreenSurface('knowledge');
      setKnowledgeTab(knowledgeReturnTab);
    }
  }, true);

  document.addEventListener('click', (event) => {
    const profileBack = event.target.closest('[data-profile-back]');
    if (profileBack) {
      showScreenSurface('home');
      setMainNavActive('archive');
      return;
    }

    const main = event.target.closest('.bottom-nav [data-main-tab]');
    if (main) window.setTimeout(() => setMainNavActive(main.dataset.mainTab), 0);

    const tab = event.target.closest('[data-k-tab]');
    if (tab) setKnowledgeTab(tab.dataset.kTab);

    const opener = event.target.closest('[data-open-knowledge-tab]');
    if (opener) window.setTimeout(() => setKnowledgeTab(opener.dataset.openKnowledgeTab), 0);

    const topic = event.target.closest('[data-topic-detail]');
    if (topic) {
      openTopicDetail(topic.dataset.topicDetail, data);
      return;
    }

    const shoppingItem = event.target.closest('[data-shop-id]');
    if (shoppingItem) {
      const current = new Set(selectedShoppingIds());
      const id = shoppingItem.dataset.shopId;
      if (current.has(id)) current.delete(id);
      else current.add(id);
      saveShoppingIds(Array.from(current));
      refreshShoppingCard();
      return;
    }

    const vaccine = event.target.closest('[data-vaccine-id]');
    if (vaccine) {
      const current = new Set(selectedVaccineIds());
      const id = vaccine.dataset.vaccineId;
      if (current.has(id)) current.delete(id);
      else current.add(id);
      saveProfilePatch({ selectedVaccineIds: Array.from(current) });
      replaceProfileScreen(data);
    }
  });

  document.addEventListener('submit', (event) => {
    const checkupForm = event.target.closest('[data-checkup-form]');
    if (checkupForm) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const formData = new FormData(checkupForm);
      const record = {
        ageMonth: Number(formData.get('ageMonth') || 0),
        date: String(formData.get('date') || '').trim(),
        weightKg: Number(formData.get('weightKg') || 0),
        heightCm: Number(formData.get('heightCm') || 0),
        note: '本次儿保记录'
      };
      if (record.ageMonth && record.date && record.weightKg && record.heightCm) {
        const records = [...checkupRows(data), record].sort((a, b) => Number(a.ageMonth) - Number(b.ageMonth));
        saveProfilePatch({
          checkupRecords: records,
          currentWeightKg: record.weightKg,
          currentHeightCm: record.heightCm,
          latestCheckupDate: record.date
        });
        replaceProfileScreen(data);
      }
      return;
    }
  }, true);

  const profileForm = document.querySelector('#profileForm');
  profileForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const formData = new FormData(profileForm);
    const nextNodeDate = String(formData.get('nextNodeDate') || '').trim();
    saveProfilePatch({
      nickname: formData.get('nickname'),
      birthDate: formData.get('birthDate'),
      sex: formData.get('sex'),
      feedingType: formData.get('feedingType'),
      allergies: formData.get('allergies'),
      currentConcerns: formData.get('currentConcerns'),
      nextNodeDate,
      nextHealthDate: nextNodeDate,
      nextHealthNode: '下次儿保'
    });
    replaceProfileScreen(data);
  }, true);

  const detailBody = document.querySelector('#detailBody');
  if (detailBody) {
    const hidePlanLinks = () => detailBody.querySelectorAll('[data-plan], .related-plan, .related-detail, .source-block').forEach((node) => node.remove());
    hidePlanLinks();
    new MutationObserver(hidePlanLinks).observe(detailBody, { childList: true, subtree: true });
  }
}

const data = await loadProductData();
if ((data.domains || []).length) {
  cleanProductShell();
  rewriteBottomNav();
  replaceHome(data);
  replaceKnowledge(data);
  replaceProfileScreen(data);
  bindEnhancements();
}
