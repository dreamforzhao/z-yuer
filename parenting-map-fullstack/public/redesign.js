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

const domainArticleIds = {
  feeding_nutrition: ['food'],
  disease_symptom: ['fever', 'cough', 'diarrhea', 'rash', 'vomit']
};

function savedProfileQuery() {
  try {
    const raw = localStorage.getItem('parenting-profile');
    if (!raw) return '';
    const saved = JSON.parse(raw);
    const params = new URLSearchParams();
    ['nickname', 'birthDate', 'sex', 'city', 'feedingType', 'allergies', 'currentConcerns', 'vaccineCount', 'checkupCount', 'nextHealthNode'].forEach((key) => {
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

function cleanProductShell() {
  document.body.classList.add('product-ia-v6', 'no-plan-mode');
  document.querySelector('.domain-system-panel')?.remove();
  document.querySelector('[data-screen="home"] .quick-block')?.remove();
  document.querySelector('[data-screen="home"] .continue-block')?.remove();
  document.querySelector('[data-screen="knowledge"] .plan-bridge')?.remove();
  document.querySelector('[data-screen="plans"]')?.remove();
}

function rewriteBottomNav() {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  const buttons = Array.from(nav.querySelectorAll('button'));
  const config = [
    { label: '宝宝档案', go: 'home', main: 'archive' },
    { label: '育儿百科', go: 'knowledge', main: 'encyclopedia', tab: 'encyclopedia' },
    { label: '健康守护', go: 'knowledge', main: 'health', tab: 'health' }
  ];

  config.forEach((item, index) => {
    const button = buttons[index];
    if (!button) return;
    button.textContent = item.label;
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
  const fever = articles.find((article) => article.id === 'fever');
  const food = articles.find((article) => article.id === 'food');
  const cough = articles.find((article) => article.id === 'cough');

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
          <p>${E(child.nickname || '宝宝')} · ${E(child.sex || '宝宝')} · ${E(child.city || '')}</p>
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
    answer.className = 'answer-card recommendation-card-v6';
    answer.innerHTML = `
      <div class="recommend-head-v6">
        <div>
          <span>今日推荐</span>
          <h2>先看这 3 件事</h2>
        </div>
      </div>
      <div class="recommend-list-v6">
        ${food ? `<button type="button" data-entry="${E(food.id)}"><span>百科</span><strong>${E(food.title)}</strong><p>${E(food.summary || food.subtitle)}</p></button>` : ''}
        ${fever ? `<button type="button" data-entry="${E(fever.id)}"><span>健康</span><strong>${E(fever.title)}怎么判断</strong><p>${E(fever.summary || fever.subtitle)}</p></button>` : ''}
        <button type="button" data-open-knowledge-tab="health" data-go="knowledge"><span>节点</span><strong>${E(child.nextNode?.title || '下次健康节点')}</strong><p>${E(child.nextNode?.desc || '准备儿保手册、疫苗记录和近期问题。')}</p></button>
      </div>
      <section class="vaccine-summary-v6">
        <div><span>已接种</span><strong>${vaccines.length || child.vaccineDone || 0}/${child.vaccineTotal || 8}</strong></div>
        <div class="vaccine-chip-row-v6">
          ${(vaccines.length ? vaccines : [{ title: '乙肝疫苗第1剂' }, { title: '卡介苗' }, { title: '乙肝疫苗第2剂' }, { title: '脊灰/百白破节点' }]).slice(0, 4).map((item) => `<span>${E(item.title)}</span>`).join('')}
        </div>
      </section>
      <div class="archive-actions-v6">
        <button type="button" data-open-knowledge-tab="encyclopedia" data-go="knowledge">看育儿百科</button>
        <button type="button" data-open-knowledge-tab="health" data-go="knowledge">进健康守护</button>
        ${cough ? `<button type="button" data-entry="${E(cough.id)}">咳嗽急查</button>` : ''}
      </div>`;
  }
}

function domainCard(domain, articles, mode) {
  const related = articleByDomain(articles, domain.id);
  const subdomains = (domain.subdomains || []).slice(0, 6);
  const body = related.length
    ? `<div class="domain-article-list-v6">${related.map((article) => articleChip(article)).join('')}</div>`
    : `<div class="domain-chip-row-v6">${subdomains.map((sub) => `<span>${E(sub.name)}</span>`).join('')}</div>`;

  return `<article class="domain-panel-v6 tone-${domainTone[domain.id] || 'green'} ${mode === 'health' ? 'is-health' : ''}">
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
    .map((article) => `<button class="health-entry-v6" type="button" data-entry="${E(article.id)}"><span>${E(article.title.slice(0, 1))}</span><div><strong>${E(article.title)}</strong><p>${E(article.summary || article.subtitle)}</p></div><b>›</b></button>`)
    .join('');
}

function replaceKnowledge(data) {
  const box = document.querySelector('[data-screen="knowledge"] .knowledge-map');
  if (!box) return;
  const domains = data.domains || [];
  const articles = data.articles || [];
  const encyclopediaDomains = domains.filter((domain) => !healthDomainIds.has(domain.id));
  const healthDomains = domains.filter((domain) => healthDomainIds.has(domain.id));

  box.className = 'knowledge-map knowledge-board-v6';
  box.innerHTML = `
    <div class="knowledge-switch-v6" role="tablist" aria-label="主知识分类">
      <button class="is-active" type="button" role="tab" aria-selected="true" data-k-tab="encyclopedia">育儿百科</button>
      <button type="button" role="tab" aria-selected="false" data-k-tab="health">健康守护</button>
    </div>
    <section class="knowledge-panel-v6 is-active" data-k-panel="encyclopedia">
      <div class="panel-title-v6"><span>百</span><div><h2>育儿百科</h2><p>生长、喂养、护理、睡眠、早教与特殊需求，适合日常学习和按月龄补知识。</p></div></div>
      <div class="domain-list-v6">${encyclopediaDomains.map((domain) => domainCard(domain, articles, 'encyclopedia')).join('')}</div>
    </section>
    <section class="knowledge-panel-v6" data-k-panel="health">
      <div class="panel-title-v6 is-health"><span>护</span><div><h2>健康守护</h2><p>疾病与症状、用药安全、疫苗、心理健康、安全急救、妈妈健康统一放在这里。</p></div></div>
      <div class="health-quick-v6">
        <h3>症状急查</h3>
        <div class="health-list-v6">${healthQuickCards(articles)}</div>
      </div>
      <div class="domain-list-v6">${healthDomains.map((domain) => domainCard(domain, articles, 'health')).join('')}</div>
    </section>`;
}

function replaceProfileScreen(data) {
  const profileScreen = document.querySelector('[data-screen="profile"]');
  if (!profileScreen) return;
  profileScreen.querySelector('.page-head h2').textContent = '编辑宝宝档案';
  const panel = profileScreen.querySelector('.profile-panel');
  const child = getChild(data);
  const growthProfile = getGrowthProfile(data);
  const records = getCheckupRecords(data);
  const vaccines = getVaccineRecords(data);
  const latest = records.at(-1);

  if (panel) {
    panel.className = 'profile-panel profile-panel-v6';
    panel.innerHTML = `
      <div class="profile-overview-v6">
        <div><span>宝宝</span><strong>${E(child.nickname || '宝宝')} · ${E(child.ageLabel || '')}</strong><p>${E(child.sex || '')} · ${E(child.city || '')} · ${E(child.feedingType || '')}</p></div>
        <button class="profile-action" type="button" data-health="${E(child.nextNode?.id || 'checkup-10m')}">下次节点</button>
      </div>
      <div class="archive-metrics-v6">
        ${metricCard('身长', `${growthProfile.currentHeightCm || latest?.heightCm || 70.5} cm`, '最近一次记录')}
        ${metricCard('体重', `${growthProfile.currentWeightKg || latest?.weightKg || 8.4} kg`, '最近一次记录')}
        ${metricCard('儿保', `${records.length || child.checkupDone || 0} 次`, latest ? `最近 ${latest.date}` : '待补充')}
      </div>
      <section class="vaccine-summary-v6 is-profile"><div><span>已接种疫苗</span><strong>${vaccines.length || child.vaccineDone || 0}/${child.vaccineTotal || 8}</strong></div><div class="vaccine-chip-row-v6">${vaccines.map((item) => `<span>${E(item.title)}</span>`).join('')}</div></section>`;
  }
}

function setKnowledgeTab(name) {
  const target = name === 'health' || name === 'symptom' ? 'health' : 'encyclopedia';
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
  });

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
