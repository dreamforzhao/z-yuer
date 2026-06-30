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
  const vaccines = getVaccineRecords(data);
  const articles = data.articles || [];

  const topbar = home.querySelector('.topbar');
  if (topbar) {
    topbar.querySelector('h1').textContent = '宝宝档案';
    topbar.querySelector('p').textContent = '按宝宝状态推荐今天要看什么';
    const dot = topbar.querySelector('.profile-dot');
    if (dot) {
      dot.textContent = '编';
      dot.setAttribute('aria-label', '编辑宝宝档案');
      dot.dataset.go = 'profile';
    }
  }

  const babyStrip = home.querySelector('.baby-strip');
  if (babyStrip) {
    babyStrip.className = 'baby-strip archive-hero-v6';
    babyStrip.innerHTML = `
      <div class="archive-title-v6">
        <span>${E(child.ageLabel || '8个月')}</span>
        <div>
          <p>${E(child.nickname || '宝宝')} · ${E(child.sex || '宝宝')} · ${E(child.feedingType || '')}</p>
          <h2>${E(child.nextNode?.title || '下次儿保')} · ${E(child.nextNode?.date || '')}</h2>
        </div>
        <button type="button" data-go="profile">编辑</button>
      </div>
      <div class="archive-metrics-v6">
        ${metricCard('身长', `${growthProfile.currentHeightCm || latestCheckup?.heightCm || 70.5} cm`, latestCheckup ? `最近儿保 ${latestCheckup.date}` : '来自宝宝档案')}
        ${metricCard('体重', `${growthProfile.currentWeightKg || latestCheckup?.weightKg || 8.4} kg`, '看趋势，不看单点')}
        ${metricCard('儿保', `${records.length || child.checkupDone || 0} 次`, latestCheckup ? `${latestCheckup.ageMonth}月龄已记录` : '待补充记录')}
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

function replaceKnowledge(data) {
  const box = document.querySelector('[data-screen="knowledge"] .knowledge-map');
  if (!box) return;
  const articles = data.articles || [];
  const groups = articleGroups(articles);
  const encyclopediaSections = Object.entries(groups);
  const symptomArticles = groups.symptom || [];

  box.className = 'knowledge-map knowledge-board-v6 knowledge-board-v7';
  box.innerHTML = `
    <section class="knowledge-panel-v6 is-active" data-k-panel="encyclopedia">
      <div class="native-hero-v8">
        <div><h2>分类百科</h2><p>当前知识库共 ${articles.length} 篇，按真实 Markdown 内容展示。</p></div>
      </div>
      <div class="category-groups-v8">${encyclopediaSections.map(([sectionId, items]) => encyclopediaGroup(sectionId, items)).join('')}</div>
    </section>
    <section class="knowledge-panel-v6" data-k-panel="health">
      <div class="native-hero-v8 is-health">
        <div><h2>健康守护</h2><p>当前健康急查 ${symptomArticles.length} 篇，先看结论和风险信号。</p></div>
      </div>
      <div class="article-list-v8">${articleRowsV8(symptomArticles)}</div>
    </section>`;
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
        <button class="profile-action" type="button" data-go="profile">编辑</button>
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
    const main = event.target.closest('.bottom-nav [data-main-tab]');
    if (main) window.setTimeout(() => setMainNavActive(main.dataset.mainTab), 0);

    const tab = event.target.closest('[data-k-tab]');
    if (tab) setKnowledgeTab(tab.dataset.kTab);

    const opener = event.target.closest('[data-open-knowledge-tab]');
    if (opener) window.setTimeout(() => setKnowledgeTab(opener.dataset.openKnowledgeTab), 0);

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
    const hidePlanLinks = () => detailBody.querySelectorAll('[data-plan], .related-plan').forEach((node) => node.remove());
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
